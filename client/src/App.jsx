import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Create from "./pages/create_new";
import Profile from "./pages/profile";
import ProtectedRoute from "./auth/protectedRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute> }/>
      <Route path="/create_new" element={<ProtectedRoute><Create/></ProtectedRoute>  }/>
      <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute> } />
      
    </Routes>
  );
}

export default App;
