function closeOffcanvas() {
    var offcanvasElement = document.querySelector('#offcanvasDemo1');
    var offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.hide();
}

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