import React from "react";
import * as styles from "../pages/auth/AuthPage.module.css";

export default function Error({ err }) {
  return <p className={styles.invalid}>{err}</p>;
}
