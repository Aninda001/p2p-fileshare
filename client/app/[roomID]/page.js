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
    const [dataChannel, setDataChannel] = useState([]);
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
    let connectedUser,
        totalSize = 0,
        receivedSize = 0;

    let files = [];
    const dataHandling = (channel) => {
        let fileChunks = [];
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
                    totalSize += recieve.totalSize;
                } else if (recieve.type === "Done!") {
                    // Once, all the chunks are received, combine them to form a Blob
                    const file = new File(fileChunks, `${recieve.filename}`, {
                        type: `${recieve.filetype}`,
                    });

                    files.push({ file, pathname: recieve.pathName });
                    console.log("Received", file);
                    fileChunks = [];
                    if (totalSize === receivedSize && totalSize !== 0) {
                        setDownload(files);
                        files = [];
                        totalSize = 0;
                        receivedSize = 0;
                    }
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
    };

    const channelEvent = (channel, name) => {
        // Set up event listener for data channel
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

        channel.onclose = () => {
            console.log("disconnected user", connectedUser);
            setConnected((prev) =>
                prev.filter((user) => user.id !== connectedUser),
            );
        };
    };

    const peerConnection = () => {
        return new RTCPeerConnection({
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
    };

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
        socket.on("connect", () => {
            console.log("connected with signalling server");
        });

        socket.on("message", (msg) => {
            console.log(msg);
        });

        socket.emit("addRoom", path, name);
        socket.on("newChannel", async (id) => {
            let pc = peerConnection();
            let channel = pc.createDataChannel("channel");
            setDataChannel((prev) => [...prev, channel]);
            // channel.bufferedAmountLowThreshold = 5 * 1024 * 1024;
            let offer = await pc.createOffer();
            dataHandling(channel);
            channelEvent(channel, name);
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit(
                        "ice",
                        {
                            ice: event.candidate,
                            room: path,
                        },
                        id,
                        socket.id,
                    );
                } else {
                    console.log("No more ICE candidate");
                }
            };

            socket.on("ice", (ice, sender, reciever) => {
                pc.addIceCandidate(new RTCIceCandidate(ice))
                    .then(() => {
                        console.log(`ICE Candidate added successfully.`);
                    })
                    .catch((error) => {
                        console.error("Error adding ICE Candidate:", error);
                    });
            });

            socket.emit("offer", { offer: offer, room: path }, id, socket.id);
            await pc.setLocalDescription(offer);
            socket.once("answer", async (answer, sender, reciever) => {
                if (reciever === socket.id)
                    await pc.setRemoteDescription(answer);
            });
        });

        socket.on("offer", async (offer, sender, reciever) => {
            let pc = peerConnection();
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit(
                        "ice",
                        {
                            ice: event.candidate,
                            room: path,
                        },
                        sender,
                        reciever,
                    );
                } else {
                    console.log("No more ICE candidate");
                }
            };

            let channel;
            pc.ondatachannel = (event) => {
                channel = event.channel;
                setDataChannel((prev) => [...prev, channel]);
                // channel.bufferedAmountLowThreshold = 5 * 1024 * 1024;
                dataHandling(channel);
                channelEvent(channel, name);
            };

            socket.on("ice", (ice, sender, reciever) => {
                pc.addIceCandidate(new RTCIceCandidate(ice))
                    .then(() => {
                        console.log(`ICE Candidate added successfully.`);
                    })
                    .catch((error) => {
                        console.error("Error adding ICE Candidate:", error);
                    });
            });

            await pc.setRemoteDescription(offer);
            let answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit(
                "answer",
                { answer: answer, room: path },
                sender,
                reciever,
            );
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
