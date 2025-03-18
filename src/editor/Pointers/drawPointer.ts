/**
 * Znacznik punktow
 */

import { Color, Group, Vector2 } from "three";
import { IDrawObject } from "../drawObject";


export interface IPointerGroup extends Group {
    pointerParent?: IDrawPointer;
}

export class PointerGroup extends Group implements IPointerGroup{

    pointerParent?: IDrawPointer;
}

export interface IDrawPointer extends IDrawObject{

    /**
     * Grupa mopdeli dla zancznika
     */
    readonly pointerGroup: IPointerGroup;

    /**
     * 
     * Rysuj znacznik
     * 
     * @param resolution 
     */
    draw(resolution?: Vector2): void;

    /**
     * 
     * Aktualizacja zoom
     * 
     * @param zoom 
     * @param resolution 
     */
    updateZoom(zoom: number, resolution?: Vector2): void;

    /**
     * 
     * Aktualizacja punktu startowego 
     * Wg tego punktu rysowany jest kwadrat / okrag
     * 
     * @param sPoint 
     * @param resolution 
     */
    updateStartPoint(sPoint: Vector2, resolution: Vector2): void;

    /**
     * 
     * Ustaw kolor wypelnienia
     * 
     * @param color 
     */
    setFillColor(color: number): void;

    /**
     * Widocznosc
     */
    vissible: boolean;

    /**
     * Punkt startowy
     */
    sPoint: Vector2;

    /**
     * Kolor wypelnienia
     */
    fillColor: Color;

    /**
     * Obiekt krawedzi
     */
   // edgeObject?: IEdgeOfShape

    /**
     * Skala pointera
     */
    scaleMultiple: number;

    /**
     * Zwolni
     */
    dispose(): void;

    /**
     * Klonuj
     */
    clone(): IDrawPointer

}