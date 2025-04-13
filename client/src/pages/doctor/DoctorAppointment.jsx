import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
import "../../styles/TableStyles.css";

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
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "40%",
      render: (text, record) => (
        <div className="action-buttons">
          {record.status === "pending" && (
            <>
              <button
                className="btn-approve"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => handleStatus(record, "rejected")}
              >
                Reject
              </button>
            </>
          )}
          {record.status === "approved" && (
            <button
              className="btn-reject"
              onClick={() => handleStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
          {record.status === "rejected" && (
            <button
              className="btn-approve"
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
    <Layout>
      <div className="table-container">
        <div className="table-content">
          <div className="table-header">
            <h1 className="table-title">Appointments</h1>
          </div>
          <div className="table">
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
      </div>
    </Layout>
  );
};

export default DoctorAppointment;
