import React, { Component } from "react";
import Form from "./Form";

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
    // if (password.length < 3) {

    this.setState({
      invalidPassword: isPasswordOk,
      invalidEmail: isEmailOK
    });

    console.log("hii");
    // }

    // this.setState({ invalidEmail: !email.includes("@")})
    // if (!email.includes("@")) {
    //   this.setState({ invalidEmail: true });
    // } else
    // if (password.length < 3) {
    //   this.setState({ invalidPassword: true });
    // } else {

    if (!invalidPassword && !invalidEmail && !loginMode) {
      console.log("api call");
      api
        .createNewUser(email, password)
        .then(result => {
          if (result.errors) {
            this.setState({ err: result.errors[0].message });
          }
        })
        .catch(err => console.log(err, "err log"));
      this.setState({
        email: "",
        password: "",
        invalidPassword: false,
        invalidEmail: false
      });
    } else if (!invalidPassword && !invalidEmail && loginMode) {
      api
        .siginInUser(email, password)
        .then()
        .catch();
      // Need to add this function to api file.
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
