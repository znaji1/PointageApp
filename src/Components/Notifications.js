import React from "react";
import { toast } from "react-toastify";

export const showError = (message) => {
  return toast.error(<h6 className="error-message">{message}</h6>, {
    hideProgressBar: false,
    autoClose: 5000,
  });
};
export const showSuccess = (message) => {
  return toast.success(<h6 className="success-message">{message}</h6>, {
    hideProgressBar: false,
    autoClose: 5000,
  });
};
export const showInfo = (message) => {
  return toast.info(<h6 className="info-message">{message}</h6>, {
    hideProgressBar: false,
    autoClose: 5000,
  });
};
