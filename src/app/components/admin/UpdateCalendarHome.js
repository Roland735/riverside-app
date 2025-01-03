import React, { useState, useEffect } from 'react';
import CalendarForm from './CalendarForm';
import YearlyCalendar from './YearlyCalendar';
import UpcomingEvents from './UpcomingEvents';

const CalendarPage = () => {
    const [calendar, setCalendar] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCalendarEvents();
    }, []);

    const fetchCalendarEvents = async () => {
        try {
            const response = await fetch('/api/events');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCalendar(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = (newEvent) => {
        setCalendar([...calendar, newEvent]);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`/api/updateEvents/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error deleting event');
            }

            // Remove the deleted event from local state
            setCalendar(calendar.filter(event => event._id !== eventId));
            alert('Event deleted successfully');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const handleUpdateEvent = (updatedEvent) => {
        setCalendar(calendar.map(event =>
            event._id === updatedEvent._id
                ? updatedEvent
                : event
        ));
        setEditingEvent(null);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-6 dark:bg-gray-800 dark:text-white">
            <h2 className="text-xl font-semibold mt-6 mb-2">Yearly Calendar Preview</h2>
            <YearlyCalendar calendar={calendar} />
            <h2 className="text-xl font-semibold mt-6 mb-2">Upcoming Events</h2>
            <UpcomingEvents
                calendar={calendar}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
            />

            <h1 className="text-2xl font-bold mb-4">Update School Calendar</h1>
            <CalendarForm
                onAddEvent={handleAddEvent}
                editingEvent={editingEvent}
                onUpdateEvent={handleUpdateEvent}
                onCancelEdit={() => setEditingEvent(null)}
            />


        </div>
    );
};

export default CalendarPage;
