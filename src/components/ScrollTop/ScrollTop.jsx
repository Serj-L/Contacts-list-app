import { useState, useEffect } from 'react';

import { IconShevronUp } from '../index';

import styles from './ScrollTop.module.css';

const ScrollTop = () => {
  const [isScrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    const parrentNode = document.getElementById('scrollTop').parentElement;
    const rectOfParrentNode = parrentNode.getBoundingClientRect();
    const onScroll = (e) => {
      e.target.documentElement.scrollTop > rectOfParrentNode.top + 100 ? setScrollingDown(true) : setScrollingDown(false);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClickHandle = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (<div
    className={styles.scrollTop}
    style={!isScrollingDown ? { display: 'none' } : {}}
    id='scrollTop'
  >
    <button
      className={styles.scrollTopBtn}
      onClick = {onClickHandle}
    >
      <IconShevronUp color='#ffffff'/>
    </button>
  </div>
  );
};

export default ScrollTop;
