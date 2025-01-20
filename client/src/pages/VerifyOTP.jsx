import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './VerifyOTP.css'; // Create this CSS file for styling

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const verifyOTP = async (e) => {
    e.preventDefault();

     // Retrieve email and phone from localStorage (or context if you have it)
     const email = localStorage.getItem('email'); // You can store email during registration
     const phone = localStorage.getItem('phone'); // You can store phone during registration
     console.log('Phone from localStorage:', phone);

     if (!email || !phone) {
       toast.error('Missing email or phone number. Please register again.');
       return;
     }

    try {
      const response = await axios.post('http://localhost:8000/auth/verify-otp', { email, phone, otp });
      const { data: responseData } = response;
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        toast.success('OTP verified successfully!');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred during OTP verification');
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={verifyOTP}>
        <h1>Verify OTP</h1>
        <div className="input-box">
          <input
            type='text'
            placeholder='Enter OTP'
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <button type='submit'>Verify OTP</button>
      </form>
    </div>
  );
}