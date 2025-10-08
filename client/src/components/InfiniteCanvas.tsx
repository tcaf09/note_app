import React, { useState, useRef, useEffect, useCallback } from "react";
import Textbox from "./Textbox";
import ContextMenu from "./ContextMenu";
import { getStroke } from "perfect-freehand";
import { useParams } from "react-router-dom";
import { type JSONContent } from "@tiptap/react";
import { v4 as uuid } from "uuid";

type Pos = {
  x: number;
  y: number;
};

type Box = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number | "auto";
  content: JSONContent;
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
  colours: string[];
  penSizes: number[];
};

function InfiniteCanvas({
  selectedOption,
  setSelectedOption,
  colour,
  colours,
  penSizes,
}: Props) {
  const authToken = localStorage.getItem("token");
  const { id } = useParams<{ id: string }>();
  const isInitialLoad = useRef<boolean>(true);

  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);

  const contextRef = useRef<HTMLDivElement>(null);
  const [contextPos, setContextPos] = useState<Pos | null>(null);
  const [contextTargetIndex, setContextTargetIndex] = useState<string | null>(
    null
  );

  const isPanning = useRef<boolean>(false);
  const panOffset = useRef<Pos>({ x: 0, y: 0 });

  const [textboxes, setTextboxes] = useState<Box[]>([]);
  const [boxesToSave, setBoxesToSave] = useState<Box[]>([]);
  const [boxesToDelete, setBoxesToDelete] = useState<Box[]>([]);

  const [points, setPoints] = useState<[number, number, number][]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [pathsToSave, setPathsToSave] = useState<Path[]>([]);
  const [pathsToDelete, setPathsToDelete] = useState<Path[]>([]);
  const drawing = useRef<boolean>(false);

  const saveNote = useCallback(
    async (
      pathsToSave: Path[],
      boxesToSave: Box[],
      boxesToDelete: Box[],
      pathsToDelete: Path[]
    ) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          body: JSON.stringify({
            pathsToSave,
            boxesToSave,
            pathsToDelete,
            boxesToDelete,
          }),
        }
      );

      if (!res.ok) throw new Error("Error saving note");
      setPathsToSave([]);
      setBoxesToSave([]);
      setBoxesToDelete([]);
      setPathsToDelete([]);
    },
    [id, authToken]
  );

  function resetGestures(e?: React.PointerEvent) {
    drawing.current = false;

    if (isPanning.current) {
      window.removeEventListener("pointermove", pan);
      window.removeEventListener("pointerup", stopPan);
      isPanning.current = false;
    }
    setPoints([]);

    if (e) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        return;
      }
    }
  }

  const startPan = (e: React.PointerEvent) => {
    e.stopPropagation();

    window.addEventListener("pointermove", pan);
    window.addEventListener("pointerup", stopPan);

    panOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    isPanning.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const pan = (e: PointerEvent) => {
    if (!isPanning.current || drawing.current) return;
    e.stopPropagation();

    const newX = e.clientX - panOffset.current.x;
    const newY = e.clientY - panOffset.current.y;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const canvasWidth = 5000;
    const canvasHeight = 5000;

    const clampedX = Math.min(0, Math.max(newX, viewportWidth - canvasWidth));
    const clampedY = Math.min(0, Math.max(newY, viewportHeight - canvasHeight));

    setPos({ x: clampedX, y: clampedY });
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
    size: penSizes[colours.indexOf(colour)] * 4,
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
    if (e.buttons !== 1 || e.pointerType === "touch") return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setPoints([[e.clientX - pos.x, e.clientY - pos.y, e.pressure]]);
    drawing.current = true;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1 || e.pointerType === "touch") return;
    setPoints((prev) => [
      ...prev,
      [e.clientX - pos.x, e.clientY - pos.y, e.pressure],
    ]);
  }

  const handlePointerUp = () => {
    const stroke = getStroke(points, options);
    const completedPathData = getSvgPathFromStroke(stroke);
    setPaths((prev) => {
      const newPaths = [
        ...prev,
        { path: completedPathData, colour: colour, points: points },
      ];
      return newPaths;
    });
    setPathsToSave((prev) => {
      const newPaths = [
        ...prev,
        { path: completedPathData, colour: colour, points: points },
      ];
      return newPaths;
    });
    setPoints([]);
    drawing.current = false;
  };

  function handleEraserMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;

    const x = e.clientX - pos.x;
    const y = e.clientY - pos.y;

    const deletedPaths: Path[] = [];
    const remainingPaths: Path[] = [];

    paths.forEach((p) => {
      const isHit = p.points.some(([px, py]) => {
        const dx = px - x;
        const dy = py - y;
        return Math.sqrt(dx * dx + dy * dy) < 20; // 20px eraser radius
      });
      if (isHit) {
        deletedPaths.push(p);
      } else {
        remainingPaths.push(p);
      }
    });

    setPaths(remainingPaths);
    setPathsToDelete((prev) => [...prev, ...deletedPaths]);
  }

  const handleContextMenu = (e: React.MouseEvent, index: string) => {
    e.stopPropagation();
    e.preventDefault();
    setContextPos({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    setContextTargetIndex(index);
  };

  const deleteTextbox = () => {
    if (contextTargetIndex !== null) {
      setTextboxes((prev) => prev.filter((b) => b.id !== contextTargetIndex));
      setBoxesToDelete((prev) => {
        const box = textboxes.find((b) => b.id);
        if (box) {
          return [...prev, box];
        } else {
          return prev;
        }
      });
      setContextPos(null);
      setContextTargetIndex(null);
    }
  };

  const addTextbox = (e: React.MouseEvent) => {
    const posx = e.clientX - 50;
    const posy = e.clientY - 50;
    const id = uuid();
    const newBox: Box = {
      id,
      x: posx - pos.x,
      y: posy - pos.y,
      width: 100,
      height: "auto",
      content: { type: "doc", content: [] },
    };

    setTextboxes((prev) => [...prev, newBox]);
    setBoxesToSave((prev) => [...prev, newBox]);
    setSelectedOption("mouse");
  };

  function updateBoxContent(id: string, content: JSONContent) {
    setTextboxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, content: content } : box))
    );
    setBoxesToSave((prev) => {
      const exists = prev.find((b) => b.id === id);
      if (exists) {
        return prev.map((box) =>
          box.id === id ? { ...box, content: content } : box
        );
      } else {
        const fullBox = textboxes.find((b) => b.id === id);
        if (!fullBox) return prev;

        return [...prev, { ...fullBox, content }];
      }
    });
  }

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

  useEffect(() => {
    async function loadNote() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + authToken,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Error loading note");

        const data = await res.json();
        setPaths(data.paths);
        setTextboxes(data.textboxes);
      } catch (err) {
        console.log(err);
      }
    }

    loadNote();
  }, [id, authToken]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    if (
      pathsToSave.length === 0 &&
      boxesToSave.length === 0 &&
      boxesToDelete.length === 0 &&
      pathsToDelete.length === 0
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      saveNote(pathsToSave, boxesToSave, boxesToDelete, pathsToDelete);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [boxesToSave, pathsToSave, boxesToDelete, pathsToDelete, saveNote]);

  const stroke = getStroke(points, options);
  const pathData = getSvgPathFromStroke(stroke);

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
          if (selectedOption === "text") {
            addTextbox(e);
          }
        }}
        onPointerDown={(e) => {
          if (selectedOption === "pan") {
            startPan(e);
          }
        }}
      >
        {textboxes.map((box) => (
          <Textbox
            key={box.id}
            props={box}
            handleContextMenu={(e) => handleContextMenu(e, box.id)}
            onChange={updateBoxContent}
            onResize={(id, updates) => {
              setTextboxes((prev) =>
                prev.map((box) =>
                  box.id === id ? { ...box, ...updates } : box
                )
              );
              setBoxesToSave((prev) => {
                const exists = prev.find((box) => box.id === id);
                if (exists) {
                  return prev.map((box) =>
                    box.id === id ? { ...box, ...updates } : box
                  );
                } else {
                  const existingBox = textboxes.find((box) => box.id === id);
                  if (existingBox) {
                    return [...prev, { ...existingBox, ...updates }];
                  } else {
                    return prev;
                  }
                }
              });
            }}
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
            if (e.pointerType === "pen" && selectedOption !== "eraser") {
              resetGestures(e);
              setSelectedOption("pen");
              handlePointerDown(e);
            } else if (selectedOption === "pen" && e.pointerType === "mouse") {
              resetGestures(e);
              handlePointerDown(e);
            } else if (e.pointerType === "touch") {
              resetGestures(e);
              setSelectedOption("pan");
              startPan(e);
            }
          }}
          onPointerMove={(e) => {
            if (selectedOption === "pen" && drawing.current) {
              handlePointerMove(e);
            } else if (selectedOption === "eraser") {
              handleEraserMove(e);
            }
          }}
          onPointerUp={(e) => {
            if (selectedOption === "pen" && drawing.current) {
              handlePointerUp();
            }
            resetGestures(e);
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
            pointerEvents: selectedOption === "mouse" ? "none" : "auto",
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
