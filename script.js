// Плавное появление секций при прокрутке
function revealSections() {
    const sections = document.querySelectorAll('.about, .projects, .contact');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight / 1.2;
        if (sectionTop < triggerPoint) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Вызов анимации при прокрутке и загрузке страницы
window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);
