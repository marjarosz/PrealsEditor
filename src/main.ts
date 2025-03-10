
import { View } from './MVVM/view';
import { ViewModelFactory } from './ViewModels/viewModelFactory';
import { ViewModelMain } from './ViewModels/viewModelMain';
import editorTemplate from './Views/editor.html'

const mainViewHtml = document.createElement("template");
mainViewHtml.innerHTML = editorTemplate;


const mainViewModel = new ViewModelMain(new ViewModelFactory());
const view = new View(mainViewHtml, mainViewModel);

document.body.append(...view.viewNodeList);