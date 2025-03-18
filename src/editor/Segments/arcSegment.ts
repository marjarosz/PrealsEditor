import { BufferGeometry, Color, Line, Path, Vector2 } from "three";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";


import { EditorMath } from "../../Utility/editorMath";
import { EdgeSegment, IAngleSegments, IEdgeSegment } from "./edgeSegmetn";

/**
 * Krawedz - luk
 */


export interface IArcSegment extends IAngleSegments {

    /**
     * Promien luku
     */
    radius: number;
}

export class ArcSegment extends EdgeSegment implements IArcSegment {


    cloneParent: IEdgeSegment | undefined = undefined;

    public readonly type = "ArcSegment";

    constructor(public startPoint: Vector2, public endPoint: Vector2, public center: Vector2, public radius: number, public startAngle: number,
        public endAngle: number,  public clockwise: boolean = true, geometry?: LineGeometry, material?: LineMaterial) {
        super(geometry, material);


    }


    public createSegmentGeometry(): void {
     
        const path = new Path();
        path.moveTo(this.startPoint.x, this.startPoint.y); 

        path.absarc(this.center.x, this.center.y, this.radius, this.startAngle, this.endAngle, this.clockwise);
        
        const bufferGeometry =new BufferGeometry().setFromPoints(path.getPoints(500));
    
        const ll = new Line(bufferGeometry, this.material);   

        const lineGeometry = new LineGeometry();
     
       
        this.geometry = lineGeometry.fromLine(ll);
        this.setGeometryColor(this.material.color, lineGeometry, 1000);
      
       

    }

    public setColor(color: Color): void {
        this.setGeometryColor(color, this.geometry, 1000);
    }

    public getLength(): number {
        return EditorMath.getArcSegmentLength(this.radius, this.startAngle, this.endAngle);
    }

    cloneWithParent(): IArcSegment{
        const seg: IArcSegment = this.clone() as IArcSegment;
        seg.cloneParent = this;
        return seg;
    }

    clone(recursive?: boolean | undefined): this {
        const el = super.clone(recursive);
        el.startAngle = this.startAngle;
        el.endAngle = this.endAngle;
        el.radius = this.radius;
        el.center = this.center.clone();
        el.startPoint = this.startPoint.clone();
        el.endPoint = this.endPoint.clone();
        el.clockwise = this.clockwise;
        return el;
    }

}