import { useState } from "react";
import "./App.css";
import ChristmasScene from "./ChristmasScene";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ChristmasScene rabbitInterval={10} />
    </>
  );
}

export default App;
