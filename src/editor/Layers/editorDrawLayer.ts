import { Vector2 } from "three";
import { IEditorEdge } from "../Edges/editorEdge";
import { IEditorWall } from "../Wall/editorWall";
import { EditorLayer, IEditorLayer } from "./editorLayer";
import { EditorMath } from "../../Utility/editorMath";


export interface IEditorDrawLayer extends IEditorLayer {

    getEdgesByCommonPoint(point: Vector2): IEditorEdge[];

}

export class EditorDrawLayer extends EditorLayer implements IEditorDrawLayer {

    public renderOrder: number = 20;

    protected walls: IEditorWall[] = [];

    protected edges: IEditorEdge[] = [];

    get layerObjects(){
        return this.walls;
    }

    addLayerObject(wall: IEditorWall): void {
        
        this.walls.push(wall);
        this.edges.push(...wall.edges);

    }

    getEdgesByCommonPoint(point: Vector2): IEditorEdge[] {
        
        return this.edges.filter(x=>EditorMath.equalsVectors(x.startPoint, point, EditorMath.TOLERANCE_0_10) || EditorMath.equalsVectors(x.endPoint, point, EditorMath.TOLERANCE_0_10))
    }

}