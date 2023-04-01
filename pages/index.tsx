import { useState, useRef, useEffect, ChangeEvent, MouseEvent } from "react";
import Head from "next/head";

type Perspective = [number, number];
type Stroke = [number, number];
type StrokeHistory = Stroke[];

const CANVAS_WIDTH: number = 800;
const CANVAS_HEIGHT: number = 600;

function Home(): JSX.Element {
  const [perspective, setPerspective] = useState<Perspective>([0, 0]);
  const [strokeHistory, setStrokeHistory] = useState<StrokeHistory>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.beginPath();
    context.moveTo(
      CANVAS_WIDTH / 2 + perspective[0],
      CANVAS_HEIGHT / 2 + perspective[1]
    );

    strokeHistory.forEach((stroke) => {
      context.lineTo(stroke[0], stroke[1]);
      context.stroke();
    });
  }, [perspective, strokeHistory]);

  /**
   * Handles changes to the perspective input fields and updates the perspective state.
   * @param e - The change event from the input field.
   */
  const handlePerspectiveChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const index = name === "perspectiveX" ? 0 : 1;
    setPerspective((prev) => {
      const newPerspective = [...prev];
      newPerspective[index] = Number(value);
      return newPerspective as Perspective;
    });
  };

  /**
   *
   * @param e Mouse event when a user clicks on the canvas element.
   * @returns void
   */
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();

    setStrokeHistory((prev) => [...prev, [x, y]]);
  };

  /**
   * Clears the canvas and resets the stroke history.
   * @returns void
   */
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.beginPath();
    context.moveTo(
      CANVAS_WIDTH / 2 + perspective[0],
      CANVAS_HEIGHT / 2 + perspective[1]
    );
    setStrokeHistory([]);
  };

  /**
   * Returns to the last stroke drawn on the canvas, soft clearing parts the canvas.
   * @returns void
   */
  const handleUndoStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.beginPath();
    context.moveTo(
      CANVAS_WIDTH / 2 + perspective[0],
      CANVAS_HEIGHT / 2 + perspective[1]
    );

    const newStrokeHistory = [...strokeHistory];
    newStrokeHistory.pop();
    setStrokeHistory(newStrokeHistory);

    newStrokeHistory.forEach((stroke) => {
      context.lineTo(stroke[0], stroke[1]);
      context.stroke();
    });
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `perspective-${Math.floor(Math.random() * 1000)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDrawRandomly = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const x = Math.floor(Math.random() * CANVAS_WIDTH);
    const y = Math.floor(Math.random() * CANVAS_HEIGHT);

    context.lineTo(x, y);
    context.stroke();

    setStrokeHistory((prev) => [...prev, [x, y]]);
  };

  return (
    <>
      <Head>
        <title>2D Drawing</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">2D Perspective Drawing</h1>
        <div className="flex flex-col items-center mb-4">
          <label htmlFor="perspectiveX" className="mb-2">
            X:
          </label>
          <input
            type="range"
            name="perspectiveX"
            min="-200"
            max="200"
            value={perspective[0]}
            onChange={handlePerspectiveChange}
            className="mb-4 w-full sm:w-auto"
          />
          <label htmlFor="perspectiveY" className="mb-2">
            Y:
          </label>
          <input
            type="range"
            name="perspectiveY"
            min="-200"
            max="200"
            value={perspective[1]}
            onChange={handlePerspectiveChange}
            className="mb-4 w-full sm:w-auto"
          />
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border border-gray-400 w-full sm:w-auto"
          onMouseDown={handleMouseDown}
        />
        <div className="flex flex-wrap justify-center mt-8 w-full">
          <button
            onClick={handleUndoStroke}
            className="mr-2 mb-2 px-4 py-2 bg-gray-500 text-white rounded cursor-pointer hover:bg-gray-600 focus:bg-gray-600 w-full sm:w-auto"
          >
            Undo
          </button>
          <button
            onClick={handleDrawRandomly}
            className="mr-2 mb-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 focus:bg-green-600 w-full sm:w-auto"
          >
            Random
          </button>
          <button
            onClick={handleSaveImage}
            className="mr-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 focus:bg-blue-600 w-full sm:w-auto"
          >
            Save
          </button>

          <button
            onClick={handleClearCanvas}
            className="mr-2 mb-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 focus:bg-red-600 w-full sm:w-auto"
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
