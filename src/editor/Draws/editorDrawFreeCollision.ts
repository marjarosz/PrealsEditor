
import { IEditorEdge } from "../Edges/editorEdge";

export interface IEditorDrawFreeCollision {

}

export class EditorDrawFreeCollision {

    constructor(protected edges: IEditorEdge[]) {

    }


    checkCollisonFromDrawEdges(tempEdge: IEditorEdge){

        for(const e of this.edges) {
            
        }

    }

}