import { generateUUID } from "three/src/math/MathUtils";
import { IEditorEdge } from "../Edges/editorEdge";
import { ILayerObject } from "../Layers/layerObject";

export interface IEditorWall extends ILayerObject{

    edges: IEditorEdge[];
    uuid: string;

    addEdge(edge: IEditorEdge): void
}


export class EditorWall implements IEditorWall {

    edges: IEditorEdge[] = [];

    uuid: string;

    constructor(){

        this.uuid = generateUUID();

    }

    addEdge(edge: IEditorEdge): void {
        this.edges.push(edge);
        edge.containetInUuids.push(this.uuid);
    }
    

}