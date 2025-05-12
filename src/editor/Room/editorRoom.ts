import { Group, Vector2 } from "three";
import { IEditorWall } from "../Wall/editorWall";
import { IUniquePoints, UniquePoints } from "../../Utility/uniquePoints";
import {Earcut} from "three/src/extras/Earcut"
import { EditorMath } from "../../Utility/editorMath";
import { generateUUID } from "three/src/math/MathUtils";
import { LineSegmentEdge } from "../Edges/lineSegmentEdge";
import { ArrayUtility } from "../../Utility/arrayUtility";
import { IEditorEdge } from "../Edges/editorEdge";
import { RoomUtility } from "./roomUtility";
export interface IEditorRoom {

    uuid: string;

    walls: IEditorWall[];

    midpointTriangls: Vector2[];

    readonly uniquePointers: Vector2[];

    readonly area: number;

    addWalls(walls: IEditorWall[]): void;

    pointInRoom(point: Vector2, includeEdge: boolean ): boolean

    getEdges(): IEditorEdge[];
    
}

export class EditorRoom implements IEditorRoom {

    uuid: string = generateUUID();

    walls: IEditorWall[] = [];

    group:Group = new Group();

    private _area: number = 0;

    private _midpoint: Vector2 = new Vector2();

    private _uniquePointers: IUniquePoints<Vector2> = new UniquePoints<Vector2>();

    private _triangls: number[] = [];

    private _midpointTriangls: Vector2[] = [];

    get midpointTriangls(){
        return this._midpointTriangls;
    }

    get uniquePointers() {
        return this._uniquePointers.points;
    }

    get area(){
        return this._area;
    }

    addWalls(walls: IEditorWall[]): void {


        
        const sorted = this.sortWalls(walls);

        for(const w of sorted) {
            
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
        this.calcualteAreaMidpoint();
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

    getEdges(): IEditorEdge[] {
        const edges: IEditorEdge[] = [];

        for(const w of this.walls) {
            edges.push(...w.edges);
        }

        return edges;
    }

    private calcualteAreaMidpoint(){

        this._midpointTriangls.length = 0;

        if(this._triangls.length % 3 == 0){

            this._area = 0;
            let xpg = 0;
            let ypg = 0;

            for(let i = 0; i<this._triangls.length; i+=3 ){
                const cgt = EditorMath.midpointTriangle(
                    this._uniquePointers.points[this._triangls[i]], 
                    this._uniquePointers.points[this._triangls[i+1]], 
                    this._uniquePointers.points[this._triangls[i+2]]
                    );

                this._midpointTriangls.push(cgt);

                const at = EditorMath.areaTriangle(
                    this._uniquePointers.points[this._triangls[i]], 
                    this._uniquePointers.points[this._triangls[i+1]], 
                    this._uniquePointers.points[this._triangls[i+2]]
                    );

                    this._area+= at;
                xpg += cgt.x * at;
                ypg += cgt.y * at;

            }

            // for(const ai of this.arcInside) {
            //     const cga  = EditorMath.centroidCircularSegment(ai.startPoint, ai.endPoint, ai.arcCenterPoint, ai.radius, ai.clockwise);
            //     const aa = EditorMath.areaCircularSegment(ai.startPoint, ai.endPoint, ai.arcCenterPoint, ai.radius, ai.clockwise);
               
            //     this._area -= aa;

            //     xpg -= cga.x * aa;
            //     ypg -= cga.y * aa;
                
            // }

            // for(const ao of this.arcOutside) {
            //     const cga  = EditorMath.centroidCircularSegment(ao.startPoint, ao.endPoint, ao.arcCenterPoint, ao.radius, ao.clockwise);
            //     const aa = EditorMath.areaCircularSegment(ao.startPoint, ao.endPoint, ao.arcCenterPoint, ao.radius, ao.clockwise);

             
            //     this._area += aa;

            //     xpg += cga.x * aa;
            //     ypg += cga.y * aa;

            // }

            this._midpoint.x = xpg / this._area;
            this._midpoint.y= ypg / this._area;


        }
    }

    public checkRoomGeometry(){

        return RoomUtility.checkRoomPointsGeometry(this._uniquePointers.points, this.walls)

        // for(const p of this._uniquePointers.points) {

        //     let counts: number = 0;
        //     for(const w of this.walls) {

        //         for(const e of w.edges) {
        //             if(EditorMath.equalsVectors(p, e.startPoint) || EditorMath.equalsVectors(p, e.endPoint)) {
        //                 ++counts;
        //             }
        //         }
        //     }
        //     if(counts > 2) {
        //         return false;
        //     }
        // }

        // return true;

    }

    private sortWalls(walls: IEditorWall[]){

        const sorted: IEditorWall[] = [];

        const source: IEditorWall[] = [...walls];

        //Dodaj pierwsza sciane
        sorted.push(walls[0]);
        source.splice(0, 1);

        let count = 0;

        const endPointStartPoint = (sortedWall: IEditorWall, sourceWall: IEditorWall)=>{
            if(EditorMath.equalsVectors(sortedWall.edges[0].endPoint, sourceWall.edges[0].startPoint) ) {
                return {isEq: true, break: false}
            }
            return {isEq: false, break: false}
        }

        const endPointEndPoint = (sortedWall: IEditorWall, sourceWall: IEditorWall)=>{
            if(EditorMath.equalsVectors(sortedWall.edges[0].endPoint, sourceWall.edges[0].endPoint) ) {
                return {isEq: true, break: true}
            }
            return {isEq: false, break: false}
        }

        const startPointEndPoint = (sortedWall: IEditorWall, sourceWall: IEditorWall)=>{
            if(EditorMath.equalsVectors(sortedWall.edges[0].startPoint, sourceWall.edges[0].endPoint) ) {
                return {isEq: true, break: false}
            }
            return {isEq: false, break: false}
        }

        const startPointStartPoint = (sortedWall: IEditorWall, sourceWall: IEditorWall)=>{
            if(EditorMath.equalsVectors(sortedWall.edges[0].startPoint, sourceWall.edges[0].startPoint) ) {
                return {isEq: true, break: false}
            }
            return {isEq: false, break: false}
        }

        let compareFunction = endPointStartPoint;

        while(sorted.length < walls.length){
            
            const toRemove: IEditorWall[] = [];
            for(const w of source) {
                //pobierz geometrie sciany
                
                const comp = compareFunction(sorted[sorted.length-1], w);

                if(comp.isEq) {
                    sorted.push(w);
                    toRemove.push(w);
                }

                if(comp.break) {
                    break;
                }
                
    
            }

            for(const r of toRemove) {
                ArrayUtility.removeItemFromArray(source, r);
            }

            switch(compareFunction) {
                
                case endPointStartPoint:
                    compareFunction = endPointEndPoint;
                break;

                case endPointEndPoint:
                    compareFunction = startPointEndPoint;
                break;

                case startPointEndPoint:
                    compareFunction = startPointStartPoint;
                break;

                case startPointStartPoint:
                    compareFunction = endPointStartPoint;
                break;

            }
            

            ++count;

            if(count > 1000) {
                console.log("ERROR")
                break;
            }
        }
        return sorted;

    }
}