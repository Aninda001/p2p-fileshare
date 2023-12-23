import styles from "./connect.module.css";

const Connect = () => {
    const clickHandler = () => {
        console.log("clicked");
    };
    return (
        <section className={styles.connect}>
            <input type="text" className={styles.input} />
            <button onClick={clickHandler} className={styles.connectButton}>
                Connect
            </button>
        </section>
    );
};

export default Connect;
