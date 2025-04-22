import { Vector2 } from "three";
import { IEditorEdge } from "../Edges/editorEdge";
import { EditorWall, IEditorWall } from "../Wall/editorWall";
import { EditorLayer, IEditorLayer } from "./editorLayer";
import { EditorMath } from "../../Utility/editorMath";
import { IDrawTrack } from "../Draws/drawTrack";
import { ArrayUtility } from "../../Utility/arrayUtility";




export interface IEditorDrawLayer extends IEditorLayer {

    getEdgesByCommonPoint(point: Vector2): IEditorEdge[];

    devicedEdges: IEditorEdge[];

    fromDevidedEdges: IEditorEdge[];
}

export class EditorDrawLayer extends EditorLayer implements IEditorDrawLayer {

    public renderOrder: number = 20;

    protected walls: IEditorWall[] = [];

    protected edges: IEditorEdge[] = [];

    public devicedEdges: IEditorEdge[] = [];
    public fromDevidedEdges: IEditorEdge[] = [];

    get layerObjects(){
        return this.walls;
    }

    addLayerObject(wall: IEditorWall): void {
        

        /**
         * Sprawdz czy nie trzeba podzielic scian
         * Sprawdzenie przeciecia
         * Jezeli jest przeciecie i punkt rozni sie od
         * punktu poczatkowego lub koncowego
         * to dzieli sciany
         */

        this.devicedEdges.length = 0;
        this.fromDevidedEdges.length = 0;

        const toChange: {edge: IEditorEdge, point: Vector2} [] = [];

        for(const e of this.edges) {
            for(const we of wall.edges) {
                const points = e.intersectionWithEdgePoint(we);

                if(points.length > 0) {

                    //czy punkt jest rozny od poczatkowego lub koncowego
                    for(const cp of points) {
                        if(!EditorMath.equalsVectors(cp, e.startPoint, EditorMath.TOLERANCE_0_10) && !EditorMath.equalsVectors(cp, e.endPoint, EditorMath.TOLERANCE_0_10)){

                            /**
                             * Punkt poczatkowy lub koncowy
                             */

                            if(EditorMath.equalsVectors(we.startPoint, cp, EditorMath.TOLERANCE_0_10)) {
                                toChange.push({edge:e, point: we.startPoint});
                            }
                            
                            if(EditorMath.equalsVectors(we.endPoint, cp, EditorMath.TOLERANCE_0_10)) {
                                toChange.push({edge:e, point: we.endPoint});
                            }
                        }
                    }

                }
            }
            
        }

        this.walls.push(wall);
        this.edges.push(...wall.edges);

        console.log(toChange.length)
        /**
         * Podziel krawedzie
         */
        for(const dEdge of toChange) {

            const newEdges = dEdge.edge.devide(dEdge.point);
            this.edges.push(...newEdges);
            this.fromDevidedEdges.push(...newEdges);
            for(const ne of newEdges) {
                const newWall = new EditorWall();
                newWall.addEdge(ne);
                this.walls.push(newWall);
            }

            /**
             * Usun krawedzie
             */
            ArrayUtility.removeItemFromArray(this.edges, dEdge.edge);

            /**
             * Usun sciany
             */

            for(const uuid of dEdge.edge.containetInUuids) {
                ArrayUtility.removeItemByFieldValue(this.walls, 'uuid', uuid);
            }

            this.devicedEdges.push(dEdge.edge);
            
        }

        

    }

    getEdgesByCommonPoint(point: Vector2): IEditorEdge[] {
        
        return this.edges.filter(x=>EditorMath.equalsVectors(x.startPoint, point, EditorMath.TOLERANCE_0_10) || EditorMath.equalsVectors(x.endPoint, point, EditorMath.TOLERANCE_0_10))
    }

    setDrawTrack(drawTrack: IDrawTrack): void {
        for(const e of this.edges) {
            drawTrack.addTrackingEdge(e);
            drawTrack.addTrackingPoint(e.startPoint);
            drawTrack.addTrackingPoint(e.endPoint);
        }
    }

}