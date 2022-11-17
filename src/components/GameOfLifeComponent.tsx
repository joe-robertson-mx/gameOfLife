import { ReactElement, createElement, useEffect, useState, useRef, useLayoutEffect } from "react";
import * as wasm from "wasm-game-of-life-joerob319";
import { Universe, Cell, wasm_memory } from "wasm-game-of-life-joerob319";

export interface GameOfLifeComponentProps {
    CellSize: number;
    GridColour: string;
    DeadColour: string;
    AliveColour: string;
}

export function GameOfLifeComponent({
    CellSize,
    GridColour,
    DeadColour,
    AliveColour
}: GameOfLifeComponentProps): ReactElement {
    const [universe, setUniverse] = useState<Universe>();
    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [isPaused, setIsPaused] = useState<boolean>(true);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    let animationId: number;

    const initiateWasm = async () => {
        wasm.default().then(() => {
            setUniverse(wasm.Universe.new());
        });
    };

    useEffect(() => {
        initiateWasm();
    }, []);

    useEffect(() => {
        if (universe) {
            setWidth(universe!.width());
            setHeight(universe!.height());
            const canvas = canvasRef.current!;

            if (universe.height()) {
                canvas.height = universe.height() * (CellSize + 1);
                setHeight(universe.height());
            }

            if (universe.width()) {
                canvas.width = universe.width() * (CellSize + 1);
                setWidth(universe.width());
            }
        }
    }, [universe]);

    useLayoutEffect(() => {
        if (!isPaused) {
            renderLoop();
            return () => cancelAnimationFrame(animationId!);
        } else {
            if (animationId) {
                cancelAnimationFrame(animationId!);
            }
        }
    }, [isPaused]);

    const drawGrid = () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        ctx.beginPath();
        ctx.strokeStyle = GridColour;

        // Vertical lines.
        for (let i = 0; i <= width!; i++) {
            ctx.moveTo(i * (CellSize + 1) + 1, 0);
            ctx.lineTo(i * (CellSize + 1) + 1, (CellSize + 1) * height! + 1);
        }

        // Horizontal lines.
        for (let j = 0; j <= height!; j++) {
            ctx.moveTo(0, j * (CellSize + 1) + 1);
            ctx.lineTo((CellSize + 1) * width! + 1, j * (CellSize + 1) + 1);
        }

        ctx.stroke();
    };

    const getIndex = (row: number, column: number) => {
        return row * width! + column;
    };

    const drawCells = () => {
        const cellsPtr = universe!.cells();
        const memory = wasm_memory();
        const cells = new Uint8Array(memory.buffer, cellsPtr, width! * height!);
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        ctx.beginPath();

        for (let row = 0; row < height!; row++) {
            for (let col = 0; col < width!; col++) {
                const idx = getIndex(row, col);

                ctx.fillStyle = cells[idx] === Cell.Dead ? DeadColour : AliveColour;

                ctx.fillRect(col * (CellSize + 1) + 1, row * (CellSize + 1) + 1, CellSize, CellSize);
            }
        }

        ctx.stroke();
    };

    const renderLoop = () => {
        universe!.tick();
        drawGrid();
        drawCells();

        animationId = requestAnimationFrame(renderLoop);
    };

    const btnClick = () => {
        setIsPaused(prevState => !prevState);
    };

    const addPointClick = (event: React.MouseEvent<HTMLCanvasElement>): void => {
        event.preventDefault();
        if (canvasRef.current!) {
            const node = canvasRef.current;
            const boundingRect = node.getBoundingClientRect();
            const scaleX = node.width! / boundingRect.width;
            const scaleY = node.height! / boundingRect.height!;

            const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
            const canvasTop = (event.clientY - boundingRect.top) * scaleY;

            const row = Math.min(Math.floor(canvasTop / (CellSize + 1)), height! - 1);
            const col = Math.min(Math.floor(canvasLeft / (CellSize + 1)), width! - 1);

            universe!.toggle_cell(row, col);

            drawGrid();
            drawCells();
        }
    };

    return (
        <div>
            <canvas ref={canvasRef} onClick={addPointClick} />
            <div className="btnContainer">
                <button onClick={btnClick} className="btn mx-button">
                    {isPaused ? "▶" : "⏸"}
                </button>
            </div>
        </div>
    );
}
