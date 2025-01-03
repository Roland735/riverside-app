// CalendarComponent.js
import React from 'react';
import Slider from 'react-slick';
import { MdCheckCircle } from 'react-icons/md'; // Importing the green tick icon
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} dark:bg-cyan-50 bg-slate-900  rounded-full hover:bg-cyan-600 `}
            style={{ ...style, display: "block", background: "blue" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} dark:bg-slate-900  rounded-full hover:bg-cyan-600 `}
            style={{ ...style, display: "block", background: "blue" }}
            onClick={onClick}
        />
    );
}

const CalendarComponent = ({ startDate, learningPeriod, topics }) => {
    // Calculate weeks based on start date and learning period
    const weeks = [];
    const numWeeks = Math.ceil(learningPeriod / 7);
    for (let i = 0; i < numWeeks; i++) {
        const startOfWeek = new Date(startDate);
        startOfWeek.setDate(startOfWeek.getDate() + i * 7);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        weeks.push({ start: startOfWeek, end: endOfWeek });
    }

    // Group weeks by month
    const groupedWeeks = weeks.reduce((acc, week) => {
        const monthKey = week.start.toLocaleString('default', { month: 'long' });
        if (!acc[monthKey]) {
            acc[monthKey] = [];
        }
        acc[monthKey].push(week);
        return acc;
    }, {});

    // Helper function to determine pass/fail status based on averages
    const getPassFailStatus = (average) => {
        return average >= 60 ? 'Pass' : 'Fail';
    };
    // Helper function to check if a date is within a week
    const isInWeek = (date, week) => {
        return date >= week.start && date <= week.end;
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    // Render calendar with shaded weeks and topics
    return (
        <Slider {...settings}>
            {Object.entries(groupedWeeks).map(([month, monthWeeks], index) => (
                <div key={index} className="month mb-8 my-4">
                    <h2 className="text-2xl font-semibold mb-4 dark:text-cyan-50 text-cyan-900">{month}</h2>
                    {monthWeeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="week bg-gray-200 rounded py-4 px-2 mb-4">
                            <h3 className="text-lg font-semibold mb-2">Week {weekIndex + 1}</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className=''>
                                        <th className="text-left w-1/6">Day</th>
                                        <th className="text-left w-1/6">Topics</th>
                                        <th className="text-left w-1/6">Completed</th>
                                        <th className="text-left w-1/6">Assignment Avg.</th>
                                        <th className="text-left w-1/6">Test Avg.</th>
                                        <th className="text-left w-1/6">Pass/Fail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(7)].map((_, dayIndex) => {
                                        const currentDate = new Date(week.start);
                                        currentDate.setDate(currentDate.getDate() + dayIndex);
                                        const topic = topics.find((topic) => isInWeek(topic.date, week));
                                        return (
                                            <tr key={dayIndex} className='border-b-2 border-cyan-900 my-6'>
                                                <td className="w-1/6 ">{currentDate.toLocaleDateString()}</td>
                                                <td className="w-1/6">{topic ? topic.title : '-'}</td>
                                                <td className="w-1/6">{topic && topic.completed ? <MdCheckCircle color="green" size={20} /> : '-'}</td>
                                                <td className="w-1/6">{topic ? topic.assignmentAverage : '-'}</td>
                                                <td className="w-1/6">{topic ? topic.testAverage : '-'}</td>
                                                <td className="w-1/6">{topic ? <span style={{ color: topic.passed ? 'green' : 'red' }}>{getPassFailStatus(topic.testAverage)}</span> : '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ))}
        </Slider>
    );
};

export default CalendarComponent;
