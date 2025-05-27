import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './Register.css';
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdCall } from "react-icons/io";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otpMethod: 'email' // Default to email
  });

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone, otpMethod } = data;

    // Trim and validate data
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const trimmedPhone = phone.trim();

    // Check if passwords match
    if (trimmedPassword !== trimmedConfirmPassword) {
      console.error('Validation Error: Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    // Check if password length is valid
  if (trimmedPassword.length < 6) {
    toast.error('Password must be at least 6 characters long');
    return;
  }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      toast.error('Phone number must be exactly 10 digits long');
      console.error('Validation Error: Phone number must be exactly 10 digits long');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        name: name.trim(), 
        email: email.trim(), 
        password: trimmedPassword, 
        confirmPassword: trimmedConfirmPassword,
        phone: trimmedPhone,
        otpMethod
      });

      const { data } = response;
      if (data.error) {
        toast.error(data.error);
      } else {
        // Store email and phone in localStorage for OTP verification
        localStorage.setItem('email', email.trim());
        localStorage.setItem('phone', trimmedPhone);
        if (localStorage.getItem('phone') !== trimmedPhone) {
          localStorage.setItem('phone', trimmedPhone);
        }
        
        
        setData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          otpMethod: 'email'
        });
        toast.success('Registration Successful. Check your email/phone for OTP');
        navigate('/verify-otp');// Redirect to OTP verification page
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
  toast.error(error.response?.data?.error || 'An error occurred during registration');
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={registerUser}>
        <h1>Register</h1>
        <div className="input-box">
          <input
            type='text'
            placeholder='Username'
            value={data.name}
            required
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type='email'
            placeholder='Email'
            value={data.email}
            required
            onChange={(e) => setData({ ...data, email: e.target.value })}
            autoComplete="email"
          />
          <IoIosMail className="icon" />
        </div>
        <div className="input-box">
          <input
            type='password'
            placeholder='Password'
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            autoComplete="new-password"
          />
          <RiLockPasswordFill className="icon" />
        </div>
        <div className="input-box">
          <input
            type='password'
            placeholder='Confirm Password'
            value={data.confirmPassword}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
            autoComplete="new-password"
          />
          <RiLockPasswordFill className="icon" />
        </div>
        <div className="input-box">
          <input
            type='text'
            placeholder='Phone Number'
            value={data.phone}
            required
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <IoMdCall className="icon" />
        </div>
        <div className="input-box-choice">
          <p>Select where you want to receive the OTP:</p>
          <label className="btn-choice-email">
            <input
              type='radio'
              name='otpMethod'
              value='email'
              checked={data.otpMethod === 'email'}
              onChange={(e) => setData({ ...data, otpMethod: e.target.value })}
            />
            Email
          </label>
          <label className="btn-choice-phone">
            <input
              type='radio'
              name='otpMethod'
              value='phone'
              checked={data.otpMethod === 'phone'}
              onChange={(e) => setData({ ...data, otpMethod: e.target.value })}
            />
            Phone
          </label>
        </div>
        <button type='submit'>Register</button>
        <div className="login-link">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </form>
    </div>
  );
}