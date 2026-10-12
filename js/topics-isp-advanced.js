/**
 * CarrierCore.io - Advanced Peering & Carrier Services Curriculum
 * IXPs, RPKI Routing Security, MPLS L3VPN (RFC 4364), EVPN-MPLS, DWDM/ROADM, and Carrier TE
 */

const ISP_ADVANCED_TOPICS = [
  {
    id: "isp-ixp-peering",
    track: "Carrier Services",
    domain: "BGP Peering & IXPs",
    title: "Internet Exchange Points (IXPs) & Peering Architecture",
    subtitle: "Public Peering vs. Private Network Interconnects (PNIs) and BGP Route Servers",
    summary: "How networks keep local traffic local: connecting hundreds of ISPs across shared multi-terabit Ethernet switching fabrics to cut transit transit costs to zero.",
    diagramType: "ispTierEcosystem",
    readingTime: "11 min read",
    tags: ["IXP", "PeeringDB", "Route Server", "BGP", "PNI", "Looking Glass"],
    content: `
      <h3>1. What is an Internet Exchange Point (IXP)?</h3>
      <p>An Internet Exchange Point (IXP) is a physical data center facility featuring redundant, resilient high-capacity Ethernet switches (such as DE-CIX Frankfurt, AMS-IX Amsterdam, LINX London, or Equinix Ashburn). ISPs, content delivery networks (Netflix, Google, Cloudflare), and CDNs meet to peer directly with each other.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-amber-400 font-bold mb-1">Public Peering (IXP Shared Fabric)</h4>
          <p class="text-slate-300 leading-relaxed">
            A member connects a single 100G or 400G port into the IXP switch fabric. Through this single physical port, they can peer with hundreds of other networks simultaneously, dramatically reducing port costs.
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-cyan-400 font-bold mb-1">Private Network Interconnect (PNI)</h4>
          <p class="text-slate-300 leading-relaxed">
            When traffic between two specific networks (e.g., Netflix and Comcast) exceeds 400 Gbps, peering across a shared switch becomes cost-inefficient. They run dedicated direct dark-fiber cross-connects between their router cages.
          </p>
        </div>
      </div>

      <h3 class="mt-6">2. BGP Route Servers (Multilateral Peering)</h3>
      <p>Without route servers, an ISP connecting to an IXP with 500 members would need to configure and maintain 500 individual bilateral BGP peering sessions. An <strong>IXP Route Server (RS)</strong> acts as a central broker: members establish a single BGP session to RS1 and RS2. The Route Server redistributes BGP prefixes to all participants without inserting its own ASN into the <code>AS-PATH</code> attribute.</p>

      <h3 class="mt-6">3. PeeringDB & Peering Policies</h3>
      <p>Network engineers use <strong>PeeringDB (peeringdb.com)</strong> as the global registry to discover an ISP's peering policy (<em>Open</em>, <em>Selective</em>, or <em>Restrictive</em>), geographic PoP locations, maximum prefix limits, and peering NOC contact information.</p>
    `
  },
  {
    id: "isp-rpki-routing-security",
    track: "Carrier Services",
    domain: "BGP Peering & IXPs",
    title: "Routing Security: RPKI & MANRS Deployment",
    subtitle: "Eliminating Global BGP Route Hijacks with Cryptographic Route Origin Authorizations (ROA)",
    summary: "How the telecommunications industry secures the global BGP routing table: cryptographically verifying who has the legal right to originate IP prefixes.",
    diagramType: "ispTierEcosystem",
    readingTime: "10 min read",
    tags: ["RPKI", "ROA", "Route Hijack", "MANRS", "BGP", "RFC 6811", "Routinator"],
    content: `
      <h3>1. The Inherent Vulnerability of Border Gateway Protocol (BGP)</h3>
      <p>BGP was designed in 1989 on implicit trust. By default, if a rogue or misconfigured router advertises <code>1.1.1.0/24</code> with a shorter AS-Path, neighboring routers accept and forward traffic into the black hole (BGP Hijack or Route Leak). Notable incidents have knocked YouTube, Amazon DNS, and major banking networks offline for millions.</p>

      <h3 class="mt-6">2. Resource Public Key Infrastructure (RPKI)</h3>
      <p>RPKI binds IP address blocks to an authorized Autonomous System Number using asymmetric cryptography (X.509 PKI certificates anchored by the 5 Regional Internet Registries):</p>

      <div class="space-y-3 my-4 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-amber-400 font-bold block mb-1">Route Origin Authorization (ROA)</span>
          <p class="text-slate-300">A cryptographically signed statement published by the IP prefix owner declaring: <em>"Prefix 203.0.113.0/24 is authorized to be originated strictly by AS65000 with a maximum prefix length of /24."</em></p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-cyan-400 font-bold block mb-1">RPKI Validator (e.g., NLnet Labs Routinator)</span>
          <p class="text-slate-300">Software running in the ISP NOC downloads all global ROAs from RIR repositories, validates cryptographic signatures, and streams the verified table to edge routers using RTR (RPKI-to-Router protocol, RFC 6810).</p>
        </div>
      </div>

      <h3 class="mt-6">3. Route Origin Validation (ROV) States on Edge Routers</h3>
      <p>When an ISP edge router receives a BGP update from an external peer, it checks the prefix against its local RPKI cache:</p>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li><strong class="text-emerald-400">Valid:</strong> A matching ROA exists and both the Origin ASN and prefix length match. Route accepted with standard or elevated Local Preference.</li>
        <li><strong class="text-red-400">Invalid:</strong> An ROA exists for this prefix, but either originated from an unauthorized ASN or exceeds the <code>maxLength</code>. <strong>Industry best practice is to drop Invalid routes immediately!</strong></li>
        <li><strong class="text-slate-400">NotFound (Unknown):</strong> No ROA has been signed for this prefix yet. Route is accepted normally.</li>
      </ul>
    `
  },
  {
    id: "isp-mpls-l3vpn",
    track: "Carrier Services",
    domain: "L3VPN & EVPN",
    title: "BGP/MPLS IP Virtual Private Networks (RFC 4364)",
    subtitle: "VRFs, Route Distinguishers (RD), Route Targets (RT), and the 2-Label Stack",
    summary: "The definitive enterprise WAN service: carrying overlapping private IP spaces across a unified carrier backbone with absolute tenant isolation.",
    diagramType: "mplsLabelPath",
    readingTime: "12 min read",
    tags: ["L3VPN", "RFC 4364", "VRF", "Route Distinguisher", "Route Target", "MP-BGP", "vpnv4"],
    content: `
      <h3>1. The Challenge of Overlapping Customer IP Addressing</h3>
      <p>Enterprise Customer A and Customer B both use <code>10.0.0.0/8</code> internally. If an ISP injected these prefixes into their core routing table, the backbone would collide. <strong>RFC 4364 (formerly RFC 2547bis)</strong> solves this via three key building blocks:</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-amber-400 font-bold block mb-1">1. VRF (Virtual Routing &amp; Forwarding)</span>
          <p class="text-slate-300">Creates completely isolated, independent routing and forwarding tables per customer on the PE router. Interfaces belong strictly to one VRF.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-cyan-400 font-bold block mb-1">2. Route Distinguisher (RD)</span>
          <p class="text-slate-300">An 8-byte prefix prepended to customer IPv4 addresses to create a globally unique <strong>96-bit VPN-IPv4 prefix</strong> (e.g., <code>65000:100:10.1.1.0/24</code>). Eliminates route collisions in MP-BGP.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-purple-400 font-bold block mb-1">3. Route Target (RT)</span>
          <p class="text-slate-300">A BGP Extended Community (e.g., <code>target:65000:100</code>) attached to VPNv4 routes acting as an import/export filter to control which VRFs receive the route.</p>
        </div>
      </div>

      <h3 class="mt-6">2. The 2-Label MPLS Forwarding Stack</h3>
      <p>Packets crossing an MPLS L3VPN core carry a two-label stack:</p>
      <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 my-3 space-y-2">
        <p><span class="text-amber-400 font-bold">[Outer Label: Transport Label (LDP or Segment Routing)]</span> &bull; Directs the packet across transit P routers to the destination Egress PE.</p>
        <p><span class="text-cyan-400 font-bold">[Inner Label: VPN Label (BGP Extended)]</span> &bull; Read exclusively by the Egress PE router to identify which customer VRF and egress interface receives the native IP packet.</p>
      </div>

      <h3 class="mt-6">3. Cisco IOS-XR VRF Configuration Snippet</h3>
      <div class="carrier-terminal p-4 my-3 text-xs overflow-x-auto">
        <p class="cli-comment">! Cisco IOS-XR VRF and MP-BGP VPNv4 Configuration</p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:PE1(config)#</span> <span class="cli-command">vrf ACME_CORP</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:PE1(config-vrf)#</span> <span class="cli-command">address-family ipv4 unicast</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:PE1(config-vrf-af)#</span> <span class="cli-command">import route-target 65000:100</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:PE1(config-vrf-af)#</span> <span class="cli-command">export route-target 65000:100</span></p>
        <p><span class="cli-prompt">RP/0/RP0/CPU0:PE1(config-vrf-af)#</span> <span class="cli-command">rd 65000:100</span></p>
      </div>
    `
  },
  {
    id: "isp-dwdm-optical-transport",
    track: "Carrier Services",
    domain: "Optical & DWDM",
    title: "DWDM & Optical Transport Networks (OTN)",
    subtitle: "C-Band Wavelengths, ROADMs, Coherent 400G ZR+ Optics, and Optical Link Budgets",
    summary: "The photonic layer underneath all IP routing: multiplying single glass fiber strands into tens of terabits using dense color wavelengths.",
    diagramType: "dwdmOpticalGrid",
    readingTime: "11 min read",
    tags: ["DWDM", "ROADM", "C-Band", "Coherent Optics", "400G ZR+", "EDFA", "Link Budget"],
    content: `
      <h3>1. The Physics of Dense Wavelength Division Multiplexing (DWDM)</h3>
      <p>Single-mode optical fiber has an enormous theoretical bandwidth capacity. Instead of laying new subsea cables, carriers shine multiple laser beams of different colors (wavelengths, &lambda;) down a single glass strand simultaneously:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-amber-400 font-bold mb-1">C-Band Optical Window (1530 nm - 1565 nm)</h4>
          <p class="text-slate-300 leading-relaxed">
            Standard single-mode fiber (ITU-T G.652) experiences minimum optical attenuation (only <strong>~0.2 dB/km</strong>) within the C-band. The ITU-T 50 GHz grid packs <strong>80 to 96 distinct wavelength channels</strong> into this spectrum window.
          </p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <h4 class="text-cyan-400 font-bold mb-1">ROADM (Reconfigurable Optical Add-Drop Multiplexer)</h4>
          <p class="text-slate-300 leading-relaxed">
            Allows carriers to remotely add, drop, or pass through individual wavelengths at intermediate carrier stations using software (Wavelength Selective Switches - WSS) without converting light to electricity.
          </p>
        </div>
      </div>

      <h3 class="mt-6">2. Coherent Optics &amp; 400G ZR / ZR+ Revolution (IPoDWDM)</h3>
      <p>Traditionally, routers connected to separate bulky transponder chassis with short grey optics. Modern carrier routing utilizes <strong>Coherent QSFP-DD 400G ZR / ZR+ pluggable optics</strong> installed directly into router line cards:</p>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li>Uses Dual-Polarization 16-QAM modulation and digital signal processors (DSP) to cancel chromatic dispersion.</li>
        <li>Connects router ports directly into DWDM optical multiplexers up to 1,000+ km without standalone transponder shelves (IP-over-DWDM).</li>
      </ul>
    `
  },
  {
    id: "isp-carrier-te-frr",
    track: "Carrier Services",
    domain: "Traffic Engineering & QoS",
    title: "Carrier Traffic Engineering & 50ms Fast Reroute (TI-LFA)",
    subtitle: "Sub-Second Link Protection, Topology-Independent LFA, and DiffServ QoS EXP Models",
    summary: "How service providers guarantee 99.999% SLA availability: rerouting terabits of transit traffic in under 50 milliseconds before customers notice an outage.",
    diagramType: "segmentRoutingSrv6",
    readingTime: "10 min read",
    tags: ["Traffic Engineering", "TI-LFA", "Fast Reroute", "FRR", "DiffServ", "EXP", "QoS", "SLA"],
    content: `
      <h3>1. The 50ms SLA Requirement in Telecommunications</h3>
      <p>Mission-critical services like mobile 5G backhaul, financial market feeds, and VoIP voice calls drop or stutter if network convergence takes longer than <strong>50 milliseconds</strong>. Standard IGP recomputations take hundreds of milliseconds to seconds. Carriers deploy hardware-level <strong>Fast Reroute (FRR)</strong>.</p>

      <h3 class="mt-6">2. Topology-Independent Loop-Free Alternate (TI-LFA)</h3>
      <p>The modern Segment Routing standard for 100% path coverage:</p>
      <div class="space-y-3 my-4 text-xs">
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-emerald-400 font-bold block mb-1">Pre-Computed Backup Paths</span>
          <p class="text-slate-300">Each router's control plane pre-calculates an alternate backup Segment Routing path for every protected link and downloads it into the ASIC line card hardware FIB before any failure occurs.</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span class="text-cyan-400 font-bold block mb-1">Instant Optical Link Loss Detection</span>
          <p class="text-slate-300">When an optical transponder detects loss of light (Loss of Carrier), the ASIC forwarding engine switches traffic pointer to the pre-loaded backup label stack in <strong>under 30 to 50 milliseconds</strong> with zero packet loss.</p>
        </div>
      </div>

      <h3 class="mt-6">3. MPLS DiffServ QoS Models: Pipe, Uniform & Short-Pipe</h3>
      <ul class="list-disc pl-6 space-y-1.5 text-slate-300 text-xs">
        <li><strong>Uniform Model:</strong> IP DSCP maps to MPLS EXP upon ingress. If EXP is rewritten in the core, the new value is copied back into the IP DSCP upon egress.</li>
        <li><strong>Pipe Model:</strong> Customer IP DSCP is preserved completely intact. Core MPLS EXP is used strictly for internal carrier queuing. Customer DSCP is untouched upon egress.</li>
        <li><strong>Short-Pipe Model:</strong> Similar to Pipe, but egress PE queuing uses the original customer DSCP rather than the transit MPLS EXP.</li>
      </ul>
    `
  }
];
