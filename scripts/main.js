import {imprimirFormulacion, simplexMatricial} from './simplex.js';

// Ejemplo de uso
const c = [30, 50];
const A = [
    [1, 2],
    [1, 1],
];
const b = [200, 140];

imprimirFormulacion(c, A, b);
const iterations = simplexMatricial(c, A, b);
console.log(iterations);