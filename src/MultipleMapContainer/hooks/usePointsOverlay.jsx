import "leaflet"
import "leaflet-pixi-overlay";
import { geoBounds } from 'd3-geo';
import * as d3 from "d3";
import "pixi.js";

const usePointsOverlay = (map, data, variable, mapScale) => {
    const pixiOverlay = (() => {
        let firstDraw = true;
        let prevZoom;

        const circleCenters = data.map(properties => {
            return properties.geometry.coordinates;
        });
        const circleProperties = data.map(feature => {
            return feature.properties[variable]
        })
        let projectedCenters;

        let circleRadius = 10;

        const circles = data.map((feature) => {
            return new PIXI.Graphics();
        });

        [...circles].forEach((geo) => {
            geo.interactive = true;
            geo.cursor = 'pointer';
        });
        // AJUSTES NO ZOOM
        const markerGroup = L.featureGroup();
        circleCenters.forEach(coord => {
            L.marker(coord).addTo(markerGroup);
        });
        const bounds = markerGroup.getBounds();
        map.fitBounds(bounds);

        const pixiContainer = new PIXI.Container();
        circles.forEach(circle => {
            pixiContainer.addChild(circle);
        });

        return L.pixiOverlay((utils) => {
            const zoom = utils.getMap().getZoom();
            const container = utils.getContainer();
            const renderer = utils.getRenderer();
            const project = utils.latLngToLayerPoint;
            const scale = utils.getScale();

            if (firstDraw) {
                // INTERAÇÃO DE CLIQUE
                utils.getMap().on('click', (e) => {
                    // DEFINIÇÕES DE CLIQUE
                    let interaction = utils.getRenderer().plugins.interaction;
                    let pointerEvent = e.originalEvent;
                    let pixiPoint = new PIXI.Point();
                    interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY);
                    let target = interaction.hitTest(pixiPoint, container);
                    if (target && target.popup) {
                        target.popup.openOn(map);
                    }
                });
                projectedCenters = circleCenters.map(circle => project(circle));
                circleRadius = circleRadius / scale;

                const currentZoom = map.getZoom();
                const zoomOutLevel = currentZoom - 1;
                const zoomOutDuration = 1000;
                map.setZoom(zoomOutLevel, { duration: zoomOutDuration });

            }
            if (firstDraw || prevZoom !== zoom) {
                circles.forEach((circle, i) => {
                    let value = variable ? data[i].properties[variable] : null;
                    value = Array.isArray(value) ? Array.isArray(value[0]) ? value[0][0] : value[0] : value
                    if (!isNaN(value))
                        value = parseFloat(value);
                    let color = value ? mapScale(value) : '#92C5DE';
                    color = color.replace('#', '');
                    circle.clear();
                    circle.lineStyle(3 / scale, parseInt(color, 16), 0);
                    circle.beginFill(parseInt(color, 16), 1);
                    circle.x = projectedCenters[i].x;
                    circle.y = projectedCenters[i].y;
                    circle.drawCircle(0, 0, 10 / scale);
                    circle.endFill();
                    if (variable)
                        circle.popup = L.popup()
                            .setLatLng(circleCenters[i])
                            .setContent(Array.isArray(circleProperties[i]) ? `${circleProperties[i]}` : circleProperties[i]);
                });
            }
            firstDraw = false;
            prevZoom = zoom;
            renderer.render(container);
        }, pixiContainer);
    })();
    pixiOverlay.addTo(map);
}

export default usePointsOverlay;