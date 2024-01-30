import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import AlertsNav from '../components/AlertsNav';
import AlertMarker from '../components/AlertMarker';
import EventMarker from '../components/EventMarker';

const DynamicMap = dynamic(() => import('../components/DynamicMap'), {
  ssr: false
});

const fetcher = (...args) => fetch(...args, { mode: 'no-cors' }).then(res => res.json());

const mapBoxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const startingZoom = process.env.NEXT_PUBLIC_STARTING_ZOOM;
const startingPosition = [
  process.env.NEXT_PUBLIC_STARTING_LATITUDE,
  process.env.NEXT_PUBLIC_STARTING_LONGITUDE
];

const calculateMidpoint = (lat1, lon1, lat2, lon2) => [(lat1 + lat2) / 2, (lon1 + lon2) / 2];

export default function Home(props) {
  const [alerts, setAlerts] = useState(props.alerts || []);
  const [events, setEvents] = useState(props.events || []);
  const [alertsVisible, setAlertsVisible] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  let map = null;

  useSWR(process.env.NEXT_PUBLIC_ALERTS_URL, fetcher, {
    refreshInterval: 10000,
    onSuccess: (data) => {
      //console.log('got alerts:', data);
      data.forEach(alert => alert.midpoint = calculateMidpoint(
        alert.lgdsEventLatitude,
        alert.lgdsEventLongitude,
        alert.rvssEventLatitude,
        alert.rvssEventLongitude
      ));
      setAlerts(alerts.concat(data));
    }
  });
  useSWR(process.env.NEXT_PUBLIC_EVENTS_URL, fetcher, {
    refreshInterval: 5000,
    onSuccess: (data) => {
      //console.log('got events:', data);
      setEvents(events.concat(data));
    }
  });

  function toggleAlertsVisible() {
    setAlertsVisible(!alertsVisible);
    if (map) {
      console.log('invalidating map size');
      map.invalidateSize(false);
    };
  }

  function alertClicked(alert) {
    console.log('alert clicked!', alert);
    alert.isNew = false;
    setSelectedAlert(alert);
    const pos1 = [alert.lgdsEventLatitude, alert.lgdsEventLongitude];
    const pos2 = [alert.rvssEventLatitude, alert.rvssEventLongitude];
    if (map) {
      map.closePopup();
      map.stop();
      map.flyToBounds([pos1, pos2]);
      if (alert.marker) {
        alert.marker.openPopup();
      }
    }
  }

  function alertMarkerClicked(alert) {
    console.log('alert marker clicked!', alert);
    alert.isNew = false;
    setSelectedAlert(alert);
  }

  function eventMarkerClicked(event) {
    console.log('event marker clicked!', event);
    setSelectedAlert(null);
  }

  function handleAlertRef(alert, marker) {
    // store the marker ref in the alert so it can be opened programatically
    alert.marker = marker;
  }

  function handleDismissEvent(event) {
    console.log('dismiss event clicked', event);
    if (map) {
      map.closePopup();
      map.stop();
    }
    const updatedEvents = events.filter(e => e !== event);
    setEvents(updatedEvents);
  }

  function handleDismissAlert(alert) {
    console.log('dismiss alert clicked', alert);
    if (confirm(`Dismiss Alert "${alert.lgdsEventType} - ${alert.rvssEventType}"?`)) {
      if (map) {
        map.closePopup();
        map.stop();
      }
      setSelectedAlert(null);
      const updatedAlerts = alerts.filter(a => a !== alert);
      setAlerts(updatedAlerts);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <meta charSet="utf-8" />
        <title>Confluent Demo GeoApp Viewer</title>
        <meta name="description" content="Confluent Demo GeoViewer" />
        <meta name="author" content="Confluent" />
        <link rel="icon" type="image/svg+xml" href="images/20200122-SVG-confluent_logo-mark-denim.svg"></link>
      </Head>

      <Header />

      <main className={styles.content}>
        <AlertsNav
          className={styles.alerts}
          alerts={alerts}
          visible={alertsVisible}
          selectedAlert={selectedAlert}
          toggleVisible={toggleAlertsVisible}
          alertClicked={alertClicked} />
        <DynamicMap className={styles.map} center={startingPosition} zoom={startingZoom} >
          {
            (ReactLeaflet, L) => {
              const { useMap, TileLayer, LayersControl, LayerGroup, ScaleControl } = ReactLeaflet;
              // intercept the map
              const MapInterceptor = () => {
                const leafletMap = useMap();
                useEffect(() => {
                  console.log('intercepting map:', leafletMap);
                  map = leafletMap;
                  map.invalidateSize(false);
                }, []);
                return null;
              };

              // setup icons
              const eventIconRed = L.icon({
                iconUrl: '/images/map-pin-red.svg',
                iconSize: [20, 35],
                iconAnchor: [10, 34],
                popupAnchor: [0, -27],
              });
              const eventIconGreen = L.icon({
                iconUrl: '/images/map-pin-green.svg',
                iconSize: [20, 35],
                iconAnchor: [10, 34],
                popupAnchor: [0, 0],
              });
              const eventIconCamera = L.icon({
                iconUrl: '/images/map-pin-camera.svg',
                iconSize: [20, 35],
                iconAnchor: [10, 34],
                popupAnchor: [0, -27],
              });

              return (
                <>
                  <MapInterceptor />
                  <ScaleControl position='bottomleft' />
                  <LayersControl position='topright'>
                    <LayersControl.BaseLayer checked name='OpenStreetMap'>
                      <TileLayer
                        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        maxZoom={19}
                        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name='Mapbox Satellite'>
                      <TileLayer
                        url='https://api.mapbox.com/v4/{tileset_id}/{z}/{x}/{y}.{format}?access_token={token}'
                        tileset_id='mapbox.satellite'
                        format='png32'
                        maxZoom={18}
                        token={mapBoxAccessToken}
                        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
                      />
                    </LayersControl.BaseLayer>
                    <LayersControl.Overlay checked name='Alerts'>
                      <LayerGroup>
                        {
                          alerts.map((alert, idx) => (
                            <AlertMarker
                              key={idx}
                              ref={handleAlertRef.bind(this, alert)}
                              alert={alert}
                              selected={selectedAlert === alert}
                              ReactLeaflet={ReactLeaflet}
                              alertIcon={new L.Icon.Default()}
                              eventIcon={eventIconGreen}
                              alertMarkerClicked={alertMarkerClicked}
                              onDismiss={handleDismissAlert.bind(this, alert)}
                            />
                          ))
                        }
                      </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Events'>
                      <LayerGroup>
                        {
                          events.map((event, idx) => (
                            <EventMarker
                              key={idx}
                              event={event}
                              ReactLeaflet={ReactLeaflet}
                              eventIcon={event.sensorType === 'rvss' ? eventIconCamera : eventIconRed}
                              eventMarkerClicked={eventMarkerClicked}
                              onDismiss={handleDismissEvent.bind(this, event)}
                            />
                          ))
                        }
                      </LayerGroup>
                    </LayersControl.Overlay>
                  </LayersControl>
                </>
              )
            }
          }
        </DynamicMap>
      </main>
    </div >
  )
}
