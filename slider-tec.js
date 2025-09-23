// ===== МОДУЛЬ 1: АВТОНОМНАЯ РЕГИСТРАЦИЯ =====
(function() {
    // УЗНАЕМ СВОЕ ИМЯ
    const scriptSrc = document.currentScript ? document.currentScript.src : '';
    const scriptName = scriptSrc.split('/').pop().replace('.js', '') || 'slider-tec';
    
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
    window.SLIDER_TEC_SCRIPT_NAME = scriptName;
    
    console.log(`🏷️ МОДУЛЬ 1: ${scriptName} зарегистрирован в WAIT шлюзе`);
})();

// ===== МОДУЛЬ 2: READY ОТПРАВЩИК =====
const SliderTecReadyReporter = {
    scriptName: window.SLIDER_TEC_SCRIPT_NAME,
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
const SliderTecPreloader = {
    scriptName: window.SLIDER_TEC_SCRIPT_NAME,
    
    init() {
        console.log(`🔄 МОДУЛЬ 3: ${this.scriptName} preloader запущен`);
        
        // Инициализируем все компоненты спецтехники
        this.initializeSliderTecComponents(() => {
            // По завершении сигналим модулю 2
            this.signalComplete();
        });
    },
    
    initializeSliderTecComponents(callback) {
        try {
            console.log('🔄 Начинаем инициализацию модулей спецтехники...');
            
            // Инициализируем все модули спецтехники
            const modules = {
                container: HeroContainer1.init(),
                slider: BackgroundSlider1.init(),
                titleMain: HeroTitleMain1.init(),
                titleSub: HeroTitleSub1.init(),
                advantages: AdvantagesBlock1.init(),
                button: ActionButton1.init(),
                popup: ContactPopup1.init(),
                processSteps: ProcessSteps1.init()
            };
            
            // Глобальный доступ
            window.SliderModules1 = modules;
            window.openContactPopup1 = openContactPopup1;
            window.closeContactPopup1 = closeContactPopup1;
            
            console.log('🚀 ВСЕ МОДУЛИ СПЕЦТЕХНИКИ ИНИЦИАЛИЗИРОВАНЫ');
            console.log('🚛 СПЕЦТЕХНИКА: Аренда по Петрозаводску и Карелии');
            console.log('📸 ИЗОБРАЖЕНИЯ: 2 фото спецтехники');
            console.log('✨ ПРЕИМУЩЕСТВА: 3 пункта БЕЗ ИКОНОК');
            console.log('👁️ ПРОЦЕСС: 5 этапов аренды - ВСЕ ВИДНЫ СРАЗУ');
            console.log('⏱️ АВТОПРОКРУТКА: 5 секунд');
            console.log('🔤 ШРИФТЫ: Montserrat');
            console.log('🎛️ Все модули спецтехники доступны через window.SliderModules1');
            
            // Завершаем через 1 секунду (даем время на инициализацию)
            setTimeout(() => {
                callback();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Ошибка при инициализации модулей спецтехники:', error);
            
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
const HeroContainer1 = {
    element: document.getElementById('heroContainer1'),
    
    init() {
        console.log('✅ HeroContainer1 (АРЕНДА СПЕЦТЕХНИКИ ПО ПЕТРОЗАВОДСКУ И КАРЕЛИИ) инициализирован');
        return this;
    },

    setHeight(height) {
        if (this.element) {
            this.element.style.height = height + 'px';
            console.log(`📐 Высота контейнера спецтехники: ${height}px`);
        }
    },

    setMaxWidth(maxWidth) {
        if (this.element) {
            this.element.style.maxWidth = maxWidth + 'px';
            console.log(`📏 Максимальная ширина спецтехники: ${maxWidth}px`);
        }
    }
};

/* ===== МОДУЛЬ 2: СЛАЙДЕР СПЕЦТЕХНИКИ (АВТОНОМНЫЙ) ===== */
const BackgroundSlider1 = {
    element: document.getElementById('backgroundSlider1'),
    container: document.getElementById('slidesContainer1'),
    currentSlide: 0,
    slides: [],
    interval: null,
    
    images: [
        'https://avatars.mds.yandex.net/get-altay/8072793/2a00000188c475634d84f2bc64f92fcaffca/orig',
        'https://rkpanel.ru/assets/Uploads/15.jpg'
    ],
    
    init() {
        if (this.container) {
            this.createSlides();
            this.startSlideshow();
            console.log(`✅ BackgroundSlider1 инициализирован - ${this.images.length} фото спецтехники`);
        }
        return this;
    },
    
    createSlides() {
        this.images.forEach((imageSrc) => {
            const slide = document.createElement('div');
            slide.className = 'slide-item1';
            slide.style.backgroundImage = `url("${imageSrc}")`;
            slide.style.backgroundSize = 'cover';
            slide.style.backgroundPosition = 'center';
            
            this.container.appendChild(slide);
            this.slides.push(slide);
        });
        
        this.updateSliderPosition();
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
        console.log(`🔄 Спецтехника слайд ${this.currentSlide + 1} из ${this.slides.length}`);
    },
    
    changeSpeed(intervalMs) {
        this.stopSlideshow();
        this.interval = setInterval(() => {
            this.nextSlide();
        }, intervalMs);
        console.log(`⚡ Скорость слайдера спецтехники изменена на ${intervalMs}ms`);
    },
    
    startSlideshow() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    },
    
    stopSlideshow() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
};

/* ===== МОДУЛЬ 3А: ГЛАВНЫЙ ЗАГОЛОВОК (АВТОНОМНЫЙ) ===== */
const HeroTitleMain1 = {
    element: document.getElementById('heroTitleMain1'),
    textElement: null,
    
    init() {
        this.textElement = this.element?.querySelector('.hero-title-main-text1');
        this.setupAnimations();
        console.log('✅ HeroTitleMain1 (АРЕНДА СПЕЦТЕХНИКИ) инициализирован');
        return this;
    },

    setText(text) {
        if (this.textElement) {
            this.textElement.textContent = text;
            console.log(`📝 Заголовок спецтехники: "${text}"`);
        }
    },

    setPosition(top, left = 0) {
        if (this.element) {
            this.element.style.top = top + 'px';
            this.element.style.left = left + 'px';
            console.log(`📍 Позиция главного заголовка спецтехники: top=${top}px, left=${left}px`);
        }
    },

    setWidth(rightPadding) {
        if (this.element) {
            this.element.style.padding = `8px ${rightPadding}px 8px 45px`;
            console.log(`📏 Ширина главного заголовка спецтехники изменена: rightPadding=${rightPadding}px`);
        }
    },

    setFontSize(fontSize) {
        if (this.textElement) {
            this.textElement.style.fontSize = fontSize + 'px';
            console.log(`🔤 Размер шрифта главного заголовка спецтехники: ${fontSize}px`);
        }
    },
    
    setupAnimations() {
        if (this.element) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                this.element.style.transition = 'all 0.8s ease';
                this.element.style.opacity = '1';
                this.element.style.transform = 'translateY(0)';
            }, 500);
        }
    }
};

/* ===== МОДУЛЬ 3Б: ПОДЗАГОЛОВОК (АВТОНОМНЫЙ) ===== */
const HeroTitleSub1 = {
    element: document.getElementById('heroTitleSub1'),
    textElement: null,
    
    init() {
        this.textElement = this.element?.querySelector('.hero-title-sub-text1');
        this.setupAnimations();
        console.log('✅ HeroTitleSub1 (ПО ПЕТРОЗАВОДСКУ И КАРЕЛИИ) инициализирован');
        return this;
    },

    setText(text) {
        if (this.textElement) {
            this.textElement.textContent = text;
            console.log(`📝 Текст подзаголовка спецтехники: "${text}"`);
        }
    },

    setPosition(top, left = 0) {
        if (this.element) {
            this.element.style.top = top + 'px';
            this.element.style.left = left + 'px';
            console.log(`📍 Позиция подзаголовка спецтехники: top=${top}px, left=${left}px`);
        }
    },

    setWidth(rightPadding) {
        if (this.element) {
            this.element.style.padding = `8px ${rightPadding}px 8px 45px`;
            console.log(`📏 Ширина подзаголовка спецтехники изменена: rightPadding=${rightPadding}px`);
        }
    },

    setFontSize(fontSize) {
        if (this.textElement) {
            this.textElement.style.fontSize = fontSize + 'px';
            console.log(`🔤 Размер шрифта подзаголовка спецтехники: ${fontSize}px`);
        }
    },

    setupAnimations() {
        if (this.element) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                this.element.style.transition = 'all 0.8s ease';
                this.element.style.opacity = '1';
                this.element.style.transform = 'translateY(0)';
            }, 700);
        }
    }
};

/* ===== МОДУЛЬ 4: ПРЕИМУЩЕСТВА СПЕЦТЕХНИКИ (БЕЗ ИКОНОК) ===== */
const AdvantagesBlock1 = {
    element: document.getElementById('advantagesBlock1'),
    
    advantages: [
        {
            text: 'ОПЫТНЫЕ ОПЕРАТОРЫ'
        },
        {
            text: 'НОВАЯ ТЕХНИКА'
        },
        {
            text: 'ГИБКОЕ ЦЕНООБРАЗОВАНИЕ, С НДС'
        }
    ],
    
    init() {
        if (this.element) {
            this.createAdvantages();
            this.setupAnimations();
            console.log('✅ AdvantagesBlock1 (ПРЕИМУЩЕСТВА СПЕЦТЕХНИКИ) инициализирован');
        }
        return this;
    },

    setPosition(bottom, left = 0) {
        if (this.element) {
            this.element.style.bottom = bottom + 'px';
            this.element.style.left = left + 'px';
            console.log(`📍 Позиция блока преимуществ спецтехники: bottom=${bottom}px, left=${left}px`);
        }
    },

    setWidth(width) {
        if (this.element) {
            this.element.style.width = width + 'px';
            console.log(`📏 Ширина блока преимуществ спецтехники: ${width}px`);
        }
    },

    setTextAlignment(leftPadding) {
        const items = this.element?.querySelectorAll('.advantage-item1');
        items?.forEach(item => {
            item.style.paddingLeft = leftPadding + 'px';
        });
        console.log(`🎯 Выравнивание текста спецтехники: leftPadding=${leftPadding}px`);
    },
    
    createAdvantages() {
        this.advantages.forEach((advantage, index) => {
            const item = document.createElement('div');
            item.className = 'advantage-item1';
            
            // СОЗДАЁМ ТОЛЬКО ТЕКСТ, БЕЗ ИКОНОК
            const text = document.createElement('span');
            text.className = 'advantage-text1';
            text.textContent = advantage.text;
            
            item.appendChild(text);
            this.element.appendChild(item);
            
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 800 + (index * 200));
        });
    },
    
    setupAnimations() {
        console.log('🎬 Анимации преимуществ спецтехники настроены');
    }
};

/* ===== МОДУЛЬ 5: КНОПКА СПЕЦТЕХНИКИ (ПРОСТЫЕ АНИМАЦИИ) ===== */
const ActionButton1 = {
    element: document.getElementById('actionButton1'),
    
    init() {
        if (this.element) {
            this.setupEventListeners();
            this.setupAnimations();
            console.log('✅ ActionButton1 с простыми анимациями инициализирован');
        }
        return this;
    },

    setText(text) {
        if (this.element) {
            this.element.innerHTML = text;
            console.log(`📝 Текст кнопки спецтехники изменен: "${text}"`);
        }
    },

    setFontWeight(weight) {
        if (this.element) {
            this.element.style.fontWeight = weight;
            console.log(`🔤 Жирность шрифта кнопки спецтехники: ${weight}`);
        }
    },

    setFontSize(fontSize) {
        if (this.element) {
            this.element.style.fontSize = fontSize + 'px';
            console.log(`📏 Размер шрифта кнопки спецтехники: ${fontSize}px`);
        }
    },

    setPosition(bottom, right) {
        const buttonBlock = this.element?.parentElement;
        if (buttonBlock) {
            buttonBlock.style.bottom = bottom + 'px';
            buttonBlock.style.right = right + 'px';
            console.log(`📍 Позиция кнопки спецтехники: bottom=${bottom}px, right=${right}px`);
        }
    },
    
    setupEventListeners() {
        if (this.element) {
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
            
            this.element.addEventListener('click', () => {
                openContactPopup1();
                console.log('🔥 Кнопка спецтехники нажата - открываем popup');
            });
        }
    },
    
    setupAnimations() {
        if (this.element) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                this.element.style.transition = 'all 0.3s ease';
                this.element.style.opacity = '1';
                this.element.style.transform = 'translateY(0)';
            }, 1200);
        }
    }
};

/* ===== МОДУЛЬ 6: ВСПЛЫВАЮЩЕЕ ОКНО (ИСПРАВЛЕННОЕ) ===== */
const ContactPopup1 = {
    overlay: document.getElementById('contactPopup1'),
    scrollPosition: 0,
    
    init() {
        console.log('✅ ContactPopup1 (АРЕНДА СПЕЦТЕХНИКИ) инициализирован');
        return this;
    },

    show() {
        if (this.overlay) {
            // СОХРАНЯЕМ ПОЗИЦИЮ СКРОЛЛА
            this.scrollPosition = window.pageYOffset;
            
            // БЛОКИРУЕМ СКРОЛЛ СТРАНИЦЫ
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            
            // ПОКАЗЫВАЕМ POPUP
            this.overlay.classList.add('show');
            console.log('📱 Popup спецтехники показан, скролл заблокирован');
        }
    },

    hide() {
        if (this.overlay) {
            // УБИРАЕМ POPUP
            this.overlay.classList.remove('show');
            
            // ВОЗВРАЩАЕМ СКРОЛЛ СТРАНИЦЫ
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            
            // ВОССТАНАВЛИВАЕМ ПОЗИЦИЮ СКРОЛЛА
            window.scrollTo(0, this.scrollPosition);
            
            console.log('❌ Popup спецтехники скрыт, скролл разблокирован');
        }
    }
};

/* ===== МОДУЛЬ 7: ПРОЦЕСС АРЕНДЫ СПЕЦТЕХНИКИ (АВТОНОМНЫЙ) ===== */
const ProcessSteps1 = {
    container: document.getElementById('processStepsContainer1'),
    steps: [],
    
    init() {
        this.steps = document.querySelectorAll('.process-step1');
        this.showAllStepsImmediately();
        console.log('✅ ProcessSteps1 (ЭТАПЫ АРЕНДЫ СПЕЦТЕХНИКИ) инициализирован - все элементы видны сразу');
        return this;
    },

    showAllStepsImmediately() {
        this.steps.forEach((step, index) => {
            if (step) {
                step.style.animationPlayState = 'running';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
                
                console.log(`👁️ Шаг аренды спецтехники ${index + 1} показан сразу`);
            }
        });
    },

    updateStepText(stepNumber, title, text) {
        const step = document.getElementById(`processStep${stepNumber}`);
        if (step) {
            const titleElement = step.querySelector('.process-title1');
            const textElement = step.querySelector('.process-text1');
            
            if (titleElement) titleElement.textContent = title;
            if (textElement) textElement.textContent = text;
            
            console.log(`📝 Обновлен шаг аренды спецтехники ${stepNumber}: "${title}"`);
        }
    },

    setContainerStyle(maxWidth) {
        if (this.container) {
            this.container.style.maxWidth = maxWidth + 'px';
            console.log(`📏 Ширина контейнера процесса аренды спецтехники: ${maxWidth}px`);
        }
    }
};

/* ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ===== */
function openContactPopup1() {
    ContactPopup1.show();
}

function closeContactPopup1() {
    ContactPopup1.hide();
}

/* ===== EVENT LISTENERS ===== */
const contactPopupElement = document.getElementById('contactPopup1');
if (contactPopupElement) {
    contactPopupElement.addEventListener('click', function(e) {
        if (e.target === this) {
            closeContactPopup1();
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeContactPopup1();
    }
});

// ===== ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Slider-TEC: Запускаю новую архитектуру');

    // Инициализируем модули в правильном порядке
    SliderTecReadyReporter.init();
    SliderTecPreloader.init();
});

// ===== ОТЛАДОЧНЫЕ ФУНКЦИИ =====
function getSliderTecStatus() {
    console.log('📊 СТАТУС Slider-TEC новой архитектуры:');
    console.log('  ReadyReporter:', SliderTecReadyReporter.isReported ? 'ГОТОВ' : 'ЖДЕТ');
    console.log('  LSAMBase:', window.LSAMBase ? window.LSAMBase.getStats() : 'НЕ ГОТОВ');
}

console.log('✅ Slider-TEC: Новая архитектура запущена');
