# 🌐 CarrierCore.io — Service Provider & Carrier Backbone Visual Playbook

An interactive, visual-first personal website designed to explore and master **Service Provider Networking & Telecommunications Architecture** by **Abdul-Azeez Sulaimon**. Covers everything from global transit hierarchies and Internet Exchange Points (IXPs) to MPLS label switching, Segment Routing (SR-MPLS & SRv6), BNG subscriber access, and C-Band DWDM photonic transport.

![CarrierCore Banner](https://img.shields.io/badge/Service%20Provider-MPLS%20%7C%20BGP%20%7C%20SRv6-f59e0b?style=for-the-badge&logo=cisco&logoColor=white)
![Hosted on GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-10b981?style=for-the-badge&logo=github&logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## ✨ Features

- 📐 **Vector Architectural Blueprints (SVG)**:
  - **End-to-End MPLS Label Path**: Ingress LER (PUSH), Core LSR (SWAP), Penultimate LSR (PHP), and Egress LER (POP) packet transformations.
  - **Global ISP Peering Ecosystem**: Tier 1 settlement-free peering, public IXP switching fabric with Route Servers (RS), and Tier 2/3 paid transit flows.
  - **C-Band DWDM Optical Grid**: 80/96 wavelength channels multiplexed across a single subsea optical fiber strand with ROADM and EDFA amplification.
  - **SRv6 Segment Routing Header (SRH)**: IPv6 extension header Type 4 routing with locator, function, and argument programming.

- 🔬 **Interactive Carrier Simulators & Tools**:
  - **MPLS Label Swapping & LSP Packet Trace Simulator**: Step-by-step interactive inspection of incoming packets, LFIB table lookups, and hardware label swaps.
  - **Carrier BGP Best Path Selection & Policy Engine**: Dynamically test Weight, Local Preference, AS-Path prepending, Origin codes, MED, and eBGP vs iBGP decision rules.

- 🕒 **Automated Daily Concept Spotlight Engine**:
  - Rotates daily through carrier topics with deep mental models, formulas, Cisco IOS-XR / Junos CLI syntax, and interactive multiple-choice practice quizzes.
  - Previous/Next day navigation controls.

- 📚 **Comprehensive 2-Track Carrier Curriculum**:
  - **ISP Core & Access Foundations**: Tier 1-3 Hierarchy, IS-IS in Carrier Cores, MPLS Label Swapping (RFC 3031), Segment Routing (SR-MPLS & SRv6), BNG Subscriber Access (PPPoE/IPoE, CGNAT), and FTTH (GPON vs XGS-PON).
  - **Peering & Advanced Carrier Services**: Internet Exchange Points (IXPs), RPKI & MANRS Routing Security (ROA validation), BGP/MPLS L3VPN (RFC 4364), EVPN-MPLS, C-Band DWDM & ROADM Transport, and 50ms Fast Reroute (TI-LFA).

- 🔍 **Instant Search & Filters**: Search across all topics using `/` or `Ctrl+K`. Filter by specific carrier domains.
- ⭐ **Local Storage Bookmarks**: Save challenging carrier topics for quick offline reference.
- ⚡ **Zero-Build Architecture**: Runs instantly with zero dependencies. No Node.js or bundlers required. 100% compatible with GitHub Pages.

---

## 🚀 Quick Start (Local)

Simply double-click `index.html` or open it in your browser:

```powershell
# Open directly in default browser on Windows
start index.html
```

---

## 🌐 Deploy to GitHub Pages (Live Website)

```powershell
git init
git add .
git commit -m "feat: Launch CarrierCore.io service provider visual hub"
git branch -M main
git remote add origin https://github.com/suaaz/ISP.git
git push -u origin main
```

---

## 📁 Repository Structure

```
ISP/
├── index.html                   # Main single-page application
├── daily-status.json            # Automated daily timestamp status
├── README.md                    # Project documentation
├── DEPLOYMENT_GUIDE.md          # Step-by-step GitHub Pages setup
├── css/
│   └── styles.css               # Photonic NOC theme, laser amber & carrier terminal styling
├── js/
│   ├── app.js                   # Application controller, modal, search, bookmarks
│   ├── diagrams.js              # SVG vector diagrams (MPLS, Tier-1, DWDM, SRv6)
│   ├── topics-isp-core.js       # Core curriculum (IS-IS, MPLS, Segment Routing, BNG, PON)
│   ├── topics-isp-advanced.js   # Advanced curriculum (IXPs, RPKI, L3VPN, DWDM, TI-LFA)
│   ├── interactive-tools.js     # MPLS Label Trace Simulator & BGP Best Path Engine
│   └── daily.js                 # Daily concept rotation engine & quiz
└── workflows/
    ├── deploy.yml               # Automated GitHub Pages CI/CD workflow
    └── daily-update.yml         # Automated daily cron refresh (runs 00:00 UTC)
```

---

## 📜 Standards & RFC References

- **IETF RFC 3031**: Multiprotocol Label Switching Architecture
- **IETF RFC 4364**: BGP/MPLS IP Virtual Private Networks (VPNs)
- **IETF RFC 7432**: BGP MPLS-Based Ethernet VPN (EVPN)
- **IETF RFC 8200 / 8754**: IPv6 Segment Routing Header (SRv6 SRH)
- **IETF RFC 6811**: BGP Prefix Origin Validation (RPKI ROV)
- **ITU-T G.652 & G.694.1**: Spectral Grids for WDM Applications: DWDM Frequency Grid

---

Crafted with ❤️ by **Abdul-Azeez Sulaimon**.
