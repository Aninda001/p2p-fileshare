"use client";

import PersonalInfo from "./personalInfo";
import styles from "./shareID.module.css";
import Connect from "./connect";

const uuid = 343244;
const shareOptions = ["wb", "fb", "email", "tg"];

const ShareID = () => {
    return (
        <div className={styles.shareID}>
            <PersonalInfo uuid={uuid} social={shareOptions} />
            <Connect />
        </div>
    );
};

export default ShareID;
