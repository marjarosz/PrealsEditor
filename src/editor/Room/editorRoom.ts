import { Vector2 } from "three";
import { IEditorWall } from "../Wall/editorWall";
import { IUniquePoints, UniquePoints } from "../../Utility/uniquePoints";
import {Earcut} from "three/src/extras/Earcut"
import { EditorMath } from "../../Utility/editorMath";
export interface IEditorRoom {

    walls: IEditorWall[];

    readonly uniquePointers: Vector2[];

    addWalls(walls: IEditorWall[]): void;

    pointInRoom(point: Vector2, includeEdge: boolean ): boolean
    
}

export class EditorRoom implements IEditorRoom {

    walls: IEditorWall[] = [];

    private _uniquePointers: IUniquePoints<Vector2> = new UniquePoints<Vector2>();

    private _triangls: number[] = [];

    get uniquePointers() {
        return this._uniquePointers.points;
    }

    addWalls(walls: IEditorWall[]): void {
        for(const w of walls) {
            
            this.walls.push(w);
            for(const ed of w.edges) {

                this._uniquePointers.addPoint(ed.startPoint);
                this._uniquePointers.addPoint(ed.endPoint);

            }
            
        }

        const triangulateData: number[] = [];
        for(const p of this._uniquePointers.points) {
            triangulateData.push(p.x);
            triangulateData.push(p.y);
        }

        this._triangls = Earcut.triangulate(triangulateData, [], 2);
    }

    pointInRoom(point: Vector2, includeEdge: boolean = false): boolean {
        
        if(this._triangls.length % 3 == 0){

            for(let i = 0; i<this._triangls.length; i+=3 ){
 
         
                const inTr = EditorMath.pointInTrianangle(
                    this._uniquePointers.points[this._triangls[i]], 
                    this._uniquePointers.points[this._triangls[i+1]], 
                    this._uniquePointers.points[this._triangls[i+2]], 
                    point);

                if(inTr && !includeEdge){
                    
                    const e1 = EditorMath.pointOnLineSegment(this._uniquePointers.points[this._triangls[i]], this._uniquePointers.points[this._triangls[i+1]], point);
                    const e2 = EditorMath.pointOnLineSegment(this._uniquePointers.points[this._triangls[i+1]], this._uniquePointers.points[this._triangls[i+2]], point);
                    const e3 = EditorMath.pointOnLineSegment(this._uniquePointers.points[this._triangls[i+2]], this._uniquePointers.points[this._triangls[i]], point);

                    if(e1 || e2 || e3) {
                        return false;
                    }
                    
                    return true;
                }

                
            }

        }


        return false;
    }

}