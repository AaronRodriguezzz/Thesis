import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { post_data } from '../../services/PostMethod';
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handle_submit = async () => {
    try{
      const response = await post_data(credentials, '/auth/user_login');

      if(response){
        navigate('/')
      }
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="h-screen w-screen bg-[url('/login.png')] bg-cover bg-center flex items-center justify-center">
      <div className="w-[40%] min-w-[340px] max-w-[500px] flex flex-col items-center gap-y-4 md:shadow-lg rounded-xl bg-white bg-opacity-90">
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

        <button className="w-[80%] bg-green-500 py-3 rounded-md text-white my-4 hover:bg-green-600 transition duration-200 ease-in-out">
          LOG IN
        </button>

        <p className="text-sm md:text-md">
          Don&apos;t have an account yet?{" "}
          <a href="/register" className="text-blue-400 underline">
            Create Account
          </a>
        </p>
        <a href="#" className="text-blue-400 my-2 text-sm md:text-md underline">
          Forget Password?
        </a>

        <div className="w-[80%] flex flex-row items-center justify-between space-x-4">
          <div className="w-[40%] border-t border-gray-300"></div>
          <h1 className="text-black">OR</h1>
          <div className="w-[40%] border-t border-gray-300"></div>
        </div>

        <button className="w-[80%] flex flex-row items-center justify-center gap-x-3 py-2 rounded-full border border-gray-300 mb-7 hover:shadow-md transition duration-200 ease-in-out">
          <img src="/google.png" alt="Google" width={30} height={30} />
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
