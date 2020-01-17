import React from "react";
import EventCard from "./EventCard";

export default function EventsList({ events }) {
  console.log(events, "events from EventsList");
  if (events) {
    return (
      <article>
        <ul>
          {events.map(event => {
            // return <EventCard event={event} />;
            return <li>{event.title}</li>;
          })}
        </ul>
      </article>
    );
  } else {
    return null;
  }
}
