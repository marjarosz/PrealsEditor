import { Color, MeshBasicMaterial, Vector2 } from "three";
import { DrawObject } from "../drawObject";
import { IDrawPointer, IPointerGroup, PointerGroup } from "./drawPointer";
import { Object3DUtility } from "../../Utility/object3DUtility";
import { PrimitiveCircle } from "../PrimitivesPoints/primitiveCircle";
import { MeshUtility } from "../../Utility/meshUtility";



export class DrawPointerCircle extends DrawObject implements IDrawPointer{


    protected meshMaterial: MeshBasicMaterial;

    protected radius:number = 1.5;

    readonly pointerGroup: IPointerGroup = new PointerGroup();

    public scaleMultiple: number = 1;

    protected edgesColor: number = 0x000000;

    get vissible(){
        return this.pointerGroup.visible;
    }

    set vissible(value: boolean){
        this.pointerGroup.visible = value;
    }

    get fillColor(){
        return this.meshMaterial.color;
    }

    set fillColor(value: Color){
        this.meshMaterial.color = value;
    }

    constructor(public sPoint: Vector2, protected zoom: number,  color?: number){
       
        super();
        if(color != undefined) {
            this.edgesColor = color;
        }
        this.meshMaterial = new MeshBasicMaterial( { color: 0xFFFFFF, transparent: true } );
        this.pointerGroup.pointerParent = this;
      

    }

    clone(){
        const pointer = new DrawPointerCircle(this.sPoint.clone(), this.zoom, 
            this.meshMaterial.color.r * this.meshMaterial.color.g * this.meshMaterial.color.b);
        return pointer;
        
    }

    draw(resolution?: Vector2 | undefined): void {
        this.drawCircle(resolution);
    }

    updateZoom(zoom: number,resolution: Vector2): void {
      
        this.zoom = zoom;
       // this.drawSquare(this.sPoint, zoom, resolution);
      // this.drawCircle(resolution);
       this.scaleGroupByZoom();
    }

    updateResolution(resolution: Vector2): void {
        this.drawCircle(resolution);
    }

    updateStartPoint(sPoint: Vector2, resolution: Vector2){
        this.sPoint = sPoint;
        this.drawCircle(resolution);
    }

    public setFillColor(color: number): void {
        const c = new Color(color);
        this.meshMaterial.color = c;
    }

    dispose(): void {
        
        this.clearGroup();
        this.meshMaterial.dispose();
        this.pointerGroup.removeFromParent();
 
    }

    protected clearGroup() {
        for(const c of this.pointerGroup.children){
            c.removeFromParent();
            Object3DUtility.disposeObject(c);
        }

        this.pointerGroup.clear();
    }

    protected scaleGroupByZoom(){
        const scale = 2.6458333333 * this.scaleMultiple / this.zoom;
        this.pointerGroup.scale.set(scale, scale, 1);
        this.pointerGroup.position.set(this.sPoint.x, this.sPoint.y, 0);
        this.pointerGroup.updateMatrixWorld();

    }

    protected drawCircle(resolution?: Vector2){

        this.clearGroup();
        this.drawCircleObject(resolution);
        this.scaleGroupByZoom();

    }

    protected drawCircleObject(resolution?: Vector2){
        const prim = new PrimitiveCircle(this.sPoint, this.radius);
        const edges = prim.getEdges(resolution, 2, this.edgesColor);
        const mesh = MeshUtility.getMeshFromEdges(edges, this.meshMaterial);
        mesh.renderOrder = this.renderOrder;
        this.pointerGroup.add(mesh);
        for(const e of edges ){
            e.lineObject.renderOrder = this.renderOrder+1;
            this.pointerGroup.add(e.lineObject);
        }
    }

}