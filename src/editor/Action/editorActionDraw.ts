import { Vector2 } from "three";
import { ActionType, EditorAction, IEditorAction } from "./editorAction";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { IEditorDraw } from "../Draws/editorDraw";
import { IDrawTrack } from "../Draws/drawTrack";

export interface IEditorActionDraw extends IEditorAction{

}


export class EditorActionDraw extends EditorAction implements IEditorActionDraw {

    readonly actionType: ActionType = ActionType.ActionDraw;

    constructor(protected editorDraw: IEditorDraw, protected drawTrack: IDrawTrack, raycaster: IEditorRaycaster,  layer: IEditorLayer, resolution: Vector2) {

        super(raycaster, layer, resolution);
    }


    cancel(){

        this.editorDraw.cancel();
    }

    zoomChange(zoom: number): void {
       
        this.editorDraw.updateZoom(zoom);
    }

    resolutionChange(resolution: Vector2): void {
       
        super.resolutionChange(resolution);
        this.editorDraw.resolutionChange(resolution);
    }

    start(): void {
        this.setStartEvent();
    }

    end(): void {
        
    }

    private setStartEvent(){
        this.currentClickEvent = this.startDraw.bind(this);
    }

    private startDraw(e:MouseEvent){
        this.raycaster.updateReycaster();
        this.editorDraw.startDrawFromRay();
        this.rendererNeedUpdateCallback();
        this.currentOnPointerEvent = this.drawTemp.bind(this);
        this.currentClickEvent = this.drawClick.bind(this);
    }

    private drawTemp(e: PointerEvent){

        this.raycaster.updateReycaster();
        this.editorDraw.drawTemp(this.raycaster.getOrigin());
        this.rendererNeedUpdateCallback();

    }

    private drawClick(e:MouseEvent){
        this.raycaster.updateReycaster();
        this.editorDraw.drawClick(this.raycaster.getOrigin());
        this.rendererNeedUpdateCallback();
    }

}
