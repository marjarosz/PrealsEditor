/**
 * Object3D utility
 * Zmiana przezroczystosci obiektow
 * usuwanie biektow z pamieci
 * 
 */

import { Mesh, MeshBasicMaterial, Object3D } from "three";


export namespace Object3DUtility {

    /**
     * 
     * Ustaw opacity dla grupy modeli
     * 
     * @param group 
     * @param opacity 
     */
    export function setGroupOpacity(group: Object3D, opacity: number){
        group.traverse((child: Object3D)=>{
            if(child.type === "Mesh" || child.type === "TextMesh") {
                ((child as Mesh).material as MeshBasicMaterial).transparent = true;
                ((child as Mesh).material as MeshBasicMaterial).opacity = opacity;

                if(opacity == 0 ){
                    child.visible = false;
                } else {
                    child.visible = true;
                }
            }

            // if(child.type === "LineSegment"){
            //     ((child as LineSegment).material as LineMaterial).transparent = true;
            //     ((child as LineSegment).material as LineMaterial).opacity = opacity;

            // }

            // if(child.type === "ArcSegment") {
               
            //     ((child as ArcSegment).material as LineMaterial).transparent = true;
            //     ((child as ArcSegment).material as LineMaterial).opacity = opacity;

            // }

            // if(child.type === "EllipseSegment") {
               
            //     ((child as ArcSegment).material as LineMaterial).transparent = true;
            //     ((child as ArcSegment).material as LineMaterial).opacity = opacity;

            // }
        
            
        })
    }

    export function disposeObject(o: Object3D){

        if('geometry' in o){
            (o as Mesh).geometry.dispose();
        }

    }

}