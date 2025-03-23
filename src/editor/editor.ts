import { Color, OrthographicCamera, Scene, Vector2, WebGLRenderer } from "three";
import { IThreeInitializer } from "./threeInitializer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EditorGrid } from "./editorGrid";
import { CallbackMenager, ICallbackMenager } from "../Utility/callbackMenager";
import { EditorRaycaster, IEditorRaycaster } from "./editorRaycaster";
import { EditorLayer, IEditorLayer } from "./Layers/editorLayer";
import { EditorDrawLayer, IEditorDrawLayer } from "./Layers/editorDrawLayer";
import { ActionType, IEditorAction } from "./Action/editorAction";
import { EditorActionDrawFactory, EditorDrawType, IEditorActionDrawFactory } from "./Action/editorActionDrawFactory";
import { EditorActionDraw } from "./Action/editorActionDraw";
import { DrawTrack } from "./Draws/drawTrack";


interface ILastCameraValues {
    zoom: number;
    posX: number;
    posY: number;
}

export interface IEditor {

    /**
     * Scena
     */
    readonly scene: Scene;
    
    /**
     * Kamera
     */
    readonly camera: OrthographicCamera;

    /**
     * Renderer
     */
    readonly renderer: WebGLRenderer;

    /**
     * Control
     */
    readonly control: OrbitControls;
    
    /**
     * Raycaster
     */
    readonly raycaster: IEditorRaycaster;
    /**
     *Czy siatka jest wlaczona
     */
    readonly enableGrid: boolean;

    /**
     * Aktualny zoom
     */
    readonly currentZoom: number;

    /**
     * Czy mozliwe powiekszenie
     */
    readonly zoomInAvailable: boolean;

    /**
     * Czy mozliwe pomniejszenie
     */
    readonly zoomOutAvailable: boolean;

    /**
     * Skala
     */
    readonly scale:number;

    resolution: Vector2;



    setNewSize(newWidth: number, newHeight: number):void;
    
    enableDisableGrid(enable:boolean):boolean;



    /**
     * Powieksz
     */
    zoomIn():void;

    /**
     * Pomniejsz
     */
    zoomOut():void;

    /**
     * Anuluje akcje jezeli jest wybrana
     */
    cancelAction(runCallbacks?: boolean): void;

    /**
     * Rozpocznij rysowanie
     * @param drawType - typ rysowania
     */
    startDraw(drawType: EditorDrawType):void;
    
    render():void;

    /***Callbacks */


    subscribeZoomChange(callback:(currentZoom:number)=>void):void;
    unsubscribeZoomChange(callback:(currentZoom:number)=>void):void;

    subscribeCancelAction(callback: (canceledActionType:ActionType)=>void):void;
    unsubscribeCancelAction(callback: (canceledActionType:ActionType)=>void):void;

}

export class Editor implements IEditor{


    public readonly scene: Scene;

    public readonly camera: OrthographicCamera;

    public readonly renderer: WebGLRenderer;

    public readonly control: OrbitControls;

    public readonly raycaster: IEditorRaycaster;

    get enableGrid(){
        return this._enableGrid;
    }

    get currentZoom(){
        return this.camera.zoom;
    }

    get zoomInAvailable(){
        return (this.camera.zoom >= this._maxZoom) ? false: true;
    }

    get zoomOutAvailable(){
        return (this.camera.zoom <=this._minZoom) ? false: true;
    }

    get scale(){
        return this._scale;
    }

    public resolution: Vector2;
    private startZoom = 1000;
    private _maxZoom: number;
    private _minZoom: number;
    private _scale: number = 100;
    private _grid?: EditorGrid;
    private _currentAction: IEditorAction | undefined;

    private _lastCameraValues:ILastCameraValues;
    private _enableGrid:boolean = true;
    private _cameraInOutMulti: number = 1.25;
    private _currentMousePositionX: number = 0;
    private _currentMousePositionY: number = 0;
    
    private _mouseInEditor = false;
    private _layers: IEditorLayer[] = [];
    private _currentLayer: IEditorLayer | undefined;
    private _actionDrawFactory: IEditorActionDrawFactory = new EditorActionDrawFactory();

    /**
     * Eventy przypisywane do akcji
     */
    private currentClickEvent: (e:MouseEvent) =>void = ()=>{};
    private currentOnPointerEvent: (e: PointerEvent)=>void = ()=>{};
    private currentMouseUpEvent: (e: MouseEvent)=>void=()=>{};
    private currentMouseDownEvent: (e: MouseEvent)=>void=()=>{};

   // public readonly raycaster: IEditorRaycaster;

    /**
     * Callbacks
     */
    private _zoomChangeCallbacks: ICallbackMenager<(currentZoom: number)=>void> = new CallbackMenager<(currentZoom: number)=>void>();
    private _cancelActionCallbacks: ICallbackMenager<(canceledActionType: ActionType)=>void> = new CallbackMenager<(canceledActionType: ActionType)=>void>();


    constructor (private threeInitializer: IThreeInitializer, private width: number, private height: number){

        this.scene = threeInitializer.sceneInit(new Color(0xffffff));
        this.camera = threeInitializer.cameraInit(width, height, this.startZoom);
        this.renderer = threeInitializer.renedererInit(width, height, true);

        this._minZoom = this.camera.zoom * 0.25;
        this._maxZoom = this.camera.zoom * 50;

        this.control = threeInitializer.controlInit(this.camera, this.renderer.domElement, this._minZoom, this._maxZoom , false);
       
        /**
         * Eventy
         */
        this.control.addEventListener('change', this.controlChange.bind(this));

        this.renderer.domElement.addEventListener('pointermove', 
            (e)=>{this.onPointerEvent(e)}
        );
        this.renderer.domElement.addEventListener('click', 
            (e)=>{this.currentClickEvent(e)}
        );


        this.renderer.domElement.addEventListener('mousedown', 
            (e)=>{this.mouseDownEvent(e)}
        );
        this.renderer.domElement.addEventListener('mouseup', 
            (e)=>{this.mouseUpEvent(e)}
        );
        
        this.renderer.domElement.addEventListener('dblclick', 
            (e)=>{}
        );
        this.renderer.domElement.addEventListener('mouseleave', 
            (e)=>{this._mouseInEditor = false}
        );
        this.renderer.domElement.addEventListener('mouseenter', 
            (e)=>{this._mouseInEditor = true}
        );

        this.resolution = new Vector2(width, height);

        this.raycaster = new EditorRaycaster(this.renderer.domElement, this.camera);
        this.raycaster.updateReycaster();

        this.createGrid();
        this.createLayers();

        this._lastCameraValues = {
            zoom: this.camera.zoom,
            posX: this.camera.position.x,
            posY: this.camera.position.y
        }

        this.render();
       
    

    }


    public enableDisableGrid(enable: boolean): boolean {
        
  
        this._enableGrid = enable;

        if(enable) {
            this.createGrid();
        } else {
            this.removeGrid();
        }

        this.render();
        return this._enableGrid;
    }

    public render(){
        this.renderer.render(this.scene, this.camera);
    }

    public setNewSize(newWidth: number, newHeight: number){

       
        this.width = newWidth;
        this.height = newHeight;
        this.renderer.setSize(newWidth, newHeight, true);
        this.renderer.setScissor(0,0, newWidth, newHeight);
        
        //OrtoCamera
        this.camera.left = newWidth /-2;
        this.camera.right = newWidth / 2;
        this.camera.top = newHeight / 2;
        this.camera.bottom = newHeight / -2;
        
        this.camera.updateProjectionMatrix();
        this.camera.updateMatrixWorld();
        this.control.update();
        
        this.resolution.x = newWidth;
        this.resolution.y = newHeight;

        

        // for(const l of this._layers){
        //     l.resolutionChanged();
        // }

        this.createGrid();

        if(this._currentAction){
            this._currentAction.resolutionChange(this.resolution);
        }

        this.render();

      
    }


    private createGrid(){
        this.removeGrid();

        if(!this._enableGrid) {
            return;
        }

        this._grid = new EditorGrid(this.camera, 0xc7c7c7, 1, this._scale);
        this._grid.position.z = 0;
        this.scene.add(this._grid);

    }

    private removeGrid(){
        
        if(this._grid){
            this._grid.removeFromParent();
            this._grid.dispose();
        }
    }

    private controlChange(){


        let zoomchanged = false;
        let camPosChanged = false;

        if(this._lastCameraValues.zoom != this.camera.zoom){
            this._lastCameraValues.zoom = this.camera.zoom;
            zoomchanged = true;
          
            this.zoomChanged();
            

        }

        if(this._lastCameraValues.posX != this.camera.position.x || this._lastCameraValues.posY != this.camera.position.y){
            this._lastCameraValues.posX = this.camera.position.x;
            this._lastCameraValues.posY = this.camera.position.y;
            camPosChanged = true;
            // for(const l of this.layers){
            //     l.cameraPositionChange(this.camera, this._scale);
            // }
           
        }

        if(zoomchanged || camPosChanged){
            this.createGrid();
        }

        this.render();
    }

    private zoomChanged(){

        this._currentAction?.zoomChange(this.camera.zoom);
        this._zoomChangeCallbacks.callCallback(this.camera.zoom);

    }

    subscribeZoomChange(callback:(currentZoom:number)=>void):void {
        this._zoomChangeCallbacks.addCallback(callback);
    }
    unsubscribeZoomChange(callback:(currentZoom:number)=>void):void {
        this._zoomChangeCallbacks.removeCallback(callback);
    }


    zoomIn(): void {

        if(this.zoomInAvailable) {
             const newZoom = this.camera.zoom * this._cameraInOutMulti;
             const setZoom = (newZoom < this.control.maxZoom) ? newZoom : this.control.maxZoom;
             this.camera.zoom = setZoom ;
             this.threeInitializer.updateMatrixCamera(this.camera);
             this.controlChange();
        }
 
    }
 
    zoomOut(): void {
 
         if(this.zoomOutAvailable){
             const newZoom = this.camera.zoom / this._cameraInOutMulti;
             const setZoom = (newZoom > this.control.minZoom) ? newZoom : this.control.minZoom;
             this.camera.zoom = newZoom;
             this.threeInitializer.updateMatrixCamera(this.camera);
             this.controlChange();
         }
    }

   private onPointerEvent(event: PointerEvent){

        this.setRaycaterPoint(event);
        this.currentOnPointerEvent(event);

   }

   private mouseUpEvent(event: MouseEvent){
        
        if(event.button == 2) {
            this.render();
        }
        this.currentMouseUpEvent(event);
    }

    private mouseDownEvent(event: MouseEvent){
   
        this.currentMouseDownEvent(event);
    }


   private setRaycaterPoint(event : PointerEvent | DragEvent){

        this._currentMousePositionX = event.offsetX;
        this._currentMousePositionY = event.offsetY;
        this.raycaster.updatePointer(event);
      

    }

    private cancelPanning(runCallback: boolean){
        // if(this.control.leftMousePannningEnable) {
        //     this.control.leftMousePannningEnable = false;
        //     if(runCallback){
        //         for(const callback of this.cancelActionCallback){
        //             callback();
        //         }
                
        //     }

        //     this.control.touches.ONE = TOUCH.ROTATE;
        //     this.control.touches.TWO = TOUCH.DOLLY_PAN;
        // }
   }

   panningAction(): void {
        
        // if(this._selectedLayer) {
        //     this._selectedLayer.removeSelectedShape();
        // }

        // this.cancelAction(false);
        // this.control.leftMousePannningEnable = true;
        // this.control.touches.ONE = TOUCH.PAN;
        // this.control.touches.TWO = TOUCH.DOLLY_ROTATE;

   }

   private createLayers(){

        const drawLayer:IEditorDrawLayer = new EditorDrawLayer();
        this._layers.push(drawLayer);
        this.scene.add(drawLayer.group);

        //TODO - tymczasowo
        this._currentLayer = drawLayer;
        

   }


   public cancelAction(runCallback: boolean = false){

        
        if(this._currentAction) {

            const currentType = this._currentAction.actionType;
            this._currentAction.cancel();
            this._currentAction = undefined;

            if(runCallback) {
                this._cancelActionCallbacks.callCallback(currentType);
            }
            this.render();
            this.resetActionEvent();
            this._currentAction = undefined;
        }
        

   }

   public startDraw(drawType: EditorDrawType){

        this.cancelAction();

        if(this._currentLayer == undefined){
            return;
        } 
        
        const drawTrack = new DrawTrack(this.raycaster, this.resolution, this._currentLayer.group, this.renderer.pixelRatio);
        const draw = this._actionDrawFactory.getEditorDrawType(EditorDrawType.free, this.raycaster, drawTrack, this._currentLayer, this.resolution, this._scale, this.camera.zoom);
        
        drawTrack.renderOrder = this._currentLayer.renderOrder;
        this._currentAction = new EditorActionDraw(draw, drawTrack, this.raycaster, this._currentLayer, this.resolution);

        this._currentAction.zoomChange(this.camera.zoom);
        this.setActionEvent();
        this._currentAction.start();

        console.log(this._currentAction);

   }

   subscribeCancelAction(callback: (canceledActionType:ActionType)=>void):void{

        this._cancelActionCallbacks.addCallback(callback);
   }
   unsubscribeCancelAction(callback: (canceledActionType:ActionType)=>void):void {
        
        this._cancelActionCallbacks.removeCallback(callback);

   }

   private setActionEvent(){

        if(this._currentAction == undefined){
            return;
        } 

        this._currentAction.rendererNeedUpdateCallback = this.render.bind(this);
        this.currentClickEvent = this._currentAction.clickEvent.bind(this._currentAction);
        this.currentOnPointerEvent = this._currentAction.onPointerEvent.bind(this._currentAction);

   }

   private resetActionEvent(){

        this.currentClickEvent = ()=>{};
        this.currentOnPointerEvent = ()=>{};

   }

}