import { Color, Vector2 } from "three";
import { EditorDraw, IEditorDraw } from "./editorDraw";
import { IDrawPointer } from "../Pointers/drawPointer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { ILineSegmentEdge, LineSegmentEdge } from "../Edges/lineSegmentEdge";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircleCross } from "../Pointers/drawPointerCircleCross";
import { IDrawTrack, IDrawTrackInfo, IDrawTrackInfoCollinearly, IDrawTrackInfoEdge, IDrawTrackInfoPointEdge } from "./drawTrack";
import { EditorMath } from "../../Utility/editorMath";
import { EditorWall, IEditorWall } from "../Wall/editorWall";
import { IEditorEdge } from "../Edges/editorEdge";
import { IEditorDrawLayer } from "../Layers/editorDrawLayer";

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
    
    private startExcludeEdge: IEditorEdge[] = [];

    constructor(raycaster: IEditorRaycaster,drawTrack:IDrawTrack, layer: IEditorLayer, resolution: Vector2, scale: number, zoom:number){
        super(raycaster, drawTrack,layer, resolution, scale, zoom);

        this.layer.setDrawTrack(drawTrack);
        this.tempDrawPointer = new DrawPointerCircleCross(new Vector2(0,0), this.zoom, this.drawColor);
        this.tempEdge = new LineSegmentEdge(new Vector2(0,0), new Vector2(0,0), this.resolution, this.lineWidth, this.drawColor); 
    }

    public startDraw(point: Vector2): void {
        this.drawTrack.removeTrackLines();

        const coll = this.drawTrack.getCollinearlyTrack(point);
        let startPoint = coll.point;

        const startPointTrack = this.drawTrack.getPointTrack(startPoint);
       
        if(startPointTrack.isPoint && startPointTrack.isTrackX && startPointTrack.isTrackY) {
            startPoint = startPointTrack.point;
            this.checkCollinearlyTrack(startPointTrack, coll as IDrawTrackInfoCollinearly, startPoint);

            /**
             * Znajdz krawedzie ktore zawieraja ten punkt
             */
            
            this.startExcludeEdge.push(...(this.layer as IEditorDrawLayer).getEdgesByCommonPoint(startPoint));

        } else {
            const edgePoint = this.drawTrack.getPointToEdgeTrack(startPoint);
         
            if(edgePoint.isPoint) {
                startPoint = edgePoint.point;
                this.startExcludeEdge.push(...(edgePoint as IDrawTrackInfoPointEdge).edges);
            }
        }
        

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

         /**
         * Podzielic linnie jezeli potrzeba
         * Sprawdz pierwsza i ostatnia czy przecina
         */

        

        // for(const e of this.edges) {
        //     e.lineObject.setColor(new Color(0x000000));
        //     const wall = new EditorWall();
        //     wall.addEdge(e);
        //     this.layer.addLayerObject(wall);
        //     this.drawTrack.addTrackingEdge(e);
            
        // }

        

        (this.layer as IEditorDrawLayer).addWallsFromEdges(this.edges,  0x000000);
        this.drawTrack.addTrackingEdge(...this.edges);


    
        for(const p of this.pointers){
            p.dispose();
        }

        this.pointers.length = 0;
        this.edges.length = 0;
        this.tempEdge.lineObject.removeFromParent();
        this.tempDrawPointer.pointerGroup.removeFromParent();
        this.drawTrack.removeTrackLines();
        
        this.endDrawCallback();
        
        for(const de of (this.layer as IEditorDrawLayer).devidedEdges){
            this.drawTrack.removeTrackingEdge(de);
        }

        for(const t of (this.layer as IEditorDrawLayer).devidedEdges) {}
        this.drawTrack.addTrackingEdge(...(this.layer as IEditorDrawLayer).fromDevidedEdges);
       

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

        const isIntr = this.intersectionWithDraw(tempPoint, [...this.startExcludeEdge,...(edgeTrack as IDrawTrackInfoEdge).edges]);
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
        const isIntr = this.intersectionWithDraw(addPoint,[...this.startExcludeEdge ,...(edgeTrack as IDrawTrackInfoEdge).edges]);
        
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

        const sP = (this.edges.length > 0) ? this.edges[this.edges.length - 1].endPoint : this.pointers[this.pointers.length-1].sPoint;

      
        
        const edge = new LineSegmentEdge(sP, addPoint, this.resolution, this.lineWidth, this.drawColor);
        edge.renderOrder = this.layer.renderOrder + 1;
        edge.updateModel(this.resolution);
        this.edges.push(edge);
        this.layer.group.add(edge.lineObject);

        this.startExcludeEdge.length = 0;

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
         * Wspoliniowosc
         */

         
        const coll = this.drawTrack.getCollinearlyTrack(point) as IDrawTrackInfoCollinearly;
        

        if(coll.isPoint) {
            tempPoint = coll.point;
            fillColor = this.drawTrack.collinearlyTrackColor;
        }

        /**
         * Points
         */
        const trackPoints = this.drawTrack.getPointTrack(tempPoint);
        tempPoint = trackPoints.point;
        
        if(trackPoints.isPoint){
            fillColor = this.drawTrack.pointTrackColor;

            this.checkCollinearlyTrack(trackPoints, coll, tempPoint);

        }


        return {
            point: tempPoint,
            color: fillColor,
            trackOrto: trackOrto,
            trackPoint: trackPoints
        }

    }

    private checkCollinearlyTrack(trackPoints: IDrawTrackInfo, coll:IDrawTrackInfoCollinearly, tempPoint:Vector2){
       
        if(coll.isPoint && trackPoints.isTrackX != trackPoints.isTrackY) {

            if(trackPoints.isTrackX) {

                for(const ce of coll.edges) {
                    const np = EditorMath.intersectionTwoLinePoint(ce.startPoint, ce.endPoint, tempPoint, new Vector2(tempPoint.x, tempPoint.y+1));
                    if(np) {
                        tempPoint.x = np.x;
                        tempPoint.y = np.y;
                    }
                }

            } else if(trackPoints.isTrackY) {

                for(const ce of coll.edges) {
                    const np = EditorMath.intersectionTwoLinePoint(ce.startPoint, ce.endPoint, tempPoint, new Vector2(tempPoint.x + 1, tempPoint.y));
                    if(np) {
                        tempPoint.x = np.x;
                        tempPoint.y = np.y;
                    }
                }

            }

        }
        
    }
}