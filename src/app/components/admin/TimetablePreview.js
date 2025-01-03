// pages/TimetablePreview.jsx
import React from 'react';

const TimetablePreview = ({ timetable }) => {
    return (
        <div className="bg-gray-100 p-4 rounded shadow-md">
            {timetable.map((entry, index) => (
                <div key={index} className="mb-2">
                    <span className="font-semibold">{entry.day}</span> - {entry.subject} ({entry.time})
                </div>
            ))}
        </div>
    );
};

export default TimetablePreview;
