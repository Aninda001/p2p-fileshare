"use client";

import dynamic from "next/dynamic";
import Navbar from "../components/navbar";
const ShareID = dynamic(() => import("../components/shareID"), { ssr: false });
import styles from "./page.module.css";
import Modal from "../components/modal";
import FileUpload from "../components/filedrop";
import { socket } from "../socket";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    uniqueNamesGenerator,
    adjectives,
    animals,
    NumberDictionary,
} from "unique-names-generator";

export default function Home() {
    const [modal, setModal] = useState(true);
    const [dataChannel, setDataChannel] = useState(null);
    const [name, setName] = useState("");
    const [connected, setConnected] = useState([]);
    const [selected, setSelected] = useState({
        filelist: [],
        totalsize: 0,
        uploades: [],
    });
    const [scanning, setScanning] = useState(null);
    const [download, setDownload] = useState([]);

    let path = usePathname();
    let channel,
        connectedUser,
        totalSize = 0,
        receivedSize = 0;
    let fileChunks = [],
        files = [];
    useEffect(() => {
        let name = uniqueNamesGenerator({
            dictionaries: [
                adjectives,
                animals,
                NumberDictionary.generate({ min: 1, max: 99 }),
            ],
            separator: "-",
            style: "capital",
        });
        setName(name);
        socket.connect();
        let pc = new RTCPeerConnection({
            iceServers: [
                {
                    url: "stun:stun.l.google.com:19302",
                },
                { url: "stun:stun1.l.google.com:19302" },
                {
                    url: "turn:numb.viagenie.ca",
                    username: "webrtc@live.com",
                    credential: "muazkh",
                },
            ],
        });

        socket.on("connect", () => {
            console.log("connected with signalling server");
        });

        socket.on("message", (msg) => {
            console.log(msg);
        });

        socket.emit("addRoom", path, name);
        socket.emit("fetchlength", path);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice", { ice: event.candidate, room: path });
            } else {
                console.log("No more ICE candidate");
            }
        };

        socket.on("length", async (len) => {
            if (len === 0) {
                console.log("no peers connected");
            } else {
                channel = pc.createDataChannel("channel");
                setDataChannel(channel);
                // channel.bufferedAmountLowThreshold = 5 * 1024 * 1024;
                let offer = await pc.createOffer();
                // Set up event listener for open data channel
                channel.onopen = () => {
                    channel.send(
                        JSON.stringify({
                            type: "username",
                            id: socket.id,
                            name: name,
                        }),
                    );
                    console.log("Data channel is open on the sender side.");
                };

                // Set up event listener for receiving messages
                channel.onmessage = (event) => {
                    if (typeof event.data === "string") {
                        let recieve = JSON.parse(event.data);
                        if (recieve.type === "username") {
                            setConnected((prev) => [
                                ...prev,
                                { id: recieve.id, name: recieve.name },
                            ]);
                            connectedUser = recieve.id;
                        } else if (recieve.type === "message") {
                            console.log(
                                "Received message on the sender side:",
                                recieve,
                            );
                        } else if (recieve.type === "transfer") {
                            totalSize = recieve.totalSize;
                        } else if (recieve.type === "Done!") {
                            // Once, all the chunks are received, combine them to form a Blob
                            const file = new File(
                                fileChunks,
                                `${recieve.filename}`,
                                { type: `${recieve.filetype}` },
                            );

                            files.push({ file, pathname: recieve.pathName });
                            console.log("Received", file);
                            fileChunks = [];
                            if (totalSize === receivedSize && totalSize !== 0) {
                                setDownload(files);
                                files = [];
                                totalSize = 0;
                                receivedSize = 0;
                            }
                            // Download the received file using downloadjs
                            // download(file, "test.png");
                        }
                    } else {
                        // Keep appending various file chunks
                        fileChunks.push(event.data);
                        if (isNaN(event.data.size)) {
                            receivedSize += event.data.byteLength;
                        } else {
                            receivedSize += event.data.size;
                        }
                    }
                };

                channel.onclose = () => {
                    console.log("disconnected user", connectedUser);
                    setConnected((prev) =>
                        prev.filter((user) => user.id !== connectedUser),
                    );
                };
                socket.emit("offer", { offer: offer, room: path });
                await pc.setLocalDescription(offer);
            }
        });

        pc.ondatachannel = (event) => {
            channel = event.channel;
            setDataChannel(channel);
            // channel.bufferedAmountLowThreshold = 5 * 1024 * 1024;
            // Set up event listener for open data channel
            channel.onopen = () => {
                channel.send(
                    JSON.stringify({
                        type: "username",
                        id: socket.id,
                        name: name,
                    }),
                );
                console.log("Data channel is open.");
                // console.log(channel);
            };

            // Set up event listener for receiving messages
            channel.onmessage = (event) => {
                if (typeof event.data === "string") {
                    let recieve = JSON.parse(event.data);
                    if (recieve.type === "username") {
                        setConnected((prev) => [
                            ...prev,
                            { id: recieve.id, name: recieve.name },
                        ]);
                        connectedUser = recieve.id;
                    } else if (recieve.type === "message") {
                        console.log(
                            "Received message on the sender side:",
                            recieve,
                        );
                    } else if (recieve.type === "transfer") {
                        totalSize = recieve.totalSize;
                    } else if (recieve.type === "Done!") {
                        // Once, all the chunks are received, combine them to form a Blob
                        const file = new File(
                            fileChunks,
                            `${recieve.filename}`,
                            {
                                type: `${recieve.filetype}`,
                            },
                        );

                        files.push({ file, pathname: recieve.pathName });
                        console.log("Received", file);
                        fileChunks = [];
                        if (totalSize === receivedSize && totalSize !== 0) {
                            setDownload(files);
                            files = [];
                            totalSize = 0;
                            receivedSize = 0;
                        }
                        // Download the received file using downloadjs
                        // download(file, "test.png");
                    }
                } else {
                    // Keep appending various file chunks
                    fileChunks.push(event.data);
                    if (isNaN(event.data.size)) {
                        receivedSize += event.data.byteLength;
                    } else {
                        receivedSize += event.data.size;
                    }
                }
            };

            channel.onclose = () => {
                console.log("disconnected user", connectedUser);
                setConnected((prev) =>
                    prev.filter((user) => user.id !== connectedUser),
                );
            };
        };
        socket.on("offer", async (offer) => {
            await pc.setRemoteDescription(offer);
            let answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("answer", { answer: answer, room: path });
        });

        socket.on("answer", async (answer) => {
            await pc.setRemoteDescription(answer);
        });

        socket.on("ice", (ice) => {
            pc.addIceCandidate(new RTCIceCandidate(ice))
                .then(() => {
                    console.log(`ICE Candidate added successfully.`);
                })
                .catch((error) => {
                    console.error("Error adding ICE Candidate:", error);
                });
        });

        socket.on("disconnected_user", (id) => {
            console.log("disconnected user", id);
            setConnected((prev) => prev.filter((user) => user.id !== id));
        });

        return () => {
            socket.off("connect");
            socket.off("message");
            socket.off("length");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice");
            socket.off("disconnected_user");
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Navbar toggleModal={() => setModal((prev) => !prev)} />
            <Modal openModal={modal} closeModal={() => setModal(false)} />
            <main className={styles.main}>
                <FileUpload
                    selected={selected}
                    scanning={scanning}
                    setScanning={setScanning}
                    setSelected={setSelected}
                />
                <ShareID
                    dc={dataChannel}
                    name={name}
                    connected={connected}
                    selected={selected}
                    scanning={scanning}
                    download={download}
                    setDownload={setDownload}
                />
            </main>
        </>
    );
}
