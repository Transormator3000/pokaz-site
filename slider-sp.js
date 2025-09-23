// ===== МОДУЛЬ 1: АВТОНОМНАЯ РЕГИСТРАЦИЯ =====
(function() {
    // УЗНАЕМ СВОЕ ИМЯ
    const scriptSrc = document.currentScript ? document.currentScript.src : '';
    const scriptName = scriptSrc.split('/').pop().replace('.js', '') || 'slider-sp';
    
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
    window.SLIDER_SP_SCRIPT_NAME = scriptName;
    
    console.log(`🏷️ МОДУЛЬ 1: ${scriptName} зарегистрирован в WAIT шлюзе`);
})();

// ===== МОДУЛЬ 2: READY ОТПРАВЩИК =====
const SliderSpReadyReporter = {
    scriptName: window.SLIDER_SP_SCRIPT_NAME,
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
const SliderSpPreloader = {
    scriptName: window.SLIDER_SP_SCRIPT_NAME,
    
    init() {
        console.log(`🔄 МОДУЛЬ 3: ${this.scriptName} preloader запущен`);
        
        // Инициализируем все компоненты завода сэндвич-панелей
        this.initializeSliderSpComponents(() => {
            // По завершении сигналим модулю 2
            this.signalComplete();
        });
    },
    
    initializeSliderSpComponents(callback) {
        try {
            console.log('🔄 Начинаем инициализацию модулей завода сэндвич-панелей...');
            
            // Инициализируем все модули завода
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
            
            console.log('🚀 ВСЕ МОДУЛИ ЗАВОДА СЭНДВИЧ-ПАНЕЛЕЙ ИНИЦИАЛИЗИРОВАНЫ');
            console.log('🏭 ЗАВОД: Производство панелей с доставкой по России');
            console.log('📸 СЛАЙДЕР: 3 фото завода');
            console.log('✨ ПРЕИМУЩЕСТВА: 3 пункта БЕЗ ИКОНОК');
            console.log('👁️ ПРОЦЕСС: 5 этапов производства - все видны сразу');
            console.log('📱 POPUP: Многоразовое открытие с блокировкой скролла');
            console.log('⏱️ АВТОПРОКРУТКА: 5 секунд');
            console.log('📍 МЕСТОПОЛОЖЕНИЕ: Петрозаводск, Карелия');
            console.log('🎛️ Все модули завода доступны через window.SliderModules1');
            
            // Завершаем через 1 секунду (даем время на инициализацию)
            setTimeout(() => {
                callback();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Ошибка при инициализации модулей завода:', error);
            
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
        console.log('✅ HeroContainer1 (ЗАВОД СЭНДВИЧ-ПАНЕЛЕЙ) инициализирован');
        return this;
    },

    setHeight(height) {
        if (this.element) {
            this.element.style.height = height + 'px';
            console.log(`📐 Высота контейнера завода: ${height}px`);
        }
    },

    setMaxWidth(maxWidth) {
        if (this.element) {
            this.element.style.maxWidth = maxWidth + 'px';
            console.log(`📏 Максимальная ширина завода: ${maxWidth}px`);
        }
    }
};

/* ===== МОДУЛЬ 2: СЛАЙДЕР ЗАВОДА (АВТОНОМНЫЙ) ===== */
const BackgroundSlider1 = {
    element: document.getElementById('backgroundSlider1'),
    container: document.getElementById('slidesContainer1'),
    currentSlide: 0,
    slides: [],
    interval: null,
    
    images: [
        'https://rkpanel.ru/assets/promo/sandwich.jpg',
        'https://i.ibb.co/60hmqrZF/image-Picsart-Ai-Image-Enhancer-1.jpg',
        'https://i.ibb.co/7xN58Lfd/bb77aa36-9297-4bab-a670-ad39ae622394-Picsart-Ai-Image-Enhancer.png'
    ],
    
    init() {
        if (this.container) {
            this.createSlides();
            this.startSlideshow();
            console.log(`✅ BackgroundSlider1 инициализирован - ${this.images.length} фото завода`);
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
        console.log(`🔄 Завод слайд ${this.currentSlide + 1} из ${this.slides.length}`);
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
        console.log('✅ HeroTitleMain1 (ЗАВОД СЭНДВИЧ-ПАНЕЛЕЙ) инициализирован');
        return this;
    },

    setText(text) {
        if (this.textElement) {
            this.textElement.textContent = text;
            console.log(`📝 Заголовок завода: "${text}"`);
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
        console.log('✅ HeroTitleSub1 (ДОСТАВКА ПО РОССИИ) инициализирован');
        return this;
    },

    setText(text) {
        if (this.textElement) {
            this.textElement.textContent = text;
            console.log(`📝 Подзаголовок: "${text}"`);
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

/* ===== МОДУЛЬ 4: ПРЕИМУЩЕСТВА ЗАВОДА (БЕЗ ИКОНОК) ===== */
const AdvantagesBlock1 = {
    element: document.getElementById('advantagesBlock1'),
    
    advantages: [
        {
            text: 'НАХОДИМСЯ В ПЕТРОЗАВОДСКЕ, КАРЕЛИЯ'
        },
        {
            text: 'ИЗГОТОВЛЕНИЕ ОТ 3 ДНЕЙ'
        },
        {
            text: 'НАПОЛНИТЕЛИ: ПЕНОПОЛИСТЕРОЛ И МИНВАТА'
        }
    ],
    
    init() {
        if (this.element) {
            this.createAdvantages();
            console.log('✅ AdvantagesBlock1 (ЗАВОД) инициализирован');
        }
        return this;
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
    }
};

/* ===== МОДУЛЬ 5: КНОПКА ЗАВОДА (МНОГОРАЗОВОЕ НАЖАТИЕ) ===== */
const ActionButton1 = {
    element: document.getElementById('actionButton1'),
    
    init() {
        if (this.element) {
            this.setupEventListeners();
            this.setupAnimations();
            console.log('✅ ActionButton1 (УЗНАТЬ СТОИМОСТЬ) инициализирован');
        }
        return this;
    },

    setupEventListeners() {
        if (this.element) {
            this.element.addEventListener('click', () => {
                openContactPopup1();
                console.log('🏭 Кнопка завода нажата - открываем popup');
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
        console.log('✅ ContactPopup1 (ЗАКАЗ ПАНЕЛЕЙ) инициализирован');
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
            console.log('📱 Popup панелей показан, скролл заблокирован');
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
            
            console.log('❌ Popup панелей скрыт, скролл разблокирован');
        }
    }
};

/* ===== МОДУЛЬ 7: ПРОЦЕСС ПРОИЗВОДСТВА (АВТОНОМНЫЙ) ===== */
const ProcessSteps1 = {
    container: document.getElementById('processStepsContainer1'),
    steps: [],
    
    init() {
        this.steps = document.querySelectorAll('.process-step1');
        this.showAllStepsImmediately();
        console.log('✅ ProcessSteps1 (ПРОИЗВОДСТВО ПАНЕЛЕЙ) инициализирован');
        return this;
    },

    showAllStepsImmediately() {
        this.steps.forEach((step, index) => {
            if (step) {
                step.style.animationPlayState = 'running';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
                
                console.log(`👁️ Этап производства ${index + 1} показан`);
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
            
            console.log(`📝 Обновлен этап ${stepNumber}: "${title}"`);
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
    console.log('🚀 Slider-SP: Запускаю новую архитектуру');

    // Инициализируем модули в правильном порядке
    SliderSpReadyReporter.init();
    SliderSpPreloader.init();
});

// ===== ОТЛАДОЧНЫЕ ФУНКЦИИ =====
function getSliderSpStatus() {
    console.log('📊 СТАТУС Slider-SP новой архитектуры:');
    console.log('  ReadyReporter:', SliderSpReadyReporter.isReported ? 'ГОТОВ' : 'ЖДЕТ');
    console.log('  LSAMBase:', window.LSAMBase ? window.LSAMBase.getStats() : 'НЕ ГОТОВ');
}

console.log('✅ Slider-SP: Новая архитектура запущена');
