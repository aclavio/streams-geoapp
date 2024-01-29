import EventPopup from "./EventPopup";

export default function EventMarker({ ReactLeaflet, eventIcon, event, eventMarkerClicked, onDismiss }) {
    const { LayerGroup, Marker, Popup } = ReactLeaflet;
    return (
        <Marker
            title={`Event: ${event.eventType}`}
            position={[event.latitude, event.longitude]}
            icon={eventIcon}
            eventHandlers={{
                click: () => eventMarkerClicked(event)
            }}
        >
            <Popup maxWidth={400}>
                <EventPopup name={event.eventType} event={event} eventType={event.sensorType} onDismiss={onDismiss} />
            </Popup>
        </Marker>
    )
}