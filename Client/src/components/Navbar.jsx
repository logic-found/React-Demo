import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../main";
import toast from "react-hot-toast";


const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logged Out')
    navigate('/login')
  }
    
  return (
    <>
    <div className='w-full flex justify-start gap-4 font-semibold text-lg px-4 py-2 bg-gray-300 '>
      <NavLink to="/dashboard" className=' text-indigo-600 hover:underline'>Dashboard</NavLink>
      <NavLink to="/profile" className=' text-indigo-600 hover:underline'>Profile</NavLink>
      {user?.role === "admin" && <NavLink to="/pending-review" className=' text-indigo-600 hover:underline'>Pending Review</NavLink>}
      {user?.role === "teamMember" && <NavLink to="/profile/my-submission" className=' text-indigo-600 hover:underline'>My Submission</NavLink>}
      <div onClick={handleLogout} className="text-indigo-600 hover:underline cursor-pointer">Logout</div>
    </div>
    </>
  )
}

export default Navbar