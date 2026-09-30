window.SITE = {
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbweyQ5oNMB894yJBfLbAxsgJSbxzLIUqJts8IxUZZn7tG-psB9YYGvyWpyXN-BYI-W8/exec',
  WHATSAPP: '918849125463',
  PHONE: '+918849125463'
};

document.addEventListener('DOMContentLoaded', function () {

  // Mobile navigation
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.navlinks');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  // Scroll reveal
  var els = document.querySelectorAll('.reveal');

  if (
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    els.forEach(function (e) {
      io.observe(e);
    });

  } else {
    els.forEach(function (e) {
      e.classList.add('in');
    });
  }

  // WhatsApp links
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href =
      'https://wa.me/' +
      window.SITE.WHATSAPP +
      '?text=' +
      encodeURIComponent(
        'Hello Yatharth Solutions, I would like to discuss my investment requirements.'
      );

    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Call links
  document.querySelectorAll('[data-call]').forEach(function (a) {
    a.href = 'tel:' + window.SITE.PHONE;
  });

  // Contact form
  var f = document.getElementById('f');

  if (f) {

    var m = document.getElementById('msg');
    var sb = f.querySelector('button[type=submit]');

    function say(t, ok) {
      m.style.color = ok ? '#146356' : '#B42318';
      m.textContent = t;
    }

    // Prefill goal from ?goal=
    var qp = new URLSearchParams(location.search);

    if (qp.get('goal') && f.goal) {
      f.goal.value = qp.get('goal');
    }

    f.addEventListener('submit', function (e) {

      e.preventDefault();

      // Honeypot
      if (f.company.value) return;

      // Browser validation
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }

      var name = f.n.value.trim();

      var ph = f.p.value
        .replace(/[\s\-()]/g, '')
        .replace(/^(\+91|91|0)(?=\d{10}$)/, '');

      var email = f.e.value.trim();

      // Name validation
      if (name.length < 2) {
        say('Please enter your full name.');
        return;
      }

      // Mobile validation
      if (!/^[6-9]\d{9}$/.test(ph)) {
        say('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        say('Please enter a valid email address.');
        return;
      }

      // Consent
      if (!f.consent.checked) {
        say('Please tick the consent box so we can contact you.');
        return;
      }

      // Check connection
      if (
        !window.SITE.SHEET_URL ||
        window.SITE.SHEET_URL.indexOf('https://script.google.com/') !== 0
      ) {
        say('The form is not connected yet.');
        return;
      }

      sb.disabled = true;
      sb.textContent = 'Sending...';
      say('');

      // Data sent to Google Apps Script
      var d = new URLSearchParams({
        name: name,
        mobile: '+91' + ph,
        email: email,
        iam: f.iam.value,
        amount: f.amount.value,
        goal: f.goal.value,
        consent: f.consent.checked ? 'Yes' : 'No',
        page: location.href
      });

      fetch(window.SITE.SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: d
      })
      .then(function () {

        f.reset();

        say(
          'Thank you. We have received your request and will call you shortly.',
          true
        );

      })
      .catch(function () {

        say(
          'Sorry, something went wrong. Please try again or reach us on WhatsApp.'
        );

      })
      .finally(function () {

        sb.disabled = false;
        sb.textContent = 'Request a call';

      });

    });
  }
});
