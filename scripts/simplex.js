export function imprimirFormulacion(c, A, b) {
    console.log("Formulación del problema:");
    console.log(`Maximizar: Z = ${c.map((coef, i) => coef + "x" + (i + 1)).join(" + ")}`);
    console.log("Sujeto a las siguientes restricciones:");
    for (let i = 0; i < A.length; i++) {
        const restriccion = A[i].map((coef, j) => coef + "x" + (j + 1)).join(" + ");
        console.log(`${restriccion} <= ${b[i]}`);
    }
    console.log(c.map((_, i) => "x" + (i + 1) + " >= 0").join(", "));
}

export function simplexMatricial(c, A, b) {
    // Agregar variables de holgura y construir la tabla inicial
    const n = c.length; // Número de variables
    const m = A.length; // Número de restricciones
    const tableau = new Array(m + 1).fill(0).map(() => new Array(n + m + 1).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            tableau[i][j] = A[i][j];
        }
        tableau[i][n + i] = 1;
        tableau[i][n + m] = b[i];
    }

    for (let j = 0; j < n; j++) {
        tableau[m][j] = -c[j];
    }
    tableau[m][n + m] = 0;

    const iterations = [tableau.map((row) => [...row])]; // Array para almacenar todas las iteraciones

    // Función para encontrar la columna pivote
    const findPivotColumn = () => {
        let minIndex = 0;
        for (let j = 1; j < n + m; j++) {
            if (tableau[m][j] < tableau[m][minIndex]) {
                minIndex = j;
            }
        }
        return minIndex;
    };

    // Función para encontrar la fila pivote
    const findPivotRow = (pivotColumn) => {
        let minRatio = Number.MAX_VALUE;
        let minIndex = -1;
        for (let i = 0; i < m; i++) {
            if (tableau[i][pivotColumn] > 0) {
                const ratio = tableau[i][n + m] / tableau[i][pivotColumn];
                if (ratio < minRatio) {
                    minRatio = ratio;
                    minIndex = i;
                }
            }
        }
        return minIndex;
    };

    // Función para realizar una iteración del método simplex matricial
    const doIteration = () => {
        const pivotColumn = findPivotColumn();
        if (pivotColumn === -1 || tableau[m][pivotColumn] >= 0) {
            return false; // Se alcanzó una solución óptima
        }

        const pivotRow = findPivotRow(pivotColumn);
        if (pivotRow === -1) {
            return 'No acotado'; // El problema no está acotado
        }

        const pivotElement = tableau[pivotRow][pivotColumn];
        // Hacer que el elemento pivote sea 1
        for (let j = 0; j < n + m + 1; j++) {
            tableau[pivotRow][j] /= pivotElement;
        }

        // Hacer que los demás elementos de la columna pivote sean 0
        for (let i = 0; i < m + 1; i++) {
            if (i !== pivotRow) {
                const factor = tableau[i][pivotColumn];
                for (let j = 0; j < n + m + 1; j++) {
                    tableau[i][j] -= factor * tableau[pivotRow][j];
                }
            }
        }

        return true;
    };

    console.log(`Iteración 0`);
    console.log(tableau);

    // Iteración cero
    iterations.push(tableau.map((row) => [...row]));

    // Realizar iteraciones hasta encontrar la solución óptima
    let iteration = 1;
    while (doIteration()) {
        console.log(`Iteración ${iteration}`);
        console.log(tableau);
        iteration++;
        iterations.push(tableau.map((row) => [...row]));
    }

    // Extraer y mostrar la solución óptima
    const solution = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
        const pivotColumn = tableau[i].findIndex((val) => val === 1);
        if (pivotColumn !== -1 && pivotColumn < n) {
            solution[pivotColumn] = tableau[i][n + m];
        }
    }

    console.log('Solución óptima:');
    console.log(`Z = ${-tableau[m][n + m]}`);
    for (let i = 0; i < n; i++) {
        console.log(`x${i + 1} = ${solution[i]}`);
    }

    return iterations;
}

// Ejemplo de uso
// const c = [30, 50];
// const A = [
//     [1, 2],
//     [1, 1],
// ];
// const b = [200, 140];

// imprimirFormulacion(c, A, b);
// const iterations = simplexMatricial(c, A, b);
// console.log(iterations);