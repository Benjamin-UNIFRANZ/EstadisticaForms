// utils.js

export function agregarTituloContainer(templateTituloFormulario, contenedorForm, formulario) {
    const clone = templateTituloFormulario.content.cloneNode(true);
    const titulo = clone.querySelector('input');
    const descripcion = clone.querySelector('textarea');

    // Captura el texto escrito en los campos de título y descripción
    capturarTextoEscribido(titulo, formulario, 'title');
    capturarTextoEscribido(descripcion, formulario, 'description');

    contenedorForm.appendChild(clone);
    return clone;
}

export function renderPreguntas(templatePreguntasFormulario, contenedorForm, formulario) {
    const clone = templatePreguntasFormulario.content.cloneNode(true);

    const tipoRespuestaBtn = clone.querySelector('#tipoRespuesta');
    const btnTipoRespuestas = clone.querySelector('#btnTipoRespuestas');
    const preguntaCerrada = clone.querySelector('#contenedordeOpcionMultiple');
    const preguntaAbierta = clone.querySelector('#contenerOpcionAbierta');
    const contenedorBotonesFinales = clone.querySelector('#contenedorBotonesFinales');
    const PreguntasFormulario = clone.querySelector('#PreguntasFormulario');
    const inputPregunta = clone.querySelector('input');

    // Captura el texto escrito en el campo de la pregunta actual
    capturarTextoEscribido(inputPregunta, formulario, 'currentQuestion');

    // Evento para mostrar las opciones de tipo de respuesta
    tipoRespuestaBtn.addEventListener('click', e => {
        e.preventDefault();
        tipoRespuestaBtn.classList.add('d-none');
        btnTipoRespuestas.classList.remove('d-none');
    });

    // Evento para seleccionar el tipo de respuesta
    btnTipoRespuestas.addEventListener('change', e => {
        const selectedOption = e.target.value;
        if (selectedOption === 'opcion_multiple') {
            OpcionMultiple(preguntaCerrada, preguntaAbierta, formulario);
        } else if (selectedOption === 'respuesta_abierta') {
            OpcionAbierta(preguntaAbierta, preguntaCerrada, formulario);
        }
    });

    // Agrega los botones finales (Agregar y Cancelar pregunta)
    btnfinales(contenedorBotonesFinales, PreguntasFormulario, formulario);
    contenedorForm.appendChild(clone);
    return clone;
}

export function OpcionMultiple(preguntaCerrada, preguntaAbierta, formulario) {
    const clone = templateOpcionCerrada.content.cloneNode(true);
    const opcionMultiple = clone.querySelector('#opcionMultiple');
    const inputCerrada = clone.querySelector('#inputCerrada');
    const otro = clone.querySelector('#otro');

    // Inicializa currentOption como un array vacío si no lo está
    if (!Array.isArray(formulario.currentOption)) {
        formulario.currentOption = [];
    }

    // Captura el texto escrito en el campo de opción cerrada
    formulario.currentOption.push(''); // Añade una nueva opción vacía
    capturarTextoEscribido(inputCerrada, formulario.currentOption, formulario.currentOption.length - 1);

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

export function OpcionAbierta(preguntaAbierta, preguntaCerrada, formulario) {
    const clone = templateOpcionAbierta.content.cloneNode(true);
    const textarea = clone.querySelector('textarea');
    const placeholderInput = clone.querySelector('#placeholderInput');
    const guardarPlaceholderBtn = clone.querySelector('#guardarPlaceholder');

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
// Función para crear una nueva pregunta
export function crearPregunta() {
    renderPreguntas();
}
export function btnfinales(contenedorBotonesFinales, preguntaClone, formulario) {
    const clone = templateBotonesFinales.content.cloneNode(true);
    const AgregarPregunta = clone.querySelector('#addCuestion');
    const cancelarPregunta = clone.querySelector('#deleteCuestion');
    contenedorBotonesFinales.appendChild(clone);

    // Deshabilita el botón "Cancelar Pregunta" inicialmente
    cancelarPregunta.disabled = true;

    // Evento para agregar una nueva pregunta
    AgregarPregunta.addEventListener('click', e => {
        e.preventDefault();

        if (!validarCamposPregunta()) {
            return;
        }

        if (!validarTipodeRespuesta()) {
            return;
        }

        const preguntaId = `pregunta_${Date.now()}`;
        // Inicializa currentOption como un array vacío si no lo está
        if (!Array.isArray(formulario.currentOption)) {
            formulario.currentOption = [];
        }

        // Agrega la pregunta actual al array de preguntas del formulario
        formulario.questions.push({
            id: preguntaId,
            tituloPregunta: formulario.currentQuestion,
            tipoRespuesta: formulario.currentOption.length > 0 ? {
                type: 'opcion_multiple',
                input: {
                    opciones: formulario.currentOption // Array de opciones de respuesta
                }
            } : {
                type: 'respuesta_abierta',
                placeholder: formulario.currentPlaceholder
            },
        });
        console.log(formulario.questions);
        console.log(formulario);

        // Limpia el array de opciones para la siguiente pregunta
        formulario.currentOption = [];

        crearPregunta();
        AgregarPregunta.classList.add('d-none');
        agragarDnone('CrearFormulario');
        QuitarClassDnone('finalizarFormulario');

        // Habilita el botón "Cancelar Pregunta" después de agregar una pregunta
        cancelarPregunta.disabled = false;
    });

    // Evento para cancelar la pregunta actual
    cancelarPregunta.addEventListener('click', e => {
        e.preventDefault();

        // Encuentra el índice de la pregunta actual en el array de preguntas
        const preguntaIndex = formulario.questions.findIndex(q => q.tituloPregunta === formulario.currentQuestion);

        // Si la pregunta actual se encuentra en el array, elimínala
        if (preguntaIndex !== -1) {
            formulario.questions.splice(preguntaIndex, 1);
        }

        // Elimina el contenedor de la pregunta correspondiente
        if (preguntaClone && preguntaClone.parentNode) {
            preguntaClone.parentNode.removeChild(preguntaClone);
        }

        // Elimina el contenedor de botones finales si existe
        if (contenedorBotonesFinales && contenedorBotonesFinales.parentNode) {
            contenedorBotonesFinales.parentNode.removeChild(contenedorBotonesFinales);
        }

        // Muestra el estado actual del array de preguntas en la consola
        console.log(formulario.questions);

    });

    return clone;
}

export function capturarTextoEscribido(contenedor, variablePrivada, key) {
    contenedor.addEventListener('input', e => {
        if (Array.isArray(variablePrivada[key])) {
            const index = Array.from(contenedor.parentNode.children).indexOf(contenedor);
            variablePrivada[key][index] = e.target.value;
        } else {
            variablePrivada[key] = e.target.value;
        }
    });
}

export function validarCamposPregunta() {
    const inputs = document.querySelectorAll('#contenedorForm input, #placeholderInput, #descripcionFormulario, #inputCerrada');
    for (let input of inputs) {
        if (input.value.trim() === '') {
            const alertMessage = document.createElement('div');
            alertMessage.className = 'alert alert-danger';
            alertMessage.textContent = 'Todos los campos deben estar llenos';
            input.parentNode.insertBefore(alertMessage, input.nextSibling);

            setTimeout(() => {
                alertMessage.remove();
            }, 3000);
            agragarDnone('finalizarFormulario');
            return false;
        }
    }
    QuitarClassDnone('finalizarFormulario');
    return true;
}

export function alertaRoja(input, mensaje) {
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert alert-danger';
    alertMessage.textContent = mensaje;
    input.parentNode.insertBefore(alertMessage, input.nextSibling);

    setTimeout(() => {
        alertMessage.remove();
    }, 3000);
}

export function validarTipodeRespuesta() {
    const tipoRespuestaBtns = document.querySelectorAll('#tipoRespuesta');
    let valid = true;

    tipoRespuestaBtns.forEach(tipoRespuesta => {
        if (!tipoRespuesta.classList.contains('d-none')) {
            alertaRoja(tipoRespuesta, 'Debe seleccionar un tipo de respuesta');
            valid = false;
            agragarDnone('finalizarFormulario');
        }
    });
    const tipoRespuestaSelects = document.querySelectorAll('#btnTipoRespuestas select');
    tipoRespuestaSelects.forEach(tipoRespuestaSelect => {
        if (tipoRespuestaSelect.value === 'undefined') {
            alertaRoja(tipoRespuestaSelect, 'Debe seleccionar un tipo de respuesta');
            valid = false;
            agragarDnone('finalizarFormulario');
        }
    });
    QuitarClassDnone('finalizarFormulario');

    return valid;
}

export function QuitarClassDnone(id) {
    document.getElementById(id).classList.remove('d-none');
}

export function agragarDnone(id) {
    document.getElementById(id).classList.add('d-none');
}