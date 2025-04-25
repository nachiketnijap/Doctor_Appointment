import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { DatePicker, TimePicker, message, Card, Typography, Button } from "antd";
import { UserOutlined, ClockCircleOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import "../styles/BookingStyles.css";

const { Title, Text } = Typography;

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState();
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {

    
    
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("date and time required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          userInfo: user,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleAvailability = async (e) => {
    e.preventDefault();
    console.log("date is::"+date);
    console.log("time is::"+time);
    try {
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="booking-container">
        <div className="booking-content">
          <Card className="booking-card">
            {doctors && (
              <div className="booking-details">
                <div className="doctor-header">
                  <Title level={2} className="doctor-name">
                    <UserOutlined /> Dr. {doctors.firstName} {doctors.lastName}
                  </Title>
                  <Text className="doctor-fees">
                    <DollarOutlined className="fees-icon" />
                    Consultation Fee: ₹{doctors.feesPerConsultation}
                  </Text>
                </div>

                <div className="timing-info">
                  <Text className="timing-label">
                    <ClockCircleOutlined /> Available Timings:
                  </Text>
                  <Text className="timing-value">
                    {doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}
                  </Text>
                </div>

                <div className="booking-form">
                  <div className="form-group">
                    <Text className="form-label">
                      <CalendarOutlined /> Select Date
                    </Text>
                    <DatePicker
                     className="booking-input"
                      format="DD-MM-YYYY"
                      onChange={(value) => {
                        console.log("value is::"+value)
                        setIsAvailable(false);
                        setDate(moment(Number(value)).format("DD-MM-YYYY"));
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <Text className="form-label">
                      <ClockCircleOutlined /> Select Time
                    </Text>
                    <TimePicker
                     className="booking-input"
                      format="HH:mm"
                      onChange={(value) => {
                        console.log("value is::"+value)
                        setIsAvailable(false);
                        setTime(moment(Number(value)).format("HH:mm"));
                      }}
                    />
                  </div>

                  <div className="booking-actions">
                    <Button
                      type="primary"
                      className="booking-button booking-button-primary"
                      onClick={handleAvailability}
                    >
                      Check Availability
                    </Button>
                    {isAvailable && (
                      <Button
                        type="primary"
                        className="booking-button booking-button-primary"
                        onClick={handleBooking}
                      >
                        Book Appointment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
