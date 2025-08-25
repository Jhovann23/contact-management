// ProtectedRoute.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/token", { withCredentials: true })
      .then(() => {
        setAuth(true);
        setLoading(false);
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if(!loading && !auth) {
        navigate("/")
    }
  })
  useEffect(() => {
    if(auth) {
      navigate("/dashboard")
    } 
  })
  if (loading) return <p>Loading...</p>;
  return children
}
