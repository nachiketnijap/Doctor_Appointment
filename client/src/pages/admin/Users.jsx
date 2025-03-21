import  { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table } from "antd";
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

  // ant d table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    // {
    //   title: "Actions",
    //   dataIndex: "actions",
    //   render: () => (
    //     <div className="d-flex">
    //       <button className="btn btn-danger">Block</button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <Layout>
      <h1 className="text-center mt-4">Users list</h1>
      <Table columns={columns} dataSource={user} />
    </Layout>
  );
};

export default Users;
