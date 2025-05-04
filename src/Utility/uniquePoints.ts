import { Vector2 } from "three";

export interface IUniquePoints< V extends Vector2> {
    addPoint(point: V): number;
    addPoints(points: V[]): number[];
    removePoint(point: V): V[];

    readonly points: V[];
}

export class UniquePoints< V extends Vector2> implements IUniquePoints<V>{

    private _points: V[] = [];

    get points(){
        return this._points;
    }

    addPoint(point: V): number{
        
        if(this._points.indexOf(point) == -1) {
           return  this._points.push(point);
        }

        return -1;

    }

    addPoints(points: V[]): number[]{

        const addArray: number[] = [];

        for(const p of points) {
            addArray.push(this.addPoint(p));
        }

        return addArray;
    }

    removePoint(point: V): V[]{
        return this._points.splice(this._points.indexOf(point));
    }
  
}