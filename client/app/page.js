import Navbar from "@/app/components/navbar";
import ShareID from "./components/shareID";
import styles from "./page.module.css";
import FileUpload from "./components/filedrop";

export default function Home() {
    return (
        <>
            <Navbar />
            <main className={styles.main}></main>
            <ShareID />
            <FileUpload />
        </>
    );
}
