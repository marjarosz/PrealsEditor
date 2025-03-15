import { Camera } from "three";

/*
* Min max X
*/
export interface IMinMaxX {
   minX: number;
   maxX: number;
}

/**
* Min Max Y
*/
export interface IMinMaxY {
   minY: number;
   maxY: number;
}

export interface IMinMaxXY extends IMinMaxX, IMinMaxY{}

/**
 * Min / max widok kamery
 */
export interface ICamViewMinMaxPoints extends IMinMaxXY {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

export namespace EditorUtility {


     /**
     * Zwraca min i max widok kamery
     * @param camera kamera
     * @returns ICamViewMinMaxPoints
     */
     export function getCamViewMinMaxPoints(camera: Camera): ICamViewMinMaxPoints{

        const points: ICamViewMinMaxPoints = {
            minX: camera.position.x - camera.projectionMatrixInverse.elements[0],
            maxX: camera.position.x + camera.projectionMatrixInverse.elements[0],
            minY: camera.position.y - camera.projectionMatrixInverse.elements[5],
            maxY: camera.position.y + camera.projectionMatrixInverse.elements[5]
        }

        return points;
    }


}
