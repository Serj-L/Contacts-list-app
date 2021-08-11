import styles from './Footer.module.css';

function Footer() {
  return(
    <footer id='footer'>
      <div className={styles.wrapper}>
        <span className={styles.copyright}>Designed by Serj-L 2021</span>
      </div>
    </footer>
  );
}

export default Footer;
