import { Vector2 } from "three";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";

export interface IEditorDraw {

    updateZoom(zoom:number): void;

    startDrawFromRay():void;

    startDraw(point: Vector2):void;


}

export class EditorDraw {

    protected _zoom:number = 1;

    constructor(public raycaster: IEditorRaycaster, protected readonly layer: IEditorLayer, protected resolution: Vector2, public scale: number) {


    }

    startDrawFromRay(){
        
        const point = this.raycaster.getOrigin();

        this.startDraw(point);
    }

    startDraw(point: Vector2){

        console.log("Start DRAW")
        const pointer = new DrawPointerCircle(point, this._zoom);
        pointer.draw();
        this.layer.group.add(pointer.pointerGroup);

    }

    updateZoom(zoom: number): void {
        
        this._zoom = zoom;
    }

}