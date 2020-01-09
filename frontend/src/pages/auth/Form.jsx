import React from "react";
import Error from "../../components/Error";

import * as styles from "./AuthPage.module.css";

export default function Form({
  loginMode,
  email,
  password,
  invalidEmail,
  invalidPassword,
  handleModeSwitch,
  handleChange,
  handleSubmit,
  err
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.auth_form}>
      <p>Please {loginMode ? "Sign In" : "Sign Up"} to continue:</p>
      <div className={styles.form_control}>
        <label>
          Email
          <input
            type="text"
            name="email"
            value={email}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      {!loginMode && invalidEmail && (
        <p className={styles.invalid}>This is not a valid email address</p>
      )}
      <div className={styles.form_control}>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={handleChange}
          />
        </label>
      </div>
      {!loginMode && invalidPassword && (
        <p className={styles.invalid}>Your password is not long enough</p>
      )}
      {(loginMode && invalidPassword) ||
        (loginMode && invalidEmail && (
          <p className={styles.invalid}>Incorrect signin information</p>
        ))}
      {loginMode && invalidPassword && (
        <p className={styles.invalid}>Incorrect signin information</p>
      )}
      <div className={styles.form_actions}>
        <button type="submit">Continue</button>
        <button type="button" onClick={handleModeSwitch}>
          Switch to {loginMode ? "Sign Up" : "Sign In"}
        </button>
      </div>
      {err && <Error err={err} />}
    </form>
  );
}
