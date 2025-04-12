import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row, Col } from "antd";
import DoctorsList from "../components/DoctorsList";
import "../styles/HomeStyles.css";
import { FaUserMd } from "react-icons/fa";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "/api/v1/user/getAllDoctors",
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="home-container">
        <div className="home-content">
          <div className="home-header">
           
            <h1 className="home-title">Available Doctors</h1>
          </div>
          <div className="doctors-grid">
            <Row gutter={[24, 24]}>
              {doctors.map((doctor) => (
                <Col xs={24} sm={24} md={12} lg={8} xl={8} key={doctor._id}>
                  <DoctorsList doctor={doctor} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
