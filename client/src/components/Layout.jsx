import { useSelector } from "react-redux";
import { adminMenu, userMenu } from "../data/data";
import "../styles/LayoutStyles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { useState, useEffect } from "react";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  // Load the saved theme or default to 'light'
  const storedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(storedTheme);

  // Apply theme to <html> tag & store in localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  // ===========doctor menu===================
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },

    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];
  //rendering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>DOC APP</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div key={menu.name}>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </div>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>
                <div>
                  <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(19, 170, 82, 0.2)",
                      background: "rgba(255, 255, 255, 0.9)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {theme === "light" ? (
                      <>
                        <MdDarkMode style={{ color: "#13aa52", fontSize: "20px" }} />
                        <span style={{ color: "#333333", fontWeight: "500" }}>Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <MdLightMode style={{ color: "#13aa52", fontSize: "20px" }} />
                        <span style={{ color: "#ffffff", fontWeight: "500" }}>Light Mode</span>
                      </>
                    )}
                  </button>
                </div>
                <Link to="/profile">{user?.name}</Link>
                <Badge
                  className="badge-notification"
                  count={user && user.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i className="fa-solid fa-bell notification-bell"></i>
                </Badge>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
