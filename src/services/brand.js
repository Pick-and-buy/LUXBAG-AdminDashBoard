import axiosInstance from '../utils/axios-customize';
import axios from 'axios';

export const callFetchListBrands = async () => {
    try {
        const response = await axiosInstance.get('/brands');
        return response.data;
    } catch (error) {
        console.error('Error fetching brands data:', error);
        throw error;
    }
};

// export const callCreateBrand = async (formData) => {
//     try {
//         const token = localStorage.getItem('accessToken');
//         const response = await axiosInstance.post('/brands', {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data'
//             },
//             body: formData,
//         });
//         return response;
//     } catch (error) {
//         console.error('Error fetching brands data:', error);
//         throw error;
//     }
// };

export const callCreateBrand = async (formData) => {
    try {
        // console.log('>> check log formData: ', formData.getAll('request'));
        const token = localStorage.getItem('accessToken');
        const response = await axios.post('http://localhost:8080/api/v1/brands', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            data: formData,
        });
        return response;
    } catch (error) {
        console.error('Error create brands data:', error);
        throw error;
    }
};

export const getAllBrandByName = async (name) => {
    try {
        const response = await axiosInstance.get(`/brands/${name}`);
        return response.data.result;
    } catch (error) {
        console.error('Error Get All Brand By Name:', error);
        throw error;
    }
}

export const callDeleteBrand = async (query) => {
    try {
        const response = await axiosInstance.delete(`/brands/name?${query}`);
        return response;
    } catch (error) {
        console.error('Error Delete Brand:', error);
        throw error;
    }
}

export const callUpdateBrand = async (query, name) => {
    try {
        const response = await axiosInstance.put(`/brands/name?${query}`, { name });
        return response.data;
    } catch (error) {
        console.error('Error update Brand:', error);
        throw error;
    }
}


