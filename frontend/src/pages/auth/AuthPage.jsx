import React, { Component } from "react";

import * as styles from "./AuthPage.module.css";
import * as api from "../../api";
import Forms from "./Forms";

export default class AuthPage extends Component {
  state = {
    email: "",
    password: "",
    signup_email: "",
    siginup_password: "",
    signin: "Please SIGNIN to continue:",
    signup: "Or, if you have not already done so, please SIGNUP to continue:",
    invalidPassword: false,
    invalidEmail: false
  };

  handleChange = event => {
    const value = event.target.value;
    const field = event.target.name;
    this.setState({ [field]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    if (!email.includes("@")) {
      this.setState({ invalidEmail: true });
    } else if (password.length < 8) {
      this.setState({ invalidPassword: true, invalidEmail: false });
    } else {
      // api.logIn(signin_email, signin_password).then(result => {
      //   console.log(result, "result log");
      // });
      this.setState({
        email: "",
        password: "",
        invalidPassword: false,
        invalidEmail: false
      });
    }
  };

  render() {
    const { email, password, invalidEmail, invalidPassword } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit} className={styles.auth_form}>
          <p>Please SIGNIN to continue:</p>
          <div className={styles.form_control}>
            <label>
              Email
              <input
                type="text"
                name="email"
                value={email}
                required
                onChange={this.handleChange}
              />
            </label>
          </div>
          {invalidEmail && (
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
                onChange={this.handleChange}
              />
            </label>
          </div>
          {invalidPassword && (
            <p className={styles.invalid}>Your password is not long enough</p>
          )}
          <div className={styles.form_actions}>
            <button type="submit">Signin</button>
          </div>
        </form>
        {/* <form onSubmit={this.handleSubmit} className={styles.auth_form}>
          <p>Or, if you have not already done so, please SIGNUP to continue:</p>
          <div className={styles.form_control}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              required
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.form_control}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              required
              onChange={this.handleChange}
            />
          </div>
          <div className={styles.form_actions}>
            <button type="submit">Signup</button>
          </div>
        </form> */}
        {/* <Forms
          action={signin}
          email={email}
          password={password}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />
        <Forms
          action={signup}
          email={email}
          password={password}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        /> */}
      </>
    );
  }
}
