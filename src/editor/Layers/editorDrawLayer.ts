import { EditorLayer, IEditorLayer } from "./editorLayer";


export interface IEditorDrawLayer extends IEditorLayer {

}

export class EditorDrawLayer extends EditorLayer {

    public renderOrder: number = 20;

}