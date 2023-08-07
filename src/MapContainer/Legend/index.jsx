import { KeyboardArrowDown, KeyboardArrowUp, LegendToggleRounded } from "@mui/icons-material";
import Style from "../Map.module.css"
import { useEffect, useState } from "react";
import * as d3 from "d3";

const Legend = ({ type, set, data, scaleMethod, variable, mapScale, typeMap, variableDistribution }) => {
    const [hidden, setHidden] = useState(true);
    const [intervals, setIntervals] = useState();
    const [colors, setColors] = useState();
    useEffect(() => {
        if (mapScale)
            if (type !== "mode") {
                if (mapScale) {
                    const groupedValues = d3.group(
                        set.sort((a, b) => a - b),
                        (value) => mapScale(value)
                    );
                    let values = []
                    groupedValues.forEach((group) => {
                        values.push(
                            `${parseFloat(group[0]).toFixed(2)}${group[0] !== group[group.length - 1]
                                ? " - " + parseFloat(group[group.length - 1]).toFixed(2)
                                : ""
                            }`
                        );
                    });
                    setIntervals(values);
                    const intervalColors = [...groupedValues.entries()].map(([color]) => color);
                    setColors(intervalColors);
                }
            } else {
                if (!variableDistribution) {
                    const categories = Array.from(new Set(set));
                    setIntervals(categories)
                    setColors(categories.map(category => mapScale(category)))
                } else {
                    const quantities = [];

                    data.forEach(item => {
                        let count = 0;
                        let resps = item.properties[variable].flat();
                        resps.forEach(resp => {
                            if (resp === variableDistribution)
                                count++;
                        });
                        quantities.push(count)
                    });

                    console.log(quantities)

                    const groupedValues = d3.group(
                        quantities.sort((a, b) => a - b),
                        (value) => mapScale(value)
                    );
                    let values = []
                    groupedValues.forEach((group) => {
                        values.push(
                            `${parseFloat(group[0]).toFixed(2)}${group[0] !== group[group.length - 1]
                                ? " - " + parseFloat(group[group.length - 1]).toFixed(2)
                                : ""
                            }`
                        );
                    });
                    setIntervals(values);
                    const intervalColors = [...groupedValues.entries()].map(([color]) => color);
                    setColors(intervalColors);
                }
            }
    }, [mapScale])


    // VALORES DAS LEGENDAS

    return (
        <div className={`${Style.info} ${Style.legend}`}>
            <div className={Style.legendHeader}>
                <h4>
                    Legendas
                </h4>
                <button className={`${Style.legendHidden}`} onClick={() => { setHidden(!hidden) }}>
                    {hidden && <KeyboardArrowDown />}
                    {!hidden && <KeyboardArrowUp />}
                </button>
            </div>
            {typeMap &&
                <p style={{ marginTop: 0 }}>
                    {typeMap}
                </p>
            }
            <div style={{ marginTop: "10px" }}>
                {(hidden && intervals) && intervals.map((value, i) => (
                    <>
                        <i style={{
                            background:
                                colors[i]
                        }}></i >
                        {value}< br />
                    </>
                ))}
            </div>
        </div >
    );
};

export default Legend;