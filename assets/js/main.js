/*===== MODERN PORTFOLIO JAVASCRIPT =====*/

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  bindEvents() {
    const themeToggle = $('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
    
    // Update theme toggle icon
    const themeToggle = $('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Mobile Navigation
class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const toggle = $('.mobile-toggle');
    const menu = $('.nav-menu');
    const navLinks = $$('.nav-link');

    if (toggle && menu) {
      toggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const toggle = $('.mobile-toggle');
    const menu = $('.nav-menu');
    
    this.isOpen = !this.isOpen;
    
    toggle.classList.toggle('active', this.isOpen);
    menu.classList.toggle('active', this.isOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMenu() {
    if (this.isOpen) {
      this.toggleMenu();
    }
  }
}

// Active Navigation Links
class NavigationHighlighter {
  constructor() {
    this.sections = $$('.section');
    this.navLinks = $$('.nav-link');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink(); // Initial check
  }

  bindEvents() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// Typewriter Effect
class TypewriterEffect {
  constructor(element, texts, options = {}) {
    this.element = typeof element === 'string' ? $(element) : element;
    this.texts = Array.isArray(texts) ? texts : [texts];
    this.options = {
      typeSpeed: 100,
      backSpeed: 50,
      startDelay: 1000,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      ...options
    };
    
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.isPaused = false;
    
    this.init();
  }

  init() {
    if (!this.element) return;
    
    if (this.options.showCursor) {
      this.element.classList.add('typing-text');
    }
    
    setTimeout(() => this.type(), this.options.startDelay);
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];
    
    if (this.isDeleting) {
      this.currentCharIndex--;
    } else {
      this.currentCharIndex++;
    }
    
    // Update display
    this.element.textContent = currentText.substring(0, this.currentCharIndex);
    
    let typeSpeed = this.options.typeSpeed;
    
    if (this.isDeleting) {
      typeSpeed = this.options.backSpeed;
    }
    
    // Check if word is complete
    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = this.options.backDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      typeSpeed = this.options.typeSpeed;
    }
    
    if (this.options.loop || this.currentTextIndex < this.texts.length) {
      setTimeout(() => this.type(), typeSpeed);
    }
  }

  updateTexts(newTexts) {
    this.texts = Array.isArray(newTexts) ? newTexts : [newTexts];
    this.currentTextIndex = 0;
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Add staggered animation for children
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, options);
  }

  observeElements() {
    const elements = $$('.animate-on-scroll, .animate-fade-left, .animate-fade-right, .animate-scale');
    elements.forEach(el => this.observer.observe(el));
  }
}

// Email Copy Functionality
class EmailCopyHandler {
  constructor() {
    this.init();
  }

  init() {
    const copyBtn = $('#copy-email');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => this.copyEmail(e));
    }
  }

  async copyEmail(e) {
    const button = e.target;
    const email = button.dataset.email || 'your.email@example.com';
    
    try {
      await navigator.clipboard.writeText(email);
      this.showFeedback(button, 'Copied!', 'success');
    } catch (err) {
      // Fallback for older browsers
      this.fallbackCopyTextToClipboard(email);
      this.showFeedback(button, 'Copied!', 'success');
    }
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  }

  showFeedback(button, message, type = 'success') {
    const originalText = button.textContent;
    button.textContent = message;
    button.classList.add(`feedback-${type}`);
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove(`feedback-${type}`);
    }, 2000);
  }
}

// Smooth Scrolling
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const scrollLinks = $$('a[href^="#"]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e));
    });
  }

  handleClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = $(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 70; // Account for fixed header
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}

// Custom Cursor (Desktop only)
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorOutline = null;
    this.init();
  }

  init() {
    if (window.innerWidth > 768) {
      this.createCursor();
      this.bindEvents();
    }
  }

  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor-dot';
    
    this.cursorOutline = document.createElement('div');
    this.cursorOutline.className = 'cursor-outline';
    
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorOutline);
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top = e.clientY + 'px';
      
      this.cursorOutline.style.left = e.clientX + 'px';
      this.cursorOutline.style.top = e.clientY + 'px';
    });

    // Add hover effects
    const hoverElements = $$('a, button, .btn, .skill-card, .project-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.style.transform = 'scale(1.5)';
        this.cursorOutline.style.transform = 'scale(2)';
      });
      
      el.addEventListener('mouseleave', () => {
        this.cursor.style.transform = 'scale(1)';
        this.cursorOutline.style.transform = 'scale(1)';
      });
    });
  }
}

// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.lazyLoadImages();
    
    // Optimize scroll events
    this.optimizeScrollEvents();
  }

  lazyLoadImages() {
    const images = $$('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeScrollEvents() {
    let ticking = false;
    
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Trigger custom scroll event
          window.dispatchEvent(new CustomEvent('optimizedScroll'));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
  }
}

// Main Application
class PortfolioApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize all components
    this.components.themeManager = new ThemeManager();
    this.components.mobileNavigation = new MobileNavigation();
    this.components.navigationHighlighter = new NavigationHighlighter();
    this.components.scrollAnimations = new ScrollAnimations();
    this.components.emailCopyHandler = new EmailCopyHandler();
    this.components.smoothScroll = new SmoothScroll();
    this.components.customCursor = new CustomCursor();
    this.components.performanceMonitor = new PerformanceMonitor();

    // Initialize typewriter effect
    const heroRole = $('.hero-role');
    if (heroRole) {
      this.components.typewriter = new TypewriterEffect(
        heroRole,
        [
          'Frontend Developer',
          'UI/UX Designer',
          'React Specialist',
          'JavaScript Developer'
        ],
        {
          typeSpeed: 80,
          backSpeed: 40,
          backDelay: 2000,
          startDelay: 1000
        }
      );
    }

    // Add loading animation removal
    this.removeLoadingAnimation();
    
    console.log('Portfolio app initialized successfully!');
  }

  removeLoadingAnimation() {
    const loader = $('.loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 500);
      }, 1000);
    }
  }
}

// Initialize the application
const portfolioApp = new PortfolioApp();

// Export for potential external use
window.PortfolioApp = {
  app: portfolioApp,
  ThemeManager,
  TypewriterEffect,
  ScrollAnimations
};


document.getElementById("scroll-indicator").addEventListener("click", () => {
    const scrollTo = window.innerHeight; // scrolls 1 viewport height
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth"
    });
  });