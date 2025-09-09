import React, { useEffect, useRef, useState } from "react";
import Textbox from "../components/Textbox";
import Toolbar from "../components/Toolbar";
import ContextMenu from "@/components/ContextMenu";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Pos = {
  x: number;
  y: number;
};

function Note() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textboxes, setTextboxes] = useState<Box[]>([]);
  const [contextPos, setContextPos] = useState<Pos | null>(null);
  const [contextTargetIndex, setContextTargetIndex] = useState<number | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);

  const addTextbox = (e: React.MouseEvent) => {
    const posx = e.clientX - 50;
    const posy = e.clientY - 50;

    setTextboxes((prev) => [
      ...prev,
      { x: posx, y: posy, width: 100, height: 100 },
    ]);

    setSelectedOption("mouse");
  };

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    setContextPos({ x: e.clientX, y: e.clientY})
    setContextTargetIndex(index);
  }

  const deleteTextbox = () => {
    if (contextTargetIndex !== null) {
      setTextboxes(prev => 
        prev.filter((_, index) => index !== contextTargetIndex)
      );
      setContextPos(null);
      setContextTargetIndex(null);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextPos(null);
        setContextTargetIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div
        className={`${selectedOption === "text" ? "cursor-text" : ""} w-screen h-screen`}
        onClick={(e) => {
          switch (selectedOption) {
            case "text":
              addTextbox(e);
          }
        }}
      >
        {textboxes.map((box, i) => (
          <Textbox key={i} props={box} handleContextMenu={(e) => handleContextMenu(e, i)}/>
        ))}
      </div>
      <Toolbar selected={selectedOption} setSelected={setSelectedOption} />
      {contextPos && <ContextMenu pos={contextPos} ref={contextRef} onDelete={deleteTextbox}/>}
    </>
  );
}

export default Note;
