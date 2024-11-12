import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import gcash from "../assets/gcash.png"
import logo from "../assets/gcashlogo.png"
import { Link } from 'react-router-dom'
import "../Payment/Payment.css"

function Payment() {

  const location = useLocation();
//   const { totalPrice } = location.state || { totalPrice: 0 };
const { totalPrice: initialTotalPrice } = location.state || { totalPrice: 0 };
const [selectedAmount, setSelectedAmount] = useState(initialTotalPrice);
const PAYMONGO_KEY = "sk_test_wvTfm2Zeo5j541jXJApMu3jr";

  

const handlePayment = async (retries = 3) => {
    try {

        const currentDate = new Date().toISOString().split('T')[0];

        const response = await axios.post('https://api.paymongo.com/v1/links', {
            data: {
                attributes: {
                    amount: selectedAmount * 100, // Convert to integer (in cents)
                    description: `Date - ${currentDate}`,
                    remarks: "none"
                }
            }
        }, {
            headers: {
                'accept': 'application/json',
                'authorization': 'Basic c2tfdGVzdF93dlRmbTJaZW81ajU0MWpYSkFwTXUzanI6', // Use your actual PayMongo key here
                'content-type': 'application/json'
            }
        });

        console.log('Payment link created:', response.data);
        // Optionally handle the response, e.g., redirect the user to the payment link
        if (response.data && response.data.data && response.data.data.attributes) {
            window.open(response.data.data.attributes.checkout_url, '_blank'); // Redirect to the checkout URL
        }
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            console.log(`Rate limit exceeded. Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
            return handlePayment(retries - 1); // Retry
        }
        console.error('Payment error:', error);
        // Handle the error appropriately
    }
};



// const handlePayment = async (retries = 3) => {
//     const payMongoKey = 'sk_test_wvTfm2Zeo5j541jXJApMu3jr'; // Your actual PayMongo key
//     const apiKey = `${payMongoKey}:`; // Ensure to format it correctly
//     const encodedKey = btoa(apiKey); // Use btoa to encode the key

//     try {
//         const currentDate = new Date().toISOString().split('T')[0];

//         const response = await axios.post('https://api.paymongo.com/v1/links', {
//             data: {
//                 attributes: {
//                     amount: selectedAmount * 100, // Convert to integer (in cents)
//                     description: `Date - ${currentDate}`,
//                     remarks: "none"
//                 }
//             }
//         }, {
//             headers: {
//                 'accept': 'application/json',
//                 'authorization': `Basic ${encodedKey}`, // Use the encoded key
//                 'content-type': 'application/json'
//             }
//         });

//         console.log('Payment link created:', response.data);
        
//         if (response.data && response.data.data && response.data.data.attributes) {
//             // Redirect to the checkout URL
//             const checkoutUrl = response.data.data.attributes.checkout_url;
//             window.open(checkoutUrl, '_blank'); // Redirect to the checkout URL

//             // Send a request to your webhook to log the payment initiation
//             await axios.post('http://localhost:21108/api/v1/webhook', {
//                 amount: selectedAmount,
//                 date: currentDate,
//                 checkoutUrl: checkoutUrl
//             });
//         }
//     } catch (error) {
//         if (error.response && error.response.status === 429 && retries > 0) {
//             console.log(`Rate limit exceeded. Retrying... (${retries} attempts left)`);
//             await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
//             return handlePayment(retries - 1); // Retry
//         }
//         console.error('Payment error:', error.response ? error.response.data : error.message);
//         // Handle the error appropriately
//     }
// };




  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 flex-col">
        <div className='w-[100%] h-[7%] bg-white flex relative'>
            <div className='w-[20%] h-[100%] pl-5 flex items-center'>
                <h1 className='text-2xl font-semibold text-gray-500'>Checkout</h1>
            </div>
            <Link to={'/Home'}>
            <div className='w-[6%] h-[100%] absolute right-0 flex items-center justify-center cursor-pointer border-b-2 border-transparent hover:border-blue-500 group'>
                <h1 className='text-lg font-semibold text-blue-400 group-hover:text-blue-500'>Home</h1>
            </div>
            </Link>
        </div>

    <div className='w-[100%] h-[93%] flex items-center justify-center relative'>
       
        <div className='paymentbg1 w-[50%] h-[100%] absolute left-0'>

        </div>
        <div className='paymentbg2 w-[50%] h-[100%] absolute right-0'>

        </div>

      <div className='w-[30%] h-[80%] bg-white flex items-center flex-col border z-50'>
        <div className='w-[100%] h-[25%] bg-white p-1.5'>
          <div className='w-[100%] h-[100%] bg-gray-200'>
              <div className='w-[100%] h-[60%] flex items-center justify-center'><img src={gcash} className='w-[23%]'></img></div>
          </div>
        </div>

        <div className='w-[65%] h-[60%] bg-white bottom-16 relative border rounded-3xl'>
            <div className='w-[100%] h-[25%] p-2 flex flex-col items-center justify-center bg-white'>
              <div className='w-[100%] h-[30%] flex items-center pl-4'>
                  <h1 className='font-medium text-sm text-gray-500'>Merchant <span className='ml-3 font-bold text-sm'>Guys & Gals</span></h1>
              </div>    
              <div className='w-[100%] h-[30%] flex items-center pl-4'>
                  <h1 className='font-medium text-sm text-gray-500'>Amount <span className='ml-6 text-sm font-medium text-blue-400'>PHP {selectedAmount}</span></h1>
              </div>          
            </div>

            <div className='w-[100%] h-[10%] flex items-center justify-center'>
                <h1 className='font-medium'>Pay with GCash</h1>
            </div>

            <div className='w-[100%] h-[65%] flex flex-col'>
                
                <div className='w-[100%] h-[30%] p-2 flex cursor-pointer' onClick={() => setSelectedAmount(initialTotalPrice)}>
                   <div className='bg-gray-100 w-[100%] h-[100%] flex border rounded-md hover:border-blue-400'>
                        <div className='w-[20%] h-[100%] flex items-center justify-center bg-gray-200'>
                            <input
                            type="radio"
                            value={initialTotalPrice}
                            checked={selectedAmount === initialTotalPrice}
                            onChange={() => setSelectedAmount(initialTotalPrice)}
                            />
                        </div>
                        <div className='w-[80%] h-[100%] flex items-center justify-center'>
                            <h3 className="text-sm text-gray-700">100% ( P{initialTotalPrice} )</h3>
                        </div>
                    </div>
                </div>

                <div className='w-[100%] h-[30%] p-2 flex cursor-pointer' onClick={() => setSelectedAmount(initialTotalPrice / 2)}>
                    <div className='bg-gray-100 w-[100%] h-[100%] flex border rounded-md hover:border-blue-400'>  
                        <div className='w-[20%] h-[100%] flex items-center justify-center  bg-gray-200' >
                            <input
                            type="radio"
                            value={initialTotalPrice / 2}
                            checked={selectedAmount === initialTotalPrice / 2}
                            onChange={() => setSelectedAmount(initialTotalPrice / 2)}
                            />
                        </div>
                        <div className='w-[80%] h-[100%]   flex items-center justify-center'>
                            <h3 className="text-sm text-gray-700">50% ( P{initialTotalPrice / 2} )</h3>
                        </div>
                    </div>
                </div>

                <div className='w-[100%] h-[40%] flex items-center justify-center p-7 text-center'>
                    <h3 className='text-xs text-gray-500'>We currently only accept GCash as our payment method. Please ensure that you select the GCash option at checkout to proceed with your payment.</h3>
                </div>
                
            </div>

        </div>

        <div className='w-[100%] h-[7%] bottom-14 relative flex justify-center'>
           <button onClick={handlePayment} className="bg-blue-500 hover:bg-blue-400 text-white text-lg font-semibold rounded w-[65%] h-[100%]">Pay</button>
        </div>
       
        <div className='w-[100%] h-[8%] bg-gray-200 flex items-center justify-center'>
            <h1 className='text-sm text-gray-600'>Powered by <span className='text-green-500 hover:text-green-400'><a target='blank' href='https://www.paymongo.com/'>Paymongo</a></span></h1>
        </div>

        </div>
      </div>

    </div>
  );
}

export default Payment;
