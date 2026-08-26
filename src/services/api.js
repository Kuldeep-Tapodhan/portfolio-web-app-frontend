import axios from 'axios';

// Base URL: Direct backend port 8000 in browser environment or relative /api via Vite proxy
const getApiBaseUrl = () => {
    const target = import.meta.env.VITE_API_TARGET;
    if (target && target.startsWith("http") && !target.includes("backend")) {
        return `${target}/api`;
    }
    // Default to port 8000 directly on host localhost, or /api relative fallback
    return typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? "http://localhost:8000/api"
        : "/api";
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Dynamic Media URL Helper (eliminates hardcoded http://127.0.0.1:8000 URLs)
export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `http://localhost:8000${path.startsWith('/') ? '' : '/'}${path}`;
};

// 1. Request Interceptor: Attach Auth Token & Log every API request fired
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        
        config.metadata = { startTime: new Date() };
        const endpoint = `${config.baseURL || ''}${config.url}`;
        
        console.log(
            `🚀 [API Request Fired] ${config.method?.toUpperCase()} ${endpoint}`,
            {
                url: endpoint,
                params: config.params,
                data: config.data,
                headers: config.headers,
                timestamp: new Date().toISOString()
            }
        );
        return config;
    },
    (error) => {
        console.error(`❌ [API Request Error/Issue]`, error);
        return Promise.reject(error);
    }
);

// 2. Response Interceptor: Log API responses and issues/errors
api.interceptors.response.use(
    (response) => {
        const duration = response.config.metadata 
            ? new Date() - response.config.metadata.startTime 
            : 0;
        const endpoint = `${response.config.baseURL || ''}${response.config.url}`;
        
        console.log(
            `✅ [API Response ${response.status}] ${response.config.method?.toUpperCase()} ${endpoint} (${duration}ms)`,
            response.data
        );
        return response;
    },
    (error) => {
        const duration = error.config?.metadata 
            ? new Date() - error.config.metadata.startTime 
            : 0;
        const endpoint = error.config 
            ? `${error.config.baseURL || ''}${error.config.url}` 
            : 'Unknown URL';
        const status = error.response ? error.response.status : 'Network/Server Error';
        
        console.error(
            `❌ [API Issue ${status}] ${error.config?.method?.toUpperCase() || ''} ${endpoint} (${duration}ms)`,
            {
                message: error.message,
                status: error.response?.status,
                responseData: error.response?.data,
                headers: error.response?.headers,
                config: error.config
            }
        );
        return Promise.reject(error);
    }
);

export default api;