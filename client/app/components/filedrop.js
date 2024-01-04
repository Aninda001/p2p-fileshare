"use client";
import styles from "./filedrop.module.css";

const FileUpload = () => {
    const dropHandler = (e) => {
        e.preventDefault();
        // let fs = e.dataTransfer.items[0]
        //     .webkitGetAsEntry()
        //     .createReader()
        //     .readEntries((e) => console.log(e));
        console.log(e.dataTransfer.items[0].getAsFile());
    };

    return (
        <>
            <label
                htmlFor="upload"
                onDrop={dropHandler}
                onDragOver={(e) => e.preventDefault()}
            >
                <div className={styles.fileupload}>
                    Drag & Drop file or click to upload
                </div>
            </label>
            <input
                type="file"
                onChange={(e) => console.log(e.target.files)}
                id="upload"
                className={styles.inp}
                multiple
            />
        </>
    );
};

export default FileUpload;
