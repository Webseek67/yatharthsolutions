window.SITE = {
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbweyQ5oNMB894yJBfLbAxsgJSbxzLIUqJts8IxUZZn7tG-psB9YYGvyWpyXN-BYI-W8/exec',
  WHATSAPP: '918849125463',
  PHONE: '+918849125463'
};

document.addEventListener('DOMContentLoaded', function () {

  // ==============================
  // MOBILE NAVIGATION
  // ==============================

  var burger = document.querySelector('.burger');
  var links = document.querySelector('.navlinks');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }


  // ==============================
  // SCROLL REVEAL
  // ==============================

  var els = document.querySelectorAll('.reveal');

  if (
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {

    var io = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.2
    });

    els.forEach(function (el) {
      io.observe(el);
    });

  } else {

    els.forEach(function (el) {
      el.classList.add('in');
    });

  }


  // ==============================
  // WHATSAPP LINKS
  // ==============================

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


  // ==============================
  // CALL LINKS
  // ==============================

  document.querySelectorAll('[data-call]').forEach(function (a) {
    a.href = 'tel:' + window.SITE.PHONE;
  });


  // ==============================
  // CONTACT FORM
  // ==============================

  var f = document.getElementById('f');

  if (!f) {
    return;
  }

  var m = document.getElementById('msg');
  var sb = f.querySelector('button[type="submit"]');


  function say(message, success) {

    if (!m) {
      return;
    }

    m.style.color = success ? '#146356' : '#B42318';
    m.textContent = message;

  }


  // ==============================
  // PREFILL GOAL FROM URL
  // ==============================

  var qp = new URLSearchParams(window.location.search);

  if (qp.get('goal') && f.goal) {
    f.goal.value = qp.get('goal');
  }


  // ==============================
  // FORM SUBMIT
  // ==============================

  f.addEventListener('submit', function (e) {

    e.preventDefault();


    // ==============================
    // HONEYPOT
    // ==============================

    if (f.company && f.company.value) {
      return;
    }


    // ==============================
    // HTML VALIDATION
    // ==============================

    if (!f.checkValidity()) {
      f.reportValidity();
      return;
    }


    // ==============================
    // GET VALUES
    // ==============================

    var name = f.n.value.trim();

    var ph = f.p.value
      .replace(/[\s\-()]/g, '')
      .replace(/^(\+91|91|0)(?=\d{10}$)/, '');

    var email = f.e.value.trim();

    var iam = f.iam.value;

    var amount = f.amount.value;

    var goal = f.goal.value;


    // ==============================
    // CONSENT
    // ==============================

    var consentChecked = f.consent.checked;


    // ==============================
    // VALIDATION
    // ==============================

    if (name.length < 2) {

      say('Please enter your full name.');

      return;

    }


    if (!/^[6-9]\d{9}$/.test(ph)) {

      say('Please enter a valid 10-digit mobile number.');

      return;

    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      say('Please enter a valid email address.');

      return;

    }


    if (!consentChecked) {

      say('Please tick the consent box so we can contact you.');

      return;

    }


    if (
      !window.SITE.SHEET_URL ||
      window.SITE.SHEET_URL.indexOf('https://script.google.com/') !== 0
    ) {

      say('The form is not connected yet.');

      return;

    }


    // ==============================
    // BUTTON
    // ==============================

    if (sb) {
      sb.disabled = true;
      sb.textContent = 'Sending...';
    }

    say('');


    // ==============================
    // CREATE DATA
    // ==============================

    var data = {

      name: name,

      mobile: '+91' + ph,

      email: email,

      iam: iam,

      amount: amount,

      goal: goal,

      // THIS WILL ALWAYS BE "Yes"
      // because submission is blocked above
      // unless the checkbox is checked.
      consent: 'Yes',

      page: window.location.href

    };


    // ==============================
    // SEND TO GOOGLE APPS SCRIPT
    // ==============================

    fetch(window.SITE.SHEET_URL, {

      method: 'POST',

      mode: 'no-cors',

      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },

      body: JSON.stringify(data)

    })

    .then(function () {

      // ==============================
      // SUCCESS
      // ==============================

      f.reset();

      say(
        'Thank you. We have received your request and will call you shortly.',
        true
      );

    })

    .catch(function (error) {

      console.error('Form submission error:', error);

      say(
        'Sorry, something went wrong. Please try again or reach us on WhatsApp.'
      );

    })

    .finally(function () {

      if (sb) {
        sb.disabled = false;
        sb.textContent = 'Request a call';
      }

    });

  });

});
