import { Vector2 } from "three";
import { EditorDraw, IEditorDraw } from "./editorDraw";
import { IDrawPointer } from "../Pointers/drawPointer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { ILineSegmentEdge, LineSegmentEdge } from "../Edges/lineSegmentEdge";
import { IEditorRaycaster } from "../editorRaycaster";
import { IEditorLayer } from "../Layers/editorLayer";
import { DrawPointerCircleCross } from "../Pointers/drawPointerCircleCross";



export interface IEditorDrawFree extends IEditorDraw{

}


export class EditorDrawFree extends EditorDraw implements IEditorDrawFree {

    public drawColor:number = 0xa61830;
    public lineWidth:number = 3;

    private tempDrawPointer: IDrawPointer;

    private tempEdge: ILineSegmentEdge;
    

    constructor(raycaster: IEditorRaycaster, layer: IEditorLayer, resolution: Vector2, scale: number, zoom:number){
        super(raycaster, layer, resolution, scale, zoom);

        this.tempDrawPointer = new DrawPointerCircleCross(new Vector2(0,0), this.zoom, this.drawColor);
        this.tempEdge = new LineSegmentEdge(new Vector2(0,0), new Vector2(0,0), this.resolution, this.lineWidth, this.drawColor); 
    }

    startDraw(point: Vector2): void {
        super.startDraw(point);
        this.tempDrawPointer.updateStartPoint(point.clone(), this.resolution);
        this.tempDrawPointer.renderOrder = this.layer.renderOrder + 2;
        this.layer.group.add(this.tempDrawPointer.pointerGroup);
        this.tempEdge.startPoint = point;
        this.tempEdge.endPoint = point.clone();
        this.tempEdge.renderOrder = this.layer.renderOrder + 1;
        this.layer.group.add(this.tempEdge.lineObject);
       
    }

    drawTemp(point: Vector2): boolean {
        
        this.tempDrawPointer.updateStartPoint(point.clone(), this.resolution);
        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);
      
        
        return true;
        
    }

    updateZoom(zoom: number): void {

        super.updateZoom(zoom);
        this.raycaster.updateReycaster();
        this.tempDrawPointer.updateStartPoint(this.raycaster.getOrigin(), this.resolution);
        this.tempDrawPointer.updateZoom(zoom);

        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);
      
    }

    drawClick(point: Vector2): boolean {

        /**
         * Dodaj  pointer
         */
        const pointer = new DrawPointerCircle(point, this.zoom, this.drawColor);
        pointer.renderOrder = this.layer.renderOrder + 2;
        pointer.draw(this.resolution);
        
        /**
         * Dodaj linie
         */
        const edge = new LineSegmentEdge(this.pointers[this.pointers.length-1].sPoint, point, this.resolution, this.lineWidth, this.drawColor);
        edge.renderOrder = this.layer.renderOrder + 1;
        edge.updateModel(this.resolution);
        this.edges.push(edge);
        this.pointers.push(pointer);

        this.layer.group.add(pointer.pointerGroup);
        this.layer.group.add(edge.lineObject);

        /**
         * Zmien punkt startowy
         */
        this.tempEdge.startPoint = point;

        return true;
    }

    cancel(): void {
        this.tempDrawPointer.pointerGroup.removeFromParent();
        this.tempEdge.lineObject.removeFromParent();
    }

    resolutionChange(resolution: Vector2): void {
        this.resolution = resolution;

        this.tempEdge.updateResolution(resolution);
        this.layer.group.add(this.tempEdge.lineObject);

        for(const e of this.edges){
            e.lineObject.updateResolution(this.resolution);
            this.layer.group.add(e.lineObject);
        }

        this.tempDrawPointer.updateResolution(this.resolution);
        
        for(const p of this.pointers){
            p.updateResolution(this.resolution);
        }
        
    }

}