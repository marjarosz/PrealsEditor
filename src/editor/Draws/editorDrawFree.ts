import { Vector2 } from "three";
import { EditorDraw, IEditorDraw } from "./editorDraw";
import { IDrawPointer } from "../Pointers/drawPointer";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";
import { ILineSegmentEdge, LineSegmentEdge } from "../Edges/lineSegmentEdge";



export interface IEditorDrawFree extends IEditorDraw{

}


export class EditorDrawFree extends EditorDraw implements IEditorDrawFree {


    private tempDrawPointer: IDrawPointer = new DrawPointerCircle(new Vector2(0,0), this.zoom);

    private tempEdge: ILineSegmentEdge = new LineSegmentEdge(new Vector2(0,0), new Vector2(0,0), this.resolution, 2);
    

    startDraw(point: Vector2): void {
        super.startDraw(point);
        this.tempDrawPointer.renderOrder = this.layer.renderOrder + 2;
        this.layer.group.add(this.tempDrawPointer.pointerGroup);
        this.tempEdge.startPoint = point;
        this.tempEdge.renderOrder = this.layer.renderOrder + 1;
       
    }

    drawTemp(point: Vector2): boolean {
        
        this.tempDrawPointer.updateStartPoint(point.clone(), this.resolution);
        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);
        this.layer.group.add(this.tempEdge.lineObject);
        
        return true;
        
    }

    updateZoom(zoom: number): void {

        super.updateZoom(zoom);
        this.raycaster.updateReycaster();
        this.tempDrawPointer.updateStartPoint(this.raycaster.getOrigin(), this.resolution);
        this.tempDrawPointer.updateZoom(zoom);

        this.tempEdge.endPoint = this.tempDrawPointer.sPoint;
        this.tempEdge.updateModel(this.resolution);
        this.layer.group.add(this.tempEdge.lineObject);
    }

    drawClick(point: Vector2): boolean {

        /**
         * Dodaj  pointer
         */
        const pointer = new DrawPointerCircle(point, this.zoom);
        pointer.renderOrder = this.layer.renderOrder + 2;
        pointer.draw(this.resolution);
        
        /**
         * Dodaj linie
         */
        const edge = new LineSegmentEdge(this.pointers[this.pointers.length-1].sPoint, point, this.resolution, 2);
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

}