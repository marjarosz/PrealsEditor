import { Vector2 } from "three";
import { IEditorWall } from "../Wall/editorWall";
import { IUniquePoints, UniquePoints } from "../../Utility/uniquePoints";
import { EditorMath } from "../../Utility/editorMath";

export namespace RoomUtility {


    export function checkWallsGeometry(walls: IEditorWall[]){

        const uniquePointers:IUniquePoints<Vector2> = new UniquePoints<Vector2>();

        for (const w of walls) {

            for(const e of w.edges) {
                uniquePointers.addPoint(e.startPoint);
                uniquePointers.addPoint(e.endPoint);
            }

        }

        return checkRoomPointsGeometry(uniquePointers.points, walls);

    }

    export function checkRoomPointsGeometry(uniquePoints: Vector2[], walls: IEditorWall[]){

        for(const p of uniquePoints) {
        
            let counts: number = 0;
            for(const w of walls) {
        
                for(const e of w.edges) {
                    if(EditorMath.equalsVectors(p, e.startPoint) || EditorMath.equalsVectors(p, e.endPoint)) {
                         ++counts;
                    }
                }
            }
            if(counts > 2) {
                return false;
            }
        }
        
        return true;
    }

}