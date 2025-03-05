import { Vector2 } from "three";
import { EditorMath } from "../src/Utility/editorMath";

/**
 * Czy liczby zmiennoprzecinkowe sa rozne
 */
describe('equalsDecimals', ()=>{
    test("Equels correct", ()=>{
        const firstNum = 0.45678834;
        const secNum = 0.45678834;
        expect(EditorMath.equalsDecimals(firstNum, secNum)).toBe(true);
    })

    test("Equels incorrect", ()=>{
        const firstNum = 0.456788342;
        const secNum = 0.45678834;
        expect(EditorMath.equalsDecimals(firstNum, secNum)).toBe(false);
    })
})


/**
 * Czy vektroy sa rowne
 */
describe('equalsVectors', ()=>{
    test("Equels correct", ()=>{
        const firstNum = 0.56434523;
        const secNum = 0.45678834;
        const vec1 = new Vector2(firstNum, secNum);
        const vec2 = new Vector2(firstNum, secNum);

        expect(EditorMath.equalsVectors(vec1, vec2)).toBe(true);
    })

    test("Equels incorrect", ()=>{
        const firstNum = 0.56434523;
        const secNum = 0.45678834;
        const thNum = 0.5234896123;
        const vec1 = new Vector2(firstNum, secNum);
        const vec2 = new Vector2(firstNum, thNum);

        expect(EditorMath.equalsVectors(vec1, vec2)).toBe(false);
    })
})

/**
 * Czy punkt lezy na prostej
 */
describe('pointInLine', ()=>{
    test("Point on line horisontal", ()=>{

        const vec1 = new Vector2(10, 0);
        const vec2 = new Vector2(-10, 0);
        const pointToCheck = new Vector2(20, 0)
        expect(EditorMath.pointInLine(vec1, vec2, pointToCheck)).toBe(true);
    })

    test("Point on line vertical", ()=>{

        const vec1 = new Vector2(0, 10);
        const vec2 = new Vector2(0, -10);
        const pointToCheck = new Vector2(0, 20)
        expect(EditorMath.pointInLine(vec1, vec2, pointToCheck)).toBe(true);
    })

    test("Point on segment line, tolerance 0.00000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);
        const pointToCheck = new Vector2(-9.87, -7.42127310)
        expect(EditorMath.pointInLine(vec1, vec2, pointToCheck, 0.00000005)).toBe(true);
    })

    test("Point on line, tolerance 0.00000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);
        const pointToCheck = new Vector2(-18, -13.93473306)
        expect(EditorMath.pointInLine(vec1, vec2, pointToCheck, 0.00000005)).toBe(true);
    })

})

/**
 * CZy punkt znajduje sie na odcinku
 */
describe('pointOnLineSegment', ()=>{
    test("Point on line segment horisontal", ()=>{

        const vec1 = new Vector2(10, 0);
        const vec2 = new Vector2(-10, 0);
        const pointToCheck = new Vector2(8, 0)
        expect(EditorMath.pointOnLineSegment(vec1, vec2, pointToCheck)).toBe(true);
    })

    test("Point on line segment vertical", ()=>{

        const vec1 = new Vector2(0, 10);
        const vec2 = new Vector2(0, -10);
        const pointToCheck = new Vector2(0, 8)
        expect(EditorMath.pointOnLineSegment(vec1, vec2, pointToCheck)).toBe(true);
    })

    test("Point on segment line segment, tolerance 0.00000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);
        const pointToCheck = new Vector2(-9.87, -7.42127310)
        expect(EditorMath.pointOnLineSegment(vec1, vec2, pointToCheck, 0.00000005)).toBe(true);
    })

    test("Point on line, no line segment tolerance 0.00000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);
        const pointToCheck = new Vector2(-18, -13.93473306)
        expect(EditorMath.pointOnLineSegment(vec1, vec2, pointToCheck, 0.00000005)).toBe(false);
    })

})


/**
 * Czy dwie linnie sa rownolegle
 */
describe('linesInParallel', ()=>{
    test("lines In Parallel horisontal", ()=>{

        const vec1 = new Vector2(10, 5);
        const vec2 = new Vector2(-10, 5);

        const vec3 = new Vector2(10, 10);
        const vec4 = new Vector2(-10, 10);

        expect(EditorMath.linesParallel(vec1, vec2, vec3, vec4)).toBe(true);
    })

    test("lines is Parallel vertical", ()=>{

        const vec1 = new Vector2(10, 20);
        const vec2 = new Vector2(10, -20);

        const vec3 = new Vector2(5, 15);
        const vec4 = new Vector2(5, -15);

        expect(EditorMath.linesParallel(vec1, vec2, vec3, vec4)).toBe(true);
    })

    test("lines is Parallel toleracne 0.0000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);

        const vec3 = new Vector2(6.25, 15.86);
        const vec4 = new Vector2(-23.57, -8.03069815);

        expect(EditorMath.linesParallel(vec1, vec2, vec3, vec4, 0.0000005)).toBe(true);
    })

    test("lines is not Parallel toleracne 0.0000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);

        const vec3 = new Vector2(6.25, 15.86);
        const vec4 = new Vector2(-23.57, -8.03069819);

        expect(EditorMath.linesParallel(vec1, vec2, vec3, vec4, 0.0000005)).toBe(false);
    })

})


/**
 * Czy dwie linnie sa wspoliniowe
 */
describe('linesCollinear', ()=>{
    test("lines is Collinear horisontal", ()=>{

        const vec1 = new Vector2(10, 5);
        const vec2 = new Vector2(-10, 5);

        const vec3 = new Vector2(20, 5);
        const vec4 = new Vector2(30, 5);

        expect(EditorMath.linesCollinear(vec1, vec2, vec3, vec4)).toBe(true);
    })

    test("lines is Collinear vertical", ()=>{

        const vec1 = new Vector2(10, 20);
        const vec2 = new Vector2(10, -20);

        const vec3 = new Vector2(10, 30);
        const vec4 = new Vector2(10, 50);

        expect(EditorMath.linesCollinear(vec1, vec2, vec3, vec4)).toBe(true);
    })

    test("lines is Collinear toleracne 0.0000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);

        const vec3 = new Vector2(-23.56, -18.38920260);
        const vec4 = new Vector2(-40.25, -31.76062286);

        expect(EditorMath.linesCollinear(vec1, vec2, vec3, vec4, 0.0000005)).toBe(true);
    })

    test("lines is not Collinear toleracne 0.0000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);

        const vec3 = new Vector2(-23.56, -18.38920260);
        const vec4 = new Vector2(-40.25, -31.76062288);

        expect(EditorMath.linesCollinear(vec1, vec2, vec3, vec4, 0.0000005)).toBe(false);
    })

})

/**
 * Punkt przeciecia sie dwoch linni
 */
describe('intersectionTwoLinePoint', ()=>{
    test("intersection two lines, vertical, horisontal", ()=>{

        const vec1 = new Vector2(11.7, 15.2);
        const vec2 = new Vector2(11.7, -13.7);

        const vec3 = new Vector2(6.88, 5.867);
        const vec4 = new Vector2(44.28, 5.867);


        const point = EditorMath.intersectionTwoLinePoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(11.7, 5.867);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

    test("intersection two lines, one horisontal", ()=>{

        const vec1 = new Vector2(17.24,15.2);
        const vec2 = new Vector2(-17.11,-6.31);

        const vec3 = new Vector2(6.88, 5.867);
        const vec4 = new Vector2(44.28, 5.867);

        const point = EditorMath.intersectionTwoLinePoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(2.33583682, 5.867);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })


    test("intersection two lines, one vertical", ()=>{

        const vec1 = new Vector2(11.7, 15.2);
        const vec2 = new Vector2(11.7, -13.7);

        const vec3 = new Vector2(17.24,15.2);
        const vec4 = new Vector2(-17.11,-6.31);

        
        const point = EditorMath.intersectionTwoLinePoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(11.7, 11.73084716);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

    test("intersection two lines toleracne 0.0000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);

        const vec3 = new Vector2(-16.11, 9.71);
        const vec4 = new Vector2(8.24, -17.83);

        const point = EditorMath.intersectionTwoLinePoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(-4.65627865, -3.24422940);

        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

})

/**
 * Punkt przeciecia sie dwoch odcinkow
 */
describe('intersectionTwoSegmentPoint', ()=>{
    test("intersection two segment, vertical, horisontal", ()=>{

        const vec1 = new Vector2(11.7, 15.2);
        const vec2 = new Vector2(11.7, -13.7);

        const vec3 = new Vector2(6.88, 5.867);
        const vec4 = new Vector2(44.28, 5.867);


        const point = EditorMath.intersectionTwoSegmentPoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(11.7, 5.867);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

    test("intersection two segments, one horisontal", ()=>{

        const vec1 = new Vector2(17.24,15.2);
        const vec2 = new Vector2(-17.11,-6.31);

        const vec3 = new Vector2(6.88, 5.867);
        const vec4 = new Vector2(-44.28, 5.867);

        const point = EditorMath.intersectionTwoSegmentPoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

       
        const correctPoint = new Vector2(2.33583682, 5.867);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })


    test("intersection two segments, one vertical", ()=>{

        const vec1 = new Vector2(11.7, 15.2);
        const vec2 = new Vector2(11.7, -13.7);

        const vec3 = new Vector2(17.24,15.2);
        const vec4 = new Vector2(-17.11,-6.31);

        
        const point = EditorMath.intersectionTwoSegmentPoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(11.7, 11.73084716);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

    test("intersection two segments toleracne 0.0000005", ()=>{

        const vec1 = new Vector2(11.85, 9.98);
        const vec2 = new Vector2(-17.37, -13.43);

        const vec3 = new Vector2(-16.11, 9.71);
        const vec4 = new Vector2(8.24, -17.83);

        const point = EditorMath.intersectionTwoSegmentPoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        if(!point){
            throw new Error("Brak przeciecia")
        }

        const correctPoint = new Vector2(-4.65627865, -3.24422940);

        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

    test("intersection line but no segment, one horisontal", ()=>{

        const vec1 = new Vector2(17.24,15.2);
        const vec2 = new Vector2(-17.11,-6.31);

        const vec3 = new Vector2(6.88, 5.867);
        const vec4 = new Vector2(44.28, 5.867);

        const point = EditorMath.intersectionTwoSegmentPoint(vec1, vec2, vec3, vec4, 0.0000005);
        
        expect(point).toBe(null);
    })

})

/**
 * Wyznaczenie punktu przeciecia sie linni o wsp p1 oraz p2, z linia o wsp p3 i prostopadla do niej
 */
describe('intersectionPerpendicularLines', ()=>{
    test("intersection Perpendicular Lines vertical", ()=>{

        const vec1 = new Vector2(11.7, 15.2);
        const vec2 = new Vector2(11.7, -13.7);

        const vec3 = new Vector2(20.08, 3.56);
        const point = EditorMath.intersectionPerpendicularLines(vec1, vec2, vec3, 0.0000005);
        
        const correctPoint = new Vector2(11.7, 3.56);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

    test("intersection Perpendicular Lines horisontal", ()=>{

        const vec1 = new Vector2(6.88, 5.867);
        const vec2 = new Vector2(-44.28, 5.867);

        const vec3 = new Vector2(20.08, 3.56);
        const point = EditorMath.intersectionPerpendicularLines(vec1, vec2, vec3, 0.0000005);


        const correctPoint = new Vector2(20.08, 5.867);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })


    test("intersection Perpendicular Lines", ()=>{

        const vec1 = new Vector2(17.24,15.2);
        const vec2 = new Vector2(-17.11,-6.31);

        const vec3 = new Vector2(20.08, 3.56);
        const point = EditorMath.intersectionPerpendicularLines(vec1, vec2, vec3, 0.0000005);

        const correctPoint = new Vector2(14.04418779, 13.19877961);
        expect(EditorMath.equalsVectors(point, correctPoint, 0.0000005)).toBe(true);
    })

})
