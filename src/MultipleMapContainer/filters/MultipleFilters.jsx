import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { ColorLens, ManageSearchRounded, Straighten } from "@mui/icons-material";
import { useEffect, useState } from "react";

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

const Filters = ({
    markerScaleColor,
    markerScaleMethod,
    markerVariable,
    propsMarkersVariables,
    valueOfMarkersProperties,
    polygonScaleColor,
    polygonScaleMethod,
    polygonVariable,
    propsPolygonVariables,
    valueOfPolygonProperties,
    setMarkerScaleColor,
    setMarkerScaleMethod,
    setMarkerVariable,
    setPolygonScaleColor,
    setPolygonScaleMethod,
    setPolygonVariable,
    variableDistribution,
    setVariableDistribution
}) => {
    const [polygonAgrouped, setPolygonAgrouped] = useState();
    const [markersAgrouped, setMarkersAgrouped] = useState()

    useEffect(() => {
        if (polygonVariable)
            if (!valueOfPolygonProperties[polygonVariable].every(isNumeric))
                setPolygonAgrouped("mode");
            else
                setPolygonAgrouped("numerical");
        setVariableDistribution(null)
    }, [polygonVariable]);

    useEffect(() => {
        if (markerVariable)
            if (!valueOfMarkersProperties[markerVariable].every(isNumeric))
                setMarkersAgrouped("mode");
            else
                setMarkersAgrouped("numerical");
    }, [markerVariable]);

    return (
        <Drawer
            variant="permanent"
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List className="properties-select">
                    <ListItem>
                        <LocationOnOutlinedIcon
                            style={{ marginLeft: 5, marginTop: 18, marginRight: 1 }}
                            fontSize="medium" />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="select-variable-label">
                                Marcadores
                            </InputLabel>
                            <Select
                                labelId="select-variable-label"
                                id="select-variable-input"
                                value={markerVariable}
                                onChange={(e) => {
                                    setMarkerScaleColor("sequencial");
                                    setMarkerScaleMethod("quantize");
                                    setMarkerVariable(e.target.value)
                                }}
                            >
                                {propsMarkersVariables.map((prop) => (
                                    <MenuItem key={prop} value={prop}>{prop}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                </List>
                {(markerVariable !== undefined && markersAgrouped === "numerical") && (
                    <List>
                        <ListItem style={{ display: "flex" }}>
                            <Straighten
                                style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }}
                                fontSize="medium"
                            />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-marker-method-label">Método</InputLabel>
                                <Select
                                    labelId="select-marker-method-label"
                                    id="select-marker-method-input"
                                    value={markerScaleMethod}
                                    onChange={(e) => {
                                        setMarkerScaleMethod(e.target.value);
                                    }}
                                    label="Choropleth"
                                >
                                    <MenuItem key="quantile" value="quantile">
                                        Quantile
                                    </MenuItem>
                                    <MenuItem key="quantize" value="quantize">
                                        Quantize
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem style={{ display: "flex" }}>
                            <ColorLens
                                style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }}
                                fontSize="medium"
                            />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-marker-palette-label">Paleta</InputLabel>
                                <Select
                                    labelId="select-marker-palette-label"
                                    id="select-marker-palette-input"
                                    value={markerScaleColor}
                                    onChange={(e) => {
                                        setMarkerScaleColor(e.target.value);
                                    }}
                                    label="Paleta"
                                >
                                    <MenuItem key="sequencial" value="sequencial">
                                        Sequencial
                                    </MenuItem>
                                    <MenuItem key="divergente" value="divergente">
                                        Divergente
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                    </List>
                )}
                <Divider />
                <List className="properties-select">
                    <ListItem>
                        <MapOutlinedIcon style={{ marginLeft: 5, marginTop: 18, marginRight: 1 }} fontSize="medium" />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="select-variable-label">Polígonos</InputLabel>
                            <Select
                                labelId="select-variable-label"
                                id="select-variable-input"
                                value={polygonVariable}
                                onChange={(e) => {
                                    setPolygonScaleColor("sequencial");
                                    setPolygonVariable(e.target.value);
                                }}
                            >
                                {propsPolygonVariables.map((prop) => (
                                    <MenuItem key={prop} value={prop}>
                                        {prop}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                    {polygonVariable !== undefined && polygonAgrouped === "mode" && (
                        <ListItem>
                            <ManageSearchRounded style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }} fontSize="medium" />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-marker-method-label">Destacar valor</InputLabel>
                                <Select
                                    labelId="select-marker-method-label"
                                    id="select-marker-method-input"
                                    value={variableDistribution}
                                    onChange={(e) => {
                                        setVariableDistribution(e.target.value);
                                    }}
                                    label="Choropleth"
                                >
                                    <MenuItem key="0" value={"null"}>
                                        Nenhum
                                    </MenuItem>
                                    {valueOfPolygonProperties[polygonVariable].map((value, index) => (
                                        <MenuItem key={"value" + index} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </ListItem>
                    )}
                </List>

                {(polygonVariable !== undefined && polygonAgrouped === "numerical") && (
                    <List>
                        <ListItem style={{ display: "flex" }}>
                            <Straighten
                                style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }}
                                fontSize="medium"
                            />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-polygon-method-label">Método</InputLabel>
                                <Select
                                    labelId="select-polygon-method-label"
                                    id="select-polygon-method-input"
                                    value={polygonScaleMethod}
                                    onChange={(e) => {
                                        setPolygonScaleMethod(e.target.value);
                                    }}
                                    label="Choropleth"
                                >
                                    <MenuItem key="quantile" value="quantile">
                                        Quantile
                                    </MenuItem>
                                    <MenuItem key="quantize" value="quantize">
                                        Quantize
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem style={{ display: "flex" }}>
                            <ColorLens
                                style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }}
                                fontSize="medium"
                            />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-polygon-palette-label">Paleta</InputLabel>
                                <Select
                                    labelId="select-polygon-palette-label"
                                    id="select-polygon-palette-input"
                                    value={polygonScaleColor}
                                    onChange={(e) => {
                                        setPolygonScaleColor(e.target.value);
                                    }}
                                    label="Paleta"
                                >
                                    <MenuItem key="sequencial" value="sequencial">
                                        Sequencial
                                    </MenuItem>
                                    <MenuItem key="divergente" value="divergente">
                                        Divergente
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                    </List>
                )}
            </Box>
        </Drawer >
    );
}

export default Filters;