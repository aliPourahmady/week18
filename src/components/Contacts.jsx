import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import inputs from "../const/input";
import ContactsList from "./ContactsList";
import { useContacts } from "../context/ContactContext";

import styles from "./Contacts.module.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import TagInput from "./TagInput";

const contactSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at leaset 2 characters"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is requierd")
    .matches(
      /^\d{10,15}$/,
      "Phone must contain only digits and be 10-15 characters long",
    ),
  tags: yup.array().of(yup.string().trim()).max(5, "Maximum tags allowed"),
});

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
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: { name: "", lastName: "", email: "", phone: "", tags: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });
  const [alert, setAlert] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const alertTimeOut = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 2000);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateContact(editId, data);
        alertTimeOut("Contact update successfully.");
      } else {
        await addContact(data);
        alertTimeOut("Contact added successfully.");
      }
      reset();
      setIsEditing(false);
      setEditId(null);
    } catch (err) {
      alertTimeOut("Somthing went wrong");
    }
  };

  const editHandler = (contactData) => {
    reset({
      name: contactData.name || "",
      lastName: contactData.lastName || "",
      email: contactData.email || "",
      phone: contactData.phone || "",
      tags: contactData.tags || [],
    });
    setIsEditing(true);
    setEditId(contactData.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    reset();
    setIsEditing(false);
    setEditId(null);
    alertTimeOut("Edit cancelled");
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
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {inputs.map((input, index) => (
            <div className={styles.inputs} key={index}>
              <input
                type={input.type}
                placeholder={input.placeholder}
                {...register(input.name)}
              />
              {errors[input.name] && (
                <span className={styles.error}>
                  {errors[input.name].message}
                </span>
              )}
            </div>
          ))}

          <TagInput
            control={control}
            name="tags"
            maxTags={5}
            error={errors.tags?.message}
            onError={alertTimeOut}
          />

          <button type="submit" disabled={isSubmitting}>
            {isEditing ? "Update Contact" : "Add Contact"}
          </button>
          {isEditing && <button onClick={cancelEditing}>Cancel</button>}
        </form>
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
