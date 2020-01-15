import React, { Component } from "react";

import * as styles from "./EventsPage.module.css";
import EventsHeader from "./EventsHeader";

export default class EventsPage extends Component {
  render() {
    return (
      <div className={styles.events_control}>
        <EventsHeader />
        <button className="btn">Create Event</button>
      </div>
    );
  }
}
