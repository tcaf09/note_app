import { useState } from "react";
import Toolbar from "../components/Toolbar";
import InfiniteCanvas from "@/components/InfiniteCanvas";

function Note() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [colour, setColour] = useState<string>("#E0E0E0");
  const [penSizes, setPenSizes] = useState<number[]>([4, 4, 4, 4]);
  const [colours, setColours] = useState<string[]>([
    "#E0E0E0",
    "#6CA0DC",
    "#E07A5F",
    "#7FB069",
  ]);

  return (
    <>
      <Toolbar
        selected={selectedOption}
        setSelected={setSelectedOption}
        setColour={setColour}
        colour={colour}
        colours={colours}
        penSizes={penSizes}
        setPenSizes={setPenSizes}
        setColours={setColours}
      />
      <InfiniteCanvas
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        colour={colour}
        colours={colours}
        penSizes={penSizes}
      />
    </>
  );
}

export default Note;
