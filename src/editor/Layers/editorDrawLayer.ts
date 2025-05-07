import { Color, Vector2 } from "three";
import { IEditorEdge } from "../Edges/editorEdge";
import { EditorWall, IEditorWall } from "../Wall/editorWall";
import { EditorLayer, IEditorLayer } from "./editorLayer";
import { EditorMath } from "../../Utility/editorMath";
import { IDrawTrack } from "../Draws/drawTrack";
import { ArrayUtility } from "../../Utility/arrayUtility";
import { EditorRoom, IEditorRoom } from "../Room/editorRoom";
import { LineSegmentEdge } from "../Edges/lineSegmentEdge";
import { IUniquePoints, UniquePoints } from "../../Utility/uniquePoints";
import { DrawPointerCircle } from "../Pointers/drawPointerCircle";


interface IFindListItem {edge1: IEditorEdge, edge2: IEditorEdge, point1: Vector2, point2: Vector2};

export interface IEditorDrawLayer extends IEditorLayer {

    getEdgesByCommonPoint(point: Vector2): IEditorEdge[];

    addWallsFromEdges(edges: IEditorEdge[], setEdgeColor?: number): void;

    devidedEdges: IEditorEdge[];

    fromDevidedEdges: IEditorEdge[];
    addEdges: IEditorEdge[];

}

export class EditorDrawLayer extends EditorLayer implements IEditorDrawLayer {

    public renderOrder: number = 20;

    protected walls: IEditorWall[] = [];

    protected edges: IEditorEdge[] = [];

    protected rooms: IEditorRoom[] = [];

    protected uniquePoints: IUniquePoints<Vector2> = new UniquePoints<Vector2>();

    public devidedEdges: IEditorEdge[] = [];
    public fromDevidedEdges: IEditorEdge[] = [];
    public addEdges: IEditorEdge[] = [];

    public render:()=>void = ()=>{};

    get layerObjects(){
        return this.walls;
    }

   constructor(protected resolution: Vector2){
    super();
   }

    addLayerObject(wall: IEditorWall): void {
        

        /**
         * Sprawdz czy nie trzeba podzielic scian
         * Sprawdzenie przeciecia
         * Jezeli jest przeciecie i punkt rozni sie od
         * punktu poczatkowego lub koncowego
         * to dzieli sciany
         */

        const toChange: {edge: IEditorEdge, point: Vector2} [] = [];

        for(const e of this.edges) {
            for(const we of wall.edges) {
                const points = e.intersectionWithEdgePoint(we);

                if(points.length > 0) {

                    //czy punkt jest rozny od poczatkowego lub koncowego
                    for(const cp of points) {
                        if(!EditorMath.equalsVectors(cp, e.startPoint, EditorMath.TOLERANCE_0_10) && !EditorMath.equalsVectors(cp, e.endPoint, EditorMath.TOLERANCE_0_10)){

                            /**
                             * Punkt poczatkowy lub koncowy
                             */

                            if(EditorMath.equalsVectors(we.startPoint, cp, EditorMath.TOLERANCE_0_10)) {
                                toChange.push({edge:e, point: we.startPoint});
                            }
                            
                            if(EditorMath.equalsVectors(we.endPoint, cp, EditorMath.TOLERANCE_0_10)) {
                                toChange.push({edge:e, point: we.endPoint});
                            }
                        }
                    }

                }
            }
            
        }

        this.walls.push(wall);
        //this.edges.push(...wall.edges);

        this.addEdges.push(...wall.edges);
        /**
         * Podziel krawedzie
         */
        for(const dEdge of toChange) {

            const newEdges = dEdge.edge.devide(dEdge.point);
            //this.edges.push(...newEdges);
            this.addEdges.push(...newEdges);
            this.fromDevidedEdges.push(...newEdges);
            for(const ne of newEdges) {
                const newWall = new EditorWall();
                newWall.addEdge(ne);
                this.walls.push(newWall);
            }

            /**
             * Usun krawedzie
             */
            ArrayUtility.removeItemFromArray(this.edges, dEdge.edge);

            /**
             * Usun sciany
             */

            for(const uuid of dEdge.edge.containetInUuids) {
                ArrayUtility.removeItemByFieldValue(this.walls, 'uuid', uuid);
            }

            this.devidedEdges.push(dEdge.edge);
            
        }

        

    }

    public addWallsFromEdges(edges: IEditorEdge[], setEdgeColor?: number): void{

        const addedWalls: EditorWall[] = [];

        this.devidedEdges.length = 0;
        this.fromDevidedEdges.length = 0;
        this.addEdges.length = 0;
        
        /**
         * Ustaw aby ponkty ktore maja takie same wpolrzedne nie powtarzaly sie
         */

        let startPoint = this.edges.find(x=>EditorMath.equalsVectors(x.startPoint, edges[0].startPoint, EditorMath.TOLERANCE_0_10));
        if(startPoint) {
            edges[0].startPoint = startPoint.startPoint;
        } else {
            startPoint = this.edges.find(x=>EditorMath.equalsVectors(x.endPoint, edges[0].startPoint, EditorMath.TOLERANCE_0_10));
            if(startPoint) {
                edges[0].startPoint = startPoint.endPoint;
            }
        }
        edges[0].updateModel();
        let endPoint = this.edges.find(x=>EditorMath.equalsVectors(x.startPoint, edges[edges.length-1].endPoint, EditorMath.TOLERANCE_0_10))

        if(endPoint) {
            edges[edges.length-1].endPoint = endPoint.startPoint;
        } else {
            endPoint = this.edges.find(x=>EditorMath.equalsVectors(x.endPoint, edges[edges.length-1].endPoint, EditorMath.TOLERANCE_0_10));
            if(endPoint) {
                edges[edges.length-1].endPoint = endPoint.endPoint;
            }
        }
        edges[edges.length-1].updateModel();

 

        for(const e of edges) {



            // if(idx == edges.length-1) {
            //     console.log("Ostatnbia sprawdz punkt");
            // }

            if(setEdgeColor != undefined) {
                e.lineObject.setColor(new Color(setEdgeColor));
            }

            const wall  =new EditorWall();
            wall.addEdge(e);
            this.addLayerObject(wall);
            addedWalls.push(wall);
      
        }

        /**
         * Czy dzielimy pomieszczenia
         */
        if(this.devidedEdges.length > 0){
            console.log("Jest podzial - sprawdz czy nie utworzyc nowych pomieszczen")
            this.edges.push(...this.addEdges);
            return;
        }

        //TODO - ponizej rozdzielic
        /**
         * Czy nowe pomieszczenie uzyskane z samozamknietych  krawedzi
         */
        if(edges.length > 2) {

            if (EditorMath.equalsVectors(edges[0].startPoint, edges[edges.length-1].endPoint, EditorMath.TOLERANCE_0_10)){
                edges[edges.length-1].endPoint = edges[0].startPoint;
                edges[edges.length-1].edgeColor = new Color(0x000000);
                edges[edges.length-1].updateModel();
                console.log("Samoprzecinajace sie")
                const room = new EditorRoom();
                room.addWalls(addedWalls);
                this.addRoom(room);

                console.log(this.rooms);
                this.edges.push(...this.addEdges);
                return;
            }

        }

        /**
         * Brak samporzycinajacego  sie
         */


        /**
         * Sprawdzenie czy utworzone krawedzie zamykane sa tylko jedna krawedzai
         */



        // const isone = this.edges.find(x=>
        //     (EditorMath.equalsVectors(x.startPoint, this.addEdges[0].startPoint) && 
        //     EditorMath.equalsVectors(x.endPoint, this.addEdges[this.addEdges.length - 1].endPoint))||
        //     EditorMath.equalsVectors(x.startPoint, this.addEdges[0].endPoint) && 
        //     EditorMath.equalsVectors(x.endPoint, this.addEdges[this.addEdges.length - 1].startPoint)
        // )
        // if(isone ) {

        //     let existWall: IEditorWall | undefined;

        //     for(const uuid of isone.containetInUuids) {
        //         existWall = this.walls.find(x=>x.uuid === uuid);
        //         if(existWall) {
        //             break;
        //         }
        //     }

        //     if(existWall){
        //         const room = new EditorRoom();
        //         const addWalls = [...addedWalls, existWall];
        //         room.addWalls(addWalls);
        //         this.addRoom(room);
        //     }
        //     this.edges.push(...this.addEdges);
        //     console.log(this.rooms)
        //     return;

        // }

        const createdRoom: IEditorRoom[] = [];

        this.findEdges(edges[0].startPoint, edges[edges.length-1].endPoint, [], addedWalls, createdRoom);
        
        this.filtrRooms(createdRoom);

        if(createdRoom.length != 1) {
            throw ("Blad tworzenia pomieszczenia")
        }

        this.addRoom(createdRoom[0]);
        this.edges.push(...this.addEdges);
        /**
         * Przefiltruj liste aby wylonic jedno pomieszczenie
         */

        /**
         * Tworzymy tymczasowy room poprzez zamkniecie figury
         */

        // const endTempEdge = new LineSegmentEdge(edges[edges.length-1].endPoint, edges[0].startPoint, edges[0].resolution);
        // const endTempWall = new EditorWall();
        // endTempWall.addEdge(endTempEdge);
        // const tempRoom = new EditorRoom();
        // tempRoom.addWalls([...addedWalls, endTempWall ]);
        
        /**
         * znajdz punkkty ktore znajduja sie w utworzonym tymczasowym pomieszczeniu 
         */

        // const pointsInRoom: Vector2[] = [];
        // for(const up of this.uniquePoints.points) {
        //     if(tempRoom.pointInRoom(up)) {
        //         pointsInRoom.push(up);
        //     }
        // }
        


       
    }

    getEdgesByCommonPoint(point: Vector2): IEditorEdge[] {
        
        return this.edges.filter(x=>EditorMath.equalsVectors(x.startPoint, point, EditorMath.TOLERANCE_0_10) || EditorMath.equalsVectors(x.endPoint, point, EditorMath.TOLERANCE_0_10))
    }

    setDrawTrack(drawTrack: IDrawTrack): void {
        for(const e of this.edges) {
            drawTrack.addTrackingEdge(e);
            drawTrack.addTrackingPoint(e.startPoint);
            drawTrack.addTrackingPoint(e.endPoint);
        }
    }

    addRoom(room: IEditorRoom) {
        this.rooms.push(room);
        this.uniquePoints.addPoints(room.uniquePointers)

    }

    private findEdges(startPoint: Vector2, endPoint: Vector2, currentList: IFindListItem[], addedWalls: EditorWall[], createdRooms: IEditorRoom[]){

     
   
        /**
         * Wyszukaj wszystkick krawedzi ktore zaczynaja sie w punkcie startowym
         * Filtruje aby nie wystepowaly krawedzie ktore znajduja sie juz na liscie
         */

        let startEdgeStartPoint = 0;
        const startEdges: IEditorEdge[] = [];
        startEdges.push(... this.filtrListFromCurrent(this.edges.filter( x=>EditorMath.equalsVectors(startPoint, x.startPoint, EditorMath.TOLERANCE_0_10)), currentList));
        startEdgeStartPoint = startEdges.length;
        startEdges.push(...this.filtrListFromCurrent(this.edges.filter(x=>EditorMath.equalsVectors(startPoint, x.endPoint, EditorMath.TOLERANCE_0_10)), currentList));

        /**
         * Wyszukaj wszystkich krawedzi ktore zaczynaja sie w punkcie koncowym
         */
        let endPointEndEdge = 0;
        const endEdges: IEditorEdge[] = [];
        

        endEdges.push(...this.filtrListFromCurrent(this.edges.filter(x=>EditorMath.equalsVectors(endPoint, x.endPoint, EditorMath.TOLERANCE_0_10)), currentList));
        endPointEndEdge = endEdges.length;

        
        endEdges.push(...this.filtrListFromCurrent(this.edges.filter(x=>EditorMath.equalsVectors(endPoint, x.startPoint, EditorMath.TOLERANCE_0_10)), currentList));


        /**
         * Sprawdzamy wszystkie polaczenia pomiedzy punktami linni
         */
        
        const list: IFindListItem[] = [];
        
        for(let i = 0; i< startEdgeStartPoint; ++i) {
            
            /**
             * Punkty startPoint dla krawedzi poczatkowych
             */
            for(let j = 0; j < endPointEndEdge; ++j) {

                list.push({
                    edge1: startEdges[i],
                    edge2: endEdges[j],
                    point1: startEdges[i].endPoint,
                    point2: endEdges[j].startPoint
                })

                // console.log(startEdges[i].endPoint, endEdges[j].startPoint);

                // const tEdge = new LineSegmentEdge(startEdges[i].endPoint, endEdges[j].startPoint, this.resolution, 1, 0x2e00ff);
                // tEdge.renderOrder = 100;
                // tEdge.updateModel();
                // this.group.add(tEdge.lineObject);

            }

            for(let j = endPointEndEdge; j < endEdges.length; ++j ) {

                list.push({
                    edge1: startEdges[i],
                    edge2: endEdges[j],
                    point1: startEdges[i].endPoint,
                    point2: endEdges[j].endPoint
                })

                // console.log(startEdges[i].endPoint, endEdges[j].endPoint);

                // const tEdge = new LineSegmentEdge(startEdges[i].endPoint, endEdges[j].endPoint, this.resolution, 1, 0x2e00ff);
                // tEdge.renderOrder = 100;
                // tEdge.updateModel();
                // this.group.add(tEdge.lineObject);

            }

        }
     

        for(let i = startEdgeStartPoint; i < startEdges.length; ++i) {

            /**
             * Punkty ednPoint dla krawedzi poczatkowych
             */
            for(let j = 0; j < endPointEndEdge; ++j) {


                list.push({
                    edge1: startEdges[i],
                    edge2: endEdges[j],
                    point1: startEdges[i].startPoint,
                    point2: endEdges[j].startPoint
                })

                // console.log(startEdges[i].startPoint, endEdges[j].startPoint);

                // const tEdge = new LineSegmentEdge(startEdges[i].startPoint, endEdges[j].startPoint, this.resolution, 1, 0x2e00ff);
                // tEdge.renderOrder = 100;
                // tEdge.updateModel();
                // this.group.add(tEdge.lineObject);

            }

            for(let j = endPointEndEdge; j < endEdges.length; ++j ) {

                list.push({
                    edge1: startEdges[i],
                    edge2: endEdges[j],
                    point1: startEdges[i].startPoint,
                    point2: endEdges[j].endPoint
                })

                // console.log(startEdges[i].startPoint, endEdges[j].endPoint);

                // const tEdge = new LineSegmentEdge(startEdges[i].startPoint, endEdges[j].endPoint, this.resolution, 1, 0x2e00ff);
                // tEdge.renderOrder = 100;
                // tEdge.updateModel();
                // this.group.add(tEdge.lineObject);

            }
        }
        
 

        

        // setTimeout(() => {
        //     alert("Utworzono linnie")
        // }, 1);

        /**
         * Sprawdzamy przeciecia - usuwamy te ktore sie przecinaja
         */



        const removeFromList: IFindListItem[] = [];
        
        for(let i = 0; i < list.length; ++i) {
            
            for(let j = i+1; j<list.length; ++j) {
                const itr = EditorMath.intersectionTwoLineSegment(list[i].point1, list[i].point2, list[j].point1, list[j].point2);

                if(itr == EditorMath.IntersectionType.intersection) {
                //if(itr) {
                    //const findF = removeIndex.find(x=>x==i);
                    //if(!findF) {
                     //   removeIndex.push(i);
                        removeFromList.push(list[i])
                    //}
                    //const findS = removeIndex.find(x=>x==j);

                    //if(!findS) {
                       // removeIndex.push(j);
                       removeFromList.push(list[j]);
                    //}
                }
            }

        }

        for(const idx of removeFromList) {
            
          
            ArrayUtility.removeItemFromArray(list, idx);
        }


        for(const obj of list) {
            // const tEdge = new LineSegmentEdge(obj.point1, obj.point2, this.resolution, 1, 0xea00ff);
            // tEdge.renderOrder = 120;
            // tEdge.updateModel();
            // this.group.add(tEdge.lineObject);


            let isRoom = false;
            /**
             * Czy krawedez1 oraz krawedz 2 to ta sama krawedz
             */
            if(obj.edge1.uuid === obj.edge2.uuid){

                /**
                 * Punkt poczatkowy oraz punkt konczowy laczy ta sama krawedz - tworzy pomieszczenie i dodaje do listy
                 */
                const newRoom = new EditorRoom();
                newRoom.addWalls([...addedWalls, ...this.findWalls(currentList), ...this.findWall(obj.edge1)]);
                isRoom = true;
                
                
                if(newRoom.checkRoomGeometry()){
                    createdRooms.push(newRoom);
                }
               
            }

            
            /**
             * Czy punkt 1 oraz 2 sa takie same - sa polaczone ze soba
             */
            if(EditorMath.equalsVectors(obj.point1, obj.point2)) {

                /**
                 * Krawedzie lacza sie ze soba - tworzy pomieszczenie i dodaje do listy
                 */
                const newRoom = new EditorRoom();
                newRoom.addWalls([...addedWalls, ...this.findWalls([...currentList, obj])]);
                isRoom = true;


                
                if(newRoom.checkRoomGeometry()) {
                    createdRooms.push(newRoom);
                }

            }

            if(!isRoom) {
                /**
                 * Rekurencja - nastepne krawedzie
                 */
                this.findEdges(obj.point1, obj.point2, [...currentList, obj], addedWalls, createdRooms);
            }
        }

        //console.log(list)
        this.render();

    }

    /**
     * 
     * Szuka scian do kotrych nalezy krawedz
     * 
     * @param edge 
     * @returns 
     */
    private findWall(edge: IEditorEdge) {

        const wallsList: IEditorWall[] = [];
        for(const uuid of edge.containetInUuids) {
            const w = this.walls.find(x=>x.uuid === uuid);
            if(w) {
                wallsList.push(w);
            }
        }

        return wallsList;
    }

    /**
     * 
     * Szuka scian z listy IFindListItem
     * 
     * @param currentList 
     * @returns 
     */
    private findWalls(currentList: IFindListItem[]){

        const wallsList: IEditorWall[] = [];

        for(const fi of currentList) {
            for(const uuid of fi.edge1.containetInUuids) {
                const w = this.walls.find(x=>x.uuid === uuid);
                if(w) {
                    wallsList.push(w);
                }
            }

            for(const uuid of fi.edge2.containetInUuids) {
                const w = this.walls.find(x=>x.uuid === uuid);
                if(w) {
                    wallsList.push(w);
                }
            }
        }

        return wallsList;
    }

    /**
     * 
     * Czysci liste krawedzi ktore znajduja sie na liscie IFindListItem[]
     * 
     * @param list 
     * @param currentList 
     * @returns 
     */
    private filtrListFromCurrent(list: IEditorEdge[], currentList: IFindListItem[]) {

        const toRemove: IEditorEdge[] = [];
        for(const ed of list) {
            const find = currentList.find(x=>x.edge1.uuid === ed.uuid || x.edge2.uuid === ed.uuid);
            if(find) {
                toRemove.push(ed);
            }
        }
        for(const r of toRemove) {
            ArrayUtility.removeItemFromArray(list, r);
        }

        return list;
    }


    private filtrRooms(roomList: IEditorRoom[]) {

        const toRemove: IEditorRoom[] = [];

        /**
         * Filtracja po srodkach ciezkosci triangulacji
         */
        for(let i = 0; i<roomList.length; ++i) {

            for(let j = 0; j<roomList.length; ++j) {

                if(roomList[i].uuid != roomList[j].uuid) {
                    for(const point of roomList[i].midpointTriangls) {
                        const pointInRoom = roomList[j].pointInRoom(point, false);
                        if(!pointInRoom) {
                            toRemove.push(roomList[i]);
                            break;
                        }
                    }
                }  
            }

        }
        // for(const room of roomList) {
           
           

        //     setTimeout(()=>{

        //         for(const w of room.walls) {
        //             for(const edg of w.edges) {
        //                 edg.edgeColor = new Color(0xf1ff00);
        //             }
        //         }
        //         this.render();
        //         alert("t")
        //         for(const w of room.walls) {
        //             for(const edg of w.edges) {
        //                 edg.edgeColor = new Color(0x000000);
        //             }
        //         }
        //     }, 0);
            
           


        // }

    
        
        for(const r of toRemove) {
            ArrayUtility.removeItemFromArray(roomList, r);
        }
       
        toRemove.length = 0;
        if(roomList.length > 1) {

            /**
             * Filtracja po unique points
             */
            for(const r of roomList){
                for(const rr of roomList){
                   

                    if(r.uuid != rr.uuid) {
                        console.log(r, rr);
                        for(const up of r.uniquePointers) {
                        
                            const isInRoom = rr.uniquePointers.find(x=>EditorMath.equalsVectors(x, up));
 
                            if(!isInRoom) {
                                 const pointInRoom = rr.pointInRoom(up, false);
                                 
                                 if(!pointInRoom) {
                                    toRemove.push(r);
                                    break;
                                 }
                            }
                        }
                    }

                   
                }
            }
            
        }

        for(const r of toRemove) {
            ArrayUtility.removeItemFromArray(roomList, r);
        }


        for(const room of roomList) {

            for(const w of room.walls) {
                for(const edg of w.edges) {
                    edg.edgeColor = new Color(0xff00ff);
                }
            }
        }
        this.render();

        setTimeout(()=>{

            alert("KONIEC")
            for(const room of roomList) {

                for(const w of room.walls) {
                    for(const edg of w.edges) {
                        edg.edgeColor = new Color(0x000000);
                    }
                }
            }
            this.render();
        }, 100)

        
        console.log(roomList);
    }

}