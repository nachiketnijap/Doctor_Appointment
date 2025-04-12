import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import "../../styles/DoctorAppointmentStyles.css";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/doctor/doctor-appointments", {
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

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      width: "20%",
    },
    {
      title: "Date",
      dataIndex: "date",
      width: "20%",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "20%",
      render: (status) => (
        <span className={`status-${status.toLowerCase()}`}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "40%",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger mx-2"
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </button>
            </div>
          )}
          {record.status === "approved" && (
            <button
              className="btn btn-danger"
              onClick={() => handleStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
          {record.status === "rejected" && (
            <button
              className="btn btn-success"
              onClick={() => handleStatus(record, "approved")}
            >
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="doctor-appointments-container">
      <Layout>
        <div className="doctor-appointments-content">
          <div className="doctor-appointments-header">
            <h1 className="doctor-appointments-title">Appointments</h1>
          </div>
          <div className="doctor-appointments-table">
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="_id"
              pagination={{
                position: ["bottomCenter"],
                pageSize: 5,
                showSizeChanger: false,
              }}
            />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default DoctorAppointment;
