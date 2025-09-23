// ===== КОНТАКТНАЯ СТРАНИЦА - JavaScript =====

// Конфигурация
const CONTACT_CONFIG = {
    phoneNumber: '+79216288511',
    emailAddress: 'sale@rkpanel.ru',
    whatsappUrl: 'https://wa.me/79216288511',
    telegramUrl: 'https://t.me/779216288511'
};

// Основной класс управления контактной страницей
class ContactPageManager {
    constructor() {
        this.isInitialized = false;
        this.elements = {};
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.getElements();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('ContactPageManager: Инициализация завершена');
    }

    getElements() {
        this.elements = {
            // Мессенджеры
            whatsappBtn: document.getElementById('contactWhatsAppBtn'),
            telegramBtn: document.getElementById('contactTelegramBtn'),
            
            // Контактные ссылки
            phoneLink: document.getElementById('contactPhoneLink'),
            emailLink: document.getElementById('contactEmailLink')
        };
    }

    bindEvents() {
        // Мессенджеры
        if (this.elements.whatsappBtn) {
            this.elements.whatsappBtn.addEventListener('click', (e) => {
                this.handleMessengerClick(e, 'whatsapp');
            });
        }

        if (this.elements.telegramBtn) {
            this.elements.telegramBtn.addEventListener('click', (e) => {
                this.handleMessengerClick(e, 'telegram');
            });
        }

        // Контактные ссылки
        if (this.elements.phoneLink) {
            this.elements.phoneLink.addEventListener('click', (e) => {
                this.handlePhoneClick(e);
            });
        }

        if (this.elements.emailLink) {
            this.elements.emailLink.addEventListener('click', (e) => {
                this.handleEmailClick(e);
            });
        }

        // Копирование при двойном клике
        this.setupCopyHandlers();
    }

    handleMessengerClick(event, messengerType) {
        // Аналитика
        this.trackEvent('messenger_click', {
            messenger: messengerType,
            url: event.currentTarget.href
        });
        
        console.log(`ContactPageManager: Клик по ${messengerType}`);
    }

    handlePhoneClick(event) {
        // Аналитика
        this.trackEvent('phone_click', {
            phone: CONTACT_CONFIG.phoneNumber
        });
        
        console.log('ContactPageManager: Клик по телефону');
    }

    handleEmailClick(event) {
        // Аналитика
        this.trackEvent('email_click', {
            email: CONTACT_CONFIG.emailAddress
        });
        
        console.log('ContactPageManager: Клик по email');
    }

    setupCopyHandlers() {
        // Копирование email при двойном клике
        if (this.elements.emailLink) {
            this.elements.emailLink.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.copyToClipboard(CONTACT_CONFIG.emailAddress, 'Email скопирован!');
            });
        }
        
        // Копирование телефона при двойном клике
        if (this.elements.phoneLink) {
            this.elements.phoneLink.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.copyToClipboard(CONTACT_CONFIG.phoneNumber, 'Телефон скопирован!');
            });
        }
    }

    copyToClipboard(text, successMessage = 'Скопировано!') {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification(successMessage);
            }).catch(() => {
                this.fallbackCopyToClipboard(text, successMessage);
            });
        } else {
            this.fallbackCopyToClipboard(text, successMessage);
        }
    }

    fallbackCopyToClipboard(text, successMessage) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification(successMessage);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
        
        document.body.removeChild(textArea);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: var(--contact-primary-color);
            color: white;
            padding: 16px 24px;
            font-family: 'Montserrat', Arial, sans-serif;
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    trackEvent(eventName, data) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'contact_page',
                ...data
            });
        }
        
        // Yandex Metrika
        if (typeof ym !== 'undefined') {
            ym(48298379, 'reachGoal', eventName, data);
        }
        
        console.log('ContactPageManager: Событие отслежено:', eventName, data);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    const contactManager = new ContactPageManager();
    window.ContactPageManager = contactManager;
    console.log('Контактная страница загружена');
});

// Экспорт для модульных систем
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContactPageManager, CONTACT_CONFIG };
}
