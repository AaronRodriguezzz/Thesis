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

      if(response.employee){
        setUser(response.employee);
        navigate(response.employee.role === 'Admin' ? '/admin/dashboard': '/front-desk/dashboard')
      }
      
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <form className="w-[40%] min-w-[340px] max-w-[500px] flex flex-col items-center gap-y-4 md:shadow-lg rounded-xl bg-white bg-opacity-90" onSubmit={handle_submit}>
        {/* Optional header image */}
        {/* <img
          src="/my-image.png"
          alt="Description"
          width={500}
          height={300}
        /> */}

        <h1 className="font-extralight text-[50px] my-5">TOTO TUMBS</h1>

        <TextField
          id="outlined-email"
          label="Email"
          variant="outlined"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          sx={{ width: "80%" }}
        />

        <TextField
          id="outlined-password"
          label="Password"
          variant="outlined"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          sx={{ width: "80%" }}
        />

        <button 
          className="w-[80%] bg-green-500 py-3 rounded-md text-white my-4 hover:bg-green-600 transition duration-200 ease-in-out"
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
