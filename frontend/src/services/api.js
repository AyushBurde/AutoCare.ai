import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const predictFailure = async (data) => {
    try {
        const response = await api.post('/predict', data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getInsights = async () => {
    try {
        const response = await api.get('/insights');
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export default api;
