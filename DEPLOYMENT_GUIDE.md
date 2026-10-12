# 🚀 Deployment Guide: Publishing CarrierCore.io to GitHub Pages

This guide walks you through deploying **CarrierCore.io** live to GitHub Pages for free.

---

## 🛠️ Step 1: Initialize Git and Commit Locally

Open PowerShell inside this folder:

```powershell
cd "c:\Users\abdul-azeez.sulaimon\Downloads\ISP"

git init
git add .
git commit -m "feat: Initial commit of CarrierCore service provider visual playbook"
```

---

## 📦 Step 2: Create a GitHub Repository

1. Log into your GitHub account: [https://github.com](https://github.com)
2. Click the **+** (New Repository) in the upper right.
3. Name your repository `ISP` (or `CarrierCore`).
4. Set visibility to **Public**.
5. **Do NOT** initialize with a README or license.
6. Click **Create repository**.

---

## 🔗 Step 3: Link and Push to GitHub

In PowerShell, run:

```powershell
git branch -M main
git remote add origin https://github.com/suaaz/ISP.git
git push -u origin main
```

---

## ⚙️ Step 4: Enable GitHub Pages

1. Navigate to your repository on GitHub (`https://github.com/suaaz/ISP`).
2. Click **Settings** ➔ **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select `main` and folder `/ (root)`.
   - Click **Save**.
4. After 60-90 seconds, your site will be live at:
   > **https://suaaz.github.io/ISP/**

---

Enjoy your live Service Provider engineering hub! 🚀
