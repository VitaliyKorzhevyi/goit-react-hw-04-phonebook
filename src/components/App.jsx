import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import css from './App.module.css';
import { ContactForm } from './ContactForm/ContactForm.jsx';
import { Filter } from './Filter/Filter.jsx';
import { ContactList } from './ContactList/ContactList.jsx';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const storedContacts = JSON.parse(localStorage.getItem('contacts'));
    console.log('нужна ваша помощь, почему происходит двойной ренднринг компонента, никак не могу найти причину', storedContacts);
    if (storedContacts) {
      setContacts(storedContacts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleFormSubmit = (values, { resetForm }) => {
    const contact = { id: nanoid(), ...values };

    if (
      contacts.some(c => c.name.toLowerCase() === contact.name.toLowerCase())
    ) {
      alert(`${contact.name} is already in contacts`);
      return;
    }

    setContacts(prevContacts => [contact, ...prevContacts]);
    resetForm();
  };

  const handleRemoveContact = contactId => {
    setContacts(prevContacts =>
      prevContacts.filter(({ id }) => id !== contactId)
    );
  };

  const handleFilterChange = ({ target }) => {
    const name = target.value.trim();
    setFilter(name);
  };

  const getFilteredContacts = () => {
    const regexp = new RegExp(filter, 'i');
    return contacts.filter(({ name }) => regexp.test(name));
  };

  return (
    <div className={css.wrapper}>
      <h1>Phonebook</h1>
      <ContactForm handleFormSubmit={handleFormSubmit} />

      <h2>Contacts</h2>
      <Filter handleFilterChange={handleFilterChange} value={filter} />
      {getFilteredContacts().length !== 0 ? (
        <ContactList
          contacts={getFilteredContacts()}
          handleRemoveContact={handleRemoveContact}
        />
      ) : (
        <h2 className={css.noContact}>There are no contacts in the list</h2>
      )}
    </div>
  );
};
