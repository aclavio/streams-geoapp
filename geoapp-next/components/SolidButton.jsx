import styles from '../styles/SolidButton.module.css';

export default function SolidButton({ icon, onClick, className, children }) {
    return (
        <button onClick={onClick} className={`${styles.button} ${className}`}>
            <i className={`fa-solid ${icon}`} />
            {children}
        </button>
    );
}