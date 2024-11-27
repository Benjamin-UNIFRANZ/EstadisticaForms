import Formulario from './classes/formulario.js';
import { agragarDnone, QuitarClassDnone, alertaRoja } from './funcinesForm.js';
import { CrearFormulario, finalizarFormulario, finalizarFormularioUltimo } from './selectoresForm.js';

const formulario = new Formulario();

export default function eventListeners() {
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
