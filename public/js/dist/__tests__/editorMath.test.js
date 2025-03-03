"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const editorMath_1 = require("../src/Utility/editorMath");
describe('Equals Decimals', () => {
    test("Equels correct", () => {
        const firstNum = 0.45678834;
        const secNum = 0.45678834;
        expect(editorMath_1.EditorMath.equalsDecimals(firstNum, secNum)).toBe(true);
    });
});
