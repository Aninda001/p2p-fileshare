"use client";

import PersonalInfo from "./personalInfo";
import styles from "./shareID.module.css";

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
            <PersonalInfo
                social={shareOptions}
                dc={props.dc}
                name={props.name}
                connected={props.connected}
            />
        </div>
    );
};

export default ShareID;
