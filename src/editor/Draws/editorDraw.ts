import { Vector2 } from "three";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { IDrawPointer } from "../Pointers/drawPointer";
import { IEditorEdge } from "../Edges/editorEdge";

export interface IEditorDraw {

    updateZoom(zoom:number): void;

    startDrawFromRay():void;

    startDraw(point: Vector2):void;

    drawPointer(point: Vector2):boolean;

    drawTemp(point: Vector2):boolean;

    drawClick(point: Vector2):boolean;

    cancel():void;

}

export class EditorDraw {


    protected pointers: IDrawPointer[] = [];

    protected edges: IEditorEdge[] = [];
 
    constructor(public raycaster: IEditorRaycaster, protected readonly layer: IEditorLayer, protected resolution: Vector2, public scale: number, protected zoom:number) {


    }

    startDrawFromRay(){
        
        const point = this.raycaster.getOrigin();

        this.startDraw(point);
    }

    startDraw(point: Vector2){

        this.drawPointer(point);

    }

    drawPointer(point: Vector2){
    
        const pointer = new DrawPointerCircle(point, this.zoom);
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

    }

    

}