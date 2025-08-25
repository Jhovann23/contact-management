import { Link } from "react-router";
import Navbar from "../components/navbar";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate()
  const URL = "http://localhost:3000";
  const [token, setToken] = useState('')
  const [exp, setExp] = useState('')
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    refreshToken();
  }, [])

  useEffect(() => {
    if(token) {
      getContact()
    }
  },[token])

  const refreshToken = async() => {
    try {
      const response = await axios.get(`${URL}/token`, {withCredentials: true})
      setToken(response.data.accessToken)
      const decoded = jwtDecode(response.data.accessToken)
      setExp(decoded.exp)
    } catch (error) {
      if(error.response)
        navigate('/')
    }
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

  const getContact = async() => {
    const response = await axiosJWT.get(`${URL}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })
    setContacts(response.data)
  }

  const handleDelete = async(e, id) => {
    e.preventDefault()
    try {
      const response = await axiosJWT.delete(`${URL}/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
    } catch (error) {
      if(error.response) {
        console.log(error.response)
      }
    }
  }

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => {
    const aName = a.username ? a.username.toLowerCase() : "";
    const bName = b.username ? b.username.toLowerCase() : "";

    const aMatch = aName.includes(search.toLowerCase());
    const bMatch = bName.includes(search.toLowerCase());

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return aName.localeCompare(bName);
  });
  }, [contacts, search])

  return (
    <div>
      <Navbar />
      <div className="w-[1200px] m-auto">
        <div className="text-2xl py-6 font-semibold text-white">
          Search Contacts
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-4 rounded-md"
          value={search}
          onChange={(e) => {setSearch(e.target.value)}}
        />
      </div>
      <div className="w-[1200px] m-auto mt-8">
        <div className="text-white font-bold text-2xl">My Contacts</div>
        <div className="mt-6 flex gap-4 flex-wrap">
          <Link to="/create_new">
            <div className="bg-[#151D2C] w-[380px] p-7 flex rounded-md hover:bg-gray-800">
              <img src="pluss.png" alt="" className="w-[80px]" />
              <div className="text-white ml-6 text-xl flex items-center font-semibold">
                <div>Create New Contact</div>
              </div>
            </div>
          </Link>
          {sortedContacts.length > 0 && sortedContacts.map((contact) => {
            return(
              <div
                className="bg-[#151D2C] w-[380px] p-4 rounded-md"
              key={contact.id}>
                <div className="flex w-full">
                  <img src="default.jpg" alt="" className="w-[70px] rounded-md" />
                  <div className="text-white ml-4 text-base">
                    <div>Name: {contact.username}</div>
                    <div>Email: {contact.email}</div>
                    <div>Phone: {contact.phone_number}</div>
                  </div>
                </div>
                <div className=" flex flex-row-reverse mt-2">
                  <button
                    className="bg-red-600 text-white p-3 px-4 rounded-md hover:bg-red-800"
                    onClick={(e) => {handleDelete(e, contact.id)}}
                  >
                    Delete
                  </button>
                </div>
              </div> )
          })}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
