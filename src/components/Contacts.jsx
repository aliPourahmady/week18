import React, { useEffect, useState } from "react";
import inputs from "../const/input";
import { v4 as uuidv4 } from "uuid";

import styles from "./Contacts.module.css";
import ContactsList from "./ContactsList";

import { IoMdInformationCircleOutline } from "react-icons/io";
import { useContacts } from "../context/ContactContext";

function Contacts() {
  const {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    deleteSelectedContacts,
    fetchContacts,
  } = useContacts();
  const [alert, setAlert] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [contact, setContact] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const validateData = (contactData) => {
    const newErrors = {};

    if (!contactData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (contactData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!contactData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (contactData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(contactData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!contactData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(contactData.phone.trim())) {
      newErrors.phone =
        "Phone must contain only digits and be 10–15 characters long";
    }

    return newErrors;
  };

  const alertTimeOut = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 2000);
  };

  const editHandler = (contactData) => {
    setContact({
      id: contactData.id,
      name: contactData.name || "",
      lastName: contactData.lastName || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
    });
    setIsEditing(true);
    setEditId(contactData.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContact((contact) => ({ ...contact, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const addHandler = async () => {
    const errors = validateData(contact);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      setFormErrors(errors);
      alertTimeOut("Please fill in all required fields correctly.");
      return;
    }

    if (isEditing) {
      await updateContact(editId, {
        name: contact.name,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
      });
      alertTimeOut("Contact updated successfully.");
    } else {
      await addContact({
        name: contact.name,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
      });
      alertTimeOut("Contact added successfully.");
    }
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setIsEditing(false);
    setEditId(null);
    setFormErrors({});
  };

  const cancelEditing = () => {
    setContact({
      name: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setIsEditing(false);
    setEditId(null);

    alertTimeOut("Edit cancelled.");
  };

  const deleteHandler = async (id) => {
    await deleteContact(id);
    alertTimeOut("contact deleted successfully");
  };

  const selectHandler = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  if (loading) return <div className={styles.loading}></div>;
  if (error) return <div className={styles.apierror}>Error: {error}</div>;

  const deleteSelectedHandler = async () => {
    if (selected.length === 0) return;
    await deleteSelectedContacts(selected);
    setSelected([]);
    alertTimeOut("Selected contacts deleted.");
  };
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {inputs.map((input, index) => (
          <div className={styles.inputs} key={index}>
            <input
              type={input.type}
              placeholder={input.placeholder}
              name={input.name}
              value={contact[input.name]}
              onChange={changeHandler}
            />
            {formErrors[input.name] && (
              <span className={styles.error}>{formErrors[input.name]}</span>
            )}
            {/* </> */}
          </div>
        ))}
        <button onClick={addHandler}>
          {isEditing ? "Update Contact" : "Add Contact"}
        </button>
        {isEditing && <button onClick={cancelEditing}>Cancel</button>}
      </div>
      <div className={styles.alerts}>
        {alert && (
          <span
            className={styles.alert}
            onClick={() => {
              setAlert("");
            }}
          >
            <IoMdInformationCircleOutline className={styles.icon} />
            {alert}
          </span>
        )}
      </div>

      <ContactsList
        contacts={contacts}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        selected={selected}
        selectHandler={selectHandler}
        deleteSelectedHandler={deleteSelectedHandler}
      />
    </div>
  );
}

export default Contacts;
