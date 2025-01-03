import React from 'react';
import Link from 'next/link';

const GradeItem = ({ grade, year }) => (



    < div className="block" >
        {console.log(grade)}

        <div className="flex flex-col dark:bg-slate-800 bg-slate-300  text-cyan-950 dark:text-cyan-50 p-4 rounded-lg cursor-pointer">
            <div className="flex items-center justify-between">
                <div className="text-xl font-bold capitalize">{grade.className}</div>
                <div className="ml-2">{grade.grade}</div>
            </div>
            <div className="mt-2">
                <div className="text-sm">Students: {grade.numStudents}</div>
                <div className="text-sm">Average Mark: {Math.round(grade.avgMark)}</div>
            </div>
            <div className="bg-blue-800 mt-4 p-4 rounded-lg text-slate-50 cursor-pointer">
                <Link href={`/dashboard/admin/grade/${grade.className}/${year}`}>
                    More Info
                </Link>
            </div>
        </div>
    </div >

);

export default GradeItem;
