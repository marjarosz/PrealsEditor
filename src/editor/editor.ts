import { Color, OrthographicCamera, Scene, Vector2, WebGLRenderer } from "three";
import { IThreeInitializer } from "./threeInitializer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EditorGrid } from "./editorGrid";
import { CallbackMenager, ICallbackMenager } from "../Utility/callbackMenager";

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
     *Czy siatka jest wlaczona
     */
    readonly enableGrid: boolean;

    readonly currentZoom: number;

    setNewSize(newWidth: number, newHeight: number):void;
    
    enableDisableGrid(enable:boolean):boolean;

    subscribeZoomChange(callback:(currentZoom:number)=>void):void;
    unsubscribeZoomChange(callback:(currentZoom:number)=>void):void;

    render():void;
}

export class Editor implements IEditor{


    public readonly scene: Scene;

    public readonly camera: OrthographicCamera;

    public readonly renderer: WebGLRenderer;

    public readonly control: OrbitControls;

    get enableGrid(){
        return this._enableGrid;
    }

    get currentZoom(){
        return this.camera.zoom;
    }

    public resolution: Vector2;
    private startZoom = 1000;
    private _maxZoom: number;
    private _minZoom: number;
    private _scale: number = 100;
    private _grid?: EditorGrid;
    private _lastCameraValues:ILastCameraValues;
    private _enableGrid:boolean = true;

    private _zoomChangeCallbacks: ICallbackMenager<(currentZoom: number)=>void> = new CallbackMenager<(currentZoom: number)=>void>();

   // public readonly raycaster: IEditorRaycaster;

    constructor (private threeInitializer: IThreeInitializer, private width: number, private height: number){

        this.scene = threeInitializer.sceneInit(new Color(0xffffff));
        this.camera = threeInitializer.cameraInit(width, height, this.startZoom);
        this.renderer = threeInitializer.renedererInit(width, height, true);

        this._minZoom = this.camera.zoom * 0.25;
        this._maxZoom = this.camera.zoom * 50;

        this.control = threeInitializer.controlInit(this.camera, this.renderer.domElement, this._minZoom, this._maxZoom , false);
       
        this.control.addEventListener('change', this.controlChange.bind(this));

        this.resolution = new Vector2(width, height);

        this.createGrid();

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

        this._zoomChangeCallbacks.callCallback(this.camera.zoom);

    }

    subscribeZoomChange(callback:(currentZoom:number)=>void):void {
        this._zoomChangeCallbacks.addCallback(callback);
    }
    unsubscribeZoomChange(callback:(currentZoom:number)=>void):void {
        this._zoomChangeCallbacks.removeCallback(callback);
    }

}