import api from './api';

// Profile API
export const getProfile = async () => {
    try {
        const response = await api.get('/profiles/');
        return response.data.data?.[0] || null; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// Skills API
export const getSkills = async () => {
    try {
        const response = await api.get('/skills/');
        return response.data.data || []; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching skills:', error);
        throw error;
    }
};

// Experience API
export const getExperiences = async () => {
    try {
        const response = await api.get('/experiences/');
        return response.data.data || []; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching experiences:', error);
        throw error;
    }
};

// Projects API
export const getProjects = async () => {
    try {
        const response = await api.get('/projects/');
        return response.data.data || []; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

// Certifications API
export const getCertifications = async () => {
    try {
        const response = await api.get('/certifications/');
        return response.data.data || []; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching certifications:', error);
        throw error;
    }
};

// Education API
export const getEducation = async () => {
    try {
        const response = await api.get('/education/');
        return response.data.data || []; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching education:', error);
        throw error;
    }
};

// Contact Info API
export const getContactInfo = async () => {
    try {
        const response = await api.get('/contactinfo/');
        return response.data.data?.[0] || null; // Extract from nested data structure
    } catch (error) {
        console.error('Error fetching contact info:', error);
        throw error;
    }
};

// Submit Contact Form
export const submitContact = async (contactData) => {
    try {
        const response = await api.post('/contacts/', contactData);
        return response.data;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        throw error;
    }
};
