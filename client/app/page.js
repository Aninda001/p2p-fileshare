"use client";

import Navbar from "./components/navbar";
import ShareID from "./components/shareID";
import styles from "./page.module.css";
import FileUpload from "./components/filedrop";
import * as uuid from "uuid";
import { useRouter } from "next/navigation";

export default function Home() {
    let id = uuid.v4();
    let router = useRouter();
    router.push("/" + id);
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
