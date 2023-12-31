import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-pixi-overlay";
import * as d3 from "d3";
import "pixi.js";
import Style from '../Map.module.css'
import usePolygonOverlay from "../hooks/usePolygonOverlay";
import usePointsOverlay from "../hooks/usePointsOverlay";
import useMultipleOverlay from "../hooks/useMultipleOverlay";
import Legend from "@/MapContainer/Legend";
import Details from "@/MapContainer/Details";

let map;

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

const MultipleMap = ({
    markerData,
    polygonData,
    polygonAgrouped,
    valueOfMarkerProperties,
    valueOfPolygonProperties,
    markerVariable,
    polygonVariable,
    markerScaleMethod = "quantize",
    polygonScaleMethod = "quantize",
    markerScaleColor = "sequencial",
    polygonScaleColor = "sequencial",
    variableDistribution,
    minzoom = 0,
    maxZoom = 20,
}) => {
    const mapRef = useRef();
    const [markerMapScale, setMarkerMapScale] = useState(null);
    const [polygonMapScale, setPolygonMapScale] = useState(null);
    const [focusPolygon, setFocusPolygon] = useState(null);
    const [polygonLayer, setPolygonLayer] = useState(null);
    const [details, setDetails] = useState(null);
    const [location, setLocation] = useState(null);
    const [agroupedMethod, setAgrouped] = useState(polygonAgrouped);
    const [markerAgrouped, setMarkerAgrouped] = useState();

    useEffect(() => {
        if (polygonVariable)
            if (!valueOfPolygonProperties[polygonVariable].every(isNumeric)) {
                setAgrouped("mode");
                polygonAgrouped = "mode";
            } else {
                setAgrouped(polygonAgrouped);
            }
        if (markerVariable)
            if (!valueOfMarkerProperties[markerVariable].every(isNumeric)) {
                setMarkerAgrouped("mode");
            } else {
                setMarkerAgrouped("numerical")
            }
    }, [polygonVariable, markerVariable]);

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
    }, [mapRef, markerData, polygonData]);

    // CREATE MARKERS SCALE
    useEffect(() => {
        if (markerVariable) {
            const properties = valueOfMarkerProperties[markerVariable];
            if (markerAgrouped === "mode") {
                const categories = Array.from(new Set(properties));
                setMarkerMapScale(() => d3.scaleOrdinal()
                    .domain(categories)
                    .range(d3.schemeCategory10));
            } else {
                if (markerScaleMethod === "quantile") {
                    setMarkerMapScale(() => d3.scaleQuantile()
                        .domain(properties.sort((a, b) => a - b))
                        .range(markerScaleColor === "divergente" ? ['#f73946', '#ff6e77', '#3693ff', '#1564bf'] : ['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                }
                if (markerScaleMethod === "quantize") {
                    setMarkerMapScale(() => d3.scaleQuantize()
                        .domain([d3.min(properties.sort((a, b) => a - b)), d3.max(properties.sort((a, b) => a - b))])
                        .range(markerScaleColor === "divergente" ? ['#f73946', '#ff6e77', '#3693ff', '#1564bf'] : ['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                }
            }
        }
    }, [markerVariable, markerScaleColor, markerScaleMethod, markerAgrouped]);

    // CREATE POLYGON SCALE
    useEffect(() => {
        if (polygonVariable) {
            const properties = valueOfPolygonProperties[polygonVariable];
            if (polygonAgrouped === "mode") {
                const categories = Array.from(new Set(properties));
                setPolygonMapScale(() => d3.scaleOrdinal()
                    .domain(categories)
                    .range(d3.schemePastel1));
            } else {
                if (variableDistribution) {
                    let count = 0;
                    polygonData.forEach((polygon) => {
                        const resps = polygon.properties[polygonVariable];
                        resps.forEach((resp) => {
                            if (Array.isArray(resp))
                                count += resp.filter((item) => item === variableDistribution).length;
                            else
                                count += resp === variableDistribution ? 1 : 0;
                        });
                    });
                    setPolygonMapScale(() => d3.scaleQuantize()
                        .domain([0, count])
                        .range(['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                } else {
                    if (polygonScaleMethod === "quantile") {
                        setPolygonMapScale(() => d3.scaleQuantile()
                            .domain(properties.sort((a, b) => a - b))
                            .range(polygonScaleColor === "divergente" ? ['#f73946', '#ff6e77', '#3693ff', '#1564bf'] : ['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                    }
                    if (polygonScaleMethod === "quantize") {
                        setPolygonMapScale(() => d3.scaleQuantize()
                            .domain([d3.min(properties.sort((a, b) => a - b)), d3.max(properties.sort((a, b) => a - b))])
                            .range(polygonScaleColor === "divergente" ? ['#f73946', '#ff6e77', '#3693ff', '#1564bf'] : ['#96c7ff', '#3693ff', '#0564bf', '#063973']));
                    }
                }
            }
        }
    }, [polygonVariable, polygonAgrouped, polygonScaleColor, polygonScaleMethod, variableDistribution]);

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
        useMultipleOverlay(map, polygonData, markerData, polygonVariable, markerVariable, polygonMapScale, markerMapScale, setDetails, setLocation, setFocusPolygon, variableDistribution);
    }, [markerMapScale, polygonMapScale]);

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
                {polygonVariable && <Details type={"polygons"} title={polygonVariable} detail={details} place={location} agrouped={agroupedMethod} />}
            </div>
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px', zIndex: '1' }}>
                {polygonVariable && <Legend key={1} type={agroupedMethod} data={polygonData} set={valueOfPolygonProperties[polygonVariable]} mapScale={polygonMapScale} scaleMethod={polygonMapScale} variableDistribution={variableDistribution} variable={polygonVariable} typeMap={"polygon"} />}
                {markerVariable && <Legend key={2} type={markerAgrouped} data={markerData} set={valueOfMarkerProperties[markerVariable]} mapScale={markerMapScale} scaleMethod={markerScaleMethod} variableDistribution={false} typeMap={"marker"} />}
            </div>

        </div>
    );
}

export default MultipleMap;