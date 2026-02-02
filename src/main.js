export function initLazyImages() {
  const images = document.querySelectorAll('img');

  const observerOptions = {
    root: null, // use viewport
    rootMargin: '50px', // start loading slightly before they enter
    threshold: 0.1
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Apply a smooth fade-in
        img.style.transition = 'opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1), transform 0.8s ease';
        img.style.opacity = '1';
        img.style.transform = 'translateY(0)';

        // Stop observing once loaded
        observer.unobserve(img);
      }
    });
  }, observerOptions);

  images.forEach(img => {
    // Initial state: hidden and slightly shifted down
    img.style.opacity = '0';
    img.style.transform = 'translateY(20px)';
    
    // Set native lazy loading attribute
    img.setAttribute('loading', 'lazy');
    
    imageObserver.observe(img);
  });
}

export function initLoader() {
  const ids = {
    bar: "3bfcdfb9-e5bb-e7d0-1288-8228b9dfc7af",
    container: "5109e22f56d2d5acc899fad51388a5a6",
    h1: "bdd5af62d46f0222f61908a1cff92f16", 
    h2: "d2cccb99406ea65bd00767a6eb12c2d7",
    v1: "4cd65637f03bda976f25a3b0f52bdb8c", 
    v2: "9137d4b25473cd4e4bd67ec58b89ace0",
    scrollBar: "1c58f03a23e78f05954cae7628f8392f" 
  };

  const el = {};
  for (const [key, id] of Object.entries(ids)) {
    el[key] = document.querySelector(`[data-id="${id}"]`);
  }

  const hFrames = [el.h1, el.h2].filter(Boolean);
  const vFrames = [el.v1, el.v2].filter(Boolean);
  const percentNumber = document.querySelector('.div-block-57 .christopher---stur-loading:first-child');

  if (!el.bar || !el.container) return;

  // --- INITIAL STATE ---
  vFrames.forEach(f => {
    f.style.setProperty('height', '100vh', 'important');
    f.style.setProperty('width', '50vw', 'important');
    f.style.transition = 'none';
  });
  hFrames.forEach(f => {
    f.style.setProperty('width', '100vw', 'important');
    f.style.setProperty('height', '50vh', 'important');
    f.style.transition = 'none';
  });
  
  // Set Scroll Bar to 0 scale initially
  if (el.scrollBar) {
    el.scrollBar.style.transform = 'scaleX(0)';
  }

  el.container.style.setProperty('z-index', '997', 'important');

  // --- PHASE 1: Loading ---
  el.bar.style.transition = 'width 1s cubic-bezier(0.65, 0, 0.35, 1)';
  setTimeout(() => { el.bar.style.width = '100%'; }, 50);
  
  if (percentNumber) animateNumber(percentNumber, 0, 100, 1000);

  // --- PHASE 2: The Reveal ---
  setTimeout(() => {
    const ease = '0.75s cubic-bezier(0.65, 0, 0.35, 1)';

    el.container.style.transition = 'opacity 0.5s ease-in-out';
    el.container.style.opacity = '0';

    vFrames.forEach(f => {
      f.style.setProperty('transition', `width ${ease}`, 'important');
      f.style.setProperty('width', '1.5rem', 'important');
    });

    hFrames.forEach(f => {
      f.style.setProperty('transition', `height ${ease}`, 'important');
      f.style.setProperty('height', '1.5rem', 'important');
    });

    // Initialize Scroll Tracker
    initScrollTracker(el.scrollBar);

    // Start handling images once the screen begins to open
    initLazyImages();

    setTimeout(() => { el.container.style.display = 'none'; }, 750);
  }, 1500);
}

function initScrollTracker(scrollElement) {
  if (!scrollElement) return;

  // We use window scroll event to update the scaleX
  const updateScroll = () => {
    const winScroll = window.pageYOffset || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Calculate 0 to 1 decimal
    const scrolled = height > 0 ? winScroll / height : 0;
    
    // scaleX(1) will result in the 15vw defined in your CSS
    scrollElement.style.transform = `scaleX(${scrolled})`;
  };

  window.addEventListener('scroll', updateScroll);
  updateScroll(); // Initialize on load in case they refreshed mid-page
}

function animateNumber(element, start, end, duration) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    element.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

initLoader();