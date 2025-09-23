// ===== ОЧИСТКА LOCALSTORAGE В САМОМ НАЧАЛЕ =====
console.log('🧹 ОЧИСТКА localStorage В НАЧАЛЕ welcome.js');

if (!sessionStorage.getItem('page_loader_cleared')) {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('page_loading_')) {
            localStorage.removeItem(key);
        }
    });
    sessionStorage.setItem('page_loader_cleared', 'true');
    console.log('✅ localStorage очищен ДО загрузки компонентов');
} else {
    console.log('🔄 localStorage УЖЕ очищен в этой сессии');
}

/**
 * Page Loading API (localStorage версия)
 */
window.PageLoader = {
    _prefix: 'page_loading_',

    markReady(componentName) {
        localStorage.setItem(`${this._prefix}ready_${componentName}`, 'true');
        console.log(`✓ Component '${componentName}' ready`);
    },

    isReady(componentName) {
        return localStorage.getItem(`${this._prefix}ready_${componentName}`) === 'true';
    },

    isPageComplete() {
        return localStorage.getItem(`${this._prefix}complete`) === 'true';
    },

    onPageReady(callback) {
        if (this.isPageComplete()) {
            callback();
        } else {
            window.addEventListener('pageLoadComplete', callback);
        }
    },

    _setComplete() {
        localStorage.setItem(`${this._prefix}complete`, 'true');
    },

    _clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this._prefix)) {
                localStorage.removeItem(key);
            }
        });
        console.log('🧹 localStorage очищен');
    }
};

/* ===== WELCOME SCREEN + МГНОВЕННЫЙ ПОКАЗ КОНТЕНТА ===== */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 WELCOME SCREEN + КОНТЕНТ: Запуск');
    
    const startupPage = document.getElementById('startupPage');
    const welcomeText = document.querySelector('.startup-welcome');
    const loadingText = document.querySelector('.startup-loading');
    const loadingSpinner = document.querySelector('.loading-spinner');
    
    // КОНТЕНТНЫЕ БЛОКИ
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
    
    // Проверяем час посещения
    const now = Date.now();
    const lastVisit = localStorage.getItem('last_visit_timestamp');
    const oneHour = 60 * 60 * 1000;
    const isNewVisit = !lastVisit || (now - parseInt(lastVisit)) >= oneHour;
    
    if (isNewVisit) {
        // НОВОЕ ПОСЕЩЕНИЕ - с задержкой
        welcomeText.style.display = 'block';
        loadingText.style.display = 'none';
        loadingSpinner.style.display = 'none';
        localStorage.setItem('last_visit_timestamp', now.toString());
        console.log('👋 Показываю ДОБРО ПОЖАЛОВАТЬ (с задержкой)');
        
        // Через 1 секунду переключаем на загрузку
        setTimeout(() => {
            if (welcomeScreenActive) {
                welcomeText.style.display = 'none';
                loadingText.style.display = 'block';
                loadingSpinner.style.display = 'block';
                console.log('🔄 Переключаю на ЗАГРУЗКА');
                
                startMonitoring();
            }
        }, 1000);
        
    } else {
        // ПОВТОРНОЕ ПОСЕЩЕНИЕ - сразу без задержки
        welcomeText.style.display = 'none';
        loadingText.style.display = 'block';
        loadingSpinner.style.display = 'block';
        console.log('⏳ Показываю ЗАГРУЗКА (сразу без задержки)');
        
        startMonitoring();
    }
    
    // ФУНКЦИЯ МГНОВЕННОГО ПОКАЗА КОНТЕНТА
    function showContentInstantly() {
        console.log('⚡ МГНОВЕННЫЙ показ контента!');
        
        // Сразу запускаем фоновую загрузку фотографий
        if (typeof startPhotoLazyLoading === 'function') {
            startPhotoLazyLoading();
        }
        
        // ПЛАВНОЕ ПОСЛЕДОВАТЕЛЬНОЕ ПОЯВЛЕНИЕ
        contentBlocks.forEach((block, index) => {
            if (block) {
                // Подготавливаем блок
                block.style.opacity = '0';
                block.style.transform = 'translateY(20px)';
                block.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                
                // Показываем с задержкой
                setTimeout(() => {
                    block.classList.add('content-visible');
                    block.style.opacity = '1';
                    block.style.transform = 'translateY(0)';
                }, index * 100); // Быстрые интервалы 100ms
            }
        });
        
        console.log('🎯 Все блоки показываются последовательно!');
    }
    
    // Клик для пропуска
    startupPage.addEventListener('click', () => {
        hideWelcomeScreen();
    });
    
    function hideWelcomeScreen() {
        if (!welcomeScreenActive) return;
        
        welcomeScreenActive = false;
        startupPage.classList.add('hide');
        
        setTimeout(() => {
            startupPage.style.display = 'none';
        }, 1000);
        
        console.log('💨 Welcome screen скрыт');
    }
    
    /* ===== МОНИТОРИНГ + ПОКАЗ КОНТЕНТА ===== */
    function startMonitoring() {
        console.log('🔍 Начинаю мониторинг localStorage');
        
        let checkInterval = setInterval(function() {
            const headerReady = window.PageLoader.isReady('header');
            const sliderReady = window.PageLoader.isReady('slider');
            
            console.log(`📊 Проверка localStorage: header=${headerReady}, slider=${sliderReady}`);
            
            // МОМЕНТ X - оба компонента готовы
            if (headerReady && sliderReady) {
                console.log('✨ МОМЕНТ X! Все готово');
                
                clearInterval(checkInterval);
                window.PageLoader._setComplete();
                
                // СРАЗУ показываем контент
                showContentInstantly();
                
                // Скрываем welcome screen
                hideWelcomeScreen();
                
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('pageLoadComplete'));
                    document.body.classList.add('animations-enabled');
                    console.log('🎬 Анимации запущены');
                }, 100);
            }
        }, 100);
        
        window.currentCheckInterval = checkInterval;
    }
    
    // Тестовые функции
    window.testMomentX = function() {
        console.log('🧪 ТЕСТ: Принудительный момент X');
        if (window.currentCheckInterval) {
            clearInterval(window.currentCheckInterval);
        }
        window.PageLoader._setComplete();
        showContentInstantly();
        hideWelcomeScreen();
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('pageLoadComplete'));
            document.body.classList.add('animations-enabled');
        }, 100);
    };
    
    window.checkStatus = function() {
        console.log('📊 СТАТУС localStorage:');
        console.log('  header:', window.PageLoader.isReady('header'));
        console.log('  slider:', window.PageLoader.isReady('slider'));
        console.log('  complete:', window.PageLoader.isPageComplete());
        
        const keys = Object.keys(localStorage).filter(key => key.startsWith('page_loading_'));
        console.log('  ключи:', keys);
    };
    
    console.log('✅ WELCOME SCREEN + КОНТЕНТ: Готов');
    console.log('🧪 Доступно: window.testMomentX(), window.checkStatus()');
});

// === YANDEX.METRIKA COUNTER ===
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

// === ФУНКЦИИ ДЛЯ POPUP ===
function closeContactPopup() {
    const popup = document.getElementById('contactPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

function openPartnerLink(url) {
    window.open(url, '_blank');
}

console.log('🚀 СИСТЕМА ЗАПУЩЕНА (localStorage + мгновенный контент)');
