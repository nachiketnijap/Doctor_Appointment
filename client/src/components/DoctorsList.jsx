import { useNavigate } from "react-router-dom";
import { FaUserDoctor, FaClock, FaMoneyBillWave, FaGraduationCap } from "react-icons/fa6";
import "../styles/DoctorCardStyles.css";

const DoctorsList = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div
      className="doctor-card"
      onClick={() => navigate(`doctor/book-appointment/${doctor._id}`)}
    >
      <div className="doctor-card-header">
        <FaUserDoctor className="doctor-icon" />
        <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
      </div>
      <div className="doctor-card-body">
        <div className="doctor-info-item">
          <FaGraduationCap className="info-icon" />
          <div className="info-content">
            <span className="info-label">Specialization</span>
            <span className="info-value">{doctor.specialization}</span>
          </div>
        </div>
        <div className="doctor-info-item">
          <FaUserDoctor className="info-icon" />
          <div className="info-content">
            <span className="info-label">Experience</span>
            <span className="info-value">{doctor.experience} years</span>
          </div>
        </div>
        <div className="doctor-info-item">
          <FaMoneyBillWave className="info-icon" />
          <div className="info-content">
            <span className="info-label">Fees Per Consultation</span>
            <span className="info-value">₹{doctor.feesPerConsultation}</span>
          </div>
        </div>
        <div className="doctor-info-item">
          <FaClock className="info-icon" />
          <div className="info-content">
            <span className="info-label">Timings</span>
            <span className="info-value">{doctor.timings[0]} - {doctor.timings[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
