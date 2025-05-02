import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail } from "../../utils/utils";
import axiosInstance from "../../utils/axiosInstance";
import { FaRegEnvelope, FaRegEye, FaRegEyeSlash, FaLock } from "react-icons/fa";
import { MdNotes } from "react-icons/md";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!password) {
            setError("Please enter the password");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post("/login", {
                email: email,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Left Side - Branding/Illustration */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
                <div className="max-w-md text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-6">
                        <MdNotes className="text-5xl text-primary mr-2" />
                        <h1 className="text-3xl font-bold text-gray-800">Notes App</h1>
                    </div>
                    
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Welcome back!</h2>
                    <p className="text-lg text-gray-600 mb-8">Your personal space for thoughts and ideas. Login to access your notes from anywhere.</p>
                    
                    <div className="hidden md:block">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="h-3 w-20 bg-primary rounded-full mb-2"></div>
                                    <div className="h-3 w-12 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">N</div>
                            </div>
                            <div className="h-24 bg-gray-100 rounded-lg mb-3"></div>
                            <div className="flex space-x-2 mb-2">
                                <div className="h-6 w-16 bg-blue-100 rounded-full"></div>
                                <div className="h-6 w-16 bg-green-100 rounded-full"></div>
                            </div>
                            <div className="h-3 w-32 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-0">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Login to your account</h3>
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaRegEnvelope className="text-gray-400" />
                                </div>
                                <input 
                                    id="email"
                                    type="email" 
                                    placeholder="you@example.com" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input 
                                    id="password"
                                    type={isShowPassword ? "text" : "password"} 
                                    placeholder="Enter your password" 
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button 
                                        type="button" 
                                        onClick={toggleShowPassword} 
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                    >
                                        {isShowPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input 
                                    id="remember-me" 
                                    name="remember-me" 
                                    type="checkbox" 
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                            </div>
                            
                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-blue-700">Forgot password?</a>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/signUp" className="font-medium text-primary hover:text-blue-700">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}