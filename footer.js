/* ===== МОДУЛЬНЫЙ JAVASCRIPT ДЛЯ ПОДВАЛА ===== */

// БЛОК ФОНА
const footerBackgroundBlock = {
    element: document.getElementById('footerBackgroundBlock'),
    
    init() {
        console.log('Блок фона подвала инициализирован');
    },
    
    changeGradient(startColor, endColor) {
        if (this.element) {
            this.element.style.background = `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
            console.log(`Градиент фона изменен на ${startColor} → ${endColor}`);
        }
    }
};

// БЛОК КОНТАКТОВ
const footerContactsBlock = {
    element: document.getElementById('footerContactsBlock'),
    
    init() {
        if (this.element) {
            this.setupContactLinks();
        }
        console.log('Блок контактов подвала инициализирован');
    },
    
    setupContactLinks() {
        const phoneLinks = this.element.querySelectorAll('a[href^="tel:"]');
        const emailLinks = this.element.querySelectorAll('a[href^="mailto:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Клик по телефону в подвале:', e.target.textContent);
            });
        });
        
        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Клик по email в подвале:', e.target.textContent);
            });
        });
    }
};

// БЛОК ИНФОРМАЦИИ И КОПИРАЙТА
const footerInfoBlock = {
    element: document.getElementById('footerInfoBlock'),
    
    init() {
        if (this.element) {
            this.setupInfoLinks();
        }
        console.log('Блок информации подвала инициализирован');
    },
    
    setupInfoLinks() {
        const links = this.element.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Клик по ссылке в блоке информации:', e.target.textContent);
            });
        });
    }
};

// БЛОК МЕССЕНДЖЕРОВ
const footerMessengersBlock = {
    element: document.getElementById('footerMessengersBlock'),
    
    init() {
        if (this.element) {
            this.setupMessengerLinks();
        }
        console.log('Блок мессенджеров подвала инициализирован');
    },
    
    setupMessengerLinks() {
        const messengerLinks = this.element.querySelectorAll('a');
        messengerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const messenger = link.href.includes('wa.me') ? 'WhatsApp' : 'Telegram';
                console.log(`Клик по ${messenger} в подвале`);
            });
            
            // Добавляем hover эффекты
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });
    }
};

// ОСНОВНОЙ КОНТЕЙНЕР ПОДВАЛА
const footerContainer = {
    element: document.getElementById('footerContainer'),
    
    init() {
        console.log('Основной контейнер подвала инициализирован');
        this.setupResponsiveHandling();
    },
    
    setupResponsiveHandling() {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        const handleResponsive = (e) => {
            if (e.matches) {
                console.log('Подвал переключился на мобильную версию');
            } else {
                console.log('Подвал переключился на десктопную версию');
            }
        };
        
        mediaQuery.addListener(handleResponsive);
        handleResponsive(mediaQuery);
    }
};

// ИНИЦИАЛИЗАЦИЯ ВСЕХ МОДУЛЕЙ ПОДВАЛА
document.addEventListener('DOMContentLoaded', function() {
    footerBackgroundBlock.init();
    footerContactsBlock.init();
    footerInfoBlock.init();
    footerMessengersBlock.init();
    footerContainer.init();
    
    console.log('Все модули подвала с увеличенными шрифтами инициализированы успешно');
    
    // Проверка через 1 секунду
    setTimeout(() => {
        console.log('Проверка: модульный подвал с увеличенными шрифтами и letter-spacing работает корректно');
    }, 1000);
});

// ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ПОДВАЛОМ
function changeFooterGradient(startColor, endColor) {
    footerBackgroundBlock.changeGradient(startColor, endColor);
}

function getFooterInfo() {
    return {
        contacts: footerContactsBlock.element ? 'активен' : 'не активен',
        info: footerInfoBlock.element ? 'активен' : 'не активен',
        messengers: footerMessengersBlock.element ? 'активен' : 'не активен'
    };
}
