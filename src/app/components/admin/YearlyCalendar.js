import React, { useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

const YearlyCalendar = ({ calendar }) => {
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    const calendarRef = useRef();

    const months = Array.from({ length: 12 }, (_, month) => {
        const start = startOfMonth(new Date(new Date().getFullYear(), month));
        const end = endOfMonth(start);
        const daysInMonth = eachDayOfInterval({ start, end });
        return {
            month: format(start, 'MMMM yyyy'),
            days: daysInMonth,
        };
    });

    const handlePrev = () => {
        setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11));
    };

    const handleNext = () => {
        setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0));
    };

    const currentMonth = months[currentMonthIndex];

    const handleMouseEnter = (e, date, event) => {
        setHoveredDate(date);
        setTooltipContent(event);

        const rect = e.target.getBoundingClientRect();
        const calendarRect = calendarRef.current.getBoundingClientRect();
        setTooltipPosition({
            top: rect.top - calendarRect.top + window.scrollY,
            left: rect.right - calendarRect.left + 15 + window.scrollX,
        });
    };

    const handleMouseLeave = () => {
        setHoveredDate(null);
        setTooltipContent(null);
    };

    const calculateDuration = (event) => {
        if (event && event.startTime && event.endTime) {
            const start = new Date(`1970-01-01T${event.startTime}`);
            const end = new Date(`1970-01-01T${event.endTime}`);
            if (end > start) {
                const hours = end.getHours() - start.getHours();
                const minutes = end.getMinutes() - start.getMinutes();
                return `${hours}h ${minutes}m`;
            }
        }
        return 'Invalid duration';
    };

    return (
        <div ref={calendarRef} className="relative bg-white dark:bg-gray-900 p-4 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrev} className="bg-gray-300 dark:bg-gray-600 p-2 rounded">
                    Prev
                </button>
                <h3 className="text-xl font-semibold">{currentMonth.month}</h3>
                <button onClick={handleNext} className="bg-gray-300 dark:bg-gray-600 p-2 rounded">
                    Next
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div key={idx} className="text-center font-bold dark:text-gray-300">
                        {day}
                    </div>
                ))}

                {Array.from({ length: getDay(currentMonth.days[0]) }).map((_, idx) => (
                    <div key={idx} />
                ))}

                {currentMonth.days.map((date, idx) => {
                    const event = calendar.find(e => format(new Date(e.startDate), 'yyyy-MM-dd') <= format(date, 'yyyy-MM-dd') && format(new Date(e.endDate), 'yyyy-MM-dd') >= format(date, 'yyyy-MM-dd'));
                    return (
                        <div
                            key={idx}
                            className={`relative text-center p-2 rounded ${event ? (event.isFullDay ? 'bg-blue-200 dark:bg-blue-700' : 'bg-yellow-200 dark:bg-yellow-700') : 'bg-gray-100 dark:bg-gray-800'}`}
                            onMouseEnter={(e) => handleMouseEnter(e, date, event)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {format(date, 'd')}
                            {event && <div className="text-xs mt-1 dark:text-gray-300">{event.event}</div>}
                        </div>
                    );
                })}
            </div>

            {hoveredDate && tooltipContent && (
                <div
                    className="absolute z-10 bg-gray-700 text-white text-sm p-3 rounded shadow-lg"
                    style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
                >
                    <div className="font-bold">{format(hoveredDate, 'EEEE, MMMM d, yyyy')}</div>
                    <div className="mt-1">{tooltipContent.event}</div>
                    <div className="mt-1 text-sm">{tooltipContent.description || 'No description available'}</div>
                    <div className={`mt-1 font-semibold ${tooltipContent.isFullDay ? 'text-blue-300' : 'text-yellow-300'}`}>
                        {tooltipContent.isFullDay ? 'Full Day' : 'Half Day'}
                    </div>
                    {tooltipContent.isFullDay === 'Half' && (
                        <>
                            <div className="mt-1 text-sm">{`Start Time: ${tooltipContent.startTime}`}</div>
                            <div className="mt-1 text-sm">{`End Time: ${tooltipContent.endTime}`}</div>
                            <div className="mt-1 text-sm">{`Duration: ${calculateDuration(tooltipContent)}`}</div>
                        </>
                    )}
                    <div className="mt-1 text-sm">{`Start Date: ${format(new Date(tooltipContent.startDate), 'MMMM d, yyyy')}`}</div>
                    <div className="mt-1 text-sm">{`End Date: ${format(new Date(tooltipContent.endDate), 'MMMM d, yyyy')}`}</div>
                </div>
            )}
        </div>
    );
};

export default YearlyCalendar;
