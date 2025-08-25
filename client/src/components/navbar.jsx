import { Link } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const URL = "http://localhost:3000"

  const Logout = async () => {
    try {
      await axios.delete(`${URL}/logout`, {withCredentials: true})
      navigate("/")
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="bg-[#151D2C] box-border">
      <div className="w-[1200px] m-auto text-white flex justify-between py-5 text-lg">
        <Link to="/dashboard" className="font-bold">Contact Management</Link>
        <div className="flex gap-12">
          <Link to={"/profile"}>Profile</Link>
          <button onClick={() => Logout()}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar
