// src/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api', // Update with your API base URL
});


export default axiosInstance;
