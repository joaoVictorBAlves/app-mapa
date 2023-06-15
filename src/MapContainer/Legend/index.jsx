import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Style from "../Map.module.css"
import { memo, useEffect, useState } from "react";
import * as d3 from "d3";

const Legend = ({ type, set, scaleColor, scaleMethod }) => {
    const [values, setValues] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [palete, setPalete] = useState([]);
    const [keys, setKeys] = useState();
    let colors = null;
    let mapScale;
    // SCALES AND PALETE
    useEffect(() => {
        // PALETA DE CORES
        if (type === "polygons") {
            if (scaleColor === "sequencial") {
                colors = [0x96C7FF, 0x3693FF, 0x564BF, 0x063973];
                setPalete(['#96C7FF', '#3693FF', '#0564BF', '#063973']);
            } else if (scaleColor === "divergente") {
                colors = [0xF73946, 0xFF6E77, 0x3693FF, 0x1564BF];
                setPalete(['#F73946', '#FF6E77', '#3693FF', '#1564BF']);
            }
        }
        if (type === "markers") {
            if (scaleColor === "sequencial") {
                colors = ["baixo", "medioBaixo", "medioAlto", "alto"];
                setPalete(['#96c7ff', '#3693ff', '#0564bf', '#063973']);
            } else if (scaleColor === "divergente") {
                colors = ["vermelho", "vermelhoMedio", "azul-medio", "azul"];
                setPalete(['#f73946', '#ff6e77', '#3693ff', '#1564bf']);
            }
        }
        if (scaleMethod === "quantile") {
            mapScale = d3.scaleQuantile()
                .domain(set.sort((a, b) => a - b))
                .range(colors);
        }
        if (scaleMethod === "quantize") {
            mapScale = d3.scaleQuantize()
                .domain([d3.min(set.sort((a, b) => a - b)), d3.max(set.sort((a, b) => a - b))])
                .range(colors);
        }
        // VALORES DAS LEGENDAS
        const groupedValues = d3.group(
            set.sort((a, b) => a - b),
            (value) => mapScale(value)
        );
        let auxValues = []
        groupedValues.forEach((group) => {
            auxValues.push(
                `${parseFloat(group[0]).toFixed(2)}${group[0] !== group[group.length - 1]
                    ? " - " + parseFloat(group[group.length - 1]).toFixed(2)
                    : ""
                }`
            );
        });
        setValues(auxValues)
    }, [set, scaleColor, scaleMethod]);

    return (
        <div className={`${Style.info} ${Style.legend}`}>
            <div className={Style.legendHeader}>
                <h4>Legendas</h4>
                <button className={`${Style.legendHidden}`} onClick={() => { setHidden(!hidden) }}>
                    {hidden && <KeyboardArrowDown />}
                    {!hidden && <KeyboardArrowUp />}
                </button>
            </div>
            <div style={{ marginTop: "10px" }}>
                {hidden && values.map((value, i) => (
                    <>
                        <i style={{
                            background:
                                palete[i]
                        }}></i >
                        {value} < br />
                    </>
                ))}
            </div>
        </div >
    );
};

export default Legend;