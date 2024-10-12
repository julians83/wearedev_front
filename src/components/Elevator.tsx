import React from 'react';

interface ElevatorProps {
    doorOpen: boolean;
}

const Elevator: React.FC<ElevatorProps> = ({ doorOpen }) => {
    return (
        <div className="bg-gray-700 h-32 w-32 flex items-end justify-center border-2 border-gray-600 rounded">
            <div className={`bg-gray-600 h-20 w-20 flex items-center justify-center transition-transform duration-500 ${doorOpen ? 'transform scale-y-0' : ''}`}>
                <span className="text-white font-bold text-lg">Elevator</span>
            </div>
        </div>
    );
};

export default Elevator;
