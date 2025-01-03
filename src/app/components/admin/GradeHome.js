// pages/grade-analysis.js

import GradeAnalysis from './GradeAnalysis';
const mockData = {
    gradeName: 'grade 1',
    classes: [
        {
            class: 'Class A',
            subjects: [
                { subject: 'Maths', mark: 72 },
                { subject: 'English', mark: 68 },
                { subject: 'Science', mark: 74 },
            ],
            cambridgeGrade: 'C+',
            markChange: '0',
            attendance: '78%',
            teachers: ['Mr. King', 'Ms. Scott'],
        },
        {
            class: 'Class B',
            subjects: [
                { subject: 'Maths', mark: 82 },
                { subject: 'English', mark: 78 },
                { subject: 'Science', mark: 80 },
            ],
            cambridgeGrade: 'B',
            markChange: '2',
            attendance: '85%',
            teachers: ['Mr. Hughes', 'Mrs. Garcia'],
        },
        {
            class: 'Class C',
            subjects: [
                { subject: 'Maths', mark: 74 },
                { subject: 'English', mark: 70 },
                { subject: 'Science', mark: 76 },
            ],
            cambridgeGrade: 'C',
            markChange: '-1',
            attendance: '80%',
            teachers: ['Dr. White', 'Ms. Taylor'],
        },
    ],
};


const GradeAnalysisPage = () => {
    const { gradeName, classes } = mockData;

    return (
        <div className="container mx-auto p-4 w-full">
            <h1 className="text-3xl font-bold  mb-8 capitalize text-cyan-950 dark:text-cyan-50">{gradeName} Analysis</h1>
            <div className="grid grid-cols-1 gap-4 w-full ">
                <GradeAnalysis gradeName={gradeName} classes={classes} />
            </div>
        </div>
    );
};

export default GradeAnalysisPage;
