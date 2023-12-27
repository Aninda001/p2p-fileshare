"use client";

import PersonalInfo from "./personalInfo";
import styles from "./shareID.module.css";
import Connect from "./connect";

const uuid = "2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d";
const shareOptions = [
    {
        name: "whatsapp",
        location: "/whatsapp-873316_640.png",
    },
    {
        name: "facebook",
        location: "/facebook-2429746_640.png",
    },
    {
        name: "email",
        location: "/mail-1454731_640.png",
    },
    {
        name: "telegram",
        location: "/telegram-5662082_640.png",
    },
    {
        name: "twitter x",
        location: "/x-8229321_640.png",
    },
];

const ShareID = (props) => {
    return (
        <div className={styles.shareID}>
            <PersonalInfo uuid={uuid} social={shareOptions} />
            <Connect />
        </div>
    );
};

export default ShareID;
