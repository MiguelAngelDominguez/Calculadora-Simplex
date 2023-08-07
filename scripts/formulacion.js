const metodoSimp = document.getElementById("MetodoSimplex").value;
const objetivoSimp = document.getElementById("ObjetivoSimplex").value;

const tableFunction = document.getElementById("tableFunction");
const tableRestric = document.getElementById("tableRestriccion");

const newInputForm = '<td><input type="number" name="variable" id="variable" class="table-input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 number-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="">x<span>3</span></td>';
const newRestric = '<td><input type="number" name="variable" id="variable" class="table-input block w-full rounded-md border-0 py-1.5 pl-7 pr-20 number-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="">x<span>3</span></td>';

function createTableFormulacion() {
    const ctdVariables = document.getElementById("CtdVariables").value;
    const ctdRestric = document.getElementById("ctdRestric").value;
    console.log(ctdVariables);
    console.log(ctdRestric);
    tableFunction.innerHTML += '<th scope="col">Z</th>';
    for (let i = 0; i < ctdVariables; i++) {
        tableFunction.innerHTML += newInputForm;
    }

    for (let i = 0; i < ctdRestric; i++) {
        tableRestric.innerHTML += '<th scope="row">' + i + '</th>';
        var tr = document.createElement('tr');
        tableFunction.appendChild(tr);
        let compChild = tableRestric.children[i];
        for (let i = 0; i < ctdVariables; i++) {
            compChild.innerHTML += newRestric;
        }
        compChild.innerHTML += newRestric;
    }
}

