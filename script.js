// Fade the page in once it has loaded, and fade out before internal navigation.
// This runs immediately (not wrapped in DOMContentLoaded) so the fade-in class
// gets added as early as possible.
(function initPageTransitions() {
  function showPage() {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('page-visible');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPage);
  } else {
    showPage();
  }

  // Fade out on internal navigation, then let the browser load the next page.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (href.startsWith('http://') || href.startsWith('https://')) return;
    if (link.target === '_blank') return;

    event.preventDefault();
    document.documentElement.classList.remove('page-visible');
    window.setTimeout(() => {
      window.location.href = href;
    }, 220);
  });

  // Fade back in if the page is restored from the browser cache (back/forward).
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) showPage();
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  initClipboardCopy();
});

// Copy-to-clipboard for contact details, with a small toast notification.
function initClipboardCopy() {
  const buttons = document.querySelectorAll('.copy-target');
  const toast = document.getElementById('toast');
  if (!buttons.length || !toast) return;

  let hideTimer = null;

  function showToast(message) {
    toast.textContent = message;
    window.clearTimeout(hideTimer);
    toast.classList.add('toast-visible');
    hideTimer = window.setTimeout(() => {
      toast.classList.remove('toast-visible');
    }, 3000);
  }

  async function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const temp = document.createElement('textarea');
    temp.value = value;
    temp.setAttribute('readonly', '');
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      if (!value) return;
      try {
        await copyText(value);
        showToast('Copied to clipboard');
      } catch (err) {
        showToast('Could not copy. Copy it manually.');
      }
    });
  });
}
