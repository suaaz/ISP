/**
 * CarrierCore.io - Interactive Service Provider Simulators
 * 1. MPLS Label Switched Path (LSP) Trace Simulator
 * 2. Carrier BGP Best Path Selection & Policy Engine
 */

const InteractiveTools = {
  /**
   * Tool 1: MPLS Label Swapping & LSP Simulator
   */
  currentMplsStep: 0,
  mplsSteps: [
    {
      hop: "Customer CE-1 (Origin)",
      device: "CE-1 Router",
      role: "Customer Edge",
      action: "Generate Native IP Packet",
      details: "Customer application sends payload from 192.168.10.5 toward 10.200.1.50 across WAN.",
      packetHeader: `[Outer Ethernet: MAC-CE1 -> MAC-PE1]
[IPv4 Header: Src: 192.168.10.5 | Dst: 10.200.1.50 | Protocol: 6 (TCP)]
[TCP Payload: Port 443 HTTPS Data]`,
      lfibTable: `Native IP Packet arriving on Ingress Interface GigabitEthernet0/0/1. No MPLS labels applied yet.`
    },
    {
      hop: "Ingress PE-1 (LER)",
      device: "Edge PE-1 (Cisco ASR 9000)",
      role: "Label Edge Router (LER)",
      action: "FIB Lookup & PUSH 2-Label Stack",
      details: "PE-1 receives IP packet inside VRF 'CUSTOMER_CORP'. Discovers BGP next-hop PE-2 (10.0.0.4). Pushes Transport Label 10024 and VPN Label 2005.",
      packetHeader: `[MPLS Transport Label: 10024 | EXP: 0 | S: 0 | TTL: 64]   <-- Pushed for BGP Next-Hop
[MPLS VPN Label: 2005       | EXP: 0 | S: 1 | TTL: 64]   <-- Pushed for VRF Demux
[IPv4 Payload: Src: 192.168.10.5 | Dst: 10.200.1.50]`,
      lfibTable: `VRF Table Lookup:
- Prefix: 10.200.1.0/24 -> BGP Next-Hop: 10.0.0.4
- VPN Label allocated by PE-2: 2005
- Transport Label to reach 10.0.0.4 via P-1: 10024 (PUSH)`
    },
    {
      hop: "Core Transit P-1 (LSR)",
      device: "Core P-1 (Juniper PTX10008)",
      role: "Label Switch Router (LSR)",
      action: "LFIB Lookup & SWAP Transport Label",
      details: "Core P-1 does NOT inspect customer IP. Reads top label 10024, checks LFIB, and swaps it for label 30045 destined for downstream P-2.",
      packetHeader: `[MPLS Transport Label: 30045 | EXP: 0 | S: 0 | TTL: 63]   <-- SWAPPED in Hardware!
[MPLS VPN Label: 2005       | EXP: 0 | S: 1 | TTL: 64]   <-- Untouched
[IPv4 Payload: Src: 192.168.10.5 | Dst: 10.200.1.50]`,
      lfibTable: `Core LFIB Table:
- In-Label: 10024
- Out-Label: 30045 (SWAP)
- Out-Interface: HundredGigE 0/0/0/2 -> Next-Hop P-2`
    },
    {
      hop: "Core Transit P-2 (Penultimate LSR)",
      device: "Core P-2 (Nokia 7750 SR)",
      role: "Penultimate Hop Router (PHP)",
      action: "Detect Implicit Null (3) & POP Transport Label",
      details: "Downstream router is the destination PE-2, which advertised Implicit Null (Label 3). Core P-2 pops the outer transport label so PE-2 only performs a single lookup.",
      packetHeader: `[MPLS VPN Label: 2005 | EXP: 0 | S: 1 | TTL: 63]   <-- Outer transport label stripped by PHP!
[IPv4 Payload: Src: 192.168.10.5 | Dst: 10.200.1.50]`,
      lfibTable: `Core LFIB Table (PHP Triggered):
- In-Label: 30045
- Out-Label: POP (Implicit Null 3)
- Out-Interface: HundredGigE 0/0/0/1 -> Egress PE-2`
    },
    {
      hop: "Egress PE-2 (LER)",
      device: "Edge PE-2 (Cisco ASR 9000)",
      role: "Label Edge Router (LER)",
      action: "POP VPN Label & Deliver Clean Native IP to CE-2",
      details: "PE-2 receives packet with sole VPN Label 2005. Decodes label 2005 to VRF 'CUSTOMER_CORP', strips label, and routes native IP packet to CE-2.",
      packetHeader: `[Outer Ethernet: MAC-PE2 -> MAC-CE2]
[IPv4 Header: Src: 192.168.10.5 | Dst: 10.200.1.50 | TTL: 62]
[TCP Payload: Port 443 HTTPS Data]`,
      lfibTable: `VRF 'CUSTOMER_CORP' LFIB Table:
- In-Label: 2005 -> Action: POP & Route in VRF
- Egress Interface: GigabitEthernet0/0/2 -> Customer CE-2`
    }
  ],

  renderMplsSimulator: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const step = this.mplsSteps[this.currentMplsStep];

    container.innerHTML = `
      <div class="glass-panel-elevated rounded-2xl p-6 border border-amber-500/20 shadow-xl space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">⚡</span>
            <div>
              <h3 class="text-base font-bold text-white">MPLS Label Swapping &amp; LSP Packet Trace Simulator</h3>
              <p class="text-xs text-slate-400">Step-by-step trace of Ingress PUSH, Core SWAP, Penultimate PHP, and Egress POP</p>
            </div>
          </div>
          <span class="text-xs px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
            Hop ${this.currentMplsStep + 1} of ${this.mplsSteps.length}
          </span>
        </div>

        <!-- Step Indicator Bar -->
        <div class="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
          ${this.mplsSteps.map((s, idx) => `
            <button 
              onclick="InteractiveTools.setMplsStep(${idx})"
              class="p-2 rounded-lg transition truncate ${
                idx === this.currentMplsStep 
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20" 
                  : (idx < this.currentMplsStep ? "bg-slate-800 text-emerald-400" : "bg-slate-900 text-slate-500 border border-slate-800")
              }"
            >
              ${idx + 1}. ${s.hop.split(" ")[0]}
            </button>
          `).join("")}
        </div>

        <!-- Active Hop Details Card -->
        <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400 telecom-active"></span>
              <h4 class="text-sm font-bold text-white">${step.hop} &bull; <span class="text-amber-400 font-mono">${step.device}</span></h4>
            </div>
            <span class="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">${step.action}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">${step.details}</p>
        </div>

        <!-- Two Columns: Packet Header Inspection & Router LFIB Table -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <!-- Packet Wire Format -->
          <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Packet on the Fiber Wire:</span>
            <pre class="carrier-terminal p-3 text-[11px] text-slate-200 overflow-x-auto leading-relaxed"><code>${step.packetHeader}</code></pre>
          </div>

          <!-- Router LFIB Table -->
          <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span class="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Router Forwarding Engine (LFIB/FIB):</span>
            <pre class="carrier-terminal p-3 text-[11px] text-slate-300 overflow-x-auto leading-relaxed"><code>${step.lfibTable}</code></pre>
          </div>
        </div>

        <!-- Step Navigation Controls -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-800">
          <button 
            onclick="InteractiveTools.prevMplsStep()"
            class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition ${this.currentMplsStep === 0 ? 'opacity-40 cursor-not-allowed' : ''}"
            ${this.currentMplsStep === 0 ? 'disabled' : ''}
          >
            &larr; Previous Hop
          </button>

          <button 
            onclick="InteractiveTools.resetMplsStep()"
            class="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 text-xs transition"
          >
            Reset Trace
          </button>

          <button 
            onclick="InteractiveTools.nextMplsStep()"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition ${this.currentMplsStep === this.mplsSteps.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}"
            ${this.currentMplsStep === this.mplsSteps.length - 1 ? 'disabled' : ''}
          >
            Next Hop &rarr;
          </button>
        </div>
      </div>
    `;
  },

  setMplsStep: function(idx) {
    this.currentMplsStep = idx;
    this.renderMplsSimulator("mpls-simulator-container");
  },
  nextMplsStep: function() {
    if (this.currentMplsStep < this.mplsSteps.length - 1) {
      this.currentMplsStep++;
      this.renderMplsSimulator("mpls-simulator-container");
    }
  },
  prevMplsStep: function() {
    if (this.currentMplsStep > 0) {
      this.currentMplsStep--;
      this.renderMplsSimulator("mpls-simulator-container");
    }
  },
  resetMplsStep: function() {
    this.currentMplsStep = 0;
    this.renderMplsSimulator("mpls-simulator-container");
  },

  /**
   * Tool 2: Carrier BGP Best Path Selection Engine
   */
  bgpConfig: {
    weightA: 0,
    weightB: 0,
    localPrefA: 100,
    localPrefB: 100,
    asPathLengthA: 2,
    asPathLengthB: 2,
    originA: "IGP",
    originB: "IGP",
    medA: 0,
    medB: 0,
    peerTypeA: "eBGP",
    peerTypeB: "eBGP"
  },

  renderBgpSimulator: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Evaluate BGP Path Selection
    const cfg = this.bgpConfig;
    let winner = "Tie";
    let decisiveRule = "Equal attributes - tie broken by lowest router ID / IP";

    if (cfg.weightA !== cfg.weightB) {
      winner = cfg.weightA > cfg.weightB ? "Path A" : "Path B";
      decisiveRule = "Rule 1: Highest Weight (Cisco-specific, local to router)";
    } else if (cfg.localPrefA !== cfg.localPrefB) {
      winner = cfg.localPrefA > cfg.localPrefB ? "Path A" : "Path B";
      decisiveRule = "Rule 2: Highest Local Preference (Default 100, advertised within AS)";
    } else if (cfg.asPathLengthA !== cfg.asPathLengthB) {
      winner = cfg.asPathLengthA < cfg.asPathLengthB ? "Path A" : "Path B";
      decisiveRule = "Rule 4: Shortest AS-Path length (AS-Path prepending influences inbound traffic)";
    } else if (cfg.originA !== cfg.originB) {
      // IGP (i) < EGP (e) < Incomplete (?)
      const originScore = { "IGP": 3, "EGP": 2, "Incomplete": 1 };
      winner = originScore[cfg.originA] > originScore[cfg.originB] ? "Path A" : "Path B";
      decisiveRule = "Rule 5: Lowest Origin Type (IGP is preferred over Incomplete)";
    } else if (cfg.medA !== cfg.medB) {
      winner = cfg.medA < cfg.medB ? "Path A" : "Path B";
      decisiveRule = "Rule 6: Lowest Multi-Exit Discriminator (MED / Metric)";
    } else if (cfg.peerTypeA !== cfg.peerTypeB) {
      winner = cfg.peerTypeA === "eBGP" ? "Path A" : "Path B";
      decisiveRule = "Rule 7: eBGP paths strictly preferred over iBGP paths";
    }

    container.innerHTML = `
      <div class="glass-panel-elevated rounded-2xl p-6 border border-cyan-500/20 shadow-xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🌐</span>
            <div>
              <h3 class="text-base font-bold text-white">Carrier BGP Best Path Selection &amp; Policy Engine</h3>
              <p class="text-xs text-slate-400">Manipulate BGP attributes in real time to verify deterministic route decisions</p>
            </div>
          </div>
          <span class="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">BGP Engine</span>
        </div>

        <!-- Live Decision Banner -->
        <div class="p-4 rounded-xl border ${winner === "Path A" ? "bg-amber-950/60 border-amber-600 text-amber-200" : (winner === "Path B" ? "bg-cyan-950/60 border-cyan-600 text-cyan-200" : "bg-slate-900 border-slate-800 text-slate-300")}">
          <div class="flex items-center justify-between">
            <span class="font-bold text-sm uppercase tracking-wider">
              🏆 Winning Best Path: <strong class="underline">${winner === "Tie" ? "Tie (Next-Hop IP)" : `${winner} (Installed in FIB)`}</strong>
            </span>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Prefix: 8.8.8.0/24</span>
          </div>
          <p class="text-xs mt-1.5 font-medium opacity-90">${decisiveRule}</p>
        </div>

        <!-- Comparative Columns: Path A vs Path B -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- Path A: Lumen AS3356 -->
          <div class="p-4 rounded-xl bg-slate-950/80 border ${winner === "Path A" ? "border-amber-500 shadow-lg shadow-amber-500/10" : "border-slate-800"} space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="font-bold text-amber-400">Path A: Upstream Transit (Lumen AS3356)</span>
              ${winner === "Path A" ? '<span class="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">BEST PATH &gt;</span>' : ''}
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="bgp-weight-a" class="text-slate-400">1. Weight:</label>
                <input type="number" id="bgp-weight-a" value="${cfg.weightA}" step="100" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-lp-a" class="text-slate-400">2. Local Preference:</label>
                <input type="number" id="bgp-lp-a" value="${cfg.localPrefA}" step="10" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-aspath-a" class="text-slate-400">4. AS-Path Hops:</label>
                <select id="bgp-aspath-a" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
                  <option value="1" ${cfg.asPathLengthA === 1 ? 'selected' : ''}>1 Hop (3356)</option>
                  <option value="2" ${cfg.asPathLengthA === 2 ? 'selected' : ''}>2 Hops</option>
                  <option value="4" ${cfg.asPathLengthA === 4 ? 'selected' : ''}>4 Hops (Prepended)</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-origin-a" class="text-slate-400">5. Origin:</label>
                <select id="bgp-origin-a" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white">
                  <option value="IGP" ${cfg.originA === "IGP" ? 'selected' : ''}>IGP (i)</option>
                  <option value="Incomplete" ${cfg.originA === "Incomplete" ? 'selected' : ''}>Incomplete (?)</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-med-a" class="text-slate-400">6. MED (Metric):</label>
                <input type="number" id="bgp-med-a" value="${cfg.medA}" step="10" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-peer-a" class="text-slate-400">7. Peering Type:</label>
                <select id="bgp-peer-a" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white">
                  <option value="eBGP" ${cfg.peerTypeA === "eBGP" ? 'selected' : ''}>eBGP</option>
                  <option value="iBGP" ${cfg.peerTypeA === "iBGP" ? 'selected' : ''}>iBGP</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Path B: Arelion AS1299 -->
          <div class="p-4 rounded-xl bg-slate-950/80 border ${winner === "Path B" ? "border-cyan-500 shadow-lg shadow-cyan-500/10" : "border-slate-800"} space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
              <span class="font-bold text-cyan-400">Path B: Upstream Transit (Arelion AS1299)</span>
              ${winner === "Path B" ? '<span class="text-[10px] px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold">BEST PATH &gt;</span>' : ''}
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="bgp-weight-b" class="text-slate-400">1. Weight:</label>
                <input type="number" id="bgp-weight-b" value="${cfg.weightB}" step="100" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-lp-b" class="text-slate-400">2. Local Preference:</label>
                <input type="number" id="bgp-lp-b" value="${cfg.localPrefB}" step="10" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-aspath-b" class="text-slate-400">4. AS-Path Hops:</label>
                <select id="bgp-aspath-b" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
                  <option value="1" ${cfg.asPathLengthB === 1 ? 'selected' : ''}>1 Hop (1299)</option>
                  <option value="2" ${cfg.asPathLengthB === 2 ? 'selected' : ''}>2 Hops</option>
                  <option value="4" ${cfg.asPathLengthB === 4 ? 'selected' : ''}>4 Hops (Prepended)</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-origin-b" class="text-slate-400">5. Origin:</label>
                <select id="bgp-origin-b" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white">
                  <option value="IGP" ${cfg.originB === "IGP" ? 'selected' : ''}>IGP (i)</option>
                  <option value="Incomplete" ${cfg.originB === "Incomplete" ? 'selected' : ''}>Incomplete (?)</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-med-b" class="text-slate-400">6. MED (Metric):</label>
                <input type="number" id="bgp-med-b" value="${cfg.medB}" step="10" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-white">
              </div>

              <div class="flex items-center justify-between">
                <label for="bgp-peer-b" class="text-slate-400">7. Peering Type:</label>
                <select id="bgp-peer-b" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white">
                  <option value="eBGP" ${cfg.peerTypeB === "eBGP" ? 'selected' : ''}>eBGP</option>
                  <option value="iBGP" ${cfg.peerTypeB === "iBGP" ? 'selected' : ''}>iBGP</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    const bindInput = (id, prop, isNum = true) => {
      document.getElementById(id)?.addEventListener("change", (e) => {
        this.bgpConfig[prop] = isNum ? parseInt(e.target.value) : e.target.value;
        this.renderBgpSimulator(containerId);
      });
    };

    bindInput("bgp-weight-a", "weightA");
    bindInput("bgp-weight-b", "weightB");
    bindInput("bgp-lp-a", "localPrefA");
    bindInput("bgp-lp-b", "localPrefB");
    bindInput("bgp-aspath-a", "asPathLengthA");
    bindInput("bgp-aspath-b", "asPathLengthB");
    bindInput("bgp-origin-a", "originA", false);
    bindInput("bgp-origin-b", "originB", false);
    bindInput("bgp-med-a", "medA");
    bindInput("bgp-med-b", "medB");
    bindInput("bgp-peer-a", "peerTypeA", false);
    bindInput("bgp-peer-b", "peerTypeB", false);
  }
};
