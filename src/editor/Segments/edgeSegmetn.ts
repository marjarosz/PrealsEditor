import { Color, Vector2 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { IEditorEdge } from "../Edges/editorEdge";
//import { IEdgeOfShape } from "./edgeOfShape";
//import { ILineSegmentEdge } from "./lineSegmentEdge";



export interface IEdgeSegment extends Line2{

    /**
     * Rodzic klonowania
     */
    cloneParent: IEdgeSegment | undefined;

    /**
     * rodzic 
     */
   // IEdgeOfShape?: ILineSegmentEdge;
    
    /**
     * Punkt startowy
     */
    readonly startPoint: Vector2;
    
    /**
     * Punkt koncowy
     */
    readonly endPoint: Vector2;

    /**
     * 
     * Ustaw kolor
     * 
     * @param color 
     */
    setColor(color: Color): void;

    /**
     * Tworzy geometrie
     */
    createSegmentGeometry(): void;

    /**
     * Zwraca dlugosc
     */
    getLength(): number;

    /**
     * 
     * Aktualizacja rozdzielczosci
     * 
     * @param resolution 
     */
    updateResolution(resolution: Vector2): void;

    /**
     * rodzic linni
     */
    lineEdgeParent?: IEditorEdge

    /**
     * Klonuj z rodzicem
     */
    cloneWithParent(): IEdgeSegment;

}

export interface IAngleSegments extends IEdgeSegment {
    
    center: Vector2;

    startAngle: number;

    endAngle: number;

}

export class EdgeSegment extends Line2{


    lineEdgeParent?: IEditorEdge;

    public setColor(color: Color){
        this.setGeometryColor(color, this.geometry);
      
    }


    protected setGeometryColor(color: Color, geometry: LineGeometry, incrEl: number = 0) {
        const colors: number[] = [];
        const pos = geometry.getAttribute('position');
        const el = pos.array.length/3 + incrEl;
        for(let i = 0; i<el; ++i) {
            colors.push(color.r, color.g, color.b);
            
        }
        geometry.setColors(colors);
        
      
    }

    public updateResolution(resolution: Vector2){
        this.material.resolution.x = resolution.x;
        this.material.resolution.y = resolution.y;
    }

}