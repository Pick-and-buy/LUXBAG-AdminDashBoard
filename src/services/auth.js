import axiosInstance from '../utils/axios-customize';

// export const callLogin = (phoneNumber, password) => {
//     return axios.post('/auth/login', { phoneNumber, password })
// }

export const callLogin = async (phoneNumber, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { phoneNumber, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const callLogout = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axiosInstance.post('/auth/logout', { accessToken });
        return response;
    } catch (error) {
        console.error('Error logout:', error);
        throw error;
    }
};
