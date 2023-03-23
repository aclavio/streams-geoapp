import { forwardRef } from "react";
import AlertPopup from "./AlertPopup";

const AlertMarker = forwardRef(({ ReactLeaflet, alertIcon, eventIcon, alert, alertMarkerClicked, selected }, ref) => {
  const { LayerGroup, Marker, Popup, Polyline } = ReactLeaflet;
  return (
    <LayerGroup >
      <Marker
        ref={ref}
        title={`Alert: ${alert.lgdsEventType} - ${alert.rvssEventType}`}
        position={alert.midpoint}
        icon={alertIcon}
        eventHandlers={{
          click: () => alertMarkerClicked(alert)
        }}
      >
        <Popup maxWidth={400}>
          <AlertPopup name={`${alert.lgdsEventType} - ${alert.rvssEventType}`} alert={alert} />
        </Popup>
      </Marker>
      {
        selected &&
        <>
          <Polyline
            positions={[alert.midpoint, [alert.lgdsEventLatitude, alert.lgdsEventLongitude]]}
            pathOptions={{ color: 'red' }} />
          <Polyline
            positions={[alert.midpoint, [alert.rvssEventLatitude, alert.rvssEventLongitude]]}
            pathOptions={{ color: 'red' }} />
          <Marker
            title={`LGDS Event: ${alert.lgdsEventType}`}
            position={[alert.lgdsEventLatitude, alert.lgdsEventLongitude]}
            icon={eventIcon}
          />
          <Marker
            title={`RVSS Event: ${alert.rvssEventType}`}
            position={[alert.rvssEventLatitude, alert.rvssEventLongitude]}
            icon={eventIcon}
          />
        </>
      }
    </LayerGroup>
  );
});

export default AlertMarker;