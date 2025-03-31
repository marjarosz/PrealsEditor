import { generateUUID } from "three/src/math/MathUtils";
import { IEditorEdge } from "../Edges/editorEdge";
import { ILayerObject } from "../Layers/layerObject";

export interface IEditorWall extends ILayerObject{

    edges: IEditorEdge[];

    uuid: string;
}


export class EditorWall implements IEditorWall {

    edges: IEditorEdge[] = [];

    uuid: string;

    constructor(){

        this.uuid = generateUUID();

    }

    

}