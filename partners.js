// Функция для открытия ссылки партнера
function openPartnerLink(url) {
    window.open(url, '_blank');
}

// Добавление эффекта загрузки изображений
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.partners-custom-block-content img');
    const container = document.getElementById('partnersContainer');
    
    // Показываем индикатор загрузки
    container.classList.add('loading');
    
    let loadedImages = 0;
    const totalImages = images.length;
    
    images.forEach(function(img) {
        // Проверяем, загружено ли изображение
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', function() {
                loadedImages++;
                checkAllImagesLoaded();
            });
            
            img.addEventListener('error', function() {
                console.log('Ошибка загрузки изображения:', img.src);
                loadedImages++;
                checkAllImagesLoaded();
            });
        }
    });
    
    // Функция проверки загрузки всех изображений
    function checkAllImagesLoaded() {
        if (loadedImages === totalImages) {
            container.classList.remove('loading');
        }
    }
    
    // Если все изображения уже загружены
    if (loadedImages === totalImages) {
        container.classList.remove('loading');
    }
});

// Добавление клавиатурной навигации
document.addEventListener('keydown', function(event) {
    const images = document.querySelectorAll('.partners-custom-block-content img');
    let currentIndex = -1;
    
    // Находим текущий активный элемент
    images.forEach(function(img, index) {
        if (document.activeElement === img) {
            currentIndex = index;
        }
    });
    
    // Навигация стрелками
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % images.length;
        images[nextIndex].focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIndex = currentIndex === -1 ? images.length - 1 : (currentIndex - 1 + images.length) % images.length;
        images[prevIndex].focus();
    }
    
    // Открытие ссылки по Enter
    if (event.key === 'Enter' && currentIndex !== -1) {
        images[currentIndex].click();
    }
});

// Добавление атрибутов для доступности
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.partners-custom-block-content img');
    images.forEach(function(img, index) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Партнер ${index + 1}: ${img.alt}`);
    });
});

// Плавная прокрутка к блоку партнеров (если блок находится не в начале страницы)
function scrollToPartners() {
    document.querySelector('.partners-custom-block').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Функция для добавления нового партнера (для демонстрации)
function addPartner(logoSrc, altText, link, title) {
    const container = document.querySelector('.partners-custom-block-content');
    const newPartner = document.createElement('div');
    newPartner.className = 'fade-in';
    newPartner.innerHTML = `
        <img src="${logoSrc}" 
             alt="${altText}" 
             title="${title}"
             onclick="openPartnerLink('${link}')"
             tabindex="0"
             role="button"
             aria-label="Партнер: ${altText}">
    `;
    container.appendChild(newPartner);
}

// Инициализация модуля партнеров
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Partners модуль инициализирован');
    console.log('🤝 Загружено партнеров:', document.querySelectorAll('.partners-custom-block-content img').length);
});
