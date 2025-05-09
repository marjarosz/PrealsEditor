import { generateUUID } from "three/src/math/MathUtils";

export interface IDrawObject {

    /**
     * UUID
     */
    readonly uuid: string;

    /**
     * Rodzic
     */
    drawObjectParent: IDrawObject | undefined;

    renderOrder: number;

}

export class DrawObject implements IDrawObject {

    public readonly uuid: string = generateUUID();

    public drawObjectParent: IDrawObject | undefined;

    renderOrder: number = 1;

}