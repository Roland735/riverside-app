import { useState } from 'react';
import { format, getMonth, getYear } from 'date-fns';
import TopicCard from './TopicCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MonthSlide = ({ topics }) => {
    const [currentMonth, setCurrentMonth] = useState(getMonth(new Date()));
    const [currentYear, setCurrentYear] = useState(getYear(new Date()));

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const filteredTopics = topics.filter(
        (topic) =>
            getMonth(new Date(topic.date)) === currentMonth &&
            getYear(new Date(topic.date)) === currentYear
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth}>
                    <FiChevronLeft size={24} />
                </button>
                <h2 className="text-lg font-bold">
                    {format(new Date(currentYear, currentMonth), 'MMMM yyyy')}
                </h2>
                <button onClick={handleNextMonth}>
                    <FiChevronRight size={24} />
                </button>
            </div>
            {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                    <TopicCard key={topic._id} topic={topic} />
                ))
            ) : (
                <p>No topics for this month.</p>
            )}
        </div>
    );
};

export default MonthSlide;
