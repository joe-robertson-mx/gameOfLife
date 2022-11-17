/**
 * This file was generated from GameOfLife.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";

export interface GameOfLifeContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    CellSize: number;
    GridColour: string;
    DeadColour: string;
    AliveColour: string;
}

export interface GameOfLifePreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    CellSize: number | null;
    GridColour: string;
    DeadColour: string;
    AliveColour: string;
}
