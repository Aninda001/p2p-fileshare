"use client";
import styles from "./filedrop.module.css";

const FileUpload = ({ scanning, setScanning, selected, setSelected }) => {
    const dropHandler = async (e) => {
        let select = {
            filelist: [],
            totalsize: 0,
            uploades: [],
        };

        async function scanFiles(item) {
            if ((item.fullPath.match(/\//g) || []).length === 1) {
                select.uploades.push(item);
            }

            if (item.isFile) {
                await new Promise((resolve) => {
                    item.file((e) => {
                        select.filelist.push(e);
                        select.totalsize += e.size;
                        resolve();
                    });
                });
            }

            if (item.isDirectory) {
                let directoryReader = item.createReader();

                await new Promise((resolve) => {
                    directoryReader.readEntries(async function(entries) {
                        for (let entry of entries) {
                            await scanFiles(entry);
                        }
                        resolve();
                    });
                });
            }
        }

        let items = e.dataTransfer.items;

        e.preventDefault();

        setScanning("started");
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();

            if (item) {
                await scanFiles(item);
            }
        }
        setSelected(select);
        setScanning("done");
    };

    const fileInputHandler = async (files) => {
        let select = {
            filelist: [],
            totalsize: 0,
            uploades: [],
        };

        setScanning("started");
        for (let i = 0; i < files.length; i++) {
            select.filelist.push(files[i]);
            select.totalsize += files[i].size;
            select.uploades.push(files[i]);
        }

        setSelected(select);
        setScanning("done");
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
        if (scanning === "started") return "Scanning files...";
        else if (scanning === "done") {
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
        } else {
            return (
                <span>
                    Drag & Drop file & folder
                    <br /> or click to upload
                </span>
            );
        }
    };

    return (
        <>
            <label
                htmlFor="upload"
                onDrop={dropHandler}
                onDragOver={(e) => e.preventDefault()}
            >
                <div className={styles.fileupload}>{uploadData()}</div>
            </label>
            <input
                type="file"
                onChange={(e) => fileInputHandler(e.target.files)}
                id="upload"
                className={styles.inp}
                multiple
            />
        </>
    );
};

export default FileUpload;
