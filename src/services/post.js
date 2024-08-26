import axiosInstance from '../utils/axios-customize';
import axios from 'axios';

export const callFetchListPosts = async () => {
    try {
        const response = await axiosInstance.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts data:', error);
        throw error;
    }
};

export const getPostById = async (id) => {
    try {
        const response = await axiosInstance.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts data:', error);
        throw error;
    }
};


export const getPostsByBrandName = async (query) => {
    try {
        const response = await axiosInstance.get(`/posts/brands?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error Get Post By Brand Name:', error);
        throw error;
    }
}

export const getPostsByBrandLine = async (query) => {
    try {
        const response = await axiosInstance.get(`/posts/brandLine?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error Get Post By Brand Line:', error);
        throw error;
    }
}

export const getPostsByUser = async (query) => {
    try {
        const response = await axiosInstance.get(`/posts/user?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error Get Post By User:', error);
        throw error;
    }
}

export const callDeletePost = async (query) => {
    try {
        const response = await axiosInstance.delete(`/posts?${query}`);
        return response;
    } catch (error) {
        console.error('Error Delete Post:', error);
        throw error;
    }
}

export const setStatusArchivePost = async (postId, setStatus) => {
    try {
        const response = await axiosInstance.put(`/posts/archive-post/${postId}?isArchive=${setStatus}`, { setStatus });
        return response;
    } catch (error) {
        console.error('Error Update Post Archive Status:', error);
        throw error;
    }
}
