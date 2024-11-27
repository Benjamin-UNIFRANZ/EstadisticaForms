crearScript();
function crearScript () {
    var userAgent = navigator.userAgent;
    var script = document.createElement('script');
    script.type = 'module';
    if (!(userAgent.includes('Chrome') || userAgent.includes('Safari'))) {
        script.src = '/assets/src/alt/formEncuesta.js';
    }
    document.head.appendChild(script);
}