import { Vector2 } from "three";
import { ActionType, EditorAction, IEditorAction } from "./editorAction";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { IEditorDraw } from "../Draws/editorDraw";

export interface IEditorActionDraw extends IEditorAction{

}


export class EditorActionDraw extends EditorAction implements IEditorActionDraw {

    readonly actionType: ActionType = ActionType.ActionDraw;

    constructor(protected editorDraw: IEditorDraw, raycaster: IEditorRaycaster,  layer: IEditorLayer, resolution: Vector2) {

        super(raycaster, layer, resolution);
    }


    cancel(){

    }

    zoomChange(zoom: number): void {
        this.editorDraw.updateZoom(zoom);
    }



    start(): void {
        this.setStartEvent();
    }

    end(): void {
        
    }

    private setStartEvent(){
        this.currentClickEvent = this.addPoint.bind(this);
    }

    private addPoint(){
        this.raycaster.updateReycaster();
        this.editorDraw.startDrawFromRay();
        this.rendererNeedUpdateCallback();
    }

}
