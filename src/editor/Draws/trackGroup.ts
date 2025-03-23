import { Group } from "three";
import { ITrackLine } from "./trackLine";

export interface ITrackGroup extends Group{

    trackParent?: ITrackLine

}   

export class TrackGroup extends Group implements ITrackGroup{

    trackParent?: ITrackLine;
}