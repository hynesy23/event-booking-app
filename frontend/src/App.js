import React from "react";
import "./App.css";
import { Router } from "@reach/router";
import AuthPage from "./pages/AuthPage";
import BookingsPage from "./pages/BookingsPage";
import EventsPage from "./pages/EventsPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthPage path="/auth" />
        <BookingsPage path="/bookings" />
        <EventsPage path="/events" />
      </Router>
    </div>
  );
}

export default App;
