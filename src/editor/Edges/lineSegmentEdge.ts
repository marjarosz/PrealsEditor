import {Color, MathUtils, Shape, Vector2 } from "three";

import {EditorMath} from "../../Utility/editorMath";

import { Object3DUtility } from "../../Utility/object3DUtility";
import { ILineEdgeDataExport } from "./edgeData";
import { EdgeBase, EdgeType, IEditorEdge } from "./editorEdge";
import { ILineSegment, LineSegment } from "../Segments/lineSegment";
import { IArcEdge } from "./arcEdge";



export interface ILineCoefficients {
    a: number;
    b: number;
}

export interface ILineSegmentEdge extends IEditorEdge {
    readonly lineCoefficients: ILineCoefficients;
    
    /**
     * 
     * Ustaw z danych eksportowych
     * 
     * @param data 
     */
    setFromData(data: ILineEdgeDataExport): void;
}

export class LineSegmentEdge extends EdgeBase implements ILineSegmentEdge{

    protected _lineObject: ILineSegment;


    get lineObject(){
        return this._lineObject;
    }

    set endPoint(value: Vector2){
        this._endPoint = value;
        this.updatePoints(this.startPoint, this.endPoint);
    }

    get endPoint(){
        return super.endPoint;
    }

    set startPoint(value: Vector2){
        this._startPoint = value;
        this.updatePoints(this.startPoint, this.endPoint);
    }

    get startPoint(){
        return super.startPoint;
    }

    protected _lineCoefficients: ILineCoefficients;

    get lineCoefficients(){
        return this._lineCoefficients;
    }

    set edgeColor(value: Color){   
        this.material.color = value;
        this._lineObject.setColor(value);    
    }

    private _currentStats: ILineEdgeDataExport;

    private _tempState: ILineEdgeDataExport | undefined;

    constructor(sPoint: Vector2, ePoint: Vector2, resolution?: Vector2, lineWidth?: number, color?: number, opacity?: number){
        super(EdgeType.lineSegment, sPoint, ePoint, resolution, lineWidth, color, opacity);



        this._lineObject = this.getLineGeometry(sPoint, ePoint);
        this._lineObject.lineEdgeParent = this;
        this._lineCoefficients = EditorMath.lineCoefficients(sPoint, ePoint);

        this._centerPoint = this.getCenterPoint(sPoint, ePoint);
        if(this._lineCoefficients.b == 0){
            this._angle = MathUtils.degToRad(90);
        } else {
            this._angle = Math.atan(this._lineCoefficients.a);
        }
        
        this._currentStats = this.getData();
      
    }

    public stepDrawShape(shape: Shape){
        shape.lineTo(this._endPoint.x, this._endPoint.y);
    }

    protected getLineGeometry(sPoint: Vector2, ePoint: Vector2){
        
        this.bufferGeometry.setFromPoints([sPoint, ePoint]);
        const line = new LineSegment(this.startPoint, this.endPoint, undefined, this.material);

        line.createSegmentGeometry();
        line.computeLineDistances();

        line.lineEdgeParent = this;
        line.renderOrder = 4;
        return line;
  
    }

    private updatePoints(sPoint: Vector2, ePoint: Vector2){
        
        this._startPoint = sPoint;
        this._endPoint = ePoint;
        this.updateLine(sPoint, ePoint);
       
    }

  
    protected updateLine(sPoint: Vector2, ePoint: Vector2){

        const parent = this._lineObject.parent;

        this._lineObject.removeFromParent();
        Object3DUtility.disposeObject(this._lineObject);
        this._lineObject = this.getLineGeometry(sPoint, ePoint);
        const newCof = EditorMath.lineCoefficients(sPoint, ePoint);
        this._lineCoefficients.a = newCof.a;
        this._lineCoefficients.b = newCof.b;
        const newCenter = this.getCenterPoint(sPoint, ePoint);
        this._centerPoint.setX(newCenter.x);
        this._centerPoint.setY(newCenter.y);
        this._lineObject.renderOrder = this.renderOrder;
        this.updateAngle();

        if(parent) {
            parent.add(this._lineObject);
            
        }
        
    }
    
    protected getCenterPoint(sPoint: Vector2, ePoint: Vector2){
        
        return EditorMath.getCenterPointLineSegment(sPoint, ePoint);
       
    }

    reverse() {

        const sPoint = this._startPoint.clone();
        this._startPoint = this.endPoint.clone();
        this._endPoint = sPoint;
        this._lineObject = this.getLineGeometry(this._startPoint, this._endPoint);
        this._lineCoefficients = EditorMath.lineCoefficients(this._startPoint, this._endPoint);
        this._centerPoint = this.getCenterPoint(this._startPoint, this._endPoint);
    }

    public updateModel(resolution?: Vector2){
        
        super.updateModel(resolution);
        this.updateLine(this._startPoint, this._endPoint);
        return true;
    }

    private updateAngle(){
        if(this._lineCoefficients.b == 0){
            this._angle = MathUtils.degToRad(90);
        } else {
            this._angle = Math.atan(this._lineCoefficients.a);
        }
    }

    clone(lineWidth?: number, color?: number){

        const lw = (lineWidth) ? lineWidth : this.material.linewidth;

        const col = (color) ? color : this.material.color.getHex();

        const line = new LineSegmentEdge(this.startPoint.clone(), this.endPoint.clone(), this.material.resolution, lw, col, this.material.opacity);
        return line;
    }
    

    move(x: number, y: number) {
        super.move(x, y);
    }

    save(): void {
        this._currentStats = this.getData();
    }

    fromSave(): void {
        this.setFromData(this._currentStats);
    }


    getData(): ILineEdgeDataExport{
        return {
            edgeType: this.edgeType,
            startPoint: [this._startPoint.x, this._startPoint.y],
            endPoint: [this._endPoint.x, this._endPoint.y],
            uuid: this.uuid,
            height: this.height,
            length: this.lineObject.getLength()
        }
    }

    getSavedData(): ILineEdgeDataExport{

        const data: ILineEdgeDataExport = {
            edgeType: this.edgeType,
            startPoint: [this._currentStats.startPoint[0], this._currentStats.startPoint[1]],
            endPoint: [this._currentStats.endPoint[0], this._currentStats.endPoint[1]],
            uuid: this.uuid,
            height: this.height,
            length: this.lineObject.getLength()
        }

        return data;

    }
    
    setFromData(data: ILineEdgeDataExport){
        this._startPoint.x = data.startPoint[0];
        this._startPoint.y = data.startPoint[1];

        this._endPoint.x = data.endPoint[0];
        this._endPoint.y= data.endPoint[1];

        this.height = data.height;
    }

    toJson() {
        return JSON.stringify(this.getData());
    }

    dispose(){
        this._lineObject.removeFromParent();
        Object3DUtility.disposeObject(this._lineObject);
    }

    tempSave(): void {
        this._tempState = this.getData();
    }

    fromTempSave(): void {
        if(this._tempState){
            this.setFromData(this._tempState)
        }
    }


    public intersectionWithEdge(edge:IEditorEdge):EditorMath.IntersectionType {
        
        let inters:EditorMath.IntersectionType = EditorMath.IntersectionType.noIntersection;
        
        if(edge.edgeType == EdgeType.lineSegment) {
            return  EditorMath.intersectionTwoLineSegment(this.startPoint, this.endPoint, edge.startPoint, edge.endPoint);
        } else if (edge.edgeType == EdgeType.arc) {
            return EditorMath.interstationLineSegmentArc(this.startPoint, this.endPoint, 
                (edge as IArcEdge).arcCenterPoint, 
                (edge as IArcEdge).radius, 
                (edge as IArcEdge).startAngle, 
                (edge as IArcEdge).endAngle, 
                (edge as IArcEdge).clockwise);
        }
               
        return inters;
    }
   

    public intersectionWithEdgePoint(edge:IEditorEdge): Vector2[] {

        if(edge.edgeType == EdgeType.lineSegment) {
            
            const point = EditorMath.intersectionTwoSegmentPoint(this.startPoint, this.endPoint, edge.startPoint, edge.endPoint, EditorMath.TOLERANCE_0_10);
            if(point){
                return [point];
            }
        } else if (edge.edgeType == EdgeType.arc) {
            const points = EditorMath.interstationLineSegmentArcPoints(this.startPoint, this.endPoint, 
                (edge as IArcEdge).arcCenterPoint,
                (edge as IArcEdge).radius, 
                (edge as IArcEdge).startAngle, 
                (edge as IArcEdge).endAngle, 
                (edge as IArcEdge).clockwise
            );

            if(points) {
                return points;
            }
        }
        
        return [];
    }

    public devide(point: Vector2): IEditorEdge[] {
        
        const ret: IEditorEdge[] =[];

        ret.push(new LineSegmentEdge(this.startPoint, point, this.resolution, this.material.linewidth, this.material.color.getHex(), this.material.opacity));
        ret.push(new LineSegmentEdge(point, this.endPoint, this.resolution, this.material.linewidth, this.material.color.getHex(), this.material.opacity));

        return ret;

    }

}

export interface ILineSegmentEdgeDsashed extends ILineSegmentEdge {

    dashSize: number;

    dashGapSize: number;

}

export class LineSegmentEdgeDsashed extends LineSegmentEdge implements ILineSegmentEdgeDsashed{
    
    get dashSize(){
        return this.material.dashSize;
    }
    
    set dashSize(value: number){
        this.material.dashSize = value;
    }

    get dashGapSize(){
        return this.material.gapSize;
    }

    set dashGapSize(value: number){
        this.material.gapSize = value;
    }

    constructor(sPoint: Vector2, ePoint: Vector2, resolution?: Vector2, lineWidth?: number, color?: number) {
        super(sPoint, ePoint, resolution, lineWidth, color);

        this.material.dashed  = true;
        this.material.dashSize = 1;
        this.material.gapSize = 1;
        
        
    }

   
}