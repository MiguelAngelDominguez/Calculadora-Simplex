function imprimirFormulacion(c, A, b) {
    console.log("Formulación del problema:");
    console.log(`Maximizar: Z = ${c.map((coef, i) => coef + "x" + (i + 1)).join(" + ")}`);
    console.log("Sujeto a las siguientes restricciones:");
    for (let i = 0; i < A.length; i++) {
        const restriccion = A[i].map((coef, j) => coef + "x" + (j + 1)).join(" + ");
        console.log(`${restriccion} <= ${b[i]}`);
    }
    console.log(c.map((_, i) => "x" + (i + 1) + " >= 0").join(", "));
}

function simplexMatricial(c, A, b) {
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

const metodoSimp = document.getElementById("MetodoSimplex").value;
const objetivoSimp = document.getElementById("ObjetivoSimplex").value;

const tableFunction = document.getElementById("tableFunction");
const tableRestric = document.getElementById("tableRestriccion");

const newInputForm = '<td><input type="number" name="variable" id="variable$i" class="inputForm table-input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 number-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder=""><div>x<span>${i}</span></div></td>';
const newRestric = '<td><input type="number" name="variable" id="variable$i" class="inputForm table-input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 number-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder=""><div>x<span>${i}</span></div></td>';
const newButton = '<div class="form_simplex__btn mt-10 flex items-center justify-center gap-x-6"><a onclick="ResolverSimplex()" id="resolverSimp" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Resolver</a></div>'

function createTableFormulacion() {
    const ctdVariables = document.getElementById("CtdVariables").value;
    const ctdRestric = document.getElementById("ctdRestric").value;
    console.log(ctdVariables);
    console.log(ctdRestric);
    tableFunction.innerHTML += '<th scope="col">Z</th>';
    for (let i = 0; i < ctdVariables; i++) {
        tableFunction.innerHTML += newInputForm.replace("${i}", i + 1).replace("$i", i);
    }

    for (let i = 0; i < ctdRestric; i++) {
        tableRestric.innerHTML += '<th scope="row">' + i + '</th>';
        var tr = document.createElement('tr');
        tableFunction.appendChild(tr);
        let compChild = tableRestric.children[i];
        for (let e = 0; e < ctdVariables; e++) {
            compChild.innerHTML += newRestric.replace("${i}", e + 1).replace("$i", `${i}${e}`);
        }
        compChild.innerHTML += "<td><=</td>" + newRestric.replace("<div>x<span>${i}</span></div></td>", "").replace("$i", `b${i}`);
    }

    document.getElementById("table_form").innerHTML += newButton;
}

const c = [];
const A = [];
const b = [];

function captionDates() {
    const ctdVariables = document.getElementById("CtdVariables").value;
    const ctdRestric = document.getElementById("ctdRestric").value;
    for (let i = 0; i < ctdVariables; i++) {
        c.push(parseInt(document.getElementById(`variable${i}`).value));
    }
    for (let i = 0; i < ctdRestric; i++) {
        A.push([])
        for (let e = 0; e < ctdVariables; e++) {
            A[i].push(parseInt(document.getElementById(`variable${i}${e}`).value));
        }
        b.push(parseInt(document.getElementById(`variableb${i}`).value));
    }
    console.log(c);
    console.log(A);
    console.log(b);
    // return c,A,b;
}

function imprimirTablaIteracion(iteration) {
    const numRows = iteration.length;
    const numCols = iteration[0].length;

    let tableHTML = '<table class="table table-hover">';
    tableHTML += '<thead class="table-purple">';
    tableHTML += '<tr>';
    tableHTML += '<th scope="col">Xb</th>';
    tableHTML += '<th scope="col">Ci</th>';
    for (let j = 0; j < numCols - 2; j++) {
        tableHTML += `<th scope="col">X${j + 1}</th>`;
    }
    tableHTML += '<th scope="col">Bi</th>';
    tableHTML += '</tr>';
    tableHTML += '</thead>';
    tableHTML += '<tbody>';

    for (let i = 0; i < numRows; i++) {
        tableHTML += '<tr>';
        tableHTML += `<th scope="row">S${i + 1}</th>`;
        for (let j = 0; j < numCols; j++) {
            tableHTML += `<td>${iteration[i][j]}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</tbody>';
    tableHTML += '</table>';

    document.getElementById('viewResolver').innerHTML += tableHTML;
}

function ResolverSimplex() {
    captionDates();
    console.log(c);
    console.log(A);
    console.log(b);
    // imprimirFormulacion(c, A, b);
    const iterations = simplexMatricial(c, A, b);
    console.log(iterations);
    for (let i = 1; i < iterations.length; i++) {
        console.log(`Iteración ${i}`);
        imprimirTablaIteracion(iterations[i]);
    }
}