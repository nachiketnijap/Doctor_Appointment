import { Form, Input,  message } from "antd";
import "../styles/AuthStyles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
 

  //form Handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Register Successfully");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="register-page auth-page">
      <div className="form-container">
        <div className="register-content">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join us to manage your medical appointments</p>
          </div>
          <Form
            layout="vertical"
            onFinish={onfinishHandler}
            className="register-form"
          >
            <Form.Item 
              label="Name" 
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your name"
              />
            </Form.Item>

            <Form.Item 
              label="Email" 
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item 
              label="Password" 
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
               
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter your password"
              />
            </Form.Item>

            {/* <Form.Item 
              label="Role" 
              name="role"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select
                placeholder="Select your role"
                prefix={<UserSwitchOutlined />}
              >
                <Option value="doctor">Doctor</Option>
                <Option value="patient">Patient</Option>
              </Select>
            </Form.Item> */}

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                Register
              </button>
            </div>

            <div className="links-container" style={{ justifyContent: 'center' }}>
              <Link to="/login" className="login-link">
                Already have an account?  Login here
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
