import { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";
import "../../styles/TableStyles.css";

const Users = () => {
  const [user, setUser] = useState([]);

  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "40%",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      width: "30%",
      render: (text, record) => (
        <span className={`status-badge status-${record.isDoctor ? "approved" : "rejected"}`}>
          {record.isDoctor ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  return (
    <div className="table-container">
      <Layout>
        <div className="table-content">
          <div className="table-header">
            <h1 className="table-title">Users List</h1>
          </div>
          <div className="table">
            <Table
              columns={columns}
              dataSource={user}
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

export default Users;
