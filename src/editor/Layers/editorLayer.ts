import { generateUUID } from "three/src/math/MathUtils";
import { EditorLayerGroup, IEditorLayerGroup } from "./editorLayerGroup";

export interface IEditorLayer {

    readonly uuid: string;

    readonly group: IEditorLayerGroup;

    renderOrder:number;
}


export class EditorLayer implements IEditorLayer {

    public readonly uuid:string = generateUUID();

    public readonly group: IEditorLayerGroup = new EditorLayerGroup();

    public renderOrder: number = 1;

    constructor(){
        
    }

}