"use client";

import styles from "./personalInfo.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

const PersonalInfo = (props) => {
    return (
        <section>
            <span>Your unique ID</span>
            <div className={styles.share}>
                <code className={styles.uuid}>{props.uuid}</code>
                <CopyToClipboard text={props.uuid}>
                    <button>Copy</button>
                </CopyToClipboard>
            </div>
            <div>
                {props.social.map((media, ind) => (
                    <span key={ind}>{media} </span>
                ))}
            </div>
        </section>
    );
};

export default PersonalInfo;
