import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/utils";
import axiosInstance from "../../utils/axiosInstance";
import { FaRegEnvelope, FaRegEye, FaRegEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { MdNotes } from "react-icons/md";

export default function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };
    
    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError("Please enter your name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter password");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email,
                password: password,
            });

            if (response.data && response.data.error) {
                setError(response.data.message);
                return;
            }

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
                    
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">Join us today!</h2>
                    <p className="text-lg text-gray-600 mb-8">Create an account to start organizing your thoughts and ideas in one secure place.</p>
                    
                    <div className="hidden md:block">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="h-8 w-8 bg-primary rounded-full"></div>
                                <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
                                <div className="h-8 w-8 bg-green-400 rounded-full"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-24 bg-primary rounded-full"></div>
                                <div className="h-3 w-32 bg-gray-200 rounded-full"></div>
                                <div className="h-3 w-20 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="mt-4 h-28 bg-gray-100 rounded-lg"></div>
                            <div className="mt-3 flex justify-end">
                                <div className="h-8 w-16 bg-primary rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-0">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Create an account</h3>
                    
                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input 
                                    id="name"
                                    type="text" 
                                    placeholder="John Doe" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                    placeholder="Create a strong password" 
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

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {isLoading ? "Creating account..." : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary hover:text-blue-700">
                                Log in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <p className="text-xs text-gray-500 text-center">
                            By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}