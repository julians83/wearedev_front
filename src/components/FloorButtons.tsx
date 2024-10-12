// FloorButtons.tsx
import React from 'react';

interface FloorButtonsProps {
    currentFloor: number;
    requestQueue: number[];
    onCallElevator: (floor: number) => void;
}

const FloorButtons: React.FC<FloorButtonsProps> = ({ currentFloor, requestQueue, onCallElevator }) => {
    return (
        <div className="mt-4">
            <h2 className="text-lg mb-2 font-medium text-white">Select Floor:</h2>
            <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2, 3, 4].map((floor) => (
                    <button
                        key={floor}
                        onClick={() => onCallElevator(floor)}
                        className={`p-3 rounded-lg transition duration-300 ${currentFloor === floor ? 'bg-green-500' : requestQueue.includes(floor) ? 'bg-red-500' : 'bg-gray-600'} text-white hover:shadow-lg`}
                    >
                        {floor + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FloorButtons;
