/**
 * CarrierCore.io - Main Application Controller
 * Handles Navigation, Search, Modal Rendering, Bookmarks, and Dynamic Filtering
 */

const App = {
  activeIspCoreDomain: "all",
  activeIspAdvDomain: "all",
  searchQuery: "",
  bookmarks: JSON.parse(localStorage.getItem("carrier_bookmarks") || "[]"),
  currentDailyOffset: 0,
  allTopics: [...ISP_CORE_TOPICS, ...ISP_ADVANCED_TOPICS],

  init: function() {
    this.renderDailySpotlight();
    this.renderIspCoreTopics();
    this.renderIspAdvTopics();

    // Render Simulators
    InteractiveTools.renderMplsSimulator("mpls-simulator-container");
    InteractiveTools.renderBgpSimulator("bgp-simulator-container");

    this.setupEventListeners();
    this.updateBookmarkCount();
  },

  setupEventListeners: function() {
    const searchInput = document.getElementById("global-search-input");
    const mobileSearchInput = document.getElementById("mobile-search-input");

    const handleSearch = (val) => {
      this.searchQuery = val.trim().toLowerCase();
      if (searchInput && searchInput.value !== val) searchInput.value = val;
      if (mobileSearchInput && mobileSearchInput.value !== val) mobileSearchInput.value = val;

      this.renderIspCoreTopics();
      this.renderIspAdvTopics();
    };

    searchInput?.addEventListener("input", (e) => handleSearch(e.target.value));
    mobileSearchInput?.addEventListener("input", (e) => handleSearch(e.target.value));

    // Mobile Drawer Toggle
    const mobileBtn = document.getElementById("mobile-menu-toggle-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const hamburgerIcon = document.getElementById("hamburger-icon");
    const closeIcon = document.getElementById("close-icon");

    mobileBtn?.addEventListener("click", () => {
      const isHidden = mobileDrawer.classList.contains("hidden");
      if (isHidden) {
        mobileDrawer.classList.remove("hidden");
        hamburgerIcon.classList.add("hidden");
        closeIcon.classList.remove("hidden");
        mobileSearchInput?.focus();
      } else {
        mobileDrawer.classList.add("hidden");
        hamburgerIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      }
    });

    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer?.classList.add("hidden");
        hamburgerIcon?.classList.remove("hidden");
        closeIcon?.classList.add("hidden");
      });
    });

    // Keyboard shortcut '/' or 'Ctrl+K'
    window.addEventListener("keydown", (e) => {
      if ((e.key === "/" && document.activeElement !== searchInput && document.activeElement !== mobileSearchInput) ||
          (e.ctrlKey && e.key === "k") || 
          (e.metaKey && e.key === "k")) {
        e.preventDefault();
        searchInput?.focus();
      }
      if (e.key === "Escape") {
        this.closeModal();
      }
    });

    // Modal background click
    document.getElementById("topic-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "topic-modal") {
        this.closeModal();
      }
    });
  },

  renderDailySpotlight: function() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + this.currentDailyOffset);
    const daily = DailyEngine.getTodayConcept(targetDate);

    const container = document.getElementById("daily-spotlight-card");
    if (!container) return;

    let diagramSvg = "";
    if (daily.diagramType && CarrierDiagrams[daily.diagramType]) {
      diagramSvg = CarrierDiagrams[daily.diagramType]();
    }

    const badgeClass = daily.track === "ISP Core" ? "badge-isp-core" : "badge-isp-adv";
    const ctx = daily.deepContext || {};

    container.innerHTML = `
      <div class="relative overflow-hidden rounded-2xl glass-panel-elevated p-6 lg:p-8 border border-amber-500/20 shadow-2xl space-y-6">
        <!-- Background Glow -->
        <div class="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header & Date Offset Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeClass}">
              <span class="w-2 h-2 rounded-full bg-amber-400 telecom-active"></span>
              ${daily.track} Spotlight
            </span>
            <span class="text-xs text-slate-400 font-mono">${daily.domain}</span>
            <span class="text-xs text-slate-500 font-mono hidden sm:inline">&bull; ${daily.readingTime}</span>
          </div>

          <div class="flex items-center gap-1.5 text-xs">
            <button onclick="App.changeDailyOffset(-1)" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition" title="Previous Day">
              &larr; Prev
            </button>
            <span class="px-2.5 py-1 rounded bg-slate-950 font-mono text-amber-400 border border-slate-800">
              ${this.currentDailyOffset === 0 ? "Today" : (this.currentDailyOffset > 0 ? `+${this.currentDailyOffset}d` : `${this.currentDailyOffset}d`)}
            </span>
            <button onclick="App.changeDailyOffset(1)" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition" title="Next Day">
              Next &rarr;
            </button>
          </div>
        </div>

        <!-- Title & Summary -->
        <div>
          <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            ${daily.title}
          </h3>
          <p class="text-sm text-slate-300 mt-2 leading-relaxed">
            ${daily.summary}
          </p>
        </div>

        <!-- Beginner Mental Model -->
        <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-slate-300 space-y-1">
          <span class="font-bold text-amber-300 uppercase tracking-wider block">💡 Carrier Mental Model:</span>
          <p class="leading-relaxed">${daily.beginnerNote}</p>
        </div>

        <!-- Diagram -->
        ${diagramSvg ? `
          <div class="my-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Photonic Architecture Blueprint:</span>
            ${diagramSvg}
          </div>
        ` : ""}

        <!-- Deep Context Grid: Formula + CLI Snippet -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400 block">📐 Carrier Rule &amp; Metric:</span>
            <p class="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800/80">${ctx.ruleOfThumb || "Gao-Rexford routing policy."}</p>
            ${ctx.formula ? `
              <div class="pt-2">
                <span class="text-[10px] text-slate-500 uppercase tracking-wider block">Carrier Metric Formula:</span>
                <p class="text-xs text-cyan-300 font-mono">${ctx.formula}</p>
              </div>
            ` : ""}
          </div>

          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-cyan-400">💻 ${daily.codeSnippet?.platform || "Carrier Syntax"}</span>
            </div>
            <pre class="carrier-terminal p-3 text-[11px] text-slate-200 overflow-x-auto"><code>${daily.codeSnippet?.code || "# Standard configuration"}</code></pre>
          </div>
        </div>

        <!-- Interactive Challenge / Quiz -->
        <div class="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-base">🧠</span>
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400">Daily Carrier Engineering Challenge</h4>
          </div>
          <p class="text-xs text-white font-medium">${daily.quiz.question}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            ${daily.quiz.options.map((opt, i) => `
              <button 
                onclick="DailyEngine.checkQuizAnswer(${i}, ${daily.quiz.correctIndex})" 
                class="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-left text-xs text-slate-300 border border-slate-800 hover:border-amber-500/50 transition flex items-start gap-2"
              >
                <span class="font-mono text-amber-400 font-bold">${String.fromCharCode(65 + i)}.</span>
                <span>${opt}</span>
              </button>
            `).join("")}
          </div>

          <div id="daily-quiz-feedback" class="hidden"></div>
          <div id="daily-quiz-explanation" class="hidden p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mt-2">
            <strong class="text-slate-200 block mb-1">Architectural Explanation:</strong>
            ${daily.quiz.explanation}
          </div>
        </div>
      </div>
    `;
  },

  changeDailyOffset: function(delta) {
    this.currentDailyOffset += delta;
    this.renderDailySpotlight();
  },

  filterIspCoreDomain: function(domain) {
    this.activeIspCoreDomain = domain;
    document.querySelectorAll(".isp-core-filter-btn").forEach(btn => {
      const isSelected = btn.dataset.domain === domain;
      btn.className = `isp-core-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition ${
        isSelected
          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
          : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
      }`;
    });
    this.renderIspCoreTopics();
  },

  filterIspAdvDomain: function(domain) {
    this.activeIspAdvDomain = domain;
    document.querySelectorAll(".isp-adv-filter-btn").forEach(btn => {
      const isSelected = btn.dataset.domain === domain;
      btn.className = `isp-adv-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition ${
        isSelected
          ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
          : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
      }`;
    });
    this.renderIspAdvTopics();
  },

  renderIspCoreTopics: function() {
    const container = document.getElementById("isp-core-cards-grid");
    if (!container) return;

    const filtered = ISP_CORE_TOPICS.filter(t => {
      const matchDomain = this.activeIspCoreDomain === "all" || t.domain === this.activeIspCoreDomain;
      const q = this.searchQuery;
      const matchSearch = !q ||
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q));

      return matchDomain && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-8 text-center text-slate-400 text-xs">
          No core ISP topics match your filter or search query.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(topic => this.createTopicCard(topic, "core")).join("");
  },

  renderIspAdvTopics: function() {
    const container = document.getElementById("isp-adv-cards-grid");
    if (!container) return;

    const filtered = ISP_ADVANCED_TOPICS.filter(t => {
      const matchDomain = this.activeIspAdvDomain === "all" || t.domain === this.activeIspAdvDomain;
      const q = this.searchQuery;
      const matchSearch = !q ||
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q));

      return matchDomain && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-8 text-center text-slate-400 text-xs">
          No advanced carrier topics match your filter or search query.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(topic => this.createTopicCard(topic, "adv")).join("");
  },

  createTopicCard: function(topic, category) {
    const isBookmarked = this.bookmarks.includes(topic.id);
    const badgeColor = category === "core" ? "badge-isp-core" : "badge-isp-edge";

    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition group">
        <div>
          <!-- Category & Bookmark -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeColor}">
              ${topic.domain}
            </span>
            <button 
              onclick="App.toggleBookmark('${topic.id}')"
              class="text-sm p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
              title="${isBookmarked ? "Remove Bookmark" : "Save Topic"}"
            >
              ${isBookmarked ? "⭐" : "☆"}
            </button>
          </div>

          <!-- Title -->
          <h3 
            class="text-base font-bold text-white group-hover:text-amber-400 transition cursor-pointer leading-snug"
            onclick="App.openTopicModal('${topic.id}')"
          >
            ${topic.title}
          </h3>
          <p class="text-xs text-slate-400 mt-1 line-clamp-1 font-mono">${topic.subtitle}</p>

          <!-- Summary -->
          <p class="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
            ${topic.summary}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1 mt-4">
            ${topic.tags.slice(0, 3).map(tag => `
              <span class="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                #${tag}
              </span>
            `).join("")}
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span class="text-slate-500 text-[11px] font-mono">🕒 ${topic.readingTime}</span>
          <button 
            onclick="App.openTopicModal('${topic.id}')"
            class="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800/60 font-semibold transition flex items-center gap-1 text-xs"
          >
            <span>Deep Dive</span> &rarr;
          </button>
        </div>
      </div>
    `;
  },

  openTopicModal: function(topicId) {
    const topic = this.allTopics.find(t => t.id === topicId);
    if (!topic) return;

    const modal = document.getElementById("topic-modal");
    const content = document.getElementById("topic-modal-content");
    if (!modal || !content) return;

    let diagramHtml = "";
    if (topic.diagramType && CarrierDiagrams[topic.diagramType]) {
      diagramHtml = `
        <div class="my-6">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Carrier Photonic Blueprint:</span>
          ${CarrierDiagrams[topic.diagramType]()}
        </div>
      `;
    }

    content.innerHTML = `
      <div class="p-6 sm:p-8 space-y-6 text-slate-200">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${topic.track === "ISP Core" ? "badge-isp-core" : "badge-isp-edge"}">
                ${topic.domain}
              </span>
              <span class="text-xs text-slate-400 font-mono">🕒 ${topic.readingTime}</span>
            </div>
            <h2 class="text-2xl font-extrabold text-white">${topic.title}</h2>
            <p class="text-xs text-amber-400 font-mono mt-1">${topic.subtitle}</p>
          </div>
          <button onclick="App.closeModal()" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition" aria-label="Close modal">
            ✕
          </button>
        </div>

        <!-- Embedded Diagram -->
        ${diagramHtml}

        <!-- Topic Body Content -->
        <div class="space-y-4 text-sm leading-relaxed text-slate-300">
          ${topic.content}
        </div>

        <!-- Tags & Actions -->
        <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5">
            ${topic.tags.map(t => `<span class="text-xs px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">#${t}</span>`).join("")}
          </div>
          <button 
            onclick="App.toggleBookmark('${topic.id}'); App.openTopicModal('${topic.id}');"
            class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-amber-300 transition flex items-center gap-1.5"
          >
            <span>${this.bookmarks.includes(topic.id) ? "⭐ Bookmarked" : "☆ Save Topic"}</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  },

  closeModal: function() {
    const modal = document.getElementById("topic-modal");
    if (modal) modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  },

  toggleBookmark: function(id) {
    if (this.bookmarks.includes(id)) {
      this.bookmarks = this.bookmarks.filter(b => b !== id);
    } else {
      this.bookmarks.push(id);
    }
    localStorage.setItem("carrier_bookmarks", JSON.stringify(this.bookmarks));
    this.updateBookmarkCount();
    this.renderIspCoreTopics();
    this.renderIspAdvTopics();
  },

  updateBookmarkCount: function() {
    const count = this.bookmarks.length;
    const badge = document.getElementById("bookmark-count-badge");
    const mobileBadge = document.getElementById("mobile-bookmark-count-badge");
    if (badge) badge.textContent = count;
    if (mobileBadge) mobileBadge.textContent = count;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
