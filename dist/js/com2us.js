(function(){

  function pageScrollAnimation(){
    const observedEls = document.querySelectorAll('.observe');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ani');
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-70px'
    });
    observedEls.forEach(el => observer.observe(el));
  }
  pageScrollAnimation();
})();