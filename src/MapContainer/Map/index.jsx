import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-pixi-overlay";
import * as d3 from "d3";
import "pixi.js";
import usePointsOverlay from "../hooks/usePointsOverlay";
import usePolygonOverlay from "../hooks/usePolygonOverlay";
import Style from "../Map.module.css";
import Details from "../Details";
import Legend from "../Legend";
let map;
let colors;

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

const Map = ({
    data,
    minzoom = 0,
    maxZoom = 20,
    variable,
    scaleMethod,
    scaleColor,
    agrouped,
    valueOfProperties
}) => {
    const mapRef = useRef();
    const [mapScale, setMapScale] = useState(null);
    const [focusPolygon, setFocusPolygon] = useState(null);
    const [polygonLayer, setPolygonLayer] = useState(null);
    const [details, setDetails] = useState(null);
    const [location, setLocation] = useState(null);
    const [agroupedMethod, setAgrouped] = useState(agrouped);

    useEffect(() => {
        if (variable)
            if (!valueOfProperties[variable].every(isNumeric)) {
                setAgrouped("mode");
                agrouped = "mode";
            } else {
                setAgrouped("numerical");
            }
    }, [variable]);

    let type = data[0].typeResp;

    // CREATE MAP
    useEffect(() => {
        if (mapRef.current) {
            if (!map)
                map = L.map(mapRef.current).setView([0, 0], 0);
            L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
                subdomains: 'abcd',
                attribution: '',
                minZoom: minzoom,
                maxZoom: maxZoom
            }).addTo(map);
        }
    }, [mapRef, data]);

    // CREATE SCALE
    useEffect(() => {
        if (variable) {
            const properties = valueOfProperties[variable];
            if (agrouped === "mode") {
                const categories = Array.from(new Set(properties));
                setMapScale(() => d3.scaleOrdinal()
                    .domain(categories)
                    .range(d3.schemeCategory10));
            } else {
                if (scaleMethod === "quantile") {
                    setMapScale(() => d3.scaleQuantile()
                        .domain(properties.sort((a, b) => a - b))
                        .range(scaleColor === "divergente" ? ['#f73946', '#ff6e77', '#3693ff', '#1564bf'] : ['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                }
                if (scaleMethod === "quantize") {
                    setMapScale(() => d3.scaleQuantize()
                        .domain([d3.min(properties.sort((a, b) => a - b)), d3.max(properties.sort((a, b) => a - b))])
                        .range(scaleColor === "divergente" ? ['#f73946', '#ff6e77', '#3693ff', '#1564bf'] : ['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                }
            }
        }
    }, [variable, agrouped, scaleMethod, scaleColor]);
    // CREATE OVERLAYERS
    useEffect(() => {
        let layers = Object.values(map._layers);
        const removedLayers = [];
        layers.forEach(layer => {
            if (Object.keys(layer.options).length === 0)
                removedLayers.push(layer);
        });
        removedLayers.forEach((layer) => {
            map.removeLayer(layer);
        });
        if (type === "polygons") {
            usePolygonOverlay(map, data, variable, mapScale, setDetails, setLocation, setFocusPolygon);
        }
        if (type === "markers") {
            usePointsOverlay(map, data, variable, mapScale);
        }
        if (type === "multiple") {
            useMultipleOverlay(map, data, variable, mapScale);
        }
    }, [mapScale]);
    // MOUSEOVER FOCUS
    useEffect(() => {
        if (map && focusPolygon) {
            const newPolygonLayer = L.polygon(focusPolygon, {
                interactive: false,
                color: "#E8E8E8",
                stroke: "#E8E8E8",
                weight: 4,
                fillOpacity: 0
            }).addTo(map);
            setPolygonLayer(newPolygonLayer);
        } else {
            setPolygonLayer(null);
        }
    }, [map, focusPolygon]);
    // UPDATE FOCUS LAYERS
    useEffect(() => {
        return () => {
            if (polygonLayer) {
                map.removeLayer(polygonLayer);
            }
        };
    }, [map, polygonLayer]);

    return (
        <div>
            <div style={{ position: 'absolute', zIndex: 0 }} ref={mapRef} id="map-container" className={Style.Map}>
            </div>
            <div style={{ position: 'absolute', top: '80px', right: '20px', zIndex: '1' }}>
                {variable && <Details type={type} title={variable} detail={details} place={location} agrouped={agroupedMethod} />}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: '1' }}>
                {variable && <Legend key={1} type={agroupedMethod} data={data} set={valueOfProperties[variable]} mapScale={mapScale} scaleMethod={scaleMethod} />}
            </div>
        </div>
    );
}

export default Map;