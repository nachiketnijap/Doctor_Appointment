import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";


const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          `/api/v1/user/reset-password/${token}`,
          {
            newPassword: values.newPassword,
          }
        );
        
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        toast.error(
          error.response?.data?.message || 
          "Password reset failed. The link may have expired."
        );
      }
    },
  });

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="text-center mb-4">Reset Password</h2>
          <p className="text-center text-muted mb-4">
            Please enter your new password
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "is-invalid"
                    : ""
                }`}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="invalid-feedback">
                  {formik.errors.newPassword}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="invalid-feedback">
                  {formik.errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;