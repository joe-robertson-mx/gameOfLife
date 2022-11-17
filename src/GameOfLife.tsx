import { ReactElement, createElement } from "react";
import { GameOfLifeComponent } from "./components/GameOfLifeComponent";
import { GameOfLifeContainerProps } from "../typings/GameOfLifeProps";

import "./ui/GameOfLife.css";

export function GameOfLife({ CellSize, GridColour, DeadColour, AliveColour }: GameOfLifeContainerProps): ReactElement {
    return (
        <GameOfLifeComponent
            CellSize={CellSize}
            GridColour={GridColour}
            DeadColour={DeadColour}
            AliveColour={AliveColour}
        />
    );
}
