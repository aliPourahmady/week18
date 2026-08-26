import React, { Children } from "react";

import styles from "./Modal.module.css";

function Modal({ children, setModalOpen, onConfirm }) {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.children}>{children}</div>
        <div className={styles.btn}>
          <button
            onClick={() => {
              onConfirm();
              setModalOpen(false);
            }}
          >
            Yes
          </button>
          <button onClick={() => setModalOpen(false)}>NO</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
