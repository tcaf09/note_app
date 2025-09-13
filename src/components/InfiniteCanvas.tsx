import React, { useState, useRef, useEffect } from "react";
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

type Path = {
  path: string;
  colour: string;
  points: [number, number, number][];
};

type Props = {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  colour: string;
};

function InfiniteCanvas({ selectedOption, setSelectedOption, colour }: Props) {
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

  const [points, setPoints] = useState<[number, number, number][]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const drawing = useRef<boolean>(false);

  const startPan = (e: React.PointerEvent) => {
    e.stopPropagation();

    window.addEventListener("pointermove", pan);
    window.addEventListener("pointerup", stopPan);

    panOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    isPanning.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const pan = (e: PointerEvent) => {
    if (!isPanning.current) return;
    e.stopPropagation();

    setPos({
      x: e.clientX - panOffset.current.x,
      y: e.clientY - panOffset.current.y,
    });
  };

  const stopPan = (e?: PointerEvent) => {
    isPanning.current = false;
    window.removeEventListener("pointermove", pan);
    window.removeEventListener("pointerup", stopPan);

    if (e) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
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

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    setPoints([[e.clientX - pos.x, e.clientY - pos.y, e.pressure]]);
    drawing.current = true;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;
    setPoints([...points, [e.clientX - pos.x, e.clientY - pos.y, e.pressure]]);
  }

  const handlePointerUp = () => {
    setPaths([...paths, { path: pathData, colour: colour, points: points }]);
    setPoints([]);
    drawing.current = false;
  };

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

  function handleEraserMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;

    const x = e.clientX - pos.x;
    const y = e.clientY - pos.y;

    setPaths((prev) =>
      prev.filter(
        (p) =>
          !p.points.some(([px, py]) => {
            const dx = px - x;
            const dy = py - y;
            return Math.sqrt(dx * dx + dy * dy) < 20; // 20px eraser radius
          })
      )
    );
  }

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
          touchAction: "none",
        }}
        onClick={(e) => {
          switch (selectedOption) {
            case "text":
              addTextbox(e);
          }
        }}
        onPointerDown={(e) => {
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
            if (selectedOption === "pen") {
              handlePointerDown(e);
            }
          }}
          onPointerMove={(e) => {
            if (selectedOption === "pen") {
              handlePointerMove(e);
            } else if (selectedOption === "eraser") {
              handleEraserMove(e);
            }
          }}
          onPointerUp={handlePointerUp}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            pointerEvents:
              selectedOption === "pen" || selectedOption === "eraser"
                ? "auto"
                : "none",
          }}
        >
          {drawing && <path d={pathData} fill={colour} />}
          {paths.map((e, i) => (
            <path d={e.path} key={i} fill={e.colour} />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default InfiniteCanvas;
