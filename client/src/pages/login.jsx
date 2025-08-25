import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const URL = "http://localhost:3000";
  
  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      await axios.post(`${URL}/login`, {
        username: username,
        password: password,
      },
      {
        withCredentials: true
      }
      )
      navigate('/dashboard')
    } catch (error) {
      if(error.response) {
        console.log(error.response.data)
        setMsg(error.response.data.msg)
      }
    }
  }

  return (
    <div className="bg-white w-[30%] m-auto p-8 box-border mt-16 rounded-lg" >
      <div className="text-center">
        <div className="font-medium text-lg text-red-600">{msg}</div>
        <div className="font-bold text-3xl p-4">Contact Management</div>
        <div className="text-xl">Sign in to your account</div>
      </div>
      <form action="" className="mt-8 font-medium" onSubmit={(e) => {handleSubmit(e)}}>
        <div className="text-lg">
          <div>Username</div>
          <input
            type="text"
            placeholder="Enter Your Username"
            className="w-full p-2 bg-gray-500 rounded-md text-white"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value) 
            }}
            required
          />
        </div>
        <div className="text-lg mt-4">
          <div>Password</div>
          <input
            type="password"
            placeholder="Enter Your Password"
            className="w-full p-2 bg-gray-500 rounded-md text-white"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required
            maxLength={10}
          />
        </div>
        <div className="mt-4">
          <button className="bg-blue-600 p-3 w-full text-lg rounded-md mt-2 text-white hover:text-gray-200 hover:bg-blue-700" type="submit">
            Login
          </button>
        </div>
        <div className="text-center mt-4">
          Don&apos;t have account?{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-800">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
