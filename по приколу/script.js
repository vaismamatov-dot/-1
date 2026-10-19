/* LIGHTS UI interactions: initialized after the page has been parsed. */
document.addEventListener('DOMContentLoaded', () => {
  const programs = [
    { id:'01', name:'Student Voice', short:'Обратная связь: идеи, проблемы и мнение учеников.', detail:'Важно не только собирать предложения, но и показывать результат их рассмотрения.', icon:'bi-chat-square-heart', kicker:'ГОЛОС УЧЕНИКОВ' },
    { id:'02', name:'LIGHTS Opportunities', short:'Единое пространство возможностей.', detail:'Олимпиады, конкурсы, конференции, волонтёрские проекты, спортивные соревнования и другие возможности.', icon:'bi-compass', kicker:'ВОЗМОЖНОСТИ' },
    { id:'03', name:'LIGHTS League', short:'Внутришкольные соревнования.', detail:'Спорт, интеллектуальные игры, дебаты и творческие конкурсы.', icon:'bi-trophy', kicker:'СОРЕВНОВАНИЯ' },
    { id:'04', name:'Student Projects', short:'Площадка для инициатив учеников.', detail:'Помощь с командой, организацией и доведением идеи до результата.', icon:'bi-rocket-takeoff', kicker:'ИНИЦИАТИВЫ' },
    { id:'05', name:'LIGHTS Talks', short:'Лекции, встречи и открытые разговоры.', detail:'Делиться знаниями смогут специалисты, ученики и учителя.', icon:'bi-mic', kicker:'ОБМЕН ЗНАНИЯМИ' },
    { id:'06', name:'LIGHTS Media', short:'Истории и жизнь школы.', detail:'Интервью, истории учеников, достижения, мероприятия и проекты.', icon:'bi-camera-reels', kicker:'МЕДИА' },
    { id:'07', name:'LIGHTS Community', short:'Создание школьного сообщества.', detail:'Творческие вечера, выставки, благотворительные акции, ярмарки клубов, тематические дни и другие форматы.', icon:'bi-people', kicker:'СООБЩЕСТВО' }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cardsRoot = $('#programCards');
  const programModalEl = $('#programModal');
  const programModalTitle = $('#programModalTitle');

  // Create the seven program cards only when their container exists.
  if (cardsRoot) {
    cardsRoot.innerHTML = programs.map((item, index) => `
      <div class="col-lg-4 col-md-6 reveal" style="transition-delay:${(index % 3) * 80}ms">
        <article class="card glass-card program-card h-100" tabindex="0" role="button" aria-label="Подробнее: ${item.name}" data-program="${item.id}">
          <div class="card-body p-4 p-xl-5">
            <div class="d-flex align-items-center justify-content-between"><div class="program-icon"><i class="bi ${item.icon}"></i></div><span class="program-index">${item.id} / 07</span></div>
            <h3 class="card-title h4 mt-4">${item.name}</h3><p class="card-text mt-2">${item.short}</p>
            <span class="card-action">Узнать о направлении <i class="bi bi-arrow-up-right ms-1"></i></span>
          </div>
        </article>
      </div>`).join('');

    const openProgramCard = card => {
      const program = programs.find(item => item.id === card.dataset.program);
      if (!program || !programModalEl || !window.bootstrap?.Modal) return;
      const kicker = $('#programModalKicker');
      const icon = $('#programModalIcon');
      const description = $('#programModalDescription');
      const detail = $('#programModalDetail');
      if (!programModalTitle || !kicker || !icon || !description || !detail) return;

      kicker.textContent = `${program.id} / 07 • ${program.kicker}`;
      programModalTitle.textContent = program.name;
      icon.innerHTML = `<i class="bi ${program.icon}" aria-hidden="true"></i>`;
      description.textContent = program.short;
      detail.textContent = program.detail;
      window.bootstrap.Modal.getOrCreateInstance(programModalEl).show();
    };

    cardsRoot.addEventListener('click', event => {
      const card = event.target.closest('[data-program]');
      if (card) openProgramCard(card);
    });
    cardsRoot.addEventListener('keydown', event => {
      const card = event.target.closest('[data-program]');
      if (card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openProgramCard(card);
      }
    });
  }

  // Smooth in-page navigation, preserving the hash and leaving the page loaded.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = $(hash);
    if (!target) return;
    event.preventDefault();
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' });
  });

  // Bootstrap handles the collapse animation; this closes it after a mobile nav selection.
  const navbarCollapse = $('#navLinks');
  if (navbarCollapse && window.bootstrap?.Collapse) {
    navbarCollapse.addEventListener('click', event => {
      if (event.target.closest('a.nav-link') && navbarCollapse.classList.contains('show')) {
        window.bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  }

  // Bootstrap scrollspy controls the active section state in the fixed navbar.
  if (window.bootstrap?.ScrollSpy && $('#mainNav')) {
    window.bootstrap.ScrollSpy.getOrCreateInstance(document.body, { target:'#mainNav', rootMargin:'0px 0px -35%' });
  }

  const backToTop = $('#backToTop');
  const home = $('#home');
  const navbar = $('.navbar-lights');
  const updateScrollUI = () => {
    const pastHero = window.scrollY > 420;
    backToTop?.classList.toggle('show', pastHero);
    navbar?.classList.toggle('scrolled', window.scrollY > 15);
  };
  window.addEventListener('scroll', updateScrollUI, { passive:true });
  updateScrollUI();
  backToTop?.addEventListener('click', () => {
    if (home) {
      if (window.location.hash !== '#home') window.history.pushState(null, '', '#home');
      home.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' });
    } else {
      window.scrollTo({ top:0, behavior:'smooth' });
    }
  });

  // Reveal content on scroll; show it immediately if IntersectionObserver is unavailable.
  const revealElements = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold:.14, rootMargin:'0px 0px -35px 0px' });
    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  // This is a local demo only: validate, show confirmation, and never transmit data.
  const ideaForm = $('#ideaForm');
  const formSuccess = $('#formSuccess');
  const ideaModal = $('#ideaModal');
  if (ideaForm && formSuccess) {
    ideaForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!ideaForm.reportValidity()) return;
      formSuccess.classList.remove('d-none');
      ideaForm.reset();
    });

    // Reopening the form always starts clean, including after an incomplete attempt.
    ideaModal?.addEventListener('show.bs.modal', () => {
      ideaForm.reset();
      formSuccess.classList.add('d-none');
    });
    ideaModal?.addEventListener('hidden.bs.modal', () => {
      ideaForm.reset();
      formSuccess.classList.add('d-none');
    });
  }
});
