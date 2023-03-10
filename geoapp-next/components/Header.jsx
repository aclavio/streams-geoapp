import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <img src="images/20200122-SVG-confluent_logo-logotype-island.svg" alt="Confluent Logo" className={styles.logo} />
            <h1>Demo GeoApp Viewer</h1>
        </header>
    );
}