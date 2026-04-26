/*NAV SCROLL*/
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

/*MOBILE MENU*/
const toggle    = document.getElementById('navToggle');
const mobileNav = document.getElementById('navMobile');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

/*REVEAL ON SCROLL*/
const reveals  = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = Array.from(reveals).indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (idx % 3) * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

/*SKILL BAR ANIMATION*/
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.classList.add('animated');
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('#skills').forEach(el => barObserver.observe(el));

/*FORM SUBMIT WITH EMAILJS*/
async function handleSubmit() {
  const nameInput    = document.getElementById('nameInput');
  const emailInput   = document.getElementById('emailInput');
  const projectInput = document.getElementById('projectInput');
  const messageInput = document.getElementById('messageInput');
  const submitBtn    = document.getElementById('submitBtn');
  const submitText   = document.getElementById('submitText');
  const submitSpinner = document.getElementById('submitSpinner');

  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const project = projectInput.value.trim();
  const message = messageInput.value.trim();

  //Basic validation
  if (!name || !email || !message) {
    showToast('⚠️', 'Please fill in your name, email, and message.', true);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('⚠️', 'Please enter a valid email address.', true);
    return;
  }

  //Show loading state
  submitBtn.disabled = true;
  submitText.style.display  = 'none';
  submitSpinner.style.display = 'inline';

  //Send via EmailJS
  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_name:      EMAILJS_CONFIG.toName,
        from_name:    name,
        from_email:   email,
        project_type: project || 'Not specified',
        message:      message,
        reply_to:     email,
      }
    );

    //Success
    showToast('✅', "Message sent! I'll be in touch within 24 hours.");
    nameInput.value    = '';
    emailInput.value   = '';
    projectInput.value = '';
    messageInput.value = '';

  } catch (error) {
    //Error
    console.error('EmailJS error:', error);
    showToast('❌', 'Something went wrong. Please try emailing me directly.', true);

  } finally {
    //Restore button
    submitBtn.disabled = false;
    submitText.style.display    = 'inline';
    submitSpinner.style.display = 'none';
  }
}

/*TOAST HELPER*/
let toastTimer = null;

function showToast(icon, message, isError = false) {
  const toast   = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMsg  = document.getElementById('toastMsg');

  toastIcon.textContent = icon;
  toastMsg.textContent  = message;

  toast.classList.toggle('error', isError);
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 5000);
}

/*ACTIVE NAV LINK HIGHLIGHT*/
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
  });
});