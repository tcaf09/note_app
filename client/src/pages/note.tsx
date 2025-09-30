import { useState } from "react";
import Toolbar from "../components/Toolbar";
import InfiniteCanvas from "@/components/InfiniteCanvas";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Note() {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<string>("mouse");
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
      <div
        className="absolute top-4 left-4 p-3 text-white text-2xl bg-stone-950 rounded-lg cursor-pointer z-50"
        onClick={() => navigate("/dashboard")}
      >
        <FaHome />
      </div>
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
