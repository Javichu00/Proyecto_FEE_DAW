

   (function () {

    
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseFloat(entry.target.style.transitionDelay || '0') * 1000;
          setTimeout(function () {
            entry.target.classList.add('vis');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });
  
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
      revealObserver.observe(el);
    });
  
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
 
    function animateCounter(el) {

      var raw = el.textContent.trim().replace(/[^0-9]/g, '');
      var target = parseInt(raw, 10);
      if (isNaN(target) || target === 0) return;
  
      var suffix = el.textContent.replace(raw, '').replace(/<[^>]*>/g, '').trim();
      var duration = 1400;
      var start = null;
  
      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
  
      requestAnimationFrame(step);
    }
  
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var numEl = entry.target.querySelector('.info-stat-n');
          if (numEl) animateCounter(numEl);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    document.querySelectorAll('.info-stat').forEach(function (el) {
      statObserver.observe(el);
    });
  
  

    var form = document.querySelector('.info-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
  
        var nombre  = form.querySelector('input[type="text"]');
        var email   = form.querySelector('input[type="email"]');
        var mensaje = form.querySelector('textarea');
        var btn     = form.querySelector('.info-btn-enviar');
        var valid   = true;

        form.querySelectorAll('.info-fi-error').forEach(function (el) { el.remove(); });
        form.querySelectorAll('.info-fi input, .info-fi select, .info-fi textarea').forEach(function (el) {
          el.style.borderBottomColor = '';
        });
  
        function setError(field, msg) {
          field.style.borderBottomColor = '#ff4444';
          var err = document.createElement('span');
          err.className = 'info-fi-error';
          err.style.cssText = 'font-size:.72rem;color:#ff4444;font-family:Roboto,sans-serif;margin-top:4px;display:block';
          err.textContent = msg;
          field.parentNode.appendChild(err);
          valid = false;
        }
  
        if (nombre && nombre.value.trim().length < 2)
          setError(nombre, 'Introduce tu nombre.');
  
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
          setError(email, 'Email no válido.');
  
        if (mensaje && mensaje.value.trim().length < 10)
          setError(mensaje, 'El mensaje es demasiado corto.');
  
        if (valid) {
          var originalTxt = btn.textContent;
          btn.textContent = 'Enviando…';
          btn.disabled = true;
          btn.style.opacity = '.7';
  
          setTimeout(function () {
            btn.textContent = '✓ ¡Mensaje enviado!';
            btn.style.background = '#1a7a1a';
            form.reset();
  
            setTimeout(function () {
              btn.textContent = originalTxt;
              btn.disabled = false;
              btn.style.opacity = '';
              btn.style.background = '';
            }, 4000);
          }, 1200);
        }
      });
    }
  
  })();
  