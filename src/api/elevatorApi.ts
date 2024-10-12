import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1/elevator';

export const callElevatorApi = async (floor: number) => {
    const response = await axios.post(`${API_URL}/call`, { floor });
    return response.data;
};

export const openDoorsApi = async () => {
    const response = await axios.post(`${API_URL}/open-doors`);
    return response.data;
};

export const closeDoorsApi = async () => {
    const response = await axios.post(`${API_URL}/close-doors`);
    return response.data;
};
