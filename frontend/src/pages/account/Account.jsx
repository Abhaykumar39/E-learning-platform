import React from "react";
import "./account.css";
import { MdDashboard } from "react-icons/md";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <div className="account-wrapper">
      {user && (
        <div className="profile-card">
          <h2 className="profile-title">👤 My Profile</h2>
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div className="button-group">
              <button
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="profile-btn"
              >
                <MdDashboard />
                &nbsp; Dashboard
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => navigate(`/admin/dashboard`)}
                  className="profile-btn"
                >
                  <MdDashboard />
                  &nbsp; Admin Panel
                </button>
              )}

              <button
                onClick={logoutHandler}
                className="profile-btn logout-btn"
              >
                <RiLogoutCircleRFill />
                &nbsp; Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
