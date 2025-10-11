/**
 * Скрипт для евангелизационного сайта
 * "Благая весть для тех, кто ищет Бога"
 */

(function() {
  'use strict';

  // ==========================================
  // СОХРАНЕНИЕ ВЫБРАННОЙ КАТЕГОРИИ
  // ==========================================
  
  /**
   * Сохраняет выбранную категорию в localStorage
   */
  function saveSelectedCategory(categoryId) {
    try {
      localStorage.setItem('selectedCategory', categoryId);
      localStorage.setItem('categoryTimestamp', Date.now().toString());
    } catch (e) {
      console.warn('LocalStorage недоступен:', e);
    }
  }

  /**
   * Получает сохраненную категорию из localStorage
   */
  function getSelectedCategory() {
    try {
      return localStorage.getItem('selectedCategory');
    } catch (e) {
      console.warn('LocalStorage недоступен:', e);
      return null;
    }
  }

  /**
   * Обработка кликов по карточкам категорий
   */
  function initCategorySelection() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Если клик по ссылке, не перехватываем
        if (e.target.tagName === 'A') {
          const categoryId = this.dataset.category;
          if (categoryId) {
            saveSelectedCategory(categoryId);
          }
        }
      });
    });
  }

  // ==========================================
  // ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
  // ==========================================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Если это просто #, не обрабатываем
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ==========================================
  // АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
  // ==========================================
  
  /**
   * Intersection Observer для анимации появления
   */
  function initScrollAnimations() {
    // Проверяем поддержку Intersection Observer
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Наблюдаем за карточками категорий
    document.querySelectorAll('.category-card, .function-card').forEach(card => {
      observer.observe(card);
    });
  }

  // ==========================================
  // ИНДИКАТОР ВЫБРАННОЙ КАТЕГОРИИ
  // ==========================================
  
  /**
   * Подсвечивает выбранную ранее категорию
   */
  function highlightSelectedCategory() {
    const selectedCategory = getSelectedCategory();
    
    if (selectedCategory) {
      const card = document.querySelector(`.category-card[data-category="${selectedCategory}"]`);
      
      if (card) {
        card.style.borderColor = 'var(--color-accent)';
        card.style.backgroundColor = 'var(--color-bg-alt)';
        
        // Добавляем бейдж "Вы выбрали эту категорию"
        const badge = document.createElement('div');
        badge.className = 'category-badge';
        badge.textContent = '✓ Вы выбрали эту категорию';
        badge.style.cssText = `
          background: var(--color-accent);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: inline-block;
        `;
        
        card.insertBefore(badge, card.firstChild);
      }
    }
  }

  // ==========================================
  // BREADCRUMBS NAVIGATION
  // ==========================================
  
  /**
   * Обновляет хлебные крошки на страницах категорий
   */
  function updateBreadcrumbs() {
    const breadcrumbsContainer = document.querySelector('.breadcrumbs');
    
    if (breadcrumbsContainer) {
      const selectedCategory = getSelectedCategory();
      if (selectedCategory) {
        console.log('Выбранная категория:', selectedCategory);
      }
    }
  }

  // ==========================================
  // ФОРМА ОБРАТНОЙ СВЯЗИ
  // ==========================================
  
  /**
   * Базовая валидация и обработка форм
   */
  function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Здесь будет логика отправки формы
        const formData = new FormData(form);
        console.log('Отправка формы:', Object.fromEntries(formData));
        
        // Показываем сообщение об успешной отправке
        alert('Спасибо! Ваше сообщение отправлено.');
        form.reset();
      });
    });
  }

  // ==========================================
  // ТЕМНАЯ ТЕМА (опционально)
  // ==========================================
  
  /**
   * Переключение темной темы
   */
  function initThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    
    if (themeToggle) {
      // Проверяем сохраненную тему
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
      }
      
      themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  }

  // ==========================================
  // СТАТИСТИКА ПОСЕЩЕНИЙ (опционально)
  // ==========================================
  
  /**
   * Отслеживание посещения категорий
   */
  function trackCategoryVisit(categoryId) {
    try {
      let visits = JSON.parse(localStorage.getItem('categoryVisits') || '{}');
      visits[categoryId] = (visits[categoryId] || 0) + 1;
      localStorage.setItem('categoryVisits', JSON.stringify(visits));
    } catch (e) {
      console.warn('Не удалось сохранить статистику:', e);
    }
  }

  // ==========================================
  // КНОПКА "НАЗАД"
  // ==========================================
  
  /**
   * Обработка кнопки "Назад на главную"
   */
  function initBackButton() {
    const backButtons = document.querySelectorAll('[data-back]');
    
    backButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Если есть история, возвращаемся назад
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // Иначе переходим на главную
          window.location.href = 'index.html';
        }
      });
    });
  }

  // ==========================================
  // LAZY LOADING ИЗОБРАЖЕНИЙ
  // ==========================================
  
  /**
   * Ленивая загрузка изображений
   */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Браузер поддерживает нативную ленивую загрузку
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // Fallback для старых браузеров
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  // ==========================================
  // ИНИЦИАЛИЗАЦИЯ
  // ==========================================
  
  /**
   * Инициализация всех модулей при загрузке страницы
   */
  function init() {
    // Базовый функционал
    initCategorySelection();
    initSmoothScroll();
    initScrollAnimations();
    highlightSelectedCategory();
    updateBreadcrumbs();
    initForms();
    initBackButton();
    initLazyLoading();
    
    // Опциональный функционал
    initThemeToggle();
    
    console.log('Сайт инициализирован');
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==========================================
  // ЭКСПОРТ ДЛЯ ОТЛАДКИ
  // ==========================================
  
  // Для отладки в консоли браузера
  window.siteDebug = {
    getSelectedCategory,
    saveSelectedCategory,
    trackCategoryVisit
  };

})();

