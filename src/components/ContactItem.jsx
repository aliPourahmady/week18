import { useState } from "react";
import Modal from "./Modal";

import styles from "./ContactItem.module.css";

import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

function ContactItem({
  data,
  deleteHandler,
  editHandler,
  selected,
  selectHandler,
}) {
  const { id, name, lastName, email, phone, tags } = data;
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);

  return (
    <>
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          onConfirm={() => {
            deleteHandler(id);
          }}
        >
          <h1>do you want to delete this contact</h1>
          <p>
            {name} {lastName}
          </p>
        </Modal>
      )}
      {editModal && (
        <Modal setModalOpen={setEditModal} onConfirm={() => editHandler(data)}>
          <h1>Do you wanna Edit this contacts</h1>
          <p>
            {name} {lastName}
          </p>
        </Modal>
      )}
      <li className={styles.item}>
        <p className={styles.tag}>
          <span>
            <FaRegUserCircle />
          </span>
          {name} {lastName}
          {tags && tags.map((tag, index) => <span key={index}>#{tag}</span>)}
          {/* <span>#Work</span> */}
        </p>
        <p>
          <span>
            <MdOutlineMailOutline />
          </span>
          {email}
        </p>
        <p>
          <span>
            <MdOutlineLocalPhone />
          </span>
          {phone}
        </p>
        <div className={styles.button}>
          <p>
            <button
              onClick={() => {
                setModalOpen(true);
              }}
            >
              <FaRegTrashAlt />
            </button>
          </p>
          <p>
            <button
              onClick={() => {
                setEditModal(true);
              }}
            >
              <FaRegEdit />
            </button>
          </p>
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={() => selectHandler(id)}
          />
          <span className={styles.checkbox}></span>
        </div>
      </li>
    </>
  );
}

export default ContactItem;
