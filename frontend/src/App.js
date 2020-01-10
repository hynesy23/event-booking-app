import React from "react";
import "./App.css";
import { Router, Redirect } from "@reach/router";
import AuthPage from "./pages/auth/AuthPage";
import BookingsPage from "./pages/BookingsPage";
import EventsPage from "./pages/EventsPage";
import MainNav from "./components/navigation/MainNav";

function App() {
  return (
    <div className="App">
      <MainNav />
      <main className="main">
        <Router>
          <Redirect noThrow={true} from="/" to="auth" />
          <AuthPage path="auth" />
          <BookingsPage path="bookings" />
          <EventsPage path="events" />
        </Router>
      </main>
    </div>
  );
}

// Line 15: Error kept appearing when using Redirect. According to reach/router github, need 'noThrow' in Redirect component to prevent this.
// It is possible it kept erroring out as I was not using componentDidCatch (according to Reach Routers site)

export default App;
