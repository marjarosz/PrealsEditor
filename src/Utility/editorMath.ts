
import { Vector2} from "three"
/**
 * 
 * Geometria dla edytora
 * Potrzebuje jednej zewnętrznej zależności Vector2z three.js
 * Zawier funkcje dla linni, odcinka, okregu, luku, wycikna okregu, segmentu okregu itp
 * 
 */


export namespace EditorMath {
    /**
     * 
     * Zwraca sformatowany wektor sformatowany do notacji stałoprzecinkowej
     * 
     * @param v 
     * @param digits 
     */
    export function vectorFixed(v: Vector2, digits: number): Vector2{

        const vf = new Vector2();

        vf.x =  parseFloat(v.x.toFixed(digits));
        vf.y =  parseFloat(v.y.toFixed(digits));

        return vf;

    }

    /**
     * 
     * Zwraca sformatowana liczbe do notacji staloprzecinkowej
     * 
     * @param n 
     * @param digits 
     * @returns 
     */
    export function numberFixed(n: number, digits: number) : number {
        return parseFloat(n.toFixed(digits));
    }

    //TESTED
    /**
     * 
     * Porownuje dwie liczby zmiennoprzecinkowe
     * 
     * @param n1 
     * @param n2 
     * @param tolerance 
     * @returns 
     */
    export function equalsDecimals(n1: number, n2: number, tolerance: number = Number.EPSILON){

        return Math.abs(n1-n2) < tolerance;
        
    }

    //TESTED
    /**
     * Porownoje dwa wektory o wsp zmiennoprzecikowych
     * 
     * @param v1 
     * @param v2 
     * @param tolerance 
     * @returns 
     */
    export function equalsVectors(v1: Vector2, v2: Vector2, tolerance: number = Number.EPSILON) {
        return Math.abs(v1.x-v2.x) < tolerance && Math.abs(v1.y - v2.y) < tolerance;
    }

    //TESTED
    /**
     * 
     * Punnkt wspoliniowo
     * 
     * @param point1 1 wektor
     * @param point2 2 wektor
     * @param point3 3 wektor
     * @returns 
     */
    export function pointCollinear(point1: Vector2, point2: Vector2, point3: Vector2){

        /**
         * Formula
         *
         * x1 = point3.x - point1.x
         * y1 = point3.y - point1.y
         * 
         * x2 = point2.x - point1.x
         * y2 = point2.y - point1.y
         * 
         * v1.x * v2.y - v2.x * v1.y
         */

        const v1 = new Vector2().subVectors(point3, point1);
        const v2 = new Vector2().subVectors(point2, point1);

        return v1.cross(v2);
        
    }

    //TESTED
    /**
     * 
     * Czy punkt lezy na prostej
     * 
     * @param point1 1 wspolrzedna prostej
     * @param point2 2 wspolrzedna prostej
     * @param pointToCheck punkt do sprawdzenia
     * @param tolerance  tolerancja dla porownania liczb zmiennoprzecinkowych 
     * @returns 
     */
    export function pointInLine(point1: Vector2, point2: Vector2, pointToCheck: Vector2, tolerance?:number) {

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;
        return  equalsDecimals(pointCollinear(point1, point2, pointToCheck), 0, tol );
    }

    //TESTED
    /**
     * 
     * Czy punkt do sprawdzenia lezy na odcinku (point1, point2)
     * 
     * @param point1 1 wspolrzedna odcinka
     * @param point2 2 wspolrzedna odcinka
     * @param pointToCheck wspolrzedne punktu do sprawdzenia
     * @returns 
     */
    export function pointOnLineSegment(point1: Vector2, point2: Vector2, pointToCheck: Vector2, tolerance?:number){

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;
        return  equalsDecimals(pointCollinear(point1, point2, pointToCheck), 0, tol ) && minMaxPointsToOnLineSegment(point1, point2, pointToCheck);
    }

    function minMaxPointsToOnLineSegment(point1: Vector2, point2: Vector2, pointToCheck: Vector2){
        return Math.min(point1.x, point2.x) <= pointToCheck.x && pointToCheck.x <= Math.max(point1.x, point2.x) 
        && Math.min(point1.y, point2.y) <= pointToCheck.y && pointToCheck.y <= Math.max(point1.y, point2.y);
    }


    export function onSegment(point1: Vector2, point2: Vector2, pointToCheck: Vector2){
        return Math.min(point1.x, point2.x) <= pointToCheck.x && pointToCheck.x <= Math.max(point1.x, point2.x) 
        && Math.min(point1.y, point2.y) <= pointToCheck.y && pointToCheck.y <= Math.max(point1.y, point2.y);
    }


    interface ILinesParallelParams {
        dir1: Vector2;
        dir2: Vector2;
        den: number;
        isParallel: boolean;
    }

    //TESTED
    export function linesParallelParams(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2, tolerance?:number): ILinesParallelParams{

 

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;
        /**
         * Wektory kierunkowe
         */
        const dir1 = new Vector2().subVectors(point2, point1);
        const dir2 = new Vector2().subVectors(point4, point3);
      
        
       // const denominator = dir1.x * dir2.y - dir1.y * dir2.x;
        
        const den = dir1.cross(dir2);

        const params: ILinesParallelParams = {
            dir1: dir1,
            dir2: dir2,
            den: den,
            isParallel: equalsDecimals(den, 0, tol)
        }

        return params
    }

    //TESTED
    /**
     * 
     * Czy dwie linnie sa rownolegle
     * 
     * @param point1 ws1 pierwszej linni
     * @param point2 ws2 pierwszej linni 
     * @param point3 ws1 drogiej linni
     * @param point4 ws2 drugiej linni
     * @param tolerance tolerancja
     * @returns 
     */
    export function linesParallel(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2, tolerance?:number): boolean{

        return linesParallelParams(point1, point2, point3, point4, tolerance).isParallel;

    }

    //TESTED
    /**
     * 
     * Sprawdzenie czy linia o wsp point1 i point2 jest wspolinniowa do lini o wsp point3 i point4
     * 
     * @param point1 
     * @param point2 
     * @param point3 
     * @param point4 
     * @returns 
     */
    export function linesCollinear(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2, tolerance?:number) {

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;
        const v1 = new Vector2().subVectors(point1, point2);
        const vs1 = new Vector2().subVectors(point1, point3);
        const vs2 = new Vector2().subVectors(point1, point4);

        return equalsDecimals(v1.cross(vs1), 0, tol) && equalsDecimals(v1.cross(vs2), 0, tol);

    }

    //TESTED
    /**
     * 
     * Czy dwa odcinki o wspolrzednych (point1, point 2) i (point3, point4) przecinaja sie
     * 
     * @param point1 1 wspolrzedna odcinka 1
     * @param point2 2 wspolrzedna odcinka 1
     * @param point3 1 wspolrzedna odcinka 2
     * @param point4 2 wspolrzedna odcinka 2
     * @returns 
     */
    export function intersectionTwoLineSegment(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2): IntersectionType{
        
        const vP1 = pointCollinear(point3, point4, point1);
        const vP2 = pointCollinear(point3, point4, point2);
        const vP3 = pointCollinear(point1, point2, point3);
        const vP4 = pointCollinear(point1, point2, point4);
    
        if((vP1 > 0 && vP2 < 0 || vP1 < 0 && vP2 >0 ) && (vP3 > 0 && vP4 < 0 || vP3 < 0 && vP4 > 0)){
    
            return IntersectionType.intersection;
            
        } 
    
        //Czy punkty nie leza na odcinku
        if( equalsDecimals(vP1, 0, TOLERANCE_0_15) && minMaxPointsToOnLineSegment(point3, point4, point1)) return IntersectionType.onLine;
        if( equalsDecimals(vP2, 0, TOLERANCE_0_15) && minMaxPointsToOnLineSegment(point3, point4, point2)) return IntersectionType.onLine;
        if( equalsDecimals(vP3, 0, TOLERANCE_0_15) && minMaxPointsToOnLineSegment(point1, point2, point3)) return IntersectionType.onLine;
        if( equalsDecimals(vP4, 0, TOLERANCE_0_15) && minMaxPointsToOnLineSegment(point1, point2, point4)) return IntersectionType.onLine;

        return IntersectionType.noIntersection;
        
    }

    //TESTED
    /**
     * 
     * Zwraca punk przecięcia się dwoch prostych o punktach (point1, point2) oraz (point3, point4)
     * Jezeli brak przeciecia zwraca null
     * 
     * @param point1 1 wspolrzedna prostej 1
     * @param point2 2 wspolrzedna prostej 1
     * @param point3 1 wspolrzedna prostej 2
     * @param point4 2 wpsolrzedna prostej 2
     */
    export function intersectionTwoLinePoint(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2, tolerance?: number): Vector2 | null{

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;

        const paramsParallel = linesParallelParams(point1, point2, point3, point4, tol);

        if(paramsParallel.isParallel){

            return null;
        }

        // Oblicz różnicę punktów początkowych
        const delta = new Vector2().subVectors(point3, point1);

        /**
         * Oblicz parametr t dla pierwszej prostej
         * delta.x * paramsParallel.dir2.y - delta.y * paramsParallel.dir2.x) / paramsParallel.den;
         */
        const t = delta.cross(paramsParallel.dir2) / paramsParallel.den;
        // Oblicz punkt przecięcia
        const point = new Vector2(
            point1.x + t * paramsParallel.dir1.x,
            point1.y + t * paramsParallel.dir1.y
        );

        return point;

    }

    //TESTED
    /**
     * 
     * Zwraca punk przecięcia się dwoch prostych o punktach (point1, point2) oraz (point3, point4)
     * Jezeli brak przeciecia zwraca null
     * 
     * @param point1 1 wspolrzedna prostej 1
     * @param point2 2 wspolrzedna prostej 1
     * @param point3 1 wspolrzedna prostej 2
     * @param point4 2 wpsolrzedna prostej 2
     */
    export function intersectionTwoSegmentPoint(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2, tolerance?: number): Vector2 | null{

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;

        const paramsParallel = linesParallelParams(point1, point2, point3, point4, tol);

        if(paramsParallel.isParallel){

            return null;
        }

        // Oblicz różnicę punktów początkowych
        const delta = new Vector2().subVectors(point3, point1);

        /**
         * Oblicz parametr t dla pierwszej prostej
         * delta.x * paramsParallel.dir2.y - delta.y * paramsParallel.dir2.x) / paramsParallel.den;
         */
        const t = delta.cross(paramsParallel.dir2) / paramsParallel.den;
        const u = delta.cross(paramsParallel.dir1) / paramsParallel.den;

        // Sprawdź, czy punkt leży na obu odcinkach
        if (t < 0 || t > 1 || u < 0 || u > 1) return null;

        // Oblicz punkt przecięcia
        const point = new Vector2(
            point1.x + t * paramsParallel.dir1.x,
            point1.y + t * paramsParallel.dir1.y
        );

        return point;

    }



    /**
     * 
     * Wspolczynniki prostej
     * 
     * @param point1 1 wspolrzedna prostej
     * @param point2 2 wspolrzedna prostej
     * @returns 
     */
    export function lineCoefficients(point1: Vector2, point2: Vector2): {a: number, b: number}{

        let a;
        
        if(equalsDecimals(point1.x, point2.x, TOLERANCE_0_15)){

            return {a: point1.x, b: 0}
        } else {
            a = (point2.y - point1.y) / (point2.x - point1.x);
            
        }
        
        const b = point1.y - a * point1.x;

        return {a: a, b: b}

    }

    export function lineCoefficients2(point1: Vector2, point2: Vector2): {a: number, b: number}{

        let a;
    
        if(isVerticalLine(point1, point2)){

            return {a: point1.x, b: 0};
        } 
        
        if (isHorisontalLine(point1, point2)){
            
            return {a: NaN, b: point1.y};
        }
        
        a = (point2.y - point1.y) / (point2.x - point1.x);
        const b = point1.y - a * point1.x;

        return {a: a, b: b}

    }




    /**
     * 
     * Zwraca punk przecięcia się dwoch prostych o punktach (point1, point2) oraz (point3, point4)
     * Jezeli brak przeciecia zwraca undefined
     * 
     * @param point1 1 wspolrzedna prostej 1
     * @param point2 2 wspolrzedna prostej 1
     * @param point3 1 wspolrzedna prostej 2
     * @param point4 2 wpsolrzedna prostej 2
     */
    // export function intersectionTwoLinePoint(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2, c1?: {a: number, b: number}, c2?:{a: number, b: number}): Vector2 | undefined{

    //     const lC1 = (c1) ? c1 : lineCoefficients(point1, point2);
    //     const lC2 = (c2) ? c2 : lineCoefficients(point3, point4);

    //     if(lC1.a == lC2.a){
    //         return undefined;
    //     }

    //     let x;
    //     let y;

    //     if(lC1.b == 0){
    //         x = point1.x;
    //         y = lC2.a * x + lC2.b;
    //     } else if (lC2.b == 0){
    //         x = point3.x;
    //         y = lC1.a * x + lC1.b;
    //     } else {
    //         x = (lC2.b - lC1.b) / (lC1.a - lC2.a);
    //         y = lC1.a * x + lC1.b;
    //     }

    //     return new Vector2(x, y);

    // }

    //TODO - czy potzrebne
    function intersectionTwoLinePointByCoefficients(point1: Vector2, point2: Vector2, lC2:{a: number, b: number}){


        const lC1 = lineCoefficients(point1, point2);

        if(lC1.a == lC2.a){
            return undefined;
        }

        let x;
        let y;

        if(lC1.b == 0) {
            x = point1.x;
            y = lC2.a * x + lC2.b;
        } else {
            x = (lC2.b - lC1.b) / (lC1.a - lC2.a);
            y = lC1.a * x + lC1.b;
        }
        return new Vector2(x, y);

    }

    //TODO - czy potzrebne
    function intersectionTwoLinePointByCoefficients2(startPointLine1: Vector2, lC1:{a: number, b: number}, startPointLine2: Vector2, lC2:{a: number, b: number}) {

        if(lC1.a == lC2.a){
            return undefined;
        }

        let x;
        let y;

        if(lC1.b == 0){
            x = startPointLine1.x;
            y = lC2.a * x + lC2.b;

            return new Vector2(x, y);
        } 
        
        if (lC2.b == 0){
            x = startPointLine2.x;
            y = lC1.a * x + lC1.b;

            return new Vector2(x, y);
        } 
       
        if(isNaN(lC1.a)){
            y = startPointLine1.y;
            x = (y - lC2.b)/ lC2.a;

            return new Vector2(x, y);
        }

        if(isNaN(lC2.a)){
            y = startPointLine2.y;
            x = (y - lC1.b)/ lC1.a;

            return new Vector2(x, y);
        }
        
        x = (lC2.b - lC1.b) / (lC1.a - lC2.a);
        y = lC1.a * x + lC1.b;
        

        return new Vector2(x, y);

    }
    //TODO - czy potzrebne
    export function intersectionTwoLinePoint2(point1: Vector2, point2: Vector2, point3: Vector2, point4: Vector2): Vector2 | undefined{


        const t = (((point1.x - point3.x) * (point3.y - point4.y)) - ((point1.y - point3.y) * (point3.x - point4.x))) / 
                  (((point1.x - point2.x) * (point3.y - point4.y)) - ((point1.y - point2.y) * (point3.x - point4.x)));


        const u = (((point1.x - point3.x) * (point1.y - point2.y)) - ((point1.y - point3.y) * (point1.x - point2.x))) / 
                  (((point1.x - point2.x) * (point3.y - point4.y)) - ((point1.y - point2.y) * (point3.x - point4.x)));


        if(t >=0 && t<= 1 ) {
            const x = point1.x + t * (point2.x - point1.x);
            const y = point1.y + t * (point2.y - point1.y);
            return new Vector2(x, y);
        }

        if(u >=0 && u<= 1 ) {

            const x = point3.x + u * (point4.x - point3.x);
            const y = point3.y + u * (point4.y - point3.y);

            return new Vector2(x, y);
        }

        return undefined;
    }

    //TODO - czy potzrebne
    /**
     * 
     * Wzynacza wspolczynniki prostej prostopadlej do prostej o punktach point1 oraz point2 i przechodzacej przez punkt 3
     * 
     * @param point1 punkt 1 prostej
     * @param point2 punk 2 prostej
     * @param point3 punkt przez ktory ma przechodic prosta prostopadla
     * @returns 
     */
    export function perpendicularLineThroughPoint(point1: Vector2, point2: Vector2, point3: Vector2){

        const lc = lineCoefficients(point1, point2);

        const a = 1 / lc.a * -1;

        const b = point3.y - a * point3.x;

        return {
            a: a,
            b: b
        }

    }

    //TESTED
    /**
     * 
     * Wyznacza punk przeciecia sie prostopadłej prostej o wsp point1 i point2 oraz prostej prostopadlej do niej o  wsp w punkcie point3
     * 
     * @param point1 
     * @param point2 
     * @param point3 
     * @returns 
     */
    export function intersectionPerpendicularLines(point1: Vector2, point2: Vector2, point3: Vector2, tolerance?:number): Vector2{

        const tol:number = (tolerance != undefined) ? tolerance : TOLERANCE_0_15;


        if(equalsDecimals(point1.distanceTo(point2), 0, tol)){
            throw new Error("Bledne parametry prostej")
        }

        //Rownolegla do X
        if(equalsDecimals(point1.x, point2.x, tol)) {
            
            return new Vector2(point1.x, point3.y);
        }
        //Rownolegla do Y
        if(equalsDecimals(point1.y, point2.y, tol)){
        
            return new Vector2(point3.x, point1.y);

        }

        // Oblicz wektor kierunkowy prostej i znormalizuj go
        const d = new Vector2().subVectors(point2, point1).normalize();

        // Oblicz wektor od point1 do point3
        const v = new Vector2().subVectors(point3, point1);

        // Oblicz parametr t (rzutowanie punktu point3 na prostą)
        const t = v.dot(d);

        // Oblicz punkt przecięcia
        return new Vector2().addVectors(point1, d.multiplyScalar(t));
    }


    /**
     * 
     * Sprawdzeie czy punk lezy na prostej
     * 
     * @param point1 1 wspolrzedna prostej
     * @param point2 2 wspolrzedna prostej
     * @param point3 wspolrzedna do sprawdzenia
     * @param c a i b  do sprawdzenia
     * @prec prec precyzja w px (undefinited lub 0 brak tolerancji)
     * @returns 
     */
    export function pointOnLine(point1: Vector2, point2: Vector2, point3: Vector2, c?: {a: number, b: number}, prec?: number){
        const lC1 = (c) ? c : lineCoefficients(point1, point2);

        const rs = lC1.a * point3.x + lC1.b;
        
        const is = (rs == point3.y) ? true : false

        if(prec == undefined){
            return is;
        } else {
            const frPx = pixelsToMeter(prec);
            if( Math.abs(rs-point3.y) < frPx ){
                return true;
            }
        }
        return false;
    }

    /**
     * 
     * przelicza pixele na milimetry
     * 
     * @param value wartosc w pikeslach
     * @param dpi dpi
     * @returns 
     */
    export function pixelsToMillimeter(value: number, dpi: number = 96){
        return (value * 25.4 ) / dpi;
    }

    /**
     * 
     * Przelicza milimetry na pixele
     * 
     * @param value wartosc w milimetrach
     * @param dpi dpi
     * @returns 
     */
    export function milimeterToPixel(value: number, dpi: number = 96){
        return value * (dpi / 25.4)
    }

    /**
     * 
     * Przelicza pixele na metry
     * 
     * @param value wartosc w pixelach
     * @param dpi pi
     * @returns 
     */
    export function pixelsToMeter(value: number, dpi: number = 96){
        return pixelsToMillimeter(value, dpi) / 1000;
    }

    /**
     * 
     * Przelicza metry na pixele
     * 
     * @param value wartosc w metrach
     * @param dpi dpi
     * @returns 
     */
    export function meterToPixels(value: number, dpi: number = 96) {
        return milimeterToPixel(value, dpi) * 1000;
    }

    /**
     * 
     * Czy punkt o wsporzednych point zawiera sie w trojkacie
     * 
     * @param a 1 wspolrzedna trojkata
     * @param b 2 wspolrzedna trojkata
     * @param c 3 wspolrzedna trojkata
     * @param point wspolrzedna do sprawdzenia
     * @returns 
     */
    export function pointInTrianangle(a: Vector2, b: Vector2, c: Vector2, point: Vector2){
        
        const v0 = new Vector2().subVectors( c, a );
        const v1 = new Vector2().subVectors( b, a );
        const v2 = new Vector2().subVectors( point, a );

        const dot00 = v0.dot( v0 );
        const dot01 = v0.dot( v1 );
        const dot02 = v0.dot( v2 );
        const dot11 = v1.dot( v1 );
        const dot12 = v1.dot( v2 );

        const d = ( dot00 * dot11 - dot01 * dot01 );

        if(d == 0){
            return false;
        }

        const u = ( dot11 * dot02 - dot01 * dot12 ) / d;
        const v = ( dot00 * dot12 - dot01 * dot02 ) / d;
        
        const w = 1 - u - v;
        return ( w >= 0 ) && ( v >= 0 ) && ( ( w + v ) <= 1 );
    }

    /**
     * 
     * Oblicza kat pomiedzy wektorami point1, point2, point3, point2 jest wierzcholkiem
     * 
     * @param point1 1 wspolrzedna
     * @param point2 2 wspolrzedna - wierzcholek
     * @param point3 3 wspolrzedna
     * @returns 
     */
    export function angleBeetweenThreePoints(point1: Vector2, point2: Vector2, point3: Vector2){

        let angle = relativeAngleBeetweenThreePoints(point1,point2, point3);
        if(angle > RADIAN_360) return 0;

        return ( (point1.x < point2.x && point1.y < point2.y) || (point1.x > point2.x && point1.y < point2.y)) ? RADIAN_360 - angle : angle;

    }

  
    /**
     * 
     * Oblicza kat pomiedzy tzrema punktami
     * Zwraca zawsze najmniejszy kat pomiedzy nimi
     * 
     * @param point1 
     * @param point2 
     * @param point3 
     * @returns 
     */
    export function relativeAngleBeetweenThreePoints(point1: Vector2, point2: Vector2, point3: Vector2) {
        const ba = new Vector2().subVectors(point1, point2);
        const bc = new Vector2().subVectors(point3, point2);

        const arcCos = ba.dot(bc) / (ba.length() * bc.length());

        let angle = Math.acos(arcCos);

        return angle;
    }
        

    /**
     * 
     * Oblicza srodek ciezkosci trojkata
     * 
     * @param point1 1 wspolrzedna wierzcholka trojkata
     * @param point2 2 wspolrzedna wierzcholka trojkata
     * @param point3 3 wspolrzedna wierzcholka trojkata
     * @returns 
     */
    export function midpointTriangle(point1: Vector2, point2: Vector2, point3: Vector2) {

        return new Vector2().addVectors(point1, point2).add(point3).divideScalar(3);

    }

    /**
     * 
     * Pole trojkata z trzech punktow
     * 
     * @param point1 1 wspolrzedna wierzcholka trojkata
     * @param point2 2 wspolrzedna wierzcholka trojkata
     * @param point3 3 wspolrzedna wierzcholka trojkata
     * @returns 
     */
    export function areaTriangle(point1: Vector2, point2: Vector2, point3: Vector2) {

        /**
         * Formula
         * 0.5* Math.abs((point2.x - point1.x)*(point3.y - point1.y) - (point2.y - point1.y)*(point3.x - point1.x))
         */
        const v1 = new Vector2().subVectors(point3, point2);
        const v2 = new Vector2().subVectors(point1, point2);
        return Math.abs(v1.cross(v2)) * 0.5;

    }

    /**
     * 
     * Zwraca punkt srodkowy odcinka o wsp sPoint, ePoint
     * 
     * @param sPoint 
     * @param ePoint 
     * @returns 
     */
    export function getCenterPointLineSegment(sPoint: Vector2, ePoint: Vector2): Vector2{
        return new Vector2((sPoint.x + ePoint.x)/2, (sPoint.y + ePoint.y) / 2);
    }

    /**
     * Zwraca punkt srodkowy promienia
     * 
     * @param startAngle 
     * @param endAngle 
     * @param centerPoint 
     * @param radius 
     * @returns 
     */
    export function getCenterPointArc(startAngle: number, endAngle: number, centerPoint: Vector2, radius: number, clockwise: boolean): Vector2{

        let normal = 0;
        let cAngle = 0;

        if(!clockwise){
            normal = endAngle < startAngle ? endAngle + 2 * Math.PI : endAngle
            cAngle = startAngle + (normal - startAngle) / 2
        } else {
            normal = startAngle < endAngle ? startAngle + 2 * Math.PI : startAngle
            cAngle = endAngle + (normal - endAngle) / 2
        }


        const cX = centerPoint.x + Math.cos(cAngle) * radius
        const cY = centerPoint.y + Math.sin(cAngle) * radius

        return new Vector2(cX, cY);

    }

    /**
     * 
     * Zwraca  punkt / dwa punkty przeciecia sie prostej z okregiem
     * W przypadku braku zwraca pusta tablice
     * 
     * @param point1 
     * @param point2 
     * @param circleCenter 
     * @param radius 
     * @returns 
     */
    export function intersectionLineCirclePoints(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number): Vector2[]{

        /**
         * Punkt rzutowania srodka okregu na linie
         */

        const points: Vector2[] = [];

        const pP = intersectionPerpendicularLines(point1, point2, circleCenter);
        const ppCl = circleCenter.distanceTo(pP);

        if(radius >= ppCl){
            const l = Math.sqrt( Math.pow(radius, 2) - Math.pow(ppCl, 2));

            const PVector = new Vector2().subVectors(point2, point1).multiplyScalar(l / point2.distanceTo(point1));

            const v1 = new Vector2().addVectors(PVector, pP);
            points.push(v1);
            const v2 = new Vector2().subVectors(pP, PVector);

            if(!v1.equals(v2)){
                points.push(v2);
            }

        }

        return points;

    }

    /**
     * 
     * Zwraca tablice wspolrzednych (dwa lub jeden) przeciecia sie odcinka z okregiem
     * Zwraca pusta tablice gdy brak przeciecia
     * 
     * @param point1 
     * @param point2 
     * @param circleCenter 
     * @param radius 
     * @returns 
     */
    export function intersectionLineSegmentCirclePoints(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number) {

        const intPoints: Vector2[] = [];
        const points = intersectionLineCirclePoints(point1, point2, circleCenter, radius);

        for(const p of points){

            if(onSegment(point1, point2, p)){
                intPoints.push(p);
            }
        }

        return intPoints;
    }

    /**
     * 
     * Przeciecei odcinka z okregiem
     * 
     * @param point1 
     * @param point2 
     * @param circleCenter 
     * @param radius 
     * @returns 
     */
    export function intersectionLineSegmentCircle(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number): IntersectionType {
        const points = intersectionLineSegmentCirclePoints(point1, point2, circleCenter, radius);
        let intType: IntersectionType = IntersectionType.noIntersection;

        if(points.length > 0) {
        
            return interstationLineArcCircleType(point1, point2, circleCenter, radius, points.length);
            
        }

        return intType;
    }

    /**
     * 
     * Przeciecie sie lini z lukiem
     * 
     * @param point1 - punkt 1 odcinka
     * @param point2  - punkt 2 odcinka
     * @param circleCenter  - punkt sentralny luku
     * @param radius - promien luku
     * @param startAngle  - kat startowy luku
     * @param endAngle  - kat koncowy luku
     * @param clockwise - czy zgodny z wskazowkami zegara
     * @returns tablica 1 lub 2 punktow, 0 w przypadku braku przeciecia
     */
    export function interstationLineArcPoint(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number, startAngle: number, endAngle: number, clockwise: boolean): Vector2[]{

        const intPoints = intersectionLineCirclePoints(point1, point2, circleCenter, radius);

        return pointsInsideArcAngle(intPoints, circleCenter, startAngle, endAngle, clockwise, false);

    }

    /**
     * 
     * Wyznacza kat jaki tworzy punkt z srodkiem okregu
     * 
     * @param circleCenter punk srodkowy okregu
     * @param point punkt
     * @returns 
     */
    export function angleBeetweenCircleCenterPoint(circleCenter: Vector2, point: Vector2) {
        let angle =  Math.acos((point.x - circleCenter.x) / point.distanceTo(circleCenter));
    

        if(circleCenter.y > point.y) {
            angle = RADIAN_360 - angle;
        }

        if(equalsDecimals(angle, 0, TOLERANCE_0_15)) {
            angle =RADIAN_360;
        }

        return angle;

    }

    /**
     * 
     * Czy punkt znajduje sie pomiedzy katami luku
     * 
     * @param intPoints 
     * @param circleCenter 
     * @param startAngle 
     * @param endAngle 
     * @param clockwise 
     * @returns 
     */
    export function pointsInsideArcAngle(intPoints: Vector2[], circleCenter: Vector2, startAngle: number, endAngle: number, clockwise: boolean, angleFromParametric: boolean = true) {
        
        
        if(equalsDecimals(endAngle, 0, TOLERANCE_0_15)) {
            endAngle = RADIAN_360;
        }

        const arcIntPoints: Vector2[] = [];
        for(const v of intPoints){

            let f: (sAngle: number, eAngle: number, angle: number) =>boolean = (sa, ea, a)=>{return true}

            if(startAngle > endAngle) {
                
                if(!clockwise) {
                    f = (sa, ea, a) =>{
                        return ( (a >= sa && a <= RADIAN_360) || (a >= 0 && a <= ea) );
                    }
                } else {
                    
                    f = (sa, ea, a) =>{
                        return (a >= ea && a <= sa);
                    }
                }

            } else {
                
                if(!clockwise) {
                    f = (sa, ea, a) =>{
                        return ( a >= sa && a <= ea);
                    }
                } else {
                    f = (sa, ea, a) =>{
                        return ( (a >= ea  && a <= RADIAN_360) || (a >= 0 && a <= sa) );
                    }
                }
            }

            const angle = angleBeetweenCircleCenterPoint(circleCenter, v);
        
            if(f(startAngle, endAngle, angle)){
                arcIntPoints.push(v);
             }

        }

        return arcIntPoints;
    }

    /**
     * 
     * Przeciecie sie odcinka z lukiem
     * 
     * 
     * @param point1 - punkt 1 odcinka
     * @param point2  - punkt 2 odcinka
     * @param circleCenter  - punkt sentralny luku
     * @param radius - promien luku
     * @param startAngle  - kat startowy luku
     * @param endAngle  - kat koncowy luku
     * @param clockwise - czy zgodny z wskazowkami zegara
     * @returns tablica 1 lub 2 punktow, 0 w przypadku braku przeciecia
     */
    export function interstationLineSegmentArcPoints(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number, startAngle: number, endAngle: number, clockwise: boolean) {
  
        const points: Vector2[] = [];

        for(const p of interstationLineArcPoint(point1, point2, circleCenter, radius, startAngle, endAngle, clockwise)){

            if(onSegment(point1, point2, p)){
              
                points.push(p);
            }
        }

        return points;
    }

     /**
     * 
     * Przeciecie sie odcinka z lukiem
     * 
     * @param point1 - punkt 1 odcinka
     * @param point2  - punkt 2 odcinka
     * @param circleCenter  - punkt sentralny luku
     * @param radius - promien luku
     * @param startAngle  - kat startowy luku
     * @param endAngle  - kat koncowy luku
     * @param clockwise - czy zgodny z wskazowkami zegara
     * @returns typ przeciecia
     */
    export function interstationLineSegmentArc(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number, startAngle: number, endAngle: number, clockwise: boolean): IntersectionType {


        let intType: IntersectionType = IntersectionType.noIntersection;
        const points: Vector2[] = interstationLineSegmentArcPoints(point1, point2, circleCenter, radius, startAngle, endAngle, clockwise);

        if(points.length > 0) {
           return interstationLineArcCircleType(point1, point2, circleCenter, radius, points.length);
        }

        return intType;

    }

    /**
     * 
     * Zwraca typ przeciecia dla jednego lub 2 punktow odcinka z lukiem / okregiem
     * 
     * @param point1 punkt startowy odcinka
     * @param point2 punkt koncowy
     * @param circleCenter punk srodkowy okregu
     * @param radius promien
     * @param pointsLengt ilosc punktow
     * @returns 
     */
    function interstationLineArcCircleType(point1: Vector2, point2: Vector2, circleCenter: Vector2, radius: number, pointsLengt: number){

        if(pointsLengt == 1) {
            return equalsDecimals(point1.distanceTo(circleCenter), radius, TOLERANCE_0_15) || equalsDecimals(point2.distanceTo(circleCenter), radius, TOLERANCE_0_15) ? IntersectionType.onLine : IntersectionType.intersection;
        } else {
            
            return equalsDecimals(point1.distanceTo(circleCenter), radius,TOLERANCE_0_15) && equalsDecimals(point2.distanceTo(circleCenter), radius, TOLERANCE_0_15) ? IntersectionType.onLine : IntersectionType.intersection;
        }

    }


    /**
     * 
     * Czy punk lezy w srodku segmentu promienia
     * 
     * @param point punkt do sprawedzenia
     * @param circleCenter srodek segmentu luku
     * @param radius promien segmentu luku
     * @param startAngle kat startowy
     * @param endAngle kat koncowy
     * @param clockwise zgodny z wskazowkami zegara
     * @returns true - punkt jets w srodku segmentu, false - punk nie lezy w srodku segmentu
     */
    export function pointInArcSegment(point: Vector2, circleCenter: Vector2, radius: number, startAngle: number, endAngle: number, clockwise: boolean) {

        const pc = pointInCircle(point, radius, circleCenter);

        if(!pc) {return false}

        if(!pointInCircle){
            return false;
        }

        const intr = pointsInsideArcAngle([point], circleCenter, startAngle, endAngle, clockwise);
      
        if(intr.length > 0){
            return true;
        }

        return false;
    }



    /**
     * 
     * Przecieice okregu z okregem
     * 
     * @param radius1 
     * @param center1 
     * @param radius2 
     * @param center2 
     * @returns 
     */
    export function intersectionCircleCircle(radius1: number, center1: Vector2, radius2: number, center2: Vector2): IntersectionType{

        let inte = IntersectionType.noIntersection;

        const distCenter = center1.distanceTo(center2);

        if(equalsDecimals(radius1 + radius2, distCenter, 0.0000000005)){
            return IntersectionType.onLine;
        }

        const maxRad = Math.max(radius1, radius2);
        const minRad = Math.min(radius1, radius2);
        
        if(equalsDecimals(maxRad - minRad, distCenter, TOLERANCE_0_15) && maxRad > minRad){
            return IntersectionType.onLine;
        }


        if( ((maxRad - minRad) < distCenter) && (distCenter < (radius1 + radius2) )){
            return IntersectionType.intersection;
        }

        return inte;

    }


    /**
     * 
     * Wyznacza punkty przeciecia sie dwoch okregow
     * W przypadku stycznosci - 1 punkt
     * W przypadku braku - pusta tablice
     * 
     * @param centerPoint1 punkt centralny 1 okregu
     * @param radus1 promien 1 okregu
     * @param centerPoint2 punkt centralny 2 okregu
     * @param radius2 promien 2 okregu
     * @returns tablica dwoch punktow w przypadku przeciecia, tablica jednego punktu - styczne, pusta tablica  - brak przeciecia
     */
    export function intersectionCircleCirclePoints(centerPoint1: Vector2, radius1: number, centerPoint2: Vector2, radius2: number){


            const points: Vector2[] = [];

            //Czy okregi sie przecinaja
            const cricleIntr = intersectionCircleCircle(radius1, centerPoint1, radius2, centerPoint2);
            
            if(cricleIntr == IntersectionType.noIntersection) {
                return points;
            }

            const dis = centerPoint1.distanceTo(centerPoint2);

            const a = (Math.pow(radius1, 2) - Math.pow(radius2, 2) + Math.pow(dis, 2) ) / (dis * 2);

            const h = Math.sqrt(Math.pow(radius1, 2) - Math.pow(a, 2));

            const cx = centerPoint1.x + ((centerPoint2.x - centerPoint1.x) * (a / dis));

            const cy = centerPoint1.y + ((centerPoint2.y - centerPoint1.y) * (a / dis));

            if(cricleIntr == IntersectionType.onLine){

                points.push(new Vector2(cx, cy));
                return points;

            }

            const mx = (h *( centerPoint2.y - centerPoint1.y)) / dis;
            const my = (h *( centerPoint2.x - centerPoint1.x )) / dis;

            points.push(
                new Vector2(cx - mx, cy + my),
                new Vector2(cx + mx, cy - my)
            )

            return points;
    }

    /**
     * 
     * Filtruje punkty przeciecia sie dwoch lukow sprawdzajac czy punkty mieszcza sie w zakresie katow
     * 
     * @param points punkty przeciec do sprawdzenia
     * @param centerPoint1 punk centralny 1 luku
     * @param startAngle1 kat startowy 1 luku
     * @param endAngle1 kat koncowy 1 luku
     * @param clockWise1 zgodny z wskazowkami zegara  - luk 1
     * @param centerPoint2 punk centralny 2 luku
     * @param startAngle2 kat startowy 2 luku
     * @param endAngle2 kat koncowy 2 luku
     * @param clockWise2 zgodny z wskazowkami zegara  - luk 2
     * @returns punkty przeciecia lub pusta tablice
     */
    function intersectionArcArcFilter(points: Vector2[], centerPoint1: Vector2, startAngle1: number, endAngle1: number, clockWise1: boolean,
        centerPoint2: Vector2, startAngle2: number, endAngle2: number, clockWise2: boolean){

            const check1 = pointsInsideArcAngle(points, centerPoint1, startAngle1, endAngle1, clockWise1, true); 
            const check2 = pointsInsideArcAngle(check1, centerPoint2, startAngle2, endAngle2, clockWise2, true);
    
            return check2;

    }

    /**
     * 
     * Zwraca punkty przeciecia sie luku z lukiem
     * W przypadku braku przeciecia - ppusta tablica
     * 
     * @param centerPoint1 punk centralny 1 luku
     * @param radius1 promien1 luku
     * @param startAngle1 kat startowy 1 luku
     * @param endAngle1 kat koncowy 1 luku
     * @param clockWise1 zgodny z wskazowkami zegara  - luk 1
     * @param centerPoint2 punk centralny 2 luku
     * @param radius2 promien 2 luku
     * @param startAngle2 kat startowy 2 luku
     * @param endAngle2 kat koncowy 2 luku
     * @param clockWise2 zgodny z wskazowkami zegara  - luk 2
     * @returns zwraca punkty przeciecia sie lub pusta tablice
     */
    export function intersectionArcArcPoints(centerPoint1: Vector2, radius1: number, startAngle1: number, endAngle1: number, clockWise1: boolean,
        centerPoint2: Vector2, radius2: number, startAngle2: number, endAngle2: number, clockWise2: boolean){

        const points = intersectionCircleCirclePoints(centerPoint1, radius1, centerPoint2, radius2);
        return intersectionArcArcFilter(points, centerPoint1, startAngle1, endAngle1, clockWise1, centerPoint2, startAngle2, endAngle2, clockWise2);

    }

    /**
     * 
     * Zwraca typ przeciecia sie luku z lukiem
     * 
     * @param centerPoint1 punk centralny 1 luku
     * @param radius1 promien1 luku
     * @param startAngle1 kat startowy 1 luku
     * @param endAngle1 kat koncowy 1 luku
     * @param clockWise1 zgodny z wskazowkami zegara  - luk 1
     * @param centerPoint2 punk centralny 2 luku
     * @param radius2 promien 2 luku
     * @param startAngle2 kat startowy 2 luku
     * @param endAngle2 kat koncowy 2 luku
     * @param clockWise2 zgodny z wskazowkami zegara  - luk 2
     * @returns zwraca typ przeciecia sie
     */
    export function intersectionArcArc(centerPoint1: Vector2, radius1: number, startAngle1: number, endAngle1: number, clockWise1: boolean,
        centerPoint2: Vector2, radius2: number, startAngle2: number, endAngle2: number, clockWise2: boolean){

        const points = intersectionCircleCirclePoints(centerPoint1, radius1, centerPoint2, radius2);
        
        if(points.length == 0){
            return IntersectionType.noIntersection;
        }

        if(points.length == 1){

            const toCheck1 = intersectionArcArcFilter(points, centerPoint1, startAngle1, endAngle1, clockWise1, centerPoint2, startAngle2, endAngle2, clockWise2);

            if(toCheck1.length == 1){
                return IntersectionType.onLine;
            }

        } else {
            const toCheck2 = intersectionArcArcFilter(points, centerPoint1, startAngle1, endAngle1, clockWise1, centerPoint2, startAngle2, endAngle2, clockWise2);

            if(toCheck2.length > 0){
                return IntersectionType.intersection
            } 
        }
            
        return IntersectionType.noIntersection;

    }

    /**
     * 
     * Czy punk lezy  w okregu
     * 
     * @param point 
     * @param radius 
     * @param circleCenter 
     * @returns 
     */
    export function pointInCircle(point: Vector2, radius: number, circleCenter: Vector2){

        const dis = point.distanceTo(circleCenter);
        return radius - dis > TOLERANCE_0_15;

    }

    /**
     * 
     * Zwraca dlugosc odcinka
     * 
     * @param startPoint 
     * @param endPoint 
     * @returns 
     */
    export function getLineSegmentLength(startPoint: Vector2, endPoint: Vector2){

        return startPoint.distanceTo(endPoint);

    }

    /**
     * 
     * Zwraca dlugosc luku
     * 
     * @param radius 
     * @param startAngle 
     * @param endAngle 
     * @returns 
     */
    export function getArcSegmentLength(radius: number, startAngle: number, endAngle: number) {

        return ((Math.abs(endAngle - startAngle))/RADIAN_360) * 2 * radius * Math.PI; 

    }

    /**
     * 
     * Zwraca przyblizona dlugosc elipsy
     * 
     * @param radiusX 
     * @param radiusY 
     * @param startAngle 
     * @param endAngle 
     * @returns 
     */
    export function getEllipseSegmentLength(radiusX: number, radiusY: number, startAngle: number, endAngle: number) {

        const h = Math.pow(radiusX - radiusY, 2) / Math.pow(radiusX + radiusY, 2);
        return ((Math.abs(endAngle - startAngle))/RADIAN_360) * ((Math.PI * (radiusX + radiusY)) * (1 + (3*h / (10 + Math.sqrt(4 - 3*h)))))

    }

    /**
     * 
     * Czy linnia jest pionowa (rownolegla do y)
     * 
     * @param startPoint 
     * @param endPoint 
     */
    export function isVerticalLine(startPoint: Vector2, endPoint: Vector2) {

        return equalsDecimals(startPoint.x, endPoint.x, TOLERANCE_0_15);

    }

    /**
     * 
     * Czy linnia jest pozioma (rownloegla do x)
     * 
     * @param startPoint 
     * @param endPoint 
     * @returns 
     */
    export function isHorisontalLine(startPoint: Vector2, endPoint: Vector2) {

        return equalsDecimals(startPoint.y, endPoint.y, TOLERANCE_0_15);
    }

    export interface ILineSegmentOffsets {

        startPointOffset: Vector2,      
        endPointOffset: Vector2,

    }

    /**
     * 
     * Zwraca nowe punkty startowe dla odsunietego odcinak
     * Wartosc dodania w X odsuwa w Parawo
     * Wartosc dodatnia w Y odsuwa w gore
     * 
     * 
     * @param startPoint punk poczatkowy
     * @param endPoint punk konczowy
     * @param offset przesuniecie
     * @param axisOffsetDirection wg ktorej osi odsuwac
     * @returns 
     */
    export function lineSegmentOffset(startPoint: Vector2, endPoint: Vector2, offset: number, axisOffsetDirection: AxisType): ILineSegmentOffsets{

        const offsets: ILineSegmentOffsets = {
            startPointOffset: startPoint.clone(),
            endPointOffset: endPoint.clone()
        }
        
        //pionowa
        if(isVerticalLine(startPoint, endPoint)){
            offsets.startPointOffset = new Vector2(startPoint.x + offset, startPoint.y);
            offsets.endPointOffset = new Vector2(endPoint.x + offset, endPoint.y);

            return offsets;

        }
        //Pozioma
        if(isHorisontalLine(startPoint, endPoint)){

            offsets.startPointOffset = new Vector2(startPoint.x, startPoint.y + offset);
            offsets.endPointOffset = new Vector2(endPoint.x , endPoint.y + offset);

            return offsets;
        }

        //Jak przesuwac
        const v1d = new Vector2().subVectors(endPoint, startPoint);
        const v2d = new Vector2().subVectors(new Vector2(1000, endPoint.y), startPoint);

        const cross = v1d.cross(v2d);
        let offsetMultiX = 1;
        let offsetMultiY = 1;

        const d = (endPoint.x > startPoint.x) ? 1 : -1;
  
        if(axisOffsetDirection == AxisType.X) {

            offsetMultiY = (cross * d > 0) ? 1 : -1;

        } else if (axisOffsetDirection == AxisType.Y) {
           
            offsetMultiX = (cross * d > 0) ? 1 : -1;
        }

        const angle = relativeAngleBeetweenThreePoints(startPoint, endPoint, new Vector2(1000, endPoint.y));
        const offsetX = Math.abs(Math.sin(angle)) * offsetMultiX *  offset;
        const offsetY = Math.abs(Math.cos(angle)) * offsetMultiY  * offset; 

        offsets.startPointOffset = new Vector2(startPoint.x + offsetX, startPoint.y + offsetY);
        offsets.endPointOffset = new Vector2(endPoint.x + offsetX, endPoint.y + offsetY);

        return offsets;

    }

    /**
     * 
     * Zaokraglenie dwoch prostych o punktach point1 i point2 oraz point2 i point3
     * Zwraca parametry do zaokraglania
     * W przypadku niemozliwosci wykonania zaokraglenia zwraca undefined
     * 
     * @param point1 punkt startowy prostej 1 
     * @param point2 punkt koncowy prostej 1, punkt startowy prostej 2
     * @param point3 punkt koncowy prostej 3
     * @param radius promien zaokraglenia
     */
    export function roundingTwoSegments(point1: Vector2, point2: Vector2, point3: Vector2, radius: number): IRoudingParameters | null{

        if(equalsDecimals(radius, 0, TOLERANCE_0_15)){
            return null;
        }

        let o1: ILineSegmentOffsets;
        let o2: ILineSegmentOffsets;
        let raidusPoint: Vector2 | null;

        o1 = lineSegmentOffset(point1, point2, -radius, AxisType.X);
        o2 = lineSegmentOffset(point2, point3, -radius, AxisType.X);
        raidusPoint = intersectionTwoLinePoint(o1.startPointOffset, o1.endPointOffset, o2.startPointOffset, o2.endPointOffset);

        if(raidusPoint && pointInTrianangle(point1, point2, point3, raidusPoint)){
            return calculateRoudingParameters(point1, point2, point3, radius, raidusPoint);
        }

        o1 = lineSegmentOffset(point1, point2, radius, AxisType.X);
        o2 = lineSegmentOffset(point2, point3, radius, AxisType.X);
        raidusPoint = intersectionTwoLinePoint(o1.startPointOffset, o1.endPointOffset, o2.startPointOffset, o2.endPointOffset);

        if(raidusPoint && pointInTrianangle(point1, point2, point3, raidusPoint)){
            return calculateRoudingParameters(point1, point2, point3, radius, raidusPoint);
        }

        o1 = lineSegmentOffset(point1, point2, -radius, AxisType.X);
        o2 = lineSegmentOffset(point2, point3, radius, AxisType.X);
        raidusPoint = intersectionTwoLinePoint(o1.startPointOffset, o1.endPointOffset, o2.startPointOffset, o2.endPointOffset);

        if(raidusPoint && pointInTrianangle(point1, point2, point3, raidusPoint)){
            return calculateRoudingParameters(point1, point2, point3, radius, raidusPoint);
        }

        o1 = lineSegmentOffset(point1, point2, radius, AxisType.X);
        o2 = lineSegmentOffset(point2, point3, -radius, AxisType.X);
        raidusPoint = intersectionTwoLinePoint(o1.startPointOffset, o1.endPointOffset, o2.startPointOffset, o2.endPointOffset);

        if(raidusPoint && pointInTrianangle(point1, point2, point3, raidusPoint)){
            return calculateRoudingParameters(point1, point2, point3, radius, raidusPoint);
        }

        return null;


    }

    /**
     * 
     * Oblicza środki luku na podstawie punktu startowego, koncowego, promienia
     * W przypadku braku mozliwosci wyznaczenia srodka o podanym promieniu zwraca pusta tablice
     * W zaleznosci od podanych wartosci zwraca jeden lub dwa mozliwe srodki promienia
     * 
     * @param startPoint punk startowy
     * @param endPoint punk koncowy
     * @param radius promien
     * @returns jeden lub dwa mozliwe srodki promienia, pusta tablica w przypadku braku
     */
    export function calculateCenterArcByPoints(startPoint: Vector2, endPoint: Vector2, radius: number){

        const clenght = startPoint.distanceTo(endPoint);

        /**
         * Czy da sie wyznaczyc srodek okregu
         */
        if(clenght > radius *2) {
            return [];
        }

        /**
         * Czy taki sma promien jak odleglosc startPoint do endPoint
         */
        if(equalsDecimals(clenght, radius, TOLERANCE_0_15) ) {
            return [getCenterPointLineSegment(startPoint, endPoint)];
        }

        const angleToRoration = RADIAN_180 -  angleBeetweenThreePoints(startPoint, endPoint, new Vector2(endPoint.x + 1000, endPoint.y)) ;

        const newSP = startPoint.clone().rotateAround(endPoint, angleToRoration);
        const cp = getCenterPointLineSegment(newSP, endPoint);
        const lenght = newSP.distanceTo(cp);
        const height = Math.sqrt(Math.pow(radius, 2) - Math.pow(lenght, 2));

        const center1 = new Vector2(cp.x, cp.y + height);
        const center2 = new Vector2(cp.x, cp.y - height);

        center1.rotateAround(endPoint, -angleToRoration);
        center2.rotateAround(endPoint, -angleToRoration);

        return [center1, center2];

    }


    /**
     * Parametry zaokraglania / luku
     */
    export interface IRoudingParameters {
        /**
         * Punkt pocatkowy luku
         */
        firstArcPoint: Vector2,
        /**
         * Kat poczatkowy luku
         */
        firstAngle: number,
        /**
         * Punkt koncowy luku
         */
        lastArcPoint: Vector2,
        /**
         * Kat konczowy luku
         */
        secondAngle: number,
        /**
         * Srodek luku
         */
        arcCenterPoint: Vector2,
        /**
         * Promien
         */
        radius: number

        /**
         * Kierunek zgodny z wskazowkami zegara
         */
        clockwise: boolean;
    }

    /**
     * 
     * Zwraca parametry do zaokraglenia dwoch prostych
     * 
     * @param point1 punkt startowy prostej 1
     * @param point2 punkt koncowy prostej 1, punkt startowy prostej 2
     * @param point3 punkt koncowy prostej 3
     * @param radius promien luku
     * @param arcCenterPoint srodek luku
     * @returns 
     */
    function calculateRoudingParameters(point1: Vector2, point2: Vector2, point3: Vector2, radius: number, arcCenterPoint: Vector2):IRoudingParameters | null{

        const relativeVector = new Vector2(point2.x + 1000, point2.y);
        const anglePoints = angleBeetweenThreePoints(arcCenterPoint, point2, relativeVector);
        const segmentAngle =  relativeAngleBeetweenThreePoints(point1, point2, point3);
        const firstArcPoint = intersectionPerpendicularLines(point1, point2, arcCenterPoint);
        const lastArcPoint = intersectionPerpendicularLines(point2, point3, arcCenterPoint);

        let fAngle = anglePoints + segmentAngle/2 + RADIAN_90;
        let sAngle = anglePoints - segmentAngle/2 - RADIAN_90;

    
        if(fAngle > RADIAN_360){
            fAngle-=RADIAN_360;
        }

        fAngle = (fAngle > 0) ? fAngle : RADIAN_360 + fAngle;
        sAngle = (sAngle > 0) ? sAngle : RADIAN_360 + sAngle;

        //Jaki kierunek prostych zaokraglanych

        const dir = linesDirection(point1, point2, point3);

        const parameters:IRoudingParameters = {
            firstArcPoint: firstArcPoint,
            firstAngle: fAngle,
            lastArcPoint: lastArcPoint,
            secondAngle: sAngle,
            arcCenterPoint: arcCenterPoint,
            radius: radius,
            clockwise: false
        }

         if(dir === OrientationLine.CW){
            
             parameters.clockwise = true;
             parameters.firstAngle = sAngle ;
             parameters.secondAngle = fAngle ;
        
         }

        return parameters;
      
    }


    function linesDirectionCross(point1: Vector2, point2: Vector2, point3: Vector2){
        const v1 = new Vector2().subVectors(point2, point1);
        const v2 = new Vector2().subVectors(point3, point1);

        return v2.cross(v1);

    }

    /**
     * 
     * Zwraca kierunek dwoch odcinkow
     * 
     * @param point1 punkt startowy 1 odcinka
     * @param point2 punkt koncowy 1 odcinak, punkt startwoy 2 odcinka
     * @param point3 punk koncowy 2 odcinka
     * @returns 
     */
    export function linesDirection(point1: Vector2, point2: Vector2, point3: Vector2){
 

        const cross = linesDirectionCross(point1, point2, point3);

        if(equalsDecimals(cross, 0, TOLERANCE_0_15)) return OrientationLine.collinear;

        return (cross > 0) ? OrientationLine.CW : OrientationLine.CCW;

    }


    /**
     * 
     * Zwraca pole okregu
     * 
     * @param radius promien okregu
     * @returns 
     */
    export function areaCircle(radius: number){

        return Math.PI * Math.pow(radius, 2);

    }

    /**
     * 
     * Zwraca kąt wycinka okregu
     * 
     * @param startPoint punkt startowy wycinka
     * @param endPoint punkt koncowy wycinka
     * @param centerPoint punkt centralny wycinka
     * @param radius promien
     * @param clockwise czy zgodnie z wskazowkami zegara
     * @returns 
     */
    export function angleCircularSector(startPoint: Vector2, endPoint: Vector2, centerPoint: Vector2, radius: number, clockwise: boolean) {
        const pos = linesDirectionCross(startPoint, centerPoint, endPoint);
        
        const a = relativeAngleBeetweenThreePoints(startPoint, centerPoint, endPoint);

        const angle = (pos <= 0 ) ?  RADIAN_360 - a: a;

        return (clockwise) ? (RADIAN_360 - angle) : angle;
    }


    /**
     * 
     * Zwraca pole wycinka okregu
     * 
     * @param startPoint punkt startowy wycinka
     * @param endPoint punkt koncowy wycinka
     * @param centerPoint punkt centralny wycinka
     * @param radius promien
     * @param clockwise czy zgodnie z wskazowkami zegara
     * @returns 
     */
    export function areaCircularSector(startPoint: Vector2, endPoint: Vector2, centerPoint: Vector2, radius: number, clockwise: boolean) {

        return areaCircle(radius) * angleCircularSector(startPoint, endPoint, centerPoint, radius, clockwise) / RADIAN_360;

    }


    /**
     * 
     * Zwraca pole segmentu okregu
     * 
     * @param startPoint 
     * @param endPoint 
     * @param centerPoint 
     * @param radius 
     * @param clockwise 
     * @returns 
     */
    export function areaCircularSegment(startPoint: Vector2, endPoint: Vector2, centerPoint: Vector2, radius: number, clockwise: boolean){

        //jaki kat pomiedzy wycinkiem
        const angle = angleCircularSector(startPoint, endPoint, centerPoint, radius, clockwise);

        const ca = areaCircle(radius);

        const at = areaTriangle(startPoint, centerPoint, endPoint);

        const acs = ca * angle / RADIAN_360;

        return (angle < RADIAN_180) ? acs - at : acs + at;

      
    }

    /**
     * 
     * Zwraca srodek ciezkosci segmentu okregu
     * 
     * @param startPoint punkt startowy okregu
     * @param endPoint punktkoncowy okregu
     * @param centerPoint punk srodkowy okregu
     * @param radius promien okregu
     * @param clockwise zgodnie z wskazowkami zegara
     * @returns 
     */
    export function centroidCircularSegment(startPoint: Vector2, endPoint: Vector2, centerPoint: Vector2, radius: number, clockwise: boolean): Vector2 {

        const angle = angleCircularSector(startPoint, endPoint, centerPoint, radius, clockwise);

        //Rotacja do Y
        let sAngle = angleBeetweenThreePoints(startPoint, centerPoint, new Vector2(centerPoint.x + 1000, centerPoint.y));
    
        if(equalsDecimals(sAngle, RADIAN_90, TOLERANCE_0_15)){
   
            const sAngle2 = angleBeetweenThreePoints(endPoint, centerPoint, new Vector2(centerPoint.x + 1000, centerPoint.y));
           
            if( (!clockwise && equalsDecimals(sAngle2, 0, TOLERANCE_0_15)) || (clockwise && equalsDecimals(sAngle2, RADIAN_180, TOLERANCE_0_15))) {
                sAngle = RADIAN_270;
            } 

        }

        let rotAngle = (clockwise) ?sAngle - angle/2 - RADIAN_90 : sAngle + angle/2 - RADIAN_90;
        
        

        const y =  (4 * radius)/3 *  (Math.pow(Math.sin(angle / 2), 3) / (angle - Math.sin(angle)));
        const centroid = new Vector2(0, y);
        centroid.rotateAround(new Vector2(), rotAngle);

        centroid.x += centerPoint.x;
        centroid.y += centerPoint.y;

        return centroid;

    }


    /**
     * 
     * Zwraca poczatkowy i koncowy kat luku
     * 
     * @param startPoint punk poczatkowy
     * @param endPoint  punk koncowy
     * @param centerPoint punk centralny luku
     * @returns 
     */
    export function getCircleStartEndAngle(startPoint: Vector2, endPoint: Vector2, centerPoint: Vector2): [number, number]{

        const relativeVector = new Vector2(centerPoint.x + 1000, centerPoint.y);
        const startAngle = angleBeetweenThreePoints( startPoint, centerPoint, relativeVector);
        const endAngle = angleBeetweenThreePoints(endPoint, centerPoint, relativeVector);
        return [startAngle, endAngle];

    }


    /**
     * 
     * Zwraca parametry luku na podstawie punktu poczatkowego i koncowego
     * Luk obliczony na podstawie stycznosci do lini poziomej
     * 
     * @param startPoint 
     * @param endPoint 
     * @param clockwise 
     * @returns 
     */
    export function calculateArcFromStartEndPoint(startPoint: Vector2, endPoint: Vector2, clockwise: boolean) {

        if(equalsVectors(startPoint, endPoint)){return undefined};

        const isH = isHorisontalLine(startPoint, endPoint);

        if(isH){return undefined};

        const cpLine = getCenterPointLineSegment(startPoint, endPoint);
        let arcCenter: Vector2 | undefined;

        const c = perpendicularLineThroughPoint(startPoint, endPoint, cpLine);
        arcCenter = intersectionTwoLinePointByCoefficients(startPoint, new Vector2(startPoint.x, startPoint.y + 1000), c);
        
        if(arcCenter == undefined){return undefined};
        
        const radius = arcCenter.distanceTo(startPoint);
        const angles = getCircleStartEndAngle(startPoint, endPoint, arcCenter);
        const param = createArcParameters(startPoint, endPoint, arcCenter, clockwise, radius, angles);

        if(!clockwise) {
            param.firstAngle = RADIAN_360 - param.firstAngle
        } else {
            if(equalsDecimals( param.firstAngle,  param.secondAngle, TOLERANCE_0_15)){
                param.secondAngle = RADIAN_360 - param.secondAngle;
            }
        }

        return checkArcParameters(param);

    }

    /**
     * 
     * Sprawdza poprawnosc parametrow luku
     * Zwraca undefinited jezeli niepoprawne
     * 
     * @param params 
     * @returns 
     */
    function checkArcParameters(params: IRoudingParameters) {

        if(isNaN(params.radius) || isNaN(params.firstAngle) || isNaN(params.secondAngle)) return undefined;
        return params;
    }

    /**
     * 
     * Zwraca parametry luku
     * 
     * @param startPoint punk startowy
     * @param endPoint punk koncowy
     * @param arcCenter srodek
     * @param clockwise zgodny z wskazowkami zegara
     * @param radius promien
     * @param angles katy poczatkowy i koncowy
     * @returns 
     */
    function createArcParameters(startPoint: Vector2, endPoint: Vector2, arcCenter: Vector2, clockwise: boolean, radius: number, angles: [number, number] ): IRoudingParameters  {
        
        const param: IRoudingParameters = {
            arcCenterPoint: arcCenter,
            clockwise: clockwise,
            radius: radius,
            firstAngle: angles[0],
            secondAngle: angles[1],
            firstArcPoint: startPoint,
            lastArcPoint: endPoint
            
        }
        return param;
    }

    /**
     * 
     * Koryguje wartosc poczatkowego i koncowego kata luku stycznego do lini poziomej
     * 
     * @param startPointLine punkt startowy lini poziomej
     * @param endPointLine punk koncowy lini poziomej
     * @param params parametry luku
     */
    export function correctArcTangentToHorisontalLine(startPointLine: Vector2, endPointLine:Vector2, params: IRoudingParameters){
        if( startPointLine.x < endPointLine.x){
            if(!params.clockwise) {
                params.firstAngle = RADIAN_360 - params.firstAngle
            } else {
                if(equalsDecimals( params.firstAngle,  params.secondAngle, TOLERANCE_0_15)){
                    params.secondAngle = RADIAN_360 - params.secondAngle;
                }
            }
        } else {
            if(params.clockwise) {
                params.firstAngle = RADIAN_360 - params.firstAngle
            } else {
                if(equalsDecimals( params.firstAngle,  params.secondAngle, TOLERANCE_0_15)){
                    params.secondAngle = RADIAN_360 - params.secondAngle;
                }
            }
        }
    }

    /**
     * 
     * Zwraca parametry luku stycznego do odcinka
     * Zwraca undefinited w przypadku braku mozliwosci utworzenia luku
     * 
     * @param startPointLine punkt startowy odcinka
     * @param endPointLine punk koncowy odcinka, poczatkowy luku
     * @param endPointArc punk koncowy luku
     * @returns 
     */
    export function calculateArcTangentToLine(startPointLine: Vector2, endPointLine: Vector2, endPointArc: Vector2): IRoudingParameters | undefined{


        const isHL = isHorisontalLine(startPointLine, endPointLine);
        const isVL = isVerticalLine(startPointLine, endPointLine);
        const isHA = isHorisontalLine(endPointLine, endPointArc);
        const isVA = isVerticalLine(endPointLine, endPointArc);

        if( (isHL && isHA) || (isVL && isVA)) return undefined;

        const dir = linesDirection(startPointLine, endPointLine, endPointArc);

        let center = new Vector2();
        const clockWise = (dir == OrientationLine.CW) ? true : false;


        if(isHL && isVA) {

            //pozioma styczna, arc 90stopni
            const cpH = getCenterPointLineSegment(endPointLine, new Vector2(endPointLine.x, endPointArc.y));

            center.x = cpH.x
            center.y = cpH.y

            const r = center.distanceTo(endPointLine);
            const angles = getCircleStartEndAngle(endPointLine, endPointArc, center);
            const params = createArcParameters(endPointLine, endPointArc, center, clockWise, r, angles);

            if(!params) return undefined;

            correctArcTangentToHorisontalLine(startPointLine, endPointLine, params);

            return checkArcParameters(params);
        

        } 
        
        if(isVL && isHA) {

            //pionowa styczna , arc 90 stopni
            const cpH = getCenterPointLineSegment(endPointLine, new Vector2(endPointArc.x, endPointLine.y));
            center.x = cpH.x
            center.y = cpH.y;
            const r = center.distanceTo(endPointLine);
            const angles = getCircleStartEndAngle(endPointLine, endPointArc, center);
            const params = createArcParameters(endPointLine, endPointArc, center, clockWise, r, angles);

            return checkArcParameters(params);

        } 


        /**
         * Jezeli prosta z punktow startPointLine, endPointLine jest pozioma lub pionowa wylicza ws z finkcji lineCoefficients2
         * W innym przypadku perpendicularLineThroughPoint
         */
        const c1 = (isHL) ? lineCoefficients2(endPointLine, new Vector2(endPointLine.x, endPointLine.y + 1000)) :
             (isVL) ? lineCoefficients2(endPointLine, new Vector2(endPointLine.x + 1000, endPointLine.y)) : 
             perpendicularLineThroughPoint(startPointLine, endPointLine, endPointLine)

        const cla = getCenterPointLineSegment(endPointLine, endPointArc);

        /**
         * Jezeli prosta z punktow endPointLine, endPointArc jest pozioma lub pionowa wylicza ws z finkcji lineCoefficients2
         * W innym przypadku perpendicularLineThroughPoint
         */
        const c2 = (isVA) ? lineCoefficients2(cla, new Vector2(cla.x + 1000, cla.y)) : 
            (isHA) ?  lineCoefficients2(cla, new Vector2(cla.x, cla.y + 1000)) : 
            perpendicularLineThroughPoint(endPointLine, endPointArc, cla);

        const cpTemp = intersectionTwoLinePointByCoefficients2(endPointLine, c1, cla, c2);
        if(!cpTemp){
            return undefined;
        }

        center.x = cpTemp.x;
        center.y = cpTemp.y;

        const r = center.distanceTo(endPointLine);
        const angles = getCircleStartEndAngle(endPointLine, endPointArc, center);

        const params =  createArcParameters(endPointLine, endPointArc, center, clockWise, r, angles);
        
        if(isHL){
            correctArcTangentToHorisontalLine(startPointLine, endPointLine, params);
        }

        return checkArcParameters(params);


    }


    /**
     * 
     * Zwraca parametry luku stycznego do luku
     * Zwraca undefinited w przypadku braku mozliwosci utworzenia luku
     * 
     * @param startPointArc punkt startowy luku 
     * @param endPointArc punk koncowy luku, poczatkowy luku stycznego
     * @param centerPointArc punk srodka luku
     * @param endPointTangentArc punk koncowy luku stycznego
     * @param clockWiseArc zgodny z CW
     * @returns 
     */
    export function calculateArcTangentToArc(startPointArc: Vector2, endPointArc: Vector2, centerPointArc: Vector2, endPointTangentArc: Vector2, clockWiseArc: boolean): IRoudingParameters | undefined{
        const eeV = isVerticalLine(endPointArc, endPointTangentArc);
        const eeH = isHorisontalLine(endPointArc, endPointTangentArc);
        const spV = isVerticalLine(startPointArc, endPointArc);
        const spH = isHorisontalLine(startPointArc, endPointArc);
        const dir = linesDirection(startPointArc, endPointArc, endPointTangentArc);
        let clockWise = (dir == OrientationLine.CW) ? true : false;

        if(spV && eeH) {
            if(clockWise == clockWiseArc && equalsDecimals(endPointArc.x, centerPointArc.x, TOLERANCE_0_15)) {
                return undefined;
            }
        }

        let cpTemp: Vector2 | undefined;

        const c1 =  lineCoefficients2(endPointArc, centerPointArc);
        if( (c1.b==0 || isNaN(c1.a)) && ((eeV && spV) || (eeH && spH))){
         
            cpTemp = getCenterPointLineSegment(endPointArc, endPointTangentArc);
                
        } else {
            const cp = getCenterPointLineSegment(endPointArc, endPointTangentArc);
            const c2 = (eeV) ? lineCoefficients2(cp, new Vector2(cp.x + 1000, cp.y)) : 
                (eeH) ? lineCoefficients2(cp, new Vector2(cp.x, cp.y + 1000)) :
                perpendicularLineThroughPoint(endPointArc, endPointTangentArc, cp);
        
            cpTemp = intersectionTwoLinePointByCoefficients2(startPointArc, c1, cp, c2);
        }
    
        if(!cpTemp) return undefined;

        const angles = getCircleStartEndAngle(endPointArc, endPointTangentArc, cpTemp);
        const r = cpTemp.distanceTo(endPointArc);
 
        let angle: number = 0;
        let angle2: number = 0;
   
        let ltDir: OrientationLine = OrientationLine.CW;        
        const ptemp1 = centerPointArc.clone().rotateAround(endPointArc, RADIAN_90);
        const ptemp2 = centerPointArc.clone().rotateAround(endPointArc, -RADIAN_90);
        const angle1T = angleBeetweenThreePoints(ptemp1, endPointArc, new Vector2(endPointArc.x + 1000, endPointArc.y));
        const angle2T = angleBeetweenThreePoints(ptemp2, endPointArc, new Vector2(endPointArc.x + 1000, endPointArc.y));


        if(angle1T < angle2T) {
            angle = angle1T;
            angle2 = angle2T;
            ltDir = linesDirection(ptemp1, centerPointArc, ptemp2);
        } else {
            angle = angle2T;
            angle2 = angle1T;
            ltDir = linesDirection(ptemp2, centerPointArc, ptemp1);
        }
      
        let angle3 = angleBeetweenThreePoints(endPointTangentArc, endPointArc, new Vector2(endPointArc.x + 1000, endPointArc.y));

        if(eeV &&  endPointArc.y > endPointTangentArc.y) {
            angle3 += RADIAN_180;
        }

        if(spH && equalsDecimals(endPointArc.y, centerPointArc.y, TOLERANCE_0_15)) {
               
            angle2 =  RADIAN_270;
            if(endPointArc.x < startPointArc.x) {
                    ltDir = OrientationLine.CW;
            }
                
        }

        if(angle3 == 0){
            angle3 = RADIAN_360;
        }

        /**
         * Jaki kierunek rysowanego luku
         */
        if(angle3 > angle && angle3 < angle2) {
            clockWise = (ltDir == OrientationLine.CW) ? !clockWiseArc : clockWiseArc; 
        } else {
            clockWise = (ltDir == OrientationLine.CW) ? clockWiseArc : !clockWiseArc;   
        }

        const params = createArcParameters(endPointArc, endPointTangentArc, cpTemp, clockWise, r, angles);

        if(spV && equalsDecimals(startPointArc.x, centerPointArc.x, TOLERANCE_0_15) ) {

            if(endPointArc.y < cpTemp.y) {
                params.firstAngle = RADIAN_270;
            } else {             
                if(equalsDecimals(params.firstAngle, params.secondAngle, TOLERANCE_0_15)) {
                    params.secondAngle +=RADIAN_180;
                }
            }

        }  

        return checkArcParameters(params);

    }


    /**
     * 
     * Wyznacza parametry luku stycznego do dwoch odcinkow
     * 
     * @param spLine1 punkt startowy odcinek 1
     * @param epLine1 punkt koncowy odcinek 1
     * @param spLine2 punkt startowy odcinek 2
     * @param epLine2 punkt koncowy odcinek 2
     * @returns parametry luku lub undefinited w przypadku niemozliwosci wyznaczenia
     */
    export function calculateArcTangentToLinesSegment(spLine1: Vector2, epLine1: Vector2,  spLine2: Vector2, epLine2: Vector2){

        const p1 = spLine1.clone().rotateAround(epLine1, RADIAN_90);
        const p2 = epLine2.clone().rotateAround(spLine2, RADIAN_90);

        const centerPoint = intersectionTwoLinePoint(p1, epLine1, p2, spLine2);
        if(centerPoint){
            const radius = centerPoint.distanceTo(epLine1);
            const angles = getCircleStartEndAngle(epLine1, spLine2, centerPoint);
            const dir = linesDirection(spLine1, epLine1, spLine2);
            const params: IRoudingParameters = {
                arcCenterPoint: centerPoint,
                firstAngle: angles[0],
                secondAngle: angles[1],
                radius: radius,
                firstArcPoint: epLine1.clone(),
                lastArcPoint: spLine2.clone(),
                clockwise: (dir == OrientationLine.CW) ? true : false
            }

            return checkArcParameters(params);
            
        }

        return undefined;

    }

    /**
     * 
     * Sprawdza czy luk jest styczny do luku
     * 
     * @param endPointArc punk koncowy luku1, punk poczatkowy luku2 
     * @param centerArc punk centralny luku 1
     * @param centerArcToCheck punkt centralny luku 2
     * @returns true jak styczny
     */
    export function isTangentArcArc(endPointArc: Vector2, centerArc: Vector2, centerArcToCheck: Vector2){

        const dr  = linesDirectionCross(centerArc, endPointArc, centerArcToCheck);
        return (equalsDecimals(dr, 0, TOLERANCE_0_5)) ? true : false;
    }

    /**
     * 
     * Sprawdza czy linnia jest styczna do luku
     * 
     * @param startPointLine punkt startowy linni
     * @param endPointLine punk koncowy linni
     * @param centerArc punkt srodkowy promienia
     * @returns true jak styczny
     */
    export function isTangentLineArc(startPointLine: Vector2, endPointLine: Vector2, centerArc: Vector2){

        const a = relativeAngleBeetweenThreePoints(startPointLine, endPointLine, centerArc);
        return equalsDecimals(a, RADIAN_90, TOLERANCE_0_5) ? true: false;

    }

   /**
    * 
    * Sprawdza czy luk jest styczny do linni
    * 
    * @param startPointLine punkt startowy linni
    * @param endPointLine punkt koncowy linni
    * @param centerArc 
    * @returns 
    */
    export function isTangentArcLine(startPointLine: Vector2, endPointLine: Vector2, centerArc: Vector2) {
        const a = relativeAngleBeetweenThreePoints(centerArc, startPointLine, endPointLine);
        return equalsDecimals(a, RADIAN_90, TOLERANCE_0_5) ? true: false;
    }

    export interface IArcTangentParameters { 
        tangentPoint: Vector2;
        centerPoint: Vector2;
        radius: number
    }

    /**
     * 
     * Wyznacza parametry edycjidla stycznego luku do dwoch odcinkow, na podstawie nowego punktu dzielacego luk na dwie rowne czesci
     * 
     * @param oldCenterPointArc srodkek luku edytowanego
     * @param spLine punkt poczatkowy linni
     * @param epLine punkt koncowy linni
     * @param newMildePoint nowy punkt srodkowy luku (dzielacy luk na dwie rowne czesci)
     * @returns zwraca parametry w przypadku mozliwosci wyznaczenia, undefinited w przypadku braku
     */
    export function changeArcTangentToLineByNewMiddlePoint(oldCenterPointArc: Vector2, spLine: Vector2, epLine: Vector2, newMildePoint: Vector2) : IArcTangentParameters | undefined{

        if(isHorisontalLine(oldCenterPointArc, newMildePoint)){
            return changeArcTangentToLineByNewMiddlePointHorisontal(oldCenterPointArc, spLine, epLine, newMildePoint);
        }

        if(isVerticalLine(oldCenterPointArc, newMildePoint)) {
       
            return changeArcTangentToLineByNewMiddlePointVertical(oldCenterPointArc, spLine, epLine, newMildePoint);
        }

        const p1 = oldCenterPointArc.clone().rotateAround(newMildePoint, RADIAN_90);
        
        const pi1 = intersectionTwoLinePoint(spLine, epLine, newMildePoint, p1);
        if(!pi1) { return undefined}
        
        const lm = newMildePoint.distanceTo(pi1);
        const p2 = spLine.clone().rotateAround(pi1, RADIAN_90);
        const pi2 = intersectionTwoLinePoint(oldCenterPointArc, newMildePoint, pi1, p2);

        if(!pi2) { return undefined}

        const dir1 = linesDirection(newMildePoint, pi1, pi2);

        const offsetLine1 = lineSegmentOffset(pi1, pi2, lm, AxisType.X);
        const offsetLine2 = lineSegmentOffset(pi1, pi2, -lm, AxisType.X);

        const c1 = intersectionTwoLinePoint(oldCenterPointArc, newMildePoint, offsetLine1.startPointOffset, offsetLine1.endPointOffset);
        const e1 = intersectionTwoLinePoint(spLine, epLine, offsetLine1.startPointOffset, offsetLine1.endPointOffset);
  
        if(c1 && e1) {
            const dirc1 = linesDirection(newMildePoint, e1, c1);

            if(dir1 == dirc1) {
                const radius = c1.distanceTo(e1);
                
                return {
                    centerPoint: c1, 
                    tangentPoint: e1,
                    radius: radius
                }
            }
        }

        const c2 = intersectionTwoLinePoint(oldCenterPointArc, newMildePoint, offsetLine2.startPointOffset, offsetLine2.endPointOffset);
        const e2 = intersectionTwoLinePoint(spLine, epLine, offsetLine2.startPointOffset, offsetLine2.endPointOffset);

        if(c2 && e2) {
            
            const dirc2 = linesDirection(newMildePoint, e2, c2);
            if(dir1 == dirc2){
                const radius = c2.distanceTo(e2);
                
                return {
                    centerPoint: c2,
                    tangentPoint: e2,
                    radius: radius
                }
            }
        }

        return undefined;
    }

    
    function changeArcTangentToLineByNewMiddlePointHorisontal(oldCenterPointArc: Vector2, spLine: Vector2, epLine: Vector2, newMildePoint: Vector2): IArcTangentParameters {

        const radius = ( equalsDecimals(spLine.x, oldCenterPointArc.x, TOLERANCE_0_10) ) ? spLine.distanceTo(oldCenterPointArc) : epLine.distanceTo(oldCenterPointArc);
        const newCenter = (newMildePoint.x > oldCenterPointArc.x ) ? new Vector2(newMildePoint.x - radius, oldCenterPointArc.y) : new Vector2(newMildePoint.x + radius, oldCenterPointArc.y);
        const newPoint = new Vector2(newCenter.x, spLine.y);
        
        return {
            centerPoint: newCenter,
            radius: radius,
            tangentPoint: newPoint
        }
    }


    function changeArcTangentToLineByNewMiddlePointVertical(oldCenterPointArc: Vector2, spLine: Vector2, epLine: Vector2, newMildePoint: Vector2): IArcTangentParameters {

        const radius = ( equalsDecimals(spLine.y, oldCenterPointArc.y, TOLERANCE_0_10) ) ? spLine.distanceTo(oldCenterPointArc) : epLine.distanceTo(oldCenterPointArc); 
        const newCenter = (newMildePoint.y > oldCenterPointArc.y ) ? new Vector2(oldCenterPointArc.x, newMildePoint.y - radius) : new Vector2( oldCenterPointArc.x, newMildePoint.y + radius);
        const newPoint = new Vector2(spLine.x, newCenter.y);
        
        return {
            centerPoint: newCenter,
            radius: radius,
            tangentPoint: newPoint
        }
    }

    export function getTangentPointTwoArc(centerPoint1: Vector2, radius1: number, centerPoint2: Vector2, radius2: number) {

        const p1 = intersectionLineCirclePoints(centerPoint1, centerPoint2, centerPoint1, radius1);
        const p2 = intersectionLineCirclePoints(centerPoint2, centerPoint1, centerPoint2, radius2);

        const p3 = intersectionCircleCirclePoints(centerPoint1, radius1, centerPoint2, radius2);

        //console.log(centerPoint1.distanceTo(centerPoint2));
        //console.log(centerPoint1.distanceTo(centerPoint2) - (radius1 + radius2));

        // for(const p of p1) {
        //     for(const pc of p2) {
        //         if(equalsVectors(p, pc, TOLERANCE_0_10)){
        //             return pc;
        //         }
        //     }
        // }

        return undefined;
    }


    /**
     * Wartosc 1 stopnia w radianach
     */
    export const RADIAN_1 = 0.0174532925;

    /**
     * Wartosc 45 topni w radianch
     */
    export const RADIAN_45 = Math.PI / 4;
    /**
     * Wartosc 90 stopni w radianach
     */
    export const RADIAN_90 = Math.PI / 2; 

    /**
     * Wartosc 180stopni w radinach
     */
    export const RADIAN_180 = Math.PI;

    /**
     * Wartosc 270 stopni w radianach
     */
    export const RADIAN_270 = RADIAN_90 + RADIAN_180;

    /**
     * Wartosc 360 stopni w radianach
     */
    export const RADIAN_360 = Math.PI * 2;

    /**
     * Tolerancaj 5 miejsc po przecinku
     */
    export const TOLERANCE_0_5 = 0.000005;
    /**
     * Tolerancjia 10 miejsc po przecinku
     */
    export const TOLERANCE_0_10 = 0.00000000005;

    /**
     * Tolerancja 15 miejsc po przecinku
     */
    export const TOLERANCE_0_15 = 0.0000000000000005;

    /**
     * Typ przeciecia
     */
    export enum IntersectionType{
        /**
         * Brak przeciecia
         */
        noIntersection = 0,
        /**
         * Przciecie
         */
        intersection = 1,
        /**
         * Lezy na
         */
        onLine = 2
    }

    

    export enum AxisType {
        
        X = 0,
        Y = 1,
        Z = 2

    }

    
    export enum OrientationLine {

        /**
         * Zgodnie z wskazowkami zegara
         */
        CW = 1, 
        /**
         * Przeciwnie wskazowki zegara
         */
        CCW = 0,
        /**
        * Wspoliniowo
        */
        collinear = 2,
    }
}

