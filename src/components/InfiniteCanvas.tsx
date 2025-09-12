import { useState, useRef, useEffect } from "react";
import Textbox from "./Textbox";
import ContextMenu from "./ContextMenu";
import { getStroke } from "perfect-freehand";

type Pos = {
  x: number;
  y: number;
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

function InfiniteCanvas({ selectedOption, setSelectedOption }: Props) {
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);

  const contextRef = useRef<HTMLDivElement>(null);
  const [contextPos, setContextPos] = useState<Pos | null>(null);
  const [contextTargetIndex, setContextTargetIndex] = useState<number | null>(
    null
  );

  const isPanning = useRef<boolean>(false);
  const panOffset = useRef<Pos>({ x: 0, y: 0 });

  const [textboxes, setTextboxes] = useState<Box[]>([]);

  const [points, setPoints] = useState<[any, any, any][]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const drawing = useRef<boolean>(false);

  const startPan = (e: React.MouseEvent) => {
    e.stopPropagation();

    window.addEventListener("mousemove", pan);
    window.addEventListener("mouseup", stopPan);

    panOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    isPanning.current = true;
  };

  const pan = (e: MouseEvent) => {
    if (!isPanning) return;
    setPos({
      x: e.clientX - panOffset.current.x,
      y: e.clientY - panOffset.current.y,
    });
  };

  const stopPan = () => {
    isPanning.current = false;
    window.removeEventListener("mousemove", pan);
    window.removeEventListener("mouseup", stopPan);
  };

  const getSvgPathFromStroke = (stroke: number[][]): string => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  };

  const options = {
    size: 16,
    smoothing: 0.54,
    thinning: 0.11,
    streamline: 0.5,
    easing: (t: number) => t,
    start: {
      taper: 0,
      cap: true,
    },
    end: {
      taper: 0,
      cap: true,
    },
  };

  function handlePointerDown(e: any) {
    e.target.setPointerCapture(e.pointerId);
    setPoints([[e.clientX - pos.x, e.clientY - pos.y, e.pressure]]);
    drawing.current = true;
  }

  function handlePointerMove(e: any) {
    if (e.buttons !== 1) return;
    setPoints([...points, [e.clientX - pos.x, e.clientY - pos.y, e.pressure]]);
  }

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setContextPos({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    setContextTargetIndex(index);
  };

  const deleteTextbox = () => {
    if (contextTargetIndex !== null) {
      setTextboxes((prev) =>
        prev.filter((_, index) => index !== contextTargetIndex)
      );
      setContextPos(null);
      setContextTargetIndex(null);
    }
  };

  const addTextbox = (e: React.MouseEvent) => {
    const posx = e.clientX - 50;
    const posy = e.clientY - 50;

    setTextboxes((prev) => [
      ...prev,
      { x: posx - pos.x, y: posy - pos.y, width: 100, height: 100 },
    ]);

    setSelectedOption("mouse");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        contextRef.current &&
        !contextRef.current.contains(e.target as Node)
      ) {
        setContextPos(null);
        setContextTargetIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`${
        selectedOption === "text" ? "cursor-text" : ""
      } w-screen h-screen overflow-hidden`}
    >
      <div
        className="relative"
        style={{
          width: 5000,
          height: 5000,
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "0, 0",
        }}
        onClick={(e) => {
          switch (selectedOption) {
            case "text":
              addTextbox(e);
          }
        }}
        onMouseDown={(e) => {
          switch (selectedOption) {
            case "pan":
              startPan(e);
          }
        }}
      >
        {textboxes.map((box, i) => (
          <Textbox
            key={i}
            props={box}
            handleContextMenu={(e) => handleContextMenu(e, i)}
          />
        ))}
        {contextPos && (
          <ContextMenu
            pos={contextPos}
            ref={contextRef}
            onDelete={deleteTextbox}
          />
        )}
        <svg
          onPointerDown={(e) => {
            if (selectedOption !== "pen") return;
            handlePointerDown(e);
          }}
          onPointerMove={(e) => {
            if (selectedOption !== "pen") return;
            handlePointerMove(e);
          }}
          onPointerUp={() => {
            setPaths([...paths, pathData]);
            drawing.current = false;
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            pointerEvents: selectedOption === "pen" ? "auto" : "none",
          }}
        >
          {drawing && <path d={pathData} />}
          {paths.map((e, i) => (
            <path d={e} key={i} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default InfiniteCanvas;
