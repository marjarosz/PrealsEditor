import { Group, Vector2 } from "three";
import {IEditorRaycaster } from "../editorRaycaster"
import { EditorUtility } from "../../Utility/editorUtility";
import { ITrackLine, TrackLine } from "./trackLine";
import { EditorMath } from "../../Utility/editorMath";
import { ArrayUtility } from "../../Utility/arrayUtility";

export interface IDrawTrackInfo {

    point: Vector2;
    isPoint: boolean;
}

export interface IDrawTrack {

    renderOrder:number;

    /**
     * Od jakiej odleglosci punktu do linni sledzenia pozioma / pionowa umiejscic punkt na prostej w px
     */
    normalTrackSize:number;

    normalTrackColor: number;

    pointTrackSize: number;

    pointTrackColor: number;

    setOrtoTrackLine(currentPoint: Vector2, point?: Vector2):void;

    updateOrtoTrackLine(point?:Vector2, startPoint?:Vector2):void;

    updateZoom(zoom:number):void;

    resolutionChange(resolution: Vector2):void;

    removeOrtoTrackLines():void;

    dispose():void;

    getOrtoTrack(point: Vector2):IDrawTrackInfo;

    getPointTrack(point:Vector2):IDrawTrackInfo;

    addTrackingPoint(point:Vector2):void

    removeTrackingPoints(point:Vector2):void;
}

export class DrawTrack implements IDrawTrack {

    public renderOrder: number = 1;

    public normalTrackSize: number = 10;

    public normalTrackColor: number = 0xfdff00;

    public pointTrackSize: number  = 10;

    public pointTrackColor: number = 0x00a7ff;

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



    protected trackingPoints: Vector2[] = [];

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

        
        this.xOrto =  new TrackLine(currentPoint, normals[0],this.normalTrackColor, this.resolution, 5);
        this.xOrto.renderOrder = this.renderOrder;
        this.xOrto.zoomUpdate(this.raycaster.camera.zoom);
      
        this.group.add(this.xOrto.trackGroup);
        this.yOrto = new TrackLine(currentPoint, normals[1],this.normalTrackColor, this.resolution, 5);
        this.yOrto.renderOrder = this.renderOrder;
        this.yOrto.zoomUpdate(this.raycaster.camera.zoom);
       
        this.group.add(this.yOrto.trackGroup);

    

    }

    public setPointXTrackLine(sPoint: Vector2, ePoint:Vector2){

        if(!this._drawTrackEnable || !this._pointTrackEnable) {return}

        if(this.xPointTrackLine) {
            this.removeXPointTrackLine();
        }

        this.xPointTrackLine = this.createDashedTrackLine(sPoint, ePoint, this.pointTrackColor);
    }

    public setPointYTrackLine(sPoint: Vector2, ePoint:Vector2) {

        if(!this._drawTrackEnable || !this._pointTrackEnable) {return}

        if(this.xPointTrackLine) {
            this.removeYPointTrackLine();
        }

        this.yPointTrackLine = this.createDashedTrackLine(sPoint, ePoint, this.pointTrackColor);

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

    protected createDashedTrackLine(sPoint:Vector2, ePoint:Vector2, color: number){

        const tl = new TrackLine(sPoint, ePoint, this.pointTrackColor, this.resolution, 5);
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
            isPoint: false
        }
        /**
         * Os X
         */
        if(this.xOrto) {
            let disY = new Vector2(0, this.xOrto.sPoint.y).distanceTo(new Vector2(0, point.y));
            disY = EditorMath.meterToPixels(disY);
            if(disY <= this.normalTrackSize){
                ret.point = new Vector2(point.x, this.xOrto.sPoint.y);
                ret.isPoint = true;
            }
        }
        
        /**
         * Os Y
         */
        if(this.yOrto) {
            let disX = new Vector2(this.yOrto.sPoint.x, 0).distanceTo(new Vector2(point.x, 0));
            disX = EditorMath.meterToPixels(disX);
            if(disX <= this.normalTrackSize) {
                ret.point = new Vector2(this.yOrto.sPoint.x, point.y);
                ret.isPoint = true;
            }
        }

        return ret;
    }

    public getPointTrack(point:Vector2){
        const ret:IDrawTrackInfo = {
            point: point,
            isPoint: false
        }

        let pointX:Vector2 | undefined;
        let pointY:Vector2 | undefined;

        for(const p of this.trackingPoints) {

            //Punkt po ois X
            let disX = new Vector2(p.x, 0).distanceTo(new Vector2(point.x, 0));
            disX = EditorMath.meterToPixels(disX, this.pixelRatio);

            if(disX <= this.pointTrackSize) {
                console.log("JEST point X")
                pointX = p;
            }
            
            //Punkt po osi Y

            let disY = new Vector2(0, p.y).distanceTo(new Vector2(0, point.y));
            disY = EditorMath.meterToPixels(disY, this.pixelRatio);

            if(disY <= this.pointTrackSize) {
                pointY = p
                
            }

            if(pointX) {
                this.setPointXTrackLine(pointX, new Vector2(pointX.x, point.y));
            } else {
                this.removeXPointTrackLine();
            }

            if(pointY) {
                this.setPointYTrackLine(pointY, new Vector2(point.x, pointY.y));
            } else {
                this.removeYPointTrackLine();
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
    }

    public resolutionChange(resolution: Vector2): void {
        this.resolution = resolution;
        this.xOrto?.resolutionChange(resolution);
        this.yOrto?.resolutionChange(resolution);
    
    }

    public dispose(): void {
        this.removeOrtoTrackLines();
    }

    public addTrackingPoint(point:Vector2){

        this.trackingPoints.push(point);
    }

    public removeTrackingPoints(point:Vector2){

        ArrayUtility.removeItemFromArray(this.trackingPoints, point);

    }

 
}