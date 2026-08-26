import React, { createContext, useContext, useReducer } from "react";
import api from "../service/api";

const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, contacts: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_CONTACT":
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
      };
    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? action.payload : contact,
        ),
      };
    case "DELETE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => contact.id !== action.payload,
        ),
      };
    case "DELETE_SELECTED":
      return {
        ...state,
        contacts: state.contacts.filter(
          (contact) => !action.payload.includes(contact.id),
        ),
      };

    default:
      throw new Error("INVALID ACTION!");
  }
};

const ContactContext = createContext();

function ContactProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchContacts = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await api.get("/contacts");
      dispatch({ type: "FETCH_SUCCESS", payload: response });
    } catch (er) {
      dispatch({ type: "FETCH_ERROR", payload: er.message });
    }
  };
  const addContact = async (contact) => {
    try {
      const response = await api.post("/contacts", contact);
      dispatch({ type: "ADD_CONTACT", payload: response });
      return response;
    } catch (error) {
      console.error("Add error:", error);
      throw error;
    }
  };
  const updateContact = async (id, updatedContact) => {
    try {
      const response = await api.put(`/contacts/${id}`, updatedContact);
      dispatch({ type: "UPDATE_CONTACT", payload: response });
      return response;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };
  const deleteContact = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      dispatch({ type: "DELETE_CONTACT", payload: id });
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };
  const deleteSelectedContacts = async (ids) => {
    try {
      // json-server: delete one by one
      await Promise.all(ids.map((id) => api.delete(`/contacts/${id}`)));
      dispatch({ type: "DELETE_SELECTED", payload: ids });
    } catch (error) {
      console.error("Delete selected error:", error);
      throw error;
    }
  };

  const value = {
    contacts: state.contacts,
    loading: state.loading,
    error: state.error,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    deleteSelectedContacts,
  };
  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
}

const useContacts = () => {
  const context = useContext(ContactContext);
  return context;
};

export default ContactProvider;
export { useContacts };
