import { Vector2 } from "three";
import { IPrimitivePoints, PrimitivePoints } from "./primitivePoints";
import { ArcDirection, ArcEdge, IArcParameters } from "../Edges/arcEdge";
import { EdgeType, IEditorEdge } from "../Edges/editorEdge";
import { EditorMath } from "../../Utility/editorMath";

export interface IPrimitiveCircle extends IPrimitivePoints {

}

export class PrimitiveCircle extends PrimitivePoints implements IPrimitiveCircle{

    constructor(protected centerPoint: Vector2, protected radius: number){

        super();
        this.points.push(new Vector2(centerPoint.x + radius, centerPoint.y));
        this.points.push(new Vector2(centerPoint.x, centerPoint.y + radius));
        this.points.push(new Vector2(centerPoint.x - radius, centerPoint.y));
        this.points.push(new Vector2(centerPoint.x, centerPoint.y - radius));

    }


    getEdges(resolution?: Vector2, width: number = 1, color: number = 0, opacity: number = 1, renderOrder?: number){


        const arc1Params: IArcParameters = {
            center: this.centerPoint.clone(),
            direction: ArcDirection.CCW,
            radius: this.radius,
            startAngle: 0,
            endAngle: 360
        }

        arc1Params.startAngle = 0;
        arc1Params.endAngle = EditorMath.RADIAN_90;

        const edges: IEditorEdge[] = [];


        edges.push(new ArcEdge( this.points[0].clone(), this.points[1].clone(), arc1Params, resolution, width, color, opacity));
        arc1Params.startAngle = EditorMath.RADIAN_90;
        arc1Params.endAngle = EditorMath.RADIAN_180;
        edges.push(new ArcEdge(this.points[1].clone(), this.points[2].clone(), arc1Params, resolution, 2, color, opacity));
        arc1Params.startAngle =EditorMath.RADIAN_180;
        arc1Params.endAngle = EditorMath.RADIAN_270;
        edges.push(new ArcEdge(this.points[2].clone(), this.points[3].clone(), arc1Params, resolution, 2, color, opacity));
        arc1Params.startAngle =EditorMath.RADIAN_270;
        arc1Params.endAngle = EditorMath.RADIAN_360;
        edges.push(new ArcEdge(this.points[3].clone(), this.points[0].clone(), arc1Params, resolution, 2, color, opacity));

        if(renderOrder != undefined){
            for(const ed of edges){
                ed.lineObject.renderOrder = renderOrder;
            }
        }

        return edges;

    }
    

}