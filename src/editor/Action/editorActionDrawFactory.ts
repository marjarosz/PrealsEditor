import { Vector2 } from "three";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { IEditorDraw } from "../Draws/editorDraw";
import { EditorDrawFree } from "../Draws/editorDrawFree";
import { IDrawTrack } from "../Draws/drawTrack";

export enum EditorDrawType  {
    
    free = 0,
    rectangleCorner = 1,
    rectangleCenter = 2,
    circleCorner = 3,
    circleCenter = 4


}


export interface IEditorActionDrawFactory {

    getEditorDrawType(type: EditorDrawType, raycaster: IEditorRaycaster, drawTrack:IDrawTrack, layer: IEditorLayer, resolution: Vector2, scale: number, zoom:number): IEditorDraw

}

export class EditorActionDrawFactory implements IEditorActionDrawFactory{

    getEditorDrawType(type: EditorDrawType, raycaster: IEditorRaycaster, drawTrack:IDrawTrack, layer: IEditorLayer, resolution: Vector2, scale: number, zoom:number): IEditorDraw{
        return new EditorDrawFree(raycaster, drawTrack, layer, resolution,scale, zoom);
    }
}