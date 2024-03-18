import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FetchData from "../utils/FetchData";
import ErrorHandler from "../utils/ErrorHandler";
import toast from "react-hot-toast";
import { UserContext } from "../main";


const Register = () => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
      try{
        e.preventDefault();
        setLoading(true)
        const data = await FetchData({
          method : 'POST',
          endpoint : 'user/login',
          data : {email, password}
        })
        setLoading(false)
        const { message, token, user } = data
        setUser(user)
        localStorage.setItem('token',token);
        toast.success(message)
        navigate('/dashboard')
      }
      catch(err){
        setLoading(false)
        ErrorHandler(err)
      }
    };

    return (
        <>
            <div className="flex items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Login
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="rashika@gmail.com"
                                    maxLength={30}
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    minLength={4}
                                    maxLength={15}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-gray-200 bg-primary-600 hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading? "Processing..":"Login"}
                            </button>
                            <p className="text-sm font-light text-indigo-600 text-center">
                                <Link
                                    to="/register"
                                    className="font-medium text-primary-600 hover:underline"
                                >
                                    Register
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
