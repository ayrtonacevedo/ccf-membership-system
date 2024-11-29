import React from "react";
import "./spinners.css";

export const Spinners = () => {
  return (
    // <div className="d-flex justify-content-center align-items-center vh-100">
    //   <div className="spinner-border text-success custom-spinner" role="status">
    //     <span className="visually-hidden">Loading...</span>
    //   </div>
    // </div>
    <div className="containerSpinners">
      <div className="spinner-border text-success custom-spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
