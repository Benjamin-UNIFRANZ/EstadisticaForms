document.addEventListener('DOMContentLoaded', (event) => {
    const themeToggleButton = document.querySelector('.theme-toggle-button');
    themeToggleButton.addEventListener('click', toggleTheme);
});

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-bs-theme', newTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    function checkScreenSize() {
        const container = document.querySelector('.container-fluid.content');
        if (container) {
            if (window.innerWidth <= 576) {
                container.classList.remove('container-fluid', 'content');
            } else {
                container.classList.add('container-fluid', 'content');
            }
        } else {
            console.warn('Elemento .container-fluid.content no encontrado.');
        }
    }

    // Verificar el tamaño de la pantalla al cargar la página
    checkScreenSize();

    // Verificar el tamaño de la pantalla al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkScreenSize);
});