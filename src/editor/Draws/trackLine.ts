import { Vector2 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { ITrackGroup, TrackGroup } from "./trackGroup";
import { ILineSegmentEdge, ILineSegmentEdgeDsashed, LineSegmentEdge, LineSegmentEdgeDsashed } from "../Edges/lineSegmentEdge";
import { Object3DUtility } from "../../Utility/object3DUtility";



export interface ITrackLine {

    /**
     * Grupa modeli sledzenia linni
     */
    trackGroup: ITrackGroup;

    /**
     * Object3D lini sledzenia
     */
    readonly trackLineModel: Line2;

    /**
     * Punkt startowy
     */
    readonly sPoint: Vector2;

    /**
     * Punkt koncowy
     */
    readonly ePoint: Vector2;

    /**
     * 
     * Aktualizacja zoom
     * 
     * @param zoom 
     */
    zoomUpdate(zoom: number): void;

    resolutionChange(resolution: Vector2):void;

    /**
     * 
     * Ustaw nowe punkty
     * 
     * @param sNewPoint 
     * @param eNewPoint 
     */
    setNewPoints(sNewPoint?: Vector2, eNewPoint?: Vector2): void;


    setNewEndPoint(eNewPoint: Vector2):void;

    /**
     * Usun z rodzica
     */
    removeFromParent(): void;

    /**
     * Zwolnij
     */
    dispose(): void;

}

export class TrackLine implements ITrackLine {

    trackGroup: ITrackGroup = new TrackGroup();

    get trackLineModel(){
        return this.lineTrack.lineObject;
    }

    private lineColor: ILineSegmentEdgeDsashed;

    private lineBlack: ILineSegmentEdgeDsashed;

    private lineTrack: ILineSegmentEdge;

    _sPoint: Vector2;

    _ePoint: Vector2;

    get sPoint(){
        return this._sPoint;
    }

    get ePoint() {
        return this._ePoint;
    }

    constructor(sPoint: Vector2, ePoint: Vector2, protected color: number, protected resolution: Vector2, protected trackSize: number, protected lineColorSize = 3){

        this._sPoint = sPoint;
        this._ePoint = ePoint;

        const lines = this.getLines(sPoint, ePoint, color, resolution, trackSize);

        this.lineColor = lines.lColor;
        this.lineBlack = lines.lBlack;
        this.lineTrack = lines.lTrack;

        this.trackGroup.trackParent = this;

        this.trackGroup.add(this.lineBlack.lineObject, this.lineColor.lineObject, this.lineTrack.lineObject);

    }

    public zoomUpdate(zoom: number) {
        
        this.lineBlack.dashSize = 3.96875 / zoom;
        this.lineColor.dashSize = 3.96875 / zoom;
        this.lineBlack.dashGapSize = 3.96875 / zoom;
        this.lineColor.dashGapSize = 3.96875 / zoom;

    }

    public setNewPoints(sNewPoint?: Vector2, eNewPoint?: Vector2){

        const start = (sNewPoint) ? sNewPoint : this._sPoint;
        
        const end = (eNewPoint) ? eNewPoint : this._ePoint;

        this._sPoint = start;
        this._ePoint = end;

        this.removeFromParent();

        const lines = this.getLines(start, end, this.color, this.resolution, this.trackSize);

        this.lineColor = lines.lColor;
        this.lineBlack = lines.lBlack;
        this.lineTrack = lines.lTrack;

        this.trackGroup.add(this.lineBlack.lineObject, this.lineColor.lineObject, this.lineTrack.lineObject);

    }

    public setNewEndPoint(eNewPoint: Vector2) {
        this.setNewPoints(this._sPoint, eNewPoint);
    }
    
    public removeFromParent(): void {
        this.lineBlack.lineObject.removeFromParent();
        this.lineColor.lineObject.removeFromParent();
        this.lineTrack.lineObject.removeFromParent();
    }

    protected getLines(sPoint: Vector2, ePoint: Vector2, color: number, resolution: Vector2, trackSize: number){

        //Kolor
        const lineColor = new LineSegmentEdgeDsashed(sPoint, ePoint, resolution, this.lineColorSize, color);
        //Lisnia do sledzenia

        //Czarna cieka linia
        const lineBlack = new LineSegmentEdgeDsashed(sPoint, ePoint, resolution, 1);

        //Linia do wsledzenia (niewidoczna)
        const lineTrack = new LineSegmentEdge(sPoint, ePoint, resolution, trackSize);
        lineTrack.lineObject.visible = false;

        return {
            lColor: lineColor,
            lBlack: lineBlack,
            lTrack: lineTrack
        }

    }

    dispose(){
        for(const c of this.trackGroup.children){
            Object3DUtility.disposeObject(c);
            this.trackGroup.clear();
            this.trackGroup.removeFromParent();
            
        }
    }

    resolutionChange(resolution: Vector2): void {
        this.resolution = resolution;
        this.lineColor.resolution = resolution;
        this.lineColor.updateModel(resolution);
        this.lineBlack.resolution = resolution;
        this.lineBlack.updateModel(resolution);
        this.lineTrack.resolution = resolution;
        this.lineTrack.updateModel(resolution);

    }


}