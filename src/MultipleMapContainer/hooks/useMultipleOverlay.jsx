import "leaflet";
import "leaflet-pixi-overlay";
import { geoBounds } from 'd3-geo';
import * as d3 from "d3";
import "pixi.js";

const useMultipleOverlay = (map, data, markerVariable, polygonVariable, markerMapScale, polygonMapScale, setDetails, setLocation, setFocusPolygon) => {
  const markerOverlay = (() => {
    let firstDraw = true;
    let prevZoom;

    const markerCenters = data.markers.map(marker => marker.geometry.coordinates);
    const markerProperties = data.markers.map(marker => marker.properties[markerVariable]);

    let projectedCenters;
    let markerRadius = 10;

    const markers = data.markers.map(() => new PIXI.Graphics());

    [...markers].forEach((marker) => {
      marker.interactive = true;
      marker.cursor = 'pointer';
    });

    const markerGroup = L.featureGroup();
    markerCenters.forEach(coord => {
      L.marker(coord).addTo(markerGroup);
    });
    const bounds = markerGroup.getBounds();
    map.fitBounds(bounds);

    const pixiContainer = new PIXI.Container();
    markers.forEach(marker => {
      pixiContainer.addChild(marker);
    });

    return L.pixiOverlay((utils) => {
      const zoom = utils.getMap().getZoom();
      const container = utils.getContainer();
      const renderer = utils.getRenderer();
      const project = utils.latLngToLayerPoint;
      const scale = utils.getScale();

      if (firstDraw) {
        utils.getMap().on('click', (e) => {
          let interaction = utils.getRenderer().plugins.interaction;
          let pointerEvent = e.originalEvent;
          let pixiPoint = new PIXI.Point();
          interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY);
          let target = interaction.hitTest(pixiPoint, container);
          if (target && target.popup) {
            target.popup.openOn(map);
          }
        });

        projectedCenters = markerCenters.map(center => project(center));
        markerRadius = markerRadius / scale;

        const currentZoom = map.getZoom();
        const zoomOutLevel = currentZoom - 1;
        const zoomOutDuration = 1000;
        map.setZoom(zoomOutLevel, { duration: zoomOutDuration });
      }

      if (firstDraw || prevZoom !== zoom) {
        markers.forEach((marker, i) => {
          let value = markerVariable ? markerProperties[i] : null;
          value = Array.isArray(value) ? value[0] : value;
          if (!isNaN(value)) {
            value = parseFloat(value);
          }
          let color = value ? markerMapScale(value) : '#92C5DE';
          color = color.replace('#', '');
          marker.clear();
          marker.lineStyle(3 / scale, parseInt(color, 16), 0);
          marker.beginFill(parseInt(color, 16), 1);
          marker.x = projectedCenters[i].x;
          marker.y = projectedCenters[i].y;
          marker.drawCircle(0, 0, 10 / scale);
          marker.endFill();
          if (markerVariable) {
            marker.popup = L.popup()
              .setLatLng(markerCenters[i])
              .setContent(Array.isArray(markerProperties[i]) ? `${markerProperties[i]}` : markerProperties[i]);
          }
        });
      }

      firstDraw = false;
      prevZoom = zoom;
      renderer.render(container);
    }, pixiContainer);
  })();

  const polygonOverlay = (() => {
    let firstDraw = true;
    let prevZoom;

    const polygons = data.polygons.map(polygon => {
      const graphics = new PIXI.Graphics();

      let latLonCoordinates = [];

      polygon.forEach(coords => {
        latLonCoordinates.push([coords[1], coords[0]]);
        const point = project([coords[1], coords[0]]);
        if (coords === polygon[0]) {
          graphics.moveTo(point.x, point.y);
        } else {
          graphics.lineTo(point.x, point.y);
        }
      });

      graphics.interactive = true;
      graphics.buttonMode = true;
      graphics.on("mouseover", () => {
        setDetails(polygon.properties[polygonVariable]);
        setLocation(polygon.properties.nome_bairro);
        setFocusPolygon(latLonCoordinates);
      });

      return graphics;
    });

    const pixiContainer = new PIXI.Container();
    polygons.forEach(polygon => {
      pixiContainer.addChild(polygon);
    });

    return L.pixiOverlay((utils) => {
      const zoom = utils.getMap().getZoom();
      const container = utils.getContainer();
      const renderer = utils.getRenderer();
      const project = utils.latLngToLayerPoint;
      const scale = utils.getScale();

      if (firstDraw || prevZoom !== zoom) {
        polygons.forEach((polygon) => {
          let value = polygonVariable ? polygon.properties[polygonVariable] : 0;
          let properties = polygonVariable ? polygon.properties[polygonVariable] : 0;
          let numericProperties;

          if (polygonVariable) {
            if (Array.isArray(properties)) {
              if (Array.isArray(properties[0])) {
                properties = [].concat(...properties);
              }
              numericProperties = properties.map(prop => {
                if (!isNaN(parseFloat(prop))) {
                  return parseFloat(prop);
                }
                return false;
              });
              if (numericProperties[0] === true) {
                properties = numericProperties;
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

          const color = polygonVariable ? parseInt(polygonMapScale(properties).replace("#", ""), 16) : 0x96C7FF;
          const alpha = 1;

          polygon.clear();
          polygon.lineStyle(1 / scale, 0x000000, 1);
          polygon.beginFill(color, alpha);

          polygon.endFill();
        });
      }

      firstDraw = false;
      prevZoom = zoom;
      renderer.render(container);
    }, pixiContainer);
  })();

  markerOverlay.addTo(map);
  polygonOverlay.addTo(map);

  const bounds = geoBounds({
    type: 'MultiPolygon',
    coordinates: data.polygons.map(polygon => polygon.map(coords => coords.map(coord => [coord[1], coord[0]])))
  });
  map.fitBounds([[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]]);
}

export default useMultipleOverlay;
