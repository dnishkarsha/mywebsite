document.querySelectorAll('.slideshow').forEach(function(ss){
  var slides=[].slice.call(ss.querySelectorAll('.slide')),dots=[].slice.call(ss.querySelectorAll('.dot'));
  var i=0,timer=null,paused=false,ms=+ss.dataset.interval||9000;
  function vid(k){return slides[k].querySelector('video');}
  function show(k){
    var v=vid(i); if(v){v.pause();}
    slides[i].classList.remove('on');dots[i].classList.remove('on');
    i=(k+slides.length)%slides.length;
    slides[i].classList.add('on');dots[i].classList.add('on');
    schedule();
  }
  function schedule(){
    clearTimeout(timer);
    var v=vid(i);
    if(v){v.currentTime=0;var p=v.play();if(p&&p.catch)p.catch(function(){});
      v.onended=function(){if(!paused)show(i+1);};
      timer=setTimeout(function(){if(!paused)show(i+1);},Math.max(ms,30000));
    } else {timer=setTimeout(function(){if(!paused)show(i+1);},ms);}
  }
  ss.querySelector('.prev').onclick=function(){show(i-1);};
  ss.querySelector('.next').onclick=function(){show(i+1);};
  dots.forEach(function(d,k){d.onclick=function(){show(k);};d.onmouseenter=function(){show(k);};});
  ss.addEventListener('mouseenter',function(){paused=true;});
  ss.addEventListener('mouseleave',function(){paused=false;schedule();});
  var x0=null;ss.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
  ss.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)show(i+(dx<0?1:-1));x0=null;});
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){var v=vid(i);if(!v)return;if(e.isIntersecting){v.play().catch(function(){});}else{v.pause();}});}).observe(ss);}
  schedule();
});
