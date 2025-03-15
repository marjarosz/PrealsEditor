
import { Editor, IEditor } from './editor/editor';
import { IThreeInitializer, ThreeInitializer } from './editor/threeInitializer';
import { View } from './MVVM/view';
import { ViewModelFactory } from './ViewModels/viewModelFactory';
import { ViewModelMain } from './ViewModels/viewModelMain';
import editorTemplate from './Views/editor.html'

const mainViewHtml = document.createElement("template");
mainViewHtml.innerHTML = editorTemplate;

const threeInit: IThreeInitializer = new ThreeInitializer();
const editor:IEditor = new Editor(threeInit, 1000, 400);

const mainViewModel = new ViewModelMain(new ViewModelFactory(), editor);
const view = new View(mainViewHtml, mainViewModel);

document.body.append(...view.viewNodeList);