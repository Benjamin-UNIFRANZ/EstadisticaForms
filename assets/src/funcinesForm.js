

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
    // Agrega un event listener al contenedor para el evento 'input'
    contenedor.addEventListener('input', e => {
        // Verifica si la propiedad en variablePrivada[key] es un array
        if (Array.isArray(variablePrivada[key])) {
            // Convierte los hijos del elemento padre del contenedor en un array
            // Esto es necesario porque contenedor.parentNode.children es una colección HTML, no un array real
            const index = Array.from(contenedor.parentNode.children).indexOf(contenedor);
            // Actualiza el valor en el array en la posición correspondiente al índice
            // Esto asegura que el valor ingresado se almacene en la posición correcta del array
            variablePrivada[key][index] = e.target.value;
        } else {
            // Si no es un array, simplemente actualiza el valor de la propiedad en variablePrivada[key]
            variablePrivada[key] = e.target.value;
        }
    });
}
// {
    // Proceso en capturarTextoEscribido:

    // contenedor es <input id="input1">.
    // contenedor.parentNode es <div id="parent">.
    // contenedor.parentNode.children es una colección HTML: [<input id="input1">, <input id="input2">, <textarea id="textarea1">].
    // Array.from(contenedor.parentNode.children) convierte la colección en un array: [<input id="input1">, <input id="input2">, <textarea id="textarea1">].
    // Array.from(contenedor.parentNode.children).indexOf(contenedor) encuentra el índice de <input id="input1">, que es 0.
    // Actualización del Valor:

    // Si variablePrivada[key] es un array, actualiza variablePrivada[key][0] con el valor ingresado en <input id="input1">.
    // Si variablePrivada[key] no es un array, simplemente actualiza variablePrivada[key] con el valor ingresado.
    // Resumen
    // contenedor.parentNode.children obtiene todos los hijos directos del elemento padre del contenedor.
    // Array.from(contenedor.parentNode.children) convierte esta colección HTML en un array real.
    // .indexOf(contenedor) encuentra la posición del contenedor dentro de este array.
    // Esto permite actualizar el valor correspondiente en el array variablePrivada[key] con el texto ingresado por el usuario.
// }



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
export {
    QuitarClassDnone,
    agragarDnone,
    capturarTextoEscribido,
    validarCamposPregunta,
    alertaRoja
};