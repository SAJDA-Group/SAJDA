/* ==========================================================================
   SAJDA — video library
   To add a video, put a new entry at the TOP of SAJDA_VIDEOS (newest first).
     id        the YouTube id: the part after youtu.be/ or shorts/
     vertical  true for a Short / portrait film
     thumb     optional local image; YouTube's own thumbnail is used without it
     series    optional key into SAJDA_SERIES, for videos that are part of a playlist
   Any element with [data-video-grid] is filled with cards; data-limit="3"
   shows only the newest three. Add data-collapse-series to show each series
   as ONE card that plays the whole playlist, in place of its parts.
   [data-series-links] gets a "play the full series" button per series.
   ========================================================================== */
var SAJDA_VIDEOS = [
  {
    id: 'CbmjGDq13Ow',
    series: 'ujumbe',
    title: 'Ujumbe kutoka SAJDA 1/3: Hapa Ndipo Wanasomea',
    tag: 'Sheikh Bashir · Part 1',
    duration: '1:10',
    thumb: 'assets/img/videos/ujumbe-sehemu-1.jpg',
    desc: 'Students who have studied under a tree for two years, in rain or sun. In Kiswahili, with English subtitles.'
  },
  {
    id: 'xFBPRIIhlRE',
    series: 'ujumbe',
    title: 'Ujumbe kutoka SAJDA 2/3: Madarasa na Wakfu',
    tag: 'Sheikh Bashir · Part 2',
    duration: '1:21',
    thumb: 'assets/img/videos/ujumbe-sehemu-2.jpg',
    desc: 'The plan to build classrooms, and a Waqf to pay teachers and keep the madrasas running. In Kiswahili, with English subtitles.'
  },
  {
    id: '8N4p-2M5tU4',
    series: 'ujumbe',
    title: 'Ujumbe kutoka SAJDA 3/3: Harambee ya Desemba',
    tag: 'Sheikh Bashir · Part 3',
    duration: '1:11',
    thumb: 'assets/img/videos/ujumbe-sehemu-3.jpg',
    desc: 'An invitation to every Muslim, sponsor and leader to stand with SAJDA at the December 2026 Harambee. In Kiswahili, with English subtitles.'
  },
  {
    id: 'Mnc3_APnppo',
    title: 'Morning in the Madrasa',
    tag: 'Madrasa Life',
    duration: '1:55',
    thumb: 'assets/img/videos/morning-in-the-madrasa.jpg',
    desc: 'Children across our madrasa centres reading the Qur’an, reciting before their class, and reciting together.'
  },
  {
    id: 'RKYIf7L-pLo',
    title: 'We Did Not Wait',
    tag: 'The Film',
    duration: '1:47',
    vertical: true,
    thumb: 'assets/img/film-poster.jpg',
    desc: 'Under a tree. Under iron sheets. On bare earth. Rtd. Senior Chief Hussein Charfi calls on the community to give.'
  }
];

/* A playlist on YouTube. list is the id after ?list= in the playlist link. */
var SAJDA_SERIES = {
  ujumbe: {
    list: 'PLb7ulQ3Ksrzk',
    title: 'Ujumbe kutoka SAJDA',
    tag: 'Series · Sheikh Bashir',
    thumb: 'assets/img/videos/ujumbe-sehemu-1.jpg',
    desc: 'Sheikh Bashir’s message in three parts: the madrasas, the classrooms and the Waqf, and the December Harambee. In Kiswahili, with English subtitles.'
  }
};

var SAJDA_CHANNEL = 'https://www.youtube.com/@SaganteJaldesaDawahGroup';

(function () {
  'use strict';

  var grids = document.querySelectorAll('[data-video-grid]');
  if (!grids.length) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function watchUrl(v) {
    if (v.list) return 'https://www.youtube.com/playlist?list=' + v.list;
    return v.vertical ? 'https://www.youtube.com/shorts/' + v.id : 'https://youtu.be/' + v.id;
  }

  /* A series as one card: plays its playlist from the first part. */
  function seriesCard(key) {
    var s = SAJDA_SERIES[key];
    var parts = SAJDA_VIDEOS.filter(function (v) { return v.series === key; });
    return {
      id: parts[0].id,                     // parts are listed 1, 2, 3, so this is part 1
      list: s.list,
      title: s.title,
      tag: s.tag,
      thumb: s.thumb,
      desc: s.desc,
      count: parts.length
    };
  }

  function card(v) {
    var thumb = v.thumb || 'https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg';
    return (
      '<a class="video-card' + (v.vertical ? ' video-card--vertical' : '') + (v.list ? ' video-card--series' : '') +
      '" href="' + watchUrl(v) + '"' +
      ' target="_blank" rel="noopener" data-video-id="' + esc(v.id) + '"' +
      (v.list ? ' data-playlist="' + esc(v.list) + '"' : '') +
      (v.vertical ? ' data-vertical' : '') + ' data-reveal>' +
        '<span class="video-card__thumb">' +
          '<img src="' + esc(thumb) + '" alt="" loading="lazy" decoding="async">' +
          '<span class="video-card__play" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
          '</span>' +
          (v.list ? '<span class="video-card__time video-card__time--series">' +
                    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5h13v2H3zm0 4h13v2H3zm0 4h9v2H3zm13 0 6 3.5-6 3.5z"/></svg>' +
                    v.count + ' videos</span>'
                  : v.duration ? '<span class="video-card__time">' + esc(v.duration) + '</span>' : '') +
        '</span>' +
        '<span class="video-card__body">' +
          (v.tag ? '<span class="video-card__tag">' + esc(v.tag) + '</span>' : '') +
          '<span class="video-card__title">' + esc(v.title) + '</span>' +
          (v.desc ? '<span class="video-card__desc">' + esc(v.desc) + '</span>' : '') +
        '</span>' +
      '</a>'
    );
  }

  grids.forEach(function (grid) {
    var items = SAJDA_VIDEOS;
    if (grid.hasAttribute('data-collapse-series')) {
      var seen = {};
      items = [];
      SAJDA_VIDEOS.forEach(function (v) {
        if (!v.series || !SAJDA_SERIES[v.series]) { items.push(v); return; }
        if (!seen[v.series]) { seen[v.series] = true; items.push(seriesCard(v.series)); }
      });
    }
    var limit = parseInt(grid.getAttribute('data-limit'), 10) || items.length;
    grid.innerHTML = items.slice(0, limit).map(card).join('');
    // cards are injected after main.js wired up scroll reveal, so show them directly
    grid.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
  });

  document.querySelectorAll('[data-series-links]').forEach(function (box) {
    box.innerHTML = Object.keys(SAJDA_SERIES).map(function (key) {
      var c = seriesCard(key);
      return '<a class="btn btn--ghost" href="' + watchUrl(c) + '" target="_blank" rel="noopener"' +
             ' data-video-id="' + esc(c.id) + '" data-playlist="' + esc(c.list) + '">' +
             'Play the full series: ' + esc(c.title) + '</a>';
    }).join('');
  });

  /* --- In-page player ---------------------------------------------------- */
  var modal = document.createElement('div');
  modal.className = 'video-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Video player');
  modal.innerHTML =
    '<button class="video-modal__close" type="button" aria-label="Close video">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '</button>' +
    '<div class="video-modal__frame"></div>';
  document.body.appendChild(modal);

  var frame = modal.querySelector('.video-modal__frame');
  var closeBtn = modal.querySelector('.video-modal__close');
  var lastFocus = null;

  function open(id, vertical, title, list) {
    lastFocus = document.activeElement;
    frame.classList.toggle('is-vertical', vertical);
    frame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0&playsinline=1' + (list ? '&list=' + encodeURIComponent(list) : '') +
      '" title="' + esc(title) + '"' +
      ' allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    frame.innerHTML = '';                    // stops playback
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-video-id]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var t = a.querySelector('.video-card__title');
    open(a.getAttribute('data-video-id'), a.hasAttribute('data-vertical'),
         t ? t.textContent : a.textContent, a.getAttribute('data-playlist'));
  });
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
