// ClassCard.js
import React from 'react';

const ClassCard = ({ className, progress }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{className}</h3>
            {progress ? (
                <div>
                    <p>Progress: {progress}%</p>
                    <p>{progress >= 80 ? 'On track' : 'Not on track'}</p>
                </div>
            ) : (
                <p>No progress data available</p>
            )}
        </div>
    );
};

export default ClassCard;
