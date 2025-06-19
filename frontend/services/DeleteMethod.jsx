import axios from 'axios';
import { CustomAlert } from '../components/modal/CustomAlert';

export const delete_data = async (id,route) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");

    if(!confirmDelete){
        return
    }

    try{
        const response = await axios.delete(`/api${route}/${id}`)

        if(response.status === 200){
            CustomAlert('success',  'Deletion Successful')
        }
        
    }catch(err){
        if (err.response) {
            // Extract message or error from backend
            const message = err.response.data.message || err.response.data.error || 'Unknown error';
            CustomAlert('error', message); // show error alert
        } else {
            CustomAlert('error', 'Server Error');
        }
    }
}