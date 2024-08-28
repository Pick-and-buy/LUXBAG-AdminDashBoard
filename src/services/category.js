import axiosInstance from '../utils/axios-customize';

export const callFetchListCategories = async () => {
    try {
        const response = await axiosInstance.get('/brand-lines/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching Category data:', error);
        throw error;
    }
};

export const callCreateCategory = async (objectForm) => {
    try {
        const response = await axiosInstance.post('/brand-lines/categories',  objectForm);
        return response.data;
    } catch (error) {
        console.error('Error create Category data:', error);
        throw error;
    }
};

export const getAllCategoriesByName = async (query) => {
    try {
        const response = await axiosInstance.get(`/brand-lines/categories/category-name?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error Get All Categories By Name:', error);
        throw error;
    }
}

export const getAllCategoriesByBrandLine = async (query) => {
    try {
        const response = await axiosInstance.get(`/brand-lines/categories/line-name?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error Category By Brand Line:', error);
        throw error;
    }
}

export const callDeleteCategory = async (query) => {
    try {
        const response = await axiosInstance.delete(`/brand-lines/categories?${query}`);
        return response;
    } catch (error) {
        console.error('Error Delete Category:', error);
        throw error;
    }
}

export const callUpdateCategory = async (query, objectForm) => {
    try {
        const response = await axiosInstance.put(`/brand-lines/categories?${query}`,  objectForm );
        return response.data;
    } catch (error) {
        console.error('Error update Category:', error);
        throw error;
    }
}


