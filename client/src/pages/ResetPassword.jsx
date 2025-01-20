import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoReturnDownBack } from "react-icons/io5";
import './ResetPassword.css'; // Adjust the path as necessary

export default function ResetPassword() {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);  // New state to track success

  console.log('Reset Token:', resetToken); // Check if this logs the token

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      const response = await axios.post('http://localhost:8000/auth/reset-password', {resetToken, newPassword });
      const { data } = response;
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success('Password successfully reset');
        setIsResetSuccessful(true);  // Set success state to true
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className='wrapper'>
      {!isResetSuccessful ? (
        <form onSubmit={handleResetPassword}>
          <h1>Reset Password</h1>
          <div className="input-box">
            <input
              type='password'
              placeholder='New Password'
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <RiLockPasswordFill className="icon" />
          </div>
          <div className="input-box">
            <input
              type='password'
              placeholder='Confirm New Password'
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <RiLockPasswordFill className="icon" />
          </div>
          <button className="rp-btn" type="submit">Reset Password</button>
        </form>
      ) : (
        // Show this message after the password is reset successfully
        <div className="success-message">
          <h1>Password Reset Successfully</h1>
          <p>Your password has been reset. You can now go back to the website and log in with your new password.</p>
          <IoReturnDownBack className="icon" />
        </div>
      )}
    </div>
  );
}