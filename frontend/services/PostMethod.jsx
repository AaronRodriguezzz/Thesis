
import axios from 'axios';
import { CustomAlert } from '../components/modal/CustomAlert';

export const post_service = async (credentials, route) => {
    try {
        const response = await axios.post(`/api/${route}`, credentials , {
            withCredentials: true
        });

        if (response.status === 200) {
            console.log(response.data);
            CustomAlert('success',  response.data.message);
            return response.data;
        }

    } catch (err) {
        if (err.response) {
            console.log(err.response);
            // Extract message or error from backend
            const message = err.response.data.message || err.response.data.error || 'Unknown error';
            CustomAlert('error', message); // show error alert
        } else {
            CustomAlert('error', 'Server Error');
        }
    }
};