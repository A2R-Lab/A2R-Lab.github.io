(function () {
  'use strict';
  document.querySelectorAll('[data-research-highlights]').forEach(function (section) {
    var video = section.querySelector('video');
    if (!video || video.dataset.initialized) return;
    video.dataset.initialized = 'true';
    var button = section.querySelector('button');
    var error = section.querySelector('[role="status"]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var connection = navigator.connection;
    var automatic = !reducedMotion.matches && !(connection && connection.saveData);
    var visible = false;
    // The noscript link provides playback without JavaScript.
    video.controls = false;
    video.muted = true;
    button.hidden = false;

    function play() {
      if (!video.getAttribute('src')) video.src = video.dataset.videoSrc;
      var result = video.play();
      if (result && result.catch) result.catch(function () {
        // Autoplay may be blocked; keep the poster and explicit play button.
        if (video.paused) button.textContent = 'Play video';
      });
    }
    function sync() {
      if (!visible || document.hidden) video.pause();
      else if (automatic) play();
    }
    button.addEventListener('click', function () {
      // An explicit choice takes precedence over subsequent automatic playback.
      automatic = false;
      if (video.paused) play();
      else video.pause();
    });
    video.addEventListener('play', function () { button.textContent = 'Pause video'; });
    video.addEventListener('pause', function () { button.textContent = 'Play video'; });
    video.addEventListener('error', function () {
      automatic = false;
      error.hidden = false;
      button.hidden = true;
    });
    document.addEventListener('visibilitychange', sync);
    function motionChanged() {
      if (reducedMotion.matches) {
        automatic = false;
        video.pause();
      }
    }
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', motionChanged);
    else reducedMotion.addListener(motionChanged);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(video);
    }
    // Browsers without IntersectionObserver use explicit play only.
  });
}());
