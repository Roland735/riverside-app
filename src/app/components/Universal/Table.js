import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <table className="table-auto w-full">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key || column.name} className="px-4 py-2 text-left text-gray-700 bg-gray-200 border-b border-gray-400">
                            {column.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="border-b border-gray-400">
                        {columns.map((column) => {
                            const value = row[column.accessor || column.key];
                            return (
                                <td key={column.key || column.name} className="px-4 py-2 text-left">
                                    {value}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
