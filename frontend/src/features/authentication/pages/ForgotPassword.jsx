import React from "react";

import ForgotPasswordForm from "@Auth/components/ForgotPasswordForm";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  return (
    <div className={styles.page}>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;