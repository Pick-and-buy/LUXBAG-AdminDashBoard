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
        // console.log('>> check log formData: ', formData.getAll('request'));
         const token = localStorage.getItem('accessToken');
        // const response = await axios.post('http://localhost:8080/api/v1/news', {
        //     headers: {
        //         // 'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     data: formData,
        // });
        const response = await fetch('http://localhost:8080/api/v1/news', formData, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            // body: formData,
        });
        return response;
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
        const response = await axiosInstance.put(`/news?${query}`, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        });
        return response.data;
    } catch (error) {
        console.error('Error Update News:', error);
        throw error;
    }
}


