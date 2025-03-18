
import { Color, Shape, Vector2 } from "three";
import { EditorMath } from "../../Utility/editorMath";
import { Object3DUtility } from "../../Utility/object3DUtility";
import { IArcEdgeDataExport } from "./edgeData";
import { ILineSegment } from "../Segments/lineSegment";
import { EdgeBase, EdgeType, IEditorEdge } from "./editorEdge";
import { ArcSegment } from "../Segments/arcSegment";


export enum ArcDirection {  
    CCW = 0,
    CW = 1,
}

export interface IArcParameters {

    /**
     * Punkt srodkowy luku
     */
    center: Vector2,

    /**
     * Promien luku
     */
    radius: number,

    /**
     * Kat poczatku luku w radianach
     */
    startAngle: number,

    /**
     * Kat konca luku w radianach
     */
    endAngle: number,

    /**
     * Kierunek
     */
    direction: ArcDirection

}



export interface IArcEdge extends IEditorEdge {

    readonly startAngle: number;

    readonly endAngle: number;

    readonly clockwise: boolean;

    radius: number;

    readonly arcCenterPoint: Vector2;

    minRadius: number;

    /**
     * Czy przeliczac parametry luku na podtsawie punktu startowego i koncowego przy updateModels
     */
    calcNewParametersByPoints: boolean;

    setFromData(data: IArcEdgeDataExport): void;

    /**
     * 
     * Odwraca luk
     * 
     * @param reverseStartEndPoint 
     */
    reverseArc(reverseStartEndPoint: boolean): void;

    /**
     * 
     * Zmiana promienia na podstawie nowego punktu centralnego
     * 
     * @param point 
     */
    changeArcRadiusByNewMiddlePoint(point: Vector2): boolean;

    /**
     * 
     * Zmiana promienia na podstawie nowego punktu centralnego, 
     * sprawdzenie stycznosci
     * 
     * @param point 
     */
    changeTangentArcRadiusByNewMiddlePoint(point: Vector2, startPointTangentEdge: IEditorEdge | undefined, endPointTangentEdge: IEditorEdge | undefined): boolean;

}

export class ArcEdge extends EdgeBase implements IArcEdge {

    protected _lineObject: ILineSegment;


    private _startAngle: number;

    private _endAngle: number;

    private _clockwise: boolean;

    private _arcCenterPoint: Vector2;

    private _radius: number;

    private _currentStats: IArcEdgeDataExport;

    private _tempState: IArcEdgeDataExport | undefined;

    public calcNewParametersByPoints: boolean = false;

    get startAngle(){
        return this._startAngle;
    }

    get endAngle(){
        return this._endAngle;
    }

    get radius(){
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    get arcCenterPoint(){
        return this._arcCenterPoint;
    }

    get lineObject(){
        return this._lineObject;
    }

    get clockwise(){
        return this._clockwise;
    }

    set edgeColor(value: Color){   
        this.material.color = value;
        this._lineObject.setColor(value);    
    }

    minRadius: number = 0;


    constructor(sPoint: Vector2, ePoint: Vector2, arcParameters: IArcParameters,  resolution?: Vector2, lineWidth?: number, color?: number, opacity?: number){
        super(EdgeType.arc,sPoint, ePoint, resolution, lineWidth, color, opacity);
 
    
        this._clockwise = (arcParameters.direction == ArcDirection.CW ) ? true : false;
        this._startAngle = (EditorMath.equalsDecimals(arcParameters.startAngle, EditorMath.RADIAN_360, EditorMath.TOLERANCE_0_10)) ? 0 : arcParameters.startAngle;
        this._endAngle = arcParameters.endAngle;
        this._arcCenterPoint = arcParameters.center.clone();
        this._radius = arcParameters.radius;
        this._centerPoint = EditorMath.getCenterPointArc(this._startAngle, this._endAngle, this._arcCenterPoint, this._radius, this.clockwise);
        this._lineObject = new ArcSegment(this._startPoint, this._endPoint, this._arcCenterPoint, this._radius, this._startAngle, this._endAngle, this._clockwise, undefined, this.material);
        this.arcLineObjectUpdated();
        this._currentStats = this.getData();
        this.minRadius = 0.1 * this.radius;
    }


    private updateArc(){
         
        if(this.calcNewParametersByPoints) { 
            if(!this.updatePoints(this._startPoint, this._endPoint)){return false};
        }
    
        this._lineObject.removeFromParent();
        Object3DUtility.disposeObject(this._lineObject);
        const centerPoint = EditorMath.getCenterPointArc(this._startAngle, this._endAngle, this._arcCenterPoint, this._radius, this.clockwise);
        this._centerPoint.x = centerPoint.x;
        this._centerPoint.y = centerPoint.y;

        this._lineObject = new ArcSegment(this._startPoint, this._endPoint, this._arcCenterPoint, this._radius, this._startAngle, this._endAngle, this._clockwise, undefined, this.material);
        this.arcLineObjectUpdated();
        return true;

    }

    private arcLineObjectUpdated(){
        this._lineObject.createSegmentGeometry();
        this._lineObject.computeLineDistances();
        this._lineObject.lineEdgeParent = this;
        this._lineObject.renderOrder = 4;
    }

    public stepDrawShape(shape: Shape){
        
        shape.absarc(this._arcCenterPoint.x, this._arcCenterPoint.y, this._radius, this._startAngle, this._endAngle, this._clockwise);
        
    }

    public reverse(){
        
    }

    public updateModel(resolution?: Vector2){
  
        super.updateModel(resolution);
        return this.updateArc();

       // return true
    }

    clone(lineWidth?: number, color?: number){

        const lw = (lineWidth) ? lineWidth : this.material.linewidth;
        const col = (color) ? color : this.material.color.getHex();

        const arc = new ArcEdge(
            this._startPoint.clone(), 
            this._endPoint.clone(), 
            {
                center: this._arcCenterPoint.clone(),
                endAngle: this._endAngle,
                startAngle: this.startAngle,
                radius: this.radius,
                direction: (this.clockwise) ? ArcDirection.CW : ArcDirection.CCW
            },
            this.resolution,
            lw,
            col,
            this.material.opacity
        )
     
        return arc;
    }


    move(x: number, y: number) {
       

        this.moveStartEndPoints(x, y);

        this.arcCenterPoint.x +=x;
        this.arcCenterPoint.y +=y;
      
    }

    rotate(around: Vector2, angle: number): void {
        
        super.rotate(around, angle);
        this._arcCenterPoint.rotateAround(around, angle);
        const angles = EditorMath.getCircleStartEndAngle(this._startPoint,  this._endPoint, this._arcCenterPoint);
        this._startAngle = angles[0];
        this._endAngle = angles[1];

            
    }

   

    save(): void {
        this._currentStats = this.getData();
    }

    fromSave(): void {
    
        this.setFromData(this._currentStats);

    }

    getData(): IArcEdgeDataExport {

        return {
            edgeType: this.edgeType,
            startPoint: [this._startPoint.x, this._startPoint.y],
            endPoint: [this._endPoint.x, this._endPoint.y],
            centerPoint: [this._arcCenterPoint.x, this._arcCenterPoint.y],
            radius: this._radius,
            startAngle: this._startAngle,
            endAngle: this._endAngle,
            clockWise: this.clockwise,
            uuid: this.uuid,
            height: this.height,
            length: this.lineObject.getLength()
        }

    }

    getSavedData(): IArcEdgeDataExport{

        const data: IArcEdgeDataExport = {
            edgeType: this.edgeType,
            startPoint: [this._currentStats.startPoint[0], this._currentStats.startPoint[1]],
            endPoint: [this._currentStats.endPoint[0], this._currentStats.endPoint[1]],
            centerPoint: [this._currentStats.centerPoint[0], this._currentStats.centerPoint[1]],
            clockWise: this._currentStats.clockWise,
            startAngle: this._currentStats.startAngle,
            endAngle: this._currentStats.endAngle,
            radius: this._currentStats.radius,
            height: this.height,
            uuid: this.uuid,
            length: this.lineObject.getLength()
        }

        return data;

    }

    setFromData(data: IArcEdgeDataExport){
        this._startPoint.x = data.startPoint[0];
        this._startPoint.y = data.startPoint[1];

        this._endPoint.x = data.endPoint[0];
        this._endPoint.y= data.endPoint[1];

        this.radius = data.radius;

        
        this._clockwise = data.clockWise;
        this._startAngle = data.startAngle;
        this._endAngle = data.endAngle;

        this._arcCenterPoint.x = data.centerPoint[0];
        this._arcCenterPoint.y = data.centerPoint[1];

        this.height = data.height;


    }

    toJson(){
    
        return JSON.stringify(this.getData());

    }

    dispose(){
        this._lineObject.removeFromParent();
        Object3DUtility.disposeObject(this._lineObject);
    }
    


    private updatePoints(startPoint: Vector2, endPoint: Vector2){

        const newCenters = EditorMath.calculateCenterArcByPoints(startPoint, endPoint, this._radius);

        if(newCenters.length == 0) {
            return false;
        }


        const currentDirection = EditorMath.linesDirection(startPoint, this._arcCenterPoint, endPoint);

        for(const c of newCenters) {

            const dir = EditorMath.linesDirection(startPoint, c, endPoint);
            if(dir == currentDirection) {
                this._arcCenterPoint = c;
                const angles = EditorMath.getCircleStartEndAngle(startPoint, endPoint, c);
                this._startAngle = angles[0];
                this._endAngle = angles[1];
                return true;
            }

        }

        return false;

    }

    reverseArc(reverseStartEndPoint: boolean): void {

        this._clockwise = !this._clockwise;


        if(reverseStartEndPoint){
            const newStartPoint = this._endPoint.clone();
            const newEndPoint = this._startPoint.clone();

            this._startPoint = newStartPoint;
            this._endPoint = newEndPoint;
        }

    }


    tempSave(): void {
        this._tempState = this.getData();
    }

    fromTempSave(): void {
        if(this._tempState){
            this.setFromData(this._tempState)
        }
    }

    /**
     * 
     * Oblicza nowy srodek oraz punk centralny luku na podstawie wsp punktu
     * 
     * @param point 
     * @returns 
     */
    protected getCenterArcPointByPoint(point: Vector2){
     

        const middlePoint = EditorMath.intersectionPerpendicularLines(this._centerPoint,this._arcCenterPoint, point);
              
        const p3 = EditorMath.getCenterPointLineSegment(middlePoint, this._startPoint);

        const lC2 = EditorMath.perpendicularLineThroughPoint(middlePoint, this._startPoint, p3);
        const lC1 = EditorMath.lineCoefficients(middlePoint, EditorMath.getCenterPointLineSegment(this._startPoint, this._endPoint));
        
        const x = (lC2.b - lC1.b) / (lC1.a - lC2.a);
        const y = lC1.a * x + lC1.b;


        return  {
            middlePoint: middlePoint,
            centerPoint: new Vector2(x, y)
        }
    }


    changeArcRadiusByNewMiddlePoint(point: Vector2): boolean{


        const oldDir = EditorMath.linesDirection(this._startPoint, this._centerPoint, this._endPoint);

        const parms = this.getCenterArcPointByPoint(point);

        const dis1 = parms.centerPoint.distanceTo(this._startPoint);
        const dis2 = parms.centerPoint.distanceTo(this._endPoint);

        if(!EditorMath.equalsDecimals(dis1, dis2, EditorMath.TOLERANCE_0_10)){
            return false;
        }

        this._arcCenterPoint.x = parms.centerPoint.x;
        this._arcCenterPoint.y = parms.centerPoint.y;

    
        const angles = EditorMath.getCircleStartEndAngle(this._startPoint, this._endPoint, this._arcCenterPoint);
        this._startAngle = angles[0];
        this._endAngle = angles[1];

        this._radius = this._arcCenterPoint.distanceTo(parms.middlePoint);

        const newDir = EditorMath.linesDirection(this._startPoint, parms.middlePoint, this._endPoint);

        if(oldDir != newDir){this._clockwise = !this._clockwise};

        return true;
 
    }

    

    changeTangentArcRadiusByNewMiddlePoint(point: Vector2, startPointTangentEdge: IEditorEdge | undefined, endPointTangentEdge: IEditorEdge| undefined): boolean {


    
        //TODO - opracowac algorytm dla stycznej i niestycznej
        if(!startPointTangentEdge || !endPointTangentEdge) {
            return this.changeArcRadiusByNewMiddlePoint(point);
        }

        //TODO - narazie tylko styczny do dwochh linni
        if(startPointTangentEdge.edgeType != EdgeType.lineSegment || endPointTangentEdge.edgeType != EdgeType.lineSegment) {
            return this.changeArcRadiusByNewMiddlePoint(point);
        }


        let ret = true;

        let newStartPoint = this._startPoint.clone();
        let newEndPoint = this._endPoint.clone();

        let tangentStart = false;
        let tangentEnd = false;
        

        const middlePoint = EditorMath.intersectionPerpendicularLines(this._centerPoint,this._arcCenterPoint, point);

        let arcParams: EditorMath.IArcTangentParameters | undefined = undefined;

        if(startPointTangentEdge) {

            

            if(startPointTangentEdge.edgeType == EdgeType.lineSegment){
                arcParams = EditorMath.changeArcTangentToLineByNewMiddlePoint(this._arcCenterPoint, startPointTangentEdge.startPoint, startPointTangentEdge.endPoint, middlePoint);
                if(arcParams){
                    newStartPoint = arcParams.tangentPoint;    
                
                }
               

                tangentStart = true;
            } else if (startPointTangentEdge.edgeType == EdgeType.arc) {

            }

        }

        if(endPointTangentEdge) {
            tangentEnd = true;
            if(endPointTangentEdge.edgeType == EdgeType.lineSegment) {

                if(!arcParams) {
                    arcParams = EditorMath.changeArcTangentToLineByNewMiddlePoint(this._arcCenterPoint, endPointTangentEdge.startPoint, endPointTangentEdge.endPoint, middlePoint);
                    if(arcParams) {
                        newEndPoint = arcParams.tangentPoint;  
                    } 

                } else {
                    newEndPoint = EditorMath.intersectionPerpendicularLines(endPointTangentEdge.startPoint, endPointTangentEdge.endPoint, arcParams.centerPoint);
                }
                
            } else if (endPointTangentEdge.edgeType == EdgeType.arc) {
                if(!arcParams) {

                } else {
                    console.log(EditorMath.getTangentPointTwoArc(arcParams.centerPoint, arcParams.radius, 
                        (endPointTangentEdge as IArcEdge).arcCenterPoint, (endPointTangentEdge as IArcEdge).radius))
                }
            }

        } 

        
        
        if(!arcParams) {
            return false;
        }

        const angles = EditorMath.getCircleStartEndAngle(newStartPoint, newEndPoint, arcParams.centerPoint);

        if(tangentStart) {

            const oldDir = EditorMath.linesDirection(startPointTangentEdge!.startPoint, startPointTangentEdge!.endPoint, this._endPoint);
            const newDir = EditorMath.linesDirection(startPointTangentEdge!.startPoint, newStartPoint, newEndPoint);
            ret = oldDir == newDir;
            //console.log(ret);
            //ret = (EditorMath.equalsDecimals(angles[0], this._startAngle, EditorMath.TOLERANCE_0_10)) ? true : false;
            //return ret = ()
        } 

        if(tangentEnd) {

            if(ret) {
                const oldDir2 = EditorMath.linesDirection(startPointTangentEdge!.endPoint, this._endPoint, endPointTangentEdge!.endPoint);
                const newDir2 = EditorMath.linesDirection(newStartPoint, newEndPoint, endPointTangentEdge!.endPoint)
                ret = (oldDir2 == newDir2);

                //ret = (EditorMath.equalsDecimals(angles[1], this._endAngle, EditorMath.TOLERANCE_0_10)) ? true : false;
            }
            
        } 
        

        if(ret && !EditorMath.equalsDecimals(arcParams.radius, 0, EditorMath.TOLERANCE_0_5)) {

        
            this._radius = arcParams.radius;
            this._arcCenterPoint.x = arcParams.centerPoint.x
            this._arcCenterPoint.y = arcParams.centerPoint.y
            this._startPoint = newStartPoint;
            this._endPoint = newEndPoint;
            this.updateModel();
    
            if(startPointTangentEdge) {
                startPointTangentEdge.endPoint.x = newStartPoint.x;
                startPointTangentEdge.endPoint.y = newStartPoint.y;
                // if(startPointTangentEdge.edgeType == EdgeType.arc) {
                //     (startPointTangentEdge as IArcEdge).calcNewParametersByPoints = true;
                //     console.log( startPointTangentEdge.updateModel());
                //     (startPointTangentEdge as IArcEdge).calcNewParametersByPoints = false;

                // } else {
                //     startPointTangentEdge.updateModel();
                // }
                
            } else {
                this._startAngle = angles[0];
            }
    
            if(endPointTangentEdge) {
                endPointTangentEdge.startPoint.x = newEndPoint.x;
                endPointTangentEdge.startPoint.y = newEndPoint.y;
                // if(endPointTangentEdge.edgeType == EdgeType.arc) {

                //     (endPointTangentEdge as IArcEdge).calcNewParametersByPoints = true;
                //     endPointTangentEdge.updateModel();
                //     (endPointTangentEdge as IArcEdge).calcNewParametersByPoints = false;

                // } else {
                //     endPointTangentEdge.updateModel();
                // }
                
            } else {
                this._endAngle = angles[1];
            }
         } else {

           // console.log("BLAD")

        //     if(tangentStart && tangentEnd) {
        //         const arcParams = EditorMath.calculateArcTangentToLinesSegment(startPointTangentEdge!.startPoint, startPointTangentEdge!.endPoint, endPointTangentEdge!.startPoint, endPointTangentEdge!.endPoint);

        //         if(arcParams){
        //             this._centerPoint.x = arcParams.arcCenterPoint.x;
        //             this._centerPoint.y = arcParams.arcCenterPoint.y;
        //             this._radius = arcParams.radius;
        //             this._startPoint = arcParams.firstArcPoint;
        //             this._endPoint = arcParams.lastArcPoint;
        //             this.updateModel();
        //         }
        //     }

         }

        return ret;

    }

}