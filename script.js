// script.js
async function loadData() {
  try {
    const res = await fetch('./home.json');
    if (!res.ok) throw new Error('Failed to load home.json');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function createGameElement(game) {
  return `<a href="${game.link}"><div class="col-6 col-sm-4 col-md-3 col-lg-2">
      <div class="m-0 p-2" style="border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 1px 1px 3px black; border-radius: 12px; background-color: rgba(0,0,0,0.25); backdrop-filter: blur(10px);">
        <img style="border-radius:12px; aspect-ratio:10/12; object-fit:cover; object-position:top;" src="${game.img}" class="d-block w-100" alt="Game Image" onerror="this.onerror=null;this.src='https://placehold.co/100x100/4B5563/FFFFFF?text=No+Image'">
        <div class="text-white h5" style="text-align:center; font-size:1rem;">${game.title}</div>
      </div>
    </div></a>`;
}

function createShelfItemHTML(item) {
  return `
      <a href="${item.link}">
        <div class="row shelves-items-row mb-1" onclick="console.log('Viewing details for ${item.title}')">
          <div class="row align-items-center">
            <div class="col-4">
              <img src="${item.img}" alt="${item.title} cover" class="d-block w-100" style="border-radius:10px; aspect-ratio:10/12; object-fit:cover; object-position:center;" onerror="this.onerror=null;this.src='https://placehold.co/100x100/4B5563/FFFFFF?text=No+Image'">
            </div>
            <div class="col-8"><div class="h6 mb-1">${item.title}</div></div>
          </div>
        </div>
      </a><hr id="hr-shelves">
    `;
}

// Stories 

function renderStories(stories) {
  const container = document.getElementById('stories-container');
  if (!container) return;
  container.innerHTML = (stories || []).map(story => `
    <div class="col-12 col-md-4 p-2 p-md-1">
      <a href="${story.link}" style="display:block;height:100%;">
        <div id="Stories" class="m-0 p-2 d-flex flex-column justify-content-between story-card-wrapper" style="border-radius:12px;backdrop-filter:blur(10px);height:100%;border: 1px solid rgba(255, 255, 255, 0.2);">
          <img src="${story.img}" class="d-block w-100" style="border-radius:10px;aspect-ratio:16/9;object-fit:cover;object-position:top;">
          <div class="text-white h5 mt-2" style="text-align:center;font-size:1rem;font-weight:600;">${story.title}</div>
          <div class="p-1 flex-grow-1" style="opacity: 0.6;">${story.description}</div>
          <button class="btn btn-secondary mt-2">Read More <i class="fa-solid fa-square-arrow-up-right"></i></button>
        </div>
      </a>
    </div>
  `).join('');
}

function renderTrending(trending) {
  const list = document.getElementById("trending-list");
  if (!list) return;
  list.innerHTML = trending.map((item, index) => `
      <a href="${item.link}">
        <div class="row shelves-items-row align-items-center m-lg-2 m-sm-1 mb-0">
          <div class="col-4"><img src="${item.img}" class="d-block w-100" style="border-radius:10px; aspect-ratio:1/1; object-fit:cover; " onerror="this.onerror=null;this.src='https://placehold.co/100x100/4B5563/FFFFFF?text=No+Image'"></div>
          <div class="col-8"><div class="h6 mb-1">${item.title}</div><div class="text-white-50 d-none d-sm-block" style="font-size:small;">${item.description}</div></div>
        </div>
      </a>${index < trending.length - 1 ? '<hr>' : ''}
    `).join('');
}

function renderShelves(shelves) {
  const topSellingContainer = document.getElementById('top-selling-items');
  const mostPlayedContainer = document.getElementById('most-played-items');
  const upcomingContainer = document.getElementById('upcoming-items');
  if (topSellingContainer) topSellingContainer.innerHTML = (shelves.topSelling || []).map(createShelfItemHTML).join('');
  if (mostPlayedContainer) mostPlayedContainer.innerHTML = (shelves.mostPlayed || []).map(createShelfItemHTML).join('');
  if (upcomingContainer) upcomingContainer.innerHTML = (shelves.upcoming || []).map(createShelfItemHTML).join('');
}

function initAutoScroll() {
  const gameRow = document.getElementById('game-row');
  if (!gameRow) return;
  const scrollInterval = 4000;
  let gameCards = gameRow.querySelectorAll('.col-6');
  if (gameCards.length === 0) return;
  let currentIndex = 0;
  const autoScroll = () => {
    currentIndex = (currentIndex + 1) % gameCards.length;
    const nextCard = gameCards[currentIndex];
    gameRow.scrollTo({ left: nextCard.offsetLeft - gameRow.offsetLeft, behavior: 'smooth' });
  };
  let scrollTimer = setInterval(autoScroll, scrollInterval);
  gameRow.addEventListener('mouseenter', () => clearInterval(scrollTimer));
  gameRow.addEventListener('mouseleave', () => { scrollTimer = setInterval(autoScroll, scrollInterval); });
  gameRow.style.scrollBehavior = 'smooth';
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadData();
  if (!data) return;

  // games grid
  const gameListingsContainer = document.getElementById('game-listings');
  if (gameListingsContainer && Array.isArray(data.games)) {
    gameListingsContainer.innerHTML = data.games.map(createGameElement).join('');
  }

  // game row (auto-scroll strip)
  const gameRow = document.getElementById('game-row');
  if (gameRow && Array.isArray(data.games)) {
    gameRow.innerHTML = data.games.map(g => `
        <div class="col-6 col-sm-4 col-md-3 col-lg-2">
          <a href="${g.link}" style="display:block;height:100%;">
            <div id="auto-scroll-items" class="m-0 p-2 d-flex flex-column justify-content-between" style="border-radius:12px;backdrop-filter:blur(10px);height:100%;">
              <img style="border-radius:10px; aspect-ratio:10/12; object-fit:cover; object-position:top;" src="${g.img}" class="d-block w-100" alt="${g.title}">
              <div class="text-white h5" style="text-align:center;font-size:1rem;">${g.title}</div>
            </div>
          </a>
        </div>
      `).join('');
  }

  // shelves, stories, trending
  renderShelves(data.shelves || {});
  renderTrending(data.trending || []);
  renderStories(data.stories);
  renderStories2(data.stories2 || []);

  // animate items (if using .item class)
  setTimeout(() => {
    const items = document.querySelectorAll('.item');
    items.forEach((el, i) => setTimeout(() => el.classList.add('show'), 150 + i * 90));
  }, 150);

  // init auto scroll after DOM injected
  initAutoScroll();
});

//   Courosal

async function loadCarousel() {
  const res = await fetch("./home.json");
  const data = await res.json();

  const container = document.getElementById("carousel-slides");
  if (!container) return;

  container.innerHTML = data.carousel
    .map((item, i) => `
            <div class="carousel-item ${i === 0 ? "active" : ""}" data-bs-interval="2000">
              <a href="${item.link}" style="display:block;">
              <img src="${item.img}" class="d-block w-100" alt="carousel img">
              </a>
            </div>
        `)
    .join("");
}

document.addEventListener("DOMContentLoaded", loadCarousel);

// Navbar transparent effect

window.addEventListener('scroll', function () {
  const navbar = document.getElementById('myNavbar');
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Stories 2

function renderStories2(stories) {
  const container = document.getElementById('stories-container-2');
  if (!container) return;
  container.innerHTML = stories.map(story => `
      <div class="col-12 col-md-4 p-2 p-md-1">
          <a href="${story.link}" style="display:block;height:100%;">
              <div id="Stories" class="m-0 p-2 d-flex flex-column justify-content-between story-card-wrapper"
                   style="border-radius:12px;backdrop-filter:blur(10px);height:100%;border: 1px solid rgba(255, 255, 255, 0.2);">
                  <img src="${story.img}" class="d-block w-100"
                       style="border-radius:10px;aspect-ratio:16/9;object-fit:cover;object-position:top;">
                  <div class="text-white h5 mt-2" style="text-align:center;font-size:1rem;font-weight:600;">
                     ${story.title}
                  </div>
                  <div class="p-1 flex-grow-1" style="opacity: 0.6;">${story.description}</div>
                  <button class="btn btn-secondary mt-2">
                     Read More <i class="fa-solid fa-square-arrow-up-right"></i>
                  </button>
              </div>
          </a>
      </div>
  `).join('');
}

// New shelves

/* === New shelves renderer (paste into script.js) === */
(async function renderNewShelvesPatch() {
  // safe fallback: use existing createShelfItemHTML if available, otherwise define one
  const shelfTemplate = (item) => {
    if (typeof createShelfItemHTML === 'function') return createShelfItemHTML(item);
    const img = item.img || 'https://placehold.co/100x100/4B5563/FFFFFF?text=No+Image';
    const title = item.title || '';
    const link = item.link || '#';
    return `
      <a href="${link}">
        <div class="row shelves-items-row mb-1">
          <div class="row align-items-center g-0">
            <div class="col-4 pe-2">
              <img src="${img}" alt="${title} cover" class="d-block w-100" style="border-radius:10px; aspect-ratio:10/12; object-fit:cover;" onerror="this.onerror=null;this.src='https://placehold.co/100x100/4B5563/FFFFFF?text=No+Image'">
            </div>
            <div class="col-8 ps-2"><div class="h6 mb-1">${title}</div></div>
          </div>
        </div>
      </a><hr id="hr-shelves">`;
  };

  // wait for DOM ready
  if (document.readyState === 'loading') await new Promise(r => document.addEventListener('DOMContentLoaded', r));

  try {
    const resp = await fetch('./home.json');
    if (!resp.ok) throw new Error('Failed to load home.json for new shelves');
    const data = await resp.json();
    const shelves = data.shelves || {};

    // target containers
    const editorsEl = document.getElementById('editors-picks-items');
    const recentEl = document.getElementById('recently-updated-items');
    const gemsEl = document.getElementById('hidden-gems-items');

    if (editorsEl) {
      const list = Array.isArray(shelves.editorsPicks) ? shelves.editorsPicks : [];
      editorsEl.innerHTML = list.map(shelfTemplate).join('');
    }
    if (recentEl) {
      const list = Array.isArray(shelves.recentlyUpdated) ? shelves.recentlyUpdated : [];
      recentEl.innerHTML = list.map(shelfTemplate).join('');
    }
    if (gemsEl) {
      const list = Array.isArray(shelves.hiddenGems) ? shelves.hiddenGems : [];
      gemsEl.innerHTML = list.map(shelfTemplate).join('');
    }
  } catch (err) {
    // non-blocking: log but don't break other scripts
    console.error('New shelves patch error:', err);
  }
})();

// Search

// compact unified search (mobile+desktop)
// expects: #Nav-Search (input), #nav-search-form (form), optional global `fuse` or `window.GAMES`
(() => {
  const $in = id => document.getElementById(id);
  const searchInput = $in('Nav-Search');
  const form = $in('nav-search-form');
  let resultsBox = $in('searchResults') || (() => { const d = document.createElement('div'); d.id='searchResults'; document.body.appendChild(d); return d; })();

  // base styles (safety)
  Object.assign(resultsBox.style, {
    position: 'fixed', zIndex: 20000, display: 'none', boxSizing: 'border-box',
    maxHeight: '60vh', overflowY: 'auto', padding: '8px'
  });
  resultsBox.style.scrollbarWidth = 'none';
  resultsBox.style.msOverflowStyle = 'none';

  const escapeHtml = s => String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render(items){
    resultsBox.innerHTML = items.length ? items.map(it=>`
      <a class="search-row" href="${escapeHtml(it.link||'#')}">
        <img src="${escapeHtml(it.img||'')}" alt="${escapeHtml(it.title||'')}" />
        <div class="search-info">
          <div class="title">${escapeHtml(it.title||'Untitled')}</div>
          <div class="rating">${it.rating? '⭐ '+escapeHtml(it.rating): ''}</div>
        </div>
      </a>
    `).join('') : `<div class="search-no-results">No results found</div>`;
  }

  function position(){
    const r = searchInput.getBoundingClientRect(), scrollY = window.scrollY || 0, vw = Math.max(document.documentElement.clientWidth, window.innerWidth);
    if (resultsBox.parentElement !== document.body) document.body.appendChild(resultsBox);
    const top = r.bottom + scrollY + 8;
    if (vw <= 767) { resultsBox.style.left='8px'; resultsBox.style.width='calc(100% - 16px)'; resultsBox.style.top=top+'px'; }
    else { resultsBox.style.left = r.left + 'px'; resultsBox.style.width = Math.max(r.width,320) + 'px'; resultsBox.style.top = top + 'px'; }
  }

  function show(){ position(); resultsBox.style.display='block'; }
  function hide(collapse=false){ resultsBox.style.display='none'; if(collapse){ searchInput.value=''; searchInput.style.width='0'; searchInput.style.display='none'; } }

  // search logic — replace with your fuse/runSearch if needed
  function doSearch(q){
    if (!q) return [];
    if (typeof fuse !== 'undefined') return fuse.search(q).map(r=>r.item);
    if (typeof runSearch === 'function') return runSearch(q);
    if (Array.isArray(window.GAMES)) return window.GAMES.filter(g=> (g.title||'').toLowerCase().includes(q.toLowerCase()));
    return [];
  }

  // input handler
  searchInput.addEventListener('input', ()=> {
    const q = searchInput.value.trim();
    if (!q) return hide();
    const res = doSearch(q);
    render(res);
    show();
  });

  // toggle button(s) — hide magnifier on mobile when opened
  Array.from(document.querySelectorAll('#nav-search-form button[type="button"]')).forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const open = searchInput.style.display !== 'none' && searchInput.style.width && searchInput.style.width !== '0px';
      if (!open) {
        searchInput.style.display='block';
        setTimeout(()=> searchInput.style.width='220px', 10);
        searchInput.focus();
        if (window.innerWidth <= 767) btn.style.display = 'none'; // hide icon on mobile when opening
      } else {
        // closing: restore any hidden buttons
        document.querySelectorAll('#nav-search-form button').forEach(b=>b.style.display='flex');
        hide(true);
      }
    });
  });

  // ensure search icon reappears if input collapsed by ESC/outside click
  document.addEventListener('keydown', e => { if (e.key==='Escape') { document.querySelectorAll('#nav-search-form button').forEach(b=>b.style.display='flex'); hide(true); } });

  // clicks inside results: open same tab (prevent new tab)
  resultsBox.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    const href = a.getAttribute('href') || '#';
    if (href && href !== '#') window.location.href = href;
    hide(true);
    // restore search icon(s)
    document.querySelectorAll('#nav-search-form button').forEach(b=>b.style.display='flex');
  });

  // click outside -> hide and restore icons
  document.addEventListener('click', e => {
    if (!resultsBox.contains(e.target) && e.target !== searchInput && !Array.from(document.querySelectorAll('#nav-search-form button')).some(b=>b.contains(e.target))) {
      document.querySelectorAll('#nav-search-form button').forEach(b=>b.style.display='flex');
      hide();
    }
  });

  // reposition on resize/orientation
  window.addEventListener('resize', ()=> { if (resultsBox.style.display==='block') position(); });
  window.addEventListener('orientationchange', ()=> { if (resultsBox.style.display==='block') position(); });

})();

// Sparkles in NavBar

(function () {
  const c = document.getElementById('navSparkles'), nav = document.getElementById('myNavbar');
  if (!c || !nav) return;
  function make(x, y) { const d = document.createElement('div'); d.className = 's'; d.style.left = x + 'px'; d.style.top = y + 'px'; c.appendChild(d); setTimeout(() => d.remove(), 1400) }
  // ambient
  setInterval(() => { const r = nav.getBoundingClientRect(); make(r.left + Math.random() * r.width, r.top + Math.random() * (r.height - 8) + 8) }, 200);
  // cursor trail inside navbar (throttled)
  let t = 0; nav.addEventListener('mousemove', e => { const now = performance.now(); if (now - t < 30) return; t = now; make(e.pageX + (Math.random() - 0.5) * 8, e.pageY + (Math.random() - 0.5) * 6) });
})();


// News

fetch('./home.json')
  .then(res => res.json())
  .then(data => {
    if (!data.news) return;
    const html = data.news.map(item => `
      <a href="${item.link}">
    <div class="row mx-0 mx-md-5 mt-2 mb-2 news glass-shine"
         style="background-color:rgba(0,0,0,0.25); backdrop-filter:blur(8px); border-radius:12px; border: 1px solid rgba(255, 255, 255, 0.1);">  
      <div class="col-12 col-md-4 p-4">
        <img src="${item.img}" 
             style="border-radius:12px; width:100%; height:250px; object-fit:cover;">
      </div>
      <div class="col-12 col-md-8 p-4">
        <div class="h3 p-2 kano">${item.title}</div>
        <div class="h6 ps-2 pe-2" style="height:175px; overflow-y:auto;">
        ${item.description.replace(/\n/g, "<br>")}
        </div>
      </div>
    </div>
  </a>
    `).join('');

    const newsContainer = document.getElementById('news-1');
    if (newsContainer) newsContainer.innerHTML = html;
  });

// Loader

const hideLoader = () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
};

window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 5000); // 5000ms = 5 seconds

// Search function

(async function(){
  const JSON_PATHS=['./Trending.json','./Top-free.json','./Top-paid.json','./Gamepage/assets/data.json'],
        MAX_RESULTS=20, FUSE_THRESHOLD=0.36;
  const navForm=document.getElementById('nav-search-form'),
        searchInput=document.getElementById('Nav-Search');
  if(!navForm||!searchInput) return;

  const mag=navForm.querySelector('i.fa-magnifying-glass, i.fa-search, i.fa-solid.fa-magnifying-glass'),
        searchBtn=mag?mag.closest('button'):navForm.querySelector('button');

  let resultsEl=document.getElementById('searchResults');
  if(!resultsEl){ resultsEl=document.createElement('div'); resultsEl.id='searchResults'; document.body.appendChild(resultsEl); }

  navForm.addEventListener('submit', e=>e.preventDefault());

  async function ensureFuse(){
    if(window.Fuse) return;
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js';
      s.onload=res; s.onerror=()=>rej(); document.head.appendChild(s);
    });
  }
  await ensureFuse();

  const escHtml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
        escAttr=s=>String(s||'').replace(/"/g,'&quot;'),
        highlight=(t,q)=>{
          const i=t.toLowerCase().indexOf(q.toLowerCase());
          return i===-1?escHtml(t):escHtml(t.slice(0,i))+"<mark>"+escHtml(t.slice(i,i+q.length))+"</mark>"+escHtml(t.slice(i+q.length));
        };

  async function tryFetch(u){ try{ const r=await fetch(u); if(!r.ok) return null; return await r.json(); }catch{ return null; } }

  let allItems=[], fuse=null;
  async function loadAll(){
    const old=searchInput.placeholder;
    searchInput.disabled=true;
    searchInput.placeholder='Loading search...';
    const datas=await Promise.all(JSON_PATHS.map(tryFetch));
    const arrs=datas.filter(Boolean);
    allItems=arrs.flatMap(d=>{
      if(Array.isArray(d)) return d;
      if(Array.isArray(d.items)) return d.items;
      if(Array.isArray(d.games)) return d.games;
      if(Array.isArray(d.data)) return d.data;
      return [];
    }).map(x=>({
      title: (x.title||x.name||'').trim(),
      img: x.img||x.image||'',
      link: x.link||x.url||'#',
      rating: x.rating||''
    })).filter(x=>x.title);
    fuse=new Fuse(allItems,{keys:['title'],includeScore:true,threshold:FUSE_THRESHOLD});
    searchInput.disabled=false;
    searchInput.placeholder=old;
    console.log('Search index:', allItems.length);
  }
  await loadAll();

  let selectedIndex=-1;

  function render(results,q){
    selectedIndex=-1;
    if(!q){ resultsEl.style.display='none'; return; }
    resultsEl.style.display='block';
    if(!results.length){
      resultsEl.innerHTML=`<div class="search-no-results">No results for "<strong>${escHtml(q)}</strong>"</div>`;
      positionResults(); return;
    }
    resultsEl.innerHTML=results.slice(0,MAX_RESULTS).map((item,i)=>`
      <a class="search-row" data-idx="${i}" href="${escAttr(item.link)}" target="_blank">
        <img src="${escAttr(item.img)}" onerror="this.style.display='none'" width="48" height="64" style="border-radius: 8px">
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;white-space:wrap;overflow:hidden;text-overflow:ellipsis;">
            ${highlight(item.title,q)}
          </div>
          <div class="aquatico" style="font-size:12px;color:rgba(255,255,255,0.6)">
            <i class="fa-solid fa-star"></i> ${escHtml(item.rating)}
          </div>
        </div>
      </a>`).join('');
    positionResults();
  }

  function doQuery(q){
    q=q.trim(); if(!q) return [];
    const exact=[], starts=[], includes=[];
    const ql=q.toLowerCase();
    for(const it of allItems){
      const t=it.title.toLowerCase();
      if(t===ql) exact.push(it);
      else if(t.startsWith(ql)) starts.push(it);
      else if(t.includes(ql)) includes.push(it);
    }
    const fuzzy = (fuse?fuse.search(q).map(r=>r.item):[]);
    const out=[]; const seen=new Set();
    for(const arr of [exact,starts,includes,fuzzy]) for(const it of arr) if(!seen.has(it.title)){ seen.add(it.title); out.push(it); }
    return out;
  }

  function positionResults(){
    if(resultsEl.style.display==='none') return;
    const r = searchInput.getBoundingClientRect();
    // Use fixed coords so mobile address-bar/scroll won't push it off-screen
    const vw = window.innerWidth;
    const width = Math.min(420, Math.max(260, r.width + 40));
    let left = r.left;
    if (left + width > vw - 12) left = vw - width - 12;
    // prefer placing below input; if not enough space, place above
    const spaceBelow = window.innerHeight - r.bottom;
    const preferredTop = r.bottom + 8;
    const altTop = Math.max(8, r.top - 8 - resultsEl.offsetHeight);
    const top = (spaceBelow < Math.min(resultsEl.offsetHeight || 200, window.innerHeight * 0.45)) ? altTop : preferredTop;
  
    resultsEl.style.width = width + 'px';
    resultsEl.style.left = Math.max(8, left) + 'px';
    resultsEl.style.top = Math.max(8, top) + 'px';
    resultsEl.style.display = 'block';
  }  

  function openSearch(){ searchInput.style.display='block'; setTimeout(()=>searchInput.style.width='200px',10); searchInput.focus(); positionResults(); }
  function closeSearch(){ searchInput.style.width='0'; setTimeout(()=>{ searchInput.style.display='none'; resultsEl.style.display='none'; },300); }

  if(searchBtn){
    searchBtn.addEventListener('pointerdown',e=>e.stopImmediatePropagation());
    searchBtn.addEventListener('click',e=>{ e.preventDefault(); openSearch(); resultsEl.innerHTML=''; });
  }

  const stop=e=>e.stopPropagation();
  searchInput.addEventListener('pointerdown',stop);
  resultsEl.addEventListener('pointerdown',stop);

  searchInput.addEventListener('input',()=> render(doQuery(searchInput.value), searchInput.value));

  searchInput.addEventListener('keydown',e=>{
    const rows=resultsEl.querySelectorAll('.search-row');
    if(e.key==='ArrowDown'){ e.preventDefault(); if(rows.length) selectedIndex=(selectedIndex+1)%rows.length; }
    if(e.key==='ArrowUp'){ e.preventDefault(); if(rows.length) selectedIndex=(selectedIndex-1+rows.length)%rows.length; }
    if(e.key==='Enter'){ e.preventDefault(); const rowsNow=resultsEl.querySelectorAll('.search-row'); if(selectedIndex>=0 && rowsNow[selectedIndex]) rowsNow[selectedIndex].click(); }
    if(e.key==='Escape'){ searchInput.value=''; render([], ''); closeSearch(); }
    // update visual selection
    Array.from(resultsEl.querySelectorAll('.search-row')).forEach((el,i)=> el.classList.toggle('selected', i===selectedIndex));
  });

  document.addEventListener('pointerdown', e=>{ if(navForm.contains(e.target)||resultsEl.contains(e.target)) return; closeSearch(); }, true);
  window.addEventListener('scroll', ()=>{ if(resultsEl.style.display!=='none') positionResults(); }, true);
  window.addEventListener('resize', positionResults);
})();

// Data Saver for mobile

(function(){
  const MOBILE_MAX = 767;
  const proxyHost = 'https://images.weserv.nl/';

  function makeProxyUrl(orig, w=960, q=45){
    if (!orig) return orig;
    if (/^(data:|blob:)/.test(orig)) return orig;
    try {
      const u = new URL(orig, location.href);
      if (u.href.startsWith(proxyHost)) return u.href;
      const hostPath = u.href.replace(/^https?:\/\//,'');
      return `${proxyHost}?url=${encodeURIComponent(hostPath)}&w=${w}&q=${q}`;
    } catch(e){
      return orig;
    }
  }

  function applyLowQuality(img){
    if (img.dataset.lqApplied) return;
    const orig = img.dataset.origSrc || img.getAttribute('src') || img.src;
    img.dataset.origSrc = orig;
    img.loading = img.loading || 'lazy';
    img.decoding = img.decoding || 'async';

    const p320 = makeProxyUrl(orig, 320, 40);
    const p640 = makeProxyUrl(orig, 640, 35);
    const p960 = makeProxyUrl(orig, 960, 30);

    // set a small low-quality src immediately, keep srcset for responsive picks
    img.src = p320;
    img.srcset = `${p320} 320w, ${p640} 640w, ${p960} 960w`;
    img.sizes  = '(max-width: 767px) 100vw, 960px';

    // remove any pixelated rendering — keep normal smooth rendering
    img.style.imageRendering = '';

    function onError(){
      img.removeEventListener('error', onError);
      if (img.dataset.origSrc) {
        img.src = img.dataset.origSrc;
        img.removeAttribute('srcset');
        img.removeAttribute('sizes');
        img.style.imageRendering = '';
        delete img.dataset.lqApplied;
        console.warn('Proxied image failed, reverted to original:', img.dataset.origSrc);
      }
    }
    img.addEventListener('error', onError);

    img.dataset.lqApplied = '1';
  }

  function revertImg(img){
    if (img.dataset.origSrc && window.innerWidth > MOBILE_MAX){
      img.src = img.dataset.origSrc;
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.style.imageRendering = '';
      delete img.dataset.lqApplied;
    }
  }

  function runOnce(){
    document.querySelectorAll('img').forEach(img=>{
      if (window.innerWidth <= MOBILE_MAX) applyLowQuality(img);
      else revertImg(img);
    });
  }

  window.addEventListener('resize', (()=>{
    let t; return ()=>{ clearTimeout(t); t=setTimeout(runOnce,150); };
  })());

  document.addEventListener('DOMContentLoaded', runOnce);

  new MutationObserver(muts=>{
    muts.forEach(m=>{
      m.addedNodes && m.addedNodes.forEach(n=>{
        if (n.nodeType===1 && n.tagName==='IMG') {
          if (window.innerWidth <= MOBILE_MAX) applyLowQuality(n);
        } else if (n.querySelectorAll){
          n.querySelectorAll('img').forEach(img => { if (window.innerWidth <= MOBILE_MAX) applyLowQuality(img); });
        }
      });
    });
  }).observe(document.documentElement, {childList:true, subtree:true});
})();
