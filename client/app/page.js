import Navbar from "@/app/components/navbar";
import FileDrop from "./components/filedrop";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.main}></main>
      <FileDrop />
    </>
  );
}
