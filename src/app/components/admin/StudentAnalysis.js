import React from 'react';
import Card from './Card'; // Assuming you have a Card component

const StudentAnalysis = ({ category }) => {
    console.log(category);



    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">


            {category.map((student, index) => (
                <Card
                    student={student.student}
                    key={index}
                    icon={student.icon}
                    name={student.name}
                    score={student.score}
                    title={student.title}
                    improvement={student.improvement}
                    type={student.type}
                />
            ))}
        </div>
    );
};

export default StudentAnalysis;
