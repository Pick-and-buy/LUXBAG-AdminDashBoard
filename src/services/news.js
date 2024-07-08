import axiosInstance from '../utils/axios-customize';
import axios from 'axios';

export const callFetchListNews = async () => {
    try {
        const response = await axiosInstance.get('/news');
        return response.data;
    } catch (error) {
        console.error('Error fetching news data:', error);
        throw error;
    }
};

export const callCreateNews = async (formData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post('http://localhost:8080/api/v1/news', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error create news data:', error);
        throw error;
    }
};


export const getNewsByNewsId = async (id) => {
    try {
        const response = await axiosInstance.get(`/news/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error Get News By News Id:', error);
        throw error;
    }
}

export const callDeleteNews = async (query) => {
    try {
        const response = await axiosInstance.delete(`/news?${query}`);
        return response;
    } catch (error) {
        console.error('Error Delete News:', error);
        throw error;
    }
}

export const callUpdateNews = async (query, formData) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(`http://localhost:8080/api/v1/news?${query}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Update News:', error);
        throw error;
    }
}


