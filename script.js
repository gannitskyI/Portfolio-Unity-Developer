document.querySelector('.scroll-button').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
});
