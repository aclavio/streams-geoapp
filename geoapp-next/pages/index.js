import { useState } from 'react';
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

const alerts = [
  {
    "lgdsEventId": "lgds2",
    "lgdsEventLongitude": process.env.NEXT_PUBLIC_STARTING_LONGITUDE,
    "lgdsEventLatitude": process.env.NEXT_PUBLIC_STARTING_LATITUDE,
    "lgdsEventTime": new Date().getTime(),
    "lgdsEventSeverity": "high",
    "lgdsEventType": 'ldgs test',
    "lgdsGeoHash": "wdw4f820h17g",
    "rvssEventId": "rvss2",
    "rvssEventLongitude": process.env.NEXT_PUBLIC_STARTING_LONGITUDE,
    "rvssEventLatitude": process.env.NEXT_PUBLIC_STARTING_LATITUDE,
    "rvssEventTime": new Date().getTime(),
    "rvssEventSeverity": "Critical",
    "rvssEventType": 'rvss test',
    "rvssGeoHash": "wdw4f820h17g"
  },
  {
    name: 'Test Alert 2',
    time: new Date().getTime()
  }
];

export async function getStaticProps() {
  return {
    props: {
      alerts
    }
  };
}

function MapInterceptor(props) {
  const map = useMap();
  return null;
}

export default function Home(props) {
  const [alerts, setAlerts] = useState(props.alerts || []);
  const [alertsVisible, setAlertsVisible] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alertsResponse = useSWR('/api/alerts', fetcher, {
    refreshInterval: 5000
  });
  const eventsResponse = useSWR('/api/events', fetcher, {
    refreshInterval: 5000
  });

  console.log('got alerts:', alertsResponse.data);
  console.log('got events:', eventsResponse.data);

  function toggleAlertsVisible() {
    setAlertsVisible(!alertsVisible);
  }

  function alertClicked(alert) {
    console.log('alert clicked!', alert);
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
            ({ TileLayer, LayersControl, LayerGroup, Marker, Popup }, L) => {
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
                        <Marker title='test' position={startingPosition}>
                          <Popup maxWidth={400}>
                            <AlertPopup name='test' alert={{}} />
                          </Popup>
                        </Marker>
                      </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name='Events'>
                      <LayerGroup>
                        <Marker title='test' position={[0, 0]} icon={eventIconRed}>
                          <Popup maxWidth={400}>
                            <EventPopup name='lgds test' event={{}} />
                          </Popup>
                        </Marker>
                        <Marker title='test' position={[0.05, 0]} icon={eventIconCamera}>
                          <Popup maxWidth={400}>
                            <EventPopup name='rvss test' event={{}} eventType='rvss' />
                          </Popup>
                        </Marker>
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
