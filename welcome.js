// ===== ОЧИСТКА СТАРЫХ ДАННЫХ =====
console.log('🧹 ОЧИСТКА localStorage В НАЧАЛЕ welcome.js');

Object.keys(localStorage).forEach(key => {
    if (key.startsWith('page_loading_')) {
        localStorage.removeItem(key);
    }
});

// ===== СОЗДАНИЕ ГЛОБАЛЬНОЙ БАЗЫ ШЛЮЗОВ (НОВАЯ АРХИТЕКТУРА) =====
if (!window.LSAMBase) {
    window.LSAMBase = {
        // ШЛЮЗЫ КАК МАССИВЫ ИМЕН
        waitGate: [],     // Массив имен зарегистрированных компонентов
        readyGate: [],    // Массив имен готовых компонентов
        
        // ОТПРАВКА В WAIT ШЛЮЗ (всегда работает)
        sendToWait(name) {
            if (!this.waitGate.includes(name)) {
                this.waitGate.push(name);
                console.log(`📝 WAIT шлюз: зарегистрирован ${name} (всего: ${this.waitGate.length})`);
            } else {
                console.log(`♻️ WAIT: ${name} уже зарегистрирован`);
            }
            return 'OK';
        },
        
        // ОТПРАВКА В READY ШЛЮЗ (всегда работает)
        sendToReady(name) {
            if (!this.readyGate.includes(name)) {
                this.readyGate.push(name);
                console.log(`✅ READY шлюз: готов ${name} (всего: ${this.readyGate.length})`);
            } else {
                console.log(`♻️ READY: ${name} уже отчитался`);
            }
            return 'OK';
        },
        
        // Получить статистику
        getStats() {
            return {
                waitCount: this.waitGate.length,
                readyCount: this.readyGate.length,
                waitGate: this.waitGate,
                readyGate: this.readyGate,
                hasStub: this.waitGate.includes('list-ls')
            };
        },
        
        // Проверка момента X (новая логика)
        checkMomentX() {
            const hasStub = this.waitGate.includes('list-ls');
            const allReady = this.waitGate.every(name => this.readyGate.includes(name));
            
            return hasStub && allReady && this.waitGate.length > 0;
        }
    };
    
    console.log('🏗️ LSAMBase (база шлюзов) создана');
    console.log('🎯 LSAMBase: Работаем с именами компонентов');
}

/**
 * Page Loading API через LSAMBase (УПРОЩЕННАЯ ВЕРСИЯ)
 */
window.PageLoader = {
    isComplete: false,

    // Мониторинг изменений в LSAMBase каждые 100ms
    startMonitoring() {
        setInterval(() => {
            this.checkMomentX();
        }, 100);
        
        console.log('🔍 Мониторинг LSAMBase запущен');
    },
    
    // Проверка момента X
    checkMomentX() {
        if (window.LSAMBase.checkMomentX() && !this.isComplete) {
            const stats = window.LSAMBase.getStats();
            console.log('🎯 МОМЕНТ X! Все компоненты готовы!');
            console.log(`📊 Компоненты: ${stats.waitGate.join(', ')}`);
            this.triggerMomentX();
        }
    },
    
    triggerMomentX() {
        this.isComplete = true;
        localStorage.setItem('page_loader_complete', 'true');
        console.log('🚀 MOMENT X TRIGGERED!');
        
        // Отправляем событие всем системам
        window.dispatchEvent(new CustomEvent('pageLoadComplete'));
        document.body.classList.add('animations-enabled');
        
        // Вызываем глобальные функции если они есть
        if (typeof window.showContentInstantly === 'function') {
            window.showContentInstantly();
        }
        
        if (typeof window.hideWelcomeScreen === 'function') {
            window.hideWelcomeScreen();
        }
        
        console.log('🎬 Анимации и контент запущены');
    },
    
    isPageComplete() {
        return this.isComplete;
    }
};

// ЗАПУСКАЕМ МОНИТОРИНГ СРАЗУ
window.PageLoader.startMonitoring();

/* ===== WELCOME SCREEN + КОНТЕНТ (без изменений) ===== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 WELCOME SCREEN: Инициализация');
    
    const startupPage = document.getElementById('startupPage');
    const welcomeText = document.querySelector('.startup-welcome');
    const loadingText = document.querySelector('.startup-loading');
    const loadingSpinner = document.querySelector('.loading-spinner');
    
    const contentBlocks = [
        document.getElementById('mainSite'),
        document.getElementById('sliderBlock'),
        document.getElementById('partnersBlock'),
        document.getElementById('servicesBlock'),
        document.getElementById('footerBlock')
    ];
    
    if (!startupPage) {
        console.error('❌ startupPage НЕ НАЙДЕН!');
        return;
    }
    
    let welcomeScreenActive = true;
    
    // УПРОЩЕННАЯ проверка первого входа
    const isFirstVisit = !sessionStorage.getItem('visited');
    
    if (isFirstVisit) {
        sessionStorage.setItem('visited', 'true');
        
        // ПЕРВЫЙ ВХОД - с приветствием
        welcomeText.style.display = 'block';
        loadingText.style.display = 'none';
        loadingSpinner.style.display = 'none';
        console.log('👋 ПЕРВЫЙ ВХОД - показываю ДОБРО ПОЖАЛОВАТЬ');
        
        // Через секунду переключаемся на загрузку
        setTimeout(() => {
            if (welcomeScreenActive) {
                welcomeText.style.display = 'none';
                loadingText.style.display = 'block';
                loadingSpinner.style.display = 'block';
                console.log('🔄 Переключаю на ЗАГРУЗКА');
            }
        }, 1000);
        
    } else {
        // ПОВТОРНЫЙ ВХОД - сразу загрузка
        if (startupPage) startupPage.classList.add('instant-show');
        welcomeText.style.display = 'none';
        loadingText.style.display = 'block';
        loadingSpinner.style.display = 'block';
        console.log('🔄 ПОВТОРНЫЙ ВХОД - сразу ЗАГРУЗКА');
    }
    
    // ГЛОБАЛЬНЫЕ ФУНКЦИИ для PageLoader (без изменений)
    window.showContentInstantly = function() {
        console.log('⚡ ПОКАЗЫВАЮ КОНТЕНТ!');
        
        if (typeof startPhotoLazyLoading === 'function') {
            startPhotoLazyLoading();
        }
        
        contentBlocks.forEach((block, index) => {
            if (block) {
                block.style.opacity = '0';
                block.style.transform = 'translateY(20px)';
                block.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                
                setTimeout(() => {
                    block.classList.add('content-visible');
                    block.style.opacity = '1';
                    block.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
        
        console.log('🎯 Контент показан последовательно!');
    };
    
    window.hideWelcomeScreen = function() {
        console.log('💨 СКРЫВАЮ WELCOME SCREEN!');
        
        if (!welcomeScreenActive) return;
        welcomeScreenActive = false;
        
        if (isFirstVisit) {
            startupPage.classList.add('hide');
            setTimeout(() => {
                startupPage.style.display = 'none';
            }, 1000);
        } else {
            startupPage.style.display = 'none';
        }
        
        console.log('✅ Welcome screen скрыт');
    };
    
    // Клик для пропуска
    if (startupPage) {
        startupPage.addEventListener('click', () => {
            window.hideWelcomeScreen();
        });
    }
    
    // ТЕСТОВЫЕ ФУНКЦИИ
    window.testMomentX = function() {
        console.log('🧪 ТЕСТ: Принудительный момент X');
        window.PageLoader.triggerMomentX();
    };
    
    window.checkStatus = function() {
        console.log('📊 СТАТУС LSAMBase системы:');
        const stats = window.LSAMBase.getStats();
        console.log('  WAIT компоненты:', stats.waitGate);
        console.log('  READY компоненты:', stats.readyGate);
        console.log('  Есть заглушка:', stats.hasStub);
        console.log('  Момент X готов:', window.LSAMBase.checkMomentX());
        console.log('  Система завершена:', window.PageLoader.isComplete);
        console.log('  Welcome активен:', welcomeScreenActive);
    };
    
    console.log('✅ WELCOME SCREEN: Полностью готов');
    console.log('🧪 Доступно: testMomentX(), checkStatus()');
});

// === ОСТАЛЬНЫЕ ФУНКЦИИ БЕЗ ИЗМЕНЕНИЙ ===
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t);
    a=e.getElementsByTagName(t)[0];
    k.async=1;
    k.src=r;
    a.parentNode.insertBefore(k,a);
})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(48298379, "init", {
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
});

function closeContactPopup() {
    const popup = document.getElementById('contactPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function openPartnerLink(url) {
    window.open(url, '_blank');
}

console.log('🚀 WELCOME LSAMBase СИСТЕМА ЗАПУЩЕНА');
