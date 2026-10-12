/**
 * CarrierCore.io - Daily Concept Spotlight Engine
 * Rotates daily through service provider engineering, carrier CLI snippets, and interactive quizzes
 */

const DAILY_CONCEPTS = [
  {
    id: "daily-penultimate-hop-popping",
    track: "ISP Core",
    domain: "MPLS & Segment Routing",
    title: "Why Penultimate Hop Popping (PHP) Saves Egress PE CPU Cycles",
    summary: "Without PHP, the egress PE router is forced to perform a painful double-lookup on every arriving packet: first in the MPLS LFIB, then in the IP FIB.",
    readingTime: "6 min read",
    diagramType: "mplsLabelPath",
    beginnerNote: "Think of PHP like an airport baggage handler removing the luggage transit tag right before placing the suitcase on the customer carousel, so the owner doesn't have to fiddle with tags.",
    deepContext: {
      ruleOfThumb: "Implicit Null (Label 3) commands the upstream neighbor to strip the top label. Explicit Null (Label 0 for IPv4, Label 2 for IPv6) preserves the top label to retain EXP QoS bits across the final link.",
      formula: "Lookups Saved on Egress PE = N × (LFIB Lookup + FIB Lookup) reduced to N × (Single FIB Lookup)"
    },
    codeSnippet: {
      platform: "Cisco IOS-XR 8000",
      code: `RP/0/RP0/CPU0:PE-2# show mpls lfib 10.0.0.4/32
Local  Outgoing    Prefix or ID   Outgoing     Next Hop
Label  Label       or Tunnel Id   Interface
-------------------------------------------------------
3      Pop Label   10.0.0.4/32    BE10         192.168.1.1`
    },
    quiz: {
      question: "What reserved MPLS label value is advertised by an Egress PE router to request Penultimate Hop Popping (PHP) from its upstream neighbor?",
      options: [
        "Label 0 (IPv4 Explicit Null)",
        "Label 1 (Router Alert)",
        "Label 3 (Implicit Null)",
        "Label 16 (Segment Routing Base)"
      ],
      correctIndex: 2,
      explanation: "MPLS Label 3 is standardized as the Implicit Null label. When a router receives an advertisement with outgoing label 3 for a prefix, it strips (pops) the label prior to transmitting the packet across the link."
    }
  },
  {
    id: "daily-settlement-free-peering",
    track: "Carrier Services",
    domain: "BGP Peering & IXPs",
    title: "The Economics of Settlement-Free Peering vs. Paid IP Transit",
    summary: "Why global Tier 1 backbones exchange terabits of transit traffic for $0 at Internet Exchange Points using the Gao-Rexford model.",
    readingTime: "7 min read",
    diagramType: "ispTierEcosystem",
    beginnerNote: "If ISP A sends 10 Terabits to ISP B and ISP B sends 10 Terabits back to ISP A, charging each other makes zero economic sense. They agree to exchange traffic for free (Settlement-Free).",
    deepContext: {
      ruleOfThumb: "Under the Gao-Rexford commercial model: Routes learned from Customers are advertised to everyone. Routes learned from Peers or Transits are ONLY advertised to Customers.",
      formula: "Commercial Peering Ratio = Max(Inbound Mbps, Outbound Mbps) / Min(Inbound Mbps, Outbound Mbps) <= 1.5:1 typically required"
    },
    codeSnippet: {
      platform: "Juniper Junos OS",
      code: `user@MX960# set policy-options policy-statement PEERING-EXPORT
term EXPORT-CUSTOMERS {
    from protocol bgp;
    from community CUSTOMER-ROUTES;
    then accept;
}
term REJECT-TRANSIT {
    then reject;  # Never leak transit prefixes to peers!`
    },
    quiz: {
      question: "Under the Gao-Rexford BGP routing model, what catastrophic routing failure occurs if an ISP exports routes learned from Upstream Transit Provider A to Peer Provider B?",
      options: [
        "A Spanning Tree root bridge election storm",
        "A BGP Route Leak / Transitive Hijack (ISP becomes an unpaid transit pipe between competitors)",
        "A subsea fiber dispersion penalty exceeding 100 dB",
        "An instantaneous OSPF Dijkstra SPF recalculation loop"
      ],
      correctIndex: 1,
      explanation: "If you advertise Transit A's routes to Peer B, Peer B will send global traffic destined for Transit A directly through your network, converting you into an unpaid transit pipe and congesting your backbone."
    }
  },
  {
    id: "daily-coherent-400g-zr",
    track: "Carrier Services",
    domain: "Optical & DWDM",
    title: "How Coherent 400G ZR+ Optics Eliminate Bulky Transponder Shelves",
    subtitle: "IPoDWDM (IP-over-DWDM) with Digital Signal Processors directly in Router Ports",
    summary: "Traditional optical networks required separate optical transponder chassis. Pluggable 400G ZR+ transceivers plug straight into router line cards to traverse 1,000+ km.",
    readingTime: "6 min read",
    diagramType: "dwdmOpticalGrid",
    beginnerNote: "Instead of having a bulky 7-foot optical cabinet next to your router to convert electrical signals into laser light, the miniature laser and microchip are shrunk into a pluggable transceiver the size of a thumb drive.",
    deepContext: {
      ruleOfThumb: "Standard 400G ZR reaches up to 120 km (metro DCI). 400G ZR+ (OpenZR+) features higher launch power and oFEC to reach 800 to 1,200 km across regional ROADM lines.",
      formula: "Spectral Efficiency = Bit Rate / Channel Spacing = 400 Gbps / 75 GHz = ~5.33 bits/s/Hz"
    },
    codeSnippet: {
      platform: "Cisco IOS-XR 8000",
      code: `RP/0/RP0/CPU0:Core-1# show optics 0/0/0/0
Optics Type: QSFP-DD 400G-ZR-PLUS
Laser Frequency: 193.100 THz (Wavelength: 1552.524 nm)
Tx Power: -10.0 dBm | Rx Power: -12.4 dBm
Chromatic Dispersion Compensation: -12,000 to +12,000 ps/nm`
    },
    quiz: {
      question: "What physical optical component allows carriers to remotely add, drop, and redirect individual wavelength channels in intermediate PoPs without converting light to electricity?",
      options: [
        "A BNG Subscriber Gateway",
        "A ROADM (Reconfigurable Optical Add-Drop Multiplexer)",
        "An Ethernet Switch CAM Table",
        "A Penultimate Hop Popping (PHP) Buffer"
      ],
      correctIndex: 1,
      explanation: "A ROADM utilizes Wavelength Selective Switches (WSS) to optically switch individual colored light wavelengths between fiber rings entirely in the optical photonic domain without electronic conversion."
    }
  }
];

const DailyEngine = {
  getTodayConcept: function(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = Math.abs(dayOfYear) % DAILY_CONCEPTS.length;
    return DAILY_CONCEPTS[index];
  },

  checkQuizAnswer: function(selectedIndex, correctIndex) {
    const feedbackEl = document.getElementById("daily-quiz-feedback");
    if (!feedbackEl) return;

    if (selectedIndex === correctIndex) {
      feedbackEl.className = "p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs mt-3 block animate-fadeIn";
      feedbackEl.innerHTML = `<strong>✅ Spot on! Outstanding carrier engineering intuition!</strong>`;
    } else {
      feedbackEl.className = "p-3 rounded-xl bg-amber-950/80 border border-amber-700/80 text-amber-300 text-xs mt-3 block animate-fadeIn";
      feedbackEl.innerHTML = `<strong>Not quite. Review the RFC standard and carrier operational rules above!</strong>`;
    }

    const explanationEl = document.getElementById("daily-quiz-explanation");
    if (explanationEl) explanationEl.classList.remove("hidden");
  }
};
