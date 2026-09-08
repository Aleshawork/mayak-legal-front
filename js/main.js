(function(){
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",boot);}else{boot();}
  function boot(){
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ARR = '<i><svg width="13" height="13" viewBox="0 0 15 15"><use href="#arr"/></svg></i>';

  /* ============ КАРТЫ ============ */
  var W=1200,H=340,SEA=216,X0=96,X1=878;
  var LGN='<path d="M32 8.4V5.4" stroke="#0D3B54" stroke-width="1.7" stroke-linecap="round"/>'+
    '<path d="M27.1 25.4h9.8L40.8 57H23.2Z" fill="#FFFFFF" stroke="#0D3B54" stroke-width="2" stroke-linejoin="round"/>'+
    '<path d="M20.8 57.4h22.4" stroke="#0D3B54" stroke-width="2" stroke-linecap="round"/>'+
    '<path d="M25.4 15.6h13.2L32 8.4Z" fill="#FFFFFF" stroke="#0D3B54" stroke-width="2" stroke-linejoin="round"/>'+
    '<rect x="27" y="15.6" width="10" height="6.8" fill="#E9A13B" stroke="#0D3B54" stroke-width="1.8"/>'+
    '<path d="M32 15.6v6.8" stroke="#0D3B54" stroke-width="1.4"/>'+
    '<rect x="24.6" y="22.4" width="14.8" height="3" fill="#FFFFFF" stroke="#0D3B54" stroke-width="1.9"/>'+
    '<rect x="30.8" y="30.4" width="2.6" height="3.8" fill="#0D3B54"/>'+
    '<rect x="30.8" y="38" width="2.6" height="3.8" fill="#0D3B54"/>'+
    '<rect x="30.8" y="45.6" width="2.6" height="3.8" fill="#0D3B54"/>';
  function scenery(){
    var LS=2.42, LX=986, LY=SEA-57.4*LS;
    return '<g transform="translate('+(LX-32*LS)+','+LY+') scale('+LS+')">'+
      LGN+'</g>'+
      '<g transform="translate(1108,'+SEA+')">'+
      '<path d="M-46 0 L46 0 L46 -52 L-46 -52 Z" fill="#F7FBFC" stroke="#9FBECD" stroke-width="1.6"/>'+
      '<path d="M-56 -52 L56 -52 L0 -98 Z" fill="#0D3B54"/>'+
      '<rect x="-12" y="-34" width="24" height="34" rx="2" fill="#2E7A9B"/>'+
      '<rect x="-36" y="-42" width="16" height="16" rx="2" fill="#E9A13B"/>'+
      '<rect x="20" y="-42" width="16" height="16" rx="2" fill="#E9A13B"/></g>';
  }
  function buildMap(host,cfg){
    if(!host) return;
    var n=cfg.stops.length, step=(X1-X0)/(n-1);
    var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+cfg.aria+'">'+
      '<defs><linearGradient id="sky'+cfg.id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF6F9"/><stop offset="1" stop-color="#DDEDF4"/></linearGradient>'+
      '<linearGradient id="sea'+cfg.id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BAD7E5"/><stop offset="1" stop-color="#96BED2"/></linearGradient>'+
      '<linearGradient id="lgt'+cfg.id+'" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#E9A13B" stop-opacity=".5"/><stop offset="1" stop-color="#E9A13B" stop-opacity="0"/></linearGradient></defs>'+
      '<rect width="'+W+'" height="'+H+'" fill="url(#sky'+cfg.id+')"/>'+
      '<path d="M 916 '+H+' L 916 '+SEA+' L '+W+' '+SEA+' L '+W+' '+H+' Z" fill="#D7E6DC"/>'+
      '<path d="M 916 '+SEA+' L '+W+' '+SEA+'" stroke="#B2CBBB" stroke-width="2"/>'+
      '<rect x="0" y="'+SEA+'" width="916" height="'+(H-SEA)+'" fill="url(#sea'+cfg.id+')"/>'+
      '<path d="M0 250 C 130 244 210 256 330 250 C 450 244 530 256 650 250 C 750 245 850 254 916 250" stroke="#87B2C8" stroke-width="1.6" fill="none" opacity=".6"/>'+
      '<path d="M0 292 C 150 286 230 298 350 292 C 470 286 550 298 670 292 C 770 287 860 296 916 292" stroke="#87B2C8" stroke-width="1.6" fill="none" opacity=".4"/>'+
      '<path id="ray'+cfg.id+'" d="M 970 '+(SEA-100)+' L '+X0+' '+(SEA-15)+' L '+X0+' '+(SEA+15)+' L '+X1+' '+(SEA+15)+' L '+X1+' '+(SEA-15)+' L 970 '+(SEA-86)+' Z" fill="url(#lgt'+cfg.id+')" style="transition:d .85s cubic-bezier(.32,.72,0,1)"/>'+
      '<path pathLength="100" d="M '+X0+' '+SEA+' L '+X1+' '+SEA+'" stroke="#6E9FB8" stroke-width="3" stroke-dasharray="9 9" stroke-linecap="round" fill="none"/>'+
      '<path id="lit'+cfg.id+'" pathLength="100" d="M '+X0+' '+SEA+' L '+X1+' '+SEA+'" stroke="#E9A13B" stroke-width="7" stroke-linecap="round" fill="none" stroke-dasharray="0 100" stroke-dashoffset="0"/>'+
      scenery()+
      '<text x="1108" y="'+(SEA+34)+'" text-anchor="middle" font-family="Onest, sans-serif" font-size="16" font-weight="600" fill="#0E2431">'+cfg.homeLabel+'</text>';
    cfg.stops.forEach(function(st,i){
      var x=X0+step*i;
      s+='<g class="stopdot" tabindex="0">'+
        '<circle class="hit" cx="'+x+'" cy="'+SEA+'" r="46"/>'+
        '<circle cx="'+x+'" cy="'+SEA+'" r="11" fill="#FFFFFF" stroke="#0D3B54" stroke-width="2.6"/>'+
        '<circle cx="'+x+'" cy="'+SEA+'" r="4.4" fill="#E9A13B"/>'+
        '<text x="'+x+'" y="'+(SEA+38)+'" text-anchor="middle" font-family="Onest, sans-serif" font-size="16" font-weight="600" fill="#0E2431">'+st.t+'</text>'+
        '<g class="tip"><rect x="'+(x-92)+'" y="'+(SEA-72)+'" width="184" height="44" rx="13" fill="#0D3B54"/>'+
        '<text x="'+x+'" y="'+(SEA-54)+'" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">'+st.svc+'</text>'+
        '<text x="'+x+'" y="'+(SEA-37)+'" text-anchor="middle" font-family="Onest, sans-serif" font-size="13" font-weight="600" fill="#E9A13B">'+st.price+'</text></g></g>';
    });
    host.innerHTML=s+'</svg>';
  }
  function wireMap(cfg){
    var lit=document.getElementById('lit'+cfg.id), row=document.getElementById(cfg.row), ray=document.getElementById('ray'+cfg.id);
    if(!lit||!row) return;
    row.innerHTML='';
    function rayTo(a,b){
      if(!ray) return;
      var xa=X0+(X1-X0)*a/100, xb=X0+(X1-X0)*b/100, T=15;
      ray.setAttribute('d','M 970 '+(SEA-100)+' L '+xa+' '+(SEA-T)+' L '+xa+' '+(SEA+T)+' L '+xb+' '+(SEA+T)+' L '+xb+' '+(SEA-T)+' L 970 '+(SEA-86)+' Z');
    }
    rayTo(0,100);
    cfg.services.forEach(function(sv,i){
      var b=document.createElement('button'); b.className='pk'+(sv.w?' w'+sv.w:''); b.type='button';
      b.innerHTML='<span>'+sv.t+'</span><em>'+sv.p+'</em>';
      function on(){
        row.querySelectorAll('.pk').forEach(function(x){ x.classList.toggle('on',x===b); });
        lit.style.transition='none';
        lit.setAttribute('stroke-dashoffset',-sv.a);
        lit.setAttribute('stroke-dasharray','0 100');
        requestAnimationFrame(function(){ requestAnimationFrame(function(){
          lit.style.transition='stroke-dasharray .85s cubic-bezier(.32,.72,0,1)';
          lit.setAttribute('stroke-dasharray',(sv.b-sv.a)+' 100');
        }); });
        rayTo(sv.a,sv.b);
      }
      b.addEventListener('mouseenter',on); b.addEventListener('focus',on); b.addEventListener('click',on);
      row.appendChild(b);
    });
  }
  var dealStops=[
    {t:'Объявление',svc:'Проверка объявления',price:'0 ₽'},
    {t:'Объект',svc:'Проверка объекта',price:'3 000 ₽'},
    {t:'Продавец',svc:'Проверка продавца',price:'3 000 ₽'},
    {t:'Договор',svc:'Экспертиза договора',price:'5 000 ₽'},
    {t:'Регистрация',svc:'Сопровождение сделки',price:'10 000 ₽'}];
  var dealSvc=[
    {t:'Проверка объявления',p:'бесплатно',a:0,b:6},
    {t:'Проверка объекта',p:'3 000 ₽',a:12,b:37},
    {t:'Проверка продавца',p:'3 000 ₽',a:38,b:62},
    {t:'Экспертиза договора',p:'5 000 ₽',a:63,b:87},
    {t:'Комплексная проверка',p:'5 000 ₽',a:0,b:62,w:3},
    {t:'Сопровождение сделки',p:'10 000 ₽',a:0,b:100,w:4}];
  var buildStops=[
    {t:'Договор подряда',svc:'Экспертиза договора подряда',price:'7 000 ₽'},
    {t:'Приёмка',svc:'Приёмка работ',price:'50 000 ₽'},
    {t:'Спор',svc:'Досудебное урегулирование',price:'входит в приёмку'}];
  var buildSvc=[
    {t:'Экспертиза договора',p:'7 000 ₽',a:0,b:40},
    {t:'Приёмка и досудебное урегулирование',p:'50 000 ₽',a:42,b:100},
    {t:'Полное сопровождение строительства',p:'от 60 000 ₽',a:0,b:100,w:2}];
  var maps=[
    {id:'Deal',aria:'Карта сделки',homeLabel:'Ваш новый дом',host:'mapDeal',row:'pkDeal',stops:dealStops,services:dealSvc},
    {id:'Build',aria:'Карта строительства',homeLabel:'Дом принят',host:'mapBuild',row:'pkBuild',stops:buildStops,services:buildSvc}
  ];
  maps.forEach(function(m){ buildMap(document.getElementById(m.host),m); wireMap(m); });

  /* ============ МОРЕ РИСКОВ ============ */
  var RISKS=[
    {t:'Банкротство продавца',i:'<path d="M2 12 L6 7 L9 10 L14 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7 V3 H10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>'},
    {t:'Доли детей и маткапитал',i:'<circle cx="5.5" cy="5" r="2.4" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="11" cy="6.5" r="1.8" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M2 14c0-2.2 1.6-3.6 3.5-3.6S9 11.8 9 14M9.5 14c0-1.7 1-2.7 2.4-2.7s2.1.9 2.1 2.7" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>'},
    {t:'Арест и запрет на регистрацию',i:'<rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" stroke="currentColor" stroke-width="1.4" fill="none"/>'},
    {t:'Незаконная перепланировка',i:'<rect x="2.5" y="2.5" width="11" height="11" rx="1.4" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M8 2.5V9M8 9h5.5M2.5 11h3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>'},
    {t:'Долги по капремонту',i:'<circle cx="8" cy="8" r="5.8" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M6.4 11V5.4h2a1.7 1.7 0 0 1 0 3.4H5.6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'},
    {t:'Нет согласия супруга',i:'<circle cx="6" cy="9" r="3.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="10.4" cy="9" r="3.6" stroke="currentColor" stroke-width="1.4" fill="none"/>'},
    {t:'Дарение перед продажей',i:'<rect x="2.6" y="6.6" width="10.8" height="7" rx="1.2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M2.6 9.4h10.8M8 6.6V13.6" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>'}
  ];
  var sea=document.getElementById('sea'), marksBox=document.getElementById('marks'), beam=document.getElementById('beamRot');
  var mkEls=[], SPAN=78;
  if(sea&&marksBox){
    RISKS.forEach(function(r,i){
      var a=-SPAN+(2*SPAN)*(i/(RISKS.length-1));
      var el=document.createElement('div'); el.className='mk'; el.dataset.a=a;
      el.innerHTML='<svg width="16" height="16" viewBox="0 0 16 16">'+r.i+'</svg><span>'+r.t+'</span>';
      marksBox.appendChild(el); mkEls.push(el);
    });
    var place=function(){
      var Wd=sea.clientWidth,Hd=sea.clientHeight,cx=Wd/2,cy=Hd-115;
      var rx=Math.max(110,Wd/2-215), ry=Math.max(80,cy-46);
      mkEls.forEach(function(el){
        var a=+el.dataset.a,rad=a*Math.PI/180;
        var px=cx+Math.sin(rad)*rx, py=cy-Math.cos(rad)*ry;
        el.style.left=px+'px'; el.style.top=py+'px';
        el.dataset.lit=Math.atan2(px-cx,cy-py)*180/Math.PI;
        el.dataset.anchor = a<-22?'translate(-100%,-50%)':(a>22?'translate(0,-50%)':'translate(-50%,-50%)');
        el.style.transform=el.dataset.anchor;
      });
    };
    place(); window.addEventListener('resize',place);
    if(!REDUCE&&beam){
      var t0=performance.now();
      (function tick(now){
        var ang=SPAN*Math.sin((now-t0)/3200);
        beam.setAttribute('transform','rotate('+ang+' 600 315)');
        mkEls.forEach(function(el){ el.classList.toggle('lit',Math.abs(ang-(+(el.dataset.lit||el.dataset.a)))<13); });
        requestAnimationFrame(tick);
      })(performance.now());
    } else { mkEls.forEach(function(el){ el.classList.add('lit'); }); }
  }

  /* ============ КВИЗ ============ */
  var QUIZ=[
    {q:'Что Вы сейчас делаете?',o:[{t:'Присматриваю варианты',v:'look'},{t:'Выбрал объект, готовлюсь к сделке',v:'deal'},{t:'Строю дом или делаю ремонт',v:'build'}]},
    {q:'Что уже есть на руках?',o:[{t:'Только объявление',v:'ad'},{t:'Документы по объекту и данные продавца',v:'docs'},{t:'Договор, который прислали на подпись',v:'contract'}]},
    {q:'Насколько срочно?',o:[{t:'Просто изучаю',v:'slow'},{t:'Решение в ближайшие дни',v:'fast'}]}
  ];
  var RES={
    look_ad:{n:'Проверка объявления',p:'Бесплатно · до 2 часов',d:'Пока рано платить: сверим объявление с открытыми данными и скажем, стоит ли ехать на просмотр.',f:'ad'},
    look_docs:{n:'Проверка объекта',p:'3 000 ₽ · до 3 часов',d:'Данные есть — можно поднимать историю объекта и смотреть обременения.',f:'object'},
    deal_docs:{n:'Комплексная проверка сделки',p:'5 000 ₽ · до 1 рабочего дня',d:'Объект и продавец в одном отчёте: дешевле, чем по отдельности, и видны пересечения рисков.',f:'full'},
    deal_contract:{n:'Сопровождение сделки',p:'10 000 ₽ · весь цикл',d:'Договор уже на руках — логично закрыть весь путь: проверки, разбор договора и ведение до регистрации права.',f:'consult',s:'Сопровождение сделки'},
    build_any:{n:'Экспертиза договора подряда',p:'7 000 ₽ · 2–3 рабочих дня',d:'Начинать со стройки всегда стоит с договора: этапы, сроки, ответственность и гарантия.',f:'consult',s:'Экспертиза договора подряда'},
    build_late:{n:'Приёмка работ и урегулирование',p:'50 000 ₽',d:'Если работы уже идут или сданы — фиксируем недостатки так, чтобы это имело юридическую силу.',f:'consult',s:'Приёмка работ и досудебное урегулирование'}
  };
  var qHost=document.getElementById('quiz'), qState=[];
  function renderQuiz(){
    if(!qHost) return;
    var i=qState.length;
    var bars=QUIZ.map(function(_,k){ return '<i class="'+(k<=i-1?'on':'')+'"></i>'; }).join('');
    if(i<QUIZ.length){
      var q=QUIZ[i];
      qHost.innerHTML='<div class="q-progress">'+bars+'</div><div class="q-step on"><h3>'+q.q+'</h3><div class="q-opts">'+
        q.o.map(function(o){ return '<button class="q-opt" type="button" data-v="'+o.v+'">'+o.t+'</button>'; }).join('')+'</div></div>';
      qHost.querySelectorAll('.q-opt').forEach(function(b){
        b.addEventListener('click',function(){ qState.push(b.dataset.v); renderQuiz(); });
      });
    } else {
      var k='look_ad';
      if(qState[0]==='build') k = qState[1]==='contract' ? 'build_any' : (qState[2]==='fast' ? 'build_late' : 'build_any');
      else if(qState[0]==='deal') k = qState[1]==='contract' ? 'deal_contract' : 'deal_docs';
      else k = qState[1]==='ad' ? 'look_ad' : 'look_docs';
      var r=RES[k];
      qHost.innerHTML='<div class="q-progress">'+QUIZ.map(function(){return '<i class="on"></i>';}).join('')+'</div>'+
        '<div class="q-step on"><div class="q-res"><div class="rname">'+r.n+'</div>'+
        '<div class="rprice">'+r.p+'</div><p class="small" style="margin-top:10px">'+r.d+'</p></div>'+
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><button class="btn b-amber" type="button" data-form="'+r.f+'"'+(r.s?' data-svc="'+r.s+'"':'')+'>Оставить заявку'+ARR+'</button>'+
        '<button class="q-again" type="button" id="qAgain">Пройти заново</button></div></div>';
      var again=document.getElementById('qAgain');
      if(again) again.addEventListener('click',function(){ qState=[]; renderQuiz(); });
    }
  }
  renderQuiz();

  /* ============ БЛОГ ============ */
  var POSTS=[
    {t:'Как дарение три дня назад чуть не стоило покупателю квартиры',c:'Разбор риска',d:'14 июля 2026',r:'7 мин'},
    {t:'«Чистая» выписка из ЕГРН — и три риска, которые в неё не попали',c:'Разбор риска',d:'2 июля 2026',r:'6 мин'},
    {t:'История про долю ребёнка, о которой продавец «забыл» сказать',c:'Разбор риска',d:'19 июня 2026',r:'8 мин'},
    {t:'Схема Долиной: что это такое и как не попасть в похожую ситуацию',c:'Вид с маяка',d:'5 июня 2026',r:'9 мин'},
    {t:'Как банкротство продавца может аннулировать сделку спустя годы',c:'Вид с маяка',d:'22 мая 2026',r:'7 мин'},
    {t:'Что такое обременение и почему выписка из ЕГРН показывает не всё',c:'Вид с маяка',d:'8 мая 2026',r:'5 мин'},
    {t:'Чек-лист: что проверить перед покупкой квартиры на вторичном рынке',c:'Чек-листы',d:'24 апреля 2026',r:'10 мин'},
    {t:'Чек-лист: что проверить перед покупкой участка в СНТ',c:'Чек-листы',d:'11 апреля 2026',r:'8 мин'},
    {t:'Задаток и аванс: в чём разница и почему это важно',c:'Чек-листы',d:'27 марта 2026',r:'5 мин'},
    {t:'Договор подряда: пять пунктов, без которых подписывать нельзя',c:'Стройка без сюрпризов',d:'13 марта 2026',r:'9 мин'},
    {t:'Что делать, если подрядчик сорвал сроки',c:'Стройка без сюрпризов',d:'28 февраля 2026',r:'7 мин'},
    {t:'Самовольная постройка: как не получить дом, который придётся сносить',c:'Стройка без сюрпризов',d:'14 февраля 2026',r:'8 мин'},
    {t:'«Продавец предлагает занизить цену в договоре — соглашаться?»',c:'Вопрос — ответ',d:'30 января 2026',r:'6 мин'},
    {t:'«Нужен ли юрист, если сделка идёт через агентство недвижимости?»',c:'Вопрос — ответ',d:'16 января 2026',r:'5 мин'},
    {t:'«Стоит ли покупать недвижимость по доверенности от собственника?»',c:'Вопрос — ответ',d:'9 января 2026',r:'7 мин'}
  ];
  var COVERS={'Разбор риска':'linear-gradient(135deg,#FBEEDA,#F3D9A6)','Вид с маяка':'linear-gradient(135deg,#E3EFF5,#BDD8E5)',
    'Чек-листы':'linear-gradient(135deg,#E4F1EA,#BFDCCB)','Стройка без сюрпризов':'linear-gradient(135deg,#F7E7E2,#E9C4BA)','Вопрос — ответ':'linear-gradient(135deg,#EAF0F5,#CBD9E4)'};
  function postCard(p){
    return '<article class="post"><div class="post-cover" style="background:'+COVERS[p.c]+'"></div><div class="post-body">'+
      '<span class="post-cat">'+p.c+'</span><h4>'+p.t+'</h4><div class="post-meta"><span>'+p.d+'</span><span>'+p.r+'</span></div></div></article>';
  }
  var bp=document.getElementById('blogPosts'), bf=document.getElementById('blogFilter');
  if(bp&&bf){
    var cats=['Все материалы'].concat(Object.keys(COVERS));
    bf.innerHTML=cats.map(function(c,i){ return '<button class="pk'+(i===0?' on':'')+'" type="button" data-c="'+c+'">'+c+'</button>'; }).join('');
    var draw=function(c){ bp.innerHTML=POSTS.filter(function(p){ return c==='Все материалы'||p.c===c; }).map(postCard).join(''); };
    draw('Все материалы');
    bf.querySelectorAll('.pk').forEach(function(b){
      b.addEventListener('click',function(){ bf.querySelectorAll('.pk').forEach(function(x){x.classList.toggle('on',x===b);}); draw(b.dataset.c); });
    });
  }

  /* ============ FAQ ПО РУБРИКАМ ============ */
  var FAQ=[
    {c:'О сервисе',q:[
      ['Чем Вы отличаетесь от риелтора или нотариуса?','Риелтор заинтересован, чтобы сделка состоялась — это его доход. Нотариус проверяет сделку по формальным признакам в момент удостоверения, но не проводит полное расследование объекта и продавца заранее. Мы — независимая сторона, которая работает в Ваших интересах и которой всё равно, состоится сделка или нет.'],
      ['Чем Вы отличаетесь от проверки объекта банком при ипотеке?','Банк проверяет объект в первую очередь как залог — ему важно, можно ли будет его продать, если Вы перестанете платить. Полную историю рисков для Вас лично банк не анализирует.'],
      ['Чем Вы отличаетесь от юридической фирмы общей практики?','Мы не универсальные юристы «по всем вопросам» — мы занимаемся только недвижимостью и стройкой, поэтому у нас есть готовая методика, чек-листы и наработанная судебная практика по этим темам.'],
      ['Вы адвокаты?','Нет, мы практикующие юристы. Для проверок, экспертизы договоров и сопровождения сделок статус адвоката по закону не требуется. Если дело дойдёт до уголовного процесса, мы честно скажем, что нужен адвокат, и подскажем, к кому обратиться.'],
      ['Чего Вы не делаете?','Не занимаемся оценкой рыночной стоимости, не проводим строительно-техническую экспертизу сами (привлекаем экспертов), не выступаем риелтором и не ищем для Вас объект. Мы проверяем и защищаем, а не продаём.'],
      ['Вы работаете по всей России?','Юридическая часть — по всей России, дистанционно. Услуги с выездом, например контроль стройки на месте, доступны там, где мы можем обеспечить качественный выезд специалиста; в остальных случаях используем чек-лист для самостоятельной фиксации и проверку по фото и документам.']
    ]},
    {c:'Проверка объекта и продавца',q:[
      ['Что нужно от меня, кроме ссылки на объявление?','Для полной проверки — кадастровый номер или точный адрес объекта и данные продавца из документов. Если у Вас на руках выписка ЕГРН, договор или паспортные данные продавца, приложите их к заявке: проверка будет точнее и быстрее.'],
      ['Вы проверяете новостройки, доли, апартаменты и участки?','Да. Для новостройки и ДДУ смотрим застройщика, разрешительную документацию и условия договора; для доли — согласие сособственников и преимущественное право покупки; для апартаментов — статус помещения и что он означает на практике; для участка — границы, вид разрешённого использования, охранные зоны и признаки самовольной постройки.'],
      ['Что если продавец действует по доверенности?','Это отдельная зона риска, и мы проверяем её всегда: действительность доверенности по реестру нотариата, объём полномочий, жив ли доверитель и не отозвана ли доверенность на день сделки. Часть проверок повторяем непосредственно в день подписания.'],
      ['Вы гарантируете, что сделку никто не оспорит?','Нет — и любой, кто это обещает, Вас обманывает. Часть рисков в российской недвижимости невозможно исключить полностью в принципе. Мы гарантируем, что проверим всё, что можно проверить на момент сделки, честно скажем, что проверить нельзя, и дадим рекомендацию, которая учитывает реальный риск.'],
      ['Вы откажетесь от сделки за меня, если найдёте риск?','Решение всегда за Вами. Мы показываем риск и его уровень — заходить в сделку, заходить с условиями или не заходить, решаете Вы.']
    ]},
    {c:'Отчёт',q:[
      ['Что внутри отчёта?','Вердикт на первой странице, сводка по цифрам, затем каждый найденный пункт: что нашли, чем это грозит именно Вам, что с этим делать и на какую норму закона мы опираемся. В конце — вывод юриста и, если есть основания, оценка суммы для торга.'],
      ['Что означают цвета в отчёте?','Зелёный — чисто, можно не возвращаться. Жёлтый — требует внимания: сделка возможна, но с условиями или с торгом. Красный — критично: до устранения деньги отдавать нельзя.'],
      ['Отчёт — это гарантия, что сделка безопасна?','Нет. Отчёт показывает то, что можно установить по документам и открытым данным на день проверки. Это резко снижает риск, но не превращает его в ноль — и мы прямо пишем в отчёте, что именно проверить было невозможно.'],
      ['Я не разбираюсь в юридических терминах — пойму ли я отчёт?','Да, это принцип, а не исключение: мы не используем канцелярит и юридический жаргон без объяснения. Если термин нужен, объясняем его простыми словами тут же, в отчёте.'],
      ['Можно ли показать отчёт продавцу, риелтору или банку?','Да, отчёт Ваш — распоряжайтесь им как хотите. На практике он часто и работает как аргумент в торге: продавцу проще снизить цену, чем оспаривать документально подтверждённые находки.']
    ]},
    {c:'Договор и сделка',q:[
      ['Вы проверяете чужой договор или составляете свой?','И то, и другое. Экспертиза — это разбор договора, который Вам прислали, с готовыми формулировками для замены опасных пунктов. В рамках сопровождения сделки мы можем подготовить договор с нуля.'],
      ['Можно ли заказать только проверку договора, без полного сопровождения?','Да, экспертиза договора — отдельная услуга с фиксированной ценой.'],
      ['Что входит в сопровождение сделки?','Проверка объекта и продавца, экспертиза договора, согласование условий с другой стороной, подготовка к безопасным расчётам (аккредитив, эскроу, ячейка — с объяснением разницы) и подготовка пакета документов для регистрации перехода права.'],
      ['Вы присутствуете на сделке?','Дистанционно — да: мы на связи в момент подписания и расчётов и сверяем финальные документы. Физическое присутствие обсуждается отдельно и зависит от города.'],
      ['Нужно ли приезжать к Вам в офис?','Нет, весь процесс проходит удалённо: заявка через форму, документы и отчёты — на почту.']
    ]},
    {c:'Строительство и ремонт',q:[
      ['Когда лучше подключить юриста к стройке?','До подписания договора подряда. Это самая дешёвая точка входа: 7 000 ₽ за экспертизу договора против 50 000 ₽ за приёмку и урегулирование, когда работы уже сделаны не так.'],
      ['Стройка уже идёт, а проблемы начались только сейчас — поздно?','Нет. Подключаемся на любом этапе: анализируем то, что уже подписано и сделано, дальше действуем от текущей точки — защищаем оставшиеся этапы и фиксируем уже случившиеся нарушения.'],
      ['Подрядчик отказывается менять договор — что делать?','Это сам по себе сигнал. Мы разделяем правки на критичные и желательные: по критичным объясняем, чем именно Вы рискуете, подписывая как есть, и предлагаем компромиссные формулировки. Если подрядчик не готов даже на них — это довод искать другого.'],
      ['Помогаете принять работы?','Да. Приёмка — это не «посмотреть и подписать»: мы фиксируем недостатки так, чтобы документ имел юридическую силу, при необходимости привлекаем строительного эксперта и готовим претензию.']
    ]},
    {c:'Сроки, оплата, возврат',q:[
      ['Сколько занимает проверка?','Проверка объявления — до 2 часов. Проверка объекта или продавца — до 3 часов. Комплексная проверка сделки — до 1 рабочего дня. Экспертиза договора купли-продажи — 1–2 рабочих дня, экспертиза договора подряда — 2–3 рабочих дня.'],
      ['Что если Вы не уложитесь в заявленный срок?','Вернём деньги за эту услугу. Срок указан заранее для каждой проверки и экспертизы — это обязательство, а не ориентир.'],
      ['Как оплатить и будет ли чек?','Оплата банковской картой по ссылке, которую мы присылаем после подтверждения заявки. Исполнитель применяет налог на профессиональный доход, поэтому чек формируется в приложении «Мой налог» и приходит на указанную почту.'],
      ['Можно ли вернуть деньги?','Да. Пока работа не начата, оплата возвращается полностью по заявлению на почту в течение 10 рабочих дней. Если работа начата — возвращается часть за неоказанную услугу. Подробности в разделе «Правовая информация».'],
      ['Вы даёте бесплатную консультацию?','Бесплатна проверка объявления: присылаете ссылку — получаете короткое заключение. Полная проверка и устная консультация с юристом — платные услуги с фиксированной ценой.']
    ]},
    {c:'Данные и конфиденциальность',q:[
      ['Зачем Вам мои документы?','Чтобы проверка была точной. По выписке ЕГРН видно историю права и обременения, по договору — условия, которые нужно разобрать. Без документов проверка возможна, но менее полная.'],
      ['Где хранятся мои данные?','Заявки и файлы принимаются через сайт и почту и хранятся на серверах в России. В мессенджеры документы и персональные данные мы не принимаем.'],
      ['Я присылаю документы, где есть данные продавца — это законно?','Отправляя документы, Вы подтверждаете, что имеете право их передать. Мы обрабатываем данные третьих лиц строго для подготовки Вашего отчёта, не передаём их никому и удаляем в оговорённый срок.'],
      ['Как удалить свои данные?','Напишите на почту из реквизитов — удалим в течение 30 дней и сообщим об этом. Документы по проверке в любом случае удаляются через 90 дней после отправки результата.']
    ]}
  ];
  var faqNav=document.getElementById('faqNav'), faqBody=document.getElementById('faqBody');
  if(faqNav&&faqBody){
    faqNav.innerHTML=FAQ.map(function(g,i){ return '<button class="pk" type="button" data-i="'+i+'">'+g.c+' <em>'+g.q.length+'</em></button>'; }).join('');
    faqBody.innerHTML=FAQ.map(function(g,i){
      return '<div class="faq-cat rv" id="faq-'+i+'"><h3>'+g.c+' <em>'+g.q.length+'</em></h3><div class="acc">'+
        g.q.map(function(f,k){
          return '<div class="acc-i'+(i===0&&k===0?' open':'')+'"><button class="acc-b" type="button">'+f[0]+
            '<span class="chev"><svg width="11" height="7" viewBox="0 0 11 7"><path d="M1 1l4.5 4.5L10 1" stroke="#43616F" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg></span></button>'+
            '<div class="acc-p"><div><p>'+f[1]+'</p></div></div></div>';
        }).join('')+'</div></div>';
    }).join('');
    faqBody.querySelectorAll('.acc-b').forEach(function(b){
      b.addEventListener('click',function(){
        var it=b.closest('.acc-i'), open=it.classList.contains('open');
        b.closest('.acc').querySelectorAll('.acc-i').forEach(function(x){ x.classList.remove('open'); });
        if(!open) it.classList.add('open');
      });
    });
    faqNav.querySelectorAll('.pk').forEach(function(b){
      b.addEventListener('click',function(){
        faqNav.querySelectorAll('.pk').forEach(function(x){ x.classList.toggle('on',x===b); });
        var t=document.getElementById('faq-'+b.dataset.i);
        if(t) window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-96,behavior:REDUCE?'auto':'smooth'});
      });
    });
    var fq=document.getElementById('faqQ'), fnone=document.getElementById('faqNone'), fclear=document.getElementById('faqClear');
    function norm(s){ return s.toLowerCase().replace(/ё/g,'е'); }
    function search(){
      var q=norm((fq.value||'').trim());
      if(fclear) fclear.hidden=!q;
      faqNav.hidden=!!q;
      var found=0;
      faqBody.querySelectorAll('.faq-cat').forEach(function(cat){
        var vis=0;
        cat.querySelectorAll('.acc-i').forEach(function(it){
          var txt=norm(it.textContent);
          var m=!q||txt.indexOf(q)>-1;
          it.hidden=!m;
          if(m){ vis++; if(q) it.classList.add('open'); }
        });
        cat.hidden=vis===0; found+=vis;
      });
      if(fnone) fnone.hidden=found>0;
    }
    if(fq){ fq.addEventListener('input',search); }
    if(fclear) fclear.addEventListener('click',function(){ fq.value=''; search(); fq.focus(); });
  }

  /* ============ НАБЛЮДАТЕЛИ ============ */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el=e.target;
      if(el.classList.contains('rv')) el.classList.add('in');
      if(el.classList.contains('bar')) el.classList.add('in');
      if(el.classList.contains('cnt')){
        var to=+el.dataset.to, suf=el.dataset.suf||'', t0=performance.now(), dur=1100;
        (function run(now){
          var k=Math.min(1,(now-t0)/dur), v=Math.round(to*(1-Math.pow(1-k,3)));
          el.textContent=v+(k===1?suf:'');
          if(k<1) requestAnimationFrame(run);
        })(t0);
      }
      if(el.classList.contains('ring')){
        var C=2*Math.PI*74;
        var set=function(id,from,len){
          var c=document.getElementById(id); if(!c) return;
          c.style.transition='stroke-dasharray 1.2s cubic-bezier(.32,.72,0,1)';
          c.style.strokeDashoffset=(-C*from/307);
          setTimeout(function(){ c.style.strokeDasharray=(C*len/307)+' '+C; },60);
        };
        set('sOk',0,302); set('sWarn',302,4); set('sRisk',306,1);
      }
      io.unobserve(el);
    });
  },{threshold:.2,rootMargin:'0px 0px -6% 0px'});
  function observe(root){
    root.querySelectorAll('.rv:not(.in),.bar:not(.in),.cnt,.ring').forEach(function(el){ io.observe(el); });
    setTimeout(function(){
      root.querySelectorAll('.rv:not(.in)').forEach(function(el){
        if(el.getBoundingClientRect().top < window.innerHeight+200) el.classList.add('in');
      });
    },900);
  }
  ['sOk','sWarn','sRisk'].forEach(function(id){ var c=document.getElementById(id); if(c) c.style.strokeDasharray='0 999'; });

  var repIo=new IntersectionObserver(function(es){
    es.forEach(function(e){ e.target.classList.toggle('hl', e.isIntersecting && e.intersectionRatio>.6); });
  },{threshold:[0,.6,1],rootMargin:'-30% 0px -30% 0px'});
  document.querySelectorAll('#repList .risk-row').forEach(function(r){ repIo.observe(r); });

  function onScroll(){}

  /* ============ ФОРМЫ ============ */
  var MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function fields(f){ return Array.prototype.slice.call(f.querySelectorAll('[data-req],[data-one]')); }
  function filled(el){ if(el.type==='file') return el.files.length>0; if(el.type==='checkbox') return el.checked; return el.value.trim().length>0; }
  function markBad(el,bad){ var w=el.closest('.field'); if(w) w.classList.toggle('bad',bad); }
  function check(f,show){
    var ok=true, groups={};
    fields(f).forEach(function(el){
      if(el.dataset.one!==undefined){ (groups[el.dataset.one]=groups[el.dataset.one]||[]).push(el); return; }
      var bad=!filled(el) || (el.hasAttribute('data-mail') && !MAIL.test(el.value.trim()));
      if(bad) ok=false;
      if(show) markBad(el,bad);
    });
    Object.keys(groups).forEach(function(g){
      var any=groups[g].some(filled);
      if(!any) ok=false;
      if(show){
        var w=groups[g][0].closest('.field');
        if(w) w.classList.toggle('bad',!any);
        groups[g].forEach(function(el){ if(el.type!=='checkbox') markBad(el,!any); });
      }
    });
    var ags=f.querySelectorAll('.agree input[data-agree]');
    for(var k=0;k<ags.length;k++){
      var lab=ags[k].closest('.agree'), on=ags[k].checked;
      if(!on) ok=false;
      if(show&&lab) lab.classList.toggle('bad',!on);
    }
    return ok;
  }
  function refresh(f){
    var btn=f.querySelector('.submit'); if(btn) btn.classList.toggle('off',!check(f,false));
  }
  document.addEventListener('input',function(e){
    var f=e.target.closest('.mk-form'); if(!f) return;
    var w=e.target.closest('.field.bad'); if(w && filled(e.target)) w.classList.remove('bad');
    refresh(f);
  });
  document.addEventListener('change',function(e){
    var f=e.target.closest('.mk-form'); if(!f) return;
    if(e.target.type==='file'){
      var box=e.target.closest('.filebox');
      if(box){
        var n=e.target.files.length;
        box.querySelector('.fname').textContent = n ? (n===1 ? e.target.files[0].name : 'Выбрано файлов: '+n) : 'Выберите файлы';
        box.classList.toggle('has',n>0);
      }
    }
    if(e.target.closest('.agree')) e.target.closest('.agree').classList.remove('bad');
    refresh(f);
  });
  document.addEventListener('submit',function(e){
    var f=e.target.closest('.mk-form'); if(!f) return;
    e.preventDefault();
    if(!check(f,true)){
      var bad=f.querySelector('.field.bad input,.field.bad textarea,.field.bad select');
      if(bad) bad.focus(); else { var ag=f.querySelector('.agree.bad'); if(ag) ag.scrollIntoView({block:'center',behavior:REDUCE?'auto':'smooth'}); }
      return;
    }
    f.classList.add('sent');
  });

  /* ============ МОДАЛЬНЫЕ ФОРМЫ ============ */
  var SERVICES=['Консультация с юристом','Экспертиза договора купли-продажи','Сопровождение сделки',
    'Экспертиза договора подряда','Приёмка работ и досудебное урегулирование','Полное сопровождение строительства','Пока не знаю, нужен совет'];
  var ALL_SERVICES=['Проверка объявления — бесплатно','Проверка объекта недвижимости — 3 000 ₽','Проверка продавца — 3 000 ₽',
    'Комплексная проверка сделки — 5 000 ₽','Экспертиза договора купли-продажи — 5 000 ₽','Консультация с юристом — 3 000 ₽/час',
    'Сопровождение сделки — 10 000 ₽','Экспертиза договора подряда — 7 000 ₽','Приёмка работ и досудебное урегулирование — 50 000 ₽',
    'Полное сопровождение строительства — от 60 000 ₽','Пока не знаю, нужен совет'];
  var MAILFIELD={n:'email',l:'Почта, куда прислать результат',ty:'email',ph:'name@example.ru',req:1,e:'Укажите почту — иначе некуда отправить отчёт'};
  var FORMS={
    ad:{t:'Проверка объявления',s:'',
      f:[{n:'link',l:'Ссылка на объявление',ph:'cian.ru/sale/flat/…',req:1,e:'Вставьте ссылку на объявление'},MAILFIELD],
      d:'Заключение придёт на указанную почту до 2 часов.'},
    object:{t:'Проверка объекта недвижимости',s:'Заполните хотя бы одно поле об объекте — кадастровый номер, адрес или документы.',
      f:[{n:'kad',l:'Кадастровый номер',ph:'77:06:0004008:1234',one:'obj'},
         {n:'addr',l:'Адрес объекта',ph:'Москва, Профсоюзная ул., 43к2, кв. 118',one:'obj'},
         {n:'docs',l:'Документы по объекту',ty:'file',one:'obj',hint:'Выписка ЕГРН, договор, техплан — pdf, jpg, doc',e:'Заполните хотя бы одно из трёх полей выше'},
         MAILFIELD],
      d:'Отчёт по объекту придёт на указанную почту до 3 часов.'},
    seller:{t:'Проверка продавца',s:'Опишите продавца так, как он указан в документах, и приложите то, что есть на руках.',
      f:[{n:'seller',l:'Данные о продавце',ty:'textarea',ph:'ФИО, дата рождения, что известно: собственник, доверенное лицо, наследник…',req:1,e:'Опишите продавца — без этого проверять нечего'},
         {n:'docs',l:'Документы продавца',ty:'file',hint:'Паспортные данные из договора, доверенность, выписка — необязательно'},
         MAILFIELD],
      d:'Отчёт по продавцу придёт на указанную почту до 3 часов.'},
    full:{t:'Комплексная проверка сделки',s:'',
      f:[{n:'link',l:'Ссылка на объявление',ph:'cian.ru/sale/flat/… — необязательно'},
         {n:'kad',l:'Кадастровый номер',ph:'77:06:0004008:1234',one:'obj'},
         {n:'addr',l:'Адрес объекта',ph:'Москва, Профсоюзная ул., 43к2, кв. 118',one:'obj'},
         {n:'seller',l:'Данные о продавце',ty:'textarea',ph:'ФИО, дата рождения, что известно',req:1,e:'Опишите продавца — он половина этой проверки'},
         {n:'docs',l:'Документы по объекту и продавцу',ty:'file',one:'obj',hint:'Выписка ЕГРН, договор, доверенность — pdf, jpg, doc',e:'Заполните хотя бы одно из полей об объекте: кадастровый номер, адрес или документ'},
         MAILFIELD],
      d:'Сводный отчёт придёт на указанную почту в течение рабочего дня.'},
    consult:{t:'Получить консультацию',s:'Выберите услугу и опишите ситуацию — ответим, что нужно сделать и сколько это займёт.',
      f:[{n:'svc',l:'Какая услуга нужна',ty:'select',opts:SERVICES,req:1,e:'Выберите услугу из списка'},
         {n:'desc',l:'Опишите ситуацию',ty:'textarea',ph:'Что происходит, на каком этапе Вы находитесь и что хотите получить',req:1,e:'Опишите ситуацию — хотя бы в двух предложениях'},
         {n:'docs',l:'Документы',ty:'file',hint:'Договор, отчёт, переписка — необязательно'},
         MAILFIELD,
         {n:'other',l:'Другие контакты',ph:'Телефон или ник в Telegram — необязательно'},
         {n:'pref',l:'Как удобнее связаться',ty:'select',opts:['Почта','Телефон','Telegram']}],
      d:'Ответим на указанную почту в рабочее время.'},
    request:{t:'Оставить заявку',s:'Выберите нужную услугу и заполните поля — отчёт или ответ придёт письмом на указанную почту.',
      f:[{n:'svc',l:'Какая услуга нужна',ty:'select',opts:ALL_SERVICES,req:1,e:'Выберите услугу из списка'},
         {n:'link',l:'Ссылка на объявление',ph:'cian.ru/sale/flat/… — если проверяем объявление',one:'req'},
         {n:'kad',l:'Кадастровый номер или адрес объекта',ph:'77:06:0004008:1234 или Москва, Профсоюзная ул., 43к2, кв. 118',one:'req'},
         {n:'seller',l:'Данные о продавце',ty:'textarea',ph:'ФИО, дата рождения, что известно — если проверяем продавца',one:'req'},
         {n:'desc',l:'Комментарий к заявке',ty:'textarea',ph:'Что происходит, на каком этапе Вы находитесь и что хотите получить',one:'req'},
         {n:'docs',l:'Документы',ty:'file',one:'req',hint:'Выписка ЕГРН, договор, доверенность — pdf, jpg, doc',e:'Заполните хотя бы одно поле выше или приложите документ'},
         MAILFIELD],
      d:'Отчёт или ответ придёт на указанную почту в срок, указанный для выбранной услуги.'}
  };
  function fieldHtml(x,i){
    var id='m-'+x.n+'-'+i, req=x.req?' data-req':'', one=(x.one!==undefined)?' data-one="'+x.one+'"':'';
    var mail=(x.ty==='email')?' data-mail':'';
    var inner;
    if(x.ty==='textarea') inner='<textarea id="'+id+'" name="'+x.n+'" placeholder="'+(x.ph||'')+'"'+req+one+'></textarea>';
    else if(x.ty==='select') inner='<select id="'+id+'" name="'+x.n+'"'+req+one+'>'+x.opts.map(function(o){return '<option>'+o+'</option>';}).join('')+'</select>';
    else if(x.ty==='file') inner='<label class="filebox" for="'+id+'"><span class="clip"><svg width="15" height="15" viewBox="0 0 16 16"><path d="M11 4.5 5.8 9.7a2 2 0 1 0 2.8 2.8l5.4-5.4a3.4 3.4 0 0 0-4.8-4.8L3.6 8a4.8 4.8 0 0 0 6.8 6.8l4.4-4.4" stroke="#164C68" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg></span><span class="fname">Выберите файлы</span><input id="'+id+'" name="'+x.n+'" type="file" multiple'+req+one+'></label>';
    else inner='<input id="'+id+'" name="'+x.n+'" type="'+(x.ty||'text')+'" placeholder="'+(x.ph||'')+'"'+req+one+mail+'>';
    return '<div class="field"><label for="'+id+'">'+x.l+'</label>'+inner+
      (x.hint?'<span class="hint">'+x.hint+'</span>':'')+
      (x.e?'<span class="err"><b>!</b>'+x.e+'</span>':'')+'</div>';
  }
  var modal=document.getElementById('modal'), mForm=document.getElementById('mForm');
  var mTitle=document.getElementById('mTitle'), mSub=document.getElementById('mSub'),
      mFields=document.getElementById('mFields'), mDoneText=document.getElementById('mDoneText');
  var lastFocus=null;
  function openForm(key,svc){
    var cfg=FORMS[key]; if(!cfg||!modal) return;
    lastFocus=document.activeElement;
    mForm.classList.remove('sent');
    mTitle.textContent=cfg.t;
    mSub.textContent=cfg.s||''; mSub.hidden=!cfg.s;
    mFields.innerHTML=cfg.f.map(fieldHtml).join('');
    mDoneText.textContent=cfg.d;
    mForm.querySelectorAll('.agree').forEach(function(a){ a.classList.remove('bad'); });
    mForm.querySelectorAll('.agree input').forEach(function(i){ i.checked=false; });
    if(svc){ var sel=mFields.querySelector('select[name="svc"]'); if(sel) sel.value=svc; }
    document.body.classList.add('modal-open'); modal.setAttribute('aria-hidden','false');
    refresh(mForm);
    setTimeout(function(){ var first=mFields.querySelector('input,textarea,select'); if(first) first.focus(); },260);
  }
  function closeForm(){
    if(!modal) return;
    document.body.classList.remove('modal-open'); modal.setAttribute('aria-hidden','true');
    if(lastFocus&&lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-form]');
    if(b){ e.preventDefault(); openForm(b.dataset.form,b.dataset.svc); return; }
    if(e.target.closest('#modalX')||e.target===modal) closeForm();
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&document.body.classList.contains('modal-open')) closeForm(); });

  /* ============ ВЫПАДАЮЩИЙ СПИСОК ============ */
  var navSvc=document.getElementById('navSvc');
  var navDrop=navSvc?navSvc.closest('.nav-drop'):null;
  if(navDrop){
    navDrop.querySelectorAll('.drop a').forEach(function(a){
      a.addEventListener('click',function(){
        navDrop.classList.add('shut');
        if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
      });
    });
    navDrop.addEventListener('mouseleave',function(){ navDrop.classList.remove('shut'); });
    if(navSvc) navSvc.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); navDrop.classList.remove('shut'); var a=navDrop.querySelector('.drop a'); if(a) a.focus(); }
    });
  }


  /* ============ COOKIE-БАННЕР ============ */
  (function(){
    var bar=document.getElementById('cookieBar'); if(!bar) return;
    var KEY='mayak-cookie';
    var saved=null;
    try{ saved=localStorage.getItem(KEY); }catch(e){}
    if(!saved) bar.hidden=false;
    function store(v){ try{ localStorage.setItem(KEY,v); }catch(e){} bar.hidden=true; }
    bar.addEventListener('click',function(e){
      var b=e.target.closest('[data-cookie]'); if(!b) return;
      var a=b.dataset.cookie;
      if(a==='all') store('all');
      else if(a==='need') store('need');
      else if(a==='custom'){ var st=document.getElementById('cookieSet'); if(st) st.hidden=!st.hidden; }
      else if(a==='save'){ var ck=document.getElementById('ckAnalytics'); store(ck&&ck.checked?'all':'need'); }
    });
  })();

  /* ============ МНОГОСТРАНИЧНЫЙ РЕЖИМ (Tilda) ============ */
  /* Каждая страница Tilda — отдельный документ, поэтому SPA-роутер не нужен.
     Ссылки в разметке ведут на обычные адреса. Здесь только показываем
     содержимое страницы и запускаем появление блоков и наблюдатели. */
  document.querySelectorAll('.page').forEach(function(p){ p.hidden=false; });
  observe(document);
  onScroll();

  /* Подсветка текущего пункта меню по адресу страницы */
  (function(){
    var path=(location.pathname||'/').replace(/\/$/,'')||'/';
    document.querySelectorAll('.nav a, .drop a, .foot-nav a, .foot-docs a').forEach(function(a){
      var href=(a.getAttribute('href')||'').split('#')[0].replace(/\/$/,'')||'/';
      if(href===path) a.classList.add('on');
    });
    var svcOn=(path==='/property'||path==='/build');
    var ns=document.getElementById('navSvc');
    if(ns&&svcOn) ns.classList.add('on');
  })();

  }
})();
