import React from "react";
import image from "../../assets/images/illustrations/undraw_bug_fixing.svg";

const ErrorFound = () => (
  <div className="container empty">
    <div className="empty-icon">
      <img src={image} className="h-8 mb-4" alt="" />
    </div>
    <p className="empty-title h3">Error</p>
    <p className="empty-subtitle text-muted">Oops something went wrong</p>
  </div>
);

export default ErrorFound;
