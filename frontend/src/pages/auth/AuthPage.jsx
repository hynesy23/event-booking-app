import React, { Component } from "react";
import Form from "./Form";

import * as api from "../../api";

export default class AuthPage extends Component {
  state = {
    email: "",
    password: "",
    loginMode: true,
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
    } else if (password.length < 3) {
      this.setState({ invalidPassword: true });
    } else {
      api
        .logIn(email, password)
        .then(result => {
          console.log(result, "result log");
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
    console.log("hello");
    const {invalidEmail, invalidPassword} = this.state;
    if (invalidEmail || invalidPassword) {
      this.setState(currState => {
        return { loginMode: !currState.loginMode, email: '', password: '', invalidEmail: false, invalidPassword: false};
      });

    } else {
      this.setState(currState => {
       return {loginMode: !currState.loginMode, email: '', password: ''}
      })
    }
  };

  render() {
    const {
      email,
      password,
      invalidEmail,
      invalidPassword,
      loginMode
    } = this.state;
    
    return (
        <Form handleSubmit={this.handleSubmit} handleChange={this.handleChange} handleModeSwitch={this.handleModeSwitch} invalidEmail={invalidEmail} invalidPassword={invalidPassword} loginMode={loginMode} email={email} password={password} />
    );
  }
}
