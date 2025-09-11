import { useState } from "react";
import Toolbar from "../components/Toolbar";
import InfiniteCanvas from "@/components/InfiniteCanvas";


function Note() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [colour, setColour] = useState<string | null>(null);

  return (
    <>
      <Toolbar selected={selectedOption} setSelected={setSelectedOption} setColour={setColour}/>
      <InfiniteCanvas selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
    </>
  );
}

export default Note;
