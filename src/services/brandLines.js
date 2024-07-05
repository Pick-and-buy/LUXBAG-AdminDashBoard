import axiosInstance from '../utils/axios-customize';
import axios from 'axios';

export const callFetchListBrandLines = async () => {
    try {
        const response = await axiosInstance.get('/brand-lines');
        return response.data;
    } catch (error) {
        console.error('Error fetching brand-lines data:', error);
        throw error;
    }
};

export const callCreateBrandLines = async (formData) => {
    try {
        // console.log('>> check log formData: ', formData.getAll('request'));
        const token = localStorage.getItem('accessToken');
        const response = await axios.post('http://localhost:8080/api/v1/brand-lines', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            data: formData,
        });
        return response;
    } catch (error) {
        console.error('Error create brand-lines data:', error);
        throw error;
    }
};

export const getAllBrandLinesByName = async (query) => {
    try {
        const response = await axiosInstance.get(`brand-lines/line-name?${query}`);
        return response.data.result;
    } catch (error) {
        console.error('Error Get All Brand-Lines By Name:', error);
        throw error;
    }
}

export const getBrandLineByBrandName = async (query) => {
    try {
        const response = await axiosInstance.get(`brand-lines/brand-name?${query}`);
        return response.data.result;
    } catch (error) {
        console.error('Error Brand-Line By Brand Name:', error);
        throw error;
    }
}

export const callDeleteBrandLines = async (query) => {
    try {
        const response = await axiosInstance.delete(`/brand-lines?${query}`);
        return response;
    } catch (error) {
        console.error('Error Delete brand-lines:', error);
        throw error;
    }
}

export const callUpdateBrandLines = async (query, objectForm) => {
    try {
        const response = await axiosInstance.put(`/brand-lines?${query}`,  objectForm );
        return response.data;
    } catch (error) {
        console.error('Error update brand-lines:', error);
        throw error;
    }
}


