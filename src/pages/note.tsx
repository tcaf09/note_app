import { useState } from "react";
import Toolbar from "../components/Toolbar";
import InfiniteCanvas from "@/components/InfiniteCanvas";


function Note() {
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <>
      <Toolbar selected={selectedOption} setSelected={setSelectedOption} />
      <InfiniteCanvas selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
    </>
  );
}

export default Note;
