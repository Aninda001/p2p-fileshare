"use client";

import PersonalInfo from "./personalInfo";
import styles from "./shareID.module.css";

const shareOptions = [
    {
        name: "whatsapp",
        location: "/whatsapp-873316_640.png",
        share: `${
            "https://" +
            `${
                /(android|iphone|ipad|mobile)/i.test(navigator.userAgent)
                    ? "api"
                    : "web"
            }` +
            ".whatsapp.com/send?text="
        }`,
    },
    {
        name: "facebook",
        location: "/facebook-2429746_640.png",
        share: "https://www.facebook.com/sharer/sharer.php?u=",
    },
    {
        name: "email",
        location: "/mail-1454731_640.png",
        share: "mailto:?subject=Join%20p2p%20fileshare&body=",
    },
    {
        name: "telegram",
        location: "/telegram-5662082_640.png",
        share: "https://telegram.me/share/url?url=",
    },
    {
        name: "twitter x",
        location: "/x-8229321_640.png",
        share: "https://twitter.com/intent/tweet?url=",
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
