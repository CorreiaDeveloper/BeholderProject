import axios from 'axios';

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            console.error(`Redirected to login by 401!`);
            window.location = '/';
        }
        else
            return Promise.reject(error);
    }
)

export default axios;