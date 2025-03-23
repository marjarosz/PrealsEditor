import { Vector2 } from "three";
import { DrawPointerCircle } from "./drawPointerCircle";
import { LineSegmentEdge } from "../Edges/lineSegmentEdge";



export class DrawPointerCircleCross extends DrawPointerCircle {

    public radius: number = 2;

    protected drawCircle(resolution?: Vector2): void {
        this.clearGroup();
        this.drawCircleObject(resolution);
        const vertLine = new LineSegmentEdge(new Vector2(this.sPoint.x, this.sPoint.y+this.radius / 2), new Vector2(this.sPoint.x, this.sPoint.y-this.radius/2), resolution, 1, this.edgesColor);
        vertLine.updateModel(resolution);
        vertLine.lineObject.renderOrder = this.renderOrder+1;
        this.pointerGroup.add(vertLine.lineObject);
        const horLine = new LineSegmentEdge(new Vector2(this.sPoint.x+this.radius / 2, this.sPoint.y), new Vector2(this.sPoint.x-this.radius/2, this.sPoint.y), resolution, 1, this.edgesColor);
        horLine.updateModel(resolution);
        horLine.lineObject.renderOrder = this.renderOrder +1;
        this.pointerGroup.add(horLine.lineObject);
        this.scaleGroupByZoom();
    }

}