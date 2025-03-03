import { Vector2 } from "three";
import { EditorMath } from "../src/Utility/editorMath";

/**
 * Czy liczby zmiennoprzecinkowe sa rozne
 */
describe('Equals Decimals', ()=>{
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
describe('Equals Vector', ()=>{
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