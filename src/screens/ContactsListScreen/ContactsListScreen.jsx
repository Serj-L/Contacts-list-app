import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import styles from './ContactsListScreen.module.css';

const ContactsListScreen = () => {
  const contacts = useSelector((state) => state.contacts.contactsList);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacts list</h1>
      {contacts ?
        contacts.map((contact, idx) => {
          return (
            <div
              className={styles.listWrapper}
              key = {contact.id}
            >
              <h3 className={styles.contactName}>{idx + 1}. {contact.firstName} {contact.lastName}</h3>
              <p className={styles.contactContacts}>{contact.email ? `E-mail: ${contact.email}` : ''}</p>
              <p className={styles.contactContacts}>{contact.phone ? `Phone: ${contact.phone}` : ''}</p>
              <div className={styles.btnWrapper}>
                <button
                  className={styles.btn}
                  onClick = {() => console.log('edit')}
                >
                Edit
                </button>
                <button
                  className={styles.btn}
                  onClick = {() => console.log('View details')}
                >
                View details
                </button>
                <button
                  className={styles.btnDanger}
                  onClick = {() => console.log('delete contact')}
                >
                Delete
                </button>
              </div>
              <hr />
            </div>
          );
        }) : <h3>Contats list is empty</h3>
      }
      <NavLink
        to="/info"
        className={styles.navlink}
      >
        Contact details information...
      </NavLink>
    </div>
  );
};

export default ContactsListScreen;
