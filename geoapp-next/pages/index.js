import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import SolidButton from '../components/SolidButton';

const DynamicMap = dynamic(() => import('../components/DynamicMap'), {
  ssr: false
});

const mapBoxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const startingZoom = process.env.NEXT_PUBLIC_STARTING_ZOOM;
const startingPosition = [
  process.env.NEXT_PUBLIC_STARTING_LATITUDE,
  process.env.NEXT_PUBLIC_STARTING_LONGITUDE
];

export default function Home() {
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
        <nav className={`${styles.alerts} alerts-visible`}>
          <div className={styles.alertsHeader}>
            <span className={styles.alertsTitle}>Alerts</span>
            <SolidButton icon={'fa-chevron-left'} />
            <SolidButton icon={'fa-chevron-right'} />
          </div>
          <div className={styles.alertsScroller}>
            <div className={styles.alertsContainer}></div>
          </div>
        </nav>
        <DynamicMap className={styles.map} center={startingPosition} zoom={startingZoom}>
          {
            ({ TileLayer, LayersControl }) => (
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
                </LayersControl>
              </>
            )
          }
        </DynamicMap>
      </main>
    </div >
  )
}
