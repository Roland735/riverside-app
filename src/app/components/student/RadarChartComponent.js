// components/RadarChartComponent.js
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const RadarChartComponent = ({ title, data, dataKey }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                    <Tooltip />
                    <Radar name="Mark" dataKey={dataKey} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChartComponent;
