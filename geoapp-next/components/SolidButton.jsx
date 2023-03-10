import styles from '../styles/SolidButton.module.css';

export default function SolidButton({ icon, onClick }) {
    return (
        <button onClick={onClick} className={styles.button}>
            <i className={`fa-solid ${icon}`}></i>
        </button>
    );
}