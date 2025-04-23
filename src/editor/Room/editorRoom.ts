import { IEditorWall } from "../Wall/editorWall";

export interface IEditorRoom {

    walls: IEditorWall[];
}

export class EditorRoom implements IEditorRoom {

    walls: IEditorWall[] = [];

}