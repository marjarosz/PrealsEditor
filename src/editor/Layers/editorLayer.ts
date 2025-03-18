import { generateUUID } from "three/src/math/MathUtils";

export interface IEditorLayer {

    readonly uuid: string;
}


export class EditorLayer implements IEditorLayer {

    readonly uuid:string = generateUUID();

    constructor(){
        
    }

}