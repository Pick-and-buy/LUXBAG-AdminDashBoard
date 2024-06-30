import axiosInstance from '../utils/axios-customize';

export const getUserByToken = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
};

export const callFetchAccount = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
};
