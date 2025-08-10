document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('drawer');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Init EmailJS
  if (window.emailjs) {
    emailjs.init('EsWrBOSm9pZoZOb6g'); // Replace with your EmailJS public key
  }

  const applyIcon = name => {
    themeToggle.innerHTML = '<i data-feather="' + name + '"></i>';
    if (window.feather) feather.replace();
  };

  // Theme handling
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    body.classList.add('dark-theme');
    applyIcon('sun');
  } else {
    body.classList.remove('dark-theme');
    applyIcon('moon');
  }

  // Mobile menu toggle
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
      burger.classList.toggle('active');
    });
  }

  // Theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyIcon(isDark ? 'sun' : 'moon');
    });
  }

  // Contact form
  if (contactForm && msg) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').trim();
      const email = (formData.get('email') || '').trim();
      const message = (formData.get('message') || '').trim();

      if (!name || !email || !message) {
        showMessage('❌ Please fill all fields.', '#ff4d4d');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('❌ Please enter a valid email address.', '#ff4d4d');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      emailjs.send(
        'service_0859uui',  // Replace with your Service ID
        'template_ch14nia', // Replace with your Template ID
        {
          from_name: name,
          reply_to: email,  // match EmailJS variable
          message: message
        }
      ).then(() => {
        showMessage(`✅ Thanks ${name}, your message has been sent!`, '#4ade80');
        contactForm.reset();
      }).catch((err) => {
        console.error('EmailJS error:', err);
        showMessage('❌ Something went wrong. Please try again.', '#ff4d4d');
      }).finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    });

    function showMessage(text, color) {
      msg.textContent = text;
      msg.style.color = color;
      setTimeout(() => { msg.textContent = ''; }, 5000);
    }
  }
});
