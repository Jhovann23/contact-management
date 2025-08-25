import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState([]);
  const [token, setToken] = useState('')
  const [exp, setExp] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const URL = 'http://localhost:3000'

  useEffect(() => {
    refreshToken()
  },[])

  const refreshToken = async() => {
    const response = await axios.get(`${URL}/token`, {withCredentials: true})
    const decoded = jwtDecode(response.data.accessToken);
    console.log(decoded)
    setUser(decoded.username)
    setToken(response.data.accessToken)
  }

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date();
    if(exp * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:3000/token', {withCredentials: true});
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      setToken(response.data.accessToken)
      const decoded = jwtDecode(response.data.accessToken)
      setExp(decoded.exp)
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const handleSubmitUsername = async(e) => {
    e.preventDefault()
    try {
      if(token) {
        const response = await axiosJWT.put(`${URL}/update`, {
        username: username
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      navigate('/dashboard')
      }
    } catch (error) {
      if(error.response) {
        console.log(error.response)
      }
    }
    
  }
  
  const handleChangePassword = async(e) => {
    e.preventDefault()
    try {
      const response = await axiosJWT.put(`${URL}/update-password`,{
        password: password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      navigate('/dashboard')
    } catch (error) {
      if(error.response) {
        console.log(error.response)
      }
    }
    
  }

  return (
    <div>
      <Navbar />
      <div className="w-[1200px] m-auto">
        <div className="text-white py-6 font-bold text-2xl rounded-md">
          My Profile
        </div>
        <div className="flex justify-between">
          <div className="bg-white w-[500px] p-6 rounded-md">
            <div className="text-xl font-bold">Edit Profile</div>
            <div className="text-xl font-semibold mt-4 mb-4">
              <div>Hello, {user}</div>
            </div>
            <form action="" className="mt-2 flex flex-col" onSubmit={(e) => {handleSubmitUsername(e)}}>
              <div className="font-medium">Username</div>
              <input
                type="text"
                className="mt-1 p-2 bg-gray-500 rounded-md text-white"
                placeholder="Enter new username"
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
                required
              />
              <button className="bg-[#151D2C] text-white mt-4 p-2 rounded-md hover:bg-gray-700">
                Update Profile
              </button>
            </form>
          </div>
          <div>
            <div className="bg-white w-[500px] p-6 rounded-md">
              <div className="text-xl font-bold">Change Password</div>
              <form action="" className="mt-2 flex flex-col" onSubmit={(e) => {handleChangePassword(e)}}>
                <div className="font-medium">New Password</div>
                <input
                  type="text"
                  placeholder="Enter new password"
                  className="mt-1 p-2 bg-gray-500 rounded-md text-white"
                  onChange={(e) => {setPassword(e.target.value)}}
                  required
                />
                <div className="font-medium mt-4">Confirm New Password</div>
                <input
                  type="text"
                  placeholder="Confirm your new password"
                  className="mt-1 p-2 bg-gray-500 rounded-md"
                  onChange={(e) => {setConfPassword(e.target.value)}}
                  required
                />
                {
                password.length > 0 && password !== confPassword ? (<div className="text-red-600">Password Tidak Sama!</div>) : ''
                }
                <button className="bg-[#151D2C] text-white mt-4 p-2 rounded-md hover:bg-gray-700">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
