import { Intersection, Object3D, OrthographicCamera, PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";


export interface IEditorRaycaster {

    /**
     * Punkt
     */
    readonly pointer: Vector2;

    /**
     * Kamera
     */
    camera: OrthographicCamera | PerspectiveCamera;

    /**
     * Canvas renderowania
     */
    rendererDoomElement: HTMLCanvasElement;

    /**
     * Zaokraglanie wyjscia
     */
    digits: number | undefined;

    /**
     * Zaokraglenie wejscia
     */
    inputDigits: number | undefined;

    /**
     * 
     * Aktualizacja punktu z eventu
     * 
     * @param event 
     */
    updatePointer(event: PointerEvent | DragEvent): void;

    /**
     * 
     * Aktualizacja X i Y
     * 
     * @param x 
     * @param y 
     */
    updatePointerCords(x: number, y: number): void;

    /**
     * Aktualizacja raycastera
     */
    updateReycaster(): void;

    /**
     * 
     * Zwraca tabilce obiektoew przecietych promieniem
     * 
     * @param objects 
     * @param updateReycaster 
     */
    getRaycasterIntersect(objects: Object3D[], updateReycaster?: boolean):Intersection<Object3D>[];


    /**
     * Zwraca wartosc origin
     */
    getOrigin(): Vector2;

    //TODO - czy potzrebne
    /**
     * Zwraca zaokraglona wartosc origin
     * 
     * @param digits 
     */
    getOriginRound(digits?: number): Vector2

    /**
     * 
     * Usatw punkt na sztywno
     * 
     * @param point 
     */
    setPoint(point: Vector2): void;

}



export class EditorRaycaster implements IEditorRaycaster{

    private raycaster: Raycaster = new Raycaster();

    private _pointer = new Vector2();

   public digits: number | undefined = Infinity;
   
   public inputDigits: number | undefined = 3;

    get pointer(){
        return this._pointer;
    }


    constructor(public rendererDoomElement: HTMLCanvasElement, public camera: OrthographicCamera | PerspectiveCamera){

    }

    public updatePointer(event: PointerEvent | DragEvent){

        this._pointer.x = ( event.offsetX  / this.rendererDoomElement.clientWidth * 2)  - 1;
        this._pointer.y = -( event.offsetY  / this.rendererDoomElement.clientHeight * 2) + 1;

    }

    public updatePointerCords(x: number, y: number) {
        this._pointer.x = ( x  / this.rendererDoomElement.clientWidth * 2)  - 1;
        this._pointer.y = -( y  / this.rendererDoomElement.clientHeight * 2) + 1;
        
    }

    public updateReycaster(){
        // const params = {
        //     Mesh: { threshold: 0.1},
        //     Line: { threshold: 0.1},
        //     LOD: {},
        //     Points: { threshold: 0.1 },
        //     Sprite: {threshold: 0.1}
        // }


        this.raycaster.setFromCamera(this._pointer, this.camera);
    }

    public getRaycasterIntersect(objects: Object3D[], updateReycaster: boolean = true):Intersection<Object3D>[]{
        if(updateReycaster){
            
            this.updateReycaster();
        }
        
        return this.raycaster.intersectObjects( objects );
    }

    public getOrigin(): Vector2{

        return new Vector2(this.raycaster.ray.origin.x, this.raycaster.ray.origin.y);
    
    }

    public getOriginRound(digits?: number): Vector2{

        const dig = (digits) ? digits : this.digits;

        let retVec = new Vector2(this.raycaster.ray.origin.x, this.raycaster.ray.origin.y);
        this.round(retVec, dig);
       
        return retVec;
    }

    private round( vec: Vector2, dig?: number){
        if(dig == undefined){
          
            return;
        }
        if(dig != Infinity){
            const rx = vec.x.toFixed(dig);
            const ry = vec.y.toFixed(dig);
    
            vec.x = parseFloat(rx);
            vec.y = parseFloat(ry);

            return;
        } 

        vec.x = Math.fround(vec.x);
        vec.y = Math.fround(vec.y);


    }

    public setPoint(point: Vector2): void {
        this.raycaster.set(new Vector3(point.x, point.y, 0), new Vector3(0,0,1));

    }

    

}