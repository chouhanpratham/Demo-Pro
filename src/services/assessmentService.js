import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://edusync-backend03.azurewebsites.net/api';

export const assessmentService = {
    async submitAssessment(submission) {
        try {
            const response = await axios.post(`${API_URL}/assessments/submit`, submission, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting assessment:', error);
            throw error;
        }
    },

    async getAssessmentById(id) {
        try {
            const response = await axios.get(`${API_URL}/assessments/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching assessment:', error);
            throw error;
        }
    },

    async getAllAssessments() {
        try {
            const response = await axios.get(`${API_URL}/assessments`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching assessments:', error);
            throw error;
        }
    }
}; 