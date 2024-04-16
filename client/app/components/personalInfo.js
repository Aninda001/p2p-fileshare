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

    const sendHandler = async () => {
        const chunkSize = 1024 * 256;
        props.dc.send(
            JSON.stringify({
                type: "transfer",
                totalSize: props.selected.totalsize,
            }),
        );

        for (let file of props.selected.filelist) {
            let filename;
            if (file.webkitRelativePath) filename = file.webkitRelativePath;
            else filename = file.name;

            console.log(file);
            let buffer = await file.arrayBuffer();

            while (buffer.byteLength) {
                const chunk = buffer.slice(0, chunkSize);
                buffer = buffer.slice(chunkSize);
                // dc.send({ filename, chunk });
                if (
                    props.dc.bufferedAmount >
                    props.dc.bufferedAmountLowThreshold
                ) {
                    await new Promise((res) => {
                        props.dc.onbufferedamountlow = () => {
                            props.dc.onbufferedamountlow = null;
                            res();
                        };
                    });
                    props.dc.send(chunk);
                } else {
                    props.dc.send(chunk);
                }
            }

            props.dc.send(
                JSON.stringify({
                    type: "Done!",
                    filename: file.name,
                    filetype: file.type,
                    pathName: filename,
                }),
            );
        }
    };

    const downloadHandler = () => {
        const a = document.createElement("a");
        // document.body.appendChild(link);
        props.download.forEach((file) => {
            const url = URL.createObjectURL(file.file);
            a.href = url;
            a.download = file.pathname;
            a.click();
            URL.revokeObjectURL(url);
            // document.body.removeChild(a);
        });
        a.remove();
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
                            <img
                                src="/copy-96.png"
                                height={15}
                                width={15}
                                alt="copy"
                            />
                            {copied ? <span> Copied&#10003;</span> : " Copy"}
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
            <section className={styles.send}>
                {props.scanning == "done" && props.connected.length > 0 ? (
                    <button className={styles.sendButton} onClick={sendHandler}>
                        <img
                            src="/send-94.png"
                            height={15}
                            width={25}
                            alt="send"
                        />
                        {" Send"}
                    </button>
                ) : undefined}
            </section>
            <section className={styles.receive}>
                {props.download && props.download.length > 0 && (
                    <button
                        className={styles.sendButton}
                        onClick={downloadHandler}
                    >
                        <img
                            src="/download-48.png"
                            height={25}
                            width={20}
                            alt="download"
                        />
                        {" Download"}
                    </button>
                )}
            </section>
        </>
    );
};

export default PersonalInfo;
