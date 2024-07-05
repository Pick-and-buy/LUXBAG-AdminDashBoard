import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

// axiosInstance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

const handleRefreshToken = async () => {
    const token = localStorage.getItem('accessToken');
    const res = await axiosInstance.post('/auth/refresh-token', { accessToken: token });
    console.log('>>> check handleRefreshToken: ', res);
    if (res && res?.result) return res?.result?.accessToken;
    else null;
}

//interceptor: là cách mà can thiệp vào request trước khi gửi lên server back-end
axiosInstance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

// const NO_RETRY_HEADER = 'x-no-retry';

//interceptor: là cách mà can thiệp vào response trước khi server gửi về cho client
axiosInstance.interceptors.response.use(function (response) {
    // console.log('>>> check response axios customize: ', response);
    return response;
}, async function (error) {

    if (error.config && error.response
        && +error.response.status === 401
        // && !error.config.headers[NO_RETRY_HEADER]
    ) {
        console.log('>>> log refresh-token');
        //get new accessToken
        // const accessToken = await handleRefreshToken();

        // error.config.headers[NO_RETRY_HEADER] = 'true';

        // if (accessToken) {
        //     //Gán vào request hiện tại => set lại token mới
        //     error.config.headers['Authorization'] = `Bearer ${accessToken}`;
        //     //Ghi đè token mới lên
        //     localStorage.setItem('accessToken', accessToken)
        //     return axiosInstance.request(error.config);
        // }
    }

    // if (error.config && error.response
    //     && +error.response.status === 400
    //     && error.config.url === '/auth/refresh-token'
    // ) {
    //     window.location.href = '/login';
    // }


    return Promise.reject(error);
});


export default axiosInstance;