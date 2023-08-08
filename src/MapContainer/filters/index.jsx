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

const Filters = ({ data, variable, scaleColor, scaleMethod, setVariable, setScaleColor, setScaleMethod, propsVariables, valueOfProperties, variableDistribution, setVariableDistribution }) => {
    const [agrouped, setAgrouped] = useState();
    useEffect(() => {
        if (variable)
            if (!valueOfProperties[variable].every(isNumeric))
                setAgrouped("mode");
            else
                setAgrouped("numerical");
        setVariableDistribution(null)
    }, [variable]);

    return (
        <Drawer
            variant="permanent"
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List className="properties-select">
                    <ListItem>
                        {data[0].typeResp === "polygons" &&
                            <MapOutlinedIcon
                                style={{ marginLeft: 5, marginTop: 18, marginRight: 1 }}
                                fontSize="medium"
                            />
                        }
                        {data[0].typeResp === "markers" &&
                            <LocationOnOutlinedIcon
                                style={{ marginLeft: 5, marginTop: 18, marginRight: 1 }}
                                fontSize="medium" />
                        }
                        {scaleMethod != "categorical" &&
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-variable-label">
                                    {data[0].typeResp === "polygons" ? "Poligonos" : "Marcadores"}
                                </InputLabel>
                                <Select
                                    labelId="select-variable-label"
                                    id="select-variable-input"
                                    value={variable}
                                    onChange={(e) => {
                                        setScaleColor("sequencial");
                                        setScaleMethod("quantize");
                                        setVariable(e.target.value)
                                    }}
                                >
                                    {propsVariables.map((prop) => (
                                        <MenuItem key={prop} value={prop}>{prop}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }
                    </ListItem>
                </List>
                <Divider />
                {(variable !== undefined && agrouped === "numerical") &&
                    <List>
                        <ListItem style={{ display: "flex" }}>
                            <Straighten style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }} fontSize="medium" />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-variable-label">Método</InputLabel>
                                <Select
                                    labelId="select-variable-label"
                                    id="select-variable-input"
                                    value={scaleMethod}
                                    onChange={(e) => { setScaleMethod(e.target.value) }}
                                    label="Choropleth"
                                >
                                    <MenuItem key={1} value={"quantile"}>Quantile</MenuItem>
                                    <MenuItem key={2} value={"quantize"}>Quantize</MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                        <ListItem style={{ display: "flex" }}>
                            <ColorLens style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }} fontSize="medium" />
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="select-variable-label">Paleta</InputLabel>
                                <Select
                                    labelId="select-variable-label"
                                    id="select-variable-input"
                                    value={scaleColor}
                                    onChange={(e) => { setScaleColor(e.target.value) }}
                                    label="Paleta"
                                >
                                    <MenuItem key={1} value={"sequencial"}>Sequencial</MenuItem>
                                    <MenuItem key={2} value={"divergente"} > Divergente</MenuItem>
                                </Select>
                            </FormControl>
                        </ListItem>
                    </List>
                }
                {(variable !== undefined && agrouped != "numerical" && data[0].typeResp === "polygons") && (
                    <List>
                        <ListItem style={{ display: "flex" }}>
                            <ManageSearchRounded
                                style={{ marginLeft: 20, marginTop: 18, marginRight: 5 }}
                                fontSize="medium"
                            />
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
                                    {[...new Set(valueOfProperties[variable])].map((value, index) => (
                                        <MenuItem key={"value" + index} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
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