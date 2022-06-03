import React from "react";
import styles from './styles.module.css';
import ListComponent from "../../components/List";

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <ListComponent />
    </div>
  );
}

export default HomePage;