import React from "react";
import { Link } from "@reach/router";
import AuthContext from "../../context/AuthContext";

import * as styles from "./MainNav.module.css";

export default function MainNav() {
  return (
    <AuthContext.Consumer>
      {context => (
        <header className={styles.main_nav}>
          <div className={styles.main_nav_logo}>
            <h1>Easi-Book</h1>
          </div>
          <nav className={styles.main_nav_items}>
            <ul>
              {!context.token && (
                <li>
                  <Link to="/auth">Auth</Link>
                </li>
              )}
              <li>
                <Link to="/events">Events</Link>
              </li>
              {context.token && (
                <li>
                  <Link to="/bookings">Bookings</Link>
                </li>
              )}
            </ul>
          </nav>
        </header>
      )}
    </AuthContext.Consumer>
  );
}
