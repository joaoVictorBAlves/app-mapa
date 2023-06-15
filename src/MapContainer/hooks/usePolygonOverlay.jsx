import "leaflet-pixi-overlay";
import { geoBounds } from 'd3-geo';
import * as d3 from "d3";
import "pixi.js";
let scaledCoordinates = null;

const usePolygonOverlay = (map, data, variable, mapScale, setDetails, setLocation, setFocusPolygon) => {
    const polygonOverlay = (() => {
        let firstDraw = true;
        let prevZoom;
        // LISTAGEM DOS POLÍGONOS
        const polygonsByGeojson = [];
        const polygonFeautures = [];
        // INSTANCIANDO OS POLÍGONOS
        data.forEach((feauture, i) => {
            feauture.geometry.coordinates.forEach(polygon => {
                polygonFeautures.push({
                    type: "Feauture",
                    properties: feauture.properties,
                    geometry: {
                        type: feauture.geometry.type,
                        coordinates: polygon
                    }
                });
                polygonsByGeojson.push(new PIXI.Graphics());
            });
        });
        // ADICIONANDO GRÁFICOS NO PIXI CONTAINER
        const pixiContainer = new PIXI.Container();
        polygonsByGeojson.forEach((geo) => { geo.interactive = true });
        pixiContainer.addChild(...polygonsByGeojson);
        pixiContainer.interactive = true;
        pixiContainer.buttonMode = true;
        // CRIAÇÃO DA CAMADA
        return L.pixiOverlay((utils) => {
            let zoom = utils.getMap().getZoom();
            let container = utils.getContainer();
            let renderer = utils.getRenderer();
            let project = utils.latLngToLayerPoint;
            let scale = utils.getScale();
            let properties = [];
            // DESENHOS DOS POLÍGONOS
            if (firstDraw || prevZoom !== zoom) {
                polygonsByGeojson.forEach((polygon, i) => {
                    // DEFINIÇÃO DE CORES PARA POLÍGONOS
                    let valor = variable ? polygonFeautures[i].properties[variable] : 0;
                    properties = variable ? polygonFeautures[i].properties[variable] : 0;
                    let numericProperties;
                    if (variable) {
                        if (Array.isArray(properties)) {
                            if (Array.isArray(properties[0])) {
                                properties = [].concat(...properties);
                            }
                            numericProperties = properties.map(prop => {
                                if (!isNaN(parseFloat(prop))) {
                                    return parseFloat(prop);
                                }
                                return false
                            });
                            if (numericProperties[0] === true) {
                                properties = numericProperties
                                if (agrouped === "sum") {
                                    properties = d3.sum(properties);
                                } else if (agrouped === "mean") {
                                    properties = d3.mean(properties);
                                } else if (agrouped === "count") {
                                    properties = properties.length;
                                }
                            } else {
                                properties = d3.mode(properties);
                            }
                        }
                    }
                    console.log(properties)
                    const color = variable ? parseInt(mapScale(properties).replace("#", ""), 16) : 0x96C7FF;
                    const alpha = 1;
                    // PIXI.JS
                    polygon.clear()
                    polygon.lineStyle(1 / scale, 0x000000, 1);
                    polygon.beginFill(color, alpha);
                    let latLonCoordinates = []
                    polygonFeautures[i].geometry.coordinates.forEach((coords, index) => {
                        if (polygonFeautures[i].geometry.type === "Polygon") {
                            latLonCoordinates.push([coords[1], coords[0]])
                            const point = project([coords[1], coords[0]]) // NA PRODUÇÃO INVERTER A ORDEM
                            if (index == 0) polygon.moveTo(point.x, point.y);
                            else polygon.lineTo(point.x, point.y);
                        } else {
                            coords.forEach((coord, index) => {
                                latLonCoordinates.push([coords[1], coords[0]])
                                const point = project([coord[1], coord[0]]) // NA PRODUÇÃO INVERTER A ORDEM
                                if (index == 0) polygon.moveTo(point.x, point.y);
                                else polygon.lineTo(point.x, point.y);
                            });
                        }
                    })
                    polygon.endFill();
                    polygon.on("mouseover", () => {
                        setDetails(valor);
                        setLocation(polygonFeautures[i].properties.nome_bairro);
                        setFocusPolygon(latLonCoordinates)
                    });
                    pixiContainer.on("mouseout", () => {
                        setDetails(null);
                        setLocation(null);
                        setFocusPolygon(null)
                    });
                });
            }
            scaledCoordinates = polygonFeautures.map(x => x.geometry.coordinates);
            // CLOSE SETTINGS
            firstDraw = false;
            prevZoom = zoom;
            renderer.render(container);
        }, pixiContainer);
    })();
    polygonOverlay.addTo(map);
    const bounds = geoBounds({ type: 'MultiPolygon', coordinates: [scaledCoordinates] });
    map.fitBounds([[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]]);
}

export default usePolygonOverlay;