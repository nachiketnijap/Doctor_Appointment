import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";
import "../../styles/TableStyles.css";

const Doctors = () => {
  const [doctor, setDoctor] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        {
          doctorId: record._id,
          userId: record.userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
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
      title: "Phone Number",
      dataIndex: "phone",
      width: "25%",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "25%",
      render: (text, record) => (
        <div className="action-buttons">
          {record.status === "pending" || record.status === "rejected" ? (
            <button
              className="btn-approve"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              className="btn-reject"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="table-container">
      <Layout>
        <div className="table-content">
          <div className="table-header">
            <h1 className="table-title">Doctors List</h1>
          </div>
          <div className="table">
            <Table
              columns={columns}
              dataSource={doctor}
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

export default Doctors;
