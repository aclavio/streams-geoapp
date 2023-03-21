import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import AlertsNav from '../components/AlertsNav';
import AlertPopup from '../components/AlertPopup';
import EventPopup from '../components/EventPopup';

const DynamicMap = dynamic(() => import('../components/DynamicMap'), {
  ssr: false
});

const fetcher = (...args) => fetch(...args).then(res => res.json());

const mapBoxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const startingZoom = process.env.NEXT_PUBLIC_STARTING_ZOOM;
const startingPosition = [
  process.env.NEXT_PUBLIC_STARTING_LATITUDE,
  process.env.NEXT_PUBLIC_STARTING_LONGITUDE
];

export default function Home(props) {
  const [alerts, setAlerts] = useState(props.alerts || []);
  const [events, setEvents] = useState(props.events || []);
  const [alertsVisible, setAlertsVisible] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  let map = null;

  useSWR('/api/alerts', fetcher, {
    refreshInterval: 10000,
    onSuccess: (data) => {
      //console.log('got alerts:', data);
      setAlerts(alerts.concat(data));
    }
  });
  useSWR('/api/events', fetcher, {
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
    const pos = [alert.lgdsEventLatitude, alert.lgdsEventLongitude];
    if (map) {
      map.stop();
      map.flyTo(pos);
      //map.openPopup(pos);
    }
  }

  function alertMarkerClicked(alert) {
    console.log('alert marker clicked!', alert);
    alert.isNew = false;
    setSelectedAlert(alert);
  }

  function whenReady() {
    console.log('map ready event');
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
        <DynamicMap className={styles.map} center={startingPosition} zoom={startingZoom} whenReady={whenReady}>
          {
            ({ useMap, TileLayer, LayersControl, LayerGroup, Marker, Popup }, L) => {
              // interecept the map
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
                  <LayersControl possition='topright'>
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
                            <Marker
                              key={idx}
                              title={`Alert: ${alert.lgdsEventType} - ${alert.rvssEventType}`}
                              position={[alert.lgdsEventLatitude, alert.lgdsEventLongitude]}
                              eventHandlers={{
                                click: () => alertMarkerClicked(alert)
                              }}
                            >
                              <Popup maxWidth={400}>
                                <AlertPopup name={`${alert.lgdsEventType} - ${alert.rvssEventType}`} alert={alert} />
                              </Popup>
                            </Marker>
                          ))
                        }
                      </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Events'>
                      <LayerGroup>
                        {
                          events.map((event, idx) => (
                            <Marker
                              key={idx}
                              title={`Event: ${event.eventType}`}
                              position={[event.latitude, event.longitude]}
                              icon={event.sensorType === 'rvss' ? eventIconCamera : eventIconRed}>
                              <Popup maxWidth={400}>
                                <EventPopup name={event.eventType} event={event} eventType={event.sensorType} />
                              </Popup>
                            </Marker>
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
