import React, { useState, useEffect } from 'react';
import {
    callElevatorApi,
    openDoorsApi,
    closeDoorsApi
} from '../api/elevatorApi';
import Elevator from './Elevator';
import FloorButtons from './FloorButtons';

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
        const response = await callElevatorApi(floor);
        setStatus(`Elevator called to floor: ${response}`);
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
        const response = await openDoorsApi();
        setStatus(response);
        setDoorOpen(true);
    };

    const closeDoors = async () => {
        const response = await closeDoorsApi();
        setStatus(response);
        setDoorOpen(false);
    };

    const moveElevator = async (floor: number) => {
        const direction = floor > currentFloor ? 1 : -1;
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
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="flex flex-col items-center bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h1 className="text-3xl mb-4 font-semibold text-white">Elevator Control</h1>
                <Elevator doorOpen={doorOpen} />
                <FloorButtons currentFloor={currentFloor} requestQueue={requestQueue} onCallElevator={callElevator} />
                <p className="mt-4 text-center text-gray-400">{status}</p>
                <p className="text-center text-gray-400 mt-2">Current Floor: {currentFloor + 1}</p>
            </div>
        </div>
    );
};

export default ElevatorControl;
