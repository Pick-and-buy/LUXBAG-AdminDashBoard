import axiosInstance from '../utils/axios-customize';
import axios from 'axios';

export const callFetchListOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/admin');
        return response.data;
    } catch (error) {
        console.log('Error fetching List Orders:', error);
        throw error;
    }
}

export const updateOrderStatusSeller = async (orderId, status) => {
    try {
        const response = await axiosInstance.put(`/orders/status-admin?orderId=${orderId}&orderStatus=${status}`, {orderId, status});
        return response.data;
    } catch (error) {
        console.log('Error update order:', error);
        throw error;
    }
};