import { Group, Vector2 } from "three";
import {IEditorRaycaster } from "../editorRaycaster"
import { EditorUtility } from "../../Utility/editorUtility";
import { ITrackLine, TrackLine } from "./trackLine";
import { EditorMath } from "../../Utility/editorMath";
import { ArrayUtility } from "../../Utility/arrayUtility";
import { IEditorEdge } from "../Edges/editorEdge";

export interface IDrawTrackInfo {

    point: Vector2;
    isPoint: boolean;
    isTrackX: boolean;
    isTrackY: boolean;
}



export interface IDrawTrackInfoEdge extends IDrawTrackInfo {

    edges: IEditorEdge[];
    startOrEndPoint:boolean;
}

export interface IDrawTrackInfoPointEdge extends IDrawTrackInfo{

    isCollinearly: boolean;
    edges: IEditorEdge[];
}

export interface IDrawTrackInfoCollinearly extends IDrawTrackInfo {
    edges: IEditorEdge[]
}

export interface IDrawTrackInfoPointer extends IDrawTrack {

}



export interface IDrawTrack {

    renderOrder:number;

    /**
     * Od jakiej odleglosci punktu do linni sledzenia pozioma / pionowa umiejscic punkt na prostej w px
     */
    ortoTrackSize:number;

    ortoTrackColor: number;

    pointTrackSize: number;

    pointTrackColor: number;

    edgeTrackSize: number;

    edgeTrackColor: number;

    collinearlyTrackColor: number;

    collinearlyTrackSize: number;

    setOrtoTrackLine(currentPoint: Vector2, point?: Vector2):void;

    updateOrtoTrackLine(point?:Vector2, startPoint?:Vector2):void;

    updateZoom(zoom:number):void;

    resolutionChange(resolution: Vector2):void;

    removeOrtoTrackLines():void;

    dispose():void;

    /**
     * 
     * Zwraca punt do sledzenia linni prostopadlych (pozioma i pionowa)
     * 
     * @param point 
     */
    getOrtoTrack(point: Vector2):IDrawTrackInfo;

    /**
     * 
     * Zwraca punkt sledzenia punktow poczatkowych i koncowych krawedzi
     * 
     * @param point 
     */
    getPointTrack(point:Vector2):IDrawTrackInfo;

    /**
     * 
     * Zwraca punk sledzenia innych krawedzi 
     * 
     * @param edge  krawedz ktora ma byc sledzona
     * @param constX nie zmieniaj wartosci X
     * @param constY nie zmieniaj wartosci Y
     */
    getEdgeTrack(edge: IEditorEdge, constX: boolean, constY: boolean): IDrawTrackInfo;

    /**
     * 
     * Zwraca sledzenie wsoliniowosci
     * 
     * @param point 
     */
    getCollinearlyTrack(point: Vector2):IDrawTrackInfo;

    /**
     * 
     * Zwraca punkt sledzenia do krawedzi (czy punkt lezy na krawedzi)
     * Zwraca punkt sledzenia wspolinniowosci
     * 
     * @param point 
     */
    getPointToEdgeTrack(point: Vector2):IDrawTrackInfo;

    addTrackingPoint(point:Vector2):void

    removeTrackingPoints(point:Vector2):void;

    addTrackingEdge(...edge: IEditorEdge[]):void;

    removeTrackingEdge(edge: IEditorEdge):void;

    removeCollinearlyTrackLine():void;

    removeTrackLines(): void;
}

export class DrawTrack implements IDrawTrack {

    public renderOrder: number = 1;

    public ortoTrackSize: number = 2;

    public ortoTrackColor: number = 0xfdff00;

    public pointTrackSize: number  = 2;

    public pointTrackColor: number = 0x00a7ff;

    public edgeTrackSize: number = 2;

    collinearlyTrackColor: number = 0xffac00;

    collinearlyTrackSize: number = 2;

    public edgeTrackColor: number = 0x000000;

    private _drawTrackEnable:boolean = true;

    private _normalTrackEnable: boolean = true;

    private _pointTrackEnable: boolean = true;

    /**
     * Linnia slzedzenia poziomo
     */
     private xOrto: ITrackLine | undefined;
    /**
    * Linnia slzedzenia pionowo
     */
    private yOrto: ITrackLine | undefined;


    /**
     * Linia sledzenia punktow X - linnia pionowa
     */
    private xPointTrackLine: ITrackLine | undefined;


    /**
     * Linia sledzenia punktow Y - linnia pozioma
     */
    private yPointTrackLine: ITrackLine | undefined;

    /**
     * Linnia sledzenia wspolosiowosci
     */
    private collinearlyTrackLine: ITrackLine | undefined;

    protected trackingPoints: Vector2[] = [];

    protected trackingEdges: IEditorEdge[] = [];

    constructor(private readonly raycaster:IEditorRaycaster, private resolution:Vector2, private group:Group, private pixelRatio: number){
        
    }

    public setOrtoTrackLine(currentPoint: Vector2, point?: Vector2){

        //const linePoint = (point) ? point : this.raycaster.origin.clone();

        if(!this._drawTrackEnable || !this._normalTrackEnable) {return};


        const linePoint = (point) ? point : this.raycaster.getOrigin();
        //const camPoints = EditorUtility.getCamViewMinMaxPoints(this.raycaster.camera);

        const normals = this.getOrtoXY(currentPoint, linePoint);

        if(this.xOrto) {
            this.xOrto.dispose();
        }


        if(this.yOrto){
            this.yOrto.dispose();
        }

        this.xOrto = this.createDashedTrackLine(currentPoint, normals[0], this.ortoTrackColor, this.ortoTrackSize);
        this.yOrto = this.createDashedTrackLine(currentPoint, normals[1], this.ortoTrackColor, this.ortoTrackSize);
        //this.xOrto =  new TrackLine(currentPoint, normals[0],this.ortoTrackColor, this.resolution, 5);
        //this.xOrto.renderOrder = this.renderOrder;
        //this.xOrto.zoomUpdate(this.raycaster.camera.zoom);
      
       // this.group.add(this.xOrto.trackGroup);
       // this.yOrto = new TrackLine(currentPoint, normals[1],this.ortoTrackColor, this.resolution, 5);
       // this.yOrto.renderOrder = this.renderOrder;
       // this.yOrto.zoomUpdate(this.raycaster.camera.zoom);
       
      //  this.group.add(this.yOrto.trackGroup);

    

    }

    public setPointXTrackLine(sPoint: Vector2, ePoint:Vector2){

        if(!this._drawTrackEnable || !this._pointTrackEnable) {return}

        if(this.xPointTrackLine) {
            this.removeXPointTrackLine();
        }

        this.xPointTrackLine = this.createDashedTrackLine(sPoint, ePoint, this.pointTrackColor, this.pointTrackSize);
    }

    public setPointYTrackLine(sPoint: Vector2, ePoint:Vector2) {

        if(!this._drawTrackEnable || !this._pointTrackEnable) {return}

        if(this.xPointTrackLine) {
            this.removeYPointTrackLine();
        }

        this.yPointTrackLine = this.createDashedTrackLine(sPoint, ePoint, this.pointTrackColor, this.pointTrackSize);

    }

    public updateOrtoTrackLine(point?:Vector2, startPoint?:Vector2){

        if(!this.xOrto || !this.yOrto){
            return;
        }
        const linePoint = (point) ? point : this.raycaster.getOrigin();
        const startP = (startPoint) ? startPoint : this.xOrto.sPoint;
        const normals = this.getOrtoXY(startP, linePoint);
        this.xOrto.setNewPoints(startP, normals[0]);
        this.yOrto.setNewPoints(startP, normals[1]);
        this.xOrto.zoomUpdate(this.raycaster.camera.zoom);
        this.yOrto.zoomUpdate(this.raycaster.camera.zoom);
    }

    protected createDashedTrackLine(sPoint:Vector2, ePoint:Vector2, color: number, trackSize: number){

        const tl = new TrackLine(sPoint, ePoint, color, this.resolution, trackSize);
        tl.renderOrder = this.renderOrder;
        tl.zoomUpdate(this.raycaster.camera.zoom);
        this.group.add(tl.trackGroup);
        return tl;

    }

    private getOrtoXY(startPoint: Vector2, linePoint:Vector2):[Vector2, Vector2]{

        const camPoints = EditorUtility.getCamViewMinMaxPoints(this.raycaster.camera);
        let norX = 0;
        if(startPoint.x < linePoint.x){
            norX = camPoints.maxX;
        } else {
            norX = camPoints.minX;
        }

        let norY = 0
        if(startPoint.y > linePoint.y){
            norY = camPoints.minY;
        } else {
            norY = camPoints.maxY;
        }

        const XNormalPoint = new Vector2(norX, startPoint.y);
        const YNormalPoint = new Vector2(startPoint.x, norY);
        return [XNormalPoint, YNormalPoint];

    }

    public getOrtoTrack(point: Vector2){

        const ret:IDrawTrackInfo = {
            point: point,
            isPoint: false,
            isTrackX: false,
            isTrackY: false
        }
        /**
         * Os X
         */
        if(this.xOrto) {
            
            let disY = EditorMath.distanceOrto(this.xOrto.sPoint.y, point.y);
            disY /= (2.6458333333 / this.raycaster.camera.zoom);
            if(disY <= this.ortoTrackSize){
                ret.point = new Vector2(point.x, this.xOrto.sPoint.y);
                ret.isPoint = true;
                ret.isTrackX = true;
            }
        }
        
        /**
         * Os Y
         */
        if(this.yOrto) {
           
            let disX = EditorMath.distanceOrto(this.yOrto.sPoint.x, point.x);
            disX /= (2.6458333333 / this.raycaster.camera.zoom);
            if(disX <= this.ortoTrackSize) {
                ret.point = new Vector2(this.yOrto.sPoint.x, point.y);
                ret.isPoint = true;
                ret.isTrackY = true;
            }
        }

        return ret;
    }

    public getPointTrack(point:Vector2){
        const ret:IDrawTrackInfo = {
            point: point,
            isPoint: false,
            isTrackX: false,
            isTrackY: false
           
        }

        let pointX:Vector2 | undefined;
        let pointY:Vector2 | undefined;

        let trackDistanceX = Infinity;
        let trackDistanceY = Infinity;

        for(const p of this.trackingPoints) {

            //Punkt po ois X
            let disX = EditorMath.distanceOrto(p.x, point.x);
            disX /=(2.6458333333 / this.raycaster.camera.zoom);

            //odleglosc po Y
            const tempTrackDistanceX = EditorMath.distanceOrto(p.y, point.y);

            if(disX <= this.pointTrackSize && tempTrackDistanceX < trackDistanceX) {
                
                trackDistanceX = tempTrackDistanceX;
                pointX = p;
            }
            
            //Punkt po osi Y
            let disY = EditorMath.distanceOrto(p.y, point.y);
            disY /=(2.6458333333 / this.raycaster.camera.zoom);

            //odleglosc po X
            const tempTrackDistanceY = EditorMath.distanceOrto(p.x, point.x);

            if(disY <= this.pointTrackSize && tempTrackDistanceY < trackDistanceY) {
                
                trackDistanceY = tempTrackDistanceY;
                pointY = p;
            }

        }

        this.removeXPointTrackLine();
        this.removeYPointTrackLine();

       

        if(pointX) {
            this.setPointXTrackLine(pointX, new Vector2(pointX.x, point.y));
            ret.point = new Vector2(pointX.x, ret.point.y);
            ret.isPoint = true;
            ret.isTrackX = true;
            
        } 

        if(pointY) {
            this.setPointYTrackLine(pointY, new Vector2(point.x, pointY.y));
            ret.point = new Vector2(ret.point.x, pointY.y);
            ret.isPoint = true;
            ret.isTrackY = true;
        } 

        

        return ret;
    }

    public getEdgeTrack(edge: IEditorEdge, constX: boolean = false, constY: boolean = false) {
        
        const ret:IDrawTrackInfoEdge= {
            point: edge.endPoint,
            isPoint: false,
            isTrackX: false,
            isTrackY: false,
            edges: [],
            startOrEndPoint: false
        }
 
        for(const e of this.trackingEdges) {

            /**
            * Czy nie nalezy do punktow startowych i koncowych krawedzi
            */

            if(this.checkStartEndPoint(e.endPoint, ret.point)) {
                ret.point = e.endPoint;
                ret.isPoint = true;
                ret.edges.push(...this.trackingEdges.filter(x=>EditorMath.equalsVectors(x.startPoint, e.endPoint, EditorMath.TOLERANCE_0_10)));
                ret.edges.push(...this.trackingEdges.filter(x=>EditorMath.equalsVectors(x.endPoint, e.endPoint, EditorMath.TOLERANCE_0_10)));
                ret.startOrEndPoint = true;
                //edge.endPoint = ret.point;
                return ret;
            }


            if(this.checkStartEndPoint(e.startPoint, ret.point)) {
                ret.point = e.startPoint;
                ret.isPoint = true;
                ret.edges.push(...this.trackingEdges.filter(x=>EditorMath.equalsVectors(x.startPoint, e.startPoint, EditorMath.TOLERANCE_0_10)));
                ret.edges.push(...this.trackingEdges.filter(x=>EditorMath.equalsVectors(x.endPoint, e.startPoint, EditorMath.TOLERANCE_0_10)));
                ret.startOrEndPoint = true;
               // edge.startPoint = ret.point;
                return ret;
            }


            /**
             * Czy przecina sie z innymi narysowanymi krawedziami
             */
            const points = e.intersectionWithEdgePoint(edge);

            for(const p of points) {
                let dis = ret.point.distanceTo(p);
                dis /= (2.6458333333 / this.raycaster.camera.zoom);
                if(dis <= this.edgeTrackSize) {

                    //ustaw brak przeciecia - jest punkt sledzenia
                    ret.isPoint = true;
                    ret.edges.push(e);

                    if(constX) {
                        ret.point.setY(p.y);
                        return ret;
                    }

                    if(constY) {
                        ret.point.setX(p.x);
                        return ret;
                    }
                    
                    const pp = e.intersectionPerpendicular(p);

                    ret.point.setX(pp.x);
                    ret.point.setY(pp.y);
                    return ret;
                }
            }
            
        }
        return ret;

    }

    public getCollinearlyTrack(point: Vector2) {

        let ret:IDrawTrackInfoCollinearly = {
            point: point,
            isPoint: false,
            isTrackX: false,
            isTrackY: false,
            edges:[]
        }

        this.removeCollinearlyTrackLine();
        for(const e of this.trackingEdges) {

            try {

                const pp = e.intersectionPerpendicular(point);

                if(!EditorMath.pointOnLineSegment(e.startPoint, e.endPoint, pp)) {

                    let dis = point.distanceTo(pp);
                    dis /= (2.6458333333 / this.raycaster.camera.zoom);

                    if(dis < this.collinearlyTrackSize) {

                        this.collinearlyTrackLine =  this.createDashedTrackLine(e.startPoint, pp, this.collinearlyTrackColor, this.collinearlyTrackSize);
                        ret = this.setDrawTrackInfo(ret, pp, true, true, true) as IDrawTrackInfoCollinearly;
                        ret.edges.push(e);
                        return ret;
                    }

                }

            } catch(e) {

            }

        } 
        
        return ret;
    }

    private checkStartEndPoint(ePoint: Vector2, point: Vector2){

        let epDis = ePoint.distanceTo(point);
        epDis /= (2.6458333333 / this.raycaster.camera.zoom);

        return (epDis <= this.edgeTrackSize);
    }

    private setDrawTrackInfo(ret:IDrawTrackInfo, point: Vector2, isPoint: boolean = false, isTrackX: boolean = false, isTrackY: boolean = false){
        ret.point = point;
        ret.isPoint = isPoint;
        ret.isTrackX = isTrackX;
        ret.isTrackY = isTrackY;

        return ret;
    }

    

    private setDrawTrackInfoPointEdge(ret:IDrawTrackInfoPointEdge, point: Vector2, isPoint: boolean = false, 
        isTrackX: boolean = false, isTrackY: boolean = false, isCollinearly:boolean = false):IDrawTrackInfoPointEdge {

        ret = this.setDrawTrackInfo(ret, point, isPoint, isTrackX, isTrackY) as IDrawTrackInfoPointEdge;
        ret.isCollinearly = isCollinearly;

        return ret;
    }

    public getPointToEdgeTrack(point: Vector2):IDrawTrackInfo {

        const ret:IDrawTrackInfoPointEdge= {
            point: point,
            isPoint: false,
            isTrackX:false,
            isTrackY:false,
            isCollinearly: false,
            edges: []
        }

        this.removeCollinearlyTrackLine();
        for(const e of this.trackingEdges) {
            
            if(this.checkStartEndPoint(e.startPoint, point)){
                
                return this.setDrawTrackInfoPointEdge(ret, e.startPoint, true, true, true);
            }

            if(this.checkStartEndPoint(e.endPoint, point)) {
                
                return this.setDrawTrackInfoPointEdge(ret, e.endPoint, true, true, true);
            }

            try {
                const pp = e.intersectionPerpendicular(point);

                let dis = pp.distanceTo(point);
                dis /= (2.6458333333 / this.raycaster.camera.zoom);
    
                if(dis < this.edgeTrackSize) {
                    ret.edges.push(e);
                    if(EditorMath.onSegment(e.startPoint, e.endPoint, pp)) {
                      
                        
                        return this.setDrawTrackInfoPointEdge(ret, pp, true, true, true);
                    } else {
                        this.collinearlyTrackLine =  this.createDashedTrackLine(e.startPoint, pp, this.collinearlyTrackColor, this.collinearlyTrackSize);
                        return this.setDrawTrackInfoPointEdge(ret, pp, true, true, true, true);
                    }

                }
            } catch(e){
                return ret;
            }

        }

        return ret;

    }

    public removeOrtoTrackLines(){
        this.xOrto?.dispose();
        this.yOrto?.dispose();
    }

    public removeXPointTrackLine(){
        this.xPointTrackLine?.dispose();
    }

    public removeYPointTrackLine(){
        this.yPointTrackLine?.dispose();
    }

    public updateZoom(zoom: number): void {
        
        this.xOrto?.zoomUpdate(zoom);
        this.yOrto?.zoomUpdate(zoom);
        this.collinearlyTrackLine?.zoomUpdate(zoom);
        this.getPointTrack(this.raycaster.getOrigin());
  
    }

    public resolutionChange(resolution: Vector2): void {

        this.resolution = resolution;
        this.xOrto?.resolutionChange(resolution);
        this.yOrto?.resolutionChange(resolution);
        this.collinearlyTrackLine?.resolutionChange(resolution);
    }

    public dispose(): void {
        this.removeTrackLines();

    }

    public addTrackingPoint(point:Vector2){

        this.trackingPoints.push(point);
    }

    public removeTrackingPoints(point:Vector2){

        ArrayUtility.removeItemFromArray(this.trackingPoints, point);

    }

    public addTrackingEdge(...edge: IEditorEdge[]) {
        this.trackingEdges.push(...edge);
        
    }

    public removeTrackingEdge(edge: IEditorEdge) {
        ArrayUtility.removeItemFromArray(this.trackingEdges, edge);
    }

    public removeCollinearlyTrackLine(){
        this.collinearlyTrackLine?.dispose();
    }

    public removeTrackLines(): void {
        this.removeOrtoTrackLines();
        this.removeXPointTrackLine();
        this.removeYPointTrackLine();
        this.removeCollinearlyTrackLine();
    }

 
}