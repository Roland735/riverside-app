import { MdCheckCircle, MdCancel } from 'react-icons/md';

const TopicCard = ({ topic }) => {


    return (
        <div className="bg-white p-4 mb-4 rounded-md shadow-md">
            <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
            <p>Date: {new Date(topic.date).toLocaleDateString()}</p>
            <p>Assignment Average: {Math.round(topic.assignmentAverage)}%</p>
            <p>Test Average: {Math.round(topic.testAverage)}%</p>
            <div className="flex items-center">
                <p className="mr-2">Completed: </p>
                {topic.completed ? (
                    <MdCheckCircle className="text-green-500" size={24} />
                ) : (
                    <MdCancel className="text-red-500" size={24} />
                )}
            </div>
        </div>
    );
};

export default TopicCard;
