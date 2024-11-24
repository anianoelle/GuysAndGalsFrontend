import { useEffect, useState } from 'react'
import "../output.css"
import { Link, replace } from 'react-router-dom'
import "../Homepage/Home.css"
import { useNavigate } from 'react-router-dom';
import p4 from "../assets/p4.jpg"
import axios from 'axios'; // Import axios
import video from "../assets/video.mp4"


function Home() {    

    const [cartItems, setCartItems] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFormOpen2, setIsFormOpen2] = useState(false);
    const [formContent, setFormContent] = useState({title: '', description: '', price: '', serviceID: '', image: ''});
    const [userData, setUserData] = useState({});
    const [userEmail, setUserEmail] = useState(null);
    const [serviceName, setServiceName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const today = new Date();
    const [showLogoutBox, setShowLogoutBox] = useState(false);
    const [services, setServices] = useState([]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

// Today's date (minimum date)
    const minDate = new Date().toISOString().split("T")[0];

// Last day of the current year (maximum date)
    const maxDate = new Date(currentYear, 11, 31).toISOString().split("T")[0];  


    const [loading, setLoading] = useState(true);

  
    const handleLogoutClick = () => {
        if(showLogoutBox == true)
            {
                setShowLogoutBox(false);
            }
        else
        {
            setShowLogoutBox(true);
        }   
    };


    useEffect(() => {
        // Retrieve the userEmail from localStorage
        const storedEmail = localStorage.getItem('userEmail');

        // Check if the storedEmail exists
        if (storedEmail) {
            setUserEmail(storedEmail); // Set the state if it exists
            console.log("User email found:", storedEmail);
        } else {
            console.log("No user email found in localStorage.");
        }
    }, []); // 



    const f = new Intl.DateTimeFormat("en-us", {dateStyle: "full"})
 
    // const handleLogout = () => {
    //     localStorage.removeItem('userToken'); 
    //     navigate('/'); 
    // };
    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        navigate('/');
    };

    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);


    const fetchUserAppointments = async () => {
        const storedEmail = localStorage.getItem('userEmail');
    
        try {
            const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/userappointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the correct key 'userEmail' instead of 'storedEmail'
                body: JSON.stringify({ userEmail: storedEmail }), 
            });
    
            const result = await response.json();
            console.log('Fetch result:', result);
    
            if (result.success) {
                setAppointments(result.data);   
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Error fetching appointments');
            console.error('Error:', error);
        }finally {
            setLoading(false); // Stop loading once the request completes
        }
    };
    
    useEffect(() => {
        fetchUserAppointments();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/service', {
                    method: 'GET', // No need for POST if you are just fetching data
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setServices(result.data); // Assuming the response contains a 'data' field
            } catch (err) {
                setError('Failed to fetch services.'); // Handle error
                console.error('Error fetching services:', err);
            } finally {
                setLoading(false); // Stop loading once the request completes
            }
        };

        fetchServices();
    }, []); // Empty dependency array to run this effect once on mount
    

    // const handleBooking = async () => {
    //     const userEmail = localStorage.getItem('userEmail'); // Assuming you store the user's email in localStorage
    //     const serviceName = formContent.title; // Assuming this is the service name
    
    //     try {
    //         const response = await axios.post('http://localhost:21108/api/v1/booking', {
    //             date,
    //             time,
    //             serviceName,
    //             userEmail
    //         });
    
    //         if (response.data.success) {
    //             alert(response.data.message);
    //             setIsFormOpen(false); // Close the form after successful booking
    //         } else {
    //             alert(response.data.message);
    //         }
    //     } catch (error) {
    //         console.error('Error booking the appointment:', error);
    //         alert('Booking failed. Please try again.');
    //     }
    // };

    const handleBooking = async (e) => {
        e.preventDefault();
    
        const bookingDetails = {
            date,
            time,
            serviceName: formContent.title, 
            userEmail 
        };
    
        console.log('Booking Details:', bookingDetails); // Log booking details before sending
    
        try {
            const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });
    
            const data = await response.json();
            if (data.success) {
                alert("Successfully booked");
                await handleBilling();
                window.location.reload(); 
            } else {
                alert("Booking failed"); // Alert for booking failure
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    const handleBilling = async () => {

        const storedEmail = localStorage.getItem('userEmail');
        const billingDate = f.format(today); 
        const totalAmount = totalPrice; 
        const userEmail = storedEmail; 

          // Log values to ensure they are being set correctly
        console.log("Billing Date:", billingDate);
        console.log("Total Amount:", totalAmount);
        console.log("User Email:", userEmail);
    
        try {
            const checkoutResponse = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/billing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    totalAmount,
                    billingDate,
                    userEmail,
                }),
            });
    
            const checkoutData = await checkoutResponse.json();
    
            if (checkoutResponse.ok) {
                console.log('Billing successful:', checkoutData.message);
                // You might want to handle any additional logic here, such as updating the UI or redirecting
            } else {
                console.error('Billing failed:', checkoutData.message);
            }
        } catch (error) {
            console.error('Error during billing:', error);
        }
    };

    
    useEffect(() => {
        // Retrieve the userEmail from localStorage
        const storedEmail = localStorage.getItem('userEmail');
        console.log("User email found wow:", storedEmail);

        const fetchUserData = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/userdetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: storedEmail }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                if (result.success) {
                    setUserData(result.data); // Store the user data
                } else {
                    console.error(result.message);
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false); // Stop loading once the request completes
            }
        };

        fetchUserData(); // Call the function to fetch user data
    }, []);
  

    

   const openForm = (title, description, price, serviceID, image) => {
    setFormContent({ title, description, price, serviceID, image});
    setIsFormOpen(true);
};

const openForm2 = () => {
    setIsFormOpen2(true);
};
    
    const handleRemoveFromCart = (title) => {
      // Remove the item from the cart
      setCartItems(cartItems.filter(item => item.title !== title));
  
      console.log('Item removed from cart:', title); // For testing
    };
  
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen); // Toggle modal visibility
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        // Change state based on scroll position
        if (window.scrollY > 100) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);


    const calculateTotalPrice = () => {
        return appointments.reduce((total, appointment) => {
            return total + appointment.price * appointment.quantity;
        }, 0);
    };
    
    const totalPrice = calculateTotalPrice();


    const handlenail = () => {
        const targetSection = document.getElementById('hair');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      };

    const handlehair = () => {
        const targetSection = document.getElementById('hair');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      };

    const handleabout = () => {
        const targetSection = document.getElementById('about');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      };



      
      let currentIndex = 0;

      // Function to move slides
      function moveSlide(direction) {
          const slides = document.querySelectorAll('.swiper-slide');
          const totalSlides = slides.length;
      
          currentIndex += direction;
      
          // Wrap around if at the ends
          if (currentIndex < 0) {
              currentIndex = totalSlides - 1;
          } else if (currentIndex >= totalSlides) {
              currentIndex = 0;
          }
      
          const swiperWrapper = document.querySelector('.swiper-wrapper');
          swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      
      // Automatic scrolling every 3 seconds (adjust if needed)
      setInterval(() => {
          moveSlide(1); // Move to the next slide
      }, 4000); // 3000 milliseconds = 3 seconds
      

      
      if (loading) return <div className='w-[100%] h-[100%] bg-black flex items-center justify-center absolute'>
      <h1 className='text-white text-2xl font-thin'>Loading...</h1>
      </div>;
      if (error) return <p>{error}</p>;
    
    


  return (
  <div className='w-screen h-screen flex flex-col items-center justify-center bg-white'>



                    {
                        isFormOpen2 && 
                        (
                            <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-40'>
                                <div className='w-[30%] h-[25%] rounded-md bg-white p-5 flex items-center justify-center flex-col'>
                                    <div className='w-[100%] h-[20%] flex items-center'>
                                        <h1 className='text-2xl font-semibold text-red-400'>Confirm Booking?</h1>
                                    </div>
                                    <div className='w-[100%] h-[40%] flex items-center'>
                                        <h1 className='text-sm font'>Please be aware that once you confirm your booking, it will be considered final. We are unable to accommodate any changes or cancellations to your appointment. Ensure all details are correct before finalizing your booking. Thank you for your understanding.</h1>
                                    </div>
                                    <div className='w-[100%] h-[40%] flex items-center justify-end pt-5'>
                                       <button className='border-2 text-violet-400 border-violet-400 rounded-sm pl-10 pr-10 pt-2 pb-2 mr-3' onClick={() => setIsFormOpen2(false)}>Not now</button>
                                       <button className='text-white bg-violet-400 rounded-sm pl-10 pr-10 pt-2 pb-2' onClick={handleBooking}>Confirm Booking</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                {isFormOpen && (
                   <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
                        <div className="w-[57%] h-[30%] bg-white flex relative flex-wrap">
                            <div className='w-[30%] h-[135%] bg-gray-100 absolute -bottom-[16.5%] left-[3%] border-2 border-violet-400'>
                                <img className='w-[100%] h-[100%] object-cover' src={formContent.image} alt="Service" />
                            </div>
                            <div className='w-[33%] h-[100%] border-t-blue-400 border-2 border-l-0 border-b-violet-400'>
                                <div className='w-[10%] h-[100%]'>
                                    <div className='h-[20%] w-[100%] bg-pink-400'>
                                    </div>
                                    <div className='h-[20%] w-[100%] bg-violet-400'>
                                    </div>
                                    <div className='h-[20%] w-[100%] bg-violet-500'>
                                    </div>
                                    <div className='h-[20%] w-[100%] bg-violet-600'>
                                    </div>
                                    <div className='h-[20%] w-[100%] bg-violet-700'>
                                    </div>
                                </div>
                            </div>
                            <div className='w-[67%] h-[100%] pl-3 relative overflow-hidden border-2 border-t-blue-400 border-r-0 border-b-violet-400'>
                                <div className='w-[100%] flex items-center'>
                                    <h1 className='font-thin text-6xl text-gray-600'>{formContent.title}</h1>
                                </div>
                                <div className='w-[100%] flex items-center'>
                                    <h1 className='text-lg font-thin'>{formContent.description}</h1>
                                </div>
                                <div className='w-[100%] flex items-center mt-2'>
                                    <div className='w-[40%] h-[100%] flex items-center text-xl font-thin'><h1>Service ID: <span className='text-violet-400'>{formContent.serviceID}</span></h1></div>
                                    <div className='w-[30%] h-[100%] flex items-center text-xl font-thin'><h1>Price: <span className='text-blue-400'>P {formContent.price}</span></h1></div>
                                </div>  
                                <div className='w-[100%] h-[20%] absolute bottom-0 flex pr-6 pb-1'>
                                    <div className='w-[70%] h-[100%] flex'>
                                        <div className='w-[60%] h-[100%] p-1 border rounded mr-2'>
                                            <input 
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)} 
                                                className='w-[100%] h-[100%] p-2 pl-5 pr-5 focus:outline-violet-400 rounded cursor-pointer' 
                                                aria-label="Date" 
                                                type="date" 
                                                min={minDate} // Sets min to today’s date
                                                max={maxDate} // Sets max to the last day of the current year
                                                required
                                            />
                                        </div>
                                        <div className='w-[40%] h-[100%] p-1 border rounded mr-2'>
                                            <input 
                                                value={time} 
                                                onChange={(e) => setTime(e.target.value)}  
                                                className='w-[100%] h-[100%] p-2 pl-5 pr-5 focus:outline-violet-400 rounded cursor-pointer' 
                                                aria-label="Time" 
                                                type="time" 
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='w-[30%] h-[100%] flex items-center justify-center'>
                                        <button onClick={() => openForm2()} className='w-[100%] h-[95%] border bg-violet-400 text-white rounded hover:bg-violet-500'>BOOK</button>
                                    </div>
                                </div>
                            </div>        
                        </div>

                        <div className="flex items-center  justify-center rounded-full w-[2%] bg-gray-100 opacity-40 ml-2 hover:opacity-80">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-600 text-md font-semibold p-2">x</button>
                        </div> 
                   </div>
                )}

                {isModalOpen && (
                    <div className="absolute w-[23%] right-0 h-[99%] bg-white z-50 border shadow-2xl mr-1">
                       
                        <div className='w-[100%] h-[7%] pl-5 flex'>
                           <div className='w-[50%] h-[100%] flex items-center'>
                             <h1 className='font-semibold text-gray-500 text-lg'>My Booking</h1>
                            </div>
                            <div className='w-[50%] h-[100%] flex items-start justify-end'>
                                <div onClick={toggleModal} className='w-[20%] h-[60%] hover:bg-gray-100 flex items-center justify-center pb-1 cursor-pointer'>
                                    <h1 className='text-2xl text-gray-400'>x</h1>
                                </div>
                            </div>
                        </div>

                        <div className='w-[100%] flex flex-col mb-5'>
                            <div className='w-[50%] h-[100%'>
                                <div className='w-[100%] h-[40%] pl-5 flex items-center'>
                                    <h1 className='text-gray-500 text-sm'>Date</h1>
                                </div>
                                <div className='w-[100%] h-[60%] pl-5 flex items-center'>
                                    <h1 className='text-gray-600 font-semibold'>{f.format(today)}</h1>
                                </div>
                            </div>
                            <div className='w-[50%] h-[100%]'>
                                <div className='w-[100%] h-[40%] pl-5 flex items-center'>
                                    <h1 className='text-gray-500 text-sm'>Billed to</h1>
                                </div>
                                <div className='w-[100%] h-[60%] pl-5 flex items-center'>
                                    <h1 className='font-semibold text-lg text-gray-600'>{userData.fname} {userData.lname}</h1>
                                </div>
                            </div>
                        </div>
                        
                        <div className='w-[100%] h-[5%] flex pl-5 pr-5'>
                            <div className='w-[50%] h-[100%] flex items-center'>
                                <h1 className='text-gray-500 font-semibold'>Service Name</h1>
                            </div>
                            <div className='w-[16.66%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-gray-500 font-semibold'>Price</h1>
                            </div>
                            <div className='w-[16.66%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-gray-500 font-semibold'>Quantity</h1>
                            </div>
                            <div className='w-[16.66%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-gray-500 font-semibold'>Total</h1>
                            </div>
                        </div>

                        <div className='w-[100%] h-[50%] overflow-y-scroll pl-5 pr-5'>
                            {appointments.length === 0 ? (
                                <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                    <h1 className='text-lg font-thin text-gray-400'>No appointments found.</h1>
                                </div>
                            ) : (
                                <ul>
                                    {appointments.map((appointment, index) => (
                                        <li  key={index} className="mb-1 h-[70px] w-[100%] flex">
                                            <div  className='w-[50%] h-[100%] flex items-center justify-start text-gray-500 text-xl font-thin'>
                                                <h1>{appointment.servicename}</h1>
                                            </div>
                                            <div className='w-[16.66%] h-[100%] flex items-center justify-center text-xl font-thin text-gray-500'>
                                                <h1 className='text-sm text-gray-500'>P{appointment.price}</h1>
                                            </div>
                                            <div  className='w-[16.66%] h-[100%] flex items-center justify-center'>
                                                <h1 className="text-sm  text-gray-500">{appointment.quantity}</h1>
                                            </div>
                                            <div  className='w-[16.66%] h-[100%] flex items-center justify-center'>
                                                <h1 className="text-sm text-gray-500">P {appointment.price * appointment.quantity}</h1>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>

                        <div className='w-[100%] h-[6%] flex items-center justify-end pr-7 pl-7'>
                            <div className='w-[100%] h-[100%] flex items-center justify-end border-t'>
                                <h1 className="text-md font-bold text-gray-600">Grand Total:<span className='text-blue-400'> P {totalPrice}</span></h1>
                            </div>
                        </div>
                        
                        <div className='w-[100%] pl-5 pr-5 mt-5'>
                            <Link to={"/Payment"} state={{ totalPrice }} className='w-[100%]'>
                                <button onClick={handleBilling}  className="bg-violet-500 hover:bg-violet-400 text-white p-2 rounded-sm w-[100%]">Continue to Checkout</button>
                            </Link> 
                        </div>

                    </div>
                )}


     
      <div className='w-[100%] h-[100%]'>

            <div  className='w-[100%] h-[7%]  flex justify-center items-center z-40 bg-opacity-60 relative'>
                
                <div className='w-[70%] h-[100%] flex items-center justify-center flex-wrap gap-2'>
                    
                    <div onClick={handlenail} className='cursor-pointer w-[10%] h-[100%] flex items-center justify-center border-b-2 border-transparent hover:border-blue-500 group'>
                        <button className='text-gray-500 font-semibold group-hover:text-blue-500'>Nail</button>   
                    </div>
                    <div onClick={handlehair} className='cursor-pointer w-[10%] h-[100%] flex items-center justify-center border-b-2 border-transparent hover:border-blue-500 group'>
                        <button className='text-gray-500 font-semibold group-hover:text-blue-500'>Hair</button>  
                    </div>
                    <div onClick={handleabout} className='cursor-pointer w-[10%] h-[100%] flex items-center justify-center border-b-2 border-transparent hover:border-blue-500 group'>
                        <button className='text-gray-500 font-semibold group-hover:text-blue-500'>About</button>
                    </div>
                    <div className='cursor-pointer w-[10%] h-[100%] flex items-center justify-center border-b-2 border-transparent hover:border-blue-500 group' onClick={handleBilling}>
                        <button className='text-gray-500 font-semibold group-hover:text-blue-500' onClick={toggleModal}>My Booking</button>
                    </div>
                    

                </div>

                <div className='w-[13%] h-[100%] absolute flex right-0 flex-wrap'>
                    <div className='cursor-pointer w-[60%] h-[100%] flex items-center justify-center border-b-4 border-transparent'>
                        <h1 className='text-gray-500 font-semibold'>{userData.fname} {userData.lname}</h1>
                    </div>
                    <div onClick={handleLogoutClick} className='cursor-pointer w-[40%] h-[100%] flex items-center justify-center relative border-b-2 border-transparent hover:border-violet-400 group'>
                        <button className='text-gray-500 font-semibold group-hover:text-violet-400'><h1>Logout</h1></button>
                        {showLogoutBox && (
                            <div className="absolute top-16 right-0 w-60 p-4 mr-1 mt-2 bg-white rounded-sm shadow-md border">
                                <p className="text-gray-700">Are you sure you want to log out?</p>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button 
                                        onClick={handleLogoutClick} 
                                        className="rounded border text-sm text-gray-500 hover:bg-gray-200 pl-4 pr-4"
                                    >
                                        Cancel
                                    </button>
                                    <button onClick={handleLogout} className="px-3 py-1 text-sm text-white bg-blue-400 rounded hover:bg-blue-500">
                                        Confirm
                                    </button>
                                </div>
                            </div>
                    )}
                    </div>
                </div>
          
            </div>

       
        <div className='main w-[100%] h-[65%] relative'>
            <div className='w-[100%] h-[100%] absolute bg-black opacity-40 flex items-center justify-center flex-col'>
                <h1 className='text-white text-9xl font-semibold'>GUYS & GALS</h1>
                <h1 className='text-white text-3xl font-thin'>Salon and Spa</h1>
            </div>
            <video className="w-[100%] h-[100%] object-cover" autoPlay muted loop>
                <source src={video} type="video/mp4" />
            </video>
        </div>

        <div className='w-[100%] flex items-center justify-center'>

            <div className='w-[90%] flex flex-col'>

              <div className='w-[100%] flex flex-col justify-center items-center mb-20 mt-10 flex-wrap'>
                  <div className='w-[100%] h-[100px] flex items-end justify-center'>
                      <h1 className='text-3xl font-thin text-gray-500'>WELCOME TO GUYS & GALS SALON</h1>
                  </div>
                  <div className='w-[100%] h-[100px] flex items-center justify-center'>
                      <h1 className='w-[65%] text-center text-xl text-gray-500'>Step into a world of relaxation and elegance at our salon and spa, where every visit is a journey to rejuvenation. Let us pamper you with exceptional beauty treatments and serene spa experiences, tailored to your every need.</h1>
                  </div>
              </div>
              
              <div className='w-[100%] h-[500px] flex flex-wrap gap-4'>    
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide slide1 flex justify-start">
                            <div className='w-[50%] flex ml-24'>
                                <h1 className='text-7xl text-gray-600 font-semibold'>Indulge in luxury. Your beauty deserves it.</h1>
                            </div>
                        </div>
                        <div className="swiper-slide slide2 flex items-center justify-center">
                            <div className='flex w-[100%] h-[20%] items-center justify-center'>
                                <h1 className='text-6xl text-white font-light'>True beauty radiates from the inside out.</h1>
                            </div>
                        </div>
                        <div className="swiper-slide slide3 flex items-center justify-start">
                            <div className='flex w-[40%] h-[20%] items-center justify-center ml-24'>
                                <h1 className='text-5xl text-white font-thin'>A little self-care goes a long way, In Guys & Gals.</h1>
                            </div>
                        </div>
                        <div className="swiper-slide slide4 flex items-center justify-start">
                            <div className='flex w-[50%] h-[20%] items-center justify-center ml-24'>
                                <h1 className='text-6xl text-white font-bold'>Enhancing your natural beauty.</h1>
                            </div>
                        </div>
                    </div>
                    {/* <button className="prev" onClick={() => moveSlide(-1)}>&#10094;</button>
                    <button className="next" onClick={() => moveSlide(1)}>&#10095;</button> */}
                </div>
              </div>


              <div className='w-[100%] h-[100px] flex items-center justify-center mt-20'>
                  <h1 className='text-3xl font-thin text-gray-500'>SERVICES WE OFFER</h1>
              </div>


                <div className='w-[100%] flex flex-col bg'>
               
                <div id="hair" className='w-[100%] h-[50px] flex items-center justify-center mt-0 mb-10 bg-violet-300'>
                    <h1 className='text-xl text-white'>COMBO RATES</h1>
                </div>

                <div className='w-[100%] flex items-center justify-center mb-4 flex-wrap gap-4'>
                        {services.map((service) => (
                            <div key={service.id} className='w-[565px] h-[300px] flex'>
                                <div className=' h-[100%] w-[50%] flex relative items-center'>
                                    <div className='w-[80%] h-[90%] bg-violet-200 shadow-xl'>
                                        
                                    </div>
                                    <div className='w-[80%] h-[100%] absolute right-0 border-2 border-violet-300 shadow-xl'>
                                        <img className='w-[100%] h-[100%] object-cover' src={service.image}></img>
                                    </div>
                                </div>
                                <div className='h-[100%] w-[50%]'>
                                    <div className='w-[100%] h-[25%] flex items-center pl-2'>
                                        <h1 id="item-title" className='text-3xl font-thin text-gray-500'>{service.servicename}</h1>
                                    </div>
                                    <div className='w-[100%] h-[50%]  pl-2'>
                                        <h2 className='text-gray-500'>{service.description}</h2>
                                    </div>
                                    <div className='w-[100%] h-[25%]  flex'>
                                        <div className='w-[50%] h-[100%] pl-2'>
                                            <h1 className='text-2xl text-violet-400'>P {service.price}</h1>
                                        </div>      
                                        <div className='w-[50%] h-[100%] flex justify-end items-start'>
                                            <button className='pl-6 pr-6 pt-2 pb-2 text-gray-500 text-md font-thin hover:border-violet-400 border rounded'  onClick={() => openForm(service.servicename, service.description, service.price, service.serviceid, service.image)}>Book</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>  

                    {/* <div id="nail" className='w-[100%] h-[50px] flex items-center justify-center mt-20 mb-10 bg-blue-200'>
                         <h1 className='text-xl text-white'>NAIL SERVICES</h1>
                    </div>

                    <div className='w-[100%] flex items-center justify-center mb-4 flex-wrap gap-4'>
                        {services.map((service) => (
                            <div key={service.id} className='w-[565px] h-[300px] flex'>
                                <div className=' h-[100%] w-[50%] flex relative items-center'>
                                    <div className='w-[80%] h-[90%] bg-violet-200'>
                                        
                                    </div>
                                    <div className='w-[80%] h-[100%] absolute right-0'>
                                        <img className='w-[100%] h-[100%] object-cover' src={service.image}></img>
                                    </div>
                                </div>
                                <div className='h-[100%] w-[50%]'>
                                    <div className='w-[100%] h-[25%] flex items-center pl-2'>
                                        <h1 id="item-title" className='text-3xl font-thin text-gray-500'>{service.servicename}</h1>
                                    </div>
                                    <div className='w-[100%] h-[50%]  pl-2'>
                                        <h2 className='text-gray-500'>{service.description}</h2>
                                    </div>
                                    <div className='w-[100%] h-[25%]  flex'>
                                        <div className='w-[50%] h-[100%] pl-2'>
                                            <h1 className='text-2xl text-violet-400'>{service.price}</h1>
                                        </div>      
                                        <div className='w-[50%] h-[100%] flex justify-end items-start'>
                                            <button className='pl-6 pr-6 pt-2 pb-2 text-gray-500 text-md font-thin hover:border-violet-400 border rounded'  onClick={() => openForm(service.servicename, service.description, service.price, service.serviceid)}>Book</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>   */}


                </div>

                <div className='w-[100%] h-[50px] mt-40 flex items-center justify-center mb-10 bg-blue-300'>
                        <h1 className='text-3xl text-white   font-thin'>Happy Customers</h1>
                </div>

                <div className='w-[100%] h-[20%] flex items-center justify-center relative cursor-pointer'>
                    <div className="marquee-container">
                        <div className="marquee-content">
                            <div className="marquee-item relative z-50">
                                <div className='w-[23%] h-[100%] relative flex justify-center pt-4'>
                                    <div className='w-[71%] h-[45%] rounded-full border-2 border-blue-400 mt-3'>
                                        <img className='w-[100%] h-[100%] rounded-full' src='https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-1/434033708_2303243103204529_7726839922375254016_n.jpg?stp=dst-jpg_s200x200&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeH6AYQ9Yh7fIPVfLwkgzhWb8WcCTUDRP9bxZwJNQNE_1mUGtW_gi9rXned2yEEWM08TkRsoiy85r4OTApGte_KZ&_nc_ohc=2x1utJum5rsQ7kNvgH1Su1q&_nc_zt=24&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=A5DWCbvlxFIP0sTr00KuP3_&oh=00_AYA_3DAvD_olpVELYymm0CGxOJ6l9ayfGFtdYDGEsO72rA&oe=6737A3A0'></img>
                                    </div>
                                </div>
                                <div className='w-[77%] h-[100%] flex items-center justify-center flex-col'>
                                    <div className='w-[100%] flex items-center mb-1'>
                                        <h1 className='text-2xl font-thin'>Drexler Arroyo</h1>
                                    </div>
                                    <div className='w-[100%] flex items-center'>
                                        <h1 className='text- font-thin w-[95%] text-gray-700'><span className='text-2xl font-semibold text-violet-400'>"</span>I had a facial and it was out of this world! My skin feels amazing, and the service was so relaxing. I can’t wait for my next visit.<span className='text-2xl font-semibold text-violet-400'>"</span></h1>
                                    </div>
                                </div>
                            </div>
                            <div className="marquee-item relative z-50">
                                <div className='w-[23%] h-[100%] relative flex justify-center pt-4'>
                                    <div className='w-[71%] h-[45%] rounded-full border-2 border-blue-400 mt-3'>
                                        <img className='w-[100%] h-[100%] rounded-full' src='https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-1/434649495_2324702757719231_5510553949043464221_n.jpg?stp=dst-jpg_s160x160&_nc_cat=100&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeGA_ASg6joCbU4OBlYMvUowTE1QlWKTZx5MTVCVYpNnHiDa50jHHLP32eQX9POelG91gAXsKsFhvk_MuOzzgQNH&_nc_ohc=Zdx18xkKlkkQ7kNvgG9yqh5&_nc_zt=24&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=AeAS62RcjVJAIPZQUdzUp8g&oh=00_AYCsYYL4HEb5oK3O3GuZIT6tjzVPKixYeoN8eRrfbdlsew&oe=6737C16B'></img>
                                    </div>
                                </div>
                                <div className='w-[77%] h-[100%] flex items-center justify-center flex-col'>
                                    <div className='w-[100%] flex items-center mb-1'>
                                        <h1 className='text-2xl font-thin'>Christian Manisan</h1>
                                    </div>
                                    <div className='w-[100%] flex items-center'>
                                        <h1 className='text- font-thin w-[95%] text-gray-700'><span className='text-2xl font-semibold text-violet-400'>"</span>I love how my stylist took the time to understand my hair type and offered suggestions that worked for me. It felt like a truly personalized experience.<span className='text-2xl font-semibold text-violet-400'>"</span></h1>
                                    </div>
                                </div>
                            </div>
                            <div className="marquee-item relative z-50">
                                <div className='w-[23%] h-[100%] relative flex justify-center pt-4'>
                                    <div className='w-[71%] h-[45%] rounded-full border-2 border-blue-400 mt-3'>
                                        <img className='w-[100%] h-[100%] rounded-full' src='https://ibb.co/phVX3PF'></img>
                                    </div>
                                </div>
                                <div className='w-[77%] h-[100%] flex items-center justify-center flex-col'>
                                    <div className='w-[100%] flex items-center mb-1'>
                                        <h1 className='text-2xl font-thin'>Ania Noelle Bate</h1>
                                    </div>
                                    <div className='w-[100%] flex items-center'>
                                        <h1 className='text- font-thin w-[95%] text-gray-700'><span className='text-2xl font-semibold text-violet-400'>"</span>I’ve never had such an amazing salon experience! The staff was so friendly and professional, and my hair turned out exactly how I wanted it. I’ll definitely be back!<span className='text-2xl font-semibold text-violet-400'>"</span></h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="marquee-content">
                        <div className="marquee-item relative z-50">
                                <div className='w-[23%] h-[100%] relative flex justify-center pt-4'>
                                    <div className='w-[71%] h-[45%] rounded-full border-2 border-blue-400 mt-3'>
                                        <img className='w-[100%] h-[100%] rounded-full' src='https://scontent.fdvo2-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeEZ0kDwkUHM4l_3lpz-YjVLWt9TLzuBU1Ba31MvO4FTULTP3cIcI4EmJjy9lTdh7ZTIRNClKCc8Px04EkkW9od1&_nc_ohc=WMJtxxUeM4wQ7kNvgFpF9PR&_nc_zt=24&_nc_ht=scontent.fdvo2-2.fna&_nc_gid=ADRXSV_ipIGa0nJoGxP7gCH&oh=00_AYDmcHAQrzPXAo2e0KxFGnHlnNAjlB2Yx7GoCvapCnRCAw&oe=6759533A'></img>
                                    </div>
                                </div>
                                <div className='w-[77%] h-[100%] flex items-center justify-center flex-col'>
                                    <div className='w-[100%] flex items-center mb-1'>
                                        <h1 className='text-2xl font-thin'>Marc Angel Villarosa</h1>
                                    </div>
                                    <div className='w-[100%] flex items-center'>
                                        <h1 className='text- font-thin w-[95%] text-gray-700'><span className='text-2xl font-semibold text-violet-400'>"</span>The moment I walked in, I felt relaxed. The atmosphere is so calming, and the attention to detail is incredible. I left feeling pampered and refreshed!<span className='text-2xl font-semibold text-violet-400'>"</span></h1>
                                    </div>
                                </div>
                            </div>
                            <div className="marquee-item relative z-50">
                                <div className='w-[23%] h-[100%] relative flex justify-center pt-4'>
                                    <div className='w-[71%] h-[45%] rounded-full border-2 border-blue-400 mt-3'>
                                        <img className='w-[100%] h-[100%] rounded-full' src='https://scontent.fmnl13-3.fna.fbcdn.net/v/t39.30808-1/464193224_8666897860020662_4981528004829076617_n.jpg?stp=dst-jpg_s200x200&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFmmm1avpsa6nnOQQy2qJEAntK911Wl6xme0r3XVaXrGVCoWwl1Y7mLmbRiHJLxxq4l97OXHAN-dcvwOS3ue-HQ&_nc_ohc=lHQ-X1wI870Q7kNvgFZLBM6&_nc_zt=24&_nc_ht=scontent.fmnl13-3.fna&_nc_gid=ArVEosU7sL-Lp09eHyzf3JH&oh=00_AYAmaWFqCKkLbdL-7RsMspTWhz3ePaadVLrem1EJmsAgVA&oe=6737A134'></img>
                                    </div>
                                </div>
                                <div className='w-[77%] h-[100%] flex items-center justify-center flex-col'>
                                    <div className='w-[100%] flex items-center mb-1'>
                                        <h1 className='text-2xl font-thin'>Adrian Hinayon</h1>
                                    </div>
                                    <div className='w-[100%] flex items-center'>
                                        <h1 className='text- font-thin w-[95%] text-gray-700'><span className='text-2xl font-semibold text-violet-400'>"</span>The stylist was not only skilled but also listened to exactly what I wanted. I felt like they truly cared about making my hair look its best.<span className='text-2xl font-semibold text-violet-400'>"</span></h1>
                                    </div>
                                </div>
                            </div>
                            <div className="marquee-item relative z-50">
                                <div className='w-[23%] h-[100%] relative flex justify-center pt-4'>
                                    <div className='w-[71%] h-[45%] rounded-full border-2 border-blue-400 mt-3'>
                                        <img className='w-[100%] h-[100%] rounded-full' src='https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-1/448375846_3694200794229927_7501093875120730384_n.jpg?stp=dst-jpg_s200x200&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEStspQWqUq6N9x4JOVUg-EomkZ4YOnJuGiaRnhg6cm4caLxkdLI-KIZ7QFOu8V8FysC45G61njrzfjr-Wom3Ap&_nc_ohc=TzxnayBj5NoQ7kNvgHj8uD2&_nc_zt=24&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=AVmEeWDgT1lCd9QZrw7cD9h&oh=00_AYAO6w4k7BNQ3ogL2othcPXHDvaLd8onOZ3-3n5xF3n4CQ&oe=6737D04F'></img>
                                    </div>
                                </div>
                                <div className='w-[77%] h-[100%] flex items-center justify-center flex-col'>
                                    <div className='w-[100%] flex items-center mb-1'>
                                        <h1 className='text-2xl font-thin'>Crown James Cedeno</h1>
                                    </div>
                                    <div className='w-[100%] flex items-center'>
                                        <h1 className='text- font-thin w-[95%] text-gray-700'><span className='text-2xl font-semibold text-violet-400'>"</span>I’m always a little nervous trying a new stylist, but they really knew their stuff. My hair has never looked better! I’m so happy with the results.<span className='text-2xl font-semibold text-violet-400'>"</span></h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
      </div>

        </div>

      </div>

     

      <div className='w-[100%] h-[450px] mt-36'>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.4981130418023!2d125.60441580000001!3d7.068098099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96d0055edfc7d%3A0x975465e8c885a63f!2sGuys%20and%20Gals%20Hair%20Salon%20and%20Spa!5e0!3m2!1sen!2sph!4v1730718250434!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map of Guys and Gals Hair Salon and Spa"
        ></iframe>
    </div>


      <div id='about' className='w-[100%] h-[42%] bg-gray-900 flex items-center justify-center flex-col flex-wrap gap-5'>
           <div className='w-[60%] h-[50%] flex'>
                
                <div className='w-[30%] h-[100%]'>
                    <h1 className='text-6xl font-thin text-gray-200'>Guys&Gals</h1>
                </div>
                <div className='w-[27%] h-[100%]'>
                    <div className='flex pb-2 pt-2'>
                        <h1 className='font-semibold text-gray-200 text-lg'>LOCATION</h1>
                    </div>
                    <div className='flex'>
                        <a target='blank' href='https://www.google.com/maps/place/Guys+and+Gals+Hair+Salon+and+Spa/@7.0681034,125.5995449,17z/data=!3m1!4b1!4m6!3m5!1s0x32f96d0055edfc7d:0x975465e8c885a63f!8m2!3d7.0680981!4d125.6044158!16s%2Fg%2F11y2fn0f58?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D'>
                            <h1 className=' text-gray-200 text-md w-[85%] hover:text-gray-500'>San Pedro Street ,Poblacion DIsctrict, Davao City, 8000 Davao del Sur</h1>
                        </a>
                    </div>
                    <div className='flex mt-1'>
                         <a target='blank' href='https://www.google.com/maps/place/Guys+and+Gals+Hair+Salon+and+Spa/@7.0688083,125.602548,17z/data=!4m10!1m2!2m1!1sGuys+and+Gals+Hair+Salon+and+Spa+Illustre!3m6!1s0x32f96d77119cb53d:0xbef3a891190b17b6!8m2!3d7.0695079!4d125.6058301!15sCilHdXlzIGFuZCBHYWxzIEhhaXIgU2Fsb24gYW5kIFNwYSBJbGx1c3RyZZIBDGJlYXV0eV9zYWxvbuABAA!16s%2Fg%2F11f089xq2m?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D'>
                            <h1 className=' text-gray-200 text-md w-[85%] hover:text-gray-500 '>Illustre Street, Poblacion DIsctrict, Davao City, 8000 Davao del Sur</h1>
                        </a>
                    </div>
                    <div className='flex mt-1'>
                        <h1 className=' text-gray-200 text-md'>0925 655 0522</h1>
                    </div>
                </div>
                <div className='w-[25%] h-[100%]'>
                    <div className='flex pb-2 pt-2'>
                        <h1 className='font-semibold text-gray-200 text-lg'>SERVICES</h1>
                    </div>
                    <div className='flex'>
                            <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer'>Cutting</h1>
                            <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer ml-5'>Hair Color</h1>
                    </div>
                    <div className='flex'>
                            <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer'>Spa</h1>
                            <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer ml-5'>Treatment</h1>
                    </div>
                    <div className='flex'>
                        <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer'>Pedicure</h1>
                        <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer ml-5'>Manicure</h1>
                    </div>
                    <div className='flex'>
                        <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer'>Nail Extension</h1>
                        <h1 className='text-gray-200 text-md hover:text-gray-500 cursor-pointer ml-5'>Wax Treatment</h1>
                    </div>
                </div>
                
                <div className='w-[18%] h-[100%]'>
                    <div className='flex pb-2 pt-2'>
                        <h1 className='font-semibold text-gray-200 text-lg'>FOLLOW US</h1>
                    </div>
                    <a target='blank' href='https://www.facebook.com/guysngalsilustre/'><i class="fa fa-facebook-f"></i></a>
                </div>

           </div>    

           <div className='w-[60%] h-[20%] flex items-center'>
                <h1 className='text-gray-200 font-thin'>©2024 Guys&Gals. All rights reserved. Website built by <span className='cursor-pointer text-violet-500 hover:text-gray-500'><a target='blank' href='https://www.facebook.com/marcangel.villarosa.5'>Marc Angel Villarosa</a></span>, <span className='cursor-pointer text-violet-500 hover:text-gray-500'><a target='blank' href='https://www.facebook.com/aney.ugh'>Ania Noelle Bate</a></span>, <span className='cursor-pointer text-violet-500 hover:text-gray-500'><a target='blank' href='https://www.facebook.com/adrian.hinayon28'>Adrian Hinayon</a></span></h1>
           </div>                 

      </div>
      

      </div> 

      

  </div>
  )
}

export default Home
