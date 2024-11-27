import { 
    capturarTextoEscribido,
    validarCamposPregunta,
    QuitarClassDnone,
    agragarDnone,
    alertaRoja 
} from "../funcinesForm.js";
import{
    contenedorForm, 
    templateTituloFormulario, 
    templatePreguntasFormulario, 
    templateOpcionCerrada, 
    templateOpcionAbierta, 
    templateBotonesFinales
} from "../selectoresForm.js";

export default class Formulario {
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