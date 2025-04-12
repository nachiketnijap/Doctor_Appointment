import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Row, Col, Typography } from "antd";
import DoctorsList from "../components/DoctorsList";
import "../styles/BaseStyles.css";

const { Title } = Typography;

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
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
          <Title level={1} className="home-title">
            Available Doctors
          </Title>
          <div className="doctors-grid">
            <Row gutter={[24, 24]} justify="center">
              {doctors && doctors.map((doctor) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={doctor._id}>
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
