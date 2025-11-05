import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { post_data } from '../../services/PostMethod';
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../contexts/UserContext";
import { useLoginDisabling } from "../../hooks/userProtectionHooks";

export default function AdminLogin() {
  useLoginDisabling();

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handle_submit = async (e) => {
    e.preventDefault();

    try{
      const response = await post_data(credentials, '/auth/admin_login');

      if(response.user){
        setUser(response.user);
        navigate(response.user.role === 'Admin' ? '/admin/dashboard': '/front-desk/dashboard')
      }
      
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dk3bbinj9/image/upload/login_h4ifyf')] bg-cover bg-center filter invert" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <form className="w-[40%] min-w-[340px] max-w-[500px] flex flex-col items-center gap-y-4 rounded-xl bg-black/40 text-white border border-white/20" onSubmit={handle_submit}>
        <h1 className="font-extralight text-[50px] my-5">TOTO TUMBS</h1>


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

        <p className="text-sm my-4">
            Forget your Password? 
            <a href="#" className="text-blue-400 mx-2 text-sm md:text-md underline">
                Forget Password
            </a>
        </p>

      </form>
    </div>
  );
}
