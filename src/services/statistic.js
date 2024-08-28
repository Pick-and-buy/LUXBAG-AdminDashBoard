import axiosInstance from '../utils/axios-customize';
import axios from 'axios';

export const totalAmountPerWeek = async () => {
    try {
        const response = await axiosInstance.get('/statistics/total-amount-per-week');
        return response.data;
    } catch (error) {
        console.error('Error total amount per week:', error);
        throw error;
    }
};

export const totalAmountPerMonth = async () => {
    try {
        const response = await axiosInstance.get('/statistics/total-amount-per-month');
        return response.data;
    } catch (error) {
        console.error('Error total amount per month:', error);
        throw error;
    }
};

export const totalAmountPerYear = async () => {
    try {
        const response = await axiosInstance.get('/statistics/total-amount-per-year');
        return response.data;
    } catch (error) {
        console.error('Error total amount per year:', error);
        throw error;
    }
};