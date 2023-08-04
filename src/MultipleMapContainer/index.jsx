import { Box } from "@mui/material";
import Filters from "./filters/index";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useProcessProperties from "./hooks/useProcessProperties";
import MultipleFilters from "./filters/MultipleFilters";

const Map = dynamic(() => import("./Map"), {
    ssr: false
});

const MultipleMapContainer = ({ data, agrouped = 'mean' }) => {
    const markerVariables = Object.keys(data.markers[0].properties).filter((item, index) => {
        return item;
    });

    const polygonVariables = Object.keys(data.polygons[0][0].properties).filter((item, index) => {
        return item;
    });

    const markerValueOfProperties = {};
    markerVariables.forEach((variable) => {
        markerValueOfProperties[variable] = data.markers.map((marker) => {
            return useProcessProperties(marker.properties, variable, agrouped);
        });
    });


    const polygonValueOfProperties = {};
    polygonVariables.forEach((variable) => {
        polygonValueOfProperties[variable] = data.polygons[0].map((polygon) => {
            return useProcessProperties(polygon.properties, variable, agrouped);
        });
    });


    // STATES
    const [markerVariable, setMarkerVariable] = useState();
    const [polygonVariable, setPolygonVariable] = useState();
    const [markerScaleMethod, setMarkerScaleMethod] = useState("quantize");
    const [polygonScaleMethod, setPolygonScaleMethod] = useState("quantize");
    const [markerScaleColor, setMarkerScaleColor] = useState("sequencial");
    const [polygonScaleColor, setPolygonScaleColor] = useState("sequencial");

    useEffect(() => {
        console.log("poligonos escala cor: " + polygonScaleColor)
        console.log("poligonos escala metodo: " + polygonScaleMethod)
    }, [polygonScaleColor, polygonScaleMethod])

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%"
            }}
        >
            <Box
                className="filters"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 0.15,
                    zIndex: -1
                }}
            >
                <MultipleFilters
                    markerScaleColor={markerScaleColor}
                    markerScaleMethod={markerScaleMethod}
                    markerVariable={markerVariable}
                    propsMarkersVariables={markerVariables}
                    valueOfMarkersProperties={markerValueOfProperties}
                    polygonScaleColor={polygonScaleColor}
                    polygonScaleMethod={polygonScaleMethod}
                    polygonVariable={polygonVariable}
                    propsPolygonVariables={polygonVariables}
                    valueOfPolygonProperties={polygonValueOfProperties}
                    setMarkerScaleColor={setMarkerScaleColor}
                    setMarkerScaleMethod={setMarkerScaleMethod}
                    setMarkerVariable={setMarkerVariable}
                    setPolygonScaleColor={setPolygonScaleColor}
                    setPolygonScaleMethod={setPolygonScaleMethod}
                    setPolygonVariable={setPolygonVariable}
                />
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexGrow: 0.85,
                    zIndex: -2
                }}
            >
                <Map
                    markerData={data.markers}
                    polygonData={data.polygons[0]}
                    polygonAgrouped={agrouped}
                    valueOfMarkerProperties={markerValueOfProperties}
                    valueOfPolygonProperties={polygonValueOfProperties}
                    markerVariable={markerVariable}
                    polygonVariable={polygonVariable}
                    markerScaleMethod={markerScaleMethod}
                    polygonScaleMethod={polygonScaleMethod}
                    markerScaleColor={markerScaleColor}
                    polygonScaleColor={polygonScaleColor}
                />
            </Box>
        </Box>
    )
}

export default MultipleMapContainer;
