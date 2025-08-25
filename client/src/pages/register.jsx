import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const URL = 'http://localhost:3000'
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      await axios.post(`${URL}/register`, {
        username: username,
        password: password
      })
      navigate('/')
    } catch (error) {
      if(error.response) {
        console.log(error.response.data)
        setMsg(error.response.data.msg)
      }
    }
  }

  return (
    <div className="bg-white w-[30%] m-auto p-8 box-border mt-14 rounded-lg">
      <div className="text-center">
        <div className="font-medium text-lg text-red-600">{msg}</div>
        <div className="font-bold text-3xl p-4">Contact Management</div>
        <div className="text-xl">Create a new account</div>
      </div>
      <form action="" className="mt-8 font-medium" onSubmit={(e) => handleSubmit(e)}>
        <div className="text-lg">
          <div>Username</div>
          <input
            type="text"
            placeholder="Choose a username"
            className="w-full p-2 bg-gray-500 rounded-md text-white"
            required
            value={username}
            onChange={(e) => {setUsername(e.target.value)}}
          />
        </div>
        <div className="text-lg mt-4">
          <div>Password</div>
          <input
            type="password"
            placeholder="Choose a password"
            className="w-full p-2 bg-gray-500 rounded-md text-white"
            required
            maxLength={10}
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
        <div className="text-lg mt-4">
          <div>Confirm Password</div>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full p-2 bg-gray-500 rounded-md text-white"
            required
            maxLength={10}
            onChange={(e) => {
              setConfirm(e.target.value)
            }}
          />
        </div>
        {
          password.length > 0 && password !== confirm ? (<div className="text-red-600">Password Tidak Sama!</div>) : ''
        }
        <div className="mt-4">
          <button className="bg-blue-600 p-3 w-full text-lg rounded-md mt-2 text-white hover:text-gray-200 hover:bg-blue-700" type="submit">
            Sign Up
          </button>
        </div>
        <div className="text-center mt-4">
          Already have an account?{" "}
          <button className="text-blue-500 hover:text-blue-800">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
