import styles from './Header.module.css';

function Header() {
  return (
    <header id='header'>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Contacts List</h1>
      </div>
    </header>
  );
}

export default Header;
