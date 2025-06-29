import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

    }

    const handleSubmit = async(e)=>{
       e.preventDefault()
       console.log(formData);
       try {
            const response = await axios.post(`https://fb-clone-726q.onrender.com/api/v1/auth/login`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (response.data.success) {
                navigate('/')
                 dispatch(setUser(response.data.user))
                toast.success(response.data.message)
            } else {
                 toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
             toast.error(error.response.data.message)


        }
    }
    return (
        <div className=" min-h-screen flex items-center justify-center px-4">
            <div className="flex flex-col md:flex-row md:max-w-5xl gap-10 space-y-10 md:space-y-0 md:space-x-10">
                {/* Left side */}
                <div className="flex-1 flex flex-col justify-center mb-20">
                    <h1 className="text-blue-600 text-6xl font-bold">facebook</h1>
                    <p className="text-2xl mt-4">
                        Facebook helps you connect and share with the people in your life.
                    </p>
                </div>

                {/* Right side */}
                <div>
                    <div className=" bg-white dark:bg-[#262829] p-6 rounded-lg shadow-md md:w-[450px]">
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                            <input
                                type="text"
                                placeholder="Email address or phone number"
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 border  border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            />
                            <button type='submit' className="bg-blue-600 text-white text-xl font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                                Log in
                            </button>
                            <a
                                href="#"
                                className="text-blue-600 dark:text-blue-500  text-sm text-center hover:underline"
                            >
                                Forgotten password?
                            </a>
                            <hr className="mb-7 mt-2 text-gray-200" />
                            <Link to={'/signup'} className='flex items-center'>
                                <button className="bg-green-500 text-lg text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition w-fit mx-auto px-6">
                                    Create new account
                                </button>
                            </Link>
                        </form>
                    </div>
                    <p className='text-md text-center mt-7 tracking-tight'><span className='font-semibold'>Create a Page</span> for a celebrity, brand or business.</p>

                </div>
            </div>
        </div>
    )
}

export default Login
