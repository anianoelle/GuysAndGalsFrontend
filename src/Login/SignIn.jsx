import { useEffect, useState } from 'react'
import "../output.css"
import "../Login/SignIn.css"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import bg from "../assets/background.png"
import Carousel from './Carousel';



function SignIn() {    
 
  const navigate = useNavigate();
  const [data, setData] =useState([])
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
    
  //   // Send the username and password to the backend for validation
  //   try {
  //     const response = await fetch('http://localhost:21108/api/v1/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     // Check if login is successful
  //     if (data.success) {
  //       window.alert('Login successful!');
  //       setLoginStatus('Login successful!');
  //       localStorage.setItem('userEmail', email);
  //       navigate('/Home');
  //     } else {
  //       setLoginStatus('Invalid email or password');
  //     }
  //   } catch (err) {
  //     console.error('Error:', err);
  //     setLoginStatus('An error occurred');
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Send the username and password to the backend for validation
    try {
      const response = await fetch('http://localhost:21108/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Check if login is successful
      if (data.success) {
        window.alert('Login successful!');
        setLoginStatus('Login successful!');
        
        // Store the user email or other identifying information in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userLoggedIn', 'true'); // Storing login status

        // Redirect to the Home page
        navigate('/Home');
      } else {
        setLoginStatus('Invalid email or password');
      }
    } catch (err) {
      console.error('Error:', err);
      setLoginStatus('An error occurred');
    }
  };

 

  useEffect(() =>
    {
      fetch('http://localhost:21108/api/v1/users')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
    }, [])


    

  return (
  <div className='bg w-screen h-screen flex justify-center items-center bg-red-300'>
        <div className='w-[100%] h-[100%] bg-white relative'>
            
            {modalVisible && (
              
            <div className='w-[25%] h-[100%] absolute right-0 p-2 flex z-50'>  
              <div className='w-[100%] h-[100%] flex items-center justify-center'> 
                <form className='w-[96%] h-[100%] bg-white rounded-lg flex flex-col items-center justify-center border shadow-2xl relative' onSubmit={handleLogin}>
                 
                  <div className='w-[100%] h-[5%] absolute top-0 flex justify-end pr-1 pt-1'>
                      <div className='w-[10%] h-[100%] flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-md pb-1'    onClick={() => setModalVisible(false)} >
                            <h1 className='text-2xl text-gray-400'>x</h1>
                      </div>
                  </div>
                    <div className='w-[80%] h-[10%] flex items-center'>
                        <h1 className='font-extrabold text-4xl'><span className='text-violet-500'>Guys</span><span className='text-gray-600'> &</span><span className='text-blue-500'> Gals</span></h1>
                    </div>
                    
                    <div className='w-[100%] h-[25%] flex flex-col items-center justify-center'>
                        <div className='w-[80%] h-[20%] flex items-center'>
                            <h1 className='text-lg font-thin'>Welcome Back</h1>
                        </div>
                        <div className='w-[80%] h-[20%] border border-gray-500 mb-2.5'>
                            <input
                              className='w-[100%] h-[100%] p-3 focus:outline-violet-400' 
                              type="text"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                        </div>
                        <div className='w-[80%] h-[20%] border border-gray-500'>
                            <input
                              className='w-[100%] h-[100%] p-3 focus:outline-violet-400'
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                        </div>
                        <div className='w-[80%] h-[20%] flex items-center justify-center'>
                            {loginStatus && <p className='text-red-400'>{loginStatus}</p>}
                        </div>
                    </div>
                    <div className='w-[100%] h-[5%] flex items-center justify-center mb-2'>
                        <button className='w-[80%] h-[100%] bg-violet-500 rounded-md text-white' type="submit">Login</button>
                    </div>
                    <div className='w-[100%] h-[5%] flex items-center justify-center'>

                        <div className='w-[80%] h-[100%] flex items-center justify-center border border-gray-400 hover:border-blue-400 group'>
                              <Link className='w-[100%] flex items-center justify-center' to={'AdminLogin'}>
                                 <h1 className=' text-gray-600 group-hover:text-blue-400'>Log In as Admin</h1>
                              </Link>
                        </div> 
             
                    </div> 
                    <div className='w-[100%] h-[23%] flex items-center flex-col'>
                      <div className='w-[100%] h-[25%] flex items-end pb-2 justify-center mt-3 '>
                            <h1 className='text-gray-500'>Don't have account yet?</h1>
                      </div>
                        <Link to={'SignUp'} className='w-[80%] h-[21%]'>
                          <button className='text-lg border border-violet-400 text-violet-400 w-[100%] h-[100%]'>Create Account</button>
                        </Link>
                    </div>

                </form>

                <div className='w-[4%] h-[90%] flex flex-col'>
                    <div className='w-[100%] h-[10%] bg-pink-300'></div>
                    <div className='w-[100%] h-[10%] bg-violet-300'></div>
                    <div className='w-[100%] h-[10%] bg-violet-400'></div>
                    <div className='w-[100%] h-[10%] bg-violet-500'></div>
                </div>

                  </div>
              </div>
            )}

          <div className=' w-[100%] h-[100%] overflow-y-scroll'> 
              
              <div className='w-[100%] h-[5%] flex justify-end items-center pl-5 pr-5 absolute z-40'>
                  <div className='w-[7%] h-[100%] rounded-lg rounded-tl-none rounded-tr-none bg-blue-300 flex items-center justify-center hover:cursor-pointer'>
                      <h1 className='text-sm text-white' onClick={() => setModalVisible(!modalVisible)}>LOGIN</h1>
                  </div>
              </div>

              <div className='bg3 w-[100%] h-[85%] bg-gray-100 flex items-center justify-center flex-col'>
                  <div className='w-[65%] h-[20%] ml-10'>
                      <h1 className='text-7xl w-[65%] font-semibold'>It's A Better Way To Book Your Next Haircut</h1>
                  </div>
                  <div className='w-[65%] h-[10%] ml-10'>
                      <h1 className='text-2xl w-[58%] font-thin'>Effortlessly book your next haircut, explore new styles, and connect with expert stylists who bring your vision to life with just a few clicks.</h1>
                  </div>
                  <div className='w-[65%] h-[15%] ml-10'>
                      <button onClick={() => setModalVisible(!modalVisible)} className='w-[17%] h-[43%] bg-blue-400 text-lg hover:bg-violet-400 text-white rounded-sm'>Book Now</button>
                  </div>
              </div>

              <div className='w-[100%] h-[75%] flex justify-center items-center mt-16'>
                    
                    <div className='w-[45%] h-[100%] flex flex-col items-center justify-center'>   
                        <div className='w-[70%] h-[10%] flex items-center'>
                            <div className='w-[10%] h-[15%] bg-violet-400 mr-3'></div>
                            <h1 className='text-4xl font-semibold text-gray-600'>ABOUT US</h1>
                        </div>
                        <div className='w-[70%] h-[40%]'>
                            <h1 className='font-thin text-2xl text-gray-600'>Established in 2004, we at Guys & Gals Salon have become a well-respected name in Davao City's hair and nail care industry. Inspired by our founder Gloria Ang's journey to create a relaxing sanctuary for those seeking quality beauty treatments, we strive to provide exceptional services. Conveniently located in the heart of Davao City, we continue to cater to a diverse clientele, offering personalized care in a comfortable atmosphere where everyone can feel pampered and rejuvenated.</h1>
                        </div>
                    </div>
                    <div className='w-[45%] h-[100%] flex items-center relative'>
                          <div className='img1 w-[45%] h-[80%] bg-gray-300 z-40 ml-28'></div>
                          <div className='img2 w-[50%] h-[95%] bg-gray-400 absolute right-0'></div>
                    </div>

              </div>

              <div className='w-[100%] h-[15%] flex items-center justify-center flex-col mt-20'>
                    <h1 className='text-4xl font-semibold text-gray-700'>The Professionals</h1>
                    <div className='w-[3%] h-[5%] bg-blue-400 mt-3'></div>
              </div>

              <div className='w-[100%] h-[40%] flex items-center justify-center relative'>
              <Carousel>
                <div><h1>Tata Marsada Quimpan</h1></div>
                <div><h1>Rowena	Palma</h1></div>
                <div><h1>Aurora	Rubia</h1></div>
                <div><h1>Arman Buscato</h1></div>
                <div><h1>Cheryl Otazo</h1></div>
                <div><h1>Angelyn Omale</h1></div>
                <div><h1>Rusty Cauilanza</h1></div>
                <div><h1>Chesil	Padual</h1></div>
              </Carousel>
              </div>

              <div className='w-[100%] h-[80%] flex items-center flex-col'>
                 
                  <div className='w-[90%] h-[40%]'>
                      <div className='h-[60%] w-[100%] flex items-center justify-end flex-col'>
                          <h1 className='text-4xl font-semibold mb-3 text-gray-800'>Services</h1>
                          <div className='w-[3%] h-[5%] bg-violet-400'> </div>
                      </div>
                      <div className='h-[40%] w-[100%] flex items-center justify-center text-center'>
                          <h1 className='w-[70%] text-xl font-thin text-gray-700'>Experience the art of beauty at our salon, where every service is crafted to meet your unique needs. From precision haircuts and styling to indulgent spa treatments, our expert staff is committed to helping you look and feel your best.</h1>
                      </div>
                  </div>

                  <div className='w-[90%] h-[60%] flex justify-center'>
                    <div className='sv1 w-[23%] h-[100%] bg-red-100 mr-16 flex items-end'>
                        <div className='w-[100%] h-[20%] flex items-center justify-center'>
                              <h1 className='text-3xl text-white'>Hair Services</h1>
                        </div>
                    </div>
                    <div className='sv2 w-[23%] h-[100%] bg-red-100 flex items-end'>
                        <div className='w-[100%] h-[20%] flex items-center justify-center'>
                              <h1 className='text-3xl text-white'>Nail Services</h1>
                        </div>
                    </div>
                    <div className='sv3 w-[23%] h-[100%] bg-red-100 ml-16 flex items-end'>
                        <div className='w-[100%] h-[20%] flex items-center justify-center'>
                              <h1 className='text-3xl text-white'>Spa Services</h1>
                        </div>
                    </div>     
                  </div>  

              </div>

              <div className='w-[100%] h-[15%] flex items-center justify-center'>
                      <button onClick={() => setModalVisible(!modalVisible)} className='w-[9%] h-[40%] text-blue-500 border border-blue-500 font-semibold hover:border-violet-500 hover:text-violet-500'>View All</button>
              </div>



              <div className='w-[100%] h-[15%] mt-16 flex flex-col items-center justify-center bg-gray-800'>
                  <div className='w-[100%] h-[60%] flex items-center justify-center'>
                      <div className='w-[12%] h-[100%] flex items-center justify-center '>
                          <h1 className='text-3xl text-blue-500'>Guys<span className='text-gray-300'>&</span><span className='text-violet-500'>Gals</span></h1>
                      </div>
                      <div className='h-[100%] flex items-center justify-center pl-5 pr-5'>
                          <h1 className='text-gray-300'>0925 655 0522</h1>
                      </div>
                      <div className='h-[100%] flex items-center justify-center pl-5 pr-5'>
                        <a className='flex hover:text-blue-500 group' target='blank' href='https://www.facebook.com/guysngalsilustre/'>
                            <i class="fa fa-facebook-f mr-3 group-hover:text-blue-500"></i>
                            <h1 className='text-gray-300 group-hover:text-blue-500'>Guys n Gals Hair Salon & Spa </h1>
                        </a>
                      </div>
                  </div>
                  <div className='w-[100%] h-[40%] flex items-center justify-center bg-gray-700'> 
                    <div className='w-[25%] h-[100%] flex items-center justify-center'>
                          <h1 className='text-gray-300'>© 2024 Guys&Gals</h1>
                    </div>       
                  </div>
              </div>  

          </div>



        </div>
  </div>
  )
}

export default SignIn
