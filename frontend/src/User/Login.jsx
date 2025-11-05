import React, { useState } from "react";
import GoogleButton from "../../components/ui/GoogleButton";
import { post_data } from '../../services/PostMethod';
import { useNavigate } from "react-router-dom";
import { useLoginDisabling } from "../../hooks/userProtectionHooks";
import { useAuth } from "../../contexts/UserContext";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react"

export default function Login() {
  useLoginDisabling();
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handle_submit = async (e) => {
    e.preventDefault();

    try{
      const response = await post_data(credentials, '/auth/user_login');

      if(response){
        navigate(from, { replace: true });
      }
      
    }catch(err){
      console.log(err);
    }
  }


  return (
    <div 
      className="h-screen w-screen flex items-center justify-center overflow-hidden "
    >
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dk3bbinj9/image/upload/login_h4ifyf')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <motion.form 
        initial={{ opacity: 0, y: -50 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        animate={{ opacity: 1, y:0 }}
        className="w-[40%] min-w-[300px] max-w-[500px] flex flex-col items-center gap-y-4 rounded-xl text-white bg-black/40 border border-white/20" 
        onSubmit={handle_submit}
      >

        <h1 className="font-extralight text-[30px] md:text-[45px] my-5">TOTO TUMBS</h1>

        <input
          type="text"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
        />

        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="w-[80%] max-w-sm px-3 py-2 rounded-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
        />

        <button 
          className="w-[80%] max-w-sm bg-green-500 py-2 rounded-md text-white my-4 hover:bg-green-600 transition duration-200 ease-in-out disabled:bg-green-700/80 disabled:cursor-not-allowed"
          disabled={!credentials.email || !credentials.password}
          type="submit"
        >
          LOG IN
        </button>

        <p className="text-sm md:text-md">
          Don&apos;t have an account yet?{" "}
          <a href="/register" className="text-blue-400 underline">
            Create Account
          </a>
        </p>
        <a href="/forget-password" className="text-blue-400 my-2 text-sm md:text-md underline">
          Forget Password?
        </a>

        <div className="w-[80%] flex flex-row items-center justify-between space-x-4">
          <div className="w-[40%] border-t border-gray-300"></div>
          <span>OR</span>
          <div className="w-[40%] border-t border-gray-300"></div>
        </div>

        <GoogleButton/>
        
      </motion.form>
    </div>
  );
}
