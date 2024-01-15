"use client";

import styles from "./personalInfo.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import { useState, useEffect } from "react";

const PersonalInfo = (props) => {
    const [roomurl, setRoomurl] = useState("");
    const [share, setShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const connectedUsersList = () => {
        if (props.connected === undefined || props.connected.length === 0)
            return <span>No one connected</span>;
        else
            return props.connected.map((user, ind) => (
                <span key={ind} className={styles.ConnectedUsers}>
                    {user.name}
                </span>
            ));
    };

    const copyHandler = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const forwarder = (name) => {
        window.open(name.share + roomurl, "_blank");
    };

    useEffect(() => {
        setRoomurl(window.location.href);
    }, []);

    return (
        <>
            <section className={styles.personal}>
                <span className={styles.span}>Your name : {props.name}</span>
                <span className={styles.span}>Your share url :</span>
                <div className={styles.share}>
                    <code className={styles.uuid}>{roomurl}</code>
                    <CopyToClipboard text={roomurl}>
                        <button
                            className={copied ? styles.copied : styles.copy}
                            onClick={copyHandler}
                        >
                            {copied ? <span>Copied&#10003;</span> : "Copy"}
                        </button>
                    </CopyToClipboard>
                </div>
                <div className={styles.social}>
                    <Image
                        src="/youtube2-8079000_640.png"
                        height={35}
                        width={65}
                        alt="youtube"
                        onClick={() => setShare((prev) => !prev)}
                    />
                    {share &&
                        props.social.map((media, ind) => (
                            <Image
                                key={ind}
                                src={media.location}
                                height={35}
                                width={35}
                                alt={media.name}
                                onClick={() => forwarder(media)}
                            />
                        ))}
                </div>
            </section>
            <section className={styles.connected}>
                <span className={styles.span}>Connected users :</span>
                <div className={styles.userlist}>{connectedUsersList()}</div>
            </section>
        </>
    );
};

export default PersonalInfo;
