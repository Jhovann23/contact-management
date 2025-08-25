import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Create() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("")
  const [exp, setExp]= useState("");
  const navigate = useNavigate();
  const URL = "http://localhost:3000";

  useEffect(() => {
    refreshToken()
  },[])

  const refreshToken = async() => {
    const response = await axios.get(`${URL}/token`, {withCredentials: true})
    const decoded = jwtDecode(response.data.accessToken);
    console.log(decoded)
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

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      const response = await axiosJWT.post(`${URL}/contacts`, {
        username: username,
        email: email,
        phone_number: phone
      },{
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
  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div>
      <Navbar />
      <div className="w-[50%] m-auto box-border">
        <div className="py-8 font-bold text-2xl text-white">
          Create New Contact
        </div>
        <form onSubmit={(e) => {handleSubmit(e)}}>
          <div className="flex flex-col bg-white p-6 text-xl rounded-md">
            <div>
              <div>Name</div>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full py-3 pl-1 rounded-md mt-2 text-white bg-gray-500"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </div>
            <div className="mt-4">
              <div>Email</div>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full py-3 pl-1 rounded-md mt-2 text-white bg-gray-500"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </div>
            <div className="mt-4">
              <div>Phone</div>
              <input
                type="text"
                placeholder="Enter Phone Number"
                className="w-full py-3 pl-1 rounded-md mt-2 text-white bg-gray-500"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                required
                maxLength={12}
              />
            </div>
            <div className="flex flex-row-reverse gap-6 mt-6 text-white">
              <button
                className="bg-[#1E3D9C] px-4 py-2 rounded-md hover:bg-blue-700"
                type="submit"
              >
                Create Contact
              </button>
              <button
                className="bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => {handleCancel()}}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
