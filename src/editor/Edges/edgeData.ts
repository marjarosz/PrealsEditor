
export interface IEdgeDataExport {

    /**
     * Typ krawedzi
     */
    edgeType: number;

    /**
     * uuid krawedzi
     */
    uuid: string;

    /**
     * Dlugosc
     */
    length: number;

    /**
     * Kat 
     */
    angle?: number;


}

export interface IEdgeHeightData {

    /**
     * Wysokosc
     */
    height: number;

}

export interface IEdgePointsDataExport {
   
    /**
     * Punk poczatku krawedzi
     */
    startPoint: [number, number];
    
    /**
     * Punk koncowy krawedzi
     */
    endPoint: [number, number];

}

export interface IEdgeAngleDataExport {
    
    /**
     * Kat poczatku luku / elispy w radianach
     */
    startAngle: number;
    
    /**
     * Kat konca luku / elispy w radianach
     */
    endAngle: number;

}

export interface IEdgeClockWiseDataExport {

    clockWise: boolean;

}

export interface IEdgeCenterDataExport {

    /**
     * Punk centralny luku / elispy
     */
    centerPoint: [number, number];

}

/**
 * Dane krawedzi odcinek
 */
export interface ILineEdgeDataExport extends IEdgeDataExport, IEdgePointsDataExport, IEdgeHeightData {

}

/**
 * Dane krawedzi luk
 */
export interface IArcEdgeDataExport extends IEdgeDataExport, IEdgePointsDataExport, IEdgeAngleDataExport, IEdgeCenterDataExport, IEdgeClockWiseDataExport, IEdgeHeightData {
    
    /**
     * Promien luku
     */
    radius: number;

}

/**
 * Dane krawedzi elipsa
 */
export interface IEllipseDataExport extends IEdgeDataExport, IEdgePointsDataExport, IEdgeAngleDataExport, IEdgeCenterDataExport, IEdgeClockWiseDataExport, IEdgeHeightData  {

    /**
     * Promien X elipsy
     */
    radiusX: number;

    /**
     * Promiex Y elipsy
     */
    radiusY: number;

    /**
     * Rotacja elipsy w radianach
     */
    rotate: number;

}