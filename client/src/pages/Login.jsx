import { Form, Input, message } from "antd";
import "../styles/RegisterStyles.css";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="login-content">
          <div className="login-header">
            <h1>Welcome Back!</h1>
            <p>Please login to your account</p>
          </div>
          <Form
            layout="vertical"
            onFinish={onfinishHandler}
            className="register-form"
          >
            <Form.Item 
              label="Email" 
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item 
              label="Password" 
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                Sign In
              </button>
            </div>

            <div className="links-container">
              <Link to="/register" className="register-link">
                Create an account
              </Link>
              <Link to="/forget-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
