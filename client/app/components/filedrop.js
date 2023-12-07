"use client";
import styles from "./filedrop.module.css";

const FileUpload = () => {
    const dropHandler = (e) => {
        e.preventDefault();
        console.log(e);
    };

    return (
        <>
            <label
                htmlFor="upload"
                onDrop={dropHandler}
                onDragOver={dropHandler}
            >
                <div className={styles.fileupload}>
                    Drag & Drop file or click to upload
                </div>
            </label>
            <input type="file" id="upload" className={styles.inp} />
        </>
    );
};

export default FileUpload;
