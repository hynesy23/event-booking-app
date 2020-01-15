import React from "react";

import * as styles from "./Modal.module.css";

export default function Modal(props) {
  return (
    <div className={styles.modal_control}>
      <header className={styles.modal_control_header}>
        <h1>{props.title}</h1>
      </header>
      <article className={styles.modal_control_content}>
        {props.children}
      </article>
      <article className={styles.modal_control_actions}>
        <button>Confirm</button>
        <button className="btn" onClick={props.cancelModal}>
          Cancel
        </button>
      </article>
    </div>
  );
}
