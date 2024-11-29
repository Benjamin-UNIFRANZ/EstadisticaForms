// editarEncuesta.js

// Selección de elementos del DOM
const finalizarFormulario = document.getElementById('finalizarFormulario');
const tipoRespuestaBtns = document.querySelectorAll('#tipoRespuesta');
const guardarPlaceholderBtns = document.querySelectorAll('#guardarPlaceholder');
const otroBtns = document.querySelectorAll('#otro');
const deleteCuestion = document.querySelectorAll('#deleteCuestion');
const btnTipoRespuestas = document.querySelectorAll('#btnTipoRespuestas select');

// templates: 
const templateTituloFormulario = document.getElementById('templateTituloFormulario');
const templatePreguntasFormulario = document.getElementById('templatePreguntasFormulario');
const templateOpcionCerrada = document.getElementById('templateOpcionCerrada');
const templateOpcionAbierta = document.getElementById('templateOpcionAbierta');
const templateBotonesFinales = document.getElementById('templateBotonesFinales');

// Estructura del almacenamiento de datos del formulario
const formulario = {
    title: '',
    description: '',
    questions: []
};

// Selecciona todos los elementos select dentro del contenedor con id 'btnTipoRespuestas'
const selects = document.querySelectorAll('#btnTipoRespuestas select');


// Función para generar el HTML de opciones múltiples
function getOpcionMultipleHTML() {
return `
    <div id="contenedordeOpcionMultiple">
        <!-- Aquí va el contenido de opción múltiple -->
    </div>
`;
}

// Función para generar el HTML de respuestas abiertas
function getOpcionAbiertaHTML() {
return `
    <div id="contenerOpcionAbierta">
        <!-- Aquí va el contenido de respuesta abierta -->
    </div>
`;
}

// Función para renderizar opciones múltiples
function renderOpcionMultiple(contenedor) {
contenedor.innerHTML = getOpcionMultipleHTML();
}

// Función para renderizar respuestas abiertas
function renderOpcionAbierta(contenedor) {
contenedor.innerHTML = getOpcionAbiertaHTML();
}

// Agrega un event listener para el evento 'change' en cada select
selects.forEach(select => {
select.addEventListener('change', function(e) {
    e.preventDefault();
    
    // Encuentra el contenedor de la pregunta actual
    const preguntaContenedor = e.target.closest('#PreguntasFormulario');
    
    if (preguntaContenedor) {
        // Verifica el tipo de respuesta seleccionado
        const tipoRespuesta = e.target.value;

        // Elimina el contenido dentro de los contenedores de opción múltiple y abierta si existen
        if (tipoRespuesta === 'opcion_multiple') {
            let contenedorOpcionMultiple = preguntaContenedor.querySelector('#contenedordeOpcionMultiple');
            let contenedorOpcionAbierta = preguntaContenedor.querySelector('#contenerOpcionAbierta');
            
            if (contenedorOpcionAbierta) {
                contenedorOpcionAbierta.remove();
            }
            
            if (!contenedorOpcionMultiple) {
                contenedorOpcionMultiple = document.createElement('div');
                contenedorOpcionMultiple.id = 'contenedordeOpcionMultiple';
                preguntaContenedor.appendChild(contenedorOpcionMultiple);
            }
            
            renderOpcionMultiple(contenedorOpcionMultiple);
        } else if (tipoRespuesta === 'respuesta_abierta') {
            let contenedorOpcionMultiple = preguntaContenedor.querySelector('#contenedordeOpcionMultiple');
            let contenedorOpcionAbierta = preguntaContenedor.querySelector('#contenerOpcionAbierta');
            
            if (contenedorOpcionMultiple) {
                contenedorOpcionMultiple.remove();
            }
            
            if (!contenedorOpcionAbierta) {
                contenedorOpcionAbierta = document.createElement('div');
                contenedorOpcionAbierta.id = 'contenerOpcionAbierta';
                preguntaContenedor.appendChild(contenedorOpcionAbierta);
            }
            
            renderOpcionAbierta(contenedorOpcionAbierta);
        }

        // Muestra los elementos seleccionados en la consola
        console.log('Contenedor Opción Múltiple:', preguntaContenedor.querySelector('#contenedordeOpcionMultiple'));
        console.log('Contenedor Opción Abierta:', preguntaContenedor.querySelector('#contenerOpcionAbierta'));
    } else {
        console.error('No se encontró el contenedor de la pregunta.');
    }
});
});

// Evento para prevenir el comportamiento predeterminado del botón "Tipo de Respuesta"
tipoRespuestaBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const parent = e.target.closest('.row'); // Encuentra el elemento padre más cercano con la clase 'row'
        parent.querySelector('#tipoRespuesta').classList.add('d-none');
        parent.querySelector('#btnTipoRespuestas').classList.remove('d-none');
    });
});

// Evento para prevenir el comportamiento predeterminado del botón "Guardar Placeholder"
guardarPlaceholderBtns.forEach(btn => {
    btn.addEventListener('click',prevenirEventoBtns(guardarPlaceholderBtns));
});

// Evento para prevenir el comportamiento predeterminado del botón "Otro"
otroBtns.forEach(btn => {
    btn.addEventListener('click', prevenirEventoBtns(otroBtns));
});

// Evento para prevenir el comportamiento predeterminado del botón "Finalizar Formulario"
finalizarFormulario.addEventListener('click', function(e) {
    e.preventDefault();
    // Aquí puedes agregar la lógica para validar y enviar el formulario
    console.log('Formulario finalizado');
});

// Evento para prevenir el comportamiento predeterminado del botón "Eliminar Cuestion"
deleteCuestion.forEach(btn => {
    btn.addEventListener('click',prevenirEventoBtns(deleteCuestion));
});

// Función para manejar la opción de respuesta múltiple
function OpcionMultiple(preguntaCerrada, preguntaAbierta) {
    const clone = templateOpcionCerrada.content.cloneNode(true);
    const opcionMultiple = clone.querySelector('#opcionMultiple');
    const inputCerrada = clone.querySelector('#inputCerrada');
    const otro = clone.querySelector('#otro');

    // Inicializa currentOption como un array vacío si no lo está
    if (!Array.isArray(formulario.currentOption)) {
        formulario.currentOption = []
    } 

    // Captura el texto escrito en el campo de opción cerrada
    formulario.currentOption.push(''); // Añade una nueva opción vacía
    capturarTextoEscribido(inputCerrada, formulario.currentOption, formulario.currentOption.length - 1);

    // Elimina el contenido anterior de la pregunta abierta

    preguntaCerrada.innerHTML = '';
    otro.addEventListener('click', e => {
        e.preventDefault();
        const newOption = opcionMultiple.cloneNode(true);
        const newInput = newOption.querySelector('input[type="text"]');
        newInput.value = '';
        preguntaCerrada.insertBefore(newOption, otro);

        // Añade una nueva opción vacía y captura el texto escrito
        formulario.currentOption.push('');
        capturarTextoEscribido(newInput, formulario.currentOption, formulario.currentOption.length - 1);
    });

    preguntaCerrada.appendChild(clone);
    preguntaAbierta.innerHTML = '';
    return clone;
}

// Función para manejar la opción de respuesta abierta
function OpcionAbierta(preguntaAbierta, preguntaCerrada) {
    const clone = templateOpcionAbierta.content.cloneNode(true);
    const textarea = clone.querySelector('textarea');
    const placeholderInput = clone.querySelector('#placeholderInput');
    const guardarPlaceholderBtn = clone.querySelector('#guardarPlaceholder');;

    // Captura el texto escrito en el campo de placeholder
    capturarTextoEscribido(placeholderInput, formulario, 'currentPlaceholder');

    guardarPlaceholderBtn.addEventListener('click', e => {
        e.preventDefault();
        textarea.placeholder = placeholderInput.value;
    });

    preguntaAbierta.appendChild(clone);
    preguntaCerrada.innerHTML = '';
    return clone;
}

function prevenirEventoBtns(btns) {
    btns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
}

// Función para capturar el texto escrito en un campo de entrada
function capturarTextoEscribido(contenedor, variablePrivada, key) {
    contenedor.addEventListener('input', e => {
        if (Array.isArray(variablePrivada[key])) {
            const index = Array.from(contenedor.parentNode.children).indexOf(contenedor);
            variablePrivada[key][index] = e.target.value;
        } else {
            variablePrivada[key] = e.target.value;
        }
    });
 }

















 

// // Encuentra la tabla en el HTML
// const tabla = document.querySelector("table tbody");

// // Datos de las notas actualizadas
// const datosActualizados = [
//     { materia: "ÁLGEBRA II", paralelo: "2", h2: 10, h2Procesual: 12, h3: 8, h3Procesual: 8, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 38 }, // Ajustado para nota final 38
//     { materia: "CÁLCULO II", paralelo: "2", h2: 14, h2Procesual: 2, h3: 8, h3Procesual: 9, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 33 }, // Ajustado para nota final 33
//     { materia: "FÍSICA II", paralelo: "1", h2: 6, h2Procesual: 11, h3: 8, h3Procesual: 8, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 33 },
//     { materia: "INGLÉS II", paralelo: "2", h2: 12, h2Procesual: 8, h3: 15, h3Procesual: 5, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 40 },
//     { materia: "PROBABILIDAD Y ESTADÍSTICA", paralelo: "2", h2: 9, h2Procesual: 8, h3: 9, h3Procesual: 9, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 35 },
//     { materia: "PROGRAMACIÓN I", paralelo: "1", h2: 9, h2Procesual: 6, h3: 13, h3Procesual: 4, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 32 },
//     { materia: "SISTEMAS OPERATIVOS", paralelo: "1", h2: 12, h2Procesual: 8, h3: 7, h3Procesual: 4, h4: 0, h4Procesual: 0, h5: 0, h5Procesual: 0, notaFinal: 31 }
// ];

// // Recorre cada fila de la tabla y actualiza las celdas con los nuevos datos
// Array.from(tabla.rows).forEach((fila, index) => {
//     if (index === 0) return; // Saltar la primera fila (encabezados)

//     // Obtiene los datos actualizados para la fila correspondiente
//     const datosFila = datosActualizados[index - 1];

//     // Asigna los valores a las celdas correspondientes
//     fila.cells[2].textContent = datosFila.h2;
//     fila.cells[3].textContent = datosFila.h2Procesual;
//     fila.cells[4].textContent = datosFila.h3;
//     fila.cells[5].textContent = datosFila.h3Procesual;
//     fila.cells[6].textContent = datosFila.h4;
//     fila.cells[7].textContent = datosFila.h4Procesual;
//     fila.cells[8].textContent = datosFila.h5;
//     fila.cells[9].textContent = datosFila.h5Procesual;
//     fila.cells[10].textContent = datosFila.notaFinal;
// });

// console.log("Tabla actualizada con los nuevos valores.");


// // Recorre cada fila de la tabla y cada celda dentro de ella
// Array.from(tabla.rows).forEach((fila) => {
//     Array.from(fila.cells).forEach((celda) => {
//         if (celda.textContent.trim() === "0") {
//             celda.textContent = ""; // Elimina el "0"
//         }
//     });
// });

// console.log("Celdas con '0' eliminadas de la tabla.");

