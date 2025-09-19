import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { CustomAlert } from '../modal/CustomAlert';
import { useLocation } from 'react-router-dom';
import { post_data } from '../../services/PostMethod';
import { useAuth } from '../../contexts/UserContext';

const GoogleButton = () => {

    const { setUser } = useAuth();
    const location = useLocation();
    const from = location.state?.from || "/";

    const handleSuccess = async (credentialResponse) => {
        
        try{
            const credential = credentialResponse.credential;

            if(!credential){
                CustomAlert('error', 'Google Credential Missing')
            }
            
            const response = await post_data({ credential }, "/auth/google_login");

            if(response){
                setUser(response.user);
                navigate(from, { replace: true });
            }

        }catch(err){
            console.log(err);
        }
    }

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="w-[80%] mb-7">
                <GoogleLogin
                    onSuccess={credentialResponse => handleSuccess(credentialResponse)}
                    onError={() => CustomAlert('error', 'Login Failed')}
                    size="large"
                    shape="pill"
                    text="signup_with"
                    logo_alignment="center"
                    width="100%"
                />
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleButton