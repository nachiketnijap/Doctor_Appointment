import { Col, Form, Input, Row, TimePicker, message,Typography } from "antd";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";
const { Title } = Typography;
const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("res added successfully");
        navigate("/");
      } else {
        message.error(res.data.error);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error.response.data);
      message.error("something went wrong");
    }
  };
  return (
    <Layout>
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <Title level={2} className="profile-title">Apply Doctor</Title>
        </div>
        <Form layout="vertical" onFinish={handleFinish} className="profile-form">
          <div className="profile-card">
            <h4>Personal Details</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="First Name" name="firstName" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="Your Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Last Name" name="lastName" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Phone Number" name="phone" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="Phone Number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="E-mail" name="email" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="E-mail" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Web Site" name="website" required>
                  <Input type="text" placeholder="Web Site" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Address" name="address" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="Your Address" />
                </Form.Item>
              </Col>
            </Row>
          </div>
  
          <div className="profile-card">
            <h4>Professional Details</h4>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Specialization" name="specialization" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="Your Specialization" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Experience" name="experience" required rules={[{ required: true }]}>
                  <Input type="text" placeholder="Years of Experience" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Fees" name="feesPerConsultation" required rules={[{ required: true }]}>
                  <Input type="number" placeholder="Consultation Fee" />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label="Timings" name="timings" required rules={[{ required: true }]}>
                  <TimePicker.RangePicker className="time-picker" format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          </div>
  
          <div className="update-row">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  </Layout>
  
  );
};

export default ApplyDoctor;
