import React, { useState, useEffect } from 'react';

const CalendarForm = ({ onAddEvent, editingEvent, onUpdateEvent, onCancelEdit }) => {
    const [startDate, setStartDate] = useState(editingEvent ? editingEvent.startDate : '');
    const [endDate, setEndDate] = useState(editingEvent ? editingEvent.endDate : '');
    const [event, setEvent] = useState(editingEvent ? editingEvent.event : '');
    const [isFullDay, setIsFullDay] = useState(editingEvent ? editingEvent.isFullDay : 'Full');
    const [startTime, setStartTime] = useState(editingEvent ? editingEvent.startTime : '');
    const [endTime, setEndTime] = useState(editingEvent ? editingEvent.endTime : '');
    const [timeDuration, setTimeDuration] = useState(editingEvent ? editingEvent.timeDuration : '');
    const [description, setDescription] = useState(editingEvent ? editingEvent.description : '');
    const [error, setError] = useState('');

    const calculateTimeDuration = () => {
        if (startTime && endTime) {
            const start = new Date(`1970-01-01T${startTime}`);
            const end = new Date(`1970-01-01T${endTime}`);
            if (end > start) {
                const hours = end.getHours() - start.getHours();
                const minutes = end.getMinutes() - start.getMinutes();
                const formattedDuration = `${hours}h ${minutes}m`;
                setTimeDuration(formattedDuration);
                setError('');
            } else {
                setTimeDuration('Invalid duration');
                setError('End time must be after start time.');
            }
        } else {
            setTimeDuration('');
            setError('');
        }
    };

    useEffect(() => {
        if (isFullDay === 'Half') {
            calculateTimeDuration();
        } else {
            setTimeDuration('');
            setError('');
        }
    }, [startTime, endTime, isFullDay]);

    useEffect(() => {
        if (editingEvent) {
            setStartDate(editingEvent.startDate);
            setEndDate(editingEvent.endDate);
            setEvent(editingEvent.event);
            setIsFullDay(editingEvent.isFullDay);
            setStartTime(editingEvent.startTime);
            setEndTime(editingEvent.endTime);
            setTimeDuration(editingEvent.timeDuration);
            setDescription(editingEvent.description);
        }
    }, [editingEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (startDate && endDate && event) {
            if (isFullDay === 'Half' && !timeDuration) {
                setError('Please enter a valid time duration.');
                return;
            }
            if (isFullDay === 'Half' && startTime && endTime) {
                const start = new Date(`1970-01-01T${startTime}`);
                const end = new Date(`1970-01-01T${endTime}`);
                if (end > start) {
                    const newEvent = { startDate, endDate, event, isFullDay, timeDuration, startTime, endTime, description };

                    try {
                        if (editingEvent) {
                            // Update existing event
                            const response = await fetch(`/api/updateEvents/${editingEvent._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newEvent),
                            });
                            const updatedEvent = await response.json();
                            if (response.ok) {
                                onUpdateEvent(updatedEvent);
                            } else {
                                setError(updatedEvent.error || 'Error updating event');
                            }
                        } else {
                            // Add new event
                            const response = await fetch('/api/updateEvents', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newEvent),
                            });
                            const createdEvent = await response.json();
                            if (response.ok) {
                                onAddEvent(createdEvent);
                            } else {
                                setError(createdEvent.error || 'Error adding event');
                            }
                        }
                        resetForm();
                        setError('');
                    } catch (err) {
                        setError('Error communicating with server');
                    }
                } else {
                    setError('End time must be after start time.');
                }
            } else {
                const newEvent = { startDate, endDate, event, isFullDay, startTime, endTime, description };

                try {
                    if (editingEvent) {
                        // Update existing event
                        const response = await fetch(`/api/updateEvents/${editingEvent._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newEvent),
                        });
                        const updatedEvent = await response.json();
                        if (response.ok) {
                            onUpdateEvent(updatedEvent);
                        } else {
                            setError(updatedEvent.error || 'Error updating event');
                        }
                    } else {
                        // Add new event
                        const response = await fetch('/api/updateEvents', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(newEvent),
                        });
                        const createdEvent = await response.json();
                        if (response.ok) {
                            onAddEvent(createdEvent);
                        } else {
                            setError(createdEvent.error || 'Error adding event');
                        }
                    }
                    resetForm();
                    setError('');
                } catch (err) {
                    setError('Error communicating with server');
                }
            }
        } else {
            setError('Please fill in all required fields.');
        }
    };

    const resetForm = () => {
        setStartDate('');
        setEndDate('');
        setEvent('');
        setIsFullDay('Full');
        setStartTime('');
        setEndTime('');
        setTimeDuration('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>

            {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Event</label>
                <input
                    type="text"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Full Day or Half Day</label>
                <select
                    value={isFullDay}
                    onChange={(e) => setIsFullDay(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Full">Full Day</option>
                    <option value="Half">Half Day</option>
                    <option value="No Lessons">No Lessons</option>
                </select>
            </div>

            {isFullDay === 'Half' && (
                <>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {timeDuration && (
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Time Duration</label>
                            <input
                                type="text"
                                value={timeDuration}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </div>
                    )}
                </>
            )}

            <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md dark:bg-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
                <button
                    type="button"
                    onClick={onCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md dark:bg-gray-600 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CalendarForm;
