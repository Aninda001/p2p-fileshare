import styles from "./connect.module.css";
import { useState } from "react";
import { socket } from "../socket";

const Connect = () => {
    const [input, setInput] = useState("");

    const inputHandler = (e) => {
        setInput(e.target.value);
    };

    const clickHandler = () => {
        console.log(input);
        socket.emit("addRoom", input);
        setInput("");
    };
    return (
        <section className={styles.connect}>
            <input
                type="text"
                className={styles.input}
                value={input}
                onChange={inputHandler}
            />
            <button onClick={clickHandler} className={styles.connectButton}>
                Connect
            </button>
        </section>
    );
};

export default Connect;
