import { motion } from 'framer-motion';

const Card = ({ title, icon: Icon, value }) => (
    <motion.div
        className="bg-white dark:bg-cyan-950 shadow-lg rounded-lg p-6 m-4 flex flex-col items-center transition-transform transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
    >
        <Icon className="text-4xl mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-50">{title}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-50">{Math.round(value)}%</p>
    </motion.div>
);

export default Card;