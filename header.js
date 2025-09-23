// ===== МОДУЛЬ 1: АВТОНОМНАЯ РЕГИСТРАЦИЯ =====
(function() {
    // УЗНАЕМ СВОЕ ИМЯ
    const scriptSrc = document.currentScript ? document.currentScript.src : '';
    const scriptName = scriptSrc.split('/').pop().replace('.js', '') || 'header';
    
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
    window.HEADER_SCRIPT_NAME = scriptName;
    
    console.log(`🏷️ МОДУЛЬ 1: ${scriptName} зарегистрирован в WAIT шлюзе`);
})();

// ===== МОДУЛЬ 2: READY ОТПРАВЩИК =====
const ReadyReporter = {
    scriptName: window.HEADER_SCRIPT_NAME,
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
const HeaderPreloader = {
    scriptName: window.HEADER_SCRIPT_NAME,
    
    init() {
        console.log(`🔄 МОДУЛЬ 3: ${this.scriptName} preloader запущен`);
        
        // Инициализируем все компоненты header'а
        this.initializeHeaderComponents(() => {
            // По завершении сигналим модулю 2
            this.signalComplete();
        });
    },
    
    initializeHeaderComponents(callback) {
        // Инициализация всех модулей header'а
        CSSController.init();
        backgroundBlock.init();
        gridContainer.init();
        logoBlock.init();
        companyNameBlock.init();
        phoneBlock.init();
        desktopNavigationBlock.init();
        mobileNavigationBlock.init();
        
        // Запускаем загрузку изображений
        photosStripBlock.init();
        AnimationController.init();
        
        console.log('✅ Header: Все компоненты инициализированы');
        
        // Callback вызовется когда изображения загрузятся
        this.imageLoadCallback = callback;
    },
    
    signalComplete() {
        console.log(`📤 МОДУЛЬ 3: ${this.scriptName} завершен, сигналю модулю 2`);
        
        // Отправляем событие модулю 2
        window.dispatchEvent(new CustomEvent(`${this.scriptName}_preload_complete`));
    }
};

// ===== БЛОК ФОНА =====
const backgroundBlock = {
    element: document.getElementById('backgroundBlock'),
    init() { 
        console.log('Блок фона инициализирован'); 
    }
};

// ===== КОНТЕЙНЕР СЕТКИ =====
const gridContainer = {
    element: document.getElementById('gridContainer'),
    init() { 
        console.log('Контейнер сетки инициализирован'); 
    }
};

// ===== МОДУЛЬ УПРАВЛЕНИЯ CSS =====
const CSSController = {
    basePhotoWidth: 450,

    init() {
        this.injectStyles();
    },

    injectStyles() {
        if (!document.getElementById('header-photo-styles')) {
            const styles = document.createElement('style');
            styles.id = 'header-photo-styles';
            styles.textContent = `
                .photo-item {
                    flex-shrink: 0;
                    height: 100%;
                    width: ${this.basePhotoWidth}px !important;
                    position: relative;
                    overflow: hidden;
                    clip-path: polygon(45px 0, 100% 0, calc(100% - 45px) 100%, 0 100%);
                    margin-right: -45px;
                }

                .photo-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                @media (max-width: 1179px) {
                    .photo-item {
                        width: ${Math.round(this.basePhotoWidth * 0.72)}px !important;
                        clip-path: polygon(30px 0, 100% 0, calc(100% - 30px) 100%, 0 100%);
                        margin-right: -30px;
                    }
                }

                @media (max-width: 480px) {
                    .photo-item {
                        width: ${Math.round(this.basePhotoWidth * 0.52)}px !important;
                        clip-path: polygon(22px 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
                        margin-right: -22px;
                    }
                }
            `;
            document.head.appendChild(styles);
            console.log(`🎨 CSSController: Стили созданы`);
        }
    },

    getCurrentPhotoWidth() {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        
        if (viewportWidth <= 480) {
            return Math.round(this.basePhotoWidth * 0.52);
        } else if (viewportWidth <= 1179) {
            return Math.round(this.basePhotoWidth * 0.72);
        } else {
            return this.basePhotoWidth;
        }
    }
};

// ===== ПРИОРИТЕТНЫЙ ЗАГРУЗЧИК ИЗОБРАЖЕНИЙ =====
const PriorityImageLoader = {
    requiredImages: 0,
    totalImages: 0,
    priorityPhotos: [],
    backgroundPhotos: [],
    loadedPriority: 0,
    loadedBackground: 0,
    isLoadingBackground: false,
    hasReported: false,
    timeouts: new Map(),

    init(allPhotos) {
        this.totalImages = allPhotos.length;
        
        // ЕСЛИ МАССИВ ПУСТОЙ - СРАЗУ ОТЧИТЫВАЕМСЯ
        if (this.totalImages === 0) {
            console.log('⚠️ PriorityLoader: Массив изображений ПУСТОЙ - отчитываюсь сразу!');
            this.onPriorityComplete();
            return;
        }
        
        this.calculateRequiredImages();
        
        // ПРАВИЛЬНАЯ ЛОГИКА: берем минимум из (нужно для viewport, есть в массиве)
        const priorityCount = Math.min(this.requiredImages, this.totalImages);
        
        this.priorityPhotos = allPhotos.slice(0, priorityCount);
        this.backgroundPhotos = allPhotos.slice(priorityCount);
        
        console.log(`📊 PriorityLoader: Нужно для viewport: ${this.requiredImages}, Есть в массиве: ${this.totalImages}`);
        console.log(`🎯 PriorityLoader: Priority ${this.priorityPhotos.length}, Background ${this.backgroundPhotos.length}`);
        
        this.createAllPhotoElements(allPhotos);
        this.startPriorityLoading();
    },

    calculateRequiredImages() {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const currentPhotoWidth = CSSController.getCurrentPhotoWidth();
        
        this.requiredImages = Math.floor(viewportWidth / currentPhotoWidth) + 1;
        
        console.log(`📊 PriorityLoader: Нужно ${this.requiredImages} картинок для viewport ${viewportWidth}px`);
    },

    createAllPhotoElements(allPhotos) {
        const slider = document.getElementById('photosSlider');
        if (!slider) return;

        allPhotos.forEach((photoSrc, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="450" height="280"%3E%3Crect width="100%25" height="100%25" fill="%23333"%3E%3C/rect%3E%3C/svg%3E';
            img.alt = `Фото проекта ${index + 1}`;
            img.dataset.realSrc = photoSrc;
            img.dataset.imageIndex = index;
            
            photoItem.appendChild(img);
            slider.appendChild(photoItem);
        });
        
        console.log(`🖼️ PriorityLoader: Создано ${allPhotos.length} элементов`);
    },

    startPriorityLoading() {
        console.log(`⚡ PriorityLoader: Загружаю ${this.priorityPhotos.length} ПРИОРИТЕТНЫХ изображений`);
        
        this.priorityPhotos.forEach((photoSrc, index) => {
            this.loadSingleImage(photoSrc, index, true);
        });
    },

    loadSingleImage(photoSrc, index, isPriority = false) {
        const img = new Image();
        
        // ТАЙМАУТ НА ЗАГРУЗКУ - 5 СЕКУНД
        const timeoutKey = `${isPriority ? 'P' : 'B'}_${index}`;
        const timeout = setTimeout(() => {
            console.warn(`⏰ ${isPriority ? 'Priority' : 'Background'} image ${index + 1} TIMEOUT (5s) - считаю загруженным!`);
            this.handleImageComplete(index, isPriority, false);
        }, 5000);
        
        this.timeouts.set(timeoutKey, timeout);
        
        img.onload = () => {
            console.log(`✅ ${isPriority ? 'Priority' : 'Background'} image ${index + 1} загружено успешно`);
            clearTimeout(this.timeouts.get(timeoutKey));
            this.timeouts.delete(timeoutKey);
            
            const domImg = document.querySelector(`img[data-image-index="${index}"]`);
            if (domImg) {
                domImg.src = photoSrc;
            }
            
            this.handleImageComplete(index, isPriority, true);
        };

        img.onerror = () => {
            console.warn(`❌ ${isPriority ? 'Priority' : 'Background'} image ${index + 1} failed to load`);
            clearTimeout(this.timeouts.get(timeoutKey));
            this.timeouts.delete(timeoutKey);
            
            const domImg = document.querySelector(`img[data-image-index="${index}"]`);
            if (domImg) {
                domImg.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="450" height="280"%3E%3Crect width="100%25" height="100%25" fill="%23222" rx="12"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23888" font-size="16"%3EФото недоступно%3C/text%3E%3C/svg%3E';
            }
            
            this.handleImageComplete(index, isPriority, false);
        };

        img.src = photoSrc;
    },

    handleImageComplete(index, isPriority, success) {
        if (isPriority) {
            this.loadedPriority++;
            console.log(`📷 Priority image ${index + 1}/${this.priorityPhotos.length} ${success ? 'loaded' : 'failed'}`);
            
            if (this.loadedPriority === this.priorityPhotos.length) {
                this.onPriorityComplete();
            }
        } else {
            this.loadedBackground++;
            console.log(`📷 Background image ${index + 1} ${success ? 'loaded' : 'failed'}`);
        }
    },

    onPriorityComplete() {
        if (this.hasReported) return;
        
        this.hasReported = true;
        console.log(`✅ PriorityLoader: ВСЕ ПРИОРИТЕТНЫЕ ЗАГРУЖЕНЫ! (${this.loadedPriority}/${this.priorityPhotos.length})`);
        
        if (this.priorityPhotos.length < this.requiredImages) {
            console.log(`ℹ️ PriorityLoader: Загружено меньше оптимального (${this.priorityPhotos.length} из ${this.requiredImages}) - в массиве не хватает картинок`);
        }
        
        // Сигналим preloader'у о завершении
        HeaderPreloader.signalComplete();
        
        this.startBackgroundLoading();
    },

    startBackgroundLoading() {
        if (this.backgroundPhotos.length === 0) {
            console.log('🔄 PriorityLoader: Фоновых изображений нет');
            return;
        }
        
        console.log(`🔄 PriorityLoader: Начинаю фоновую загрузку ${this.backgroundPhotos.length} изображений`);
        this.isLoadingBackground = true;
        
        this.loadBackgroundSequentially(0);
    },

    loadBackgroundSequentially(bgIndex) {
        if (bgIndex >= this.backgroundPhotos.length) {
            this.isLoadingBackground = false;
            console.log('✅ PriorityLoader: Фоновая загрузка завершена');
            return;
        }

        const photoSrc = this.backgroundPhotos[bgIndex];
        const realIndex = this.priorityPhotos.length + bgIndex;
        
        this.loadSingleImage(photoSrc, realIndex, false);
        
        setTimeout(() => {
            this.loadBackgroundSequentially(bgIndex + 1);
        }, 300);
    },

    getStatus() {
        return {
            totalImages: this.totalImages,
            required: this.requiredImages,
            priorityLoaded: this.loadedPriority,
            backgroundLoaded: this.loadedBackground,
            isLoadingBackground: this.isLoadingBackground,
            hasReported: this.hasReported,
            priorityPhotosCount: this.priorityPhotos.length,
            backgroundPhotosCount: this.backgroundPhotos.length
        };
    }
};

// ===== КОНТРОЛЛЕР АНИМАЦИЙ =====
const AnimationController = {
    isActive: false,

    init() {
        console.log('🎬 AnimationController: Ждем момент X');
        
        // ТОЛЬКО слушаем событие pageLoadComplete
        window.addEventListener('pageLoadComplete', () => {
            this.startAllAnimations();
        });
    },

    startAllAnimations() {
        if (this.isActive) return;
        
        this.isActive = true;
        console.log('🚀 AnimationController: МОМЕНТ X! Запускаю анимации');
        
        photosStripBlock.startInfiniteScroll();
        this.animateHeaderElements();
    },

    animateHeaderElements() {
        const elementsToAnimate = [
            photosStripBlock.element,
            logoBlock.element,
            companyNameBlock.element,
            phoneBlock.element,
            desktopNavigationBlock.element
        ].filter(el => el);
        
        elementsToAnimate.forEach((element, index) => {
            if (element) {
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
        
        console.log('🎬 Header elements анимированы');
    }
};

const photosStripBlock = {
    element: document.getElementById('photosStripBlock'),
    slider: document.getElementById('photosSlider'), 
    overlay: document.getElementById('photosOverlay'),
    photos: [

    ],

    currentOffset: 0,
    photoMargin: 20,
    isAnimating: false,
    totalWidth: 0,
    scrollSpeed: 1,

    init() {
        if (this.element && this.slider) {
            this.calculateTotalWidth();
            this.startSmartLoading();
        }
        console.log('Блок бесшовной строки инициализирован');
    },

    calculateTotalWidth() {
        const currentPhotoWidth = CSSController.getCurrentPhotoWidth();
        this.totalWidth = (currentPhotoWidth + this.photoMargin) * this.photos.length;
        console.log(`📐 photosStripBlock: Общая ширина ${this.totalWidth}px`);
    },

    startSmartLoading() {
        console.log('🎯 photosStripBlock: Запускаю приоритетную загрузку');
        PriorityImageLoader.init(this.photos);
    },

    startInfiniteScroll() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        console.log('🎬 photosStripBlock: Запускаю бесконечную прокрутку');
        
        const animate = () => {
            if (!this.isAnimating) return;
            
            this.currentOffset -= this.scrollSpeed;
            
            if (Math.abs(this.currentOffset) >= this.totalWidth) {
                this.currentOffset = 0;
            }
            
            this.slider.style.transform = `translateX(${this.currentOffset}px)`;
            requestAnimationFrame(animate);
        };
        
        animate();
    },

    changeOverlayOpacity(opacity) {
        if (this.overlay) {
            this.overlay.style.background = `rgba(0, 0, 0, ${opacity})`;
        }
    },

    pauseAnimation() {
        this.isAnimating = false;
        console.log('Анимация приостановлена');
    },

    resumeAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.startInfiniteScroll();
            console.log('Анимация возобновлена');
        }
    },

    changeSpeed(speedMultiplier = 1) {
        this.scrollSpeed = 1 * speedMultiplier;
        console.log(`Скорость изменена на: ${this.scrollSpeed}`);
    }
};

// ===== ОСТАЛЬНЫЕ МОДУЛИ =====
const logoBlock = { 
    element: document.getElementById('logoBlock'), 
    init() { 
        console.log('Блок логотипа инициализирован'); 
    } 
};

const companyNameBlock = { 
    element: document.getElementById('companyNameBlock'), 
    init() { 
        console.log('Блок названия компании инициализирован'); 
    } 
};

const phoneBlock = { 
    element: document.getElementById('phoneBlock'), 
    init() { 
        if (this.element) { 
            const link = this.element.querySelector('a'); 
            if (link) {
                link.addEventListener('click', (e) => {
                    console.log('Клик по телефону:', e.target.textContent);
                });
            }
        } 
        console.log('Блок телефона инициализирован'); 
    } 
};

const desktopNavigationBlock = {
    element: document.getElementById('desktopNavigationBlock'),
    
    init() {
        if (this.element) {
            this.setActivePageFromURL();
            
            const links = this.element.querySelectorAll('.desktop-menu-link');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    console.log('Десктопная навигация - переход на:', e.target.textContent, '→', e.target.href);
                });
            });
        }
        console.log('Десктопная навигация инициализирована');
    },
    
    setActivePageFromURL() {
        const currentPage = window.location.pathname.split('/').pop() || 'rkpanel_tester.html';
        const allLinks = this.element.querySelectorAll('.desktop-menu-link');
        
        allLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('data-page') || link.getAttribute('href');
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'rkpanel_tester.html') ||
                (currentPage === 'index.html' && linkPage === 'rkpanel_tester.html')) {
                link.classList.add('active');
                console.log(`Десктопная навигация - активная кнопка: ${link.textContent}`);
            }
        });
    }
};

// ===== АВТОНОМНОЕ МОБИЛЬНОЕ МЕНЮ =====
const mobileNavigationBlock = {
    element: document.getElementById('mobileNavigationBlock'),
    toggleButton: document.getElementById('mobileMenuToggle'),
    dropdown: document.getElementById('mobileMenuDropdown'),
    isOpen: false,
    
    init() {
        if (this.element && this.toggleButton && this.dropdown) {
            this.setupEventListeners();
            this.setActivePageFromURL();
            console.log('🍔 Мобильное меню готово к работе');
        }
    },
    
    setupEventListeners() {
        this.toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        const links = this.element.querySelectorAll('.mobile-menu-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('📱 Мобильная навигация - переход на:', e.target.textContent, '→', e.target.href);
                this.closeMenu();
            });
        });
        
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.element.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    },
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },
    
    openMenu() {
        this.toggleButton.classList.add('active');
        this.dropdown.classList.add('active');
        this.isOpen = true;
        console.log('📱 Мобильное меню ОТКРЫТО');
    },
    
    closeMenu() {
        this.toggleButton.classList.remove('active');
        this.dropdown.classList.remove('active');
        this.isOpen = false;
        console.log('❌ Мобильное меню ЗАКРЫТО');
    },
    
    setActivePageFromURL() {
        const currentPage = window.location.pathname.split('/').pop() || 'rkpanel_tester.html';
        const allLinks = this.element.querySelectorAll('.mobile-menu-link');
        
        allLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('data-page') || link.getAttribute('href');
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'rkpanel_tester.html') ||
                (currentPage === 'index.html' && linkPage === 'rkpanel_tester.html')) {
                link.classList.add('active');
                console.log(`Мобильная навигация - активная кнопка: ${link.textContent}`);
            }
        });
    }
};

// ===== ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ =====
console.log('🚀 Header: Запускаю новую архитектуру');

// Инициализируем модули в правильном порядке
ReadyReporter.init();
HeaderPreloader.init();

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
function changeOverlayOpacity(opacity) { 
    photosStripBlock.changeOverlayOpacity(opacity); 
}

function pausePhotos() {
    photosStripBlock.pauseAnimation();
}

function resumePhotos() {
    photosStripBlock.resumeAnimation();
}

function changePhotosSpeed(speed) {
    photosStripBlock.changeSpeed(speed);
}

function toggleMobileMenu() {
    mobileNavigationBlock.toggleMenu();
}

function getCurrentActivePage() {
    const desktopActive = document.querySelector('.desktop-menu-link.active');
    const mobileActive = document.querySelector('.mobile-menu-link.active');
    return (desktopActive || mobileActive)?.textContent || 'Не определена';
}

function getPhotosInfo() {
    return {
        total: photosStripBlock.photos.length,
        baseWidth: CSSController.basePhotoWidth,
        currentWidth: CSSController.getCurrentPhotoWidth(),
        totalWidth: photosStripBlock.totalWidth,
        animationActive: AnimationController.isActive,
        loadingStatus: PriorityImageLoader.getStatus()
    };
}

// ===== ОТЛАДОЧНЫЕ ФУНКЦИИ =====
function getHeaderStatus() {
    console.log('📊 СТАТУС Header новой архитектуры:');
    console.log('  ReadyReporter:', ReadyReporter.isReported ? 'ГОТОВ' : 'ЖДЕТ');
    console.log('  PriorityImageLoader:', PriorityImageLoader.getStatus());
    console.log('  LSAMBase:', window.LSAMBase ? window.LSAMBase.getStats() : 'НЕ ГОТОВ');
}

console.log('✅ Header: Новая архитектура запущена');
