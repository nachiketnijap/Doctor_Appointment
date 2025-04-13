import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { message } from "antd";
import "../styles/AuthStyles.css";

const ForgetPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/v1/user/forget-password", values)
        .then(() => {
          message.success("Email sent successfully");
        })
        .catch((error) => {
          if (error.response.status === 404) {
            message.error("Email not found");
          } else {
            message.error("Server error");
          }
        });
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 auth-page">
      <div className="card p-4 shadow form-container" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Forgot your password?</h2>
          <p className="text-center text-muted mb-4">
            Enter your email and we shall send you a reset link.
          </p>
          <form onSubmit={formik.handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;