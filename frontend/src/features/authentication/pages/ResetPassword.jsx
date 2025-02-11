import React from "react";

import ResetPasswordForm from "@Auth/components/ResetPasswordForm";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  return (
    <div className={styles.page}>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;