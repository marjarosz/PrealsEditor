import { Group, Vector2 } from "three";
import {IEditorRaycaster } from "../editorRaycaster"
import { EditorUtility } from "../../Utility/editorUtility";
import { ITrackLine, TrackLine } from "./trackLine";
import { EditorMath } from "../../Utility/editorMath";

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

    setNormalTrackLine(currentPoint: Vector2, point?: Vector2):void;

    updateNormalTrackLine(point?:Vector2, startPoint?:Vector2):void;

    updateZoom(zoom:number):void;

    resolutionChange(resolution: Vector2):void;

    removeNotmalTrack():void;

    dispose():void;

    getNormalTrack(point: Vector2):IDrawTrackInfo;
}

export class DrawTrack implements IDrawTrack {

    public renderOrder: number = 1;

    public normalTrackSize: number = 10;

    public normalTrackColor: number = 0xfdff00;

    private _drawTrackEnable:boolean = true;

    private _normalTrackEnable: boolean = true;

    /**
     * Linnia slzedzenia poziomo
     */
     private xNormal: ITrackLine | undefined;
    /**
    * Linnia slzedzenia pionowo
     */
    private yNormal: ITrackLine | undefined;

    constructor(private readonly raycaster:IEditorRaycaster, private resolution:Vector2, private group:Group, private pixelRatio: number){
        
    }

    public setNormalTrackLine(currentPoint: Vector2, point?: Vector2){

        //const linePoint = (point) ? point : this.raycaster.origin.clone();

        if(!this._drawTrackEnable || !this._normalTrackEnable) {return};


        const linePoint = (point) ? point : this.raycaster.getOrigin();
        //const camPoints = EditorUtility.getCamViewMinMaxPoints(this.raycaster.camera);

        const normals = this.getNormalXY(currentPoint, linePoint);

        if(this.xNormal) {
            this.xNormal.dispose();
        }


        if(this.yNormal){
            this.yNormal.dispose();
        }

        
        this.xNormal =  new TrackLine(currentPoint, normals[0],this.normalTrackColor, this.resolution, 5);
        this.xNormal.zoomUpdate(this.raycaster.camera.zoom);
        this.xNormal.trackGroup.renderOrder = this.renderOrder;
        this.group.add(this.xNormal.trackGroup);
        this.yNormal  = new TrackLine(currentPoint, normals[1],this.normalTrackColor, this.resolution, 5);
        this.yNormal.zoomUpdate(this.raycaster.camera.zoom);
        this.yNormal.trackGroup.renderOrder = this.renderOrder;
        this.group.add(this.yNormal.trackGroup);

    

    }

    updateNormalTrackLine(point?:Vector2, startPoint?:Vector2){

        if(!this.xNormal || !this.yNormal){
            return;
        }
        const linePoint = (point) ? point : this.raycaster.getOrigin();
        const startP = (startPoint) ? startPoint : this.xNormal.sPoint;
        const normals = this.getNormalXY(startP, linePoint);
        this.xNormal.setNewPoints(startP, normals[0]);
        this.yNormal.setNewPoints(startP, normals[1]);
        this.xNormal.zoomUpdate(this.raycaster.camera.zoom);
        this.yNormal.zoomUpdate(this.raycaster.camera.zoom);
    }

    private getNormalXY(startPoint: Vector2, linePoint:Vector2):[Vector2, Vector2]{

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

    getNormalTrack(point: Vector2){

        const ret:IDrawTrackInfo = {
            point: point,
            isPoint: false
        }
        /**
         * Os X
         */
        if(this.xNormal) {
            let disY = new Vector2(0, this.xNormal.sPoint.y).distanceTo(new Vector2(0, point.y));
            disY = EditorMath.meterToPixels(disY);
            if(disY <= this.normalTrackSize){
                ret.point = new Vector2(point.x, this.xNormal.sPoint.y);
                ret.isPoint = true;
            }
        }
        
        /**
         * Os Y
         */
        if(this.yNormal) {
            let disX = new Vector2(this.yNormal.sPoint.x, 0).distanceTo(new Vector2(point.x, 0));
            disX = EditorMath.meterToPixels(disX);
            if(disX <= this.normalTrackSize) {
                ret.point = new Vector2(this.yNormal.sPoint.x, point.y);
                ret.isPoint = true;
            }
        }

        return ret;
    }

  

    removeNotmalTrack(){
        this.xNormal?.dispose();
        this.yNormal?.dispose();
    }

    updateZoom(zoom: number): void {
        
        this.xNormal?.zoomUpdate(zoom);
        this.yNormal?.zoomUpdate(zoom);
    }

    resolutionChange(resolution: Vector2): void {
        this.resolution = resolution;
        this.xNormal?.resolutionChange(resolution);
        this.yNormal?.resolutionChange(resolution);
    
    }


    dispose(): void {
        this.removeNotmalTrack();
    }
}