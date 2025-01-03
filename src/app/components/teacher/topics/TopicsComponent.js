import React from 'react';

const topicsData = [
    { id: 1, title: 'Introduction to JavaScript', completed: true },
    { id: 2, title: 'Arrays and Loops', completed: true },
    { id: 3, title: 'Functions', completed: false },
    { id: 4, title: 'Objects and Classes', completed: false },
    { id: 5, title: 'API Integration', completed: false },
];

const TopicsComponent = () => {
    const completedTopics = topicsData.filter(topic => topic.completed);
    const upcomingTopics = topicsData.filter(topic => !topic.completed);

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">Completed Topics</h2>
            </div>
            <ul className="space-y-4">
                {completedTopics.map(topic => (
                    <li key={topic.id} className="bg-green-200 rounded-md p-4">
                        {topic.title}
                    </li>
                ))}
            </ul>

            <div className="mt-8 flex justify-between items-center mb-4">
                <h2 className="text-xl my-8 font-semibold border-b-2 border-cyan-700 text-cyan-900 dark:text-cyan-50">Topics to be Completed</h2>
            </div>
            <ul className="space-y-4">
                {upcomingTopics.map(topic => (
                    <li key={topic.id} className="bg-yellow-200 rounded-md p-4">
                        {topic.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopicsComponent;
