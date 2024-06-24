import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

//interceptor: là cách mà can thiệp vào request trước khi gửi lên server back-end

axiosInstance.interceptors.request.use(
    function (config) {
    const token = localStorage.getItem('accessToken');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    
}, 
function (error) {
    // Do something with request error
    return Promise.reject(error);
});


//interceptor: là cách mà can thiệp vào response trước khi server gửi về cho client
axiosInstance.interceptors.response.use(function (response) {
    console.log('>>> check response axios customize: ', response);
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});


export default axiosInstance;