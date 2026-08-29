import React, { useState, useEffect } from "react";
import ContactItem from "./ContactItem";
import Modal from "./Modal";
import SearchBox from "./SearchBox";
import styles from "./ContactsList.module.css";

function ContactsList({
  contacts,
  deleteHandler,
  editHandler,
  selected,
  selectHandler,
  deleteSelectedHandler,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [selectedModal, setSelectedModal] = useState(false);

  useEffect(() => {
    const input = query.trim();
    if (!input) {
      setFilteredContacts(contacts);
    } else {
      const lower = input.toLowerCase();
      const filtered = contacts.filter((contact) => {
        const nameMatch = contact.name.toLowerCase().includes(lower);
        const lastNameMatch = contact.lastName.toLowerCase().includes(lower);
        const emailMatch = contact.email.toLowerCase().includes(lower);
        const phoneMatch = contact.phone.includes(lower);
        const tagMatch = (contact.tags || []).some((tag) =>
          tag.toLowerCase().includes(lower),
        );

        return (
          nameMatch || lastNameMatch || emailMatch || phoneMatch || tagMatch
        );
      });
      setFilteredContacts(filtered);
    }
  }, [contacts, query]);
  const searchHandler = () => {
    setQuery(searchInput);
  };

  return (
    <>
      {selectedModal && (
        <Modal
          setModalOpen={setSelectedModal}
          onConfirm={() => {
            deleteSelectedHandler();
            setSelectedModal(false);
          }}
        >
          <h1>Delete selected contacts?</h1>
          <p>You are about to delete {selected.length} contacts.</p>
        </Modal>
      )}
      <div className={styles.container}>
        <h3>Contacts List</h3>
        <div className={styles.header}>
          <div className={styles.selected}>
            <button
              onClick={() => setSelectedModal(true)}
              disabled={selected.length === 0}
            >
              Delete selected user ({selected.length})
            </button>
          </div>
          <div>
            <SearchBox
              search={searchInput}
              setSearch={setSearchInput}
              searchHandler={searchHandler}
            />
          </div>
        </div>
        {filteredContacts.length ? (
          <ul className={styles.contact}>
            {filteredContacts.map((contact) => (
              <ContactItem
                key={contact.id}
                data={contact}
                deleteHandler={deleteHandler}
                editHandler={editHandler}
                selected={selected}
                selectHandler={selectHandler}
              />
            ))}
          </ul>
        ) : (
          <p className={styles.message}>No Contacts Found</p>
        )}
      </div>
    </>
  );
}

export default ContactsList;
