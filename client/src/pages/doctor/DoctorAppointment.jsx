import Layout from "../../components/Layout";
import  { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
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
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorId.firstName} {record.doctorId.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorId.phone}</span>,
    // },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
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
    <div>
      <Layout>
        <h1>Appointments</h1>
        <Table columns={columns} dataSource={appointments} />
      </Layout>
    </div>
  );
};

export default DoctorAppointment;
