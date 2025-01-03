import React from 'react';
import GradeItem from './GradeItem';
import ClassItem from './ClassItem';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YearlyGrades = ({ data }) => {
    console.log(data);

    if (!data || Object.keys(data).length === 0) {
        return <div>No data available</div>;
    }

    const sortedYears = Object.keys(data).sort((a, b) => parseInt(b) - parseInt(a));

    return (
        <div className="mt-8">
            {sortedYears.map((year) => {
                const yearData = data[year];
                if (!yearData || !yearData.classes) return null;

                const flattenedClasses = yearData.classes.flatMap(gradeClass =>
                    gradeClass.classes.map(classData => ({
                        ...classData,
                        gradeName: gradeClass.gradeName
                    }))
                );

                return (
                    <div key={year} className="mb-8 dark:bg-slate-700 bg-slate-50 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">{`Form ${year} Classes`}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {yearData.grades.map((grade) => (


                                < GradeItem key={grade.gradeName} grade={grade} year={year} />
                            ))}
                        </div>
                        <div className="mt-8">
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={flattenedClasses}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="class" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="mark" fill="#8884d8" />
                                    <Bar dataKey="cambridgeGrade" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6">
                            {yearData.classes.map((gradeClass) => (
                                <div key={gradeClass.gradeName} className="mb-6">
                                    {console.log(gradeClass)
                                    }
                                    <h3 className="text-xl font-bold mb-2 text-slate-950 dark:text-slate-300 capitalize">{gradeClass.className}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {gradeClass.classes.map((classData, index) => (
                                            <ClassItem key={index} classData={classData} year={year} grade={gradeClass.gradeName} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};



export default YearlyGrades;
