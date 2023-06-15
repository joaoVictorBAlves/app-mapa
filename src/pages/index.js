import MapContainer from "@/MapContainer";
import data from "../data/exMarkers.json"

const Home = () => {
  return (
    <MapContainer data={data} />
  )
}

export default Home;