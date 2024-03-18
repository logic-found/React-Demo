import "./App.css";
import { useContext, useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from './components/Navbar'
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import Profile from './pages/Profile'
import PendingReview from './pages/PendingReview'
import PendingReviewDetails from "./pages/PendingReviewDetails";
import MySubmission from "./pages/MySubmission";
import {UserContext} from '../src/main'
import FetchData from "./utils/FetchData";
import ErrorHandler from "./utils/ErrorHandler";
import Spinner from "./components/Spinner";


function App() {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false)

    const fetchUserDetails = async () => {
        try{
          setLoading(true)
          const data = await FetchData({
            method : 'GET',
            endpoint : 'user/me',
            data : null
          })
          setLoading(false)
          const user  = data?.response
          setUser(user)
        }
        catch(err){
          setLoading(false)
          ErrorHandler(err)
        }
      };
    useEffect(() => {
        if (window.location.pathname !== '/register' && window.location.pathname !== '/login') {
            fetchUserDetails()
        }
    }, [])

    if(loading){
        return <Spinner/>
    }
  
    return (
        <>
            <Router>
                <div className=" min-h-screen max-w-screen bg-gray-100">
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: "#F5F2F2",
                            },
                            success: {
                                icon: "✅",
                            },
                            error: {
                                icon: "❌",
                            },
                        }}
                    />
                    <Routes>
                        <Route path="/" element={ <><Navigate to="/register" /></>}/>
                        <Route path="/register" element={ <Register />}/>
                        <Route path="/login" element={ <Login />}/>
                        <Route path="/dashboard" element={ <><Navbar/><Dashboard /></>}/>
                        <Route path="/profile" element={ <><Navbar/><Profile/></>}/>
                        <Route path="/profile/my-submission" element={ <><Navbar/><MySubmission/></>}/>
                        <Route path="/pending-review" element={ <><Navbar/><PendingReview/></>}/>
                        <Route path="/pending-review/:id" element={ <><Navbar/><PendingReviewDetails/></>}/>
                        <Route path="/product/:id" element={ <><Navbar/><ProductDetails /></>}/>
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
