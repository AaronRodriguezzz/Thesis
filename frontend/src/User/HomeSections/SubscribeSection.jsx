import { useState } from 'react'
import { post_data } from '../../../services/PostMethod';

const SubscribeSection = () => {
    const [subscribedEmail, setSubscribedEmail] = useState('');
    
    const handle_subscribed_email = async (e) => {
        e.preventDefault();
    
        try{
            const response = await post_data( { email: subscribedEmail }, '/subscribe');
    
            if(response){
              setSubscribedEmail('');
            }
        }catch(err){
          console.log(err);
        }
    }

    return (
        <form 
            className="w-full flex flex-col justify-center items-center gap-y-4  py-12 px-4 mt-10 text-center text-white"
            onSubmit={handle_subscribed_email}
        >
            <h1 className="text-2xl md:text-4xl font-light">
                Do you want to be always updated?
            </h1>
            <p className="text-sm md:text-base font-semibold max-w-2xl">
                Be the first to know about new collections and exclusive offers by subscribing to our emails for free
            </p>
            <input
                type="email"
                className="w-full max-w-md px-4 py-3 border border-white rounded-md outline-none shadow-inside text-white"
                placeholder="Enter your email"
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
            />
            <button 
                className="bg-white text-black rounded-full py-3 px-6 text-sm md:text-base hover:bg-green-500 transition"
                type="submit"
            >
                Subscribe
            </button>
        </form>    
    )
}

export default SubscribeSection