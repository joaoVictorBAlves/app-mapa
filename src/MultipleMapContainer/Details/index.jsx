import { useState } from "react";
import Style from "../Map.module.css";
import * as d3 from "d3";

const Details = ({ type, title, place, detail, agrouped }) => {
    const [data, setData] = useState();

    if (agrouped === "mode") {
        if (Array.isArray(detail)) {
            const flattenedArray = detail.flat();
            const uniqueArray = [...new Set(flattenedArray)];
            const itemCounts = {};

            flattenedArray.forEach((item) => {
                itemCounts[item] = itemCounts[item] ? itemCounts[item] + 1 : 1;
            });

            detail = uniqueArray.map((item) => `(${item}) - ${itemCounts[item]} ${itemCounts[item] != 1 ? "respostas" : "resposta"}`);
        }
    } else {
        if (Array.isArray(detail)) {
            if (agrouped === "mean") {
                detail = [d3.mean(detail)];
            } else if (agrouped === "sum") {
                detail = [d3.sum(detail)];
            } else {
                detail = [detail.length];
            }
        }
    }

    return (
        <div className={Style.info}>
            <h3>{title}</h3>
            <p>
                {place ? <b>{place}</b> : type === "polygons" ? "Hover over a place" : "Click over a markers"}
            </p>
            {detail && (
                <p className={Style.detail}>
                    {detail && detail.map((item) =>
                        <>
                            <span key={item}>
                                {item}
                            </span>
                            <br />
                        </>
                    )}
                    <br />
                    <strong>{agrouped && `(${agrouped})`}</strong>
                </p>
            )}
        </div>
    );
};

export default Details;
