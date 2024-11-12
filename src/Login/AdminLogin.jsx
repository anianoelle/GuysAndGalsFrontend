import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Login/SignIn.css"
import { Link } from 'react-router-dom';


const AdminLogin = () => {


    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');
    //     setSuccess('');

    //     try {
    //         const response = await axios.post('https://test-conn.vercel.app/api/v1/admin', {
    //             email,
    //             password,
    //         });

    //         // Handle successful login
    //         setSuccess(response.data.message);
    //         console.log('Admin logged in:', response.data.admin);
    //         navigate('/Admin')
            

    //     } catch (err) {
    //         setError(err.response?.data?.message || 'An error occurred during login.');
    //         console.error('Login error:', err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('https://test-conn.vercel.app/api/v1/admin', {
                email,
                password,
            });
    
            if (response.data.success) {
                // On success, store the login status
                localStorage.setItem('adminLoggedIn', 'true');
                setSuccess(response.data.message);
                console.log('Admin logged in:', response.data.admin);
    
                // Navigate to Admin page
                navigate('/Admin');
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };
    


    

    return (
        <div className="flex h-screen bg-gray-100 items-center">
           <div className='h-[100%] w-[70%] flex items-center justify-center relative'>
               <div className='absolute w-[100%] h-[100%] flex '>
                <div className='flex flex-col justify-center items-center w-[50%] h-[100%]'>      
                    <h1 className='text-9xl font-extrabold  text-violet-500'>Guys <span className='text-gray-500'>&</span></h1>
                    <h1 className='text-9xl font-extrabold  text-violet-500'>Guys <span className='text-gray-500'>&</span></h1>
                    <h1 className='text-9xl font-extrabold  text-violet-500'>Guys <span className='text-gray-500'>&</span></h1>
                    <h1 className='text-9xl font-extrabold  text-violet-500'>Guys <span className='text-gray-500'>&</span></h1>
                    <h1 className='text-9xl font-extrabold  text-violet-500'>Guys <span className='text-gray-500'>&</span></h1>
                    <h1 className='text-9xl font-extrabold  text-violet-500'>Guys <span className='text-gray-500'>&</span></h1>
                </div>
                <div className='flex flex-col justify-center w-[50%] h-[100%] pl-28'>      
                    <h1 className='text-9xl font-extrabold  text-blue-500'>Gals</h1>
                    <h1 className='text-9xl font-extrabold  text-blue-500'>Gals</h1>
                    <h1 className='text-9xl font-extrabold  text-blue-500'>Gals</h1>
                    <h1 className='text-9xl font-extrabold  text-blue-500'>Gals</h1>
                    <h1 className='text-9xl font-extrabold  text-blue-500'>Gals</h1>
                    <h1 className='text-9xl font-extrabold  text-blue-500'>Gals</h1>
                </div>
                </div>
                <div className='bg1 w-[50%] h-[100%]'>  
                   
                </div>
                <div className='bg2 w-[50%] h-[100%]'>

                </div>
                
           </div>
           
          
        <div className='w-[30%] h-[100%] p-2 flex items-center'>

            <div className='w-[96%] h-[100%] bg-white shadow-2xl p-5 rounded-md border flex flex-col justify-center items-center'>
                <div className='w-[100%] h-[20%]'>
                    <div className='w-[100%] h-[30%] pl-10 flex items-end'>
                        <h1 className='font-semibold text-2xl text-blue-400'>Welcome back, Admin!</h1>
                    </div>
                    <div className='w-[100%] h-[70%] pl-10 pr-10 flex items-center'>
                        <h1 className='font-thin text-sm'>Ready to lead with style and ensure every client enjoys the luxury they deserve? Let’s keep the salon running smoothly, so everyone leaves feeling confident and beautiful. Here's to a successful, glamorous day ahead!</h1>
                    </div>
                </div>
                <div className='w-[100%] h-[40%]'>
                    <div className='w-[100%] h-[20%] pl-10 pr-10 flex items-center'>
                        <h1 className='font-medium text-2xl'>Sign In</h1>
                    </div>
                    <form className='w-[100%] h-[80%] pl-10 pr-10' onSubmit={handleLogin}>
                        <div className='w-[100%] h-[17%] mb-2'>
                                <input
                                type="email"
                                id="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className=" w-[100%] h-[100%] focus:outline-violet-400 pl-5 border border-blue-400"
                                required
                            />
                        </div>
                        <div className='w-[100%] h-[17%] mb-5'>
                                <input
                                type="password"
                                id="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-[100%] h-[100%] focus:outline-violet-400 pl-5 border border-blue-400"
                                required
                            />
                        </div>
                        {error && (
                                <div className='text-red-500 mb-4 w-[100%] h-[10%] flex items-center justify-center'>{error}</div> // Display error message
                            )}
                        <div className='w-[100%] h-[17%] mb-3'>
                                <button className='w-[100%] h-[100%] bg-violet-500 text-white rounded-md hover:bg-violet-400' type="submit">Login</button>
                        </div>
                        <Link to={'/'}>
                        <div className='w-[100%] h-[17%] flex items-center justify-center border border-blue-400 cursor-pointer  hover:bg-gray-100 '>
                                <h1 className='text-medium text-blue-400'>Login as Customer</h1>
                        </div>
                        </Link>
                    </form>      
                </div>
            
           </div>
           <div className='w-[4%] h-[90%] flex flex-col'>
                    <div className='w-[100%] h-[9%] bg-pink-300'></div>
                    <div className='w-[100%] h-[9%] bg-violet-300'></div>
                    <div className='w-[100%] h-[9%] bg-violet-400'></div>
                    <div className='w-[100%] h-[9%] bg-violet-500'></div>
           </div>
        </div>
        </div>
    );
}

export default AdminLogin;
