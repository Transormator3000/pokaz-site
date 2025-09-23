// ===== МОДУЛЬ 1: АВТОНОМНАЯ РЕГИСТРАЦИЯ =====
(function() {
    // УЗНАЕМ СВОЕ ИМЯ
    const scriptSrc = document.currentScript ? document.currentScript.src : '';
    const scriptName = scriptSrc.split('/').pop().replace('.js', '') || 'slider-str';
    
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
    window.SLIDER_STR_SCRIPT_NAME = scriptName;
    
    console.log(`🏷️ МОДУЛЬ 1: ${scriptName} зарегистрирован в WAIT шлюзе`);
})();

// ===== МОДУЛЬ 2: READY ОТПРАВЩИК =====
const SliderStrReadyReporter = {
    scriptName: window.SLIDER_STR_SCRIPT_NAME,
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
const SliderStrPreloader = {
    scriptName: window.SLIDER_STR_SCRIPT_NAME,
    
    init() {
        console.log(`🔄 МОДУЛЬ 3: ${this.scriptName} preloader запущен`);
        
        // Инициализируем все компоненты строительства
        this.initializeSliderStrComponents(() => {
            // По завершении сигналим модулю 2
            this.signalComplete();
        });
    },
    
    initializeSliderStrComponents(callback) {
        try {
            console.log('🔄 Начинаем инициализацию модулей строительства...');
            
            // Инициализируем все модули строительства
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
            
            console.log('🚀 ВСЕ МОДУЛИ СТРОИТЕЛЬСТВА ИНИЦИАЛИЗИРОВАНЫ');
            console.log('🏗️ СТРОИТЕЛЬСТВО: Возведение модульных зданий «под ключ»');
            console.log('📸 ИЗОБРАЖЕНИЯ: 25 фото (5 с RKPanel + 20 улучшенных хостовых)');
            console.log('✨ ПРЕИМУЩЕСТВА: 3 пункта БЕЗ ИКОНОК');
            console.log('👁️ ПРОЦЕСС: 5 этапов строительства - ВСЕ ВИДНЫ СРАЗУ');
            console.log('📱 POPUP: Многоразовое открытие с блокировкой скролла');
            console.log('⏱️ АВТОПРОКРУТКА: 5 секунд');
            console.log('📍 ПРЕИМУЩЕСТВА: Сметы дешевле, 6 месяцев срок, гарантия');
            console.log('🎛️ Все модули строительства доступны через window.SliderModules1');
            
            // Завершаем через 1 секунду (даем время на инициализацию)
            setTimeout(() => {
                callback();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Ошибка при инициализации модулей строительства:', error);
            
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
        console.log('✅ HeroContainer1 (ВОЗВЕДЕНИЕ МОДУЛЬНЫХ ЗДАНИЙ ПОД КЛЮЧ) инициализирован');
        return this;
    },

    setHeight(height) {
        if (this.element) {
            this.element.style.height = height + 'px';
            console.log(`📐 Высота контейнера строительства: ${height}px`);
        }
    },

    setMaxWidth(maxWidth) {
        if (this.element) {
            this.element.style.maxWidth = maxWidth + 'px';
            console.log(`📏 Максимальная ширина строительства: ${maxWidth}px`);
        }
    }
};

/* ===== МОДУЛЬ 2: СЛАЙДЕР СТРОИТЕЛЬСТВА (АВТОНОМНЫЙ) ===== */
const BackgroundSlider1 = {
    element: document.getElementById('backgroundSlider1'),
    container: document.getElementById('slidesContainer1'),
    currentSlide: 0,
    slides: [],
    interval: null,
    
    images: [
        'https://rkpanel.ru/assets/Uploads/IMG_7148.JPG',
        'https://rkpanel.ru/assets/Uploads/Avtomojka-s-oknami.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_2562.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_1086.JPG',
        'https://rkpanel.ru/assets/Uploads/IMG_1677.JPG',
        'https://i.ibb.co/YYynp0T/9-Picsart-Ai-Image-Enhancer-Picsart-Ai-Image-Enhancer.png',
        'https://i.ibb.co/0RqgPwzR/7-Picsart-Ai-Image-Enhancer-1.png',
        'https://i.ibb.co/gLRJy9Zn/4-Picsart-Ai-Image-Enhancer.png',
        'https://i.ibb.co/C52hxSv8/3-Picsart-Ai-Image-Enhancer.png',
        'https://i.ibb.co/MxdKt9P0/Picsart-Ai-Image-Enhancer.png',
        'https://i.ibb.co/2wT4CDC/Whats-App-Image-2025-06-11-at-17-42-30-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/QvLFV4y4/Whats-App-Image-2025-06-11-at-17-42-30-1-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/fGQ5r0G3/Whats-App-Image-2025-06-11-at-17-43-59-3-Picsart-Ai-Image-Enhancer-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/VpjWW6NS/Whats-App-Image-2025-06-11-at-17-43-59-2-Picsart-Ai-Image-Enhancer-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/xtvVRv3d/Whats-App-Image-2025-06-11-at-17-41-15-Picsart-Ai-Image-Enhancer-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/9LwHhBs/Whats-App-Image-2025-06-11-at-17-27-20-Picsart-Ai-Image-Enhancer-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/3KK2M6M/Whats-App-Image-2025-05-14-at-16-19-34-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/m5d1hW71/Whats-App-Image-2025-05-14-at-16-19-33-1-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/QvN68sWp/Whats-App-Image-2025-05-14-at-16-19-27-2-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/mVY8DGft/image-10-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/Lz5f7LLH/04041fcd-c301-4cda-9538-000b883c6361-Picsart-Ai-Image-Enhancer-1.jpg',
        'https://i.ibb.co/xWrQZhv/1773ea8c-6fa4-4826-843f-0bc1388f743b-1-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/rrHd8q6/822ff959-0bf8-409c-9ab2-9d4ac3bce15a-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/0pGyXRDh/303ce3c5-8495-4baa-a4bb-0d50cc74c09a-Picsart-Ai-Image-Enhancer.jpg',
        'https://i.ibb.co/KjcHnyvP/37baad90-5c36-4235-87d7-7f506fa563f5-Picsart-Ai-Image-Enhancer.jpg'
    ],
    
    init() {
        if (this.container) {
            this.createSlides();
            this.startSlideshow();
            console.log(`✅ BackgroundSlider1 инициализирован - ${this.images.length} фото строительства`);
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
        console.log(`🔄 Строительство слайд ${this.currentSlide + 1} из ${this.slides.length}`);
    },
    
    changeSpeed(intervalMs) {
        this.stopSlideshow();
        this.interval = setInterval(() => {
            this.nextSlide();
        }, intervalMs);
        console.log(`⚡ Скорость слайдера строительства изменена на ${intervalMs}ms`);
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
        console.log('✅ HeroTitleMain1 (ВОЗВЕДЕНИЕ МОДУЛЬНЫХ ЗДАНИЙ ПОД КЛЮЧ) инициализирован');
        return this;
    },

    setText(text) {
        if (this.textElement) {
            this.textElement.textContent = text;
            console.log(`📝 Заголовок строительства: "${text}"`);
        }
    },

    setPosition(top, left = 0) {
        if (this.element) {
            this.element.style.top = top + 'px';
            this.element.style.left = left + 'px';
            console.log(`📍 Позиция главного заголовка строительства: top=${top}px, left=${left}px`);
        }
    },

    setWidth(rightPadding) {
        if (this.element) {
            this.element.style.padding = `8px ${rightPadding}px 8px 45px`;
            console.log(`📏 Ширина главного заголовка строительства изменена: rightPadding=${rightPadding}px`);
        }
    },

    setFontSize(fontSize) {
        if (this.textElement) {
            this.textElement.style.fontSize = fontSize + 'px';
            console.log(`🔤 Размер шрифта главного заголовка строительства: ${fontSize}px`);
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
        console.log('✅ HeroTitleSub1 (СРОК СТРОИТЕЛЬСТВА ДО 6 МЕСЯЦЕВ) инициализирован');
        return this;
    },

    setText(text) {
        if (this.textElement) {
            this.textElement.textContent = text;
            console.log(`📝 Текст подзаголовка строительства: "${text}"`);
        }
    },

    setPosition(top, left = 0) {
        if (this.element) {
            this.element.style.top = top + 'px';
            this.element.style.left = left + 'px';
            console.log(`📍 Позиция подзаголовка строительства: top=${top}px, left=${left}px`);
        }
    },

    setWidth(rightPadding) {
        if (this.element) {
            this.element.style.padding = `8px ${rightPadding}px 8px 45px`;
            console.log(`📏 Ширина подзаголовка строительства изменена: rightPadding=${rightPadding}px`);
        }
    },

    setFontSize(fontSize) {
        if (this.textElement) {
            this.textElement.style.fontSize = fontSize + 'px';
            console.log(`🔤 Размер шрифта подзаголовка строительства: ${fontSize}px`);
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

/* ===== МОДУЛЬ 4: ПРЕИМУЩЕСТВА СТРОИТЕЛЬСТВА (БЕЗ ИКОНОК) ===== */
const AdvantagesBlock1 = {
    element: document.getElementById('advantagesBlock1'),
    
    advantages: [
        {
            text: 'ПРИСЫЛАЙТЕ ВАШУ СМЕТУ - СДЕЛАЕМ ДЕШЕВЛЕ'
        },
        {
            text: 'СРОК СТРОИТЕЛЬСТВА - НЕ БОЛЕЕ 6 МЕСЯЦЕВ'
        },
        {
            text: 'ГАРАНТИЯ НА ВСЕ РАБОТЫ'
        }
    ],
    
    init() {
        if (this.element) {
            this.createAdvantages();
            console.log('✅ AdvantagesBlock1 (ПРЕИМУЩЕСТВА СТРОИТЕЛЬСТВА) инициализирован');
        }
        return this;
    },

    setPosition(bottom, left = 0) {
        if (this.element) {
            this.element.style.bottom = bottom + 'px';
            this.element.style.left = left + 'px';
            console.log(`📍 Позиция блока преимуществ строительства: bottom=${bottom}px, left=${left}px`);
        }
    },

    setWidth(width) {
        if (this.element) {
            this.element.style.width = width + 'px';
            console.log(`📏 Ширина блока преимуществ строительства: ${width}px`);
        }
    },

    setTextAlignment(leftPadding) {
        const items = this.element?.querySelectorAll('.advantage-item1');
        items?.forEach(item => {
            item.style.paddingLeft = leftPadding + 'px';
        });
        console.log(`🎯 Выравнивание текста строительства: leftPadding=${leftPadding}px`);
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

/* ===== МОДУЛЬ 5: КНОПКА СТРОИТЕЛЬСТВА (МНОГОРАЗОВОЕ НАЖАТИЕ) ===== */
const ActionButton1 = {
    element: document.getElementById('actionButton1'),
    
    init() {
        if (this.element) {
            this.setupEventListeners();
            this.setupAnimations();
            console.log('✅ ActionButton1 (УЗНАТЬ СТОИМОСТЬ СТРОИТЕЛЬСТВА) инициализирован');
        }
        return this;
    },

    setText(text) {
        if (this.element) {
            this.element.innerHTML = text;
            console.log(`📝 Текст кнопки строительства изменен: "${text}"`);
        }
    },

    setFontWeight(weight) {
        if (this.element) {
            this.element.style.fontWeight = weight;
            console.log(`🔤 Жирность шрифта кнопки строительства: ${weight}`);
        }
    },

    setFontSize(fontSize) {
        if (this.element) {
            this.element.style.fontSize = fontSize + 'px';
            console.log(`📏 Размер шрифта кнопки строительства: ${fontSize}px`);
        }
    },

    setPosition(bottom, right) {
        const buttonBlock = this.element?.parentElement;
        if (buttonBlock) {
            buttonBlock.style.bottom = bottom + 'px';
            buttonBlock.style.right = right + 'px';
            console.log(`📍 Позиция кнопки строительства: bottom=${bottom}px, right=${right}px`);
        }
    },

    setupEventListeners() {
        if (this.element) {
            this.element.addEventListener('click', () => {
                openContactPopup1();
                console.log('🏗️ Кнопка строительства нажата - открываем popup');
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
        console.log('✅ ContactPopup1 (ЗАКАЗ СТРОИТЕЛЬСТВА) инициализирован');
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
            console.log('📱 Popup строительства показан, скролл заблокирован');
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
            
            console.log('❌ Popup строительства скрыт, скролл разблокирован');
        }
    }
};

/* ===== МОДУЛЬ 7: ПРОЦЕСС СТРОИТЕЛЬСТВА (АВТОНОМНЫЙ) ===== */
const ProcessSteps1 = {
    container: document.getElementById('processStepsContainer1'),
    steps: [],
    
    init() {
        this.steps = document.querySelectorAll('.process-step1');
        this.showAllStepsImmediately();
        console.log('✅ ProcessSteps1 (ЭТАПЫ СТРОИТЕЛЬСТВА) инициализирован');
        return this;
    },

    showAllStepsImmediately() {
        this.steps.forEach((step, index) => {
            if (step) {
                step.style.animationPlayState = 'running';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
                
                console.log(`👁️ Этап строительства ${index + 1} показан`);
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
            
            console.log(`📝 Обновлен этап строительства ${stepNumber}: "${title}"`);
        }
    },

    setContainerStyle(maxWidth) {
        if (this.container) {
            this.container.style.maxWidth = maxWidth + 'px';
            console.log(`📏 Ширина контейнера процесса строительства: ${maxWidth}px`);
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
    console.log('🚀 Slider-STR: Запускаю новую архитектуру');

    // Инициализируем модули в правильном порядке
    SliderStrReadyReporter.init();
    SliderStrPreloader.init();
});

// ===== ОТЛАДОЧНЫЕ ФУНКЦИИ =====
function getSliderStrStatus() {
    console.log('📊 СТАТУС Slider-STR новой архитектуры:');
    console.log('  ReadyReporter:', SliderStrReadyReporter.isReported ? 'ГОТОВ' : 'ЖДЕТ');
    console.log('  LSAMBase:', window.LSAMBase ? window.LSAMBase.getStats() : 'НЕ ГОТОВ');
}

console.log('✅ Slider-STR: Новая архитектура запущена');
