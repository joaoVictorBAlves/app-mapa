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
        let projectedCenters;

        let circleRadius = 12;

        const circles = data.map((feature) => {
            return new PIXI.Graphics();
        });

        [...circles].forEach((geo) => {
            geo.interactive = true;
            geo.cursor = 'pointer';
        });

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
            }
            if (firstDraw || prevZoom !== zoom) {
                circles.forEach((circle, i) => {
                    circle.clear();
                    circle.lineStyle(3 / scale, 0xff0000, 0);
                    circle.beginFill(0xff0033, 1);
                    circle.x = projectedCenters[i].x;
                    circle.y = projectedCenters[i].y;
                    circle.drawCircle(0, 0, circleRadius * 0.0009 / scale);
                    circle.endFill();
                    circle.popup = L.popup()
                        .setLatLng(circleCenters[i])
                        .setContent('I am a circle.');
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