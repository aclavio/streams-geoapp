import SolidButton from '../components/SolidButton';
import styles from '../styles/AlertsNav.module.css';

export function AlertItem({ name, time, isNew = true, isSelected = false, onClick }) {
    const classes = [styles.alertItem]
        .concat(isNew ? styles.alertNew : [])
        .concat(isSelected ? styles.selected : [])
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            <i className={`${styles.alertNotice} fa-solid fa-circle`}></i>
            <div className={styles.alertName}>{name}</div>
            <div className={styles.alertTime}>{time}</div>
        </div>
    )
}

export default function AlertsNav(props) {

    function getAlertName(alert) {
        return `${alert.lgdsEventType} - ${alert.rvssEventType}`;
    }

    function getAlertTime(alert) {
        let lgdsDate = new Date(alert.lgdsEventTime);
        let rvssDate = new Date(alert.rvssEventTime);
        return new Date(Math.min(lgdsDate.getTime(), rvssDate.getTime())).toString();
    }

    return (
        <nav className={`${props.className} ${styles.alerts} ${props.visible ? styles.alertsVisible : styles.alertsHidden}`}>
            <div className={styles.alertsHeader}>
                <span className={styles.alertsTitle}>Alerts</span>
                {
                    props.visible ?
                        <SolidButton icon={'fa-chevron-left'} onClick={props.toggleVisible} /> :
                        <SolidButton icon={'fa-chevron-right'} onClick={props.toggleVisible} />
                }
            </div>
            <div className={styles.alertsScroller}>
                <div className={styles.alertsContainer}>
                    {
                        props.alerts && props.alerts.map((alert, idx) => (
                            <AlertItem
                                key={idx}
                                name={getAlertName(alert)}
                                time={getAlertTime(alert)}
                                isNew={alert.isNew}
                                isSelected={props.selectedAlert === alert}
                                onClick={() => props.alertClicked(alert)} />
                        ))
                    }
                </div>
            </div>
        </nav>
    );
}