import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Singup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        dateOfBirth: '', // final combined value YYYY-MM-DD
        gender: '',
        email: '',
        password: '',
    });

    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Fix: if name is empty, skip this update
        if (!name) {
            console.warn("Skipping change, no name:", e.target);
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    // Function to update dateOfBirth when day/month/year changes
    const updateDateOfBirth = (day, month, year) => {
        if (day && month && year) {
            // Convert month name to number (01,02,...,12)
            const monthMap = {
                Jan: '01', Feb: '02', Mar: '03', Apr: '04',
                May: '05', Jun: '06', Jul: '07', Aug: '08',
                Sep: '09', Oct: '10', Nov: '11', Dec: '12',
            };
            const monthNum = monthMap[month];
            const dob = `${year}-${monthNum}-${day.padStart(2, '0')}`; // YYYY-MM-DD
            setFormData((prev) => ({ ...prev, dateOfBirth: dob }));
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(formData);
        try {
            const response = await axios.post(`https://fb-clone-726q.onrender.com/api/v1/auth/register`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (response.data.success) {
                navigate('/login')
                // toast.success(response.data.message)
            } else {
                // toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message)
        }
    }

        return (
            <div className=" h-screen flex flex-col gap-7 items-center justify-center py-10">
                <h1 className='text-blue-600 text-6xl font-bold text-center'>facebook</h1>
                <div className="bg-white dark:bg-[#323233] p-3 rounded-lg shadow-md w-full md:max-w-[450px] mx-1 md:mx-0">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-1">Create a new account</h2>
                    <p className="text-gray-600 dark:text-gray-200 mb-4 text-center">It’s quick and easy.</p>
                    <hr className="mb-4 text-gray-200 dark:text-white" />

                    <form onSubmit={handleSubmit} className="space-y-2 flex flex-col items-center">
                        <div className="flex gap-3 md:w-full">
                            <input
                                type="text"
                                placeholder="First name"
                                className="flex-1 p-2 border border-gray-300 rounded w-[180px]"
                                name='firstname'
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                placeholder="Surname"
                                className="flex-1 p-2 border border-gray-300 rounded w-[180px]"
                                name='lastname'
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div className='w-full'>
                            <label className="text-sm text-gray-700 dark:text-gray-200">Date of birth</label>
                            <div className="flex gap-2 mt-1">
                                <select
                                    value={dobDay}
                                    onChange={(e) => {
                                        setDobDay(e.target.value);
                                        updateDateOfBirth(e.target.value, dobMonth, dobYear);
                                    }}
                                    className="p-2 border border-gray-300 rounded w-full">
                                    <option value="">Day</option>
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
                                    ))}
                                </select>
                                <select
                                    value={dobMonth}
                                    onChange={(e) => {
                                        setDobMonth(e.target.value);
                                        updateDateOfBirth(dobDay, e.target.value, dobYear);
                                    }}
                                    className="p-2 border border-gray-300 rounded w-full">
                                    <option value="">Month</option>
                                    {[
                                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                                    ].map((month, i) => (
                                        <option key={i} value={month}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={dobYear}
                                    onChange={(e) => {
                                        setDobYear(e.target.value);
                                        updateDateOfBirth(dobDay, dobMonth, e.target.value);
                                    }}
                                    className="p-2 border border-gray-300 rounded w-full">
                                    <option value="">Year</option>
                                    {[...Array(100)].map((_, i) => (
                                        <option key={i} value={String(2025 - i)}>{2025 - i}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Gender */}
                        <div className='w-full'>
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Gender</label>
                            <div className="flex gap-3 mt-1">
                                {["Female", "Male", "Custom"].map((gender) => (
                                    <label
                                        key={gender}
                                        className="flex items-center justify-between border border-gray-300 rounded px-3 py-2 w-full cursor-pointer"
                                    >
                                        {gender}
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={gender}
                                            checked={formData.gender === gender}
                                            onChange={handleChange}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Mobile number or email address"
                            className="w-full p-2 border border-gray-300 rounded"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="New password"
                            className="w-full p-2 border border-gray-300 rounded"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <p className="text-xs text-gray-600 dark:text-gray-200 mt-2">
                            People who use our service may have uploaded your contact information to Facebook.{" "}
                            <a href="#" className="text-blue-800 dark:text-blue-500 hover:underline">Learn more</a>.
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">
                            By clicking Sign Up, you agree to our{" "}
                            <a href="#" className="text-blue-800 dark:text-blue-500 hover:underline">Terms</a>,{" "}
                            <a href="#" className="text-blue-800 dark:text-blue-500 hover:underline">Privacy Policy</a> and{" "}
                            <a href="#" className="text-blue-800 dark:text-blue-500 hover:underline">Cookies Policy</a>.
                            You may receive SMS notifications from us and can opt out at any time.
                        </p>

                        <button type='submit' className="bg-green-600 text-white text-lg font-bold py-1 w-[200px] px-7 rounded hover:bg-green-700 mt-4">
                            Sign Up
                        </button>
                        <Link to={'/login'}>
                            <p className='text-blue-600 dark:text-blue-500 hover:text-blue-700 text-lg my-2 cursor-pointer'>Already have an account?</p>
                        </Link>
                    </form>
                </div>
            </div>
        )
    }

    export default Singup;
