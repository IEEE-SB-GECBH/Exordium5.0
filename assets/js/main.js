/**
* Template Name: Clarity
* Template URL: https://bootstrapmade.com/clarity-bootstrap-agency-template/
* Updated: Sep 13 2025 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Show the registration-closed message without leaving the current page.
   */
  function showRegistrationClosedAlert(event) {
    if (event) event.preventDefault();

    const existingAlert = document.querySelector('#registration-closed-alert');
    if (existingAlert) {
      existingAlert.classList.add('is-visible');
      existingAlert.querySelector('.registration-closed-dialog button')?.focus();
      return;
    }

    const alertOverlay = document.createElement('div');
    alertOverlay.id = 'registration-closed-alert';
    alertOverlay.className = 'registration-closed-alert';
    alertOverlay.setAttribute('role', 'presentation');
    alertOverlay.innerHTML = `
      <div class="registration-closed-dialog" role="alertdialog" aria-modal="true"
        aria-labelledby="registration-closed-title" aria-describedby="registration-closed-message">
        <button class="registration-closed-close" type="button" aria-label="Close message">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        <div class="registration-closed-icon" aria-hidden="true">
          <div class="registration-closed-robot"></div>
        </div>
        <p class="registration-closed-kicker">Exordium 5.0</p>
        <h2 id="registration-closed-title">Registrations are closed</h2>
        <p id="registration-closed-message">Sorry, registrations for Exordium 5.0 are now closed. Thank you for your interest!</p>
        <button class="registration-closed-action" type="button">Understood</button>
      </div>`;

    const closeAlert = () => {
      alertOverlay.classList.remove('is-visible');
      setTimeout(() => alertOverlay.remove(), 220);
    };

    alertOverlay.addEventListener('click', (alertEvent) => {
      if (alertEvent.target === alertOverlay) closeAlert();
    });
    alertOverlay.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', closeAlert);
    });
    document.body.appendChild(alertOverlay);
    const robotSource = document.querySelector('.hero-robot, .floating-robot-icon svg');
    const alertRobot = alertOverlay.querySelector('.registration-closed-robot');
    if (robotSource && alertRobot) {
      alertRobot.appendChild(robotSource.cloneNode(true));
    }
    requestAnimationFrame(() => alertOverlay.classList.add('is-visible'));
    alertOverlay.querySelector('.registration-closed-close').focus();
    document.addEventListener('keydown', function closeOnEscape(keyEvent) {
      if (keyEvent.key === 'Escape' && document.body.contains(alertOverlay)) {
        closeAlert();
        document.removeEventListener('keydown', closeOnEscape);
      }
    });
  }

  window.showRegistrationClosedAlert = showRegistrationClosedAlert;
  document.querySelectorAll('a[data-registration-closed]').forEach((link) => {
    link.addEventListener('click', showRegistrationClosedAlert);
  });

  /**
   * Registration form steps
   */
  const registrationForm = document.querySelector('#registration-form');
  if (registrationForm) {
    const formSteps = [...registrationForm.querySelectorAll('.form-step')];
    const progressSteps = [...document.querySelectorAll('.progress-step')];
    let currentFormStep = 1;

    function showFormStep(stepNumber) {
      currentFormStep = stepNumber;
      formSteps.forEach((step) => {
        step.hidden = Number(step.dataset.step) !== currentFormStep;
      });
      progressSteps.forEach((item) => {
        const number = Number(item.dataset.progress);
        item.classList.toggle('active', number === currentFormStep);
        item.classList.toggle('complete', number < currentFormStep);
      });
      document.querySelector('#registration').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function updateRegistrationSummary() {
      const formData = new FormData(registrationForm);
      const selectedEvents = formData.getAll('events').join(', ');
      document.querySelector('#registration-summary').innerHTML = `
        <p><strong>Name:</strong> ${formData.get('fullName')}</p>
        <p><strong>Email:</strong> ${formData.get('email')}</p>
        <p><strong>College:</strong> ${formData.get('college')}</p>
        <p><strong>Events:</strong> ${selectedEvents}</p>
        <p><strong>Dietary preference:</strong> ${formData.get('dietary')}</p>`;
    }

    registrationForm.querySelectorAll('[data-next]').forEach((button) => {
      button.addEventListener('click', () => {
        const visibleFields = [...formSteps[currentFormStep - 1].querySelectorAll('input, select')];
        const invalidField = visibleFields.find((field) => !field.checkValidity());
        if (invalidField) {
          invalidField.reportValidity();
          return;
        }
        if (currentFormStep === 2) updateRegistrationSummary();
        showFormStep(currentFormStep + 1);
      });
    });

    registrationForm.querySelectorAll('[data-prev]').forEach((button) => {
      button.addEventListener('click', () => showFormStep(currentFormStep - 1));
    });

    registrationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formSteps.forEach((step) => { step.hidden = true; });
      document.querySelector('[data-success]').hidden = false;
      progressSteps.forEach((item) => item.classList.add('complete'));
    });
  }

})();