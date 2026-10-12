/**
 * CarrierCore.io - ISP Core & Backbone Technologies Curriculum
 * Tier 1-3 Hierarchy, IS-IS, MPLS Architecture, Segment Routing, BNG, and FTTH/PON
 */

const ISP_CORE_TOPICS = [
  {
    id: "isp-tier-hierarchy",
    track: "ISP Core",
    domain: "Backbone Architecture",
    title: "Global Internet Hierarchy: Tier 1, Tier 2 & Tier 3 ISPs",
    subtitle: "Settlement-Free Peering, Paid IP Transit, and Autonomous System (ASN) Topology",
    summary: "How the global Internet interconnects: why only ~16 transit-free Tier 1 backbones form the core of worldwide connectivity without paying a cent for transit.",
    diagramType: "ispTierEcosystem",
    readingTime: "9 min read",
    tags: ["Tier 1", "IP Transit", "Peering", "BGP", "ASN", "Looking Glass"],
    content: `
      <h3>1. The Three Tiers of the Internet Ecosystem</h3>
      <p>The global Internet is a decentralized network of over 75,000 Autonomous Systems (ASNs). ISPs are grouped into three distinct commercial tiers based on their relationship to transit:</p>

      <div class="space-y-3 my-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900 border border-amber-500/30">
          <div class="flex items-center justify-between">
            <h4 class="text-amber-400 font-bold text-sm">Tier 1: Transit-Free Global Backbones</h4>
            <span class="text-[11px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">~16 Worldwide</span>
          </div>
          <p class="text-slate-300 mt-2 leading-relaxed">
            Tier 1 carriers own international subsea fiber cables, transcontinental fiber routes, and massive terabit routing hubs. <strong>They do not purchase IP transit from anyone.</strong> Instead, every Tier 1 ISP interconnects with every other Tier 1 ISP through <em>Settlement-Free Peering</em> (exchanging traffic at net-zero cost).
          </p>
          <p class="mt-1.5 font-mono text-slate-400">Key Tier 1s: Lumen (AS3356), NTT (AS2914), Arelion/Telia (AS1299), AT&amp;T (AS7018), Tata (AS6453), Cogent (AS174), GTT (AS3257).</p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-cyan-400 font-bold text-sm">Tier 2: Regional & National Service Providers</h4>
          <p class="text-slate-300 mt-2 leading-relaxed">
            Large national ISPs and telcos (e.g., Vodafone, Comcast, British Telecom) that own extensive domestic infrastructure. They peer settlement-free with regional equals at Internet Exchange Points (IXPs), but <strong>must purchase paid IP transit from Tier 1 carriers</strong> to reach destination IPs across the rest of the planet.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-emerald-400 font-bold text-sm">Tier 3: Eyeball & Local Access Providers</h4>
          <p class="text-slate-300 mt-2 leading-relaxed">
            The last-mile providers that sell home broadband (FTTH, cable, 5G) and enterprise DIA (Dedicated Internet Access). Tier 3 networks only deliver consumer traffic and strictly purchase upstream IP transit from Tier 2 or Tier 1 providers.
          </p>
        </div>
      </div>

      <h3>2. Autonomous System Numbers (ASN): 2-Byte vs. 4-Byte</h3>
      <p>Every ISP running BGP requires an Autonomous System Number allocated by their Regional Internet Registry (RIR like ARIN, RIPE NCC, AFRINIC, APNIC, LACNIC):</p>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li><strong>2-Byte ASNs (1 to 65535):</strong> Depleted globally by 2007. Reserved private ASNs: 64512 to 65534.</li>
        <li><strong>4-Byte ASNs (65536 to 4294967295):</strong> Standardized by RFC 6793 (32-bit). Represented either as "asplain" (e.g., <code>AS400123</code>) or "asdot" (e.g., <code>AS6.6543</code>).</li>
      </ul>

      <h3 class="mt-6">3. Cisco IOS-XR BGP Transit Peering Snippet</h3>
      <div class="carrier-terminal p-4 my-3 text-xs overflow-x-auto">
        <p class="cli-comment">! Cisco IOS-XR 8000 Series: Upstream Tier-1 Transit Peering</p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config)#</span> <span class="cli-command">router bgp 65000</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config-bgp)#</span> <span class="cli-command">neighbor 198.51.100.1</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config-bgp-nbr)#</span> <span class="cli-command">remote-as 3356</span> <span class="cli-highlight">! Lumen Tier-1 Transit</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config-bgp-nbr)#</span> <span class="cli-command">description UPSTREAM_TRANSIT_LUMEN</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config-bgp-nbr)#</span> <span class="cli-command">address-family ipv4 unicast</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config-bgp-nbr-af)#</span> <span class="cli-command">route-policy TIER1_TRANSIT_IN in</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:Core-Edge1(config-bgp-nbr-af)#</span> <span class="cli-command">route-policy CUSTOMER_PREFIXES_OUT out</span></p>
      </div>
    `
  },
  {
    id: "isp-isis-backbone",
    track: "ISP Core",
    domain: "Backbone Architecture",
    title: "IS-IS Routing in Service Provider Cores",
    subtitle: "Why Telco Backbones Prefer IS-IS over OSPF: TLV Extensibility & CLNS Independence",
    summary: "The definitive analysis of why carrier backbones run Intermediate System to Intermediate System (IS-IS) as their foundational Interior Gateway Protocol (IGP).",
    diagramType: "ispTierEcosystem",
    readingTime: "10 min read",
    tags: ["IS-IS", "OSPF", "IGP", "CLNS", "TLV", "Segment Routing", "IOS-XR", "Junos"],
    content: `
      <h3>1. Why Service Providers Choose IS-IS over OSPF</h3>
      <p>While enterprise networks default to OSPF, over 80% of major telecommunication carriers and hyperscalers run <strong>IS-IS (ISO/IEC 10589)</strong> inside their core backbone networks:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-amber-400 font-bold mb-2">1. Operating Directly on Layer 2 (No IP Dependency)</h4>
          <p class="text-slate-300 leading-relaxed">
            OSPF packets encapsulate inside IP (Protocol 89). If an IP stack faults or interface IP addressing misconfigures, OSPF collapses. IS-IS operates directly atop the <strong>Data Link Layer (Layer 2)</strong> using CLNS encapsulation. A router can route IPv4 and IPv6 without having an IP address configured on the transit interface.
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-cyan-400 font-bold mb-2">2. Modular TLV (Type-Length-Value) Architecture</h4>
          <p class="text-slate-300 leading-relaxed">
            To support IPv6, OSPF required an entire rewrite (OSPFv2 &rarr; OSPFv3). IS-IS simply added two new TLVs (TLV 236 for IPv6 reachability). Segment Routing, Traffic Engineering (TE), and Prefix-SIDs were seamlessly introduced into IS-IS via minor TLVs without touching core protocol state machines.
          </p>
        </div>
      </div>

      <h3>2. Level 1 vs. Level 2 Hierarchical Architecture</h3>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li><strong>Level 1 (Intra-area):</strong> Routes within an access station or metro domain. Corresponds conceptually to an OSPF totally stubby non-backbone area.</li>
        <li><strong>Level 2 (Inter-area & Backbone):</strong> Carries core transit between metro rings and international points of presence (PoPs). Most carrier backbones are designed as a pure single <strong>Level 2-only backbone</strong> for ultra-fast convergence without area boundary route leaks.</li>
      </ul>

      <h3 class="mt-6">3. Juniper Junos OS IS-IS Configuration Snippet</h3>
      <div class="carrier-terminal p-4 my-3 text-xs overflow-x-auto">
        <p class="cli-comment"># Juniper MX960 Core Backbone IS-IS Setup</p>
        <p><span class="cli-prompt">user@Core-P1#</span> <span class="cli-command">set protocols isis interface et-0/0/0.0 level 1 disable</span></p>
        <p><span class="cli-prompt">user@Core-P1#</span> <span class="cli-command">set protocols isis interface et-0/0/0.0 level 2 metric 10</span></p>
        <p><span class="cli-prompt">user@Core-P1#</span> <span class="cli-command">set protocols isis interface et-0/0/0.0 point-to-point</span> <span class="cli-highlight"># Fast hello convergence</span></p>
        <p><span class="cli-prompt">user@Core-P1#</span> <span class="cli-command">set protocols isis source-packet-routing</span> <span class="cli-keyword"># Enable Segment Routing</span></p>
      </div>
    `
  },
  {
    id: "isp-mpls-architecture",
    track: "ISP Core",
    domain: "MPLS & Segment Routing",
    title: "MPLS Label Swapping & Forwarding Architecture (RFC 3031)",
    subtitle: "Label Push, Swap, Pop, Penultimate Hop Popping (PHP), and the 32-bit Shim Header",
    summary: "The heart of service provider transport: how 32-bit labels allow multi-terabit core routers to forward packets without reading bulky IP destination addresses.",
    diagramType: "mplsLabelPath",
    readingTime: "11 min read",
    tags: ["MPLS", "RFC 3031", "LER", "LSR", "PHP", "LDP", "LFIB"],
    content: `
      <h3>1. The Purpose of Multi-Protocol Label Switching (MPLS)</h3>
      <p>In standard IP routing, every router across an international transit path must inspect the 32-bit IPv4 or 128-bit IPv6 destination header, perform a longest-prefix match (LPM) in a million-route BGP routing table, and decrement TTL. MPLS replaces recursive routing with fixed-length <strong>Label Swapping</strong>:</p>

      <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 my-4 space-y-2">
        <p class="text-amber-400 font-bold">The 32-Bit (4-Byte) MPLS Shim Header Format:</p>
        <div class="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1">
          <p><span class="text-amber-400">[20 Bits: Label Value]</span> &bull; Valid ranges: 0 to 1,048,575 (Values 0-15 are reserved by IETF)</p>
          <p><span class="text-cyan-400">[3 Bits: Traffic Class / EXP]</span> &bull; Quality of Service (QoS) &amp; ECN marking</p>
          <p><span class="text-purple-400">[1 Bit: Bottom of Stack (S)]</span> &bull; 1 if this is the deepest label in the stack; 0 if more labels follow</p>
          <p><span class="text-emerald-400">[8 Bits: Time to Live (TTL)]</span> &bull; Decremented hop-by-hop to prevent forwarding loops</p>
        </div>
      </div>

      <h3>2. Router Roles in an MPLS Domain</h3>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li><strong>Ingress LER (Label Edge Router / PE):</strong> Receives native IP packet from customer, performs FIB lookup, assigns Forwarding Equivalence Class (FEC), and <strong>PUSHES</strong> an MPLS label onto the packet.</li>
        <li><strong>Core LSR (Label Switch Router / P Router):</strong> Does NOT look at the customer IP address. Inspects only the top label, indexes the <strong>LFIB (Label Forwarding Information Base)</strong>, <strong>SWAPS</strong> incoming label for outgoing label, and transmits.</li>
        <li><strong>Penultimate LSR (PHP):</strong> Pops the transport label before handing packet to the egress PE (Implicit Null Label 3).</li>
        <li><strong>Egress LER (PE):</strong> Removes final label (<strong>POP</strong>) and delivers native IP packet to customer.</li>
      </ul>

      <h3 class="mt-6">3. Why Penultimate Hop Popping (PHP) is Critical</h3>
      <p>Without PHP, the Egress PE router would have to perform two consecutive lookups for every arriving packet: first lookup the MPLS LFIB to pop the label, then lookup the IP FIB / VRF to route the native packet (double-lookup penalty). <strong>PHP</strong> commands the second-to-last router to strip the outer transport label so the egress PE performs only a single IP lookup.</p>
    `
  },
  {
    id: "isp-segment-routing",
    track: "ISP Core",
    domain: "MPLS & Segment Routing",
    title: "Segment Routing Architecture: SR-MPLS & SRv6",
    subtitle: "Source-Routing Revolution: Eliminating LDP & RSVP-TE with Node-SIDs and SRv6 Headers",
    summary: "How modern carriers eliminated brittle stateful signaling protocols (LDP/RSVP) in favor of stateless source routing encoded directly in the IGP.",
    diagramType: "segmentRoutingSrv6",
    readingTime: "12 min read",
    tags: ["Segment Routing", "SR-MPLS", "SRv6", "Node-SID", "Prefix-SID", "TI-LFA", "Traffic Engineering"],
    content: `
      <h3>1. The Problem with Legacy MPLS (LDP & RSVP-TE)</h3>
      <p>For twenty years, MPLS networks required three overlapping protocols to function: an IGP (IS-IS or OSPF) to compute topology, LDP to exchange labels, and RSVP-TE to build traffic-engineered tunnels. RSVP-TE maintained millions of soft-state reservation messages across core routers, causing scalability crises and slow convergence during link failures.</p>

      <h3 class="mt-6">2. The Segment Routing (SR) Paradigm</h3>
      <p>Segment Routing moves all state from the transit core routers directly to the packet header (<strong>Source Routing</strong>):</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-amber-400 font-bold block mb-1">Prefix-SID / Node-SID</span>
          <p class="text-slate-300">Global identifier representing a specific router loopback across the entire autonomous system (e.g., Node-SID 16001 = Core-P1, 16002 = Core-P2).</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-cyan-400 font-bold block mb-1">Adjacency-SID</span>
          <p class="text-slate-300">Local identifier representing a specific directional fiber link between two directly connected routers. Enables explicit traffic steering.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-purple-400 font-bold block mb-1">Binding-SID</span>
          <p class="text-slate-300">Represents an entire multi-hop Traffic Engineering (SR-TE) policy path encapsulated under a single trigger label.</p>
        </div>
      </div>

      <h3 class="mt-6">3. SR-MPLS vs. SRv6 (IPv6 Segment Routing)</h3>
      <ul class="list-disc pl-6 space-y-2 text-slate-300 text-xs">
        <li><strong>SR-MPLS:</strong> Segments are encoded as standard 20-bit MPLS labels (SRGB - Segment Routing Global Block, typically 16000-23999). Runs over existing MPLS ASICs with zero hardware replacement.</li>
        <li><strong>SRv6 (RFC 8200 / RFC 8754):</strong> Segments are encoded as 128-bit IPv6 addresses within a new <strong>Segment Routing Header (SRH)</strong>. Eliminates MPLS completely—pure native IPv6 data plane. Segments follow the <code>LOCATOR:FUNCTION:ARGUMENTS</code> programming format.</li>
      </ul>
    `
  },
  {
    id: "isp-bng-subscriber-access",
    track: "ISP Core",
    domain: "Broadband & Subscriber Access",
    title: "Broadband Network Gateway (BNG / BRAS) & Subscriber Access",
    subtitle: "PPPoE, IPoE (DHCP Option 82), RADIUS Authentication, and Carrier-Grade NAT (CGNAT)",
    summary: "The aggregation barrier where millions of residential fiber customers authenticate, receive IP addresses, and undergo lawful interception and bandwidth policing.",
    diagramType: "ispTierEcosystem",
    readingTime: "10 min read",
    tags: ["BNG", "BRAS", "PPPoE", "IPoE", "RADIUS", "CGNAT", "DHCP Option 82"],
    content: `
      <h3>1. The Role of the BNG (Broadband Network Gateway)</h3>
      <p>The BNG (historically termed BRAS - Broadband Remote Access Server) is the critical subscriber edge router sitting between the access optical network (OLTs) and the core carrier IP backbone. It terminates hundreds of thousands of customer sessions simultaneously.</p>

      <h3 class="mt-6">2. PPPoE vs. IPoE Access Models</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-amber-400 font-bold mb-1">PPPoE (PPP over Ethernet - RFC 2516)</h4>
          <p class="text-slate-300 mb-2 leading-relaxed">Legacy standard that encapsulates PPP frames inside Ethernet. Requires user credentials (username/password) authenticated against central RADIUS/Diameter servers.</p>
          <span class="text-[11px] text-red-400 font-mono">Disadvantage: 8-byte overhead drops MTU to 1492!</span>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-emerald-400 font-bold mb-1">IPoE (IP over Ethernet) - Modern FTTH Standard</h4>
          <p class="text-slate-300 mb-2 leading-relaxed">Direct Ethernet subscriber sessions using standard DHCP/DHCPv6. The access OLT injects <strong>DHCP Option 82 (Circuit-ID and Remote-ID)</strong> identifying the customer's exact physical fiber port. Zero credentials needed on user router.</p>
          <span class="text-[11px] text-emerald-400 font-mono">Advantage: Full standard 1500 MTU, wire-speed performance.</span>
        </div>
      </div>

      <h3 class="mt-6">3. Carrier-Grade NAT (CGNAT / NAT444)</h3>
      <p>Because IPv4 addresses are exhausted, ISPs assign subscribers private addresses from the dedicated <strong>RFC 6598 carrier shared block: <code>100.64.0.0/10</code></strong>. Large hardware CGNAT blades map up to 64 residential subscribers to a single public IPv4 address using Port Control Protocol (PCP) or deterministic port allocation (e.g., 1000 TCP ports per subscriber).</p>
    `
  },
  {
    id: "isp-ftth-pon-access",
    track: "ISP Core",
    domain: "Broadband & Subscriber Access",
    title: "FTTH Optical Access: GPON, XGS-PON & WDM-PON",
    subtitle: "Passive Optical Networks, Splitter Loss Budgets, and 10G Symmetrical Fiber Delivery",
    summary: "From Central Office OLTs to subscriber ONTs: how passive splitters and time-division multiplexing deliver gigabit broadband without active electronics in the field.",
    diagramType: "dwdmOpticalGrid",
    readingTime: "9 min read",
    tags: ["FTTH", "PON", "GPON", "XGS-PON", "OLT", "ONT", "Splitter", "Optical Loss Budget"],
    content: `
      <h3>1. Passive Optical Network (PON) Architecture</h3>
      <p>A PON delivers fiber broadband using unpowered optical splitters between the Central Office (CO) and subscriber homes:</p>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li><strong>OLT (Optical Line Terminal):</strong> High-density chassis in the carrier central office holding SFP+ PON optical transceivers.</li>
        <li><strong>Optical Distribution Network (ODN):</strong> Passive single-mode fiber cables and 1:32 or 1:64 prism splitters installed in street cabinets. No electricity required along the route.</li>
        <li><strong>ONT / ONU (Optical Network Terminal):</strong> Customer-premises termination box converting fiber light into standard RJ45 Gigabit Ethernet.</li>
      </ul>

      <h3 class="mt-6">2. GPON vs. XGS-PON Wavelength Standards</h3>
      <div class="overflow-x-auto my-3 text-xs">
        <table class="w-full text-left text-slate-300 border border-slate-800">
          <thead class="bg-slate-900 text-amber-400 font-mono">
            <tr>
              <th class="p-2.5 border-b border-slate-800">Technology</th>
              <th class="p-2.5 border-b border-slate-800">Downstream Speed</th>
              <th class="p-2.5 border-b border-slate-800">Upstream Speed</th>
              <th class="p-2.5 border-b border-slate-800">Downstream λ</th>
              <th class="p-2.5 border-b border-slate-800">Upstream λ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr>
              <td class="p-2.5 font-bold text-white">GPON (ITU-T G.984)</td>
              <td class="p-2.5 font-mono">2.488 Gbps</td>
              <td class="p-2.5 font-mono">1.244 Gbps</td>
              <td class="p-2.5">1490 nm</td>
              <td class="p-2.5">1310 nm</td>
            </tr>
            <tr>
              <td class="p-2.5 font-bold text-amber-300">XGS-PON (ITU-T G.9807.1)</td>
              <td class="p-2.5 font-mono font-bold text-emerald-400">9.953 Gbps</td>
              <td class="p-2.5 font-mono font-bold text-emerald-400">9.953 Gbps (Symmetric)</td>
              <td class="p-2.5">1577 nm</td>
              <td class="p-2.5">1270 nm</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-400 mt-2">Because GPON and XGS-PON use distinct optical wavelengths, carriers can overlay both services onto the exact same physical fiber strand simultaneously using WDM coexistence elements (CEx).</p>
    `
  }
];
