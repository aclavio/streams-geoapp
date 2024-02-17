import Image from 'next/image';
import SolidButton from './SolidButton';
import styles from '../styles/Popups.module.css';

export default function AlertPopup({ name, alert, onDismiss }) {

    function getDateString(val) {
        let ds;
        try {
            ds = new Date(val).toLocaleDateString();
        } catch {
            ds = 'ERR';
        }
        return ds;
    }

    function getTimeString(val) {
        let ts;
        try {
            ts = new Date(val).toLocaleTimeString();
        } catch {
            ts = 'ERR';
        }
        return ts;
    }

    return (
        <div className={`${styles.popup} ${styles.alertPopup}`}>
            <h1>Alert: {name}</h1>
            <article>
                <table>
                    <tr>
                        <th></th>
                        <th>LGDS Event</th>
                        <th>RVSS Event</th>
                    </tr>
                    <tr>
                        <td>Id</td>
                        <td>{alert.lgdsEventId}</td>
                        <td>{alert.rvssEventId}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{getDateString(alert.lgdsEventTime)}</td>
                        <td>{getDateString(alert.rvssEventTime)}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>{getTimeString(alert.lgdsEventTime)}</td>
                        <td>{getTimeString(alert.rvssEventTime)}</td>
                    </tr>
                    <tr>
                        <td>Severity</td>
                        <td>{alert.lgdsEventSeverity}</td>
                        <td>{alert.rvssEventSeverity}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{alert.lgdsEventType}</td>
                        <td>{alert.rvssEventType}</td>
                    </tr>
                    <tr>
                        <td>Latitude</td>
                        <td>{alert.lgdsEventLatitude}</td>
                        <td>{alert.rvssEventLatitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>{alert.lgdsEventLongitude}</td>
                        <td>{alert.rvssEventLongitude}</td>
                    </tr>
                </table>
            </article>
            <Image
                className={styles.media}
                src="/images/stock-camera.jpeg"
                alt="media"
                width={400}
                height={268} />
            <footer>
                <SolidButton icon="fa-trash" className={styles.buttonCtrl} onClick={onDismiss}> Dismiss</SolidButton>
                <SolidButton icon="fa-circle-plus" className={styles.buttonCtrl}> Add to Case</SolidButton>
                <SolidButton icon="fa-triangle-exclamation" className={styles.buttonCtrl}> Notify Agents</SolidButton>
            </footer>
        </div>
    )
}