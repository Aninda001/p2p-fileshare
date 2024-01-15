"use client";
import styles from "./filedrop.module.css";
import { useState } from "react";

const FileUpload = () => {
    const [selected, setSelected] = useState({
        filelist: [],
        totalsize: 0,
        uploades: [],
    });

    const fileHandler = (e) => {
        setSelected((prev) => ({
            ...prev,
            filelist: [...prev.filelist, e],
            totalsize: prev.totalsize + e.size,
        }));
    };
    const dropHandler = (e) => {
        function scanFiles(item) {
            // console.log(item);
            const reader = new FileReader();

            reader.onload = function (event) {
                // Send the chunk over the DataChannel
                console.log(event.target);
                // console.log({
                //     fileName: item.webkitRelativePath,
                //     data: reader.result,
                // });
            };
            if (item.isFile) {
                item.file(fileHandler);
            }

            if ((item.fullPath.match(/\//g) || []).length === 1) {
                setSelected((prev) => ({
                    ...prev,
                    uploades: [...prev.uploades, item],
                }));
            }

            if (item.isDirectory) {
                let directoryReader = item.createReader();

                directoryReader.readEntries(function (entries) {
                    entries.forEach(function (entry) {
                        scanFiles(entry);
                    });
                });
            }
        }

        let items = e.dataTransfer.items;

        e.preventDefault();

        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();

            if (item) {
                scanFiles(item);
            }
        }
    };

    const totalSize = () => {
        let size = selected.totalsize;
        if (size > 1024 * 1024 * 1024) {
            return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        } else if (size > 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        } else if (size > 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else {
            return `${size} B`;
        }
    };

    const uploadData = () => {
        let folder = 0,
            file = 0;
        for (let i of selected.uploades) {
            if (i.isFile) file++;
            else folder++;
        }
        return (
            <span>
                {file} files and {folder} folders
                <br />
                Total size : {totalSize()}
            </span>
        );
    };

    return (
        <>
            <label
                htmlFor="upload"
                onDrop={dropHandler}
                onDragOver={(e) => e.preventDefault()}
            >
                <div className={styles.fileupload}>
                    {selected.uploades.length ? (
                        uploadData()
                    ) : (
                        <span>
                            Drag & Drop file & folder
                            <br /> or click to upload
                        </span>
                    )}
                </div>
            </label>
            <input
                type="file"
                onChange={(e) => console.log("changed")}
                id="upload"
                className={styles.inp}
                multiple
            />
        </>
    );
};

export default FileUpload;
