import { useEffect, useRef } from "react";
import styles from "./modal.module.css";

function Modal({ openModal, closeModal }) {
    const ref = useRef();

    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return (
        <dialog ref={ref} className={styles.modal} onCancel={closeModal}>
            To establish a connection, use without a VPN or proxy.
            <br />
            For sending multiple files or folders , use the zip format.
            <br />
            (As the receiver will get the files without a folder structure.)
            <br />
            <button className={styles.modalClose} onClick={closeModal}>
                Got It!
            </button>
        </dialog>
    );
}

export default Modal;
