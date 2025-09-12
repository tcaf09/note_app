import { useState } from "react";
import Toolbar from "../components/Toolbar";
import InfiniteCanvas from "@/components/InfiniteCanvas";

function Note() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [colour, setColour] = useState<string>("#E0E0E0");

  return (
    <>
      <Toolbar
        selected={selectedOption}
        setSelected={setSelectedOption}
        setColour={setColour}
        colour={colour}
      />
      <InfiniteCanvas
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        colour={colour}
      />
    </>
  );
}

export default Note;
