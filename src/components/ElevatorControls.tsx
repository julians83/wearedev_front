import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ElevatorControl: React.FC = () => {
    const [status, setStatus] = useState('');
    const [currentFloor, setCurrentFloor] = useState(0);
    const [doorOpen, setDoorOpen] = useState(false);
    const [requestQueue, setRequestQueue] = useState<number[]>([]);

    useEffect(() => {
        if (doorOpen) {
            const timer = setTimeout(async () => {
                await closeDoors();
                if (requestQueue.length > 0) {
                    const nextFloor = requestQueue[0];
                    await moveElevator(nextFloor);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [doorOpen, requestQueue]);

    const callElevator = async (floor: number) => {
        const response = await axios.post('http://localhost:3001/elevator/call', { floor });
        setStatus(`Elevator called to floor: ${response.data}`);

        setRequestQueue((prevQueue) => {
            if (!prevQueue.includes(floor)) {
                return [...prevQueue, floor];
            }
            return prevQueue;
        });

        if (!doorOpen) {
            setDoorOpen(true);
        }
    };

    const openDoors = async () => {
        const response = await axios.post('http://localhost:3001/elevator/open-doors');
        setStatus(response.data);
        setDoorOpen(true);
    };

    const closeDoors = async () => {
        const response = await axios.post('http://localhost:3001/elevator/close-doors');
        setStatus(response.data);
        setDoorOpen(false);
    };

    const moveElevator = async (floor: number) => {
        const direction = floor > currentFloor ? 1 : -1;

        // Recorre los pisos
        for (let i = currentFloor; i !== floor; i += direction) {
            setStatus(`Moving to floor ${i + 1}`);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (requestQueue.includes(i)) {
                setRequestQueue((prevQueue) => prevQueue.filter(f => f !== i));
            }
            setCurrentFloor(i + direction);
        }

        setStatus(`Arrived at floor ${floor + 1}`);
        await openDoors();
        
        if (floor === 0 || floor === 4) {
            setRequestQueue([]);
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg w-96">
            <h1 className="text-2xl mb-4 font-bold">Elevator Control</h1>
            <div className="bg-gray-300 h-32 w-32 flex items-end justify-center border-2 border-gray-500 rounded">
                <div className={`bg-blue-500 h-20 w-20 flex items-center justify-center transition-transform duration-500 ${doorOpen ? 'transform scale-y-0' : ''}`}>
                    <span className="text-white font-bold text-lg">Elevator</span>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-lg mb-2">Select Floor:</h2>
                <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4].map((floor) => (
                        <button
                            key={floor}
                            onClick={() => callElevator(floor)}
                            className={`p-2 rounded ${currentFloor === floor ? 'bg-green-500' : requestQueue.includes(floor) ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                        >
                            {floor + 1}
                        </button>
                    ))}
                </div>
            </div>

            <p className="mt-4 text-center">{status}</p>
            <p className="text-center mt-2">Current Floor: {currentFloor + 1}</p>
        </div>
    );
};

export default ElevatorControl;
