import React, { Component } from "react";

import * as styles from "./AuthPage.module.css";

export default class AuthPage extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = event => {
    const value = event.target.value;
    const field = event.target.name;
    this.setState({ [field]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ email: "", password: "" });
  };

  render() {
    const { email, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className={styles.auth_form}>
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
          <button type="submit">Submit</button>
          <button type="button">Signup instead</button>
        </div>
      </form>
    );
  }
}
