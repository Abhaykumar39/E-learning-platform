import React from 'react';
import "./paymentsuccess.css";
import { Link, useParams } from 'react-router-dom';

const PaymentSuccess = ({ user }) => {
  const params = useParams();

  return (
    <div className="payment-success-page">
      {user && (
        <div className="success-message">
          <h2>🎉 Payment Successful!</h2>
          <p>Thank you, {user.name}!</p>
          <p>Your course subscription has been activated.</p>
          <p>
            Reference No.: <strong>{params.id}</strong> has been confirmed.
          </p>
          <p>You can now access your course from your dashboard.</p>
          <Link to={`/${user._id}/dashboard`} className="common-btn">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
