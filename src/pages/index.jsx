import MapContainer from "@/MapContainer";
import data from "../data/exPolygons.json"
import MultipleMapContainer from "@/MultipleMapContainer";
import { useEffect } from "react";

const Home = () => {
  let isMultiple = false;

  useEffect(() => {
    if (Object.keys(data)[0] = 'markers') {
      isMultiple = true;
    }
  }, [data])

  if (isMultiple) {
    return (
      <MultipleMapContainer data={data} agrouped="mean" />
    )
  } else {
    return (
      <MapContainer data={data} agrouped="mean" />
    )
  }

}

export default Home;