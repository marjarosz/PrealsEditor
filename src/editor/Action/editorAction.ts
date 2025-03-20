import { Vector2 } from "three";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";

export enum ActionType {
    ActionSelect = 0,
    ActionDraw = 1,
    //ActionEdit = 2,
    //ActionMove = 3,
    //ActionRotate = 4,
    //ActionDevide = 5,
    //ActionUnDevide = 6,
    //ActionMeasure = 7,
   // ActionDelete = 8,
    //DrawMarker = 9,
    //ActionRounding = 10,
    //ActionChangeAngle = 11,
    //ActionDropShape = 12,
    //RotateNinety = 13,
    //Trimming = 14,
    //ActionRenderOrderChange = 15,
   // ActionAlign = 16,
    //ActionPaste = 17
}


export interface IEditorAction {

    readonly actionType:ActionType;

    start():void;

    end():void;

    cancel():void;

    zoomChange(zoom: number):void;

    resolutionChange(resolution: Vector2):void;

    /**
     * 
     * Wymagana aktualizacja rederera
     * 
     */
    rendererNeedUpdateCallback: ()=>void;

    /**
     * 
     * Event click
     * 
     * @param e 
     */
    clickEvent(e: MouseEvent): void;
    

    /**
     * 
     * Event OnPointerEvent
     * 
     * @param e 
     */
    onPointerEvent(e: PointerEvent): void
    
    /**
     * 
     * Event MouseUp
     * 
     * @param e 
     */
    mouseUpEvent(e: MouseEvent): void
    
    /**
     * 
     * Event MouseDown
     * 
     * @param e 
     */
    mouseDownEvent(e: MouseEvent): void

}

export class EditorAction{


    protected currentClickEvent: (e: MouseEvent)=>void = ()=>{}

    protected currentOnPointerEvent: (e: PointerEvent)=>void = ()=>{}

    constructor(protected readonly raycaster: IEditorRaycaster,  protected readonly layer: IEditorLayer, protected resolution: Vector2) {

    }

    resolutionChange(resolution: Vector2): void {
        this.resolution = resolution;   
    }

    rendererNeedUpdateCallback: ()=>void = ()=>{};
    
    /**
     * 
     * Event click
     * 
     * @param e 
     */
    clickEvent(e: MouseEvent): void {
        this.currentClickEvent(e);
    }
    

    /**
     * 
     * Event OnPointerEvent
     * 
     * @param e 
     */
    onPointerEvent(e: PointerEvent): void {
        this.currentOnPointerEvent(e);
    }
    
    /**
     * 
     * Event MouseUp
     * 
     * @param e 
     */
    mouseUpEvent(e: MouseEvent): void {

    }
    
    /**
     * 
     * Event MouseDown
     * 
     * @param e 
     */
    mouseDownEvent(e: MouseEvent): void {

    }


}