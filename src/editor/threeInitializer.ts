import { WebGLRenderer, Scene, OrthographicCamera, Color, Camera} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

//import {OrbitControls} from '../js/editorControls'


export interface IThreeInitializer {


    /**
     * 
     * Ustawia rozmiar renderera
     * 
     * @param renderer 
     * @param width 
     * @param height 
     */
    setRendererSize(renderer:WebGLRenderer, width: number, height: number): void;
    
    /**
     * 
     * Inicjacja WebGlRenderer
     * 
     * @param width 
     * @param height 
     * @param antialias 
     */
    renedererInit(width: number, height: number, antialias: boolean): WebGLRenderer;

    /**
     * 
     * Inicjacja sceny
     * 
     * @param backgroundColor 
     */
    sceneInit(backgroundColor:Color): Scene;


    /**
     * 
     * Iniscjacja kamery
     * 
     * @param width 
     * @param height 
     * @param zoom 
     */
    cameraInit(width: number, height: number, zoom:number): OrthographicCamera

    /**
     * 
     * Ustawia rozmiar kamery
     * 
     * @param camera 
     * @param width 
     * @param height 
     */
    setCameraSize(camera: OrthographicCamera, width: number, height: number): void;

    /**
     * 
     * Inicjacja Orbit Controls
     * 
     * @param camera 
     * @param doomElement 
     * @param minZoom 
     * @param maxZoom 
     * @param disableControlLimits 
     */
    controlInit(camera: Camera, doomElement:HTMLElement, minZoom: number, maxZoom: number, disableControlLimits: boolean): OrbitControls


    updateMatrixCamera(camera: OrthographicCamera): void;

}

export class ThreeInitializer implements IThreeInitializer {

    public setRendererSize(renderer:WebGLRenderer, width: number, height: number){

        renderer.setSize(width, height, true);
        renderer.setScissor(0,0,width, height);
        //renderer.domElement.width = width;
        //renderer.domElement.height = height;

    }

    public renedererInit(width: number, height: number, antialias: boolean, canvas?: HTMLCanvasElement): WebGLRenderer {
        
        const renderer = new WebGLRenderer({antialias:antialias, powerPreference: "high-performance", canvas: canvas});
        
        renderer.setPixelRatio( window.devicePixelRatio);
       // renderer.toneMapping =ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.7;
        //renderer.outputEncoding = sRGBEncoding;
        this.setRendererSize(renderer, width, height);
        renderer.shadowMap.enabled =false;
        renderer.localClippingEnabled = false;
        return renderer;

    }

    public sceneInit(backgroundColor:Color): Scene {
        
        const scene = new Scene(); 
        scene.background = backgroundColor;
        return  scene;
        
    }

    public cameraInit(width: number, height: number, zoom:number){
        
        const cam = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2,0.1, 100000);        
        cam.zoom = zoom;
        cam.position.x = 0
        cam.position.y = 0;
        cam.position.z = 10;
        cam.castShadow = false;
        this.updateMatrixCamera(cam);
        return cam;

    }

    public setCameraSize(camera: OrthographicCamera, width: number, height: number){

        camera.left = width /-2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        this.updateMatrixCamera(camera);

    }

    public controlInit(camera: Camera, doomElement:HTMLElement, minZoom: number, maxZoom: number, disableControlLimits: boolean){
        
        const controls = new OrbitControls( camera, doomElement );
        controls.maxZoom = maxZoom;
        controls.minZoom = minZoom;
        controls.enablePan = true;
        controls.screenSpacePanning = true;
        controls.target.set( 0, 0, 0 );
        controls.enableRotate = false;
        if(!disableControlLimits){
            controls.maxPolarAngle = 100/180*Math.PI;
        }       
        controls.autoRotate = false;       
        controls.update();
        return controls;

    }

    public updateMatrixCamera(camera: OrthographicCamera){
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
    }

}