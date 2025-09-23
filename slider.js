// ===== МОДУЛЬ 1: АВТОНОМНАЯ РЕГИСТРАЦИЯ =====
(function() {
    // УЗНАЕМ СВОЕ ИМЯ
    const scriptSrc = document.currentScript ? document.currentScript.src : '';
    const scriptName = scriptSrc.split('/').pop().replace('.js', '') || 'slider';
    
    // СРАЗУ РЕГИСТРИРУЕМСЯ В WAIT ШЛЮЗЕ
    if (window.LSAMBase) {
        window.LSAMBase.sendToWait(scriptName);
    } else {
        // Если LSAMBase еще не готов, ждем и повторяем
        const waitForLSAMBase = () => {
            if (window.LSAMBase) {
                window.LSAMBase.sendToWait(scriptName);
            } else {
                setTimeout(waitForLSAMBase, 100);
            }
        };
        waitForLSAMBase();
    }
    
    // Сохраняем имя скрипта глобально для других модулей
    window.SLIDER_SCRIPT_NAME = scriptName;
    
    console.log(`🏷️ МОДУЛЬ 1: ${scriptName} зарегистрирован в WAIT шлюзе`);
})();

// ===== МОДУЛЬ 2: READY ОТПРАВЩИК =====
const SliderReadyReporter = {
    scriptName: window.SLIDER_SCRIPT_NAME,
    isReported: false,
    
    init() {
        // Слушаем событие от preloader'а
        window.addEventListener(`${this.scriptName}_preload_complete`, () => {
            this.sendReady();
        });
        
        console.log(`📦 МОДУЛЬ 2: ${this.scriptName} READY отправщик готов`);
    },
    
    sendReady() {
        if (this.isReported) return;
        
        this.isReported = true;
        window.LSAMBase.sendToReady(this.scriptName);
        console.log(`✅ МОДУЛЬ 2: ${this.scriptName} отчитался в READY шлюзе`);
    }
};

// ===== МОДУЛЬ 3: PRELOADER (ИНДИВИДУАЛЬНАЯ ЛОГИКА) =====
const SliderPreloader = {
    scriptName: window.SLIDER_SCRIPT_NAME,
    
    init() {
        console.log(`🔄 МОДУЛЬ 3: ${this.scriptName} preloader запущен`);
        
        // Инициализируем все компоненты slider'а
        this.initializeSliderComponents(() => {
            // По завершении сигналим модулю 2
            this.signalComplete();
        });
    },
    
    initializeSliderComponents(callback) {
        try {
            // Инициализируем все модули slider'а
            const modules = {
                container: HeroContainer.init(),
                slider: BackgroundSlider.init(),
                titleMain: HeroTitleMain.init(),
                titleSub: HeroTitleSub.init(),
                advantages: AdvantagesBlock.init(),
                button: ActionButton.init(),
                popup: ContactPopup.init()
            };
            
            // Глобальный доступ
            window.SliderModules = modules;
            window.openContactPopup = openContactPopup;
            window.closeContactPopup = closeContactPopup;
            window.forceUnlockScroll = forceUnlockScroll;
            
            console.log('🚀 ВСЕ МОДУЛИ SLIDER ИНИЦИАЛИЗИРОВАНЫ');
            console.log('📸 ИЗОБРАЖЕНИЯ: 16 фото проектов');
            console.log('✨ ПРЕИМУЩЕСТВА: 3 пункта');
            console.log('📱 POPUP: Надежное управление скроллом');
            console.log('⏱️ АВТОПРОКРУТКА: 5 секунд');
            console.log('🚨 Аварийная функция: window.forceUnlockScroll()');
            
            // Завершаем через 1 секунду (даем время на инициализацию)
            setTimeout(() => {
                callback();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Ошибка при инициализации модулей slider:', error);
            
            // Аварийная функция на случай ошибки
            window.forceUnlockScroll = () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.overflow = '';
                console.log('🚨 Аварийная разблокировка выполнена');
            };
            
            // Все равно отчитываемся
            callback();
        }
    },
    
    signalComplete() {
        console.log(`📤 МОДУЛЬ 3: ${this.scriptName} завершен, сигналю модулю 2`);
        
        // Отправляем событие модулю 2
        window.dispatchEvent(new CustomEvent(`${this.scriptName}_preload_complete`));
    }
};

/* ===== МОДУЛЬ 1: КОНТЕЙНЕР (АВТОНОМНЫЙ) ===== */
const HeroContainer = {
    element: document.getElementById('heroContainer'),
    
    init() {
        console.log('✅ HeroContainer инициализирован');
        return this;
    },

    setHeight(height) {
        if (this.element) {
            this.element.style.height = height + 'px';
            console.log(`📐 Высота контейнера изменена на ${height}px`);
        }
    },

    setMaxWidth(maxWidth) {
        if (this.element) {
            this.element.style.maxWidth = maxWidth + 'px';
            console.log(`📏 Максимальная ширина изменена на ${maxWidth}px`);
        }
    }
};

/* ===== МОДУЛЬ 2: СЛАЙДЕР (АВТОНОМНЫЙ) ===== */
const BackgroundSlider = {
    element: document.getElementById('backgroundSlider'),
    container: document.getElementById('slidesContainer'),
    currentSlide: 0,
    slides: [],
    interval: null,
    
    images: [
        'https://s.iimg.su/s/15/gFtHgK1xPYVt0RM5vYGg3DBG5IZM63Tqa5NTsgYn.png',
        'https://rkpanel.ru/assets/Uploads/IMG_1086.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_7831.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_7238.JPG',
        'https://rkpanel.ru/assets/Uploads/15.jpg',
        'https://rkpanel.ru/assets/Uploads/Avtomojka-s-oknami.JPG',
        'https://rkpanel.ru/assets/Uploads/cherteg.jpg',
        'https://rkpanel.ru/assets/Uploads/IMG_7830.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_8136.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_1677.JPG',
        'https://rkpanel.ru/assets/Uploads/20191224_091457.jpg',
        'https://rkpanel.ru/assets/Uploads/IMG_7468.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_2562.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_1903.jpg',
        'https://rkpanel.ru/assets/Uploads/IMG_7148.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_7792.JPG'
    ],
    
    init() {
        if (this.container) {
            this.createSlides();
            this.startSlideshow();
            console.log(`✅ BackgroundSlider инициализирован - ${this.images.length} изображений`);
        } else {
            console.error('❌ BackgroundSlider: slidesContainer не найден');
        }
        return this;
    },
    
    createSlides() {
        this.images.forEach((imageSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide-item';
            slide.style.backgroundImage = `url("${imageSrc}")`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            
            this.container.appendChild(slide);
            this.slides.push(slide);
        });
        
        this.updateSliderPosition();
        console.log(`🖼️ Создано ${this.slides.length} слайдов`);
    },
    
    updateSliderPosition() {
        if (this.container) {
            const translateX = -this.currentSlide * 100;
            this.container.style.transform = `translateX(${translateX}%)`;
        }
    },
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSliderPosition();
        console.log(`🔄 Слайд ${this.currentSlide + 1} из ${this.slides.length}`);
    },
    
    startSlideshow() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 5000);
        
        console.log('🎬 Слайдшоу запущено');
    },
    
    stopSlideshow() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            console.log('⏹️ Слайдшоу остановлено');
        }
    }
};

/* ===== МОДУЛЬ 3А: ГЛАВНЫЙ ЗАГОЛОВОК (ПРОСТОЙ) ===== */
const HeroTitleMain = {
    element: document.getElementById('heroTitleMain'),
    textElement: null,
    
    init() {
        if (this.element) {
            this.textElement = this.element.querySelector('.hero-title-main-text');
            console.log('✅ HeroTitleMain инициализирован');
        } else {
            console.warn('⚠️ HeroTitleMain: элемент не найден');
        }
        return this;
    }
};

/* ===== МОДУЛЬ 3Б: ПОДЗАГОЛОВОК (ПРОСТОЙ) ===== */
const HeroTitleSub = {
    element: document.getElementById('heroTitleSub'),
    textElement: null,
    
    init() {
        if (this.element) {
            this.textElement = this.element.querySelector('.hero-title-sub-text');
            console.log('✅ HeroTitleSub инициализирован');
        } else {
            console.warn('⚠️ HeroTitleSub: элемент не найден');
        }
        return this;
    }
};

/* ===== МОДУЛЬ 4: ПРЕИМУЩЕСТВА (ПРОСТЫЕ) ===== */
const AdvantagesBlock = {
    element: document.getElementById('advantagesBlock'),
    
    advantages: [
        'СЭНДВИЧ-ПАНЕЛИ НАПРЯМУЮ ОТ ПРОИЗВОДИТЕЛЯ',
        'СРОК ИЗГОТОВЛЕНИЯ - 3 ДНЯ',
        'ПРОИЗВОДСТВО МЕТАЛЛОКОНСТРУКЦИЙ И СТРОИТЕЛЬСТВО ЗДАНИЙ ПОД КЛЮЧ'
    ],
    
    init() {
        if (this.element) {
            this.createAdvantages();
            console.log('✅ AdvantagesBlock инициализирован');
        } else {
            console.warn('⚠️ AdvantagesBlock: элемент не найден');
        }
        return this;
    },
    
    createAdvantages() {
        this.advantages.forEach((text, index) => {
            const item = document.createElement('div');
            item.className = 'advantage-item';
            
            const span = document.createElement('span');
            span.className = 'advantage-text';
            span.textContent = text;
            
            item.appendChild(span);
            this.element.appendChild(item);
        });
        
        console.log(`📝 Создано ${this.advantages.length} преимуществ`);
    }
};

/* ===== МОДУЛЬ 5: КНОПКА (С ОТЛАДКОЙ) ===== */
const ActionButton = {
    element: document.getElementById('actionButton'),
    
    init() {
        if (this.element) {
            this.setupEventListeners();
            console.log('✅ ActionButton инициализирован');
        } else {
            console.warn('⚠️ ActionButton: элемент не найден');
        }
        return this;
    },

    setupEventListeners() {
        this.element.addEventListener('click', (e) => {
            console.log('🔥 КЛИК по кнопке! Открываю popup...');
            e.preventDefault();
            e.stopPropagation();
            openContactPopup();
        });
        
        this.element.addEventListener('mouseenter', () => {
            this.element.style.transform = 'scale(1.05)';
            this.element.style.backgroundColor = '#e55a32';
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'scale(1)';
            this.element.style.backgroundColor = '#ff6b35';
        });

        this.element.addEventListener('mousedown', () => {
            this.element.style.transform = 'scale(0.95)';
            this.element.style.backgroundColor = '#d44a2b';
        });

        this.element.addEventListener('mouseup', () => {
            if (this.element.matches(':hover')) {
                this.element.style.transform = 'scale(1.05)';
                this.element.style.backgroundColor = '#e55a32';
            } else {
                this.element.style.transform = 'scale(1)';
                this.element.style.backgroundColor = '#ff6b35';
            }
        });
        
        console.log('🎛️ ActionButton: Event listeners настроены');
    }
};

/* ===== МОДУЛЬ 6: ВСПЛЫВАЮЩЕЕ ОКНО (МОБИЛЬНО-ДРУЖЕСТВЕННОЕ) ===== */
const ContactPopup = {
    overlay: null,
    scrollPosition: 0,
    isOpen: false,
    
    init() {
        this.overlay = document.getElementById('contactPopup');
        
        if (this.overlay) {
            this.setupEventListeners();
            console.log('✅ ContactPopup инициализирован');
        } else {
            console.error('❌ ContactPopup: элемент contactPopup не найден!');
        }
        
        return this;
    },

    setupEventListeners() {
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        });

        const closeBtns = this.overlay.querySelectorAll('.close-btn, .popup-close, [data-close-popup]');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hide();
            });
        });

        console.log('🎛️ ContactPopup: Event listeners настроены');
    },

    show() {
        if (!this.overlay || this.isOpen) return;

        console.log('📱 Открываю popup (мобильная версия)...');
        
        // СОХРАНЯЕМ позицию скролла БОЛЕЕ НАДЕЖНО
        this.scrollPosition = Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
        );
        
        console.log(`📍 Сохранил позицию скролла: ${this.scrollPosition}px`);
        
        // МОБИЛЬНО-ДРУЖЕСТВЕННАЯ блокировка скролла
        const html = document.documentElement;
        const body = document.body;
        
        // Блокируем скролл на html и body
        html.style.overflow = 'hidden';
        html.style.position = 'fixed';
        html.style.width = '100%';
        html.style.top = `-${this.scrollPosition}px`;
        
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';  
        body.style.width = '100%';
        body.style.top = `-${this.scrollPosition}px`;
        
        this.overlay.classList.add('show');
        this.overlay.style.display = 'flex';
        this.isOpen = true;
        
        console.log('✅ Popup показан (мобильная блокировка)');
    },

    hide() {
        if (!this.overlay || !this.isOpen) return;

        console.log('❌ Закрываю popup (мобильная версия)...');
        
        this.overlay.classList.remove('show');
        this.overlay.style.display = 'none';
        this.isOpen = false;
        
        // МОБИЛЬНО-ДРУЖЕСТВЕННОЕ восстановление
        const html = document.documentElement;
        const body = document.body;
        
        // Убираем все стили блокировки
        html.style.overflow = '';
        html.style.position = '';
        html.style.width = '';
        html.style.top = '';
        
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.top = '';
        
        // НАДЕЖНОЕ восстановление скролла для мобилок
        requestAnimationFrame(() => {
            window.scrollTo(0, this.scrollPosition);
            document.documentElement.scrollTop = this.scrollPosition;
            document.body.scrollTop = this.scrollPosition;
            
            console.log(`🔄 Восстановил скролл на позицию: ${this.scrollPosition}px`);
            
            // Дополнительная проверка через 100ms
            setTimeout(() => {
                if (window.pageYOffset !== this.scrollPosition) {
                    window.scrollTo(0, this.scrollPosition);
                    console.log('🔄 Дополнительная коррекция скролла');
                }
            }, 100);
        });
        
        console.log('✅ Popup закрыт (мобильная версия)');
    },

    forceUnlock() {
        console.log('🚨 АВАРИЙНАЯ разблокировка (мобильная)!');
        
        const html = document.documentElement;
        const body = document.body;
        
        // Полная очистка всех стилей
        html.style.overflow = '';
        html.style.position = '';
        html.style.width = '';
        html.style.top = '';
        
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.top = '';
        
        if (this.overlay) {
            this.overlay.classList.remove('show');
            this.overlay.style.display = 'none';
        }
        this.isOpen = false;
        
        console.log('🚨 Аварийная разблокировка выполнена');
    }
};

/* ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ===== */
function openContactPopup() {
    console.log('🌍 Глобальная функция openContactPopup вызвана');
    ContactPopup.show();
}

function closeContactPopup() {
    console.log('🌍 Глобальная функция closeContactPopup вызвана');
    ContactPopup.hide();
}

function forceUnlockScroll() {
    console.log('🌍 Глобальная функция forceUnlockScroll вызвана');
    ContactPopup.forceUnlock();
}

// ===== ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Slider: Запускаю новую архитектуру');

    // Инициализируем модули в правильном порядке
    SliderReadyReporter.init();
    SliderPreloader.init();
});

// ===== ОТЛАДОЧНЫЕ ФУНКЦИИ =====
function getSliderStatus() {
    console.log('📊 СТАТУС Slider новой архитектуры:');
    console.log('  ReadyReporter:', SliderReadyReporter.isReported ? 'ГОТОВ' : 'ЖДЕТ');
    console.log('  LSAMBase:', window.LSAMBase ? window.LSAMBase.getStats() : 'НЕ ГОТОВ');
}

console.log('✅ Slider: Новая архитектура запущена');
