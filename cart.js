// Обработка кликов по карточкам
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.dataset.service;
            handleServiceClick(serviceType);
        });

        // Добавляем эффект нажатия
        card.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });

        card.addEventListener('mouseup', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// Функция обработки клика по услуге
function handleServiceClick(serviceType) {
    const serviceUrls = {
        'sandwich': 'rkpanel_sp.html',
        'metal': 'rkpanel_met.html',
        'building': 'rkpanel_str.html',
        'machinery': 'rkpanel_tec.html'
    };

    if (serviceUrls[serviceType]) {
        window.location.href = serviceUrls[serviceType];
    }
}
