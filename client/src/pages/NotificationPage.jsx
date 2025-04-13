import Layout from "../components/Layout";
import { Tabs, message, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/NotificationStyles.css";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const items = [
    {
      key: '0',
      label: 'Unread',
      children: (
        <>
          <div className="notification-actions">
            <h4 onClick={handleMarkAllRead}>Mark All as Read</h4>
          </div>
          {user?.notification?.length > 0 ? (
            user.notification.map((notificationMsg) => (
              <div
                key={notificationMsg._id}
                className="notification-card"
                onClick={() => navigate(notificationMsg.onClickPath)}
              >
                <p className="notification-message">{notificationMsg.message}</p>
              </div>
            ))
          ) : (
            <Empty
              description="No unread notifications"
              className="empty-state"
            />
          )}
        </>
      ),
    },
    {
      key: '1',
      label: 'Read',
      children: (
        <>
          <div className="notification-actions">
            <h4 onClick={handleDeleteAllRead}>Delete All Read</h4>
          </div>
          {user?.seennotification?.length > 0 ? (
            user.seennotification.map((notificationMsg) => (
              <div
                key={notificationMsg._id}
                className="notification-card"
                onClick={() => navigate(notificationMsg.onClickPath)}
              >
                <p className="notification-message">{notificationMsg.message}</p>
              </div>
            ))
          ) : (
            <Empty
              description="No read notifications"
              className="empty-state"
            />
          )}
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="notification-page">
        <div className="notification-header">
          <h4>Notifications</h4>
        </div>
        <Tabs
          items={items}
          className="notification-tabs"
          defaultActiveKey="0"
        />
      </div>
    </Layout>
  );
};

export default NotificationPage;
