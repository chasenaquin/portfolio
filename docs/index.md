---
title: "Executive Onboarding Dashboard"
---

# Cloud Migration Platform

Welcome to the **Executive Onboarding Dashboard** for the Cloud Migration Platform. Use the cards below to navigate the documentation.

<!-- Light/Dark Mode Toggle -->
<div style="text-align:center; margin-bottom:20px;">
<button id="theme-toggle" style="padding:8px 16px; border:none; border-radius:6px; background:#00bfff; color:white; cursor:pointer; font-weight:bold;">Toggle Light/Dark Mode</button>
</div>

<style>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.card {
  flex: 1 1 250px;
  max-width: 250px;
  padding: 20px;
  background-color: #2d333b;
  color: white;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card img {
  width: 60px;
  height: 60px;
  margin-bottom: 12px;
}
.card a {
  color: #00bfff;
  text-decoration: none;
  font-weight: bold;
  margin-top: 12px;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.35);
  background-color: #3a3f48;
}
body[data-theme='light'] .card {
  background-color: #f5f5f5;
  color: #2d333b;
}
body[data-theme='light'] .card a {
  color: #0077cc;
}
body[data-theme='light'] .card:hover {
  background-color: #e0e0e0;
}
</style>

<div class="card-container">
  <div class="card">
    <img src="assets/icons/product.svg" alt="Product Icon">
    <h2>📦 Product</h2>
    <p>Platform overview, features, business case, roadmap.</p>
    <a href="product/overview.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/architecture.svg" alt="Architecture Icon">
    <h2>🧠 Architecture</h2>
    <p>High-level architecture, AI orchestration, DR replication.</p>
    <a href="architecture/high-level.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/project.svg" alt="Project Icon">
    <h2>🛠 Project</h2>
    <p>Charter, planning, requirements, risk register.</p>
    <a href="project/charter.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/build.svg" alt="Build Icon">
    <h2>🏗 Build</h2>
    <p>API, UI/UX, infrastructure development.</p>
    <a href="build/README.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/test.svg" alt="Test Icon">
    <h2>🧪 Test</h2>
    <p>Test strategy, automation, quality assurance.</p>
    <a href="test/strategy/README.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/operate.svg" alt="Operate Icon">
    <h2>⚙ Operate</h2>
    <p>Runbooks, monitoring, support procedures.</p>
    <a href="operate/runbooks/README.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/release.svg" alt="Release Icon">
    <h2>🚀 Release</h2>
    <p>Deployment, Go-To-Market strategy, training.</p>
    <a href="release/deployment/README.md">Explore →</a>
  </div>

  <div class="card">
    <img src="assets/icons/leadership.svg" alt="Leadership Icon">
    <h2>📊 Leadership</h2>
    <p>Executive summaries, presentations, and reports.</p>
    <a href="leadership/executive-summary.md">Explore →</a>
  </div>
</div>

<script>
document.getElementById('theme-toggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
});
</script>
