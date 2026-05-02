import SoundCard from "./components/SoundCard";
import { sounds } from "./data/sounds";

function App() {
  return sounds.map((s) => <SoundCard {...s} />);
}

export default App;
