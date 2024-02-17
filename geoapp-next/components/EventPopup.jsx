import Image from 'next/image';
import SolidButton from './SolidButton';
import styles from '../styles/Popups.module.css';

export default function EventPopup({ name, event, eventType, onDismiss }) {

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
        <div className={`${styles.popup} ${styles.eventPopup} ${eventType}`}>
            <h1>Event: {name}</h1>
            <article>
                <table>
                    <tr>
                        <th></th>
                        <th>Event Details</th>
                    </tr>
                    <tr>
                        <td>Sensor Type</td>
                        <td>{event.sensorType}</td>
                    </tr>
                    <tr>
                        <td>Id</td>
                        <td>{event.eventId}</td>
                    </tr>
                    <tr>
                        <td>Date</td>
                        <td>{getDateString(event.eventTime)}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>{getTimeString(event.eventTime)}</td>
                    </tr>
                    <tr>
                        <td>Severity</td>
                        <td>{event.severity}</td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{event.eventType}</td>
                    </tr>
                    <tr>
                        <td>Latitude</td>
                        <td>{event.latitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>{event.longitude}</td>
                    </tr>
                </table>
            </article>
            {eventType === 'rvss' &&
                <Image
                    className={styles.media}
                    src="/images/stock-camera.jpeg"
                    alt="media"
                    width={400}
                    height={268} />
            }
            <footer>
                <SolidButton icon="fa-trash" className={styles.buttonCtrl} onClick={onDismiss}> Dismiss</SolidButton>
                <SolidButton icon="fa-circle-plus" className={styles.buttonCtrl}> Add to Case</SolidButton>
                <SolidButton icon="fa-triangle-exclamation" className={styles.buttonCtrl}> Notify Agents</SolidButton>
            </footer>
        </div>
    )
}