import { generateUUID } from "three/src/math/MathUtils";
import { EditorLayerGroup, IEditorLayerGroup } from "./editorLayerGroup";
import { ILayerObject } from "./layerObject";

export interface IEditorLayer {

    readonly uuid: string;

    readonly group: IEditorLayerGroup;

    renderOrder:number;

    addLayerObject(object: ILayerObject):void;
}


export class EditorLayer  {

    public readonly uuid:string = generateUUID();

    public readonly group: IEditorLayerGroup = new EditorLayerGroup();

    public renderOrder: number = 1;

    constructor(){
        
    }

}