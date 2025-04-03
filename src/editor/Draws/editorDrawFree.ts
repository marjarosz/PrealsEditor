import { Color, Vector2 } from "three";
import { EditorDraw, IEditorDraw } from "./editorDraw";
import { IDrawPointer } from "../Pointers/drawPointer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { ILineSegmentEdge, LineSegmentEdge } from "../Edges/lineSegmentEdge";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircleCross } from "../Pointers/drawPointerCircleCross";
import { IDrawTrack, IDrawTrackInfo, IDrawTrackInfoEdge, IDrawTrackInfoPointEdge } from "./drawTrack";
import { EditorMath } from "../../Utility/editorMath";
import { EditorWall, IEditorWall } from "../Wall/editorWall";
import { IEditorEdge } from "../Edges/editorEdge";

interface IntersectionWithDrawInfo {
    intersection: boolean;
    isLastPoint: boolean;
}

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

    public startDraw(point: Vector2): void {
        this.drawTrack.removeTrackLines();

        const startPointTrack = this.drawTrack.getPointTrack(point);
        const startPoint = startPointTrack.point;

        this.drawPointer(startPoint);
        this.tempDrawPointer.updateStartPoint(startPoint.clone(), this.resolution);
        this.tempDrawPointer.renderOrder = this.layer.renderOrder + 2;
        this.layer.group.add(this.tempDrawPointer.pointerGroup);
        this.tempEdge.startPoint = startPoint;
        this.tempEdge.endPoint = startPoint.clone();
        this.tempEdge.renderOrder = this.layer.renderOrder + 1;
        this.layer.group.add(this.tempEdge.lineObject);
        this.showOrtoTrack(startPoint);
       
    }

    public endDraw(){

        this.drawTrack.addTrackingPoint(this.pointers[this.pointers.length - 1].sPoint);
        for(const e of this.edges) {
            e.lineObject.setColor(new Color(0x000000));
            const wall = new EditorWall();
            wall.edges.push(e);
            this.layer.addLayerObject(wall);
            this.drawTrack.addTrackingEdge(e);
            
        }

        for(const p of this.pointers){
            p.dispose();
        }

        this.pointers.length = 0;
        this.edges.length = 0;
        this.tempEdge.lineObject.removeFromParent();
        this.tempDrawPointer.pointerGroup.removeFromParent();
        this.drawTrack.removeTrackLines();
        
        this.endDrawCallback();
        
        

    }

    public noDrawTemp(point: Vector2) {
        
        /**
         * Sledzenie punktow
         */
        const trackPoint = this.drawTrack.getPointTrack(point);
        const edgePoint = this.drawTrack.getPointToEdgeTrack(trackPoint.point);

        let color: number = 0xFFFFFF;
        this.tempDrawPointer.pointerGroup.removeFromParent();
        if(trackPoint.isPoint) {
            this.tempDrawPointer.updateStartPoint(trackPoint.point, this.resolution);
            this.layer.group.add(this.tempDrawPointer.pointerGroup);
            color = this.drawTrack.pointTrackColor;
        }
          
        if (edgePoint.isPoint) {
            this.tempDrawPointer.updateStartPoint(edgePoint.point, this.resolution);
            this.layer.group.add(this.tempDrawPointer.pointerGroup);  

            color = ((edgePoint as IDrawTrackInfoPointEdge).isCollinearly) ? this.drawTrack.collinearlyTrackColor : this.drawTrack.edgeTrackColor;
        } 
       
        this.tempDrawPointer.setFillColor(color);

    }

    public drawTemp(point: Vector2): boolean {
        
        let color = this.drawColor;
        this.drawTrack.updateOrtoTrackLine(point);
        
        const trackPoint = this.getDrawTrack(point);
        const tempPoint = trackPoint.point;
    
        this.tempEdge.endPoint = tempPoint;
        
        const edgeTrack = this.drawTrack.getEdgeTrack(this.tempEdge, 
            (trackPoint.trackOrto.isTrackX || trackPoint.trackPoint.isTrackX), 
            (trackPoint.trackOrto.isTrackY || trackPoint.trackPoint.isTrackY) 
        );


        if(edgeTrack.isPoint){
            trackPoint.color = this.drawTrack.edgeTrackColor;
        }
        
        this.tempDrawPointer.fillColor = new Color(trackPoint.color);
        
        /**
         * Czy przecina inne krawedzie
         */

        const isIntr = this.intersectionWithDraw(tempPoint, (edgeTrack as IDrawTrackInfoEdge).edges);
        // if(isIntr.intersection && this.pointers.length > 0) {
        //     const dis = this.pointers[0].sPoint.distanceTo(tempPoint);
        //     if(!EditorMath.equalsDecimals(dis, 0, 0.00005)) {
        //         color = this.collisionColor;
        //     }
        // }
        
        if(isIntr.intersection) {
            color = this.collisionColor;
        }

        this.tempEdge.edgeColor = new Color(color);
        this.tempDrawPointer.updateStartPoint(this.tempEdge.endPoint, this.resolution);
        

        this.tempEdge.updateModel(this.resolution);
        
        return true;
        
    }

    public updateZoom(zoom: number): void {

        super.updateZoom(zoom);
        this.raycaster.updateReycaster();
        this.tempDrawPointer.updateStartPoint(this.raycaster.getOrigin(), this.resolution);
        this.tempDrawPointer.updateZoom(zoom);

        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);
        this.drawTemp(this.raycaster.getOrigin());
      
    }

    drawClick(point: Vector2): boolean {

        

        const trackPoint = this.getDrawTrack(point);
        let addPoint = trackPoint.point;

        let isLastPoint = false;
        
        const edgeTrack = this.drawTrack.getEdgeTrack(this.tempEdge, 
            (trackPoint.trackOrto.isTrackX || trackPoint.trackPoint.isTrackX), 
            (trackPoint.trackOrto.isTrackY || trackPoint.trackPoint.isTrackY) 
        );

        if(edgeTrack.isPoint) {
            addPoint = edgeTrack.point;
        }

        isLastPoint = (edgeTrack as IDrawTrackInfoEdge).startOrEndPoint;

        /**
         * Czy przecina narysowane krawedzie
         */
        const isIntr = this.intersectionWithDraw(addPoint, (edgeTrack as IDrawTrackInfoEdge).edges);
        
        if(isIntr.intersection) {
            /**
             * Jest przeciecie - zwraca false
             */
            return false;
        }
        
        isLastPoint =  isLastPoint || isIntr.isLastPoint || edgeTrack.isPoint;
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
            this.endDraw();
            return true;
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

    protected intersectionWithDraw(point: Vector2, excludeEdge: IEditorEdge[]):IntersectionWithDrawInfo {
        
        const ret: IntersectionWithDrawInfo  = {
            intersection: false,
            isLastPoint: false
        }
        
        /**
         * Czy przecina inne rysowane krawedzie
         */
        for(let i = 0; i < this.edges.length - 1; ++i) {
            const intr = this.edges[i].intersectionWithEdge(this.tempEdge);
            if(intr != EditorMath.IntersectionType.noIntersection) {

                const dis = this.pointers[0].sPoint.distanceTo(point);
                if(EditorMath.equalsDecimals(dis, 0, 0.00005)) {
                    ret.isLastPoint = true;
                } else {
                    ret.intersection = true;
                }
                return ret;

            }
        }

        /**
         * Czy przecina pozostale krawedzie z warstwy
         */

        for(const obj of this.layer.layerObjects as IEditorWall[]) {

           
            for(const edg of obj.edges) {
                const isExclude = excludeEdge.find(x=>x.uuid === edg.uuid);

                if(!isExclude) {
                    const inter = edg.intersectionWithEdge(this.tempEdge);

                    if(inter != EditorMath.IntersectionType.noIntersection) {
                        ret.intersection = true;
                        return ret;
                    }
                }
            }

        }

        return ret;
    }

    protected getDrawTrack(point:Vector2):{point: Vector2, color: number, trackOrto: IDrawTrackInfo, trackPoint: IDrawTrackInfo} {

        let fillColor: number = 0xFFFFFF;
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

        

        return {
            point: tempPoint,
            color: fillColor,
            trackOrto: trackOrto,
            trackPoint: trackPoints
        }

    }
}