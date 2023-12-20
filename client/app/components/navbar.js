import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <Image
                    src="/vecteezy_online-transfer-vector-icon-design_19958083.jpg"
                    alt="peer to peer fileshare logo"
                    width={45}
                    height={45}
                    className={styles.logo}
                />
            </Link>
            <Link
                href="https://github.com/Aninda001/p2p-fileshare"
                rel="noopener noreferrer"
                target="_blank"
            >
                <Image
                    src="/logo-2582757_640.png"
                    alt="github logo"
                    width={45}
                    height={45}
                />
            </Link>
        </nav>
    );
};

export default Navbar;
