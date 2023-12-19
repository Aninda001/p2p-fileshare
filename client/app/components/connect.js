import styles from "./connect.module.css";

const Connect = () => {
    const clickHandler = () => {
        console.log("clicked");
    };
    return (
        <div className={styles.connect}>
            <input type="text" className={styles.input} />
            <button onClick={clickHandler}>Connect</button>
        </div>
    );
};

export default Connect;
