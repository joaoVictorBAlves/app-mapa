import Style from "../Map.module.css"
import * as d3 from "d3"

const Details = ({ type, title, place, detail, agrouped }) => {
    return (
        <div className={Style.info}>
            <h3>{title}</h3>
            <p>{place ? <b>{place}</b> : type === "polygons" ? "Hover over a place" : "Click over a markers"}</p>
            {detail && <p className={Style.detail}>{Array.isArray(detail) ? d3.mode(detail) : detail} {(agrouped) ? `(${agrouped})` : ""}</p>}
        </div>
    );
}

export default Details;