import axios from 'axios';
import { CustomAlert } from '../components/modal/CustomAlert';

export const update_data = async (route, newData) => {

    try{
        const response = await axios.put(`/api${route}` , { newData })

        if(response.status === 200){
            CustomAlert('success',  'Updating Successful')
            return response.data
        }     
    }catch(err){
        console.log(err);
        if (err.response) {
            // Extract message or error from backend
            const message = err.response.data.message || err.response.data.error || 'Unknown error';
            CustomAlert('error', message); // show error alert
        } else {
            CustomAlert('error', 'Server Error');
        }
    }
}
