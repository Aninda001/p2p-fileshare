"use client";

import Navbar from "../components/navbar";
import ShareID from "../components/shareID";
import styles from "./page.module.css";
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
    const [dataChannel, setDataChannel] = useState(null);
    const [name, setName] = useState("");
    const [connected, setConnected] = useState([]);

    let path = usePathname();
    let channel;
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
                {
                    url: "turn:192.158.29.39:3478?transport=udp",
                    credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
                    username: "28224511:1379330808",
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
                let offer = await pc.createOffer();
                console.log(offer);
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
                    let recieve = JSON.parse(event.data);
                    if (recieve.type === "username") {
                        setConnected((prev) => [
                            ...prev,
                            { id: recieve.id, name: recieve.name },
                        ]);
                    }

                    if (recieve.type === "message") {
                        console.log(
                            "Received message on the sender side:",
                            recieve,
                        );
                    }
                };
                socket.emit("offer", { offer: offer, room: path });
                await pc.setLocalDescription(offer);
            }
        });

        pc.ondatachannel = (event) => {
            channel = event.channel;
            setDataChannel(channel);
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
            };

            // Set up event listener for receiving messages
            channel.onmessage = (event) => {
                let recieve = JSON.parse(event.data);
                if (recieve.type === "username") {
                    setConnected((prev) => [
                        ...prev,
                        { id: recieve.id, name: recieve.name },
                    ]);
                }

                if (recieve.type === "message") {
                    console.log("Received message : ", recieve);
                }
            };
        };
        socket.on("offer", async (offer) => {
            console.log(offer);
            await pc.setRemoteDescription(offer);
            let answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            console.log(answer);
            socket.emit("answer", { answer: answer, room: path });
        });

        socket.on("answer", async (answer) => {
            await pc.setRemoteDescription(answer);
            console.log(answer);
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

        return () => {
            socket.off("connect");
            socket.off("message");
            socket.off("length");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice");
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <FileUpload />
                <ShareID dc={dataChannel} name={name} connected={connected} />
            </main>
        </>
    );
}
