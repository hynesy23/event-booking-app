import React, { Component } from "react";
import Form from "./Form";
import AuthContext from "../../context/AuthContext";

import * as api from "../../api";

export default class AuthPage extends Component {
  state = {
    email: "",
    password: "",
    loginMode: true,
    invalidPassword: false,
    invalidEmail: false,
    err: null
  };

  static contextType = AuthContext;

  handleChange = event => {
    const value = event.target.value;
    const field = event.target.name;
    this.setState({ [field]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      email,
      password,
      loginMode,
      invalidEmail,
      invalidPassword
    } = this.state;

    const isPasswordOk = password.length < 3;
    const isEmailOK = !email.includes("@");

    this.setState({
      invalidPassword: isPasswordOk,
      invalidEmail: isEmailOK
    });

    console.log("hii");

    if (!invalidPassword && !invalidEmail) {
      console.log("api call");
      api
        .userLoginAction(email, password, loginMode)
        .then(result => {
          if (result.errors) {
            this.setState({ err: result.errors[0].message });
          }
          if (loginMode) {
            this.context.login(
              result.data.login.token,
              result.data.login.userId
            );
          }
        })
        .catch(err => console.log(err, "err log"));
      this.setState({
        email: "",
        password: "",
        invalidPassword: false,
        invalidEmail: false
      });
    }
  };

  handleModeSwitch = () => {
    console.log("hello mode switch");
    const { invalidEmail, invalidPassword } = this.state;
    if (invalidEmail || invalidPassword) {
      this.setState(currState => {
        return {
          loginMode: !currState.loginMode,
          email: "",
          password: "",
          invalidEmail: false,
          invalidPassword: false
        };
      });
    } else {
      this.setState(currState => {
        return { loginMode: !currState.loginMode, email: "", password: "" };
      });
    }
  };

  render() {
    const {
      email,
      password,
      invalidEmail,
      invalidPassword,
      loginMode,
      err
    } = this.state;

    return (
      <Form
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        handleModeSwitch={this.handleModeSwitch}
        invalidEmail={invalidEmail}
        invalidPassword={invalidPassword}
        loginMode={loginMode}
        email={email}
        password={password}
        err={err}
      />
    );
  }
}
