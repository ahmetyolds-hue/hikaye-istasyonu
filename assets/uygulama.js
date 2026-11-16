/* ============================================================
   HİKÂYE İSTASYONU — uygulama.js
   Saf JS, kütüphane yok. Tüm hareketler prefers-reduced-motion'a saygılı.
   ============================================================ */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Üst bar: kaydırınca dolgunlaş ---------- */
  var bar = document.getElementById("bar");
  var sonDurum = false;
  function barGuncelle() {
    var dolu = window.scrollY > 40;
    if (dolu !== sonDurum) {
      bar.classList.toggle("dolu", dolu);
      sonDurum = dolu;
    }
  }
  window.addEventListener("scroll", barGuncelle, { passive: true });
  barGuncelle();

  /* ---------- 2. Mobil menü ---------- */
  var btn = document.querySelector(".menu-btn");
  var mobil = document.getElementById("mobil-menu");
  if (btn && mobil) {
    var mobilKirilim = window.matchMedia("(max-width: 820px)");
    function menuKapat() {
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Menüyü aç");
      mobil.hidden = true;
    }
    btn.addEventListener("click", function () {
      var acik = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!acik));
      btn.setAttribute("aria-label", acik ? "Menüyü aç" : "Menüyü kapat");
      mobil.hidden = acik;
    });
    mobil.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menuKapat();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobil.hidden) {
        menuKapat();
        btn.focus();
      }
    });
    mobilKirilim.addEventListener("change", menuKapat);
  }

  /* ---------- 3. Scroll reveal ---------- */

  /* ---------- 5. Aktif menü bağlantısı ---------- */
  var bolumler = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var menuLinkleri = Array.prototype.slice.call(
    document.querySelectorAll(".menu a")
  );
  if ("IntersectionObserver" in window && bolumler.length) {
    var gozlemci = new IntersectionObserver(function (girisler) {
      girisler.forEach(function (g) {
        if (!g.isIntersecting) return;
        var id = g.target.id;
        menuLinkleri.forEach(function (a) {
          a.classList.toggle("etkin", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    bolumler.forEach(function (b) { gozlemci.observe(b); });
  }

  /* ---------- 6. Kart kapılarında 3B eğim (yalnızca fare) ---------- */
  if (!azHareket && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".kapi").forEach(function (k) {
      k.addEventListener("mousemove", function (e) {
        var r = k.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        k.style.transform =
          "translateY(-8px) rotateX(" + (-y * 4).toFixed(2) + "deg) rotateY(" + (x * 4).toFixed(2) + "deg)";
      });
      k.addEventListener("mouseleave", function () {
        k.style.transform = "";
      });
    });
  }

  /* ---------- 7. Yıl ---------- */
  var yil = document.getElementById("yil");
  if (yil) yil.textContent = String(new Date().getFullYear());

  /* Hero buhar, yıldız ve Türkiye saati */
  var ns='http://www.w3.org/2000/svg';
  var media=window.matchMedia('(prefers-reduced-motion: reduce)'), paused=false, timer;
  function svg(tag,attrs,parent){var el=document.createElementNS(ns,tag);Object.keys(attrs).forEach(function(k){el.setAttribute(k,attrs[k]);});parent.appendChild(el);return el;}
  // All emitters share the photograph's coordinate system at every viewport size.
  var emitters = [
    {x:1474, y:352, count:60, period:3.0, drift:-164, rise:-31, bend:-9, lift:-66, gradient:'steam-light'},
    {x:1325, y:792, count:7, period:2.6, drift:-183, rise:-59, bend:-72, lift:-16, gradient:'steam-wheel'},
    {x:1228, y:744, count:6, period:2.8, drift:-135, rise:-38, bend:-48, lift:-12, gradient:'steam-wheel'}
  ];
  var mobileScene = window.matchMedia('(max-width: 768px)');
  function renderSteam() {
  document.getElementById('steam-sources').textContent = '';
  emitters.forEach(function(source) {
    var parent = svg('g', {transform:'translate('+source.x+' '+source.y+')'}, document.getElementById('steam-sources'));
    var chimney = source.gradient === 'steam-light';
    if (chimney) parent.setAttribute('clip-path', 'url(#chimney-lip)');
    if (chimney) parent.setAttribute('opacity', '0.7');
    for (var i=0; i<source.count; i++) {
      var wisp = svg('g', {class:chimney ? 'puff chimney' : 'puff'}, parent);
      var spread = chimney ? 1 : 1 + .16 * Math.sin(i * 2.4);
      var values = {'--period':source.period+'s','--delay':(-i*source.period/source.count)+'s',
        '--drift':source.drift*spread+'px','--rise':source.rise*spread+'px',
        '--bend':source.bend*spread+'px','--lift':source.lift*spread+'px'};
      if (chimney) {
        values['--offset-x'] = (14 * Math.sin(i * 2.4)) + 'px';
        values['--offset-y'] = (11 * Math.sin(i * 1.7)) + 'px';
        values['--turn'] = (18 * Math.cos(i * 2.1)) + 'deg';
      }
      Object.entries(values).forEach(function(entry){ wisp.style.setProperty(entry[0], entry[1]); });
      var shape = chimney ? 'chimney-wisp' : 'steam-wisp';
      var attributes = {fill:'url(#'+source.gradient+')',transform:'scale('+(i%2 ? -1 : 1)+' 1)'};
      if (mobileScene.matches) {
        var inline = svg('g', attributes, wisp);
        Array.prototype.forEach.call(document.getElementById(shape).children, function(ellipse) {
          inline.appendChild(ellipse.cloneNode(true));
        });
      } else {
        attributes.href = '#' + shape;
        svg('use', attributes, wisp);
      }
    }
  });
  }
  renderSteam();
  mobileScene.addEventListener('change', renderSteam);
  var stars=document.getElementById('stars');
  [[943,210,5],[1060,390,6],[1152,385,7],[1126,257,5],[1240,222,6],[1265,352,5],[1106,372,4],[984,396,4],[1313,206,5],[1370,205,4],[907,355,3]].forEach(function(s,i){
    var g=svg('g',{'class':'star',style:'--duration:'+(2.8+(i%5)*.38)+'s;--delay:-'+(i*.71)+'s'},stars);
    svg('circle',{cx:s[0],cy:s[1],r:s[2]*1.35,fill:'url(#star-light)'},g);
    svg('path',{d:'M'+(s[0]-s[2]/2)+' '+s[1]+'h'+s[2]+'M'+s[0]+' '+(s[1]-s[2]/2)+'v'+s[2],stroke:'#fff1cd','stroke-width':1.8},g);
  });
  for(var i=0;i<60;i++){var a=i*Math.PI/30;svg('line',{x1:Math.sin(a)*(i%5?65:61),y1:-Math.cos(a)*(i%5?65:61),x2:Math.sin(a)*68,y2:-Math.cos(a)*68,'stroke-width':i%5?.6:1.8},document.getElementById('clock-ticks'));}
  for(var n=1;n<=12;n++){var a=n*Math.PI/6;svg('text',{x:Math.sin(a)*54,y:-Math.cos(a)*54},document.getElementById('clock-numbers')).textContent=n;}
  var formatter=new Intl.DateTimeFormat('tr-TR',{timeZone:'Europe/Istanbul',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  function reduced(){return media.matches;}
  function clock(){
    var now=new Date();
    var parts=formatter.formatToParts(now), v={};parts.forEach(function(p){v[p.type]=p.value;});
    var h=Number(v.hour),m=Number(v.minute),s=Number(v.second);
    document.getElementById('hour-hand').style.transform='rotate('+((h%12)*30+m/2+s/120)+'deg)';
    document.getElementById('minute-hand').style.transform='rotate('+(m*6+s/10)+'deg)';
    document.getElementById('second-hand').style.transform='rotate('+(s*6)+'deg)';
    document.getElementById('clock-readout').textContent=formatter.format(now);
    document.getElementById('clock-readout').dateTime=now.toISOString();
  }
  function sync(){
    clearTimeout(timer);document.body.classList.toggle('motion-paused',paused||document.hidden);
    document.getElementById('second-hand').style.visibility=reduced()?'hidden':'visible';
    function tick(){clock();if(!paused&&!document.hidden){timer=setTimeout(tick,reduced()?60000-Date.now()%60000:1000-Date.now()%1000);}}
    if(!paused)tick();
  }
  document.getElementById('motion-toggle').addEventListener('click',function(){paused=!paused;this.textContent=paused?'Hareketi sürdür':'Hareketi duraklat';sync();});
  document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
  sync();
})();
