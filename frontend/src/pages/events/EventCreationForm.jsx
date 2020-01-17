import React, { Component } from "react";

import * as styles from "../auth/AuthPage.module.css";

export default class EventCreationForm extends Component {
  state = {
    title: "",
    date: "",
    price: 0,
    description: ""
  };

  handleChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    // const { title, description, price, date } = this.state;
    const newEvent = { ...this.state };
    this.props.addEvent(newEvent);
    this.props.cancelModal();
    this.setState({ title: "", date: "", price: 0, description: "" });
  };

  render() {
    const { title, description, price, date } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className={styles.form_control}>
          <label htmlFor="">
            {" "}
            Title
            <input
              type="text"
              name="title"
              value={title}
              required
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor="">
            {" "}
            Date
            <input
              type="datetime-local"
              name="date"
              value={date}
              required
              onChange={this.handleChange}
            />
          </label>{" "}
          <label htmlFor="">
            {" "}
            Price
            <input
              type="number"
              name="price"
              value={price}
              required
              onChange={this.handleChange}
            />
          </label>
          <label htmlFor="">
            Description
            <textarea
              name="description"
              value={description}
              rows="4"
              onChange={this.handleChange}
            />
          </label>
          <button className="btn">Confirm</button>
          <button className="btn">Cancel</button>
        </div>
      </form>
    );
  }
}
