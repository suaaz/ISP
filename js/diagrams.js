/**
 * CarrierCore.io - Architectural SVG Visualizations
 * Dynamic vector diagrams for MPLS Label Paths, Tier-1 ISP Ecosystem, DWDM Optical Grids, and SRv6
 */

const CarrierDiagrams = {
  /**
   * 1. End-to-End MPLS Label Switched Path (LSP) & PHP Diagram
   */
  mplsLabelPath: function() {
    return `
      <div class="w-full overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800">
        <svg viewBox="0 0 820 340" class="w-full max-w-3xl mx-auto h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="carrierPeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#0369a1" />
            </linearGradient>
            <linearGradient id="carrierPGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d97706" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
          </defs>

          <!-- Title Bar -->
          <text x="410" y="24" fill="#fbbf24" font-family="Inter, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
            MPLS Label Swapping: Ingress PUSH, Core SWAP &amp; Penultimate Hop Popping (PHP)
          </text>
          <text x="410" y="42" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">
            RFC 3031 Transport Label Operations Across Service Provider Core
          </text>

          <!-- Inter-router link lines -->
          <line x1="85" y1="170" x2="175" y2="170" stroke="#64748b" stroke-width="2" />
          <line x1="265" y1="170" x2="355" y2="170" stroke="#f59e0b" stroke-width="2.5" class="optical-flow" />
          <line x1="445" y1="170" x2="535" y2="170" stroke="#f59e0b" stroke-width="2.5" class="optical-flow" />
          <line x1="625" y1="170" x2="715" y2="170" stroke="#64748b" stroke-width="2" />

          <!-- ================= ROUTERS ================= -->
          <!-- Customer CE-1 -->
          <g transform="translate(15, 140)">
            <rect width="70" height="60" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
            <text x="35" y="28" fill="#f8fafc" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">CE-1</text>
            <text x="35" y="44" fill="#94a3b8" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Native IP</text>
          </g>

          <!-- Ingress PE-1 (LER) -->
          <g transform="translate(175, 135)">
            <rect width="90" height="70" rx="10" fill="url(#carrierPeGrad)" stroke="#38bdf8" stroke-width="2" />
            <text x="45" y="28" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Ingress PE-1</text>
            <text x="45" y="44" fill="#bae6fd" font-size="9" font-family="JetBrains Mono" text-anchor="middle">PUSH Label</text>
            <text x="45" y="58" fill="#e0f2fe" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Label: 10024</text>
          </g>

          <!-- Core P-1 (LSR) -->
          <g transform="translate(355, 135)">
            <rect width="90" height="70" rx="10" fill="url(#carrierPGrad)" stroke="#fbbf24" stroke-width="2" />
            <text x="45" y="28" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Core P-1</text>
            <text x="45" y="44" fill="#fef3c7" font-size="9" font-family="JetBrains Mono" text-anchor="middle">SWAP Label</text>
            <text x="45" y="58" fill="#fde68a" font-size="8" font-family="JetBrains Mono" text-anchor="middle">10024 &rarr; 30045</text>
          </g>

          <!-- Core P-2 (Penultimate LSR) -->
          <g transform="translate(535, 135)">
            <rect width="90" height="70" rx="10" fill="url(#carrierPGrad)" stroke="#fbbf24" stroke-width="2" />
            <text x="45" y="28" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Core P-2 (PHP)</text>
            <text x="45" y="44" fill="#fef3c7" font-size="9" font-family="JetBrains Mono" text-anchor="middle">POP (PHP)</text>
            <text x="45" y="58" fill="#fde68a" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Implicit Null (3)</text>
          </g>

          <!-- Egress PE-2 (LER) -->
          <g transform="translate(715, 135)">
            <rect width="90" height="70" rx="10" fill="url(#carrierPeGrad)" stroke="#38bdf8" stroke-width="2" />
            <text x="45" y="28" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Egress PE-2</text>
            <text x="45" y="44" fill="#bae6fd" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Single Lookup</text>
            <text x="45" y="58" fill="#e0f2fe" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Deliver IP</text>
          </g>

          <!-- ================= PACKET SHIM VISUALIZERS ================= -->
          <!-- IP at Ingress -->
          <g transform="translate(95, 80)">
            <rect width="65" height="26" rx="4" fill="#1e293b" stroke="#64748b" />
            <text x="32" y="17" fill="#f8fafc" font-size="9" font-family="JetBrains Mono" text-anchor="middle">[IP Packet]</text>
          </g>

          <!-- Labeled Packet in Core (PE-1 to P-1) -->
          <g transform="translate(275, 75)">
            <rect width="70" height="34" rx="4" fill="#78350f" stroke="#f59e0b" />
            <text x="35" y="16" fill="#fde68a" font-size="8" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">LBL: 10024</text>
            <text x="35" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono" text-anchor="middle">[IP Payload]</text>
          </g>

          <!-- Labeled Packet in Core (P-1 to P-2) -->
          <g transform="translate(455, 75)">
            <rect width="70" height="34" rx="4" fill="#78350f" stroke="#f59e0b" />
            <text x="35" y="16" fill="#fde68a" font-size="8" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">LBL: 30045</text>
            <text x="35" y="28" fill="#cbd5e1" font-size="8" font-family="JetBrains Mono" text-anchor="middle">[IP Payload]</text>
          </g>

          <!-- After PHP (P-2 to PE-2) -->
          <g transform="translate(635, 80)">
            <rect width="70" height="26" rx="4" fill="#1e293b" stroke="#10b981" />
            <text x="35" y="17" fill="#34d399" font-size="8" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">[IP Packet] (PHP)</text>
          </g>

          <!-- Explanatory Bottom Legend -->
          <g transform="translate(180, 260)">
            <rect width="460" height="48" rx="8" fill="#080f20" stroke="#152238" />
            <text x="230" y="20" fill="#38bdf8" font-size="10" font-family="Inter" font-weight="bold" text-anchor="middle">
              LFIB Label Swapping Operation
            </text>
            <text x="230" y="36" fill="#94a3b8" font-size="9" font-family="JetBrains Mono" text-anchor="middle">
              Core routers read only 32-bit labels &bull; Zero BGP route lookup in P routers
            </text>
          </g>
        </svg>
      </div>
    `;
  },

  /**
   * 2. Tier-1 Global Peering & IXP Ecosystem Diagram
   */
  ispTierEcosystem: function() {
    return `
      <div class="w-full overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800">
        <svg viewBox="0 0 800 360" class="w-full max-w-3xl mx-auto h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <text x="400" y="24" fill="#f59e0b" font-family="Inter, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
            Global Internet Routing Architecture: Tiers, Transit &amp; IXP Peering
          </text>
          <text x="400" y="42" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">
            Settlement-Free Peering at Top &bull; Paid IP Transit Downward
          </text>

          <!-- ================= TIER 1 CLOUD / BACKBONE (TOP) ================= -->
          <g transform="translate(120, 70)">
            <rect width="160" height="60" rx="8" fill="#78350f" stroke="#f59e0b" stroke-width="1.5" />
            <text x="80" y="26" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Tier 1: Lumen</text>
            <text x="80" y="44" fill="#fde68a" font-size="9" font-family="JetBrains Mono" text-anchor="middle">AS3356 (Transit-Free)</text>
          </g>

          <g transform="translate(520, 70)">
            <rect width="160" height="60" rx="8" fill="#78350f" stroke="#f59e0b" stroke-width="1.5" />
            <text x="80" y="26" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Tier 1: Arelion</text>
            <text x="80" y="44" fill="#fde68a" font-size="9" font-family="JetBrains Mono" text-anchor="middle">AS1299 (Transit-Free)</text>
          </g>

          <!-- Settlement-Free Peering Line Between Tier 1s -->
          <line x1="280" y1="100" x2="520" y2="100" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6 4" />
          <text x="400" y="92" fill="#34d399" font-size="9" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">Settlement-Free Peering (Net $0)</text>

          <!-- ================= INTERNET EXCHANGE POINT (IXP) IN CENTER ================= -->
          <g transform="translate(300, 160)">
            <rect width="200" height="70" rx="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="2" />
            <text x="100" y="28" fill="#c084fc" font-size="12" font-weight="bold" font-family="Inter" text-anchor="middle">Public IXP Fabric</text>
            <text x="100" y="44" fill="#94a3b8" font-size="9" font-family="JetBrains Mono" text-anchor="middle">e.g. DE-CIX / AMS-IX / LINX</text>
            <text x="100" y="58" fill="#e2e8f0" font-size="8" font-family="JetBrains Mono" text-anchor="middle">BGP Route Servers (RS1/RS2)</text>
          </g>

          <!-- Paid Transit Lines from Tier 1 to Tier 2 -->
          <line x1="200" y1="130" x2="200" y2="250" stroke="#ef4444" stroke-width="2" />
          <text x="145" y="195" fill="#f87171" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Paid Transit ($)</text>

          <line x1="600" y1="130" x2="600" y2="250" stroke="#ef4444" stroke-width="2" />
          <text x="655" y="195" fill="#f87171" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Paid Transit ($)</text>

          <!-- IXP Peering Links from Tier 2 -->
          <line x1="260" y1="265" x2="330" y2="230" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="4 4" />
          <line x1="540" y1="265" x2="470" y2="230" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="4 4" />

          <!-- ================= TIER 2 REGIONAL ISPS ================= -->
          <g transform="translate(100, 250)">
            <rect width="180" height="60" rx="8" fill="#0c1a30" stroke="#38bdf8" stroke-width="1.5" />
            <text x="90" y="24" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Tier 2: Regional ISP A</text>
            <text x="90" y="40" fill="#7dd3fc" font-size="9" font-family="JetBrains Mono" text-anchor="middle">National Telco Backbone</text>
            <text x="90" y="52" fill="#94a3b8" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Owns BNG &amp; Metro Rings</text>
          </g>

          <g transform="translate(520, 250)">
            <rect width="180" height="60" rx="8" fill="#0c1a30" stroke="#38bdf8" stroke-width="1.5" />
            <text x="90" y="24" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Tier 2: Content CDN (Netflix)</text>
            <text x="90" y="40" fill="#7dd3fc" font-size="9" font-family="JetBrains Mono" text-anchor="middle">AS2906 (Edge Caches)</text>
            <text x="90" y="52" fill="#94a3b8" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Open Peering Policy</text>
          </g>
        </svg>
      </div>
    `;
  },

  /**
   * 3. Photonic DWDM C-Band Wavelength Transmission Grid
   */
  dwdmOpticalGrid: function() {
    return `
      <div class="w-full overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800">
        <svg viewBox="0 0 800 320" class="w-full max-w-3xl mx-auto h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <text x="400" y="24" fill="#06b6d4" font-family="Inter, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
            Dense Wavelength Division Multiplexing (DWDM) &amp; Optical Transport
          </text>
          <text x="400" y="42" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">
            80/96 Optical Channels (C-Band 1550nm) Multiplexed Across a Single Glass Strand
          </text>

          <!-- Router Line Card (400G ZR+) on Left -->
          <g transform="translate(50, 90)">
            <rect width="120" height="150" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
            <text x="60" y="30" fill="#22d3ee" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Core Router</text>
            <text x="60" y="48" fill="#94a3b8" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Cisco 8800 / MX</text>
            
            <rect x="20" y="65" width="80" height="24" rx="4" fill="#1e293b" stroke="#06b6d4" />
            <text x="60" y="80" fill="#67e8f9" font-size="8" font-family="JetBrains Mono" text-anchor="middle">400G ZR+ λ1</text>

            <rect x="20" y="98" width="80" height="24" rx="4" fill="#1e293b" stroke="#06b6d4" />
            <text x="60" y="113" fill="#67e8f9" font-size="8" font-family="JetBrains Mono" text-anchor="middle">400G ZR+ λ2</text>
          </g>

          <!-- Optical Mux (Multiplexer) -->
          <g transform="translate(220, 105)">
            <path d="M 0 10 L 60 40 L 60 80 L 0 110 Z" fill="#164e63" stroke="#06b6d4" stroke-width="1.5" />
            <text x="30" y="65" fill="#cffafe" font-size="9" font-family="Inter" font-weight="bold" text-anchor="middle">MUX</text>
          </g>

          <line x1="170" y1="125" x2="220" y2="140" stroke="#f43f5e" stroke-width="2" />
          <line x1="170" y1="170" x2="220" y2="170" stroke="#3b82f6" stroke-width="2" />

          <!-- EDFA Booster Amplifier -->
          <g transform="translate(320, 130)">
            <polygon points="0,0 40,25 0,50" fill="#78350f" stroke="#f59e0b" stroke-width="1.5" />
            <text x="15" y="30" fill="#ffffff" font-size="8" font-family="JetBrains Mono" font-weight="bold">EDFA</text>
          </g>

          <line x1="280" y1="155" x2="320" y2="155" stroke="#f59e0b" stroke-width="3" />

          <!-- Single Subsea Fiber Span -->
          <line x1="360" y1="155" x2="480" y2="155" stroke="#fbbf24" stroke-width="3.5" class="optical-flow" />
          <text x="420" y="145" fill="#fef08a" font-size="9" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
            Single Fiber (32 Tbps!)
          </text>
          <text x="420" y="175" fill="#64748b" font-size="8" font-family="JetBrains Mono" text-anchor="middle">
            0.2 dB/km Attenuation
          </text>

          <!-- ROADM / Optical Pre-Amp -->
          <g transform="translate(480, 130)">
            <polygon points="0,0 40,25 0,50" fill="#78350f" stroke="#f59e0b" stroke-width="1.5" />
            <text x="12" y="30" fill="#ffffff" font-size="8" font-family="JetBrains Mono" font-weight="bold">PRE</text>
          </g>

          <!-- Optical Demux (Demultiplexer) -->
          <g transform="translate(560, 105)">
            <path d="M 60 10 L 0 40 L 0 80 L 60 110 Z" fill="#164e63" stroke="#06b6d4" stroke-width="1.5" />
            <text x="30" y="65" fill="#cffafe" font-size="9" font-family="Inter" font-weight="bold" text-anchor="middle">DEMUX</text>
          </g>

          <line x1="520" y1="155" x2="560" y2="155" stroke="#f59e0b" stroke-width="3" />

          <!-- Receiving Core Router on Right -->
          <g transform="translate(650, 90)">
            <rect width="120" height="150" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
            <text x="60" y="30" fill="#22d3ee" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">Remote PoP</text>
            <text x="60" y="48" fill="#94a3b8" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Coherent RX</text>

            <rect x="20" y="65" width="80" height="24" rx="4" fill="#1e293b" stroke="#06b6d4" />
            <text x="60" y="80" fill="#67e8f9" font-size="8" font-family="JetBrains Mono" text-anchor="middle">400G Port λ1</text>

            <rect x="20" y="98" width="80" height="24" rx="4" fill="#1e293b" stroke="#06b6d4" />
            <text x="60" y="113" fill="#67e8f9" font-size="8" font-family="JetBrains Mono" text-anchor="middle">400G Port λ2</text>
          </g>

          <line x1="620" y1="140" x2="650" y2="125" stroke="#f43f5e" stroke-width="2" />
          <line x1="620" y1="170" x2="650" y2="170" stroke="#3b82f6" stroke-width="2" />

          <!-- Bottom Banner -->
          <g transform="translate(200, 265)">
            <rect width="400" height="28" rx="14" fill="#080f20" stroke="#152238" />
            <text x="200" y="18" fill="#38bdf8" font-size="10" font-family="Inter" font-weight="bold" text-anchor="middle">
              C-Band Grid: 191.3 THz to 196.1 THz &bull; 96 Wavelengths @ 400G = 38.4 Tbps
            </text>
          </g>
        </svg>
      </div>
    `;
  },

  /**
   * 4. SRv6 Packet Header & Segment Routing Header (SRH)
   */
  segmentRoutingSrv6: function() {
    return `
      <div class="w-full overflow-x-auto p-4 bg-slate-950/90 rounded-xl border border-slate-800">
        <svg viewBox="0 0 800 240" class="w-full max-w-3xl mx-auto h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <text x="400" y="24" fill="#f59e0b" font-family="Inter, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">
            SRv6 Segment Routing Header Format (RFC 8754)
          </text>
          <text x="400" y="42" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">
            Stateless Network Programming: IPv6 Routing Extension Header (Type 4)
          </text>

          <g transform="translate(40, 75)">
            <!-- IPv6 Base Header -->
            <rect x="0" y="0" width="160" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" />
            <text x="80" y="26" fill="#f8fafc" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">IPv6 Base Header</text>
            <text x="80" y="44" fill="#7dd3fc" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Next Header: 43 (Routing)</text>

            <!-- SRH Extension Header -->
            <rect x="170" y="0" width="190" height="60" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="2" />
            <text x="265" y="24" fill="#ffffff" font-size="11" font-weight="bold" font-family="Inter" text-anchor="middle">SRH Header (Type 4)</text>
            <text x="265" y="40" fill="#fde68a" font-size="9" font-family="JetBrains Mono" text-anchor="middle">Routing Type: 4</text>
            <text x="265" y="52" fill="#fef08a" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Segments Left: 2</text>

            <!-- Segment List [2] -->
            <rect x="370" y="0" width="115" height="60" rx="6" fill="#164e63" stroke="#06b6d4" />
            <text x="427" y="24" fill="#ffffff" font-size="10" font-weight="bold" font-family="Inter" text-anchor="middle">Segment List [2]</text>
            <text x="427" y="44" fill="#cffafe" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Hop 1: 2001:db8:1::</text>

            <!-- Segment List [1] -->
            <rect x="495" y="0" width="115" height="60" rx="6" fill="#164e63" stroke="#06b6d4" />
            <text x="552" y="24" fill="#ffffff" font-size="10" font-weight="bold" font-family="Inter" text-anchor="middle">Segment List [1]</text>
            <text x="552" y="44" fill="#cffafe" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Hop 2: 2001:db8:2::</text>

            <!-- Segment List [0] (Final) -->
            <rect x="620" y="0" width="115" height="60" rx="6" fill="#064e3b" stroke="#10b981" />
            <text x="677" y="24" fill="#ffffff" font-size="10" font-weight="bold" font-family="Inter" text-anchor="middle">Segment List [0]</text>
            <text x="677" y="44" fill="#a7f3d0" font-size="8" font-family="JetBrains Mono" text-anchor="middle">Egress: 2001:db8:3::</text>
          </g>

          <g transform="translate(180, 165)">
            <rect width="440" height="40" rx="6" fill="#080f20" stroke="#152238" />
            <text x="220" y="24" fill="#38bdf8" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">
              SRv6 SID: [Locator: 64b] : [Function: 32b] : [Args: 32b]
            </text>
          </g>
        </svg>
      </div>
    `;
  }
};
