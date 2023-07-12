import MapContainer from "@/MapContainer";
import data from "../data/Multiple.json"
import MultipleMapContainer from "@/MultipleMapContainer";

const Home = () => {
  let isMultiple = false;

  if (Object.keys(data)[0] = 'markers') {
    isMultiple = true;
  }

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