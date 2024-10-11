// Simulación de respuestas abiertas
const respuestas = [
    "El servicio al cliente fue excelente.",
    "No me gustó la calidad del producto.",
    "La entrega fue rápida, pero el empaque no era bueno.",
    "No tengo experiencia con este servicio.",
    "Me gustaría ver más opciones de productos.",
    "El precio es demasiado alto.",
    "El servicio fue regular, pero la atención fue buena."
];

// Función para codificación abierta
function codificacionAbierta(respuestas) {
    const codigos = {};
    
    respuestas.forEach((respuesta, index) => {
        const palabrasClave = respuesta.toLowerCase().split(' ');

        palabrasClave.forEach(palabra => {
            if (!codigos[palabra]) {
                codigos[palabra] = [];
            }
            codigos[palabra].push(index); // Guardar el índice de la respuesta
        });
    });

    return codigos;
}

// Función para codificación axial
function codificacionAxial(codigos) {
    const categorias = {};

    for (const [codigo, indices] of Object.entries(codigos)) {
        if (codigo.includes("servicio")) {
            categorias["Satisfacción del Cliente"] = categorias["Satisfacción del Cliente"] || [];
            categorias["Satisfacción del Cliente"].push(codigo);
        } else if (codigo.includes("calidad")) {
            categorias["Calidad del Producto"] = categorias["Calidad del Producto"] || [];
            categorias["Calidad del Producto"].push(codigo);
        } else if (codigo.includes("entrega")) {
            categorias["Logística"] = categorias["Logística"] || [];
            categorias["Logística"].push(codigo);
        } else {
            categorias["Otros Casos"] = categorias["Otros Casos"] || [];
            categorias["Otros Casos"].push(codigo);
        }
    }

    return categorias;
}

// Función para manejar respuestas independientes
function manejarRespuestasIndependientes(respuestas) {
    const respuestasIndependientes = [];

    respuestas.forEach(respuesta => {
        if (respuesta.toLowerCase().includes("no tengo experiencia")) {
            respuestasIndependientes.push(respuesta);
        }
    });

    return respuestasIndependientes;
}

// Ejecución del análisis
const codigosAbiertos = codificacionAbierta(respuestas);
const categoriasAxiales = codificacionAxial(codigosAbiertos);
const respuestasIndependientes = manejarRespuestasIndependientes(respuestas);

// Resultados
console.log("Códigos Abiertos:", codigosAbiertos);
console.log("Categorías Axiales:", categoriasAxiales);
console.log("Respuestas Independientes:", respuestasIndependientes);