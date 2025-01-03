import React from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { FaCalendarAlt, FaExclamationTriangle, FaEdit, FaTrashAlt } from 'react-icons/fa';

const UpcomingEvents = ({ calendar, onEditEvent, onDeleteEvent }) => {
    const today = new Date();
    const upcomingEvents = calendar.filter(event => isAfter(parseISO(event.startDate), today));
    upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    const handleDelete = async (eventId) => {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await onDeleteEvent(eventId);
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('Failed to delete event');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500 dark:text-blue-400" />
                Upcoming Events
            </h2>
            {upcomingEvents.length > 0 ? (
                <ul className="space-y-4">
                    {upcomingEvents.map((event) => (
                        <li key={event._id} className="flex items-start dark:text-gray-300">
                            <div className={`bg-${event.isFullDay === 'Full' ? 'blue' : event.isFullDay === 'Half' ? 'yellow' : 'gray'}-100 dark:bg-${event.isFullDay === 'Full' ? 'blue' : event.isFullDay === 'Half' ? 'yellow' : 'gray'}-800 text-${event.isFullDay === 'Full' ? 'blue' : event.isFullDay === 'Half' ? 'yellow' : 'gray'}-600 dark:text-${event.isFullDay === 'Full' ? 'blue' : event.isFullDay === 'Half' ? 'yellow' : 'gray'}-400 rounded-full p-2 mr-3`}>
                                <FaExclamationTriangle />
                            </div>
                            <div className="flex-grow">
                                <span className="font-bold">{format(parseISO(event.startDate), 'MMMM d, yyyy')}</span>
                                {event.endDate !== event.startDate && (
                                    <span> - {format(parseISO(event.endDate), 'MMMM d, yyyy')}</span>
                                )}
                                : {event.event}
                                {event.description && <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{event.description}</p>}
                                {event.timeDuration && (
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                        Time: {event.timeDuration}
                                    </p>
                                )}
                                {event.startTime && (
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                        Start Time: {event.startTime}
                                    </p>
                                )}
                                {event.endTime && (
                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                        End Time: {event.endTime}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditEvent(event)}
                                    className="text-blue-500 hover:text-blue-600 focus:outline-none"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="text-red-500 hover:text-red-600 focus:outline-none"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No upcoming events.</p>
            )}
        </div>
    );
};

export default UpcomingEvents;
