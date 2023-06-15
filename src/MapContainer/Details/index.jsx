import Style from "../Map.module.css"

const Details = ({ type, title, place, detail, agrouped }) => {
    return (
        <div className={Style.info}>
            <h3>{title}</h3>
            <p>{place ? <b>{place}</b> : (type === "polygon") ? "Hover over a place" : "Click over a markers"}</p>
            {detail && <p className={Style.detail}>{detail}{(agrouped) ? `(${agrouped})` : ""}</p>}
        </div>
    );
}

export default Details;