import { useState, useEffect } from "react";
import { message, Typography, Tag } from "antd";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import "../styles/AppointmentsStyles.css";

const { Title } = Typography;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const getStatusTag = (status) => {
    let color = "default";
    let className = "status-badge";
    
    switch (status.toLowerCase()) {
      case "approved":
        color = "success";
        className += " status-approved";
        break;
      case "pending":
        color = "warning";
        className += " status-pending";
        break;
      case "rejected":
        color = "error";
        className += " status-rejected";
        break;
      default:
        break;
    }
    
    return <Tag color={color} className={className}>{status}</Tag>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
      render: (text) => <span className="appointment-id">{text}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <div className="appointment-datetime">
          <span className="date">{moment(record.date).format("DD-MM-YYYY")}</span>
          <span className="time">{moment(record.time).format("HH:mm")}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <Layout>
      <div className="appointments-container">
        <div className="appointments-content">
          <div className="appointments-header">
            <h1 className="appointments-title">My Appointments</h1>
          </div>
          <div className="appointments-table">
            <Table 
              columns={columns} 
              dataSource={appointments} 
              rowKey="_id"
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
