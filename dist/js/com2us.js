(function(){
  function setGuageValue() {
    const gauge = document.querySelector('.gauge');
    if (!gauge) return;
    const gaugePoints = [
      { score: 10, percent: 14.2857 },
      { score: 20, percent: 28.5714 },
      { score: 40, percent: 42.8571 },
      { score: 60, percent: 57.1428 },
      { score: 80, percent: 71.41285 },
      { score: 100, percent: 85.7142 },
      { score: 120, percent: 99.9999 }
    ];
    const score = parseFloat(gauge.getAttribute('data-gauge'));
    if (isNaN(score)) {
      gauge.style.width = '0%';
      return;
    }
    const exact = gaugePoints.find(p => p.score === score);
    if (exact) {
      gauge.style.width = exact.percent + '%';
      return;
    }
    let prev = gaugePoints[0];
    let next = gaugePoints[gaugePoints.length - 1];
    for (let i = 1; i < gaugePoints.length; i++) {
      if (score < gaugePoints[i].score) {
        next = gaugePoints[i];
        prev = gaugePoints[i - 1];
        break;
      }
    }
    const percent = prev.percent + ((score - prev.score) / (next.score - prev.score)) * (next.percent - prev.percent);
    if(percent < 1){
      gauge.classList.add('remove');
    }
    gauge.style.width = percent + '%';
  }

  function pageScrollAnimation(){
    const observedEls = document.querySelectorAll('.observe');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          console.log('entry', entry.isIntersecting)

        if (entry.isIntersecting) {
          entry.target.classList.add('ani');          
          observer.unobserve(entry.target);
          if (entry.target.classList.contains('gauge')) {
            setGuageValue();
          }          
        }
      });
    }, {
      threshold: 1,
      rootMargin: '0px 0px -70px 0px'
    });
    observedEls.forEach(el => observer.observe(el));
  }
  pageScrollAnimation();


})();