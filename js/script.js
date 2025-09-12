// =====================
// МОБИЛЬНОЕ МЕНЮ И SUBMENU
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
    
    // Блокируем прокрутку страницы при открытом меню
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Фокус на кнопке закрытия при открытии
    if (isMenuOpen) {
      setTimeout(() => {
        menuCloseBtn.focus();
      }, 300); // Ждем завершения анимации
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
  
  // Обработчики событий
  mobileMenuBtn.addEventListener('click', toggleMenu);
  
  // Закрытие меню по клику на кнопку закрытия
  menuCloseBtn.addEventListener('click', closeMenu);
  
  // Закрытие меню по клику на overlay
  menuOverlay.addEventListener('click', (e) => {
    // Проверяем, что клик не по submenu
    if (!e.target.closest('.header__submenu') && !e.target.closest('.header__menu-link--submenu')) {
      closeMenu();
    }
  });
  
  // Закрытие меню по клику на ссылку
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Не закрываем меню при клике на submenu toggle
      if (!link.classList.contains('header__menu-link--submenu')) {
        closeMenu();
      }
    });
  });
  
  // Закрытие меню по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  });
  
  // Управление фокусом в меню
  mobileMenu.addEventListener('keydown', (e) => {
    if (!isMenuOpen) return;
    
    const focusableElements = [menuCloseBtn, ...Array.from(menuLinks)];
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        focusableElements[0].focus();
        break;
      case 'End':
        e.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
        break;
    }
  });

  // =====================
  // SUBMENU ФУНКЦИОНАЛЬНОСТЬ
  // =====================
  const submenuToggles = document.querySelectorAll('.header__menu-link--submenu');
  const submenus = document.querySelectorAll('.header__submenu');
  
  submenuToggles.forEach((submenuToggle, index) => {
    const submenu = submenus[index];
    
    if (submenuToggle && submenu) {
      // Переключение submenu на мобильных устройствах
      submenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Предотвращаем всплытие события
        
        const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
          // Закрываем submenu
          submenuToggle.setAttribute('aria-expanded', 'false');
          submenu.classList.remove('header__submenu--open');
        } else {
          // Закрываем все другие submenu
          submenuToggles.forEach((otherToggle, otherIndex) => {
            if (otherIndex !== index) {
              otherToggle.setAttribute('aria-expanded', 'false');
              submenus[otherIndex].classList.remove('header__submenu--open');
            }
          });
          
          // Открываем текущий submenu
          submenuToggle.setAttribute('aria-expanded', 'true');
          submenu.classList.add('header__submenu--open');
        }
      });
      
      // Обработка клавиатуры для submenu
      submenuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation(); // Предотвращаем всплытие события
          submenuToggle.click();
        }
      });
      
      // Закрытие submenu при клике на ссылку (мобильная версия)
      const submenuLinks = submenu.querySelectorAll('.header__submenu-link');
      submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // На мобильных устройствах закрываем submenu после клика
          if (window.innerWidth < 768) {
            submenuToggle.setAttribute('aria-expanded', 'false');
            submenu.classList.remove('header__submenu--open');
          }
          // Не останавливаем всплытие для ссылок - они должны работать
        });
      });
    }
  });
  
  // Закрытие всех submenu при изменении размера экрана
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      // На десктопе сбрасываем состояние всех submenu
      submenuToggles.forEach((submenuToggle, index) => {
        submenuToggle.setAttribute('aria-expanded', 'false');
        submenus[index].classList.remove('header__submenu--open');
      });
    }
  });
})();

// =====================
// КАРУСЕЛЬ ОТЗЫВОВ
// =====================
(function() {
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.testimonials__prev');
  const nextBtn = document.querySelector('.testimonials__next');
  
  if (!testimonials.length || !prevBtn || !nextBtn) return;
  
  let currentIndex = 0;
  
  function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle('testimonial--active', i === index);
    });
  }
  
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }
  
  function prevTestimonial() {
    currentIndex = currentIndex <= 0 ? testimonials.length - 1 : currentIndex - 1;
    showTestimonial(currentIndex);
  }
  
  // Автоматическая смена отзывов
  let autoSlideInterval = setInterval(nextTestimonial, 5000);
  
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextTestimonial, 5000);
  }
  
  // Обработчики событий
  nextBtn.addEventListener('click', () => {
    nextTestimonial();
    resetAutoSlide();
  });
  
  prevBtn.addEventListener('click', () => {
    prevTestimonial();
    resetAutoSlide();
  });
  
  // Пауза автопрокрутки при наведении
  const carousel = document.querySelector('.testimonials__carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      resetAutoSlide();
    });
  }
  
  // Управление с клавиатуры
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('.testimonials')) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevTestimonial();
          resetAutoSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTestimonial();
          resetAutoSlide();
          break;
      }
    }
  });
})();

// =====================
// ПЛАВНАЯ ПРОКРУТКА
// =====================
(function() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
})();

// =====================
// TIMELINE ИНТЕРАКТИВНОСТЬ
// =====================
(function() {
  const timelineItems = document.querySelectorAll('.timeline__item');
  
  if (timelineItems.length === 0) return;
  
  // Анимация появления элементов timeline при скролле
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Инициализация анимации
  timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    timelineObserver.observe(item);
  });
  
  // Интерактивность для деталей timeline
  timelineItems.forEach(item => {
    const content = item.querySelector('.timeline__content');
    const details = item.querySelector('.timeline__details');
    
    if (content && details) {
      // Скрываем детали по умолчанию
      details.style.maxHeight = '0';
      details.style.overflow = 'hidden';
      details.style.transition = 'max-height 0.3s ease';
      
      // Добавляем индикатор клика
      const clickIndicator = document.createElement('div');
      clickIndicator.innerHTML = '<span class="material-icons" style="font-size: 16px; color: var(--primary);">expand_more</span>';
      clickIndicator.style.textAlign = 'center';
      clickIndicator.style.marginTop = '12px';
      clickIndicator.style.cursor = 'pointer';
      clickIndicator.style.transition = 'transform 0.3s ease';
      
      content.appendChild(clickIndicator);
      
      // Обработчик клика
      clickIndicator.addEventListener('click', () => {
        const isExpanded = details.style.maxHeight !== '0px';
        
        if (isExpanded) {
          details.style.maxHeight = '0';
          clickIndicator.style.transform = 'rotate(0deg)';
        } else {
          details.style.maxHeight = details.scrollHeight + 'px';
          clickIndicator.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
})();

// =====================
// АУДИО ПЛЕЕР ДЛЯ МОЛИТВЫ
// =====================
(function() {
  const audioBtn = document.querySelector('.prayer-audio__btn');
  
  if (!audioBtn) return;
  
  let isPlaying = false;
  let audio = null;
  
  // Создаем аудио элемент (заглушка)
  function createAudio() {
    if (!audio) {
      audio = new Audio();
      // Здесь можно добавить реальный URL аудиофайла
      // audio.src = 'audio/prayer.mp3';
      
      audio.addEventListener('ended', () => {
        isPlaying = false;
        updateButtonState();
      });
      
      audio.addEventListener('error', () => {
        console.log('Аудиофайл не найден');
        isPlaying = false;
        updateButtonState();
      });
    }
    return audio;
  }
  
  function updateButtonState() {
    const icon = audioBtn.querySelector('.material-icons');
    const text = audioBtn.textContent.trim();
    
    if (isPlaying) {
      icon.textContent = 'pause';
      audioBtn.innerHTML = `<span class="material-icons">pause</span> Приостановить молитву`;
    } else {
      icon.textContent = 'play_arrow';
      audioBtn.innerHTML = `<span class="material-icons">play_arrow</span> Прослушать молитву`;
    }
  }
  
  audioBtn.addEventListener('click', () => {
    const audioElement = createAudio();
    
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
    } else {
      // Если аудиофайл не загружен, показываем уведомление
      if (!audioElement.src) {
        alert('Аудиофайл молитвы будет добавлен в ближайшее время. Пожалуйста, прочитайте молитву самостоятельно.');
        return;
      }
      
      audioElement.play().then(() => {
        isPlaying = true;
        updateButtonState();
      }).catch(error => {
        console.log('Ошибка воспроизведения:', error);
        alert('Не удалось воспроизвести аудио. Пожалуйста, прочитайте молитву самостоятельно.');
      });
    }
    
    updateButtonState();
  });
})();

// =====================
// ПЛАН ЧТЕНИЯ ЕВАНГЕЛИЯ
// =====================
(function() {
  const readingDays = document.querySelectorAll('.reading-day');
  const downloadBtn = document.querySelector('.reading-plan__download-btn');
  
  if (readingDays.length === 0) return;
  
  // Анимация появления дней чтения
  const readingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 50);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });
  
  readingDays.forEach((day, index) => {
    day.style.opacity = '0';
    day.style.transform = 'translateX(-20px)';
    day.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    readingObserver.observe(day);
  });
  
  // Обработчик скачивания плана
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Здесь можно добавить реальную логику скачивания PDF
      alert('PDF файл с планом чтения Евангелия будет доступен в ближайшее время. Пока вы можете использовать план, представленный на странице.');
      
      // Аналитика (если подключена)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
          'event_category': 'reading_plan',
          'event_label': 'gospel_reading_plan_pdf'
        });
      }
    });
  }
})();

// =====================
// ПОИСК ЦЕРКВЕЙ
// =====================
(function() {
  const locationInput = document.getElementById('locationInput');
  const locationBtn = document.querySelector('.church-search__location-btn');
  const searchSubmit = document.querySelector('.church-search__submit');
  const denominationFilter = document.getElementById('denominationFilter');
  const languageFilter = document.getElementById('languageFilter');
  const programsFilter = document.getElementById('programsFilter');
  
  if (!locationInput || !searchSubmit) return;
  
  // Определение местоположения пользователя
  locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      return;
    }
    
    locationBtn.innerHTML = '<span class="material-icons">hourglass_empty</span>';
    locationBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Здесь можно использовать обратное геокодирование
        // для получения адреса по координатам
        locationInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        locationBtn.innerHTML = '<span class="material-icons">my_location</span>';
        locationBtn.disabled = false;
        
        // Автоматический поиск церквей
        searchChurches();
      },
      (error) => {
        console.error('Ошибка геолокации:', error);
        alert('Не удалось определить ваше местоположение');
        locationBtn.innerHTML = '<span class="material-icons">my_location</span>';
        locationBtn.disabled = false;
      }
    );
  });
  
  // Поиск церквей
  function searchChurches() {
    const location = locationInput.value.trim();
    const denomination = denominationFilter.value;
    const language = languageFilter.value;
    const programs = programsFilter.value;
    
    if (!location) {
      alert('Пожалуйста, введите местоположение для поиска');
      return;
    }
    
    // Показываем индикатор загрузки
    searchSubmit.innerHTML = '<span class="material-icons">hourglass_empty</span> Поиск...';
    searchSubmit.disabled = true;
    
    // Имитация поиска (в реальном приложении здесь был бы API запрос)
    setTimeout(() => {
      const results = filterChurches(location, denomination, language, programs);
      displaySearchResults(results);
      
      searchSubmit.innerHTML = 'Найти церкви';
      searchSubmit.disabled = false;
    }, 1500);
  }
  
  // Фильтрация церквей (заглушка)
  function filterChurches(location, denomination, language, programs) {
    // В реальном приложении здесь был бы запрос к API
    const allChurches = [
      {
        id: 1,
        name: 'Церковь МСЦ ЕХБ "Благодать"',
        address: 'ул. Пушкина, 10, Москва',
        denomination: 'baptist',
        language: 'russian',
        programs: ['children', 'youth', 'family'],
        schedule: 'Воскресенье: 10:00, 18:00',
        phone: '+7 (495) 123-45-67',
        lat: 55.7558,
        lng: 37.6176
      },
      {
        id: 2,
        name: 'Церковь МСЦ ЕХБ "Мир"',
        address: 'пр. Мира, 25, Москва',
        denomination: 'baptist',
        language: 'russian',
        programs: ['children', 'youth', 'seniors'],
        schedule: 'Воскресенье: 9:30, 17:00',
        phone: '+7 (495) 234-56-78',
        lat: 55.7558,
        lng: 37.6176
      }
    ];
    
    return allChurches.filter(church => {
      if (denomination && church.denomination !== denomination) return false;
      if (language && church.language !== language) return false;
      if (programs && !church.programs.includes(programs)) return false;
      return true;
    });
  }
  
  // Отображение результатов поиска
  function displaySearchResults(results) {
    const resultsList = document.getElementById('churchResultsList');
    if (!resultsList) return;
    
    if (results.length === 0) {
      resultsList.innerHTML = '<p>Церкви не найдены. Попробуйте изменить параметры поиска.</p>';
      return;
    }
    
    resultsList.innerHTML = results.map(church => `
      <div class="church-result-item">
        <h4>${church.name}</h4>
        <p><span class="material-icons">location_on</span> ${church.address}</p>
        <p><span class="material-icons">schedule</span> ${church.schedule}</p>
        <p><span class="material-icons">phone</span> ${church.phone}</p>
        <button class="church-result-btn" data-church-id="${church.id}">Подробнее</button>
      </div>
    `).join('');
    
    // Добавляем обработчики для кнопок
    resultsList.querySelectorAll('.church-result-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const churchId = btn.dataset.churchId;
        showChurchDetails(churchId);
      });
    });
  }
  
  // Показать детали церкви
  function showChurchDetails(churchId) {
    // В реальном приложении здесь был бы модальный диалог с деталями
    alert(`Детали церкви с ID: ${churchId} будут показаны в модальном окне`);
  }
  
  // Обработчики событий
  searchSubmit.addEventListener('click', searchChurches);
  
  // Поиск при нажатии Enter
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchChurches();
    }
  });
})();

// =====================
// КАРТА ЦЕРКВЕЙ
// =====================
(function() {
  const mapContainer = document.getElementById('churchMap');
  const loadMapBtn = document.querySelector('.church-map__load-btn');
  
  if (!mapContainer || !loadMapBtn) return;
  
  let mapLoaded = false;
  
  loadMapBtn.addEventListener('click', () => {
    if (mapLoaded) return;
    
    loadMapBtn.innerHTML = '<span class="material-icons">hourglass_empty</span> Загрузка...';
    loadMapBtn.disabled = true;
    
    // Имитация загрузки карты
    setTimeout(() => {
      mapContainer.innerHTML = `
        <div class="church-map__loaded">
          <div class="church-map__loaded-content">
            <h3>Карта загружена</h3>
            <p>Здесь будет интерактивная карта Google Maps с маркерами церквей</p>
            <div class="church-map__features">
              <div class="church-map__feature">
                <span class="material-icons">place</span>
                <span>Маркеры церквей</span>
              </div>
              <div class="church-map__feature">
                <span class="material-icons">directions</span>
                <span>Построение маршрутов</span>
              </div>
              <div class="church-map__feature">
                <span class="material-icons">info</span>
                <span>Информационные окна</span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      mapLoaded = true;
    }, 2000);
  });
})();

// =====================
// КАРТОЧКИ ЦЕРКВЕЙ
// =====================
(function() {
  const churchCards = document.querySelectorAll('.church-card');
  
  churchCards.forEach(card => {
    const primaryBtn = card.querySelector('.church-card__btn--primary');
    const secondaryBtn = card.querySelector('.church-card__btn--secondary');
    
    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        const churchName = card.querySelector('.church-card__title').textContent;
        alert(`Подробная информация о церкви "${churchName}" будет показана в модальном окне`);
      });
    }
    
    if (secondaryBtn) {
      secondaryBtn.addEventListener('click', () => {
        const churchAddress = card.querySelector('.church-card__info-item span').textContent;
        alert(`Маршрут к церкви по адресу: ${churchAddress}`);
      });
    }
  });
})();

// =====================
// МЕДИАТЕКА
// =====================
(function() {
  const searchInput = document.getElementById('searchInput');
  const searchSubmit = document.querySelector('.media-search__submit');
  const typeFilter = document.getElementById('typeFilter');
  const topicFilter = document.getElementById('topicFilter');
  const dateFilter = document.getElementById('dateFilter');
  
  if (!searchInput || !searchSubmit) return;
  
  // Поиск медиа
  function searchMedia() {
    const query = searchInput.value.trim();
    const type = typeFilter.value;
    const topic = topicFilter.value;
    const date = dateFilter.value;
    
    // Показываем индикатор загрузки
    searchSubmit.innerHTML = '<span class="material-icons">hourglass_empty</span>';
    searchSubmit.disabled = true;
    
    // Имитация поиска
    setTimeout(() => {
      const results = filterMedia(query, type, topic, date);
      displaySearchResults(results);
      
      searchSubmit.innerHTML = '<span class="material-icons">search</span>';
      searchSubmit.disabled = false;
    }, 1000);
  }
  
  // Получение всех медиа (заглушка)
  function getAllMedia() {
    return [
      {
        id: 1,
        title: 'Путь к спасению',
        description: 'Проповедь пастора Иванова о том, как обрести спасение через веру в Иисуса Христа.',
        type: 'video',
        topic: 'salvation',
        author: 'Пастор Иван Иванов',
        date: '2024-12-15',
        duration: '45:30'
      },
      {
        id: 2,
        title: 'Сила молитвы',
        description: 'Размышления о важности молитвы в жизни христианина.',
        type: 'audio',
        topic: 'prayer',
        author: 'Пастор Мария Петрова',
        date: '2024-12-12',
        duration: '32:15'
      }
    ];
  }
  
  // Проверка соответствия запросу
  function matchesQuery(media, query) {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    return media.title.toLowerCase().includes(lowerQuery) || 
           media.description.toLowerCase().includes(lowerQuery);
  }
  
  // Проверка соответствия типу
  function matchesType(media, type) {
    return !type || media.type === type;
  }
  
  // Проверка соответствия теме
  function matchesTopic(media, topic) {
    return !topic || media.topic === topic;
  }
  
  // Фильтрация медиа
  function filterMedia(query, type, topic, date) {
    const allMedia = getAllMedia();
    
    return allMedia.filter(media => {
      return matchesQuery(media, query) && 
             matchesType(media, type) && 
             matchesTopic(media, topic);
    });
  }
  
  // Создание HTML для медиа карточки
  function createMediaCardHTML(media) {
    const typeText = media.type === 'video' ? 'Видео' : media.type === 'audio' ? 'Аудио' : 'Статья';
    const actionText = media.type === 'video' ? 'Смотреть' : media.type === 'audio' ? 'Слушать' : 'Читать';
    const iconName = media.type === 'article' ? 'read_more' : 'play_arrow';
    const durationHTML = media.duration ? `<div class="media-card__duration">${media.duration}</div>` : '';
    
    return `
      <article class="media-card">
        <div class="media-card__image">
          <img src="https://placehold.co/400x225/8B0000/FFFFFF?text=${encodeURIComponent(media.title)}" alt="${media.title}">
          <div class="media-card__type-badge">${typeText}</div>
          ${durationHTML}
        </div>
        <div class="media-card__content">
          <h3 class="media-card__title">${media.title}</h3>
          <p class="media-card__description">${media.description}</p>
          <div class="media-card__meta">
            <span class="media-card__author">${media.author}</span>
            <span class="media-card__date">${new Date(media.date).toLocaleDateString('ru-RU')}</span>
          </div>
          <div class="media-card__actions">
            <button class="media-card__btn media-card__btn--primary" type="button">
              <span class="material-icons">${iconName}</span>
              ${actionText}
            </button>
            <button class="media-card__btn media-card__btn--secondary" type="button">
              <span class="material-icons">bookmark</span>
            </button>
            <button class="media-card__btn media-card__btn--secondary" type="button">
              <span class="material-icons">share</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }
  
  // Отображение результатов поиска
  function displaySearchResults(results) {
    const featuredGrid = document.querySelector('.featured-content__grid');
    if (!featuredGrid) return;
    
    if (results.length === 0) {
      featuredGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 40px;">Контент не найден. Попробуйте изменить параметры поиска.</p>';
      return;
    }
    
    featuredGrid.innerHTML = results.map(createMediaCardHTML).join('');
  }
  
  // Обработчики событий
  searchSubmit.addEventListener('click', searchMedia);
  
  // Поиск при нажатии Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchMedia();
    }
  });
  
  // Автопоиск при изменении фильтров
  [typeFilter, topicFilter, dateFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', searchMedia);
    }
  });
})();

// =====================
// МЕДИА КАРТОЧКИ
// =====================
(function() {
  const mediaCards = document.querySelectorAll('.media-card');
  
  mediaCards.forEach(card => {
    const primaryBtn = card.querySelector('.media-card__btn--primary');
    const bookmarkBtn = card.querySelector('.media-card__btn--secondary:first-of-type');
    const shareBtn = card.querySelector('.media-card__btn--secondary:last-of-type');
    
    if (primaryBtn) {
      primaryBtn.addEventListener('click', () => {
        const mediaTitle = card.querySelector('.media-card__title').textContent;
        const mediaType = card.querySelector('.media-card__type-badge').textContent;
        alert(`Открывается ${mediaType.toLowerCase()}: "${mediaTitle}"`);
      });
    }
    
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => {
        const icon = bookmarkBtn.querySelector('.material-icons');
        if (icon.textContent === 'bookmark') {
          icon.textContent = 'bookmark_added';
          bookmarkBtn.style.color = 'var(--primary)';
        } else {
          icon.textContent = 'bookmark';
          bookmarkBtn.style.color = 'var(--text-light)';
        }
      });
    }
    
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const mediaTitle = card.querySelector('.media-card__title').textContent;
        if (navigator.share) {
          navigator.share({
            title: mediaTitle,
            text: 'Посмотрите этот христианский контент',
            url: window.location.href
          });
        } else {
          alert(`Поделиться: "${mediaTitle}"`);
        }
      });
    }
  });
})();

// =====================
// ПЛЕЙЛИСТЫ
// =====================
(function() {
  const playlistCards = document.querySelectorAll('.playlist-card');
  
  playlistCards.forEach(card => {
    const playBtn = card.querySelector('.playlist-card__btn');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const playlistTitle = card.querySelector('.playlist-card__title').textContent;
        alert(`Начинается воспроизведение плейлиста: "${playlistTitle}"`);
      });
    }
  });
})();

// =====================
// НЕДАВНИЙ КОНТЕНТ
// =====================
(function() {
  const recentItems = document.querySelectorAll('.recent-item');
  
  recentItems.forEach(item => {
    const playBtn = item.querySelector('.recent-item__btn');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const itemTitle = item.querySelector('.recent-item__title').textContent;
        const itemType = item.querySelector('.recent-item__type').textContent;
        alert(`Воспроизводится ${itemType.toLowerCase()}: "${itemTitle}"`);
      });
    }
  });
})();

// =====================
// QA ПОИСК
// =====================
(function() {
  const searchInput = document.getElementById('qaSearchInput');
  const searchForm = document.getElementById('qaSearchForm');
  const suggestions = document.getElementById('qaSuggestions');
  
  if (!searchInput || !searchForm || !suggestions) return;
  
  // База знаний (заглушка)
  const knowledgeBase = [
    { question: 'Что такое спасение?', category: 'salvation', answer: 'Спасение — это дар Божий через веру в Иисуса Христа.' },
    { question: 'Как правильно молиться?', category: 'prayer', answer: 'Молитва — это искренний разговор с Богом.' },
    { question: 'С чего начать изучение Библии?', category: 'bible', answer: 'Начните с Евангелия от Иоанна.' },
    { question: 'Зачем нужна церковь?', category: 'church', answer: 'Церковь — место поклонения и общения с верующими.' },
    { question: 'Что такое грех?', category: 'salvation', answer: 'Грех — это нарушение Божьего закона.' },
    { question: 'Как принять Иисуса Христа?', category: 'salvation', answer: 'Признать Его Господом и Спасителем, покаяться в грехах.' }
  ];
  
  // Поиск с автодополнением
  function searchQuestions(query) {
    if (query.length < 2) {
      suggestions.style.display = 'none';
      return;
    }
    
    const results = knowledgeBase.filter(item => 
      item.question.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (results.length > 0) {
      suggestions.innerHTML = results.map(item => 
        `<div class="qa-search__suggestion" data-question="${item.question}">${item.question}</div>`
      ).join('');
      suggestions.style.display = 'block';
    } else {
      suggestions.style.display = 'none';
    }
  }
  
  // Обработчики событий
  searchInput.addEventListener('input', (e) => {
    searchQuestions(e.target.value);
  });
  
  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      suggestions.style.display = 'none';
    }, 200);
  });
  
  suggestions.addEventListener('click', (e) => {
    if (e.target.classList.contains('qa-search__suggestion')) {
      searchInput.value = e.target.dataset.question;
      suggestions.style.display = 'none';
      // Здесь можно добавить переход к соответствующему ответу
    }
  });
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Здесь можно добавить логику поиска и отображения результатов
      alert(`Поиск по запросу: "${query}"`);
    }
  });
})();

// =====================
// QA КАТЕГОРИИ И ВОПРОСЫ
// =====================
(function() {
  const categoryHeaders = document.querySelectorAll('.qa-category__header');
  const questionHeaders = document.querySelectorAll('.qa-question__header');
  
  // Обработка категорий
  categoryHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      // Закрываем все другие категории
      categoryHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          const otherContent = otherHeader.nextElementSibling;
          otherContent.classList.remove('qa-category__content--open');
        }
      });
      
      // Переключаем текущую категорию
      header.setAttribute('aria-expanded', !isExpanded);
      content.classList.toggle('qa-category__content--open');
    });
  });
  
  // Обработка вопросов
  questionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const answer = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      header.setAttribute('aria-expanded', !isExpanded);
      answer.classList.toggle('qa-question__answer--open');
    });
  });
})();

// =====================
// РЕЙТИНГ ВОПРОСА НЕДЕЛИ
// =====================
(function() {
  const ratingButtons = document.querySelectorAll('.question-week__rating-btn');
  
  ratingButtons.forEach(button => {
    button.addEventListener('click', () => {
      const countElement = button.querySelector('.question-week__rating-count');
      const currentCount = parseInt(countElement.textContent);
      
      // Убираем активное состояние с других кнопок
      ratingButtons.forEach(btn => {
        btn.classList.remove('question-week__rating-btn--active');
      });
      
      // Добавляем активное состояние к текущей кнопке
      button.classList.add('question-week__rating-btn--active');
      
      // Увеличиваем счетчик
      countElement.textContent = currentCount + 1;
      
      // Здесь можно добавить отправку данных на сервер
      console.log('Рейтинг обновлен');
    });
  });
})();

// =====================
// ФОРМА ВОПРОСА ПАСТОРУ
// =====================
(function() {
  const askForm = document.getElementById('askQuestionForm');
  
  if (!askForm) return;
  
  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(askForm);
    const category = formData.get('category');
    const question = formData.get('question');
    const email = formData.get('email');
    const privacy = formData.get('privacy');
    
    // Валидация
    const hasCategory = !!category;
    const hasQuestion = !!question;
    const hasPrivacy = !!privacy;
    
    const hasAllRequiredFields = hasCategory && hasQuestion && hasPrivacy;
    
    if (!hasAllRequiredFields) {
      alert('Пожалуйста, заполните все обязательные поля и согласитесь с политикой конфиденциальности.');
      return;
    }
    
    // Имитация отправки
    const submitBtn = askForm.querySelector('.ask-question__submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Отправляется...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Ваш вопрос отправлен! Мы ответим в течение 24 часов.');
      askForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
})();

// =====================
// START JOURNEY ФУНКЦИОНАЛЬНОСТЬ
// =====================
(function() {
  // Обработка кнопок первых шагов
  const stepButtons = document.querySelectorAll('.first-steps__step-btn');
  
  // Получение действия кнопки
  function getButtonAction(button) {
    const datasets = ['video', 'plan', 'prayer', 'tour'];
    
    for (const dataset of datasets) {
      if (button.dataset[dataset]) {
        return button.dataset[dataset];
      }
    }
    
    return null;
  }
  
  // Обработка действия
  function handleButtonAction(action) {
    const actions = {
      'christ-intro': 'Открывается видео: "Знакомство с Иисусом Христом"',
      'gospel': 'Открывается план чтения Евангелия',
      'acceptance': 'Открывается молитва принятия Иисуса Христа',
      'examples': 'Открываются примеры молитв для новичков',
      'church': 'Открывается виртуальный тур по церкви'
    };
    
    if (actions[action]) {
      alert(actions[action]);
    }
  }
  
  stepButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const action = getButtonAction(button);
      
      if (action) {
        e.preventDefault();
        handleButtonAction(action);
      }
    });
  });
})();

// =====================
// START FAQ ПОИСК
// =====================
(function() {
  const searchInput = document.getElementById('faqSearch');
  const questions = document.querySelectorAll('.start-faq__question');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    questions.forEach(question => {
      const title = question.querySelector('.start-faq__question-title').textContent.toLowerCase();
      const answer = question.querySelector('.start-faq__question-answer p').textContent.toLowerCase();
      
      if (title.includes(query) || answer.includes(query)) {
        question.style.display = 'block';
      } else {
        question.style.display = 'none';
      }
    });
  });
})();

// =====================
// START FAQ АККОРДЕОН
// =====================
(function() {
  const questionHeaders = document.querySelectorAll('.start-faq__question-header');
  
  questionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const answer = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      header.setAttribute('aria-expanded', !isExpanded);
      answer.classList.toggle('start-faq__question-answer--open');
    });
  });
})();

// =====================
// START ASK PASTOR ФОРМА
// =====================
(function() {
  const askForm = document.getElementById('startAskPastorForm');
  
  if (!askForm) return;
  
  askForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(askForm);
    const question = formData.get('question');
    const email = formData.get('email');
    const privacy = formData.get('privacy');
    
    // Валидация
    if (!question || !privacy) {
      alert('Пожалуйста, заполните вопрос и согласитесь с политикой конфиденциальности.');
      return;
    }
    
    // Имитация отправки
    const submitBtn = askForm.querySelector('.start-ask-pastor__submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Отправляется...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Ваш вопрос отправлен! Мы ответим в течение 24 часов.');
      askForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
})();

// =====================
// START CTA ВИРТУАЛЬНЫЙ ТУР
// =====================
(function() {
  const tourButtons = document.querySelectorAll('[data-tour="church"]');
  
  tourButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Открывается виртуальный тур по церкви. Здесь будет 360° панорама с информационными точками.');
    });
  });
})();

// =====================
// AUDIO SEARCH И ФИЛЬТРАЦИЯ
// =====================
(function() {
  const searchInput = document.getElementById('audioSearchInput');
  const topicFilter = document.getElementById('topicFilter');
  const pastorFilter = document.getElementById('pastorFilter');
  const dateFilter = document.getElementById('dateFilter');
  const audioGrid = document.getElementById('audioGrid');
  const audioCount = document.getElementById('audioCount');
  const loadMoreBtn = document.querySelector('.audio-list__load-more');
  
  if (!searchInput || !audioGrid) return;
  
  // База данных аудио (заглушка)
  const audioDatabase = [
    {
      id: 1,
      title: 'Надежда в трудные времена',
      description: 'Проповедь о том, как найти надежду и утешение в сложных жизненных ситуациях через веру в Бога.',
      pastor: 'ivanov',
      pastorName: 'Пастор Иванов',
      date: '2024-12-15',
      duration: '45:30',
      topics: ['salvation', 'prayer'],
      topicNames: ['Надежда', 'Утешение']
    },
    {
      id: 2,
      title: 'Молитва в повседневной жизни',
      description: 'Практические советы о том, как сделать молитву неотъемлемой частью каждого дня.',
      pastor: 'petrov',
      pastorName: 'Пастор Петров',
      date: '2024-12-12',
      duration: '32:15',
      topics: ['prayer', 'bible'],
      topicNames: ['Молитва', 'Духовность']
    },
    {
      id: 3,
      title: 'Христианские гимны',
      description: 'Коллекция традиционных и современных христианских гимнов для поклонения и размышления.',
      pastor: 'ivanov',
      pastorName: 'Хор церкви',
      date: '2024-12-10',
      duration: '28:45',
      topics: ['worship'],
      topicNames: ['Поклонение', 'Музыка']
    },
    {
      id: 4,
      title: 'Изучение Евангелия от Иоанна',
      description: 'Глубокое изучение первой главы Евангелия от Иоанна с практическими применениями для современной жизни.',
      pastor: 'sidorov',
      pastorName: 'Пастор Сидоров',
      date: '2024-12-08',
      duration: '38:20',
      topics: ['bible'],
      topicNames: ['Библия', 'Изучение']
    },
    {
      id: 5,
      title: 'Христианские ценности в семье',
      description: 'Как построить крепкую христианскую семью, основанную на библейских принципах и любви.',
      pastor: 'ivanov',
      pastorName: 'Пастор Иванов',
      date: '2024-12-05',
      duration: '41:10',
      topics: ['family'],
      topicNames: ['Семья', 'Ценности']
    },
    {
      id: 6,
      title: 'Вера в современном мире',
      description: 'Размышления о том, как оставаться верным Христу в современном мире и быть светом для других.',
      pastor: 'petrov',
      pastorName: 'Пастор Петров',
      date: '2024-12-03',
      duration: '35:55',
      topics: ['youth'],
      topicNames: ['Молодежь', 'Вера']
    }
  ];
  
  let currentPage = 1;
  const itemsPerPage = 6;
  let filteredAudio = [...audioDatabase];
  
  // Функция фильтрации
  function filterAudio() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedTopic = topicFilter.value;
    const selectedPastor = pastorFilter.value;
    const selectedDate = dateFilter.value;
    
    filteredAudio = audioDatabase.filter(audio => {
      const matchesSearch = !searchQuery || 
        audio.title.toLowerCase().includes(searchQuery) ||
        audio.description.toLowerCase().includes(searchQuery) ||
        audio.pastorName.toLowerCase().includes(searchQuery);
      
      const matchesTopic = !selectedTopic || audio.topics.includes(selectedTopic);
      const matchesPastor = !selectedPastor || audio.pastor === selectedPastor;
      
      let matchesDate = true;
      if (selectedDate) {
        const audioDate = new Date(audio.date);
        const now = new Date();
        const diffTime = Math.abs(now - audioDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (selectedDate) {
          case 'week':
            matchesDate = diffDays <= 7;
            break;
          case 'month':
            matchesDate = diffDays <= 30;
            break;
          case 'year':
            matchesDate = diffDays <= 365;
            break;
        }
      }
      
      return matchesSearch && matchesTopic && matchesPastor && matchesDate;
    });
    
    currentPage = 1;
    displayAudio();
  }
  
  // Функция отображения аудио
  function displayAudio() {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const audioToShow = filteredAudio.slice(startIndex, endIndex);
    
    audioGrid.innerHTML = audioToShow.map(audio => `
      <article class="media-card">
        <div class="media-card__image">
          <img src="https://placehold.co/300x200/8B0000/FFFFFF?text=Проповедь" alt="Обложка аудио">
          <div class="media-card__play-btn">
            <span class="material-icons">play_arrow</span>
          </div>
          <div class="media-card__duration">${audio.duration}</div>
        </div>
        <div class="media-card__content">
          <h3 class="media-card__title">${audio.title}</h3>
          <p class="media-card__description">${audio.description}</p>
          <div class="media-card__meta">
            <span class="media-card__pastor">${audio.pastorName}</span>
            <span class="media-card__date">${formatDate(audio.date)}</span>
          </div>
          <div class="media-card__topics">
            ${audio.topicNames.map(topic => `<span class="media-card__topic">${topic}</span>`).join('')}
          </div>
          <a href="audio-item-page.html" class="media-card__link">Слушать</a>
        </div>
      </article>
    `).join('');
    
    // Обновляем счетчик
    audioCount.textContent = `${filteredAudio.length} аудио`;
    
    // Показываем/скрываем кнопку "Загрузить еще"
    if (endIndex >= filteredAudio.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }
  
  // Функция форматирования даты
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Обработчики событий
  searchInput.addEventListener('input', filterAudio);
  topicFilter.addEventListener('change', filterAudio);
  pastorFilter.addEventListener('change', filterAudio);
  dateFilter.addEventListener('change', filterAudio);
  
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    displayAudio();
  });
  
  // Инициализация
  displayAudio();
})();

// =====================
// AUDIO PLAYER FUNCTIONALITY
// =====================
(function() {
  const audioPlayer = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const progressBar = document.querySelector('.audio-player__progress-bar');
  const progressFill = document.getElementById('progressFill');
  const progressHandle = document.getElementById('progressHandle');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const speedBtn = document.getElementById('speedBtn');
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  const transcriptToggle = document.getElementById('transcriptToggle');
  const transcriptContent = document.getElementById('transcriptContent');
  
  if (!audioPlayer || !playBtn) return;
  
  let isPlaying = false;
  let currentSpeed = 1;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  let bookmarks = JSON.parse(localStorage.getItem('audioBookmarks') || '[]');
  
  // Инициализация
  function init() {
    // Симуляция загрузки аудио
    audioPlayer.duration = 2730; // 45:30 в секундах
    updateTotalTime();
    
    // Проверяем, есть ли закладка для этого аудио
    const currentAudioId = window.location.pathname.split('/').pop();
    const hasBookmark = bookmarks.includes(currentAudioId);
    updateBookmarkButton(hasBookmark);
  }
  
  // Обновление времени
  function updateTime() {
    const current = audioPlayer.currentTime || 0;
    const duration = audioPlayer.duration || 2730;
    const progress = (current / duration) * 100;
    
    progressFill.style.width = `${progress}%`;
    progressHandle.style.left = `${progress}%`;
    currentTimeEl.textContent = formatTime(current);
  }
  
  // Форматирование времени
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Обновление общего времени
  function updateTotalTime() {
    const duration = audioPlayer.duration || 2730;
    totalTimeEl.textContent = formatTime(duration);
  }
  
  // Переключение воспроизведения
  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      playBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
      isPlaying = false;
    } else {
      audioPlayer.play();
      playBtn.innerHTML = '<span class="material-icons">pause</span>';
      isPlaying = true;
    }
  }
  
  // Изменение скорости
  function changeSpeed() {
    const currentIndex = speeds.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    currentSpeed = speeds[nextIndex];
    
    audioPlayer.playbackRate = currentSpeed;
    speedBtn.querySelector('.audio-player__speed-text').textContent = `${currentSpeed}x`;
  }
  
  // Управление закладками
  function toggleBookmark() {
    const currentAudioId = window.location.pathname.split('/').pop();
    const index = bookmarks.indexOf(currentAudioId);
    
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(currentAudioId);
    }
    
    localStorage.setItem('audioBookmarks', JSON.stringify(bookmarks));
    updateBookmarkButton(index === -1);
  }
  
  // Обновление кнопки закладки
  function updateBookmarkButton(hasBookmark) {
    if (hasBookmark) {
      bookmarkBtn.innerHTML = '<span class="material-icons">bookmark</span>';
      bookmarkBtn.setAttribute('aria-label', 'Удалить закладку');
    } else {
      bookmarkBtn.innerHTML = '<span class="material-icons">bookmark_border</span>';
      bookmarkBtn.setAttribute('aria-label', 'Добавить закладку');
    }
  }
  
  // Переход к позиции
  function seekTo(event) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * (audioPlayer.duration || 2730);
    
    audioPlayer.currentTime = newTime;
    updateTime();
  }
  
  // Переключение транскрипции
  function toggleTranscript() {
    const isExpanded = transcriptToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      transcriptContent.hidden = true;
      transcriptToggle.setAttribute('aria-expanded', 'false');
      transcriptToggle.querySelector('.transcript__toggle-text').textContent = 'Показать транскрипцию';
    } else {
      transcriptContent.hidden = false;
      transcriptToggle.setAttribute('aria-expanded', 'true');
      transcriptToggle.querySelector('.transcript__toggle-text').textContent = 'Скрыть транскрипцию';
    }
  }
  
  // Обработчики событий
  playBtn.addEventListener('click', togglePlay);
  speedBtn.addEventListener('click', changeSpeed);
  bookmarkBtn.addEventListener('click', toggleBookmark);
  transcriptToggle.addEventListener('click', toggleTranscript);
  
  progressBar.addEventListener('click', seekTo);
  
  // Симуляция событий аудио
  setInterval(() => {
    if (isPlaying) {
      const current = audioPlayer.currentTime || 0;
      const duration = audioPlayer.duration || 2730;
      
      if (current < duration) {
        audioPlayer.currentTime = current + 1;
        updateTime();
      } else {
        audioPlayer.pause();
        playBtn.innerHTML = '<span class="material-icons">play_arrow</span>';
        isPlaying = false;
      }
    }
  }, 1000);
  
  // Инициализация
  init();
})();

// =====================
// BLOG SEARCH И ФИЛЬТРАЦИЯ
// =====================
(function() {
  const searchInput = document.getElementById('blogSearchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const authorFilter = document.getElementById('authorFilter');
  const dateFilter = document.getElementById('dateFilter');
  const blogGrid = document.getElementById('blogGrid');
  const blogCount = document.getElementById('blogCount');
  const loadMoreBtn = document.querySelector('.blog-list__load-more');
  
  if (!searchInput || !blogGrid) return;
  
  // База данных статей (заглушка)
  const blogDatabase = [
    {
      id: 1,
      title: 'Сила молитвы в повседневной жизни',
      description: 'Как сделать молитву неотъемлемой частью каждого дня и обрести более глубокие отношения с Богом через постоянное общение с Ним.',
      author: 'ivanov',
      authorName: 'Пастор Иванов',
      category: 'bible',
      categoryName: 'Библейские размышления',
      date: '2024-12-18',
      readTime: '8 мин',
      tags: ['prayer', 'spiritual', 'practical'],
      tagNames: ['Молитва', 'Духовность', 'Практика']
    },
    {
      id: 2,
      title: 'Христианские ценности в воспитании детей',
      description: 'Практические советы о том, как привить детям библейские ценности и помочь им вырасти в вере, сохраняя при этом любовь и понимание.',
      author: 'maria',
      authorName: 'Мария Козлова',
      category: 'family',
      categoryName: 'Семья',
      date: '2024-12-16',
      readTime: '12 мин',
      tags: ['family', 'children', 'values'],
      tagNames: ['Семья', 'Дети', 'Воспитание']
    },
    {
      id: 3,
      title: 'Вера в современном мире: вызовы и возможности',
      description: 'Размышления о том, как оставаться верным Христу в современном мире, полном соблазнов и вызовов, и как быть светом для других.',
      author: 'petrov',
      authorName: 'Пастор Петров',
      category: 'youth',
      categoryName: 'Молодежь',
      date: '2024-12-14',
      readTime: '6 мин',
      tags: ['youth', 'faith', 'modern'],
      tagNames: ['Молодежь', 'Вера', 'Современность']
    },
    {
      id: 4,
      title: 'Изучение Библии: с чего начать',
      description: 'Практическое руководство для тех, кто хочет начать регулярное изучение Священного Писания и углубить свои знания о Боге.',
      author: 'sidorov',
      authorName: 'Пастор Сидоров',
      category: 'spiritual',
      categoryName: 'Духовный рост',
      date: '2024-12-12',
      readTime: '10 мин',
      tags: ['bible', 'study', 'growth'],
      tagNames: ['Библия', 'Изучение', 'Рост']
    },
    {
      id: 5,
      title: 'Как найти время для Бога в занятой жизни',
      description: 'Практические советы о том, как организовать свое время так, чтобы уделять достаточно внимания духовной жизни, даже при очень плотном графике.',
      author: 'ivanov',
      authorName: 'Пастор Иванов',
      category: 'practical',
      categoryName: 'Практические советы',
      date: '2024-12-10',
      readTime: '7 мин',
      tags: ['time', 'organization', 'spiritual'],
      tagNames: ['Время', 'Организация', 'Духовность']
    },
    {
      id: 6,
      title: 'Любовь Божья: безграничная и безусловная',
      description: 'Глубокое размышление о природе Божьей любви и о том, как понимание этой любви может изменить нашу жизнь и отношения с другими.',
      author: 'petrov',
      authorName: 'Пастор Петров',
      category: 'bible',
      categoryName: 'Библейские размышления',
      date: '2024-12-08',
      readTime: '9 мин',
      tags: ['love', 'god', 'reflection'],
      tagNames: ['Любовь', 'Бог', 'Размышления']
    }
  ];
  
  let currentPage = 1;
  const itemsPerPage = 6;
  let filteredBlog = [...blogDatabase];
  
  // Функция фильтрации
  function filterBlog() {
    const searchQuery = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedAuthor = authorFilter.value;
    const selectedDate = dateFilter.value;
    
    filteredBlog = blogDatabase.filter(blog => {
      const matchesSearch = !searchQuery || 
        blog.title.toLowerCase().includes(searchQuery) ||
        blog.description.toLowerCase().includes(searchQuery) ||
        blog.authorName.toLowerCase().includes(searchQuery);
      
      const matchesCategory = !selectedCategory || blog.category === selectedCategory;
      const matchesAuthor = !selectedAuthor || blog.author === selectedAuthor;
      
      let matchesDate = true;
      if (selectedDate) {
        const blogDate = new Date(blog.date);
        const now = new Date();
        const diffTime = Math.abs(now - blogDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (selectedDate) {
          case 'week':
            matchesDate = diffDays <= 7;
            break;
          case 'month':
            matchesDate = diffDays <= 30;
            break;
          case 'year':
            matchesDate = diffDays <= 365;
            break;
        }
      }
      
      return matchesSearch && matchesCategory && matchesAuthor && matchesDate;
    });
    
    currentPage = 1;
    displayBlog();
  }
  
  // Функция отображения статей
  function displayBlog() {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const blogToShow = filteredBlog.slice(startIndex, endIndex);
    
    blogGrid.innerHTML = blogToShow.map(blog => `
      <article class="blog-card">
        <div class="blog-card__image">
          <img src="https://placehold.co/400x250/8B0000/FFFFFF?text=Статья" alt="Обложка статьи">
          <div class="blog-card__read-time">${blog.readTime}</div>
        </div>
        <div class="blog-card__content">
          <div class="blog-card__meta">
            <span class="blog-card__category">${blog.categoryName}</span>
            <span class="blog-card__date">${formatDate(blog.date)}</span>
          </div>
          <h3 class="blog-card__title">${blog.title}</h3>
          <p class="blog-card__description">${blog.description}</p>
          <div class="blog-card__author">
            <span class="blog-card__author-name">${blog.authorName}</span>
          </div>
          <div class="blog-card__tags">
            ${blog.tagNames.map(tag => `<span class="blog-card__tag">${tag}</span>`).join('')}
          </div>
          <a href="blog-item-page.html" class="blog-card__link">Читать статью</a>
        </div>
      </article>
    `).join('');
    
    // Обновляем счетчик
    blogCount.textContent = `${filteredBlog.length} статей`;
    
    // Показываем/скрываем кнопку "Загрузить еще"
    if (endIndex >= filteredBlog.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  }
  
  // Функция форматирования даты
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Обработчики событий
  searchInput.addEventListener('input', filterBlog);
  categoryFilter.addEventListener('change', filterBlog);
  authorFilter.addEventListener('change', filterBlog);
  dateFilter.addEventListener('change', filterBlog);
  
  loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    displayBlog();
  });
  
  // Инициализация
  displayBlog();
})();

// =====================
// АНИМАЦИИ ПРИ ПРОКРУТКЕ
// =====================
(function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Элементы для анимации
  const animatedElements = document.querySelectorAll(
    '.gates__card, .testimonial, .first-steps__item, .church-map__feature'
  );
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
})();

// =====================
// ФОРМА ПРОСЬБЫ О МОЛИТВЕ
// =====================
(function() {
  const form = document.getElementById('prayerRequestForm');
  if (!form) return;
  
  const nameInput = document.getElementById('prayerName');
  const prayerTextarea = document.getElementById('prayerText');
  const privacyCheckbox = document.getElementById('prayerPrivacy');
  const submitBtn = form.querySelector('.prayer-request__submit');
  
  // Валидация в реальном времени
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Это поле обязательно для заполнения';
    } else if (field === nameInput && value.length < 2) {
      isValid = false;
      message = 'Имя должно содержать минимум 2 символа';
    } else if (field === prayerTextarea && value.length < 10) {
      isValid = false;
      message = 'Пожалуйста, опишите вашу нужду более подробно';
    }
    
    // Показываем ошибку
    showFieldError(field, isValid ? '' : message);
    return isValid;
  }
  
  function showFieldError(field, message) {
    // Удаляем предыдущие сообщения об ошибках
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Убираем класс ошибки
    field.classList.remove('field-error');
    field.setAttribute('aria-invalid', 'false');
    
    if (message) {
      // Добавляем класс ошибки
      field.classList.add('field-error');
      field.setAttribute('aria-invalid', 'true');
      
      // Создаем сообщение об ошибке
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.setAttribute('role', 'alert');
      errorElement.setAttribute('aria-live', 'polite');
      
      field.parentNode.appendChild(errorElement);
    }
  }
  
  // Обработчики валидации
  nameInput.addEventListener('blur', () => validateField(nameInput));
  prayerTextarea.addEventListener('blur', () => validateField(prayerTextarea));
  
  // Валидация чекбокса
  privacyCheckbox.addEventListener('change', function() {
    if (!this.checked) {
      showFieldError(this, 'Необходимо согласие на обработку данных');
    } else {
      showFieldError(this, '');
    }
  });
  
  // Отправка формы
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Валидация всех полей
    const isNameValid = validateField(nameInput);
    const isPrayerValid = validateField(prayerTextarea);
    const isPrivacyValid = privacyCheckbox.checked;
    
    const nameError = !isNameValid;
    const prayerError = !isPrayerValid;
    const privacyError = !isPrivacyValid;
    const hasValidationErrors = nameError || prayerError || privacyError;
    
    if (hasValidationErrors) {
      // Фокус на первое поле с ошибкой
      if (!isNameValid) {
        nameInput.focus();
      } else if (!isPrayerValid) {
        prayerTextarea.focus();
      } else if (!isPrivacyValid) {
        privacyCheckbox.focus();
      }
      return;
    }
    
    // Блокируем кнопку отправки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляется...';
    
    try {
      // Имитация отправки данных
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Показываем сообщение об успехе
      showSuccessMessage();
      
      // Очищаем форму
      form.reset();
      
    } catch (error) {
      // Показываем сообщение об ошибке
      showErrorMessage();
    } finally {
      // Разблокируем кнопку
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить просьбу';
    }
  });
  
  function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'form-message form-message--success';
    message.innerHTML = `
      <span class="material-icons">check_circle</span>
      <p>Спасибо! Ваша просьба о молитве принята. Мы помолимся за вас.</p>
    `;
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'polite');
    
    form.parentNode.insertBefore(message, form);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
  
  function showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'form-message form-message--error';
    message.innerHTML = `
      <span class="material-icons">error</span>
      <p>Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.</p>
    `;
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    
    form.parentNode.insertBefore(message, form);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
})();

// =====================
// ИНТЕРАКТИВНЫЕ КАРТОЧКИ GATES
// =====================
(function() {
  const gateCards = document.querySelectorAll('.gates__card');
  
  gateCards.forEach(card => {
    // Добавляем обработчик для отслеживания кликов (для аналитики)
    card.addEventListener('click', () => {
      const cardType = card.classList[1]; // gates__card--children, etc.
      const groupName = cardType.replace('gates__card--', '');
      
      // Логируем переход для аналитики
      console.log(`Переход к группе: ${groupName}`);
      
      // Здесь можно добавить отправку события в Google Analytics или другую аналитику
      // gtag('event', 'click', {
      //   event_category: 'gates',
      //   event_label: groupName
      // });
    });
  });
})();

// =====================
// КАРТА ЦЕРКВЕЙ (ЗАГЛУШКА)
// =====================
(function() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  mapElement.addEventListener('click', () => {
    const notification = document.createElement('div');
    notification.className = 'map-notification';
    notification.innerHTML = `
      <div class="map-notification__content">
        <span class="material-icons">map</span>
        <p>Интерактивная карта церквей</p>
        <p class="map-notification__subtitle">Функция будет доступна после интеграции с Google Maps API</p>
      </div>
    `;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.classList.add('map-notification--show');
    }, 100);
    
    // Удаляем уведомление через 4 секунды
    setTimeout(() => {
      notification.classList.remove('map-notification--show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  });
})();

// =====================
// ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ДЛЯ УВЕДОМЛЕНИЙ
// =====================
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .field-error {
      color: var(--secondary);
      font-size: var(--font-size-sm);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .field-error::before {
      content: '⚠';
      font-size: 14px;
    }
    
    .field-error {
      border-color: var(--secondary) !important;
      background-color: rgba(255, 0, 0, 0.05) !important;
    }
    
    .form-message {
      padding: 16px;
      border-radius: var(--border-radius);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }
    
    .form-message--success {
      background-color: rgba(76, 175, 80, 0.1);
      color: #2e7d32;
      border: 1px solid rgba(76, 175, 80, 0.3);
    }
    
    .form-message--error {
      background-color: rgba(244, 67, 54, 0.1);
      color: #c62828;
      border: 1px solid rgba(244, 67, 54, 0.3);
    }
    
    .group-notification,
    .map-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      padding: 20px;
      max-width: 300px;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    
    .group-notification--show,
    .map-notification--show {
      transform: translateX(0);
    }
    
    .group-notification__content,
    .map-notification__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
    }
    
    .group-notification__content .material-icons,
    .map-notification__content .material-icons {
      color: var(--primary);
      font-size: 32px;
    }
    
    .group-notification__subtitle,
    .map-notification__subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-light);
    }
    
    @media (max-width: 768px) {
      .group-notification,
      .map-notification {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);
})();

// =====================
// ИНИЦИАЛИЗАЦИЯ
// =====================
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем поддержку современных функций
  if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver не поддерживается');
  }
  
  // Инициализация завершена
  console.log('Скрипт главной страницы загружен');
});

// =====================
// GATES PAGES FUNCTIONALITY
// =====================

// Gates Content Filtering
(function() {
  const contentFilters = document.querySelectorAll('.gates-content__filter');
  const contentCards = document.querySelectorAll('.gates-content__card');
  
  if (!contentFilters.length || !contentCards.length) return;
  
  function filterContent(type) {
    contentCards.forEach(card => {
      const cardType = card.getAttribute('data-type');
      
      if (type === 'all' || cardType === type) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease-in-out';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  contentFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Убираем активный класс со всех фильтров
      contentFilters.forEach(f => f.classList.remove('gates-content__filter--active'));
      
      // Добавляем активный класс к текущему фильтру
      this.classList.add('gates-content__filter--active');
      
      // Фильтруем контент
      const filterType = this.getAttribute('data-type');
      filterContent(filterType);
    });
  });
})();

// Gates Events Filtering
(function() {
  const eventFilters = document.querySelectorAll('.gates-events__filter');
  const eventItems = document.querySelectorAll('.gates-events__item');
  
  if (!eventFilters.length || !eventItems.length) return;
  
  function filterEvents(category) {
    eventItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (category === 'all' || itemCategory === category) {
        item.style.display = 'grid';
        item.style.animation = 'fadeIn 0.3s ease-in-out';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  eventFilters.forEach(filter => {
    filter.addEventListener('click', function() {
      // Убираем активный класс со всех фильтров
      eventFilters.forEach(f => f.classList.remove('gates-events__filter--active'));
      
      // Добавляем активный класс к текущему фильтру
      this.classList.add('gates-events__filter--active');
      
      // Фильтруем события
      const filterCategory = this.getAttribute('data-category');
      filterEvents(filterCategory);
    });
  });
})();

// Gates Testimonials Carousel
(function() {
  const testimonialsItems = document.querySelectorAll('.gates-testimonials__item');
  const prevBtn = document.querySelector('.gates-testimonials__prev');
  const nextBtn = document.querySelector('.gates-testimonials__next');
  
  if (!testimonialsItems.length || !prevBtn || !nextBtn) return;
  
  let currentIndex = 0;
  
  function showTestimonial(index) {
    testimonialsItems.forEach((item, i) => {
      item.classList.toggle('gates-testimonials__item--active', i === index);
    });
  }
  
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonialsItems.length;
    showTestimonial(currentIndex);
  }
  
  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonialsItems.length) % testimonialsItems.length;
    showTestimonial(currentIndex);
  }
  
  // Обработчики событий
  nextBtn.addEventListener('click', nextTestimonial);
  prevBtn.addEventListener('click', prevTestimonial);
  
  // Автоматическое переключение каждые 5 секунд
  setInterval(nextTestimonial, 5000);
})();

// Gates Player Playlist
(function() {
  const playlistItems = document.querySelectorAll('.gates-player__playlist-item');
  
  if (!playlistItems.length) return;
  
  playlistItems.forEach(item => {
    item.addEventListener('click', function() {
      // Убираем активный класс со всех элементов
      playlistItems.forEach(i => i.classList.remove('gates-player__playlist-item--active'));
      
      // Добавляем активный класс к текущему элементу
      this.classList.add('gates-player__playlist-item--active');
      
      // Здесь можно добавить логику для переключения видео/аудио
      console.log('Переключение на:', this.textContent.trim());
    });
  });
})();

// Gates Growth Timeline Animation
(function() {
  const growthItems = document.querySelectorAll('.gates-growth__item');
  
  if (!growthItems.length) return;
  
  // Анимация появления элементов при прокрутке
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, {
    threshold: 0.1
  });
  
  growthItems.forEach((item, index) => {
    // Начальное состояние
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    
    observer.observe(item);
  });
})();

// Gates Forms Validation
(function() {
  const askPastorForms = document.querySelectorAll('#askPastorForm');
  const prayerRequestForms = document.querySelectorAll('#prayerRequestForm');
  
  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      const hasValue = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';
      
      if (!hasValue) {
        input.classList.add('error');
        isValid = false;
      } else {
        input.classList.remove('error');
      }
    });
    
    return isValid;
  }
  
  function handleFormSubmit(form, formType) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        // Симуляция отправки формы
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправляется...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          submitBtn.textContent = 'Отправлено!';
          submitBtn.style.backgroundColor = '#28a745';
          
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '';
            form.reset();
          }, 2000);
        }, 1000);
        
        console.log(`${formType} форма отправлена`);
      } else {
        console.log('Форма содержит ошибки');
      }
    });
  }
  
  // Обработка форм "Задать вопрос пастору"
  askPastorForms.forEach(form => {
    handleFormSubmit(form, 'Ask Pastor');
  });
  
  // Обработка форм "Просьба о молитве"
  prayerRequestForms.forEach(form => {
    handleFormSubmit(form, 'Prayer Request');
  });
})();

// Gates Event Registration
(function() {
  const registerButtons = document.querySelectorAll('.gates-events__item-register');
  
  if (!registerButtons.length) return;
  
  registerButtons.forEach(button => {
    button.addEventListener('click', function() {
      const eventItem = this.closest('.gates-events__item');
      const eventTitle = eventItem.querySelector('.gates-events__item-title').textContent;
      
      // Симуляция регистрации
      const originalText = this.textContent;
      this.textContent = 'Регистрируем...';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = 'Зарегистрирован!';
        this.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
          this.style.backgroundColor = '';
        }, 2000);
      }, 1000);
      
      console.log(`Регистрация на событие: ${eventTitle}`);
    });
  });
})();

// Gates Map Interaction
(function() {
  const mapPlaceholders = document.querySelectorAll('.gates-church-map__placeholder');
  
  if (!mapPlaceholders.length) return;
  
  mapPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', function() {
      // Симуляция загрузки карты
      this.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p>Загружаем карту...</p>
        </div>
      `;
      
      setTimeout(() => {
        this.innerHTML = `
          <span class="material-icons" aria-hidden="true">location_on</span>
          <p>Карта загружена</p>
          <p>Нажмите для поиска ближайших церквей</p>
        `;
      }, 2000);
    });
  });
})();

// Gates Smooth Scroll
(function() {
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  if (!smoothScrollLinks.length) return;
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// Gates Intersection Observer for Animations
(function() {
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Наблюдаем за секциями
  const sections = document.querySelectorAll('.gates-hero, .gates-content, .gates-growth, .gates-player, .gates-testimonials, .gates-events, .gates-ask-pastor, .gates-church-map, .gates-prayer-request, .gates-cta');
  
  sections.forEach(section => {
    observer.observe(section);
  });
})();

// Gates Keyboard Navigation
(function() {
  const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
  
  if (!focusableElements.length) return;
  
  document.addEventListener('keydown', function(e) {
    // Tab navigation
    if (e.key === 'Tab') {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    // Escape key to close modals or reset forms
    if (e.key === 'Escape') {
      const activeForm = document.querySelector('form:focus-within');
      if (activeForm) {
        activeForm.reset();
        activeForm.querySelector('input, textarea, select').blur();
      }
    }
  });
})();

// CSS Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .animate-in {
    animation: fadeIn 0.6s ease-out;
  }
  
  .error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
  }
`;
document.head.appendChild(style);

console.log('Gates pages functionality loaded');

// =====================
// PLAYLIST EXPANDABLE FUNCTIONALITY
// =====================
document.addEventListener('DOMContentLoaded', function() {
  const playlistHeaders = document.querySelectorAll('.media-playlist__header');
  
  if (playlistHeaders.length === 0) {
    setTimeout(() => {
      const retryHeaders = document.querySelectorAll('.media-playlist__header');
      if (retryHeaders.length > 0) {
        initializePlaylists(retryHeaders);
      }
    }, 100);
    return;
  }
  
  initializePlaylists(playlistHeaders);
});

function initializePlaylists(playlistHeaders) {
  // Обработка плейлистов
  playlistHeaders.forEach((header, index) => {
    header.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      // Закрываем все другие плейлисты
      playlistHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          const otherContent = otherHeader.nextElementSibling;
          if (otherContent) {
            otherContent.classList.remove('media-playlist__content--open');
          }
        }
      });
      
      // Переключаем текущий плейлист
      header.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('media-playlist__content--open');
      }
    });
  });
}

// =====================
// ABOUT US PAGE FUNCTIONALITY
// =====================
(function() {
  // Проверяем, что мы на странице about-us
  if (!document.querySelector('.hero') || !document.querySelector('.feedback__form')) {
    return;
  }

  // =====================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // =====================
  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Пропускаем пустые якоря
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        
        // Закрываем мобильное меню если открыто
        const mobileMenu = document.querySelector('.header__menu');
        if (mobileMenu && mobileMenu.classList.contains('header__menu--open')) {
          const closeBtn = document.querySelector('.header__menu-close');
          if (closeBtn) closeBtn.click();
        }
        
        // Плавная прокрутка
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Обновляем URL без перезагрузки страницы
        history.pushState(null, null, href);
      });
    });
  }

  // =====================
  // FORM VALIDATION AND SUBMISSION
  // =====================
  function initFormHandling() {
    const feedbackForm = document.getElementById('feedbackForm');
    const prayerForm = document.getElementById('prayerRequestForm');
    
    // Обработка формы обратной связи
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
          submitForm(this, 'feedback');
        }
      });
    }
    
    // Обработка формы молитвенных просьб
    if (prayerForm) {
      prayerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
          submitForm(this, 'prayer');
        }
      });
    }
  }
  
  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Очищаем предыдущие ошибки
    clearFormErrors(form);
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        showFieldError(field, 'Это поле обязательно для заполнения');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showFieldError(field, 'Введите корректный email адрес');
        isValid = false;
      }
    });
    
    // Проверяем чекбокс согласия
    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (privacyCheckbox && !privacyCheckbox.checked) {
      showFieldError(privacyCheckbox, 'Необходимо согласие на обработку данных');
      isValid = false;
    }
    
    return isValid;
  }
  
  function showFieldError(field, message) {
    const formGroup = field.closest('.feedback__form-group, .prayer-request__form-group');
    if (!formGroup) return;
    
    // Удаляем существующую ошибку
    const existingError = formGroup.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Добавляем новую ошибку
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: var(--secondary);
      font-size: var(--font-size-sm);
      margin-top: 4px;
    `;
    
    formGroup.appendChild(errorElement);
    field.style.borderColor = 'var(--secondary)';
    
    // Фокус на поле с ошибкой
    field.focus();
  }
  
  function clearFormErrors(form) {
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
    
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.style.borderColor = '';
    });
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function submitForm(form, type) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Показываем состояние загрузки
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Имитируем отправку (в реальном проекте здесь был бы AJAX запрос)
    setTimeout(() => {
      // Показываем сообщение об успехе
      showSuccessMessage(form, type);
      
      // Сбрасываем форму
      form.reset();
      
      // Восстанавливаем кнопку
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
  
  function showSuccessMessage(form, type) {
    const container = form.closest('.feedback__container, .prayer-request__container');
    if (!container) return;
    
    const message = document.createElement('div');
    message.className = 'success-message';
    message.style.cssText = `
      background: #d4edda;
      color: #155724;
      padding: 16px;
      border-radius: var(--border-radius);
      margin-bottom: 24px;
      border: 1px solid #c3e6cb;
      text-align: center;
      font-weight: 500;
    `;
    
    if (type === 'feedback') {
      message.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
    } else if (type === 'prayer') {
      message.textContent = 'Спасибо за вашу молитвенную просьбу. Мы помолимся за вас.';
    }
    
    // Вставляем сообщение перед формой
    form.parentNode.insertBefore(message, form);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  // =====================
  // ANIMATIONS ON SCROLL
  // =====================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animatedElements = document.querySelectorAll(`
      .target-audience__card,
      .principles__item,
      .team__stat,
      .partners__item,
      .statistics__item,
      .how-we-work__step,
      .contacts__method
    `);
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
    
    // CSS для анимации
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  // =====================
  // STATISTICS COUNTER ANIMATION
  // =====================
  function initStatisticsCounter() {
    const statisticsItems = document.querySelectorAll('.statistics__item');
    
    const observerOptions = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    statisticsItems.forEach(item => {
      observer.observe(item);
    });
  }
  
  function animateCounter(item) {
    const numberElement = item.querySelector('.statistics__number');
    if (!numberElement) return;
    
    const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
    const suffix = numberElement.textContent.replace(/\d/g, '');
    
    let currentNumber = 0;
    const increment = finalNumber / 50; // Анимация за 50 шагов
    const duration = 2000; // 2 секунды
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
      currentNumber += increment;
      if (currentNumber >= finalNumber) {
        currentNumber = finalNumber;
        clearInterval(timer);
      }
      numberElement.textContent = Math.floor(currentNumber) + suffix;
    }, stepTime);
  }

  // =====================
  // PHONE MASK
  // =====================
  function initPhoneMask() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name*="phone"]');
    
    phoneInputs.forEach(input => {
      input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
          if (value.length <= 1) {
            value = `+7 (${value}`;
          } else if (value.length <= 4) {
            value = `+7 (${value.slice(1)}`;
          } else if (value.length <= 7) {
            value = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
          } else if (value.length <= 9) {
            value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
          } else {
            value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
          }
        }
        
        e.target.value = value;
      });
      
      input.addEventListener('keydown', function(e) {
        // Разрешаем: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
          return;
        }
        // Разрешаем только цифры
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
        }
      });
    });
  }

  // =====================
  // ACCESSIBILITY ENHANCEMENTS
  // =====================
  function initAccessibility() {
    // Добавляем ARIA-live регион для уведомлений
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
    
    // Функция для объявления сообщений
    window.announceToScreenReader = function(message) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    };
    
    // Улучшаем навигацию с клавиатуры
    const focusableElements = document.querySelectorAll(`
      a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])
    `);
    
    focusableElements.forEach(element => {
      element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary)';
        this.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
      });
    });
  }

  // =====================
  // INITIALIZATION
  // =====================
  function init() {
    initSmoothScrolling();
    initFormHandling();
    initScrollAnimations();
    initStatisticsCounter();
    initPhoneMask();
    initAccessibility();
  }
  
  // Запускаем инициализацию после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Enhanced Gates Functionality for Updated Content
(function() {
  'use strict';

  // =====================
  // ENHANCED GATES CONTENT FILTERING
  // =====================
  function initEnhancedContentFiltering() {
    const contentFilters = document.querySelectorAll('.gates-content__filter');
    const contentCards = document.querySelectorAll('.gates-content__card');
    
    if (!contentFilters.length || !contentCards.length) return;
    
    // Добавляем анимацию при фильтрации
    function filterContentWithAnimation(type) {
      contentCards.forEach((card, index) => {
        const cardType = card.getAttribute('data-type');
        const shouldShow = type === 'all' || cardType === type;
        
        // Добавляем задержку для анимации
        setTimeout(() => {
          if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Анимация появления
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }, index * 50); // Задержка для каскадного эффекта
      });
    }
    
    contentFilters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Убираем активный класс со всех фильтров
        contentFilters.forEach(f => f.classList.remove('gates-content__filter--active'));
        
        // Добавляем активный класс к текущему фильтру
        this.classList.add('gates-content__filter--active');
        
        // Фильтруем контент с анимацией
        const filterType = this.getAttribute('data-type');
        filterContentWithAnimation(filterType);
        
        // Обновляем ARIA-атрибуты для доступности
        contentFilters.forEach(f => {
          f.setAttribute('aria-pressed', f === this ? 'true' : 'false');
        });
      });
    });
  }

  // =====================
  // ENHANCED GROWTH TIMELINE
  // =====================
  function initEnhancedGrowthTimeline() {
    const growthItems = document.querySelectorAll('.gates-growth__item');
    
    if (!growthItems.length) return;
    
    // Создаем интерактивную временную линию
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const index = Array.from(growthItems).indexOf(item);
          
          // Анимация появления с задержкой
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
            
            // Добавляем эффект "завершения" для первого элемента
            if (index === 0) {
              item.classList.add('gates-growth__item--completed');
            }
          }, index * 200);
        }
      });
    }, { threshold: 0.3 });
    
    growthItems.forEach((item, index) => {
      // Начальное состояние
      item.style.opacity = '0';
      item.style.transform = 'translateX(-30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      observer.observe(item);
      
      // Добавляем интерактивность при клике
      item.addEventListener('click', function() {
        // Переключаем состояние "завершено"
        this.classList.toggle('gates-growth__item--completed');
        
        // Обновляем ARIA-атрибуты
        const isCompleted = this.classList.contains('gates-growth__item--completed');
        this.setAttribute('aria-expanded', isCompleted.toString());
        
        // Анимация изменения
        this.style.transform = 'scale(1.02)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 150);
      });
    });
  }

  // =====================
  // ENHANCED CHURCH MAP INTERACTION
  // =====================
  function initEnhancedChurchMap() {
    const mapPlaceholders = document.querySelectorAll('.gates-church-map__placeholder');
    
    if (!mapPlaceholders.length) return;
    
    mapPlaceholders.forEach(placeholder => {
      // Добавляем интерактивность
      placeholder.style.cursor = 'pointer';
      placeholder.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      
      placeholder.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      });
      
      placeholder.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '';
      });
      
      placeholder.addEventListener('click', function() {
        // Анимация клика
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.style.transform = 'scale(1.02)';
        }, 100);
        
        // Симуляция загрузки карты
        const originalContent = this.innerHTML;
        this.innerHTML = `
          <span class="material-icons" aria-hidden="true">refresh</span>
          <p>Загружаем карту церквей...</p>
        `;
        
        setTimeout(() => {
          this.innerHTML = `
            <span class="material-icons" aria-hidden="true">location_on</span>
            <p>Карта церквей загружена</p>
            <p>Нажмите на маркер для получения информации</p>
          `;
        }, 2000);
        
        // Обновляем ARIA-атрибуты
        this.setAttribute('aria-label', 'Интерактивная карта церквей МСЦ ЕХБ');
      });
    });
  }

  // =====================
  // ENHANCED TESTIMONIALS CAROUSEL
  // =====================
  function initEnhancedTestimonials() {
    const testimonialsItems = document.querySelectorAll('.gates-testimonials__item');
    const prevBtn = document.querySelector('.gates-testimonials__prev');
    const nextBtn = document.querySelector('.gates-testimonials__next');
    
    if (!testimonialsItems.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    
    function showTestimonial(index) {
      if (isAnimating) return;
      isAnimating = true;
      
      testimonialsItems.forEach((item, i) => {
        const isActive = i === index;
        item.classList.toggle('gates-testimonials__item--active', isActive);
        
        // Анимация перехода
        if (isActive) {
          item.style.opacity = '0';
          item.style.transform = 'translateX(30px)';
          
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          });
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'translateX(-30px)';
        }
      });
      
      // Обновляем ARIA-атрибуты
      testimonialsItems.forEach((item, i) => {
        item.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
      });
      
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
    
    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % testimonialsItems.length;
      showTestimonial(currentIndex);
    }
    
    function prevTestimonial() {
      currentIndex = (currentIndex - 1 + testimonialsItems.length) % testimonialsItems.length;
      showTestimonial(currentIndex);
    }
    
    // Обработчики событий
    nextBtn.addEventListener('click', nextTestimonial);
    prevBtn.addEventListener('click', prevTestimonial);
    
    // Автоматическое переключение
    let autoPlayInterval = setInterval(nextTestimonial, 5000);
    
    // Останавливаем автопрокрутку при взаимодействии
    [prevBtn, nextBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextTestimonial, 5000);
      });
    });
    
    // Инициализация
    showTestimonial(0);
  }

  // =====================
  // ENHANCED FORM VALIDATION
  // =====================
  function initEnhancedFormValidation() {
    const forms = document.querySelectorAll('.gates-ask-pastor__form, .gates-prayer-request__form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Валидация в реальном времени
        input.addEventListener('blur', function() {
          validateField(this);
        });
        
        input.addEventListener('input', function() {
          // Убираем ошибку при вводе
          if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errorMsg = this.parentNode.querySelector('.error-message');
            if (errorMsg) {
              errorMsg.remove();
            }
          }
        });
      });
      
      // Валидация при отправке формы
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
          if (!validateField(input)) {
            isValid = false;
          }
        });
        
        if (isValid) {
          // Симуляция отправки
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.textContent;
          
          submitBtn.textContent = 'Отправляем...';
          submitBtn.disabled = true;
          
          setTimeout(() => {
            submitBtn.textContent = 'Отправлено!';
            submitBtn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              submitBtn.style.backgroundColor = '';
              form.reset();
            }, 2000);
          }, 1500);
        }
      });
    });
    
    function validateField(field) {
      const value = field.value.trim();
      const isRequired = field.hasAttribute('required');
      const type = field.type;
      
      let isValid = true;
      let errorMessage = '';
      
      if (isRequired && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
      } else if (type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Введите корректный email адрес';
      } else if (type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Введите корректный номер телефона';
      }
      
      if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
      }
      
      return isValid;
    }
    
    function showFieldError(field, message) {
      // Убираем существующее сообщение об ошибке
      const existingError = field.parentNode.querySelector('.error-message');
      if (existingError) {
        existingError.remove();
      }
      
      // Добавляем новое сообщение об ошибке
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      errorDiv.style.color = '#FF0000';
      errorDiv.style.fontSize = '0.875rem';
      errorDiv.style.marginTop = '0.25rem';
      
      field.parentNode.appendChild(errorDiv);
    }
    
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
  }

  // =====================
  // INITIALIZATION
  // =====================
  function init() {
    initEnhancedContentFiltering();
    initEnhancedGrowthTimeline();
    initEnhancedChurchMap();
    initEnhancedTestimonials();
    initEnhancedFormValidation();
  }
  
  // Запускаем инициализацию после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();