import { BufferGeometry,Material, Mesh, MeshBasicMaterial, Path, PlaneGeometry, Shape, ShapeGeometry, Texture, Vector2 } from "three";

import { EditorMath } from "./editorMath";
import { IEditorEdge } from "../editor/Edges/editorEdge";

export namespace MeshUtility {

    /**
     * Tworzy siatke z krawedzi
     * @param edges lista krawedzi
     * @param material material
     * @returns Mesh
     */
    export function getMeshFromEdges(edges: IEditorEdge[], material?: Material): Mesh{

        let geometry = new BufferGeometry();
   
       
        if(edges.length > 0){
            const shape = new Shape();
            shape.moveTo(edges[0].startPoint.x, edges[0].startPoint.y);

            for(const edge of edges ) {
                edge.stepDrawShape(shape);
             
            }

            geometry = new ShapeGeometry(shape);
            
        }

        let mesh: Mesh;
        mesh = new Mesh( geometry, material);
        

        return mesh;
    }

    /**
     * Tworzy siatke z punktow
     * @param points lista punktow
     * @param holePoints lista punktow dla otowrow
     * @param material material
     * @returns Mesh
     */
    export function getMeshFromPoints(points: Vector2[], holePoints: Vector2[], material?: Material): Mesh{

        const shape = new Shape();
        shape.setFromPoints(points);
        if(holePoints.length > 1){
            const pth = new Path();
            pth.moveTo(holePoints[0].x, holePoints[0].y);
            for(let i = 1; i < holePoints.length-1; ++ i){
               pth.lineTo(holePoints[i].x, holePoints[i].y);
            }
            pth.lineTo(holePoints[0].x, holePoints[0].y);

            
            shape.holes.push(pth);

         } 


        
        const geometry = new ShapeGeometry(shape);
        
        
        return new Mesh(geometry, material);

    }

    /**
     * Tworzy siatke z tekstura
     * @param texture 
     * @returns Mesh
     */
    export function createMeshFromImgTexture(texture: Texture): Mesh{
        const wmm = EditorMath.pixelsToMeter(texture.image.width);
        const hmm = EditorMath.pixelsToMeter(texture.image.height);
        
        
        const planeGeometry = new PlaneGeometry(wmm, hmm);
        const m = new Mesh(planeGeometry,new MeshBasicMaterial({map: texture}));
        return m;
    }

    /**
     * 
     * Zwraca min i max pozycje wierszcholkow z siatki mesh
     * 
     * @param mesh 
     * @returns IMinMaxPosition
     */
    export function getMinMaxPositionFromMesh(mesh: Mesh){
        
       return getMinMaxPositionFromGeometry(mesh.geometry);

    }

    /**
     * Zwraca min i max pozycje wierszcholkow z geometri
     * 
     * @param geometry 
     * @returns IMinMaxPosition
     */
    export function getMinMaxPositionFromGeometry(geometry: BufferGeometry){
        const arrX: number[] = [];
        const arrY: number[] = [];
        const arrZ: number[] = [];

        for(let i = 0; i < geometry.attributes["position"].count; ++i){
            arrX.push(geometry.attributes["position"].getX(i));
            arrY.push(geometry.attributes["position"].getY(i));
            arrZ.push(geometry.attributes["position"].getZ(i));
        }

        const minMax: IMinMaxPosition = {
            minMaxX: [Math.min(...arrX), Math.max(...arrX)],
            minMaxY: [Math.min(...arrY), Math.max(...arrY)],
            minMaxZ: [Math.min(...arrZ), Math.max(...arrZ)]

        }

        return minMax
    }

    /**
     * Zwraca punkty z siatki
     * @param mesh 
     * @returns Vector2[]
     */
    export function getPointsPlaneXYFromMesh(mesh: Mesh){
        return getPointsPlaneXYFromGeometry(mesh.geometry);
    }

    /**
     * Zwraca punkty z geometri
     * @param geometry 
     * @returns Vector2[]
     */
    export function getPointsPlaneXYFromGeometry(geometry: BufferGeometry){
        const points: Vector2[] = [];

        for(let i = 0; i < geometry.attributes["position"].count; ++i){

            points.push(new Vector2(geometry.attributes["position"].getX(i), geometry.attributes["position"].getY(i)));
     
        }

       
        return points;
    }

}

/**
 * Min, max pozycjia
 */
export interface IMinMaxPosition {

    /**
     * Min/ max dla X
     */
    minMaxX: [number, number];

    /**
     * Min/max dla Y
     */
    minMaxY: [number, number];

    /**
     * Min/max dla Z
     */
    minMaxZ: [number, number];


}

export class MinMaxPosition {

    /**
     * Tworzy domyslny IMinMaxPosition o wartosciach 0
     * @returns 
     */
    static getDefaultMinMax(): IMinMaxPosition {
        return {
            minMaxX: [0,0],
            minMaxY: [0,0],
            minMaxZ: [0,0]
        }
    }

}