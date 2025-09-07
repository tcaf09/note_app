type Pos = {
  x: number;
  y: number;
};

function ContextMenu({ pos }: { pos: Pos }) {
  return (
    <div
      className="absolute bg-stone-900"
      style={{
        left: pos.x,
        top: pos.y,
        width: 150,
        height: 60
      }}
    ></div>
  );
}

export default ContextMenu;
