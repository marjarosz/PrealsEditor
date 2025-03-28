import { Color, Vector2 } from "three";
import { EditorDraw, IEditorDraw } from "./editorDraw";
import { IDrawPointer } from "../Pointers/drawPointer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { ILineSegmentEdge, LineSegmentEdge } from "../Edges/lineSegmentEdge";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircleCross } from "../Pointers/drawPointerCircleCross";
import { IDrawTrack } from "./drawTrack";
import { EditorMath } from "../../Utility/editorMath";



export interface IEditorDrawFree extends IEditorDraw{

}


export class EditorDrawFree extends EditorDraw implements IEditorDrawFree {

    public collisionColor: number = 0xff0000;
    public drawColor:number = 0xa61830;
    public lineWidth:number = 3;

    private tempDrawPointer: IDrawPointer;

    private tempEdge: ILineSegmentEdge;
    

    constructor(raycaster: IEditorRaycaster,drawTrack:IDrawTrack, layer: IEditorLayer, resolution: Vector2, scale: number, zoom:number){
        super(raycaster, drawTrack,layer, resolution, scale, zoom);

        this.tempDrawPointer = new DrawPointerCircleCross(new Vector2(0,0), this.zoom, this.drawColor);
        this.tempEdge = new LineSegmentEdge(new Vector2(0,0), new Vector2(0,0), this.resolution, this.lineWidth, this.drawColor); 
    }

    startDraw(point: Vector2): void {
        super.startDraw(point);
        this.tempDrawPointer.updateStartPoint(point.clone(), this.resolution);
        this.tempDrawPointer.renderOrder = this.layer.renderOrder + 2;
        this.layer.group.add(this.tempDrawPointer.pointerGroup);
        this.tempEdge.startPoint = point;
        this.tempEdge.endPoint = point.clone();
        this.tempEdge.renderOrder = this.layer.renderOrder + 1;
        this.layer.group.add(this.tempEdge.lineObject);
        this.showOrtoTrack(point);
       
    }

    drawTemp(point: Vector2): boolean {
        
        let color = this.drawColor;
        this.drawTrack.updateOrtoTrackLine(point);
        let fillColor = 0xFFFFFF;
       
        
        /**
         * ORTO
         */
        const trackOrto = this.drawTrack.getOrtoTrack(point);
        let tempPoint = trackOrto.point;

        if(trackOrto.isPoint){
            fillColor = this.drawTrack.ortoTrackColor;
        }

        /**
         * Points
         */
        const trackPoints = this.drawTrack.getPointTrack(tempPoint);
        tempPoint = trackPoints.point;
       
        if(trackPoints.isPoint){
            fillColor = this.drawTrack.pointTrackColor;
        }

        this.tempDrawPointer.fillColor = new Color(fillColor); 

        /**
         * Czy przecina inne krawedzie
         */

        const isIntr = this.intersectionWithDraw(tempPoint);

        if(isIntr) {
            const dis = this.pointers[0].sPoint.distanceTo(tempPoint);
            if(!EditorMath.equalsDecimals(dis, 0, 0.00005)) {
                color = this.collisionColor;
            }
        }

        this.tempEdge.edgeColor = new Color(color);
        this.tempDrawPointer.updateStartPoint(tempPoint.clone(), this.resolution);
        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);

        return true;
        
    }

    updateZoom(zoom: number): void {

        super.updateZoom(zoom);
        this.raycaster.updateReycaster();
        this.tempDrawPointer.updateStartPoint(this.raycaster.getOrigin(), this.resolution);
        this.tempDrawPointer.updateZoom(zoom);

        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);
        this.drawTemp(this.raycaster.getOrigin());
      
    }

    drawClick(point: Vector2): boolean {

        
        const orto = this.drawTrack.getOrtoTrack(point);
        let addPoint = orto.point;

        const trackPoints = this.drawTrack.getPointTrack(addPoint);
        addPoint = trackPoints.point;


        let isLastPoint;
        const dis = this.pointers[0].sPoint.distanceTo(addPoint);
        if(EditorMath.equalsDecimals(dis, 0, 0.00005)) {
            isLastPoint = true;
        }

        /**
         * Czy przecina narysowane krawedzie
         */
        if(!isLastPoint) {
            const isIntr = this.intersectionWithDraw(addPoint);
            if(isIntr) {
                return false;
            }
        }
        /**
         * Dodaj linie
         */
        const edge = new LineSegmentEdge(this.pointers[this.pointers.length-1].sPoint, addPoint, this.resolution, this.lineWidth, this.drawColor);
        edge.renderOrder = this.layer.renderOrder + 1;
        edge.updateModel(this.resolution);
        this.edges.push(edge);
        this.layer.group.add(edge.lineObject);

        /**
         * Jezeli jest zakonczony ksztalt to zakoncz
         */
        if(isLastPoint) {

        }

        /**
         * Dodaj  pointer
         */
        const pointer = new DrawPointerCircle(addPoint, this.zoom, this.drawColor);
        pointer.renderOrder = this.layer.renderOrder + 2;
        pointer.draw(this.resolution);
        this.pointers.push(pointer);
        this.layer.group.add(pointer.pointerGroup);

        /**
         * Zmien punkt startowy
         */
        this.tempEdge.startPoint = addPoint;
        this.drawTrack.updateOrtoTrackLine(point, addPoint.clone());

        /**
         * Dodanie punktow do sledzenia
         */
        if(this.pointers.length > 1) {
            this.drawTrack.addTrackingPoint(this.pointers[this.pointers.length - 2].sPoint);
        }

        return true;
    }

    cancel(): void {
        super.cancel();
        this.tempDrawPointer.dispose();
        this.tempEdge.dispose();
        if(this.pointers.length == 1){
           this.pointers[0].dispose();
           this.pointers.length = 0;
        }
    }

    resolutionChange(resolution: Vector2): void {
        super.resolutionChange(resolution);
        

        this.tempEdge.updateResolution(resolution);
        this.layer.group.add(this.tempEdge.lineObject);

        for(const e of this.edges){
            e.lineObject.updateResolution(this.resolution);
            this.layer.group.add(e.lineObject);
        }

        this.tempDrawPointer.updateResolution(this.resolution);
        
        for(const p of this.pointers){
            p.updateResolution(this.resolution);
        }
        
    }

    protected intersectionWithDraw(point: Vector2){
        /**
         * Czy przecina inne krawedzie
         */
        for(let i = 0; i < this.edges.length - 1; ++i) {
            const intr = this.edges[i].intersectionWithEdge(this.tempEdge);
            if(intr != EditorMath.IntersectionType.noIntersection) {
                /**
                 * Czy klikniecie na punk koncowy
                 */
                return true;

            }
        }

        return false;
    }

}