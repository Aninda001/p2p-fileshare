"use client";

import Navbar from "../components/navbar";
import ShareID from "../components/shareID";
import styles from "./page.module.css";
import FileUpload from "../components/filedrop";
import { socket } from "../socket";

socket.on("connect", (e) => {
    console.log("connected");
    socket.emit("addRoom", "test");
});

socket.on("message", (msg) => {
    console.log(msg);
});

export default function Home() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <FileUpload />
                <ShareID />
            </main>
        </>
    );
}
