import { Vector2 } from "three";

export interface IPrimitivePoints {

    points: Vector2[];

}

export class PrimitivePoints implements IPrimitivePoints{

    public points: Vector2[] = [];

}