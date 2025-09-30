// =====================
// МОБИЛЬНОЕ МЕНЮ
// =====================
(function() {
  const mobileMenuBtn = document.querySelector('.header__mobile-menu-btn');
  const mobileMenu = document.querySelector('.header__menu');
  const menuOverlay = document.querySelector('.header__menu-overlay');
  const menuCloseBtn = document.querySelector('.header__menu-close');
  const menuLinks = document.querySelectorAll('.header__menu-link');
  
  if (!mobileMenuBtn || !mobileMenu || !menuOverlay || !menuCloseBtn) return;
  
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
    mobileMenu.classList.toggle('header__menu--open');
    menuOverlay.classList.toggle('header__menu-overlay--open');
    mobileMenuBtn.classList.toggle('header__mobile-menu-btn--open');
    
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    if (isMenuOpen) {
      setTimeout(() => {
        menuCloseBtn.focus();
      }, 300);
    }
  }
  
  function closeMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('header__menu--open');
      menuOverlay.classList.remove('header__menu-overlay--open');
      mobileMenuBtn.classList.remove('header__mobile-menu-btn--open');
      document.body.style.overflow = '';
      mobileMenuBtn.focus();
    }
  }
  
  mobileMenuBtn.addEventListener('click', toggleMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
})();

// =====================
// ПЛАВНЫЙ СКРОЛЛ
// =====================
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
          e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// =====================
// ФУНКЦИОНАЛ БИБЛИОТЕКИ
// =====================
(function() {
  const searchInput = document.querySelector('.library__search');
  const filterButtons = document.querySelectorAll('.library__filter-btn');
  const cards = document.querySelectorAll('.card');
  const resultsCounter = document.querySelector('.library__results-count');
  
  if (!searchInput || !filterButtons.length || !cards.length) return;
  
  let currentFilter = 'all';
  let currentSearchTerm = '';
  
  function updateResults() {
    let visibleCount = 0;
    
    cards.forEach(card => {
      const title = card.querySelector('.card-title');
      const excerpt = card.querySelector('.card-excerpt');
      const cardType = card.dataset.type;
      
      let matchesFilter = currentFilter === 'all' || cardType === currentFilter;
      let matchesSearch = true;
      
      if (currentSearchTerm && title && excerpt) {
        const titleText = title.textContent.toLowerCase();
        const excerptText = excerpt.textContent.toLowerCase();
        matchesSearch = titleText.includes(currentSearchTerm) || excerptText.includes(currentSearchTerm);
      }
      
      if (matchesFilter && matchesSearch) {
        card.style.display = 'block';
        card.classList.remove('card--hidden');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.add('card--hidden');
      }
    });
    
    // Обновляем счетчик результатов
    if (resultsCounter) {
      resultsCounter.textContent = `Найдено материалов: ${visibleCount}`;
    }
  }
  
  searchInput.addEventListener('input', function() {
    currentSearchTerm = this.value.toLowerCase();
    updateResults();
  });
  
  // Очистка поиска при двойном клике
  searchInput.addEventListener('dblclick', function() {
    this.value = '';
    currentSearchTerm = '';
    updateResults();
  });
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      currentFilter = this.dataset.filter;
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      updateResults();
    });
  });
  
  // Сброс фильтров при нажатии Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      currentSearchTerm = '';
      currentFilter = 'all';
      
      filterButtons.forEach(btn => btn.classList.remove('active'));
      filterButtons[0].classList.add('active'); // Активируем "Все материалы"
      
      updateResults();
    }
  });
  
  // Инициализация
  updateResults();
})();

// =====================
// ПЛАВНЫЙ СКРОЛЛ
// =====================
(function() {
  // Добавляем плавный скролл для всех якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// =====================
// АКТИВНОЕ СОСТОЯНИЕ МЕНЮ
// =====================
(function() {
  // Устанавливаем активное состояние для текущей страницы
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('.header__menu-link');
  
  menuLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Убираем aria-current со всех ссылок
    link.removeAttribute('aria-current');
    
    // Проверяем, соответствует ли ссылка текущей странице
    if (linkPath === currentPath || 
        (currentPath.endsWith('/') && linkPath === currentPath.slice(0, -1)) ||
        (currentPath === '/' && linkPath === '../') ||
        (currentPath.endsWith('index.html') && linkPath === './')) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('header__menu-link--active');
    }
  });
})();

// =====================
// УЛУЧШЕНИЯ ИНТЕРАКТИВНОСТИ
// =====================
(function() {
  // Добавляем эффект нажатия для всех кнопок
  document.querySelectorAll('.btn, .header__mobile-menu-btn, .library-controls__filter-btn').forEach(button => {
    button.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Добавляем эффект hover для карточек
  document.querySelectorAll('.card, .lesson-card, .life-topic-card, .witness-topic-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Добавляем поддержку клавиатуры для всех интерактивных элементов
  document.querySelectorAll('.card-link, .lesson-card__link, .life-topic-card__link, .witness-topic-card__link').forEach(link => {
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Добавляем фокус-индикаторы для всех интерактивных элементов
  document.querySelectorAll('button, a, input, textarea').forEach(element => {
    element.addEventListener('focus', function() {
      this.style.outline = '2px solid var(--color-primary)';
      this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
      this.style.outline = '';
      this.style.outlineOffset = '';
    });
  });
})();

// =====================
// АНИМАЦИИ ПОЯВЛЕНИЯ
// =====================
(function() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
  const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
})();

  // =====================
// ТАБЫ ИНТЕГРИРОВАННОГО КОНТЕНТА
  // =====================
(function() {
  const tabButtons = document.querySelectorAll('.integrated-content__tab-btn');
  const tabPanels = document.querySelectorAll('.integrated-content__tab-panel');
  
  if (!tabButtons.length || !tabPanels.length) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Убираем активный класс со всех кнопок и панелей
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Добавляем активный класс к текущей кнопке и панели
      this.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
})();
