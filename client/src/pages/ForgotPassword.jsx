import { useState } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import './ForgotPassword.css'; // Adjust the path as necessary

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/forgot-password', { email });
      const { data } = response;
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Password reset link sent to your email');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={handleForgotPassword}>
        <h1>Forgot Password</h1>
        <div className="input-box">
          <input
            type='email'
            placeholder='Enter your email'
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MdEmail className="icon" />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}
