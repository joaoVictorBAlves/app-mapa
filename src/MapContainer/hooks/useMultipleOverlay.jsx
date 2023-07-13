import "leaflet"
import "leaflet-pixi-overlay";
import { geoBounds } from 'd3-geo';
import * as d3 from "d3";
import "pixi.js";
let scaledCoordinates = null;

const useMultipleOverlay = (
  map,
  polygonData,
  markerData,
  polygonVariable,
  markerVariable,
  polygonMapScale,
  markerMapScale,
  setDetails,
  setLocation,
  setFocusPolygon
) => {
  const multipleOverlay = (() => {
    let firstDraw = true;
    let prevZoom;

    // INSTANCIANDO OS POLÍGONOS
    const polygonsByGeojson = [];
    const polygonFeautures = [];

    polygonData.forEach((feauture, i) => {
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

    // INSTANCIANDO OS MARCADORES
    const circleCenters = markerData.map(properties => {
      return properties.geometry.coordinates;
    });
    const circleProperties = markerData.map(feature => {
      return feature.properties[markerVariable]
    })
    let projectedCenters;
    let circleRadius = 10;

    const circles = markerData.map((feature) => {
      return new PIXI.Graphics();
    });

    [...circles].forEach((geo) => {
      geo.interactive = true;
      geo.cursor = 'pointer';
    });

    // CRIANDO PIXI CONTEINER E ADICIONANDO POLIGONOS E MARCADORES
    const pixiContainer = new PIXI.Container();
    polygonsByGeojson.forEach((geo) => { geo.interactive = true });
    pixiContainer.addChild(...polygonsByGeojson);
    pixiContainer.interactive = true;
    pixiContainer.buttonMode = true;
    circles.forEach(circle => {
      pixiContainer.addChild(circle);
    });
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
          let valor = polygonVariable ? polygonFeautures[i].properties[polygonVariable] : 0;
          properties = polygonVariable ? polygonFeautures[i].properties[polygonVariable] : 0;
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
          const color = polygonVariable ? parseInt(polygonMapScale(properties).replace("#", ""), 16) : 0x96C7FF;
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
      // DESENHOS DOS MARCADORES
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
          let value = markerVariable ? data[i].properties[markerVariable] : null;
          console.log(value)
          value = Array.isArray(value) ? Array.isArray(value[0]) ? value[0][0] : value[0] : value
          if (!isNaN(value))
            value = parseFloat(value);
          let color = value ? markerMapScale(value) : '#92C5DE';
          color = color.replace('#', '');
          circle.clear();
          circle.lineStyle(3 / scale, parseInt(color, 16), 0);
          circle.beginFill(parseInt(color, 16), 1);
          circle.x = projectedCenters[i].x;
          circle.y = projectedCenters[i].y;
          circle.drawCircle(0, 0, 10 / scale);
          circle.endFill();
          if (markerVariable)
            circle.popup = L.popup()
              .setLatLng(circleCenters[i])
              .setContent(Array.isArray(circleProperties[i]) ? `${circleProperties[i]}` : circleProperties[i]);
        });
      }
      // CLOSE SETTINGS
      firstDraw = false;
      prevZoom = zoom;
      renderer.render(container);
    }, pixiContainer)

  })();
  multipleOverlay.addTo(map);
  const bounds = geoBounds({ type: 'MultiPolygon', coordinates: [scaledCoordinates] });
  map.fitBounds([[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]]);
}

export default useMultipleOverlay;