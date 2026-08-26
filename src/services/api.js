import axios from 'axios';

// Get backend URL directly from .env (VITE_API_TARGET or VITE_BACKEND_URL)
const getApiBaseUrl = () => {
    let target = import.meta.env.VITE_API_TARGET || import.meta.env.VITE_BACKEND_URL;
    if (target) {
        // Normalize: strip trailing slashes
        target = target.trim().replace(/\/+$/, '');
        if (target.endsWith('/api')) {
            return target;
        }
        return `${target}/api`;
    }
    // Fallback URL if env is missing
    return "https://portfolio-web-app-backend.onrender.com/api";
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
    },
});

// Media URL Helper: prepend backend domain from .env for uploaded assets
export const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    let target = import.meta.env.VITE_API_TARGET || import.meta.env.VITE_BACKEND_URL || 'https://portfolio-web-app-backend.onrender.com';
    target = target.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return `${target}${path.startsWith('/') ? '' : '/'}${path}`;
};

// 1. Request Interceptor: Attach Auth Token & Anti-Cache Headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        
        config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        config.headers["Pragma"] = "no-cache";

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