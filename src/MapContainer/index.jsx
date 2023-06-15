import { Box } from "@mui/material";
import Filters from "./filters/index";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import useProcessProperties from "./hooks/useProcessProperties";
const Map = dynamic(() => import("./Map"), {
    ssr: false
});

const MapContainer = ({ data, agrouped = 'mean' }) => {
    const propsVariables = Object.keys(data[0].properties).filter((item, index) => {
        return item;
    });

    const valueOfProperties = {};
    const questions = Object.keys(data[0].properties);
    questions.forEach((question) => {
        valueOfProperties[question] = data.map((feature) => {
            return useProcessProperties(feature.properties, question, agrouped);
        });
    });

    // STATES
    const [variable, setVariable] = useState();
    const [scaleMethod, setScaleMethod] = useState();
    const [scaleColor, setScaleColor] = useState();

    return (
        <Box sx={
            {
                display: "flex",
                flexDirection: "row",
                width: "100%"
            }
        }>
            <Box className="filters" sx={
                {
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 0.15,
                    zIndex: -1
                }
            }>
                <Filters
                    data={data}
                    scaleColor={scaleColor}
                    scaleMethod={scaleMethod}
                    variable={variable}
                    setScaleColor={setScaleColor}
                    setScaleMethod={setScaleMethod}
                    setVariable={setVariable}
                    propsVariables={propsVariables}
                    valueOfProperties={valueOfProperties}
                />
            </Box>
            <Box sx={{
                width: "100%",
                display: "flex",
                flexGrow: 0.85,
                zIndex: -2
            }
            }>
                <Map
                    data={data}
                    agrouped={agrouped}
                    valueOfProperties={valueOfProperties}
                    variable={variable}
                    scaleMethod={scaleMethod}
                    scaleColor={scaleColor}
                />
            </Box>
        </Box >
    )
}

export default MapContainer;