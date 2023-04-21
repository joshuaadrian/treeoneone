let lastKnownScrollPosition = 0;
let ticking                 = false;

function doSomething(scrollPos, direction) {

  let bodyEl = document.getElementsByTagName('body')[0];

  if ( direction == 'down' && scrollPos >= 200 ) {
    bodyEl.classList.add('is-scrolled');
    bodyEl.classList.remove('is-scrolling');
  } else if ( scrollPos >= 200 ) {
    bodyEl.classList.add('is-scrolling');
    bodyEl.classList.remove('is-scrolled');
  } else {
    bodyEl.classList.remove('is-scrolled');
    bodyEl.classList.remove('is-scrolling');
  }

}

document.addEventListener('scroll', function(e) {

  scrollDirection = lastKnownScrollPosition < window.scrollY ? 'down' : 'up';
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {

    window.requestAnimationFrame(function() {
      doSomething(lastKnownScrollPosition, scrollDirection);
      ticking = false;
    });

    ticking = true;

  }

});
