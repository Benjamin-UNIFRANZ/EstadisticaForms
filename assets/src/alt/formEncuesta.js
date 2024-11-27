// formEncuesta.js

// Selección de elementos del DOM
const contenedorForm = document.getElementById('contenedorForm');
const CrearFormulario = document.getElementById('CrearFormulario');
const finalizarFormulario = document.getElementById('finalizarFormulario');
const templateTituloFormulario = document.getElementById('templateTituloFormulario');
const templatePreguntasFormulario = document.getElementById('templatePreguntasFormulario');
const templateOpcionCerrada = document.getElementById('templateOpcionCerrada');
const templateOpcionAbierta = document.getElementById('templateOpcionAbierta');
const templateBotonesFinales = document.getElementById('templateBotonesFinales');
const finalizarFormularioUltimo = document.getElementById('finalizarFormularioUltimo');

// Creamos la clase Formulario
class Formulario {
    constructor() {
        this.title = '';
        this.description = '';
        this.questions = [];
        this.currentOption = [];
        this.currentQuestion = '';
        this.currentPlaceholder = '';
    }

    agregarTituloContainer() {
        const clone = templateTituloFormulario.content.cloneNode(true);
        const titulo = clone.querySelector('input');
        const descripcion = clone.querySelector('textarea');

        capturarTextoEscribido(titulo, this, 'title');
        capturarTextoEscribido(descripcion, this, 'description');

        contenedorForm.appendChild(clone);
        return clone;
    }

    renderPreguntas() {
        const clone = templatePreguntasFormulario.content.cloneNode(true);
        const tipoRespuestaBtn = clone.querySelector('#tipoRespuesta');
        const btnTipoRespuestas = clone.querySelector('#btnTipoRespuestas');
        const preguntaCerrada = clone.querySelector('#contenedordeOpcionMultiple');
        const preguntaAbierta = clone.querySelector('#contenerOpcionAbierta');
        const contenedorBotonesFinales = clone.querySelector('#contenedorBotonesFinales');
        const PreguntasFormulario = clone.querySelector('#PreguntasFormulario');
        const inputPregunta = clone.querySelector('input');

        capturarTextoEscribido(inputPregunta, this, 'currentQuestion');

        tipoRespuestaBtn.addEventListener('click', e => {
            e.preventDefault();
            tipoRespuestaBtn.classList.add('d-none');
            btnTipoRespuestas.classList.remove('d-none');
        });

        btnTipoRespuestas.addEventListener('change', e => {
            const selectedOption = e.target.value;
            if (selectedOption === 'opcion_multiple') {
                this.OpcionMultiple(preguntaCerrada, preguntaAbierta);
            } else if (selectedOption === 'respuesta_abierta') {
                this.OpcionAbierta(preguntaAbierta, preguntaCerrada);
            }
        });

        this.btnfinales(contenedorBotonesFinales, PreguntasFormulario);
        contenedorForm.appendChild(clone);
        return clone;
    }

    OpcionMultiple(preguntaCerrada, preguntaAbierta) {
        const clone = templateOpcionCerrada.content.cloneNode(true);
        const opcionMultiple = clone.querySelector('#opcionMultiple');
        const inputCerrada = clone.querySelector('#inputCerrada');
        const otro = clone.querySelector('#otro');

        this.currentOption.push('');
        capturarTextoEscribido(inputCerrada, this.currentOption, this.currentOption.length - 1);

        preguntaCerrada.innerHTML = '';
        otro.addEventListener('click', e => {
            e.preventDefault();
            const newOption = opcionMultiple.cloneNode(true);
            const newInput = newOption.querySelector('input[type="text"]');
            newInput.value = '';
            preguntaCerrada.insertBefore(newOption, otro);

            this.currentOption.push('');
            capturarTextoEscribido(newInput, this.currentOption, this.currentOption.length - 1);
        });

        preguntaCerrada.appendChild(clone);
        preguntaAbierta.innerHTML = '';
        return clone;
    }

    OpcionAbierta(preguntaAbierta, preguntaCerrada) {
        const clone = templateOpcionAbierta.content.cloneNode(true);
        const textarea = clone.querySelector('textarea');
        const placeholderInput = clone.querySelector('#placeholderInput');
        const guardarPlaceholderBtn = clone.querySelector('#guardarPlaceholder');

        capturarTextoEscribido(placeholderInput, this, 'currentPlaceholder');

        guardarPlaceholderBtn.addEventListener('click', e => {
            e.preventDefault();
            textarea.placeholder = placeholderInput.value;
        });

        preguntaAbierta.appendChild(clone);
        preguntaCerrada.innerHTML = '';
        return clone;
    }

    btnfinales(contenedorBotonesFinales, preguntaClone) {
        const clone = templateBotonesFinales.content.cloneNode(true);
        const AgregarPregunta = clone.querySelector('#addCuestion');
        const cancelarPregunta = clone.querySelector('#deleteCuestion');
        contenedorBotonesFinales.appendChild(clone);

        cancelarPregunta.disabled = true;

        AgregarPregunta.addEventListener('click', e => {
            e.preventDefault();

            if (!validarCamposPregunta()) {
                return;
            }

            if (!this.validarTipodeRespuesta()) {
                return;
            }

            const preguntaId = `pregunta_${Date.now()}`;
            this.questions.push({
                id: preguntaId,
                tituloPregunta: this.currentQuestion,
                tipoRespuesta: this.currentOption.length > 0 ? {
                    type: 'opcion_multiple',
                    input: {
                        opciones: this.currentOption
                    }
                } : {
                    type: 'respuesta_abierta',
                    placeholder: this.currentPlaceholder
                },
            });
            console.log(this.questions);
            console.log(this);

            this.currentOption = [];

            this.crearPregunta();
            AgregarPregunta.classList.add('d-none');
            agragarDnone('CrearFormulario');
            QuitarClassDnone('finalizarFormulario');

            cancelarPregunta.disabled = false;
        });

        cancelarPregunta.addEventListener('click', e => {
            e.preventDefault();

            const preguntaIndex = this.questions.findIndex(q => q.tituloPregunta === this.currentQuestion);

            if (preguntaIndex !== -1) {
                this.questions.splice(preguntaIndex, 1);
            }

            if (preguntaClone && preguntaClone.parentNode) {
                preguntaClone.parentNode.removeChild(preguntaClone);
            }

            if (contenedorBotonesFinales && contenedorBotonesFinales.parentNode) {
                contenedorBotonesFinales.parentNode.removeChild(contenedorBotonesFinales);
            }

            console.log(this.questions);
        });

        return clone;
    }

    crearPregunta() {
        this.renderPreguntas();
    }

    validarTipodeRespuesta() {
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
}

// Función para quitar la clase 'd-none' de un elemento
function QuitarClassDnone(id) {
    document.getElementById(id).classList.remove('d-none');
}

// Función para agregar la clase 'd-none' a un elemento
function agragarDnone(id) {
    document.getElementById(id).classList.add('d-none');
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

// Función para validar que todos los campos de la pregunta estén llenos
function validarCamposPregunta() {
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

// Función para mostrar una alerta roja
function alertaRoja(input, mensaje) {
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert alert-danger';
    alertMessage.textContent = mensaje;
    input.parentNode.insertBefore(alertMessage, input.nextSibling);

    setTimeout(() => {
        alertMessage.remove();
    }, 3000);
}

const formulario = new Formulario();

function eventListeners() {
    CrearFormulario.addEventListener('click', e => {
        e.preventDefault();

        if (!document.querySelector('#contenedorPrincipalForm input') && !document.querySelector('#contenedorPrincipalForm textarea')) {
            formulario.agregarTituloContainer();
        }

        formulario.renderPreguntas();
        agragarDnone('CrearFormulario');
    });

    finalizarFormulario.addEventListener('click', e => {
        e.preventDefault();
        if (!formulario.title || !formulario.description || formulario.questions.length === 0) {
            alertaRoja(CrearFormulario, 'Por favor, complete el título, la descripción y agregue al menos una pregunta antes de finalizar.');
            return;
        }
        console.log('Formulario finalizado:', formulario);
        agragarDnone('finalizarFormulario');
        QuitarClassDnone('finalizarFormularioUltimo');
    });

    finalizarFormularioUltimo.addEventListener('click', e => {
        e.preventDefault();

        const titleInput = document.createElement('input');
        titleInput.type = 'hidden';
        titleInput.name = 'title';
        titleInput.value = formulario.title;
        finalizarFormularioUltimo.appendChild(titleInput);

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'hidden';
        descriptionInput.name = 'description';
        descriptionInput.value = formulario.description;
        finalizarFormularioUltimo.appendChild(descriptionInput);

        formulario.questions.forEach((question, index) => {
            const questionInput = document.createElement('input');
            questionInput.type = 'hidden';
            questionInput.name = `questions[${index}][tituloPregunta]`;
            questionInput.value = question.tituloPregunta;
            finalizarFormularioUltimo.appendChild(questionInput);

            const typeInput = document.createElement('input');
            typeInput.type = 'hidden';
            typeInput.name = `questions[${index}][tipoRespuesta][type]`;
            typeInput.value = question.tipoRespuesta.type;
            finalizarFormularioUltimo.appendChild(typeInput);

            if (question.tipoRespuesta.type === 'opcion_multiple') {
                question.tipoRespuesta.input.opciones.forEach((opcion, opcionIndex) => {
                    const opcionInput = document.createElement('input');
                    opcionInput.type = 'hidden';
                    opcionInput.name = `questions[${index}][tipoRespuesta][input][opciones][${opcionIndex}]`;
                    opcionInput.value = opcion;
                    finalizarFormularioUltimo.appendChild(opcionInput);
                });
            } else if (question.tipoRespuesta.type === 'respuesta_abierta') {
                const placeholderInput = document.createElement('input');
                placeholderInput.type = 'hidden';
                placeholderInput.name = `questions[${index}][tipoRespuesta][placeholder]`;
                placeholderInput.value = question.tipoRespuesta.placeholder;
                finalizarFormularioUltimo.appendChild(placeholderInput);
            }
        });

        finalizarFormularioUltimo.submit();
    });
}

eventListeners();