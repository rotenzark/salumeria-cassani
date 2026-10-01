/* Salumeria Drogheria Cassani — interazioni, i18n, orari dinamici */
(function(){
  "use strict";

  var intro=document.getElementById('intro');
  window.addEventListener('load',function(){ setTimeout(function(){ if(intro) intro.classList.add('gone'); },900); });
  setTimeout(function(){ if(intro) intro.classList.add('gone'); },2600);

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  var burger=document.getElementById('burger'), navlinks=document.getElementById('navlinks');
  if(burger){ burger.addEventListener('click',function(){ navlinks.classList.toggle('show'); }); }
  document.querySelectorAll('#navlinks a').forEach(function(a){ a.addEventListener('click',function(){ navlinks.classList.remove('show'); }); });

  document.querySelectorAll('.faq-q').forEach(function(b){
    b.addEventListener('click',function(){
      var it=b.parentElement, a=b.nextElementSibling, open=it.classList.contains('open');
      it.classList.toggle('open'); a.style.maxHeight=open?null:a.scrollHeight+'px';
    });
  });

  /* ---------- ORARI dinamici ---------- */
  // getDay: 0=Dom..6=Sab · Lun solo pomeriggio; Mar–Sab mattina+pomeriggio; Dom chiuso
  var HOURS={0:[],1:[[16.5,20]],2:[[9,13],[16.5,20]],3:[[9,13],[16.5,20]],4:[[9,13],[16.5,20]],5:[[9,13],[16.5,20]],6:[[9,13],[16.5,20]]};
  var DAYS_IT=['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  var DAYS_EN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function fmt(h){ var H=Math.floor(h),M=Math.round((h-H)*60); H=H%24; return H+':'+(M<10?'0'+M:''+M); }
  function winStr(w){ return fmt(w[0])+'–'+fmt(w[1]); }
  function romeNow(){ return new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Rome'})); }
  function computeStatus(){
    var n=romeNow(), d=n.getDay(), h=n.getHours()+n.getMinutes()/60, wins=HOURS[d]||[];
    for(var i=0;i<wins.length;i++){ if(h>=wins[i][0] && h<wins[i][1]) return {open:true, close:wins[i][1]}; }
    for(var j=0;j<wins.length;j++){ if(h<wins[j][0]) return {open:false, next:wins[j][0], nextDay:d, today:true}; }
    for(var k=1;k<=7;k++){ var dd=(d+k)%7; if((HOURS[dd]||[]).length){ return {open:false, next:HOURS[dd][0][0], nextDay:dd}; } }
    return {open:false};
  }
  var LANG='it';
  function renderHours(){
    var box=document.getElementById('hours'); if(!box) return;
    var days=LANG==='en'?DAYS_EN:DAYS_IT, today=romeNow().getDay(), out='';
    [1,2,3,4,5,6,0].forEach(function(d){
      var wins=HOURS[d], txt=wins&&wins.length?wins.map(winStr).join(' · '):(LANG==='en'?'Closed':'Chiuso');
      out+='<div class="hours-line'+(d===today?' today':'')+'"><span class="d">'+days[d]+'</span><span>'+txt+'</span></div>';
    });
    box.innerHTML=out;
    var st=computeStatus(), sb=document.getElementById('statusbox'), ab=document.getElementById('ab-state'), label,cls;
    if(st.open){ cls='open'; label=(LANG==='en'?'Open now · until ':'Aperto ora · fino alle ')+fmt(st.close); }
    else if(st.next!=null){ cls='closed'; var dt=st.today?'':((LANG==='en'?days[st.nextDay]:days[st.nextDay])+' '); label=(LANG==='en'?'Closed · opens ':'Chiuso · apre ')+dt+fmt(st.next); }
    else { cls='closed'; label=(LANG==='en'?'Closed':'Chiuso'); }
    if(sb) sb.innerHTML='<span class="status '+cls+'"><span class="dot"></span>'+label+'</span>';
    if(ab) ab.textContent=(st.open?(LANG==='en'?'Open now':'Aperto ora'):(LANG==='en'?'Closed now':'Ora chiuso'));
  }

  /* ---------- i18n ---------- */
  var EN={
    'nav.storia':'The story','nav.mond':'Mondeghini','nav.bottega':'In the shop','nav.dial':'In Milanese','nav.dove':'Find us','nav.cta':'Call',
    'hero.kick':'The shop on Via Orti','hero.h1':'Since 1898, <em>the shopping</em> as it once was.',
    'hero.lead':'A family delicatessen and grocery in Porta Romana. From Ercole and Paolo — who still welcome you in Milanese dialect.',
    'hero.p1':'four generations','hero.p2':'on Google','hero.p3':'Historic Milanese shop',
    'hero.cta1':'Call the shop','hero.cta2':'What you find',
    'storia.kick':'The story','storia.kickit':'since 1898','storia.h2':'Over a century on Via Orti',
    'storia.lead':'It all begins in <b>1898</b>, with Leonilde: Ercole’s grandmother opens the shop just steps from here.',
    'storia.p1':'In 1981 the delicatessen moves a few metres, to today’s address. Nothing has changed in spirit since: behind the counter is still the family — Ercole, with his son Paolo — ready to greet every customer with a quip in dialect.',
    'storia.p2':'It is one of the craft shops that made Via Orti a small corner of Milan that tastes of craftsmanship and time.',
    'storia.g1':'Leonilde opens the shop','storia.g2':'Today’s address, Via Orti 14','storia.g3n':'Today','storia.g3':'Ercole & Paolo, father and son',
    'storia.cap':'The Via Orti shop, as it once was',
    'mond.kick':'The mondeghitt','mond.h2':'The home of the <em>mondeghini</em>',
    'mond.p1':'The Milanese meatballs par excellence: born as a poor man’s dish, from whatever was left in the kitchen, and become a pride of the city. At Cassani they are made properly — which is why so many cross Milan for them.',
    'mond.p2':'«Mondeghitt», in Milanese. Crisp outside, soft within: to eat standing at the counter, or to take home.',
    'bottega.kick':'In the shop','bottega.h2':'What you find at Cassani','bottega.sub':'Delicatessen and grocery in one: the best of the counter and the everyday shopping.',
    'bottega.c1k':'The counter','bottega.c1h':'Cured meats & cheeses','bottega.c1p':'Italian cured meats and cheeses, sliced to order. Prosciutto, mortadella, salami, and the specialities the owner picks for you.',
    'bottega.c2k':'The shopping','bottega.c2h':'The grocery','bottega.c2p':'Not just a delicatessen: pasta, preserves, coffee, pantry and everyday goods, at fair prices and chosen quality.',
    'bottega.c3k':'The panino','bottega.c3h':'Sandwiches made to order','bottega.c3p':'The sandwich with whatever you like inside — roast beef and artichoke, omelette, cheese: filled just as you want them.',
    'bottega.c4k':'The aperitivo','bottega.c4h':'Aperitivo from the slicer','bottega.c4p':'Arrive before 8pm and you can pick up good, honest food to enjoy outside with a fine prosecco. In spite of the «best» places.',
    'dial.h2':'Here we also speak Milanese',
    'dial.p1':'It is written on an old wooden sign, hanging under the beams. At Cassani, dialect is no affectation: it is the way people have always been on first-name terms here.',
    'dial.w1':'the Milanese meatballs','dial.w2':'the bread, the michetta','dial.w3':'a quarter of wine','dial.w4':'cabbage & pork','dial.w5':'to press, to fill',
    'gal.kick':'The shop','gal.h2':'A look inside',
    'rev.src':'On Google · 23 reviews',
    'rev.q1':'A historic Milanese grocery. I found everything I was looking for at great prices, but above all delicacies and specialities I didn’t know, suggested by the owner. Highly recommended!',
    'rev.q2':'Not just a mini market! Aperitivo top, as they say in Milanese: arrive before 8pm and you can take excellent-quality products to enjoy outside with a fine prosecco, in spite of the «best» places.',
    'rev.q3':'Very cute minishop where we stopped to take some sandwiches with whatever we wanted inside! I took one with roast-beef and artichoke. Both delicious, the service very friendly and well worth the stop!',
    'rev.q4':'Kind and helpful owners, fantastic delicatessen. A real neighbourhood shop, the kind you don’t find any more.',
    'dove.h2':'Find us','dove.addr':'Address','dove.phone':'Phone','dove.hours':'Opening hours','dove.call':'Call the shop','dove.dir':'Get directions',
    'faq.kick':'Frequently asked','faq.h2':'Good to know',
    'faq.q1':'How old is the shop?','faq.a1':'Since 1898: it was opened by Leonilde, Ercole’s grandmother. In 1981 it moved a few metres, to its current address at Via Orti 14.',
    'faq.q2':'Do you make sandwiches and aperitivo?','faq.a2':'Yes: sandwiches filled to order with whatever you choose, and the aperitivo «from the slicer» — food to enjoy with a good prosecco. Best to arrive before 8pm.',
    'faq.q3':'What are mondeghini?','faq.a3':'They are the Milanese meatballs («mondeghitt» in dialect): a poor man’s dish of tradition, and one of our specialities.',
    'faq.q4':'When are you open?','faq.a4':'Tuesday to Saturday 9am–1pm and 4:30–8pm; Monday afternoon only (4:30–8pm). Closed on Sunday.',
    'faq.q5':'Delicatessen only, or grocery too?','faq.a5':'Both: cured meats and cheeses at the counter, but also pasta, preserves, coffee and everyday shopping.',
    'foot.sub':'Via Orti · Milan · since 1898','foot.rating':'4.8★ on Google (23 reviews)',
    'foot.demo':'Demo website by Bespoke Studio. Content and reviews from public sources (Google Maps).',
    'ab.call':'Call','ab.map':'Map'
  };
  var IT={};
  document.querySelectorAll('[data-i18n]').forEach(function(el){ IT[el.getAttribute('data-i18n')]=el.innerHTML; });
  function apply(lang){
    LANG=lang; var dict=lang==='en'?EN:IT;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(dict[k]!=null) el.innerHTML=dict[k]; else if(lang==='it'&&IT[k]!=null) el.innerHTML=IT[k];
    });
    document.documentElement.lang=lang;
    document.querySelectorAll('.lang button').forEach(function(b){ b.classList.toggle('on', b.getAttribute('data-lang')===lang); });
    renderHours();
  }
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click',function(){ apply(b.getAttribute('data-lang')); }); });

  renderHours();
  setInterval(renderHours,60000);

  /* ---------- JSON-LD ---------- */
  var ld1={"@context":"https://schema.org","@type":"GroceryStore","name":"Salumeria Drogheria Cassani","image":"https://rotenzark.github.io/salumeria-cassani/img/facciata.jpg","telephone":"+390259901631","url":"https://rotenzark.github.io/salumeria-cassani/","priceRange":"€€","address":{"@type":"PostalAddress","streetAddress":"Via Orti 14","addressLocality":"Milano","postalCode":"20122","addressCountry":"IT"},"geo":{"@type":"GeoCoordinates","latitude":45.4550703,"longitude":9.2009918},"sameAs":["https://instagram.com/ortiquattro"],"foundingDate":"1898","openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":"Monday","opens":"16:30","closes":"20:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"09:00","closes":"13:00"},{"@type":"OpeningHoursSpecification","dayOfWeek":["Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"16:30","closes":"20:00"}]};
  var ld2={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"Da quando esiste la bottega?","acceptedAnswer":{"@type":"Answer","text":"Dal 1898, aperta da Leonilde, nonna di Ercole. Nel 1981 si è spostata nella sede attuale di Via Orti 14."}},
    {"@type":"Question","name":"Cosa sono i mondeghini?","acceptedAnswer":{"@type":"Answer","text":"Le polpette milanesi («mondeghitt»), un piatto povero della tradizione e una specialità della salumeria Cassani."}},
    {"@type":"Question","name":"Quando siete aperti?","acceptedAnswer":{"@type":"Answer","text":"Martedì–sabato 9–13 e 16:30–20; lunedì solo pomeriggio (16:30–20); domenica chiuso."}}
  ]};
  [ld1,ld2].forEach(function(o){ var s=document.createElement('script'); s.type='application/ld+json'; s.textContent=JSON.stringify(o); document.head.appendChild(s); });

})();
