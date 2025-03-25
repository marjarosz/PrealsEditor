import { Vector2 } from "three";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { IDrawPointer } from "../Pointers/drawPointer";
import { IEditorEdge } from "../Edges/editorEdge";
import { IDrawTrack } from "./drawTrack";

export interface IEditorDraw {

    updateZoom(zoom:number): void;

    resolutionChange(resolution:Vector2):void;

    startDrawFromRay():void;

    startDraw(point: Vector2):void;

    drawPointer(point: Vector2):boolean;

    drawTemp(point: Vector2):boolean;

    drawClick(point: Vector2):boolean;

    cancel():void;

    drawColor:number;

}

export class EditorDraw {

    public drawColor:number = 0x000000;

    protected pointers: IDrawPointer[] = [];

    protected edges: IEditorEdge[] = [];
 
    constructor(public raycaster: IEditorRaycaster, protected drawTrack:IDrawTrack, protected readonly layer: IEditorLayer, protected resolution: Vector2, public scale: number, protected zoom:number) {


    }

    startDrawFromRay(){
        
        const point = this.raycaster.getOrigin();

        this.startDraw(point);
    }

    startDraw(point: Vector2){

        this.drawPointer(point);

    }

    drawPointer(point: Vector2){
    
        const pointer = new DrawPointerCircle(point, this.zoom, this.drawColor);
        pointer.renderOrder = this.layer.renderOrder + 2;
        this.pointers.push(pointer);
        pointer.draw();
        this.layer.group.add(pointer.pointerGroup);
        return true;
    }

    updateZoom(zoom: number): void {
        
        this.zoom = zoom;
        for(const p of this.pointers){
            p.updateZoom(zoom);
        }
        this.drawTrack.updateZoom(zoom);

    }

    resolutionChange(resolution:Vector2){
        this.resolution = resolution;
        
    }

    cancel(){
        this.drawTrack.dispose();
    }

    protected showOrtoTrack(startPoint: Vector2, point?:Vector2){
        this.drawTrack.setOrtoTrackLine(startPoint, point);
 
    }
    

}