import { IEditorWall } from "../Wall/editorWall";
import { EditorLayer, IEditorLayer } from "./editorLayer";


export interface IEditorDrawLayer extends IEditorLayer {

    

}

export class EditorDrawLayer extends EditorLayer implements IEditorDrawLayer {

    public renderOrder: number = 20;

    protected walls: IEditorWall[] = [];

    get layerObjects(){
        return this.walls;
    }

    addLayerObject(wall: IEditorWall): void {
        
        this.walls.push(wall);

    }

}