import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "../admin/admin.css"
import client from "../assets/client.png"
import appointmentimg from "../assets/appointment.png"
import serviceimg from "../assets/service.png"
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { color } from 'chart.js/helpers';
import { FaCalendarAlt } from 'react-icons/fa';
import man1 from "../assets/man1.png"
import man2 from "../assets/man2.png"
import man3 from "../assets/man3.png"
import woman1 from "../assets/woman1.png"
import woman2 from "../assets/woman2.png"
import woman3 from "../assets/woman3.png"
import woman4 from "../assets/woman4.png"
import woman5 from "../assets/woman5.png"
import woman6 from "../assets/woman6.png"
import staff from "../assets/employee.png"
import Home from "../Homepage/Home";


const AdminInterface = () => {

    const [showLogoutBox, setShowLogoutBox] = useState(false);
    const [toggleState, setToggleState] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [customershasappointment, setCustomersHasAppointment] = useState([]);
    const [admin, setAdmin] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [hasappointments, setHasAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [paidAppointments, setPaidAppointments] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [priceData, setPriceData] = useState([]);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    
    const [selectedService, setSelectedService] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [servicename, setServicename] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [amountToAdd, setAmountToAdd] = useState(0);
   



    const handleLogoutClick = () => {
        setShowLogoutBox(true); // Show the box when "Logout" is clicked
    };

    const handleCloseBox = () => {
        setShowLogoutBox(false); // Close the box when clicking outside or on "Cancel"
    };


    const handleServiceClick = (service) => {
        setSelectedService(service);
        setDropdownOpen(false); // Close the dropdown after selection
    };


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const [priceDataPerDate, setPriceDataPerDate] = useState([]);
    const [priceDataPerWeek, setPriceDataPerWeek] = useState([]);
    const [yearlyPriceData, setYearlyPriceData] = useState([]);
    const [monthlyPriceData, setMonthlyPriceData] = useState([]);

    const totalAmount = services.reduce((total, service) => total + service.Price, 0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Generate days of the week labels
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    
  
    // Helper to get the first day of the current month
    const getFirstDayOfMonth = () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
    // Function to change the month
    const changeMonth = (direction) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + direction);
      setCurrentDate(newDate);
      setSelectedDay(null); // Reset the selected day when month changes
    };
  
    // Filter appointments based on selected month and day
    const filteredAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date); // Assuming each appointment has a date property
      const sameMonth = appointmentDate.getMonth() === currentDate.getMonth();
      const sameYear = appointmentDate.getFullYear() === currentDate.getFullYear();
      const sameDay = selectedDay === null || appointmentDate.getDate() === selectedDay;
      return sameMonth && sameYear && sameDay;
    });

    useEffect(() => {
        // Assuming filteredAppointments is updated here
    
        // Calculate the total price for "Paid" appointments
        const totalPaid = filteredAppointments
            .filter(appointment => appointment.status === "Paid")
            .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0);
    
        // Save the total to state
        setTotalPaidAmount(totalPaid);
    }, [filteredAppointments]);

    // const handleLogout = () => {
    //     localStorage.removeItem('userToken'); 
    //     navigate('/'); 
    // };
    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        navigate('/AdminLogin');
    };
  

    const employeeImages = [
        woman1,
        woman2,
        man3,
        man1,
        woman3,
        woman4,
        man2,
        woman5,
        woman6,
    ];

    const toggleTab = (index) => {
        setToggleState(index);
    }

    const handleDataInsertion = async () => {
        if (selectedCustomer) {
            const currentDate = new Date(); 
            const dataToInsert = {
                customerId: selectedCustomer.customerid,
                employeename: selectedCustomer.empfname,
                employeeid: selectedCustomer.employeeid,
                serviceId: selectedService.serviceid,
                status: "Onsite",
                servicename: selectedService.servicename,
                date: currentDate.toISOString().split('T')[0],
                time: currentDate.toTimeString().split(' ')[0] 
            };
    
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/addservice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToInsert),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const result = await response.json();
                alert("Successfully Added");
                window.location.reload();
                console.log('Data inserted successfully:', result);
                // Optionally, update the state or UI based on the result

                // fetchData(); 
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        } else {
            console.warn('No customer selected');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Ensure all required fields are filled
        if (!servicename || !description || !price) {
            setErrorMessage('Service name, description, and price are required.');
            return;
        }

        // Prepare data to send to the backend
        const serviceData = {
            servicename,
            description,
            price,
            image
        };

        try {
            // Make the POST request to the backend
            const response = await axios.post('https://guys-and-gals-backend.vercel.app/api/v1/addservices', serviceData);
            
            // Handle successful response
            if (response.data.success) {
                alert('Service added successfully!');
                window.location.reload();
                setServicename('');
                setDescription('');
                setPrice('');
                setImage('');
                
            }
        } catch (error) {
            // Handle error response
            setErrorMessage('Error adding service. Please try again.');
            setSuccessMessage('');
        }
    };

    // const [selectedServices, setSelectedServices] = useState(null);
   
    // const [updatedServiceData, setUpdatedServiceData] = useState({
    //     serviceid: '',
    //     servicename: '',
    //     description: '',
    //     price: '',
    //     image: ''
    // });

    // const handleSelectService = (service) => {
    //     setSelectedServices(service);
    //     setUpdatedServiceData({
    //         serviceid: service.serviceid,
    //         servicename: service.servicename,
    //         description: service.description,
    //         price: service.price,
    //         image: service.image
    //     });
    // };

    // const handleInputChange = (e) => {
    //     const { name, value, type, files } = e.target;
    //     if (type === 'file') {
    //         console.log(files[0]);  // Log the selected file
    //         setUpdatedServiceData((prevData) => ({
    //             ...prevData,
    //             [name]: files[0],
    //         }));
    //     } else {
    //         setUpdatedServiceData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //         }));
    //     }
    // };
    
    // const handleServiceUpdate = async (updatedServiceData) => {
    //     const formData = new FormData();
        
    //     formData.append('serviceid', updatedServiceData.serviceid);
    //     formData.append('servicename', updatedServiceData.servicename);
    //     formData.append('description', updatedServiceData.description);
    //     formData.append('price', updatedServiceData.price);
    
    //     if (updatedServiceData.image) {
    //         formData.append('image', updatedServiceData.image);  // Append the image here
    //     }
    
    //     try {
    //         const response = await fetch("http://localhost:21108/api/v1/updateservice/" + updatedServiceData.serviceid, {
    //             method: 'PUT',
    //             body: formData,
    //         });
    
    //         if (!response.ok) {
    //             throw new Error('Failed to update service');
    //         }
    
    //         const result = await response.json();
    //         console.log('Service updated successfully:', result);
    //         alert('Service updated successfully!');
    //     } catch (error) {
    //         console.error('Error updating service:', error);
    //         alert('Error updating service');
    //     }
    // };
    

const [selectedServices, setSelectedServices] = useState(null);

const [updatedServiceData, setUpdatedServiceData] = useState({
    serviceid: '',
    servicename: '',
    description: '',
    price: '',
    image: ''  // Image will now be text (URL or path)
});

const handleSelectService = (service) => {
    setSelectedServices(service);
    setUpdatedServiceData({
        serviceid: service.serviceid,
        servicename: service.servicename,
        description: service.description,
        price: service.price,
        image: service.image  // If the selected service already has an image URL or path, it will populate here
    });
};

const handleInputChange = (e) => {
    const { name, value } = e.target;  // Only get name and value, no need for 'type' or 'files'
    
    setUpdatedServiceData((prevData) => ({
        ...prevData,
        [name]: value,  // Directly set the text value for image (URL or path)
    }));
};

const handleServiceUpdate = async (updatedServiceData) => {
    // Prepare the request body as a plain JavaScript object
    const updatedService = {
        servicename: updatedServiceData.servicename,
        description: updatedServiceData.description,
        price: updatedServiceData.price,
        image: updatedServiceData.image || null  // Send image as text (URL or path), or null if not provided
    };

    try {
        // Send the updated data in JSON format
        const response = await fetch("https://guys-and-gals-backend.vercel.app/api/v1/updateservice/" + updatedServiceData.serviceid, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',  // Indicate we're sending JSON data
            },
            body: JSON.stringify(updatedService)  // Convert the object to JSON string
        });

        if (!response.ok) {
            throw new Error('Failed to update service');
        }

        const result = await response.json();
        console.log('Service updated successfully:', result);
        alert('Service updated successfully!');
        window.location.reload();
    } catch (error) {
        console.error('Error updating service:', error);
        alert('Error updating service');
    }
};




    // useEffect(() => {
    //     const fetchServices = async () => {
    //         try {
    //             const response = await fetch('http://localhost:21108/api/v1/service', {
    //                 method: 'GET', // No need for POST if you are just fetching data
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             });

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }

    //             const result = await response.json();
    //             setServices(result.data); // Assuming the response contains a 'data' field
    //         } catch (err) {
    //             setError('Failed to fetch services.'); // Handle error
    //             console.error('Error fetching services:', err);
    //         }
    //     };

    //     fetchServices();
    // }, []); // Empty dependency array to run this effect once on mount

    


    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/customers');
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                // Assuming the response data contains an array under a 'data' property
                if (Array.isArray(data.data)) {
                    setCustomers(data.data); // Set the customers array from the response
                } else {
                    setCustomers([]); // Fallback to empty array if not
                }
            } catch (error) {
                setError(error.message); // Set error message in case of failure
            }
        };

        fetchCustomers();
    }, []);

    
    useEffect(() => {
        const fetchCustomersHasAppointment = async () => {
            console.log('Fetching customers with appointments...'); // Debugging log

            try {
                const response = await axios.get('https://guys-and-gals-backend.vercel.app/api/v1/customerhasappointment');
                console.log('Response data:', response.data); // Log the response
                setCustomersHasAppointment(response.data.data); // Update state with fetched data
            } catch (err) {
                console.error('Fetch error:', err); // Log the error
                setError('Failed to fetch customers'); // Set error message
            }
        };

        fetchCustomersHasAppointment(); // Call the function to fetch data
    }, []); // Empty dependency array to run once on mount

    // const handleCustomerSelect = (customer) => {
    //     setSelectedCustomer(customer); // Set the selected customer
    //     // Optionally close the dropdown
    // };

    // const handleCustomerSelect = async (customer) => {
    //     setSelectedCustomer(customer);
    //     setIsOpen(false); // Set the selected customer
    //     try {
    //         // Fetch appointments related to the selected customer
    //         const response = await axios.get(`http://localhost:21108/api/v1/appointmentsbyid/${customer.customerid}`);
    //         if (response.data.success) {
    //             setHasAppointments(response.data.data); // Update appointments state
    //         } else {
    //             setHasAppointments([]); // If no appointments, clear the appointments state
    //         }
    //     } catch (error) {
    //         console.error("Error fetching appointments:", error);
    //         setHasAppointments([]); // Clear appointments on error
    //     }
    // };

    const handleCustomerSelect = async (customer) => {
        setSelectedCustomer(customer);
        setIsOpen(false); // Close the customer selection modal
    
        try {
            // Attempt to fetch appointments related to the selected customer
            const response = await axios.get(`https://guys-and-gals-backend.vercel.app/api/v1/appointmentsbyid/${customer.customerid}`);
            setHasAppointments(response.data.success ? response.data.data : []); // Set appointments if successful, clear otherwise
        } catch (error) {
            console.warn("Error fetching appointments, continuing without appointments:", error.message);
            setHasAppointments([]); // Optionally clear appointments on error
        }
    
        // Send customer data to the backend
        const customerData = {
            customerid: customer.customerid,
            fname: customer.fname,
            lname: customer.lname,
            phone: customer.phone,
            due: Due || 0, // Fallback value
            outstanding: Outstanding || 0, // Fallback value
        };
    
        try {
            const insertResponse = await axios.post('https://guys-and-gals-backend.vercel.app/api/v1/insertpayment', customerData);
            if (insertResponse.data.success) {
                console.log('Customer data inserted successfully');
            } else {
                console.warn('Failed to insert customer data');
            }
        } catch (error) {
            console.warn("Error inserting customer data, proceeding without insertion:", error.message);
        }
    };



    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/customers');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setAdmin(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAdmin();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/employee');
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
                console.log(result); // Log to inspect the structure

                // Adjust according to the response structure (e.g., if `result.data` is an array)
                if (Array.isArray(result.data)) {
                    setEmployee(result.data);
                    
                } else {
                    console.error("Expected result.data to be an array, got:", result.data);
                    setEmployee([]); // Reset to empty if not an array
                }
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchEmployee();
    }, []);
    
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         try {
    //             const response = await fetch('http://localhost:21108/api/v1/appointment');
    //             if (!response.ok) throw new Error('Network response was not ok');
    //             const data = await response.json();

    //             // Check if data contains appointments
    //             if (data.data && Array.isArray(data.data)) {
    //                 setAppointments(data.data);
    //                 countServices(data.data);
    //             } else {
    //                 throw new Error('Data format is incorrect');
    //             }
    //         } catch (error) {
    //             setError(error.message);
    //         }
    //     };

    //     fetchAppointments();
    // }, []);

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         try {
    //             const response = await fetch('http://localhost:21108/api/v1/appointment');
    //             if (!response.ok) throw new Error('Network response was not ok');
    //             const data = await response.json();

    //             // Check if data contains appointments
    //             if (data.data && Array.isArray(data.data)) {
    //                 setAppointments(data.data);
    //                 countServices(data.data);

    //                 // Separate upcoming and past appointments
    //                 const currentDate = new Date();
    //                 const upcoming = data.data.filter(appointment => new Date(appointment.date) >= currentDate);
    //                 const past = data.data.filter(appointment => new Date(appointment.date) < currentDate);
                    
    //                 setUpcomingAppointments(upcoming);
    //                 setPastAppointments(past);
    //             } else {
    //                 throw new Error('Data format is incorrect');
    //             }
    //         } catch (error) {
    //             setError(error.message);
    //         }
    //     };

    //     fetchAppointments();
    // }, []);
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/appointment');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
    
                // Check if data contains appointments
                if (data.data && Array.isArray(data.data)) {
                    setAppointments(data.data);
                    countServices(data.data);
    
                    // Separate upcoming and past appointments
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0); // Set current date to 00:00:00
    
                    const upcoming = data.data.filter(appointment => {
                        const appointmentDate = new Date(appointment.date);
                        appointmentDate.setHours(0, 0, 0, 0); // Set appointment date to 00:00:00
                        return appointmentDate >= currentDate;
                    });
    
                    const past = data.data.filter(appointment => {
                        const appointmentDate = new Date(appointment.date);
                        appointmentDate.setHours(0, 0, 0, 0); // Set appointment date to 00:00:00
                        return appointmentDate < currentDate;
                    });
    
                    setUpcomingAppointments(upcoming);
                    setPastAppointments(past);
                } else {
                    throw new Error('Data format is incorrect');
                }
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchAppointments();
    }, []);
    

   

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/service');
                if (!response.ok) throw new Error('Network response was not ok');
                const result = await response.json();
    
                // Access the array of services from the 'data' property
                if (Array.isArray(result.data)) {
                    setServices(result.data); // Set services from result.data
                } else {
                    console.error('Expected an array of services but got:', result.data);
                    setServices([]); // Set to an empty array if the data isn't an array
                }
            } catch (error) {
                setError(error.message); // Set error message
            }
        };
    
        fetchServices();
    }, []);
    
   

    const countServices = (data) => {
        console.log('Counting services for data:', data); // Check the input
    
        const serviceCount = data.reduce((acc, appointment) => {
            acc[appointment.servicename] = (acc[appointment.servicename] || 0) + 1;
            return acc;
        }, {});
    
        const formattedData = Object.entries(serviceCount).map(([name, count]) => ({
            name,
            value: count,
        }));
    
        console.log('Formatted service data:', formattedData); // Check the output
        setServiceData(formattedData);
    };
    

    const prepareLineChartData = (data) => {
        const dateServiceCount = data.reduce((acc, appointment) => {
            const date = new Date(appointment.date).toLocaleDateString(); // Use lowercase 'date'
            const serviceName = appointment.servicename; // Use lowercase 'servicename'
            acc[date] = acc[date] || {};
            acc[date][serviceName] = (acc[date][serviceName] || 0) + 1;
            return acc;
        }, {});

        const formattedLineChartData = Object.entries(dateServiceCount).map(([date, services]) => ({
            date,
            ...services,
        }));

        setLineChartData(formattedLineChartData); // Update the state with the prepared data
    };

    useEffect(() => {
        if (appointments.length > 0) {
            prepareLineChartData(appointments); // Call the function to prepare data
        }
    }, [appointments]);


    useEffect(() => {
        const fetchPriceDataPerDate = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/totalpriceperdate');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                // Format the date
                const formattedData = data.map((entry) => ({
                    ...entry,
                    Date: new Date(entry.Date).toLocaleDateString(),
                }));
                setPriceDataPerDate(formattedData);
            } catch (error) {
                console.error('Error fetching price data per date:', error);
            }
        };

        fetchPriceDataPerDate();
    }, []);

    useEffect(() => {
        const fetchPriceDataPerWeek = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/totalpriceperweek');
                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                console.log('Fetched Data:', data); // Log the fetched data

                // Format the week start date range and income total
                const formattedData = data.map((entry) => ({
                    dateRange: entry.dateRange, // Use dateRange as the X axis key
                    totalincome: Number(entry.totalincome), // Convert to a number if necessary
                }));

                console.log('Formatted Data:', formattedData); // Log the formatted data
                setPriceDataPerWeek(formattedData);
            } catch (error) {
                console.error('Error fetching price data per week:', error);
            }
        };

        fetchPriceDataPerWeek();
    }, []);

    useEffect(() => {
        const fetchPriceDataPerYear = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/totalpriceperyear'); // Adjust the endpoint
                if (!response.ok) throw new Error('Failed to fetch');
    
                const data = await response.json();
                console.log('Fetched Yearly Data:', data); // Log the fetched data
    
                // Format the data as necessary
                const formattedData = data.map((entry) => ({
                    year: entry.year, // Ensure this matches the key in the response
                    totalincome: Number(entry.totalincome), // Convert to a number if necessary
                }));
    
                console.log('Formatted Yearly Data:', formattedData); // Log the formatted data
                setYearlyPriceData(formattedData); // Set the state with the formatted data
            } catch (error) {
                console.error('Error fetching yearly price data:', error);
            }
        };
    
        fetchPriceDataPerYear();
    }, []);

    useEffect(() => {
        const fetchMonthlyPriceData = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/totalpricepermonth');
                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                console.log('Fetched Monthly Data:', data); // Log the fetched data

                // Format the data
                const formattedData = data.map((entry) => ({
                    month: entry.month, // Ensure this matches the key in the response
                    totalincome: Number(entry.totalincome), // Convert to a number if necessary
                }));

                console.log('Formatted Monthly Data:', formattedData); // Log the formatted data
                setMonthlyPriceData(formattedData);
            } catch (error) {
                console.error('Error fetching monthly price data:', error);
            }
        };

        fetchMonthlyPriceData();
    }, []);
    
    
      
    const totalCustomers = customers.length;
    const totalAppointments = appointments.length;
    const totalServices = services.length;
    const totalEmployee = employee.length;


    const [selectedCustomerID, setSelectedCustomerID] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPopupOpen2, setIsPopupOpen2] = useState(false);
    const buttonRef = useRef(null);

    const [totalPendingAmount, setTotalPendingAmount] = useState(0);


    const fetchPendingServices = async (customerID) => {
        try {
            // Fetch data from the backend
            const response = await fetch(`https://guys-and-gals-backend.vercel.app/api/v1/pendingbycustomer/${customerID}`);
            
            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json(); // Parse JSON response
            console.log('API response:', result); // Log the API response

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); //if mahuman ang time ma adto na sa history
            const upcomingServices = result.data?.filter(service => new Date(service.date) >= currentDate) || [];
    
            // Set the services in state
            const servicesData = upcomingServices;
            // const servicesData = result.data || [];
            setServices(servicesData);
    
            // Calculate the total amount from the fetched services
            const totalAmount = servicesData.reduce((total, service) => {
                return total + (Number(service.price) || 0); // Cast price to number and default to 0 if invalid
            }, 0);
    
            // Set the total amount in state
            setTotalPendingAmount(totalAmount);
    
            // Set other necessary states
            setSelectedCustomerID(customerID);
            setIsPopupOpen(true); // Assuming this is for opening a popup for pending services
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    
    

    
    const fetchPaidServices = async (customerID) => {
        try {
            const response = await fetch(`https://guys-and-gals-backend.vercel.app/api/v1/paidbycustomer/${customerID}`);
            const result = await response.json();
            console.log('API response:', result); // Log the API response

              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0); 
              const upcomingServices = result.data?.filter(service => new Date(service.date) >= currentDate) || [];
            // setServices(result.data || []);
            setServices(upcomingServices); // Adjust according to your API structure   
            setSelectedCustomerID(customerID);
            setIsPopupOpen2(true);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };
    

    
    

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/pending');
                const result = await response.json(); // Store the whole response
                
                // Ensure the data property exists and is an array
                if (result.data && Array.isArray(result.data)) {
                    const uniqueAppointments = new Map();
    
                    // Get the current date without time
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
    
                    result.data.forEach(appt => {
                        const appointmentDate = new Date(appt.date); // Adjust 'date' to match your actual date property name
                        appointmentDate.setHours(0, 0, 0, 0);
    
                        // Check if the appointment date is today or in the future
                        if (appointmentDate >= today) {
                            if (!uniqueAppointments.has(appt.customerid)) {
                                uniqueAppointments.set(appt.customerid, appt);
                            }
                        }
                    });

                    // Convert the Map back to an array
                    setPendingAppointments(Array.from(uniqueAppointments.values()));
                } else {
                    throw new Error('No data found or data is not an array');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
    
        fetchPending();
    }, []);
    

    // useEffect(() => {
    //     const fetchPaid = async () => {
    //         try {
    //             const response = await fetch('http://localhost:21108/api/v1/paid');
    //             const result = await response.json(); // Store the whole response
    //             console.log('API response:', result);
    
    //             // Ensure the data property exists and is an array
    //             if (result.data && Array.isArray(result.data)) {
    //                 // Create a Map to store unique appointments by customerID
    //                 const uniqueAppointments = new Map();
    
    //                 result.data.forEach(appt => { // Access result.data
    //                     if (!uniqueAppointments.has(appt.customerid)) {
    //                         uniqueAppointments.set(appt.customerid, appt);
    //                     }
    //                 });
    
    //                 // Convert the Map back to an array
    //                 setPaidAppointments(Array.from(uniqueAppointments.values()));
    //             } else {
    //                 throw new Error('No data found or data is not an array');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching appointments:', error);
    //         }
    //     };
    
    //     fetchPaid();
    // }, []);

    useEffect(() => {
        const fetchPaid = async () => {
            try {
                const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/paid');
                const result = await response.json();
                console.log('API response:', result);
    
                if (result.data && Array.isArray(result.data)) {
                    // Current date to compare against
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    
                    const uniqueAppointments = new Map();
    
                    result.data.forEach(appt => {
                        const appointmentDate = new Date(appt.date); // Assume `appt.date` is a string date format
                        appointmentDate.setHours(0, 0, 0, 0); // Reset time for comparison
    
                        // Only keep appointments for today or future dates
                        if (appointmentDate >= today && !uniqueAppointments.has(appt.customerid)) {
                            uniqueAppointments.set(appt.customerid, appt);
                        }
                    });
    
                    setPaidAppointments(Array.from(uniqueAppointments.values()));
                } else {
                    throw new Error('No data found or data is not an array');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
    
        fetchPaid();
    }, []);
    
    
    const [selectedEmployee, setSelectedEmployee] = useState('');
   
    const updateAppointment = () => {
        
        // Make sure to adjust the firstName to get only EmpFName
        const firstName = selectedEmployee;
        const status = paymentStatus

        // Ensure selectedCustomerID is set correctly
        if (!firstName || !status || !selectedCustomerID) {
            alert('Please select an employee and a customer ID.');
            return;
        }

        // Make the POST request to update the appointment
        axios.post('https://guys-and-gals-backend.vercel.app/api/v1/updateappointment', { firstName, status, customerId: selectedCustomerID })
        
            .then(response => {
                console.log(response.data);
                alert('Appointment updated successfully!');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating appointment:', error.response || error);
                alert('Failed to update appointment. Please try again.');
            });
    };

    const [employees, setEmployees] = useState([]);
    const [employeeswith, setEmployeesWith] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEmployeesWithoutAppointments = async () => {
        try {
            const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/emlpoyeenoappointment');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployees(data.rows); // Adjust based on your actual response structure
        } catch (error) {
            setError('Error fetching employees: ' + error.message);
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesWithoutAppointments();
    }, []);

    const fetchEmployeesWithAppointments = async () => {
        try {
            const response = await fetch('https://guys-and-gals-backend.vercel.app/api/v1/emlpoyeewithappointment');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployeesWith(data.rows); // Adjust based on your actual response structure
        } catch (error) {
            setError('Error fetching employees: ' + error.message);
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesWithAppointments();
    }, []);

    

    if (loading) return <div className='w-[100%] h-[100%] bg-black flex items-center justify-center absolute'>
        <h1 className='text-white text-2xl font-thin'>Loading...</h1>
        </div>;
    if (error) return <p>{error}</p>;
    
    const sortedLineChartData = lineChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

   // Function to display total amount based on the selected customer
const displayTotalAmount = () => {
    return selectedCustomer ? selectedCustomer.totalamount : 0;
};

const totalHalfPaidAmounts = selectedCustomer 
    ? filteredAppointments
        .filter(appointment => 
            appointment.status === "Half Paid" &&
            appointment.customerid === selectedCustomer.customerid &&
            new Date(appointment.date) >= new Date() // Only include future or current appointments
        )
        .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
    : 0; 

const totalHalfPaidRemainingAmounts = selectedCustomer 
    ? filteredAppointments
        .filter(appointment => 
            appointment.status === "Half Paid" &&
            appointment.customerid === selectedCustomer.customerid &&
            new Date(appointment.date) >= new Date().setHours(0, 0, 0, 0) // Only include future or current appointments
        )
        .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0) / 2
    : 0; 
// Calculate totalHalfPaidAmounts only if a customer is selected and there are "Half Paid" appointments
// const totalHalfPaidAmounts = selectedCustomer 
//     ? filteredAppointments
//         .filter(appointment => appointment.status === "Half Paid" && appointment.customerid === selectedCustomer.customerid) // Only include appointments for selected customer
//         .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0) / 2
//     : 0; // Set to 0 if no customer is selected


const totalPaidAmounts = selectedCustomer 
    ? filteredAppointments
        .filter(appointment => 
            appointment.status === "Paid" &&
            appointment.customerid === selectedCustomer.customerid &&
            new Date(appointment.date) >= new Date().setHours(0, 0, 0, 0) // Only include future or current appointments
        )
        .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
    : 0; 
// Calculate totalPaidAmounts only for the selected customer
// const totalPaidAmounts = selectedCustomer 
//     ? filteredAppointments
//         .filter(appointment => appointment.status === "Paid" && appointment.customerid === selectedCustomer.customerid) // Only include appointments for selected customer
//         .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
//     : 0; // Set to 0 if no customer is selected

// const totalPendingAmounts = selectedCustomer 
//     ? filteredAppointments
//         .filter(appointment => 
//             appointment.status === "Pending" &&
//             appointment.customerid === selectedCustomer.customerid &&
//             new Date(appointment.date) >= new Date().setHours(0, 0, 0, 0) // Only include future or current appointments
//         )
//         .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
//     : 0; 
const totalPendingAmounts = selectedCustomer 
    ? filteredAppointments
        .filter(appointment => 
            appointment.status === "Pending" &&
            appointment.customerid === selectedCustomer.customerid &&
            new Date(appointment.date).getTime() >= new Date().setHours(0, 0, 0, 0) // Only include future or current appointments
        )
        .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
    : 0; 

// const totalPendingAmounts = selectedCustomer 
//     ? filteredAppointments
//         .filter(appointment => appointment.status === "Pending" && appointment.customerid === selectedCustomer.customerid) // Only include appointments for selected customer
//         .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
//     : 0; // Set to 0 if no customer is selected
   
const Onsite = selectedCustomer
    ? filteredAppointments
        .filter(appointment => 
            appointment.status === "Onsite" &&
            appointment.customerid === selectedCustomer.customerid &&
            new Date(appointment.date).getTime() >= new Date().setHours(0, 0, 0, 0) // Only include future or current appointments
        )
        .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
    : 0;
// const Onsite = selectedCustomer 
//     ? filteredAppointments
//         .filter(appointment => appointment.status === "Onsite" && appointment.customerid === selectedCustomer.customerid) // Only include appointments for selected customer
//         .reduce((total, appointment) => total + (Number(appointment.price) || 0), 0)
//     : 0; // Set to 0 if no customer is selected

// Function to calculate the remaining amount after subtracting totalPaidAmounts and totalHalfPaidAmounts




const calculateRemainingAmount = (totalAmount, totalPaidAmount) => {
    console.log(totalPendingAmount)
    return totalAmount - totalPaidAmount - (totalHalfPaidAmounts || 0);
};

const remainingAmount = calculateRemainingAmount(displayTotalAmount(), totalPaidAmounts);
const Due = totalHalfPaidAmounts + totalPendingAmounts + Onsite + totalPaidAmounts;
const Paid = totalHalfPaidAmounts / 2 + totalPaidAmounts;
const Outstanding = Math.max(Due - Paid, 0);



const handleAddAmount = async () => {
    if (!selectedCustomer) {
        alert("Please select a customer first.");
        return;
    }

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    if (Outstanding === 0) {
        alert('The outstanding balance is already fully paid. No additional payment is needed.');
        return;
    }

    // Calculate newOutstanding to check if it will meet the requirement to reach zero
    const newOutstanding = Outstanding - amountToAdd;

    // Check if the newOutstanding will be zero (or very close to zero, e.g., within 0.01)
    if (newOutstanding < 0) {
        alert('The amount entered is too much');
        return;
    } else if (newOutstanding > 0) {
        alert('The amount entered is not enough to fully pay off the outstanding balance.');  
        return;
    }

    try {
        const response = await axios.post('http://localhost:21108/api/v1/addpayment', {
            amountToAdd, // The amount to be added to the existing AmountPaid
            selectedCustomer, // Send the selected customer data with customerid
        });

        if (response.data.updated) {
            alert('Payment updated successfully:', response.data);
            window.location.reload();
        } else {
            alert('Failed to update payment:', response.data);
        }
    } catch (error) {
        if (error.response && error.response.data.message) {
            alert(error.response.data.message); // Display trigger exception message
        } else {
            console.error('Error:', error);
        }
    }
};


const newOutstanding = (isNaN(amountToAdd) || amountToAdd === 0) ? Outstanding : Outstanding - amountToAdd;





console.log("Paid:", Paid);
console.log("Total Amount:", displayTotalAmount());
console.log("Total Paid Amounts:", totalPaidAmounts);
console.log("Total Half Paid Amounts:", totalHalfPaidAmounts);
console.log("Remaining Amount:", remainingAmount);
console.log("Selected Customer:", selectedCustomer);



    return (
        <div className='w-screen h-screen flex overflow-hidden'>
            <div className='w-[13%] h-full border p-2 flex flex-col'>
                <div className='w-full h-[10%]'>
                    <div className='w-[100%] h-[70%] flex items-center justify-center border-b border-gray-200'>
                        <h1 className='text-2xl font-extrabold text-gray-500'><span className='text-violet-500'>Guys</span> & <span className='text-blue-500'>Gals</span></h1> 
                    </div>
                </div>

                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>Dashboard</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>Appointments</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)}>Clients</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 4 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(4)}>History</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 5 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(5)}>Add</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 6 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(6)}>Update</button>
                </div>
            </div>

            <div className='w-[87%] h-full overflow-y-scroll flex'>

                <div className={toggleState === 1 ? "content active-content" : "content"}>
                   
                   <div className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                       
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold text-violet-400'>Overview</h1>
                        </div>

                    <div className='w-[100%] h-[24%] flex mb-3'>
                        
                        <div className='w-[65%] h-[100] flex flex-col justify-between'>
                              <div className='w-[100%] h-[47%] flex'>
                                    <div className='w-[100%] h-[100%] flex items-center'>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[70%] rounded-lg' src={client}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Clients</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalCustomers}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[80%] rounded-lg' src={appointmentimg}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Appointments</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalAppointments}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                              </div>

                              <div className='w-[100%] h-[47%] flex'>
                                    <div className='w-[100%] h-[100%] flex items-center mb-3'>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[70%] rounded-lg' src={serviceimg}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Services</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalServices}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <div className='w-[70%] bg-violet-400 rounded-lg flex items-end'>
                                                        <img className='w-[100%] rounded-lg top-1 relative' src={staff}></img>
                                                    </div>   
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Employee</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalEmployee}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                </div>    
                        </div>

                        <div className='pie rounded-lg z-40 border'>
                                <PieChart width={400} height={400}  style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>  
                                         <Pie
                                            data={serviceData}
                                            innerRadius={100}
                                            outerRadius={170}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            cy={195}
                                        >
                                            {serviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                                            ))}
                                        </Pie>
                                        <Tooltip/> 
                                       <Legend wrapperStyle={{position: "static", right: 0, bottom: 0}}/>         
                                </PieChart>      
                        </div>

                        </div>
                        
                        <div className='w-[100%] h-[40%] bg-white flex rounded-lg relative p-2 mb-3 border'>
                        <LineChart width={1300} height={360} style={{ width: "97%", height: "100%" }} data={sortedLineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[1, 'dataMax + 1']} />
                            <Tooltip />
                            <Legend align="center" layout="horizontal" wrapperStyle={{ width: "100%", paddingLeft: "3%" }} />
                            {services.map((service) => (
                                <Line
                                    key={service.servicename} // Ensure this matches the service name in lowercase
                                    type="monotone"
                                    dataKey={service.servicename} // Ensure this matches the service name in lowercase
                                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each line
                                    activeDot={{ r: 8 }}
                                    strokeWidth={3}
                                />
                            ))}
                        </LineChart>
                        </div>

                        <div className='w-[100%] h-[50%] mb-5 flex justify-between'>
                        <div className='w-[49%] h-[100%] bg-white rounded-md'>
                                <div className='w-[100%] h-[15%] flex items-center p-5'>
                                    <h1 className='text-lg font-semibold text-gray-700'>Daily Income</h1>
                                </div>  
                                <ResponsiveContainer width="100%" height={"85%"}>
                                    <BarChart data={priceDataPerDate} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" /> {/* Change "Date" to "date" */}
                                        <YAxis  domain={[0, 'dataMax + 7000']} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalincome" fill="#8884d8" /> {/* Change "TotalIncome" to "totalincome" */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                           
                            <div className='w-[49%] h-[100%] bg-white rounded-md'>
                                <div className='w-[100%] h-[15%] flex items-center p-5'>
                                    <h1 className='text-lg font-semibold text-gray-700'>Weekly Income</h1>
                                </div>  
                                <ResponsiveContainer width="100%" height={"85%"}>
                                        <BarChart data={priceDataPerWeek} margin={{ right: 40, }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="dateRange" /> {/* Use the dateRange for X axis */}
                                            <YAxis domain={[0, 'dataMax + 7000']} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="totalincome" fill="#8884d8"/> {/* Use totalincome for the Bar */}
                                        </BarChart>
                                </ResponsiveContainer>
                            </div> 
                        </div>

                        <div className='w-[100%] h-[50%] mb-5 flex justify-between'>
                            <div className='w-[49%] h-[100%] bg-white rounded-md'>
                                <div className='w-[100%] h-[15%] flex items-center p-5'>
                                    <h1 className='text-lg font-semibold text-gray-700'>Monthly Income</h1>
                                </div>  
                                <ResponsiveContainer width="100%" height={"85%"}>
                                        <BarChart data={monthlyPriceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis domain={[0, 'dataMax + 7000']} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="totalincome" fill="#8884d8" />
                                        </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='w-[49%] h-[100%] bg-white rounded-md'>
                                <div className='w-[100%] h-[15%] flex items-center p-5'>
                                    <h1 className='text-lg font-semibold text-gray-700'>Yearly Income</h1>
                                </div>  
                                <ResponsiveContainer width="100%" height={"85%"}>
                                    <BarChart data={yearlyPriceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis domain={[0, 'dataMax + 7000']} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalincome" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        
                        <div className='w-[100%] h-[7%] mb-1  flex justify-between'>
                            <div className='w-[49%] h-[100%] rounded-tl-md rounded-tr-md bg-white border flex items-center justify-center'>
                                <h1 className='font-semibold text-lg text-gray-700'>Employees</h1>
                            </div>
                            <div className='w-[49%] h-[100%] rounded-tl-md rounded-tr-md bg-white border flex items-center justify-center'>
                                <h1 className='font-semibold text-lg text-gray-700'>Customers</h1>
                            </div>
                        </div>

                        <div className='w-[100%] h-[50%] flex justify-between'>
                            <div className='w-[49%] h-[100%] bg-white rounded-lg p-5 overflow-y-scroll border rounded-tl-none rounded-tr-none'>
                                {employee.map((emp, index) => (
                                    <div key={emp.employeeid} className='w-[100%] h-[20%] bg-gray-100 mb-2 flex border rounded-lg'>
                                        <div className='w-[20%] h-[100%] bg-gray-100 p-2'>
                                            <div className='w-[100%] h-[100%] bg-white flex items-end justify-center relative rounded-lg'>
                                                <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                            </div>  
                                        </div>
                                        <div className='w-[85%] h-[100%] flex flex-col items-center justify-center'> 
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-xl font-bold text-gray-600'>{emp.empfname} {emp.emplname}</h1>
                                            </div>
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-lg text-gray-600'>{emp.specialization}</h1>
                                            </div> 
                                        </div>
                                    </div>
                                ))}
                            </div>   

                            <div className='w-[49%] h-[100%] bg-white rounded-lg p-5 overflow-y-scroll border rounded-tl-none rounded-tr-none'>
                                {customers.map((cus, index) => (
                                    <div key={cus.customerId} className='w-[100%] h-[20%] bg-gray-100 mb-2 flex border rounded-lg'>
                                        <div className='w-[20%] h-[100%] bg-gray-100 p-2'>
                                            <div className='w-[100%] h-[100%] bg-white flex items-end justify-center relative rounded-lg'>
                                                <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                            </div>  
                                        </div>
                                        <div className='w-[85%] h-[100%] flex flex-col items-center justify-center'> 
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-xl font-bold text-gray-600'>{cus.fname} {cus.lname}</h1>
                                            </div>
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className=' text-gray-600 text-sm'><span className='text-sm'>Customer ID:</span> {cus.customerid}</h1>
                                            </div> 
                                        </div>
                                    </div>
                                ))}
                            </div>      
                        </div>

                        </div> 
                    </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                   
                    <div  className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                        
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold text-violet-400'>Upcoming Appointments</h1>
                        </div>

                        <div className='w-[100%] h-[5%] mb-1 flex items-center justify-between'>
                            <div className='w-[49%] h-[100%] bg-white  pl-5 flex items-center border rounded-md'>
                                <h1 className='text-md text-gray-600 font-semibold'>Available Employee</h1>
                            </div>
                            <div className='w-[49%] h-[100%] bg-white  pl-5 flex items-center border rounded-md'>
                                <h1 className='text-md text-gray-600 font-semibold'>Employee with appointments</h1>
                            </div>
                        </div>

                        <div className='w-[100%] h-[20%] mb-3 flex rounded-md justify-between'>

                            <div className='w-[49%] h-[100%]'>   
                            {employees.length === 0 ? (  
                                <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                    <h2 className="text-lg font-light text-gray-400">No Data</h2>
                                </div>

                                ) : (
                                        <div className='w-[100%] h-[100%] rounded-lg'>
                                             <div className='w-[100%] h-[100%] overflow-y-scroll'>
                                                {employees.map((emp, index) => (
                                                    <div className='w-[100%] h-[30%] mb-2 flex border border-gray-300 rounded-lg'>
                                                        <div className='w-[10%] h-[100%] bg-white'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-violet-400 '>{emp.employeeid}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[23%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>{emp.empfname}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[17%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>{emp.emplname}</h1>
                                                            </div>
                                                        </div>
                                                       <div className='w-[20%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>{emp.specialization}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[30%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>0{emp.phone}</h1>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                     
                                        </div>
                            )}
                            </div>

                            <div className='w-[49%] h-[100%]'>   
                            {employeeswith.length === 0 ? (  
                                <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                    <h2 className="text-lg font-light text-gray-400">No Data</h2>
                                </div>
                                ) : (
                                        <div className='w-[100%] h-[100%] rounded-lg'>
                                             <div className='w-[100%] h-[100%] overflow-y-scroll'>
                                                {employeeswith.map((emp, index) => (
                                                    <div className='w-[100%] h-[30%] mb-2 flex border border-gray-300 rounded-lg'>
                                                        <div className='w-[10%] h-[100%] bg-white'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-violet-400'>{emp.employeeid}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[23%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>{emp.empfname}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[17%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>{emp.emplname}</h1>
                                                            </div>
                                                        </div>
                                                       <div className='w-[20%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>{emp.specialization}</h1>
                                                            </div>
                                                        </div>
                                                        <div className='w-[30%] h-[100%] bg-gray-200'>
                                                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                                                <h1 className='text-sm font-semibold text-gray-600'>0{emp.phone}</h1>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                     
                                        </div>
                            )}
                            </div>
                        </div>

                        <div className='w-[100%] h-[5%] mb-2 flex justify-between'>
                                <div className='w-[49.5%] h-[100%]'>
                                    <div className='w-[100%] h-[100%] bg-blue-400 flex items-center justify-center rounded-lg border'><h1 className='text-white font-semibold'>Pending Services</h1></div>
                                </div>
                                <div className='w-[49.5%] h-[100%]'>
                                    <div className='w-[100%] h-[100%] bg-green-400 flex items-center justify-center rounded-lg border'><h1 className='text-white font-semibold'>Paid Services</h1></div>
                                </div>
                        </div>

                        <div className='w-[100%] h-[58.5%] flex justify-between'>
                            
                            <div className='w-[49.5%] h-[100%] bg-white rounded-lg p-3 flex border'>  
                                    {pendingAppointments.length > 0 ? (
                                    <div className='flex-col h-[100%] w-[100%] overflow-y-scroll'>
                                       {pendingAppointments.map((appt, index) => (
                                        <div className='w-[100%] h-[18%] bg-gray-100 rounded-lg border mb-2'>
                                           <div className='w-[100%] h-[100%]' key={index}>                      
                                                
                                                <div className='w-[100%] h-[100%] flex'>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center p-2'>
                                                        <div className='w-[100%] h-[100%] border rounded-lg bg-white flex items-end justify-center'>
                                                            <img className='w-[80%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                         </div>
                                                    </div>
                                                    <div className='w-[35%] h-[100%] pl-3 flex items-center'>
                                                         <h1 className='text-xl font-thin'>{appt.fname} {appt.lname}</h1>
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                        <h2></h2>
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                         <h1 className='text-blue-400 font-semibold'>{appt.status}</h1>
                                                    </div>
                                                    
                                                    <div className='w-[20%] h-[100%] flex items-center justify-center'>
                                                        <button className=' font-bold hover:text-violet-400' ref={buttonRef} onClick={() => fetchPendingServices(appt.customerid)}>
                                                                View
                                                        </button>
                                                   </div>

                                                </div>
                                            </div>
                                                {isPopupOpen && selectedCustomerID === appt.customerid && (
                                                          <div className='w-[100%] h-[100%] fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-80'>
                                                                <div className='w-[40%] h-[50%] bg-gray-100 rounded-lg flex flex-col p-3 border'>
                                                                   
                                                                    <div className='w-[100%] h-[20%] flex justify-between  mb-2'>
                                                                       
                                                                        <div className='w-[70%] h-[100%] bg-white p-2 flex rounded-lg border'>
                                                                            <div className='w-[18%] h-[100%] bg-gray-100 flex items-end justify-center border rounded-lg'>
                                                                                 <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                                            </div>
                                                                            <div className='w-[50%] h-[100%] flex flex-col justify-center items-center'>
                                                                                <div className='w-[100%] h-[40%] pl-3 flex items-center'> 
                                                                                    <h1 className='text-2xl text-violet-400'>{appt.fname} {appt.lname}</h1>
                                                                                </div>
                                                                                <div className='w-[100%] h-[35%] pl-3 flex items-center'> 
                                                                                    <h1 className='text-sm text-gray-600'>Customer ID: {selectedCustomerID}</h1>
                                                                                </div>
                                                                            </div>
                                                                            <div className='w-[32%] h-[100%] flex items-center justify-center'>
                                                                                    <h1 className='font-semibold text-blue-400'>{appt.status}</h1>                                                                     
                                                                            </div>
                                                                            
                                                                        </div>
                                                                        
                                                                        <div className='w-[29%] h-[100%] flex flex-col items-center justify-between'>

                                                                            <div className='w-[100%] h-[49%] flex items-center justify-center pl-1 pr-1 bg-white rounded-md border'>
                                                                                <select onChange={(e) => setSelectedEmployee(e.target.value)} className='w-[100%] h-[100%] focus:outline-none text-sm'>
                                                                                    <option value="">Select an employee</option>
                                                                                    {Array.isArray(employee) && employee.length > 0 ? (
                                                                                        employee.map((emp) => (
                                                                                            <option key={emp.employeeid} value={emp.empfname}>
                                                                                                {emp.empfname} {emp.emplname} {/* Display full name for the dropdown */}
                                                                                            </option>
                                                                                        ))
                                                                                    ) : (
                                                                                        <option disabled>No employees available</option> // Fallback option if no employees are present
                                                                                    )}
                                                                                </select>
                                                                            </div>
                                                                            <div className='w-[100%] h-[49%] flex items-center justify-center pl-1 pr-1 bg-white rounded-md border'>
                                                                                <select
                                                                                        value={paymentStatus}
                                                                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                                                                        className='w-[100%] h-[100%] focus:outline-none text-sm'
                                                                                    >
                                                                                        <option value="" disabled>Select Status</option>
                                                                                        <option value="Half Paid">Half Paid</option>
                                                                                        <option value="Paid">Paid</option>
                                                                                </select>
                                                                            </div>
                                                                           
                                                                        </div>
                                                                       
                                                                    </div>
                                                                    
                                                                    
                                                                    <div className='w-[100%] h-[80%]'>
                                                                        <div className='w-[100%] h-[15%] flex items-center justify-between rounded-lg'>
                                                                            <div className='w-[70%] h-[100%] flex bg-white rounded-lg border items-center pl-3 pr-3 justify-between'>
                                                                                <h1 className='text-lg font-semibold text-gray-600'>Services</h1> <h1 className='font-thin text-gray-600 text-sm'>Due Amount: <span className='text-blue-400'>{totalPendingAmount}</span></h1>
                                                                            </div>
                                                                            <div className='w-[29%] h-[100%] rounded-lg bg-white border flex items-center justify-center border-violet-300'>
                                                                                <div className='w-[100%] h-[100%] flex items-center justify-center rounded-lg hover:bg-violet-200 hover:text-white cursor-pointer'>
                                                                                    <button onClick={updateAppointment} className='font-semibold w-[100%] h-[100%]'>Assign</button>
                                                                                    
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[100%] h-[85%] overflow-y-scroll'>
                                                                            {services.map((service, index) => (
                                                                                
                                                                                    <div className='bg-white rounded-lg mb-2 h-[27%] p-3 mt-2 flex border' key={index}>
                                                                                       <div className='w-[40%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold text-sm'>Service Name</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-xl  font-light'> {service.servicename}</h1>
                                                                                            </div>
                                                                                       </div>
                                                                                       <div className='w-[15%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold text-sm'>Price</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-xl  font-light'>{service.price}</h1>
                                                                                            </div>
                                                                                       </div>
                                                                                       <div className='w-[25%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold text-sm'>Date</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-xl  font-light'>{service.date}</h1>
                                                                                            </div>
                                                                                       </div>
                                                                                       <div className='w-[20%] h-[100%]'>
                                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                                <h1 className='font-semibold text-sm'>Time</h1>
                                                                                            </div>
                                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                                <h1 className='text-xl font-light'>{service.time}</h1>
                                                                                            </div>
                                                                                       </div>               
                                                                                    </div>
                                                                               
                                                                            ))}
                                                                         </div>
                                                                    </div>
                                                                       
                                                                </div> 
                                                                    <div className='w-[1%] h-[42%]'> 
                                                                        <div className='w-[100%] h-[18%] bg-pink-300'></div>
                                                                        <div className='w-[100%] h-[18%] bg-violet-300'></div>          
                                                                        <div className='w-[100%] h-[18%] bg-violet-400'></div>     
                                                                        <div className='w-[100%] h-[18%] bg-violet-500'></div>                                                   
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => setIsPopupOpen(false)} 
                                                                        className="mt-2  bg-black bg-opacity-20 hover:bg-black text-white px-4 py-2 rounded-full ml-3 font-semibold"
                                                                    >
                                                                        x
                                                                    </button>   
                                                            </div>
                                                            
                                                    )}
       
                                                </div>                   
                                            ))}           
                                        </div>
                                    ) : (
                                        <div className='w-[100%] h-[100%] flex items-center justify-center'> 
                                            <h1 className='text-gray-500'>No appointments found.</h1>
                                        </div>                              
                                    )}  
                                
                                    
                            </div>
                            
                             <div className='w-[49.5%] h-[100%] bg-white rounded-lg p-3 flex border'>
                             {paidAppointments.length > 0 ? (
                                    <div className='flex-col h-[100%] w-[100%] overflow-y-scroll'>
                                       {paidAppointments.map((appt, index) => (
                                        <div className='w-[100%] h-[18%] mb-2 bg-gray-100 rounded-lg border'>
                                           <div className='w-[100%] h-[100%]' key={index}>                      
                                                
                                            <div className='w-[100%] h-[100%] flex'>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center p-2'>
                                                        <div className='w-[100%] h-[100%] border rounded-lg bg-white flex items-end justify-center'>
                                                            <img className='w-[80%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                         </div>
                                                    </div>
                                                    <div className='w-[35%] h-[100%] pl-3 flex items-center'>
                                                         <h1 className='text-lg font-thin'>{appt.fname} {appt.lname}</h1>   
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                    </div>
                                                    <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                                         <h1 className='text-green-400 font-semibold'></h1>
                                                    </div>
                                                    
                                                    <div className='w-[20%] h-[100%] flex items-center justify-center'>
                                                        <button className=' font-bold hover:text-violet-400' ref={buttonRef} onClick={() => fetchPaidServices(appt.customerid)}>
                                                                View
                                                        </button>
                                                   </div>

                                                </div>
                                            </div>
                                                {isPopupOpen2 && selectedCustomerID === appt.customerid && (
                                                    <div className='w-[100%] h-[100%] fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-40'>
                                                        <div className='w-[40%] h-[50%] bg-gray-100 rounded-lg flex flex-col p-3 border'>
                                                            
                                                            <div className='w-[100%] h-[20%] flex justify-between  mb-2'>
                                                                
                                                                <div className='w-[70%] h-[100%] bg-white p-2 flex rounded-lg border '>
                                                                    <div className='w-[18%] h-[100%] flex items-end justify-center bg-gray-100 border rounded-lg'>
                                                                            <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                                                    </div>
                                                                    <div className='w-[50%] h-[100%] flex flex-col justify-center items-center '>
                                                                        <div className='w-[100%] h-[40%] pl-3 flex items-center'> 
                                                                            <h1 className='text-2xl text-violet-400'>{appt.fname} {appt.lname}</h1>
                                                                        </div>
                                                                        <div className='w-[100%] h-[35%] pl-3 flex items-center'> 
                                                                            <h1 className='text-sm'>Customer ID: {selectedCustomerID}</h1>
                                                                        </div>
                                                                    </div>
                                                                    <div className='w-[32%] h-[100%] flex items-center justify-center'>
                                                                            <h1 className='font-semibold text-green-400'></h1>
                                                                    </div>
                                                                    
                                                                </div>
                                                                
                                                                <div className='w-[29%] h-[100%] bg-white border border-violet-300 rounded-lg flex items-center justify-center'>
                                                                    <h1 className='text-lg font-semibold text-violet-400'>{appt.empfname} {appt.emplname}</h1>
                                                                </div>
                                                                
                                                            </div>
                                                            
                                                            <div className='w-[100%] h-[80%]'>
                                                                <div className='w-[100%] h-[15%] flex items-center justify-between rounded-lg'>
                                                                    <div className='w-[70%] h-[100%] flex bg-white rounded-lg border items-center pl-3 justify-between pr-3'>
                                                                        <h1 className='text-lg font-semibold text-gray-600'>Services</h1>
                                                                    </div>
                                                                    <div className='w-[29%] h-[100%] rounded-lg bg-white border-violet-300 border flex items-center justify-center'>
                                                                       <h1 className='text-semibold'>Assigned</h1>
                                                                    </div>
                                                                </div>
                                                                <div className='w-[100%] h-[85%] overflow-y-scroll'>
                                                                    {services.map((service, index) => (
                                                                        
                                                                    <div className='bg-white rounded-lg mb-2 h-[27%] p-3 mt-2 flex border' key={index}>
                                                                        <div className='w-[40%] h-[100%]'>
                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                <h1 className='font-semibold text-sm'>Service Name</h1>
                                                                            </div>
                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                <h1 className='text-xl font-light'> {service.servicename}</h1>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[40%] h-[100%]'>
                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                <h1 className='font-semibold text-sm'>Date</h1>
                                                                            </div>
                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                <h1 className='text-xl font-light'>{service.date}</h1>
                                                                            </div>
                                                                        </div>
                                                                        <div className='w-[20%] h-[100%]'>
                                                                            <div className='w-[100%] h-[40%] flex items-center'>
                                                                                <h1 className='font-semibold text-sm'>Time</h1>
                                                                            </div>
                                                                            <div className='w-[100%] h-[60%] flex items-center'>
                                                                                <h1 className='text-xl font-light'>{service.time}</h1>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                        
                                                                    ))}
                                                                    </div>
                                                            </div>
                                                                
                                                        </div> 
                                                        <div className='w-[1%] h-[42%]'> 
                                                                        <div className='w-[100%] h-[18%] bg-pink-300'></div>
                                                                        <div className='w-[100%] h-[18%] bg-violet-300'></div>          
                                                                        <div className='w-[100%] h-[18%] bg-violet-400'></div>     
                                                                        <div className='w-[100%] h-[18%] bg-violet-500'></div>                                                   
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => setIsPopupOpen2(false)} 
                                                                        className="mt-2 bg-black bg-opacity-20 hover:bg-black text-white px-4 py-2 rounded-full ml-3 font-semibold"
                                                                    >
                                                                        x
                                                                    </button>   
                                                    </div>
                                                )}  
                                                
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className='w-[100%] h-[100%] flex items-center justify-center'> 
                                            <h1 className='text-gray-500'>No appointments found.</h1>
                                        </div>              
                                    )}  

                            </div>
                        </div>

                    </div>

                </div>

                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <div  className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                        
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold text-violet-400'>Clients</h1>
                        </div>

                        <div className='w-[100%] h-[5%] bg-white flex border mb-2 p-3 rounded-tl-lg rounded-tr-lg'>
                            <div className='w-[5%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-lg font-semibold'>ID</h1>
                            </div>
                            <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                <h1 className='text-lg font-semibold'>Name</h1>
                            </div>
                            <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                <h1 className='text-lg font-semibold'>Email</h1>
                            </div>
                            <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                <h1 className='text-lg font-semibold'>Contact number</h1>
                            </div>
                            <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                <h1 className='text-lg font-semibold'>Street</h1>
                            </div>
                            <div className='w-[15%] h-[100%] flex items-center pl-3'>
                                <h1 className='text-lg font-semibold'>City</h1>
                            </div>
                        </div>

                        <div className='w-[100%] h-[85%] bg-white border overflow-y-scroll p-3 rounded-br-lg rounded-bl-lg'>
                        {Array.isArray(customers) && customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <div className={`w-[100%] h-[8%] mb-3 flex border rounded-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`} key={index}>
                                    <div className='w-[5%] h-[100%] flex items-center justify-center'>
                                        <h1 className='text-violet-400 font-semibold'>{customer.customerid}</h1>
                                    </div>
                                    <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                        <h1>{customer.fname} {customer.lname}</h1>
                                    </div>
                                    <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                        <h1>{customer.email}</h1>
                                    </div>
                                    <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                        <h1>0{customer.phone}</h1>
                                    </div>
                                    <div className='w-[20%] h-[100%] flex items-center pl-3'>
                                        <h1>{customer.street}</h1>
                                    </div>
                                    <div className='w-[15%] h-[100%] flex items-center pl-3'>
                                        <h1>{customer.city}</h1>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                <p className="text-gray-500 text-lg">No Customers Available</p>
                            </div> // Handle case when no customers exist
                        )}

                        </div>
                    </div> 
                    
                </div>

                <div className={toggleState === 4 ? "content active-content" : "content"}>
                        <div className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                            <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                                <h1 className='text-xl font-bold text-violet-400'>Appointments History</h1>
                            </div>

                            <div className='w-[100%] h-[5%] bg-white mb-1 rounded-md border flex'>
                                <div className='w-[5%] h-[100%] flex items-center justify-center'>
                                    <p className=''>ID</p>
                                </div>
                                <div className='w-[25%] h-[100%] flex justify-center items-center'>
                                    <p>Name</p>
                                </div>
                                <div className='w-[30%] h-[100%] flex items-center justify-center'>
                                    <p>Service Name</p>
                                </div>
                                <div className='w-[10%] h-[100%] flex items-center justify-center'>
                                    <p>Price</p>
                                </div>
                                <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                    <p>Time</p>
                                </div>
                                <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                    <p>Date</p>
                                </div>
                            </div>

                            <div className='w-[100%] h-[85%] overflow-y-scroll'>
                            {pastAppointments.length > 0 ? (
                                pastAppointments.map((appointment, index) => (
                                    <div 
                                        key={appointment.appointmentid} 
                                        className={`h-[7%] mb-2 flex border rounded-md ${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'}`}
                                    >
                                        <div className='w-[5%] h-[100%] flex items-center justify-center rounded rounded-r-none bg-white border-r'>
                                            <p className='text-blue-500 font-semibold'>{appointment.customerid}</p>
                                        </div>
                                        <div className='w-[25%] h-[100%] flex justify-center items-center'>
                                            <p>{appointment.fname} {appointment.lname}</p>
                                        </div>
                                        <div className='w-[30%] h-[100%] flex items-center justify-center'>
                                            <p>{appointment.servicename}</p>
                                        </div>
                                        <div className='w-[10%] h-[100%] flex items-center justify-center'>
                                            <p>P {appointment.price}</p>
                                        </div>
                                        <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                            <p>{appointment.time}</p>
                                        </div>
                                        <div className='w-[15%] h-[100%] flex items-center justify-center'>
                                            <p>{appointment.date}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='w-[100%] h-[100%] flex items-center justify-center'>
                                    <p className="text-gray-500 text-lg">No past appointments</p>
                                </div>
                            )}
                            
                            </div>

                        </div>
                </div>


                <div className={toggleState === 5 ? "content active-content" : "content"}>
                    <div className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                        
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                                <h1 className='text-xl font-bold text-violet-400'>Additional Services</h1>
                        </div>

                        <div className='w-[100%] h-[5%] flex'>
                            <div className='w-[16.66%] h-[100%]'>
                                    
                            </div>
                            <div className='w-[16.66%] h-[100%] flex items-end justify-center text-gray-600'>Customer ID</div>
                            <div className='w-[16.66%] h-[100%] flex items-end justify-center text-gray-600'>First Name</div>
                            <div className='w-[16.66%] h-[100%] flex items-end justify-center text-gray-600'>Last Name</div>
                            <div className='w-[16.66%] h-[100%] flex items-end justify-center text-gray-600'>Contact No</div>
                            <div className='w-[16.66%] h-[100%] flex items-end justify-center text-gray-600'>Total Amount</div>
                            <div className='w-[16.66%] h-[100%] flex items-end justify-center text-gray-600'>Outstanding balance</div>
                        </div>
                       
                        <div className='w-[100%] h-[8%] flex pt-2 pb-2'>
                            <div className='w-[14.4%] h-[100%] flex items-center'> 
                                <button onClick={toggleDropdown} className="bg-blue-400 text-white h-[100%] w-[95%] rounded">
                                    {isOpen ? 'Hide' : 'Select Customer'}
                                </button>
                            </div>
                            <div className='w-[85.6%] h-[100%] bg-white rounded-md border'>
                            {selectedCustomer && ( // Display selected customer's name on the side
                                <div className='w-[100%] h-[100%] flex'>
                                    <div className='w-[16.66%] h-[100%] flex items-center justify-center'><h1 className='font-semibold text-gray-500'>{selectedCustomer.customerid}</h1></div>
                                    <div className='w-[16.66%] h-[100%] flex items-center justify-center'><h1 className='font-semibold text-gray-500'>{selectedCustomer.fname}</h1></div>
                                    <div className='w-[16.66%] h-[100%] flex items-center justify-center'><h1 className='font-semibold text-gray-500'>{selectedCustomer.lname}</h1></div>
                                    <div className='w-[16.66%] h-[100%] flex items-center justify-center'><h1 className='font-semibold text-gray-500'>0{selectedCustomer.phone}</h1></div>
                                    <div className='w-[16.66%] h-[100%] flex items-center justify-center'><h1 className='font-semibold text-gray-500'>{Due}</h1></div>
                                    <div className='w-[16.66%] h-[100%] flex items-center justify-center'><h1 className='font-semibold text-gray-500'>{newOutstanding}</h1></div>
                                </div>
                            )}  
                            </div>
                        </div>
                        <div className='w-[100%] h-[45%] bg-wihte relative rounded-md mb-2'>
                            {isOpen && (
                                <div className="absolute z-50 flex flex-col w-[20%]">
                                        {customershasappointment.length > 0 ? (
                                            <ul>
                                                {customershasappointment.map((customer) => (
                                                    <li
                                                        key={customer.customerid}
                                                        className="p-2  pl-3 border mb-1 bg-white rounde-md hover:border-violet-300 cursor-pointer"
                                                        onClick={() => handleCustomerSelect(customer)} // Handle customer selection
                                                    >
                                                        <h1>{customer.fname} {customer.lname}</h1>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="p-2">No customers with appointments found.</p>
                                        )}
                                    </div>
                                )}
                                {hasappointments.length > 0 && ( // Check if there are appointments to display
                                    <div className="w-[100%] h-[100%] bg-white z-10 flex overflow-y-scroll relative">
                                        {/* Filter appointments by status */}
                                        {['Pending', 'Onsite', 'Half Paid', 'Paid'].map((status) => {
                                            const filteredAppointments = hasappointments.filter(
                                                (appointment) => appointment.status === status
                                            );

                                            return (
                                                <div key={status} className="w-[33.33%] p-1 pt-0 flex flex-col justify-center items-center">
                                                    {filteredAppointments.length > 0 && ( // Only show the heading if there are appointments
                                                        <div className='w-[100%] h-[10%] flex items-center'>
                                                            <h3 className="text-lg text-gray-600">{status}</h3>
                                                        </div>
                                                    )}
                                                    <div className='w-[100%] h-[90%] overflow-y-scroll relative pb-1'>
                                                    {filteredAppointments.length > 0 ? (
                                                            <>
                                                                 {/* {filteredAppointments.map((appointment, index) => (
                                                                    <div 
                                                                        key={appointment.appointmentid} 
                                                                        className={`border rounded-sm flex flex-col justify-center pl-3 mb-2 h-[25%] ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                                                                    >
                                                                        <h1 className={`font-semibold ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-700'}`}>
                                                                            {appointment.servicename}
                                                                        </h1>
                                                                        <h5 className={`text-xs ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-700'}`}>
                                                                            PRICE: P{appointment.price}
                                                                        </h5>
                                                                    </div>
                                                                ))}  */}
                                                                {filteredAppointments
                                                                    .filter(appointment => new Date(appointment.date).getTime() >= new Date().setHours(0, 0, 0, 0)) // Include appointments that are today or in the future
                                                                    .map((appointment, index) => (
                                                                        <div 
                                                                            key={appointment.appointmentid} 
                                                                            className={`border rounded-sm flex flex-col justify-center pl-3 mb-2 h-[25%] ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                                                                        >
                                                                            <h1 className={`font-semibold ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-700'}`}>
                                                                                {appointment.servicename}
                                                                            </h1>
                                                                            <h5 className={`text-xs ${index % 2 === 0 ? 'text-gray-700' : 'text-gray-700'}`}>
                                                                                PRICE: P{appointment.price}
                                                                            </h5>
                                                                        </div>
                                                                    ))}


                                                                {/* Calculate and display the total price for "Paid" appointments */}
                                                                {status === "Paid" && (
                                                                    <div className="mt-4 p-3 border bg-gray-100 border-blue-300 rounded-sm">
                                                                        <h2 className="text-md text-blue-400">
                                                                         Total: P{totalPaidAmounts}
                                                                        </h2>
                                                                    </div>
                                                                )}

                                                                {status === "Onsite" && (
                                                                    <div className="mt-4 p-3 border bg-gray-100 border-blue-300 rounded-sm">
                                                                        <h2 className="text-md text-blue-400">
                                                                            Total: P{Onsite}
                                                                        </h2>
                                                                    </div>
                                                                )}

                                                                {/* Calculate and display the total price for "Half Paid" appointments */}
                                                                {status === "Half Paid" && (
                                                                    <div className="mt-4 p-3 border bg-gray-100 border-blue-300 rounded-sm">
                                                                        <h2 className="text-md text-blue-400">
                                                                            Total: P{totalHalfPaidAmounts}
                                                                        </h2>
                                                                    </div>
                                                                )}  
                                                                {status === "Half Paid" && (
                                                                    <div className="mt-1 p-3 border bg-gray-100 border-blue-300 rounded-sm">
                                                                        <h2 className="text-md text-blue-400">
                                                                            Remaining: P{totalHalfPaidRemainingAmounts}
                                                                        </h2>
                                                                    </div>
                                                                )}   
                                                                

                                                                {/* Calculate and display the total price for "Pending" appointments */}
                                                                {status === "Pending" && (
                                                                    <div className="mt-4 p-3 border bg-gray-100 border-blue-300 rounded-sm">
                                                                        <h2 className="text-md text-blue-400">
                                                                            Total: P{totalPendingAmounts}
                                                                        </h2>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className='w-[100%] h-[100%] absolute flex items-center justify-center rounded-md border border-gray-200'>
                                                                <h1 className="text-center text-gray-400">No {status} Appointments</h1>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                        </div>

                        <div className='w-[100%] h-[4%] bg-white flex pr-2 border rounded-md'>
                            <div className='w-[7%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-gray-500'>Service ID</h1>
                            </div>
                            <div className='w-[40.5%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-gray-500'>Service Name</h1>
                            </div>
                            <div className='w-[40.5%] h-[100%] flex items-center justify-center'>
                                <h1 className='text-gray-500'>Service Price</h1>
                            </div>
                            <div className='w-[12%] h-[100%]  flex items-center justify-center'>
                                
                            </div>
                        </div>


                        <div className='w-[100%] h-[6%] flex relative mt-1 rounded-md'>
                            {/* Side panel for displaying selected service details */}
                            <div className="h-[100%] w-[88%] relative pr-2">
                                {selectedService ? (
                                    <div className="w-[100%] h-[100%] flex">
                                        <div className='w-[7.9%] h-[100%] bg-white flex items-center justify-center rounded-l-md border border-r-0 border-gray-300'>
                                            <h1 className='text-blue-600 font-semibold'>{selectedService.serviceid}</h1>
                                        </div>
                                        <div className='w-[46.01%] h-[100%] bg-gray-200 flex items-center justify-center border border-l-0 border-r-0 border-gray-300'>
                                            <h1 className='text-gray-600'>{selectedService.servicename}</h1>
                                        </div>
                                        <div className='w-[46.1%] h-[100%] bg-gray-300 flex items-center justify-center rounded-r-md border border-l-0 border-gray-300'>
                                            <h1 className='text-gray-600'>P {selectedService.price}</h1>
                                        </div>  
                                    </div>
                                ) : (
                                    <div className="text-center bg-white text-gray-500 h-[100%] w-[100%] flex items-center justify-center border rounded-md">Click a service to see details</div>
                                )}
                            </div>
                            <div className='w-[12%] h-[100%]'>
                                    <button onClick={() => setDropdownOpen(prev => !prev)} className="bg-blue-400 w-[100%] h-[100%] text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                        {dropdownOpen ? 'Hide Services' : 'Show Services'}
                                    </button>
                            </div>

                            <div className='w-[100%] absolute bottom-0 right-0'> 
                                {dropdownOpen && (
                                        <div className='w-[40%] h-[200px] absolute right-0 top-0 overflow-y-scroll mt-2'>
                                            {services.map(service => (
                                                    <div className='bg-white border mb-1 h-[20%] pl-5 flex items-center rounded-sm cursor-pointer hover:bg-violet-300 hover:text-white' key={service.id} onClick={() => handleServiceClick(service)}>
                                                        <h2 className="">{service.servicename}</h2>
                                                    </div>  
                                            ))}
                                        </div>
                                    )}
                            </div>

                        </div>

                        <div className='w-[100%] h-[6%] mt-1 flex items-center justify-end'>
                            <button onClick={handleDataInsertion} className="bg-green-400 hover:bg-green-500 text-white rounded h-[100%] w-[12%]">
                                    Add Service
                            </button>
                        </div>

                        <div className='w-[100%] h-[6%] mt-1 flex justify-end items-center'>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(parseFloat(e.target.value))}
                                    placeholder="Enter amount"
                                    className="h-[100%] w-[15%] pl-5 pr-5 border focus:outline-violet-300"
                                />
                                <button onClick={handleAddAmount} className="w-[12%] h-[100%] ml-3 bg-red-500 rounded text-white">
                                    Add Payment
                                </button>
                        </div>

                        <div className='w-[100%] h-[5%] mt-1 flex items-start pt-1 justify-end'>
                            <h1 className='text-blue-400'>Please ensure the value is correct before proceeding.</h1>
                        </div>


                    </div>
                </div> 
                
                <div className={toggleState === 6 ? "content active-content" : "content"}> 
                    
                    <div className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-scroll'>
                       
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold text-violet-400'>Update Services</h1>
                        </div>
                    
                        <div className='h-[5%] w-[100%] flex items-center justify-between mb-1'>
                            <div className='w-[49%] h-[100%] pl-3 border border-violet-300 rounded-tl rounded-tr  flex items-center bg-white'>
                                <h1 className='text-gray-500'>Select a service to update</h1>
                            </div>
                            <div className='w-[49%] h-[100%] pl-3 border border-blue-300 rounded-tl rounded-tr flex items-center bg-white'>
                                <h1 className='text-gray-500'>Update Service Details</h1>
                            </div>
                        </div>

                        <div className='w-[100%] h-[40%] flex items-center justify-between'>
                            <div className='w-[49%] h-[100%] overflow-y-scroll'>
                                {services.map((service) => (
                                    <div key={service.serviceid} className='w-[100%] h-[15%]  bg-white mb-1 pl-5 cursor-pointer flex items-center border rounded hover:border-violet-400' onClick={() => handleSelectService(service)}>
                                            <h1 className='text-gray-500'>{service.servicename}</h1>
                                    </div>
                                ))}
                            </div>

                            <div className='w-[49%] h-[100%]'>
                                {selectedServices && (
                                    <form className='w-[100%] h-[100%]' onSubmit={(e) => {
                                        e.preventDefault();
                                        handleServiceUpdate(updatedServiceData);     
                                    }}>

                                        
                                    <div className='w-[100%] h-[12%] flex items-center justify-between flex-wrap mt-1 mb-1'>
                                        <div className='w-[24.9%] h-[100%] flex items-center justify-center bg-white border border-blue-300'>
                                            <h1 className='text-gray-600'>Service ID</h1>
                                        </div>
                                        <div className='w-[24%] h-[100%] flex items-center justify-center  bg-white border border-blue-300'>
                                            <h1 className='text-gray-600'>Service Name</h1>
                                        </div>
                                        <div className='w-[24%] h-[100%] flex items-center justify-center  bg-white border border-blue-300'>
                                            <h1 className='text-gray-600'>Price</h1>
                                        </div>
                                        <div className='w-[24.5%] h-[100%] flex items-center justify-center  bg-white border border-blue-300'>
                                            <h1 className='text-gray-600'>Image</h1>
                                        </div>
                                    </div>

                                    <div className='w-[100%] h-[15%] flex items-center flex-wrap'>
                                        <div className='w-[25%] h-[100%] bg-gray-100 flex items-center'>        
                                            <input
                                                    className='w-[100%] h-[100%] pl-3 border focus:outline-blue-300 text-sm text-gray-500'
                                                    type="text"
                                                    name="servicename"
                                                    value={updatedServiceData.serviceid}
                                                    onChange={handleInputChange}
                                                />
                                        </div>
                                        <div className='w-[25%] h-[100%] bg-gray-100 pl-1 flex items-center'>        
                                            <input
                                                    className='w-[100%] h-[100%] pl-3 border focus:outline-blue-300 text-sm text-gray-500'
                                                    type="text"
                                                    name="servicename"
                                                    value={updatedServiceData.servicename}
                                                    onChange={handleInputChange}
                                                />
                                        </div>
                                        <div className='w-[25%] h-[100%] bg-gray-100 pl-1 flex items-center'>
                                            <input
                                                className='w-[100%] h-[100%] pl-3 border focus:outline-blue-300 text-sm text-gray-500'
                                                type="number"
                                                name="price"
                                                value={updatedServiceData.price}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className='w-[25%] h-[100%] bg-gray-100  pl-1 flex items-center'>
                                                <input
                                                    className='w-[100%] h-[100%] pl-3 border focus:outline-blue-300 text-sm text-gray-500'
                                                    type="text"
                                                    name="image"
                                                    placeholder='Enter image url'
                                                    value={updatedServiceData.image}
                                                    onChange={handleInputChange}
                                                />
                                        </div>
                                    </div>

                                    <div className='w-[100%] h-[12%] flex items-center pl-2 bg-white mt-1 mb-1 border border-blue-300'>
                                        <h1 className='text-gray-500'>Description</h1>
                                    </div>

                                    <div className='w-[100%] h-[40%]'>
                                        <textarea
                                            className='w-[100%] h-[100%] pl-3 pt-3 pr-3 border focus:outline-blue-300 text-sm text-gray-500'
                                            type="text"
                                            name="description"
                                            value={updatedServiceData.description}
                                            onChange={handleInputChange}  
                                        />
                                    </div>

                                    <div className='w-[100%] h-[16%] flex items-center justify-end p-1'>
                                        <button className='w-[30%] h-[100%] bg-blue-400 rounded hover:bg-violet-400' type="submit"><h1 className='text-white'>Update Service</h1></button>
                                    </div> 

                                    </form>
                                )}
                            </div>

                        </div>

                        <div className='w-[100%] h-[40%] mt-5'>
                            <div className='w-[100%] h-[12%] border bg-white border-blue-300 pl-5 flex items-center justify-center mb-2'>
                                <h1 className="text-gray-500">Add New Service</h1>
                            </div>
                            
                            <div className='w-[100%] h-[13%] flex items-center justify-between mb-1'>
                                <div className='w-[24%] h-[100%] flex items-center justify-center border border-violet-300 bg-white pl-3'>
                                    <h1 className='text-gray-500'>Service Name</h1>
                                </div>
                                <div className='w-[24%] h-[100%] flex items-center justify-center border border-violet-300 bg-white pl-3'>
                                    <h1 className='text-gray-500'>Price</h1>
                                </div>
                                <div className='w-[50%] h-[100%] flex items-center justify-center border border-violet-300 bg-white pl-3'>
                                    <h1 className='text-gray-500'>Description</h1>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className='w-[100%] h-[50%] flex justify-between'>
                                
                                <div className='w-[49%] h-[100%]'>
                                    <div className='w-[100%] h-[30%] flex justify-between'>
                                        <div className='w-[49%] h-[100%] border'>
                                            <input
                                                type="text"
                                                id="servicename"
                                                value={servicename}
                                                onChange={(e) => setServicename(e.target.value)}
                                                placeholder='Enter Service Name'
                                                className="w-[100%] h-[100%] pl-3 focus:outline-violet-400 text-sm text-gray-500"
                                                required
                                            />
                                        </div>
                                        <div className='w-[49%] h-[100%] border'>
                                            <input
                                                type="number"
                                                id="price"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder='Enter Price'
                                                className="w-[100%] h-[100%] pl-3 pr-3 focus:outline-violet-400 text-sm text-gray-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='w-[100%] h-[25%] bg-white flex items-center border-violet-300 justify-center border mt-1'>
                                        <h1 className='text-gray-500'>Image</h1>
                                    </div>
                                    <div className='w-[100%] h-[31%] border mt-1'>
                                        <input
                                            type="text"
                                            id="image"
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder='Enter image url'
                                            className="w-[100%] h-[100%] pl-3 focus:outline-violet-400 text-sm text-gray-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className='w-[50%] h-[100%] relative '>   
                                    <div className='w-[100%] h-[89%] bg-red-300 border'>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder='Enter Description'
                                            className="w-[100%] h-[100%] pl-3 pt-3 pr-3 focus:outline-violet-400 text-sm text-gray-500"
                                            required
                                        />
                                    </div>
                                    <div className='w-[28%] h-[27.5%] bg-gray-300 absolute right-1 -bottom-9 '>
                                        <button
                                                type="submit"
                                                className="w-[100%] h-[100%] rounded bg-blue-500 hover:bg-violet-400"
                                            >
                                                <h1 className='text-white'>Add Service</h1>
                                        </button>
                                    </div>

                                </div>
                            </form>

                           
                        </div>

                       

                        
                    </div>

                </div>

              
                <div className='w-[20%] h-[100%] bg-whiteitems-center justify-center p-3 border'>
                    <div className='w-[100%] h-[7%] border rounded-lg flex relative'>
                        <div className='w-[20%] h-[100%] p-2'>
                            <div className='w-[100%] h-[100%] bg-gray-100 rounded-md flex items-end justify-center'>
                                <img className='w-[90%]' src={man2}></img>
                            </div>
                        </div>
                        <div className='w-[50%] h-[100%] flex flex-col items-center justify-center'>
                            <div className='w-[100%] h-[40%]'>
                                <h1 className='font-semibold text-gray-700 text-lg'>Guys&Gals</h1>
                            </div>  
                            <div className='w-[100%] h-[40%]'>
                                <h1 className='text-sm font-semibold text-violet-400'>Owner</h1>
                            </div>  
                        </div>
                        <div className='w-[30%] h-[100%] flex items-center justify-center'>
                            <h1 onClick={handleLogoutClick} className='text-sm font-semibold text-gray-400 cursor-pointer hover:text-gray-800'>Logout</h1>
                        </div>

                        {showLogoutBox && (
                            <div className="absolute top-16 mt-1 right-0 w-60 p-4 bg-white border rounded-md shadow-md">
                                <p className="text-gray-700">Are you sure you want to log out?</p>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button 
                                        onClick={handleCloseBox} 
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


                    <div className="w-[100%] h-[93%] rounded-lg p-4 overflow-y-scroll">
                        <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>

                        {/* Month Selector */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                            <FaCalendarAlt className="text-blue-500" />
                            <span className="font-medium">
                                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                            </span>
                            </div>
                            <div className="flex space-x-2">
                            <button onClick={() => changeMonth(-1)} className="text-gray-500">&lt;</button>
                            <button onClick={() => changeMonth(1)} className="text-gray-500">&gt;</button>
                            </div>

                            
                        </div>

                        {/* Date Selector */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {/* {daysOfWeek.map((day, index) => (
                            <div key={index} className="text-center text-xs text-gray-500">{day}</div>
                            ))}
                            {Array.from({ length: getFirstDayOfMonth() }).map((_, index) => (
                            <div key={index} />
                            ))}
                            {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() })
                            .map((_, day) => (                 
                                <div
                                key={day + 1}
                                onClick={() => setSelectedDay(day + 1)}
                                className={`text-center text-sm cursor-pointer ${
                                    selectedDay === day + 1 ? 'font-bold bg-violet-400 text-white rounded-sm' : 'text-gray-600'
                                }`}
                                >
                                {day + 1}
                                </div>
                            ))} */}
                             {daysOfWeek.map((day, index) => (
                                    <div key={index} className="text-center text-xs text-gray-500">{day}</div>
                                ))}
                                {Array.from({ length: getFirstDayOfMonth() }).map((_, index) => (
                                    <div key={index} />
                                ))}
                                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() })
                                    .map((_, day) => {
                                        const calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0); // Normalize time to midnight for comparison

                                        // Check for an appointment on this date
                                        const appointmentForDate = filteredAppointments.find(appointment => {
                                            const appointmentDate = new Date(appointment.date); // Assuming appointment.date exists
                                            appointmentDate.setHours(0, 0, 0, 0); // Normalize time for comparison
                                            return appointmentDate.getTime() === calendarDate.getTime();
                                        });

                                        // Determine the color based on date comparison
                                        let dateColorClass = 'text-gray-600'; // Default color if no appointment
                                        if (appointmentForDate) {
                                            if (calendarDate < today) {
                                                dateColorClass = 'text-red-500'; // Past appointment
                                            } else if (calendarDate > today) {
                                                dateColorClass = 'text-green-500'; // Future appointment
                                            } else {
                                                dateColorClass = 'text-blue-500 font-bold'; // Current date
                                            }
                                        } else if (calendarDate.getTime() === today.getTime()) {
                                            dateColorClass = 'text-blue-500 font-bold'; // Current date with no appointment
                                        }   

                                        return (
                                            <div
                                                key={day + 1}
                                                onClick={() => setSelectedDay(day + 1)}
                                                className={`text-center text-sm cursor-pointer ${dateColorClass} ${
                                                    selectedDay === day + 1 ? 'font-bold bg-violet-400 rounded-sm ' : ''
                                                }`}
                                            >
                                                {day + 1}
                                            </div>
                                        );
                                    })}
                        </div>

                        {/* Appointment List */}
                        <div className="space-y-4">
                        {/* {filteredAppointments.length > 0 ? (
                                    filteredAppointments
                                        .filter(appointment => appointment.status === 'Paid') // Filter for appointments with status "Paid"
                                        .map((appointment, index) => (
                                            
                                            <div key={appointment.appointmentid} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg shadow-sm">
                                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                                    {appointment.imageUrl ? (
                                                        <img src={appointment.imageUrl} alt={appointment.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-gray-500 text-lg">{appointment.initials}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">   
                                                    <h3 className="text-sm font-semibold">{appointment.fname} {appointment.lname}</h3>
                                                    <p className="text-xs text-gray-500">{appointment.servicename}</p>
                                                    <p className="text-xs text-gray-400">{appointment.time}</p>
                                                </div>
                                                <div className="text-sm font-semibold">P{appointment.price}</div>
                                            </div>
                                        ))
                                ) : (
                                    <div className='w-[100%] flex items-center justify-center mt-10'>
                                        <p className="text-gray-500">No appointments on this day.</p>
                                    </div>
                                )} */}
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments
                                        .filter(appointment => {
                                            const appointmentDate = new Date(appointment.date);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0); // Normalize time to midnight for comparison

                                            // Check if the appointment is paid and upcoming or if the selected date matches
                                            return (appointment.status === 'Paid' || appointment.status === 'Half Paid' || appointment.status === 'Pending' || appointment.status === 'Onsite') && 
                                            (appointmentDate >= today || selectedDay === appointmentDate.getDate());
                                        }) // Filter for appointments with status "Paid"
                                        .map((appointment, index) => (
                                            <div key={appointment.appointmentid} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg shadow-lg border">
                                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                                    {appointment.imageUrl ? (
                                                        <img src={appointment.imageUrl} alt={appointment.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-gray-500 text-lg">{appointment.initials}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">   
                                                    <h3 className="text-sm font-semibold">{appointment.fname} {appointment.lname}</h3>
                                                    <p className="text-xs text-gray-500">{appointment.servicename}</p>
                                                    <p className="text-xs text-gray-500">{appointment.status}</p>
                                                    <p className="text-xs text-gray-400">{appointment.date}</p>
                                                    <p className="text-xs text-gray-400">{appointment.time}</p>
                                                </div>
                                                <div className="text-sm font-semibold text-blue-400">P {appointment.price}</div>
                                            </div>
                                        ))
                                ) : (
                                    <div className='w-[100%] flex items-center justify-center mt-10'>
                                        <p className="text-gray-500">No appointments on this day.</p>
                                    </div>
                                )}
                        </div>                    


                    </div>

                </div>

            </div>

            
        </div>   
    );
}

export default AdminInterface;
