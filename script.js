// Функция для отображения секций с плавной анимацией
function revealSections() {
    const sections = document.querySelectorAll('.about, .projects');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight / 1.3;
        if (sectionTop < triggerPoint) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Вызов функции при прокрутке страницы
window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);
