import { BufferGeometry, Color, Line, Path, Vector2 } from "three";
import { DrawObject, IDrawObject } from "../drawObject";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { ILineSegment, LineSegment } from "../Segments/lineSegment";
import { IEdgeDataExport } from "./edgeData";
import { EditorMath } from "../../Utility/editorMath";
import { IArcEdge } from "./arcEdge";
export enum EdgeType {
    'lineSegment' = 1,
    'arc' = 2,
    'ellipse' = 3
}



export interface IEditorEdge extends IDrawObject{

    /**
     * Sortowanie
     */
    order: number;

    /**
     * Wysokosc
     */
    height: number;

    /**
     * Punkt startowy
     */
    startPoint: Vector2;
    
    /**
     * Punkt koncowy
     */
    endPoint: Vector2;

    /**
     * Kolor krawedzi
     */
    edgeColor: Color;

    /**
     * Szerokosc krawedzi
     */
    edgeWidth: number;

    /**
     * Ro
     */
    resolution: Vector2;

    /**
     * Punkt srodkowy krawedzi
     */
    readonly centerPoint: Vector2;

    /**
     * Bufor geometri
     */
    readonly bufferGeometry: BufferGeometry;

    /**
     * obiekt 3D krawedzi
     */
    readonly lineObject: ILineSegment;

    /**
     * Typ krawedzi
     */
    readonly edgeType: EdgeType

    /**
     * Kat
     */
    readonly angle: number;

    /**
     * etap rysowania ksztaltu
     * @param shape 
     */
    stepDrawShape(shape: Path): void;

    /**
     * Odwroc
     */
    reverse(): void;

    /**
     * 
     * Aktualizuj model
     * 
     * @param resolution 
     */
    updateModel(resolution?: Vector2): boolean;

    /**
     * 
     * Klonuj 
     * 
     * @param lineWidth 
     * @param color 
     */
    clone(lineWidth?: number, color?: number): IEditorEdge

    /**
     * 
     * Przenies
     * 
     * @param x 
     * @param y 
     */
    move(x: number, y: number): void;

    /**
     * 
     * Obroc
     * 
     * @param around 
     * @param angle 
     */
    rotate(around: Vector2, angle: number): void;

    /**
     * Zapisz
     */
    save(): void;

    /**
     * Przywroc z zapisu
     */
    fromSave(): void;

    /**
     * zwraca dane do eksportu
     */
    getData(): IEdgeDataExport;

    /**
     * Zwraca zapisane dane do eksportu
     */
    getSavedData(): IEdgeDataExport;

    /**
     * Dane do JSON
     */
    toJson(): string;

    /**
     * Zwolnij
     */
    dispose(): void;

    /**
     * 
     * Zmiana resolution w line material
     * 
     * @param resolution 
     */
    updateResolution(resolution: Vector2): void;

    /**
     * Tymczasowy zapis 
     */
    tempSave(): void;

    /**
     * przywroc z tymczasowych danych
     */
    fromTempSave(): void;

    /**
     * 
     * Aprawdza przeciecie z inna krawedzai
     * 
     * @param edge 
     */
    intersectionWithEdge(edge:IEditorEdge):EditorMath.IntersectionType;

    /**
     * Zwraca punkty przeciecia sie segment linni  z segmentem krawedzi
     * @param edge 
     */
    intersectionWithEdgePoint(edge:IEditorEdge): Vector2[];

}

export  class EdgeBase extends DrawObject{

    public height: number = 0;

    protected _startPoint: Vector2;

    protected  _endPoint: Vector2;

    protected material: LineMaterial;

    protected _bufferGeometry: BufferGeometry;

    protected _centerPoint: Vector2 =  new Vector2();

    protected _angle: number = Infinity;

    order = 1;

    get angle(){
        return this._angle;
    }

    get startPoint(){
        return this._startPoint;
    }

    set startPoint(value){
        this._startPoint = value;
    }

    get endPoint(){
        return this._endPoint;
    }

    set endPoint(value){
        this.endPoint = value;
    }

    get edgeColor(){
        return this.material.color;
    }  

    set edgeColor(value){
        this.material.color = value;
        
    }

    get edgeWidth(){
        return this.material.linewidth;
    }

    set edgeWidth(value){
        this.material.linewidth = value;
    }

    get bufferGeometry(){
        return this._bufferGeometry;
    }

    get resolution(){
        return this.material.resolution;
    }

    set resolution(value){
        this.material.resolution = value;
    }

    get centerPoint(){
        return this._centerPoint;
    }




    constructor(public readonly edgeType: EdgeType, sPoint?: Vector2, ePoint?: Vector2, resolution?: Vector2, lineWidth?: number, color?: number, opacity?: number){

        super();
        this._startPoint = (sPoint) ? sPoint : new Vector2();
        this._endPoint = (ePoint) ? ePoint : new Vector2();


        //this._startPoint = vectorFixed(this._startPoint, 15);
        //this._endPoint = vectorFixed(this._endPoint, 15);
     
        this.material = new LineMaterial({
            color: (color) ? color : 0,
            linewidth: (lineWidth) ? lineWidth : 1,
            vertexColors: true,
            alphaToCoverage: true,
            resolution : (resolution) ? resolution : new Vector2(window.innerWidth, window.innerHeight),
            transparent: true,
            opacity: (opacity != undefined) ? opacity : 1,
            precision: 'highp'
        });



        this._bufferGeometry = new BufferGeometry();
        
    }

    protected getLineFromBufferGeometry(bufferGeometry: BufferGeometry){

  
        const ll = new Line(bufferGeometry);   
        const cs: number[] = [];


        const lineGeometry = new LineGeometry();
        lineGeometry.fromLine(ll);
             

        if(this.material.color.r != 0 || this.material.color.g != 0 || this.material.color.b != 0) {
            const colors: number[] = [];
            const pos = lineGeometry.getAttribute('position');
            const el = pos.array.length/3
            for(let i = 0; i<el; ++i) {
                colors.push(this.material.color.r,this.material.color.g,this.material.color.b);
            }
            lineGeometry.setColors(colors);
        }

        
        const line2 = new LineSegment(this.startPoint, this.endPoint, lineGeometry, this.material);
        
        line2.computeLineDistances();
       
        return line2;

    }

    move(x: number, y: number) {

        this.moveStartEndPoints(x, y);
    }

    protected moveStartEndPoints(x: number, y: number) {
        this._startPoint.x += x;
        this._startPoint.y += y;

        this._endPoint.x += x;
        this._endPoint.y += y;
    }

    rotate(around: Vector2, angle: number){
        this._startPoint.rotateAround(around, angle);
        this._endPoint.rotateAround(around, angle);
    }


    public updateModel(resolution?: Vector2){
        
        if(resolution) {
           
            this.material.resolution = resolution;
        }

        return true;
        
    }

    public updateResolution(resolution: Vector2){

        this.material.resolution.x = resolution.x;
        this.material.resolution.y = resolution.y;
        this.updateModel(resolution);
    }

    //TODO - tymczasowo
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
    
    //TODO - tymczasowo
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

}