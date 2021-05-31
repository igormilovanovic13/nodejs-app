const btn = document.querySelector('.btn-warning');

btn.addEventListener('click', () => {
    const loaderDiv = document.querySelector('.loader');
    const backdrop = document.querySelector('.background-backdrop');

    backdrop.classList.add('visible');
    loaderDiv.classList.add('show-loader');
});