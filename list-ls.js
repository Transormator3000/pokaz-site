// ЗАГЛУШКА - просто регистрируемся как обычный компонент
console.log('🔒 ЗАГЛУШКА: Регистрируюсь в LSAMBase');

// Регистрируемся в WAIT шлюзе
window.LSAMBase.sendToWait('list-ls');

// Сразу отчитываемся как готовые (у заглушки нет preloader'а)
window.LSAMBase.sendToReady('list-ls');

console.log('✅ ЗАГЛУШКА: Готова! Теперь ждем остальные компоненты');
