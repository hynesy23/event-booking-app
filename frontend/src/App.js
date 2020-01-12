import React, { Component } from "react";
import "./App.css";
import { Router, Redirect } from "@reach/router";
import AuthPage from "./pages/auth/AuthPage";
import BookingsPage from "./pages/BookingsPage";
import EventsPage from "./pages/EventsPage";
import MainNav from "./components/navigation/MainNav";
import AuthContext from "./context/AuthContext";

import { navigate } from "@reach/router";

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId) => {
    console.log(token, userId, "token and user ID");
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    navigate("/auth");
  };

  render() {
    const { token, userId } = this.state;
    return (
      <div className="App">
        <AuthContext.Provider
          value={{
            token: token,
            userId: userId,
            login: this.login,
            logout: this.logout
          }}
        >
          <MainNav />
          <main className="main">
            <Router>
              {!token && <Redirect noThrow={true} from="/" to="auth" exact />}
              {token && <Redirect noThrow={true} from="/" to="events" exact />}
              {token && (
                <Redirect noThrow={true} from="auth" to="events" exact />
              )}
              {!token && <AuthPage path="auth" />}
              {token && <BookingsPage path="bookings" />}
              <EventsPage path="events" />
            </Router>
          </main>
        </AuthContext.Provider>
      </div>
    );
  }
}

// Line 15: Error kept appearing when using Redirect. According to reach/router github, need 'noThrow' in Redirect component to prevent this.
// It is possible it kept erroring out as I was not using componentDidCatch (according to Reach Routers site)

export default App;
