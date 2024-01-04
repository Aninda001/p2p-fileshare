"use client";

import Navbar from "./components/navbar";
import ShareID from "./components/shareID";
import styles from "./page.module.css";
import FileUpload from "./components/filedrop";
import * as uuid from "uuid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const id = uuid.v4();
    const router = useRouter();
    useEffect(() => {
        router.push(`/${id}`);
    }, []);
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
