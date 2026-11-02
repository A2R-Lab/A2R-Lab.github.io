(function () {
  'use strict';
  document.querySelectorAll('[data-research-highlights]').forEach(function (section) {
    var video = section.querySelector('video');
    if (!video || video.dataset.initialized) return;
    video.dataset.initialized = 'true';
    var button = section.querySelector('button');
    var error = section.querySelector('[role="status"]');
    var connection = navigator.connection;
    // Autoplay (muted, looping) whenever the video is on screen in a visible tab.
    // Pressing Pause turns automatic playback off until Play is pressed again.
    // A data-saving preference starts paused and leaves playback to the button.
    var automatic = !(connection && connection.saveData);
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
      if (video.paused) {
        automatic = true;
        play();
      } else {
        automatic = false;
        video.pause();
      }
    });
    video.addEventListener('play', function () { button.textContent = 'Pause video'; });
    video.addEventListener('pause', function () { button.textContent = 'Play video'; });
    video.addEventListener('error', function () {
      automatic = false;
      error.hidden = false;
      button.hidden = true;
    });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        sync();
      }, { threshold: 0 }).observe(video);
    } else {
      // Browsers without IntersectionObserver treat the video as always visible.
      visible = true;
      sync();
    }
  });
}());
