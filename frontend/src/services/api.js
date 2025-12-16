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
        const response = await api.get('/api/insights');
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const getScheduleSlots = async () => {
    try {
        const response = await api.get('/api/schedule/slots');
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const bookAppointment = async (bookingData) => {
    try {
        const response = await api.post('/api/schedule/book', bookingData);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const analyzeFailure = async (data) => {
    try {
        const response = await api.post('/analyze_failure', data);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export default api;
