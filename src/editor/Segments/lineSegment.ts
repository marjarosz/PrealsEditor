import { BufferGeometry,Line, Vector2 } from "three";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { EditorMath } from "../../Utility/editorMath";
import { EdgeSegment, IEdgeSegment } from "./edgeSegmetn";

/**
 * Krawedz - odcinek
 */

export interface ILineSegment extends IEdgeSegment {
    
}

export class LineSegment extends EdgeSegment implements ILineSegment{

    cloneParent: ILineSegment | undefined = undefined;

    public readonly type: string = "LineSegment";

    constructor(public startPoint: Vector2, public endPoint: Vector2, geometry?: LineGeometry, material?: LineMaterial){

        super(geometry, material);
        

    }


    public createSegmentGeometry(){
       
        this.geometry = this.getGeometryFromPoints();
       
    }

    

    protected getGeometryFromPoints(): LineGeometry {
        const bufferGeometry = new BufferGeometry();
        bufferGeometry.setFromPoints([this.startPoint, this.endPoint]);

        const ll = new Line(bufferGeometry);   

        const lineGeometry = new LineGeometry();
        this.setGeometryColor(this.material.color, lineGeometry)
        const geometry = lineGeometry.fromLine(ll);

        return geometry;

    }

    public getLength(): number {
        return EditorMath.getLineSegmentLength(this.startPoint, this.endPoint);
    }

    cloneWithParent(): ILineSegment {
        const seg: ILineSegment = this.clone() as ILineSegment;
        seg.cloneParent = this;
        return seg;
    }

    clone(recursive?: boolean | undefined): this {
       
        const el = super.clone(recursive);
        el.startPoint = this.startPoint.clone();
        el.endPoint = this.endPoint.clone();
        
        return el;
    }

}

export interface ITrackLineSegment extends ILineSegment {

    trackObjectUuid: string;

    a: number;

    b: number;

}

export class TrackLineSegment extends LineSegment implements ITrackLineSegment {

    trackObjectUuid: string = '';

    a: number;

    b: number;

    constructor(startPoint: Vector2, endPoint: Vector2, trackSize: number, resolution?: Vector2){
       
        
        super(startPoint, endPoint, undefined, undefined);
        const material = new LineMaterial({resolution: resolution, linewidth: trackSize, color: 0x000000});
        this.material = material;
        const newCof = EditorMath.lineCoefficients(startPoint, endPoint);
       
        this.a = newCof.a;

        this.b = newCof.b;
 
        
    }

    

}