import { useEffect, useRef } from 'react';
import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import styles from '../styles/Map.module.css';

const { MapContainer } = ReactLeaflet;

export default function DynamicMap({ children, className, width, height, ...rest }) {

    useEffect(() => {
        (async function init() {
            delete Leaflet.Icon.Default.prototype._getIconUrl;
            Leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: 'leaflet/marker-icon-2x.png',
                iconUrl: 'leaflet/marker-icon.png',
                shadowUrl: 'leaflet/marker-shadow.png',
            });
        })();
    }, []);

    return (
        <MapContainer className={`${className} ${styles.map}`} {...rest}>
            {children(ReactLeaflet, Leaflet)}
        </MapContainer >
    );
}