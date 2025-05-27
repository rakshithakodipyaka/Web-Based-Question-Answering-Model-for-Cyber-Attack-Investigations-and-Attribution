import { useState } from "react";
import axios from 'axios'
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import './Login.css'; // Adjust the path as necessary

export default function Login() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const loginUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        name,
        email,
        password
      });
      const { data: responseData } = response;
      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        setData({});
        toast.success('Login Successful!!');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || 'An error occurred during login');
      } else {
        toast.error(error.message || 'An error occurred');
      }
    }
  }

  return (
    <div className='wrapper'>
      <form onSubmit={loginUser}>
        <h1>Login</h1>
        <div className="input-box">
          <input
            type='text'
            placeholder='Username'
            autoComplete="name"
            required
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input
            type='email'
            placeholder='Email'
            autoComplete="email"
            required
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <MdEmail className="icon" />
        </div>
        <div className="input-box">
          <input
            type='password'
            placeholder='Password'
            autoComplete="new-password"
            required
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <RiLockPasswordFill className="icon" />
        </div>
        <div className="remember-forget">
          <label><input type="checkbox" />Remember me</label>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  )
}
