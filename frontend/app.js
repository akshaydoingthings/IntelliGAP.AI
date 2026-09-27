/**
 * IntelliGap — Frontend Application Logic
 * Developer-focused skill-gap analysis, match scoring & roadmap generation.
 */

// Global State
const state = {
  analysisData: null,
  radarChart: null,
  demandChart: null,
  activeDemandSkill: 'Python',
  demandCache: {},
  simulatedSkills: new Set(),
  currentTab: 'all',
  theme: localStorage.getItem('intelligap-theme') || 'dark',
};

// DOM Elements
const elements = {
  // Navigation & Theme
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  presetSelect: document.getElementById('presetSelect'),
  resetAppBtn: document.getElementById('resetAppBtn'),
  heroAnalyzeCta: document.getElementById('heroAnalyzeCta'),
  heroDemoBtn: document.getElementById('heroDemoBtn'),

  // Resume Intake
  resumeTextInput: document.getElementById('resumeTextInput'),
  resumeCharCount: document.getElementById('resumeCharCount'),
  clearResumeBtn: document.getElementById('clearResumeBtn'),
  resumeFileInput: document.getElementById('resumeFileInput'),
  dropzone: document.getElementById('dropzone'),
  dropzoneText: document.getElementById('dropzoneText'),

  cvTabUpload: document.getElementById('cvTabUpload'),
  cvTabPaste: document.getElementById('cvTabPaste'),
  cvUploadPane: document.getElementById('cvUploadPane'),
  cvPastePane: document.getElementById('cvPastePane'),
  cvParsedSection: document.getElementById('cvParsedSection'),
  parsedFileName: document.getElementById('parsedFileName'),
  parsedFileStatus: document.getElementById('parsedFileStatus'),
  parsedCandidatePill: document.getElementById('parsedCandidatePill'),
  parsedCandidateName: document.getElementById('parsedCandidateName'),
  parsedSkillsCount: document.getElementById('parsedSkillsCount'),
  parsedSkillsChips: document.getElementById('parsedSkillsChips'),
  toggleRawExtractedBtn: document.getElementById('toggleRawExtractedBtn'),

  // Job Description Intake
  jobTitleInput: document.getElementById('jobTitleInput'),
  jobTextInput: document.getElementById('jobTextInput'),
  jobCharCount: document.getElementById('jobCharCount'),
  clearJobBtn: document.getElementById('clearJobBtn'),

  // Primary Action
  analyzeBtn: document.getElementById('analyzeBtn'),
  analyzeSpinner: document.getElementById('analyzeSpinner'),

  // Clean 5-Stage Stepper Modal
  scanModal: document.getElementById('scanModal'),
  scanModalTitle: document.getElementById('scanModalTitle'),
  scanModalSubtitle: document.getElementById('scanModalSubtitle'),
  scanProgressFill: document.getElementById('scanProgressFill'),
  scanStepLabel: document.getElementById('scanStepLabel'),
  scanPercentLabel: document.getElementById('scanPercentLabel'),
  scanLogBody: document.getElementById('scanLogBody'),

  // Results Dashboard
  dashboardSection: document.getElementById('dashboardSection'),
  resultsRoleTitle: document.getElementById('resultsRoleTitle'),
  candidateGreeting: document.getElementById('candidateGreeting'),
  exportMarkdownBtn: document.getElementById('exportMarkdownBtn'),
  printReportBtn: document.getElementById('printReportBtn'),

  // Metrics & KPI
  scoreCircle: document.getElementById('scoreCircle'),
  matchScoreVal: document.getElementById('matchScoreVal'),
  readinessBadge: document.getElementById('readinessBadge'),
  matchedCount: document.getElementById('matchedCount'),
  criticalCount: document.getElementById('criticalCount'),
  secondaryCount: document.getElementById('secondaryCount'),
  extraCount: document.getElementById('extraCount'),
  totalWeeksVal: document.getElementById('totalWeeksVal'),
  totalHoursVal: document.getElementById('totalHoursVal'),
  strategicAdviceText: document.getElementById('strategicAdviceText'),
  quickTipText: document.getElementById('quickTipText'),

  // Analytics & Simulator
  radarCanvas: document.getElementById('radarChart'),
  simChipsContainer: document.getElementById('simChipsContainer'),
  simProjectedScore: document.getElementById('simProjectedScore'),
  simScoreDelta: document.getElementById('simScoreDelta'),
  resetSimBtn: document.getElementById('resetSimBtn'),

  // Skill Market Context
  demandTrajectoryCard: document.getElementById('demandTrajectoryCard'),
  customSkillSearchInput: document.getElementById('customSkillSearchInput'),
  trackCustomSkillBtn: document.getElementById('trackCustomSkillBtn'),
  demandQuickPills: document.getElementById('demandQuickPills'),
  demandLineCanvas: document.getElementById('demandLineChart'),
  demandMetaSkillName: document.getElementById('demandMetaSkillName'),
  demandMetaStatus: document.getElementById('demandMetaStatus'),
  demandMetaCurrentScore: document.getElementById('demandMetaCurrentScore'),
  demandMetaPeakYear: document.getElementById('demandMetaPeakYear'),
  demandMetaGrowth: document.getElementById('demandMetaGrowth'),
  demandMetaInsight: document.getElementById('demandMetaInsight'),
  demandMetaMilestone: document.getElementById('demandMetaMilestone'),

  // Matrix
  matrixTabs: document.getElementById('matrixTabs'),
  matrixGrid: document.getElementById('matrixGrid'),
  tabCritCount: document.getElementById('tabCritCount'),
  tabSecCount: document.getElementById('tabSecCount'),
  tabMatchCount: document.getElementById('tabMatchCount'),
  tabExtraCount: document.getElementById('tabExtraCount'),

  // Roadmap & Capstone
  timelineContainer: document.getElementById('timelineContainer'),
  capstoneTitle: document.getElementById('capstoneTitle'),
  capstoneDesc: document.getElementById('capstoneDesc'),
  capstoneDeliverablesList: document.getElementById('capstoneDeliverablesList'),
  viewProjectPlanBtn: document.getElementById('viewProjectPlanBtn'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  setupEventListeners();
  setupCvIntakeTabs();
  setupCharCounters();
  setupDropzone();

  // Load default demo preset on first load if inputs empty
  if (!elements.resumeTextInput.value.trim()) {
    loadPreset('frontend_to_fullstack');
  }
});

// Event Listeners
function setupEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('intelligap-theme', state.theme);
    applyTheme(state.theme);
    if (state.radarChart) renderRadarChart();
    if (state.demandChart && state.demandCache[state.activeDemandSkill.toLowerCase()]) {
      renderDemandLineChart(state.demandCache[state.activeDemandSkill.toLowerCase()]);
    }
  });

  // Hero CTAs
  if (elements.heroDemoBtn) {
    elements.heroDemoBtn.addEventListener('click', () => {
      loadPreset('frontend_to_fullstack');
      const inputEl = document.getElementById('inputSection');
      if (inputEl) inputEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Presets
  elements.presetSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      loadPreset(e.target.value);
    }
  });

  // Clear Buttons
  elements.clearResumeBtn.addEventListener('click', () => {
    elements.resumeTextInput.value = '';
    updateCharCounts();
  });

  elements.clearJobBtn.addEventListener('click', () => {
    elements.jobTextInput.value = '';
    updateCharCounts();
  });

  elements.resetAppBtn.addEventListener('click', resetAll);

  // File Upload
  elements.resumeFileInput.addEventListener('change', handleFileUpload);

  // Analysis Execution
  elements.analyzeBtn.addEventListener('click', executeAnalysis);

  // Simulator Reset
  elements.resetSimBtn.addEventListener('click', resetSimulator);

  // Market Demand Search
  if (elements.trackCustomSkillBtn && elements.customSkillSearchInput) {
    elements.trackCustomSkillBtn.addEventListener('click', () => {
      const q = elements.customSkillSearchInput.value.trim();
      if (q) loadAndRenderSkillDemand(q);
    });

    elements.customSkillSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const q = elements.customSkillSearchInput.value.trim();
        if (q) loadAndRenderSkillDemand(q);
      }
    });
  }

  // Matrix Filter Tabs
  elements.matrixTabs.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.matrix-tab');
    if (tabBtn) {
      document.querySelectorAll('.matrix-tab').forEach(t => t.classList.remove('active'));
      tabBtn.classList.add('active');
      state.currentTab = tabBtn.dataset.tab;
      renderMatrixCards();
    }
  });

  // Capstone Plan Scroll CTA
  if (elements.viewProjectPlanBtn) {
    elements.viewProjectPlanBtn.addEventListener('click', () => {
      if (elements.timelineContainer) {
        elements.timelineContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Export & Print
  elements.exportMarkdownBtn.addEventListener('click', downloadMarkdownRoadmap);
  elements.printReportBtn.addEventListener('click', () => window.print());
}

function setupCharCounters() {
  elements.resumeTextInput.addEventListener('input', updateCharCounts);
  elements.jobTextInput.addEventListener('input', updateCharCounts);
  updateCharCounts();
}

function updateCharCounts() {
  elements.resumeCharCount.textContent = `${elements.resumeTextInput.value.length.toLocaleString()} chars`;
  elements.jobCharCount.textContent = `${elements.jobTextInput.value.length.toLocaleString()} chars`;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function resetAll() {
  elements.resumeTextInput.value = '';
  elements.jobTextInput.value = '';
  elements.jobTitleInput.value = 'Senior Full-Stack Software Engineer';
  elements.presetSelect.value = '';
  updateCharCounts();
  elements.dashboardSection.classList.add('hidden');
  state.analysisData = null;
  state.simulatedSkills.clear();
  if (state.demandChart) {
    state.demandChart.destroy();
    state.demandChart = null;
  }
  if (elements.customSkillSearchInput) elements.customSkillSearchInput.value = '';
  updateParsedSection('None', 'No file selected', 'Awaiting input', []);
  showToast('Reset input fields.', 'info');
}

// Drag & Drop
function setupDropzone() {
  ['dragenter', 'dragover'].forEach(eventName => {
    elements.dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      elements.dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    elements.dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      elements.dropzone.classList.remove('dragover');
    });
  });

  elements.dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processResumeFile(files[0]);
    }
  });

  elements.dropzone.addEventListener('click', () => {
    elements.resumeFileInput.click();
  });
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    processResumeFile(file);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processResumeFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  elements.dropzoneText.textContent = `Reading ${file.name}...`;

  try {
    const response = await fetch('/api/parse-resume-file', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`File parsing failed: ${response.statusText}`);
    }

    const data = await response.json();
    elements.resumeTextInput.value = data.raw_text;
    updateCharCounts();
    elements.dropzoneText.textContent = `✓ Uploaded: ${file.name}`;

    const skillsList = Object.keys(data.skills || {});
    updateParsedSection(
      data.candidate_name || 'Uploaded Candidate',
      file.name,
      `Parsed (${(file.size / 1024).toFixed(1)} KB)`,
      skillsList
    );

    showToast(`Extracted ${data.total_skills_count} skills from ${file.name}`, 'success');
  } catch (err) {
    elements.dropzoneText.textContent = 'Drag & drop resume file here, or click to browse';
    showToast(`Error reading file: ${err.message}`, 'error');
  }
}

// Preset Loader
async function loadPreset(presetId) {
  try {
    const response = await fetch(`/api/presets/${presetId}`);
    if (!response.ok) throw new Error('Failed to load preset');
    const preset = await response.json();

    elements.resumeTextInput.value = preset.resume_text.trim();
    elements.jobTextInput.value = preset.job_text.trim();
    elements.jobTitleInput.value = preset.job_title || 'Target Role';
    elements.presetSelect.value = presetId;
    updateCharCounts();

    const presetSkills = extractQuickSkills(preset.resume_text);
    const candidateName = preset.name.split('(')[0].trim() || 'Alex Chen';
    updateParsedSection(
      candidateName,
      `${candidateName.replace(/\s+/g, '_')}_Resume`,
      'Demo Profile Loaded',
      presetSkills
    );

    showToast(`Loaded persona: ${preset.name}`, 'info');
  } catch (err) {
    console.error('Preset loading error:', err);
  }
}

// Clean 5-Stage Stepper Progress Simulation
async function runScanningSimulation() {
  if (!elements.scanModal) return;

  elements.scanModal.classList.remove('hidden');
  elements.scanModalTitle.textContent = 'Analyzing Role Fit';
  elements.scanModalSubtitle.textContent = 'Evaluating candidate proficiencies against role requirements';

  const steps = [
    { step: 1, pct: 20, label: 'Reading resume' },
    { step: 2, pct: 40, label: 'Comparing role requirements' },
    { step: 3, pct: 60, label: 'Mapping skills' },
    { step: 4, pct: 80, label: 'Identifying gaps' },
    { step: 5, pct: 100, label: 'Building roadmap' }
  ];

  const stepperItems = document.querySelectorAll('.stepper-item');

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];

    // Highlight stepper items cleanly
    stepperItems.forEach((item, idx) => {
      item.classList.remove('active');
      if (idx < i) {
        item.classList.add('completed');
      } else if (idx === i) {
        item.classList.add('active');
      } else {
        item.classList.remove('completed');
      }
    });

    elements.scanProgressFill.style.width = `${s.pct}%`;
    elements.scanPercentLabel.textContent = `${s.pct}%`;
    elements.scanStepLabel.textContent = s.label;

    await sleep(260);
  }

  await sleep(150);
  elements.scanModal.classList.add('hidden');
}

// Execute Analysis
async function executeAnalysis() {
  const resumeText = elements.resumeTextInput.value.trim();
  const jobText = elements.jobTextInput.value.trim();
  const jobTitle = elements.jobTitleInput.value.trim() || 'Target Role';

  if (!resumeText) {
    showToast('Please provide a candidate resume or technical background.', 'error');
    elements.resumeTextInput.focus();
    return;
  }

  if (!jobText) {
    showToast('Please provide a target job description.', 'error');
    elements.jobTextInput.focus();
    return;
  }

  elements.analyzeBtn.disabled = true;
  elements.analyzeSpinner.classList.remove('hidden');

  try {
    const analysisPromise = fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: resumeText,
        job_text: jobText,
        job_title: jobTitle
      })
    }).then(async res => {
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Analysis request failed.');
      }
      return res.json();
    });

    const [data] = await Promise.all([
      analysisPromise,
      runScanningSimulation()
    ]);

    state.analysisData = data;
    state.simulatedSkills.clear();

    renderDashboard(data);
    showToast('Skill gap analysis complete & roadmap generated!', 'success');

    elements.dashboardSection.classList.remove('hidden');
    elements.dashboardSection.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    if (elements.scanModal) elements.scanModal.classList.add('hidden');
    showToast(err.message, 'error');
  } finally {
    elements.analyzeBtn.disabled = false;
    elements.analyzeSpinner.classList.add('hidden');
  }
}

// Render Results Dashboard
function renderDashboard(data) {
  const { candidate, job, gap_analysis, roadmap } = data;

  elements.resultsRoleTitle.textContent = `${job.title} Fit Assessment`;
  elements.candidateGreeting.textContent = `Candidate: ${candidate.candidate_name || 'Technical Candidate'} — Identified ${candidate.total_skills_count} candidate skills against ${job.total_skills} role requirements.`;

  const score = gap_analysis.overall_match_score;
  animateScoreDial(score);

  // Status & Dynamic Alignment Narrative
  elements.readinessBadge.textContent = getAlignmentHeadline(score, gap_analysis.readiness);
  elements.readinessBadge.className = `score-status`;

  elements.matchedCount.textContent = gap_analysis.total_matched_count;
  elements.criticalCount.textContent = gap_analysis.critical_gaps.length;
  elements.secondaryCount.textContent = gap_analysis.secondary_gaps.length;
  elements.extraCount.textContent = gap_analysis.extra_candidate_skills.length;

  elements.tabCritCount.textContent = gap_analysis.critical_gaps.length;
  elements.tabSecCount.textContent = gap_analysis.secondary_gaps.length;
  elements.tabMatchCount.textContent = gap_analysis.total_matched_count;
  elements.tabExtraCount.textContent = gap_analysis.extra_candidate_skills.length;

  elements.totalWeeksVal.textContent = roadmap.total_weeks || 12;
  elements.totalHoursVal.textContent = roadmap.total_estimated_hours || 160;

  elements.strategicAdviceText.textContent = gap_analysis.advice || 'Follow the recommended milestone sequence to acquire high-impact role competencies.';

  renderRadarChart();
  setupDemandTrajectory(data);
  setupSimulator();
  renderMatrixCards();
  renderRoadmapTimeline(roadmap);
  renderCapstone(roadmap.capstone_project);
}

function getAlignmentHeadline(score, readiness) {
  if (score >= 80) return 'Strong alignment with this position';
  if (score >= 60) return 'Moderate alignment with core competencies';
  if (score >= 40) return 'Foundational alignment with notable gaps';
  return 'Early-stage alignment — significant gaps to close';
}

// Animate Circular Score Dial
function animateScoreDial(targetScore) {
  const circumference = 2 * Math.PI * 58; // r = 58
  const offset = circumference - (targetScore / 100) * circumference;

  elements.scoreCircle.style.strokeDashoffset = offset;

  // Clean, restrained semantic stroke colors
  if (targetScore >= 80) {
    elements.scoreCircle.style.stroke = 'var(--color-matched)';
  } else if (targetScore >= 60) {
    elements.scoreCircle.style.stroke = 'var(--accent-primary)';
  } else if (targetScore >= 40) {
    elements.scoreCircle.style.stroke = 'var(--color-secondary)';
  } else {
    elements.scoreCircle.style.stroke = 'var(--color-critical)';
  }

  let currentVal = 0;
  const step = Math.max(1, Math.floor(targetScore / 30));
  const timer = setInterval(() => {
    currentVal += step;
    if (currentVal >= targetScore) {
      currentVal = targetScore;
      clearInterval(timer);
    }
    elements.matchScoreVal.textContent = currentVal;
  }, 20);
}

// Radar Chart (Clean Developer Tool Palette)
function renderRadarChart() {
  if (!state.analysisData) return;
  const radarData = state.analysisData.gap_analysis.radar_chart_data;

  if (state.radarChart) {
    state.radarChart.destroy();
  }

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#52525b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const ctx = elements.radarCanvas.getContext('2d');
  state.radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: radarData.labels,
      datasets: [
        {
          label: 'Candidate Match (%)',
          data: radarData.candidate,
          fill: true,
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.15)',
          borderColor: isDark ? '#3b82f6' : '#2563eb',
          pointBackgroundColor: isDark ? '#60a5fa' : '#2563eb',
          pointBorderColor: isDark ? '#090a0f' : '#ffffff',
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#3b82f6',
          borderWidth: 2
        },
        {
          label: 'Target Role Baseline (%)',
          data: radarData.required,
          fill: true,
          backgroundColor: 'transparent',
          borderColor: isDark ? '#64748b' : '#a1a1aa',
          pointBackgroundColor: isDark ? '#64748b' : '#a1a1aa',
          pointBorderColor: isDark ? '#090a0f' : '#ffffff',
          borderDash: [3, 3],
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            display: false
          },
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: textColor,
            font: { family: 'Inter', size: 11, weight: '500' }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { family: 'Inter', size: 11 },
            boxWidth: 12
          }
        }
      }
    }
  });
}

// "What-If" Simulator
function setupSimulator() {
  const { gap_analysis } = state.analysisData;
  const missingSkills = [...gap_analysis.critical_gaps, ...gap_analysis.secondary_gaps];

  elements.simChipsContainer.innerHTML = '';
  elements.simScoreDelta.textContent = `Base: ${gap_analysis.overall_match_score}%`;
  elements.simProjectedScore.textContent = `${gap_analysis.overall_match_score}%`;

  if (missingSkills.length === 0) {
    elements.simChipsContainer.innerHTML = '<p class="text-secondary" style="font-size: 13px;">Candidate profile already covers all identified role competencies.</p>';
    return;
  }

  missingSkills.forEach(skill => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'sim-chip';
    chip.dataset.skill = skill.name;
    chip.textContent = `+ ${skill.name}`;

    chip.addEventListener('click', () => {
      toggleSimulatedSkill(skill.name, chip);
    });

    elements.simChipsContainer.appendChild(chip);
  });
}

async function toggleSimulatedSkill(skillName, chipElement) {
  if (state.simulatedSkills.has(skillName)) {
    state.simulatedSkills.delete(skillName);
    chipElement.classList.remove('active');
    chipElement.textContent = `+ ${skillName}`;
  } else {
    state.simulatedSkills.add(skillName);
    chipElement.classList.add('active');
    chipElement.textContent = `✓ ${skillName}`;
  }

  const currentSkills = Object.keys(state.analysisData.candidate.skills);
  const acquired = Array.from(state.simulatedSkills);

  try {
    const response = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_skills: currentSkills,
        acquired_skills: acquired,
        job_text: elements.jobTextInput.value
      })
    });

    if (response.ok) {
      const simResult = await response.json();
      const projected = simResult.overall_match_score;
      const base = state.analysisData.gap_analysis.overall_match_score;
      const delta = (projected - base).toFixed(1);

      elements.simProjectedScore.textContent = `${projected}%`;
      if (delta > 0) {
        elements.simScoreDelta.textContent = `+${delta}% Gain`;
        elements.simScoreDelta.style.background = 'var(--color-matched-bg)';
        elements.simScoreDelta.style.color = 'var(--color-matched)';
        elements.simScoreDelta.style.borderColor = 'var(--color-matched-border)';
      } else {
        elements.simScoreDelta.textContent = `Base: ${base}%`;
        elements.simScoreDelta.style.background = 'var(--bg-surface)';
        elements.simScoreDelta.style.color = 'var(--text-secondary)';
        elements.simScoreDelta.style.borderColor = 'var(--border-subtle)';
      }
    }
  } catch (err) {
    console.error('Simulation error:', err);
  }
}

function resetSimulator() {
  state.simulatedSkills.clear();
  document.querySelectorAll('.sim-chip').forEach(c => {
    c.classList.remove('active');
    c.textContent = `+ ${c.dataset.skill}`;
  });

  const base = state.analysisData.gap_analysis.overall_match_score;
  elements.simProjectedScore.textContent = `${base}%`;
  elements.simScoreDelta.textContent = `Base: ${base}%`;
  elements.simScoreDelta.style.background = 'var(--bg-surface)';
  elements.simScoreDelta.style.color = 'var(--text-secondary)';
  elements.simScoreDelta.style.borderColor = 'var(--border-subtle)';
}

// Render Skill Gap Matrix Cards
function renderMatrixCards() {
  if (!state.analysisData) return;
  const { gap_analysis } = state.analysisData;
  const grid = elements.matrixGrid;
  grid.innerHTML = '';

  let skillsToDisplay = [];

  if (state.currentTab === 'all') {
    skillsToDisplay = [
      ...gap_analysis.critical_gaps.map(s => ({ ...s, status: 'critical', badge: 'Critical Gap' })),
      ...gap_analysis.secondary_gaps.map(s => ({ ...s, status: 'secondary', badge: 'Secondary Gap' })),
      ...gap_analysis.matched_skills.map(s => ({ ...s, status: 'matched', badge: 'Matched' })),
      ...gap_analysis.extra_candidate_skills.map(s => ({ ...s, status: 'extra', badge: 'Value-Add' }))
    ];
  } else if (state.currentTab === 'critical') {
    skillsToDisplay = gap_analysis.critical_gaps.map(s => ({ ...s, status: 'critical', badge: 'Critical Gap' }));
  } else if (state.currentTab === 'secondary') {
    skillsToDisplay = gap_analysis.secondary_gaps.map(s => ({ ...s, status: 'secondary', badge: 'Secondary Gap' }));
  } else if (state.currentTab === 'matched') {
    skillsToDisplay = gap_analysis.matched_skills.map(s => ({ ...s, status: 'matched', badge: 'Matched' }));
  } else if (state.currentTab === 'extra') {
    skillsToDisplay = gap_analysis.extra_candidate_skills.map(s => ({ ...s, status: 'extra', badge: 'Value-Add' }));
  }

  if (skillsToDisplay.length === 0) {
    grid.innerHTML = `<p class="text-tertiary" style="grid-column: 1 / -1; text-align: center; padding: 2rem; font-size: 13px;">No skills in this category.</p>`;
    return;
  }

  skillsToDisplay.forEach(skill => {
    const card = document.createElement('div');
    card.className = `skill-card`;

    const badgeClass = skill.status === 'matched' ? 'badge-success' :
                       skill.status === 'critical' ? 'badge-danger' :
                       skill.status === 'secondary' ? 'badge-warning' : 'badge-primary';

    card.innerHTML = `
      <div class="skill-card-top">
        <span class="skill-card-name">${skill.name}</span>
        <span class="badge ${badgeClass}">${skill.badge}</span>
      </div>
      <div class="skill-card-meta">
        <span>${skill.category || 'General'}</span>
        <span>•</span>
        <span>~${skill.learning_weeks || 2} wks effort</span>
        <span>•</span>
        <span>${skill.difficulty || 'Intermediate'}</span>
      </div>
      ${skill.project_idea ? `<div class="skill-card-project">${skill.project_idea}</div>` : ''}
    `;

    grid.appendChild(card);
  });
}

// 12-Week Roadmap Rendering (Horizontal on Desktop, Vertical on Mobile)
function renderRoadmapTimeline(roadmap) {
  const container = elements.timelineContainer;
  container.innerHTML = '';

  const phaseNames = [
    'Foundations',
    'Core Skills',
    'Applied Projects',
    'Interview Readiness'
  ];

  roadmap.phases.forEach((phase, index) => {
    const phaseCard = document.createElement('div');
    phaseCard.className = 'phase-card';

    const cleanTitle = phaseNames[index] || phase.title;

    let skillsHtml = '';
    if (phase.skills && phase.skills.length > 0) {
      const skillsItems = phase.skills.map(s => {
        const resourcesHtml = (s.resources || []).map(r => `
          <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
            <span>${r.title}</span>
            <span class="resource-badge">${r.type}</span>
          </a>
        `).join('');

        return `
          <div class="roadmap-skill-item">
            <div class="roadmap-skill-header">
              <span class="roadmap-skill-name">${s.name}</span>
              <span class="badge-subtle">${s.category}</span>
            </div>
            <div class="roadmap-resources-list">
              ${resourcesHtml}
            </div>
          </div>
        `;
      }).join('');

      skillsHtml = `
        <div class="phase-skills-section">
          <div class="phase-subtitle">Skills Covered</div>
          <div class="phase-skills-grid">${skillsItems}</div>
        </div>
      `;
    }

    const milestonesHtml = (phase.milestones || []).map((m, idx) => `
      <li class="milestone-item">
        <input type="checkbox" id="m_${phase.phase_number}_${idx}">
        <label for="m_${phase.phase_number}_${idx}">${m}</label>
      </li>
    `).join('');

    phaseCard.innerHTML = `
      <div class="phase-top-bar">
        <span class="phase-number-badge">Phase ${phase.phase_number}</span>
        <span class="phase-weeks-tag">${phase.weeks}</span>
      </div>
      <div>
        <h4 class="phase-title">Phase ${phase.phase_number} — ${cleanTitle}</h4>
        <p class="phase-goal">${phase.goal}</p>
      </div>
      ${skillsHtml}
      <div class="phase-skills-section">
        <div class="phase-subtitle">Recommended Work &amp; Outcome</div>
        <ul class="milestones-checklist">
          ${milestonesHtml}
        </ul>
      </div>
    `;

    container.appendChild(phaseCard);
  });
}

// Capstone Project Rendering
function renderCapstone(capstone) {
  if (!capstone) return;
  elements.capstoneTitle.textContent = capstone.title || 'Full-Stack Capstone Project';
  elements.capstoneDesc.textContent = capstone.description || 'Consolidate your acquired competencies into a production-grade portfolio piece.';

  elements.capstoneDeliverablesList.innerHTML = (capstone.deliverables || []).map(d => `
    <li>${d}</li>
  `).join('');
}

// Skill Market Context (Historical & Future Demand)
function setupDemandTrajectory(data) {
  if (!elements.demandTrajectoryCard) return;

  const { gap_analysis, demand_trajectories } = data;

  if (demand_trajectories) {
    Object.entries(demand_trajectories).forEach(([name, traj]) => {
      state.demandCache[name.toLowerCase()] = traj;
    });
  }

  const pillSkills = new Set();
  (gap_analysis.matched_skills || []).slice(0, 2).forEach(s => pillSkills.add(s.name));
  (gap_analysis.critical_gaps || []).slice(0, 3).forEach(s => pillSkills.add(s.name));
  (gap_analysis.secondary_gaps || []).slice(0, 2).forEach(s => pillSkills.add(s.name));

  ['TypeScript', 'React', 'Docker', 'Python', 'AWS'].forEach(s => {
    if (pillSkills.size < 8) pillSkills.add(s);
  });

  const skillsList = Array.from(pillSkills);
  setupDemandQuickPills(skillsList);

  const defaultSkill = skillsList[0] || 'Python';
  loadAndRenderSkillDemand(defaultSkill);
}

function setupDemandQuickPills(skillsList) {
  if (!elements.demandQuickPills) return;
  elements.demandQuickPills.innerHTML = '';

  skillsList.forEach((skillName, index) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `demand-pill ${index === 0 ? 'active' : ''}`;
    pill.dataset.skill = skillName;
    pill.textContent = skillName;

    pill.addEventListener('click', () => {
      loadAndRenderSkillDemand(skillName);
    });

    elements.demandQuickPills.appendChild(pill);
  });
}

async function loadAndRenderSkillDemand(skillName) {
  if (!skillName) return;
  state.activeDemandSkill = skillName;

  document.querySelectorAll('.demand-pill').forEach(p => {
    if (p.dataset.skill.toLowerCase() === skillName.toLowerCase()) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  let demandData = state.demandCache[skillName.toLowerCase()];
  if (!demandData) {
    try {
      const res = await fetch(`/api/skill-demand?skill=${encodeURIComponent(skillName)}`);
      if (res.ok) {
        demandData = await res.json();
        state.demandCache[skillName.toLowerCase()] = demandData;
      }
    } catch (err) {
      console.error('Error fetching demand trajectory:', err);
    }
  }

  if (!demandData) return;

  if (elements.demandMetaSkillName) elements.demandMetaSkillName.textContent = demandData.skill;
  if (elements.demandMetaStatus) elements.demandMetaStatus.textContent = demandData.market_status || 'In Demand';
  if (elements.demandMetaCurrentScore) elements.demandMetaCurrentScore.innerHTML = `${demandData.current_2026_demand}<small>/100</small>`;
  if (elements.demandMetaPeakYear) elements.demandMetaPeakYear.textContent = demandData.peak_year;
  if (elements.demandMetaGrowth) elements.demandMetaGrowth.textContent = demandData.growth_yoy;
  if (elements.demandMetaInsight) elements.demandMetaInsight.textContent = demandData.market_insight;
  if (elements.demandMetaMilestone) elements.demandMetaMilestone.textContent = demandData.key_milestone || 'Key industry adoption point.';

  renderDemandLineChart(demandData);
}

function renderDemandLineChart(data) {
  if (!elements.demandLineCanvas) return;

  if (state.demandChart) {
    state.demandChart.destroy();
  }

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#52525b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  const ctx = elements.demandLineCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.12)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

  state.demandChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.years,
      datasets: [
        {
          label: `${data.skill} Demand Curve`,
          data: data.demand_scores,
          borderColor: isDark ? '#3b82f6' : '#2563eb',
          backgroundColor: gradient,
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: isDark ? '#3b82f6' : '#2563eb',
          pointBorderColor: isDark ? '#121722' : '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Inter', size: 10 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Inter', size: 10 },
            stepSize: 25,
            callback: (v) => `${v}%`
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#182030' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#09090b',
          bodyColor: isDark ? '#94a3b8' : '#52525b',
          borderColor: isDark ? '#29344d' : '#e4e4e7',
          borderWidth: 1,
          padding: 8,
          displayColors: false,
          callbacks: {
            title: (items) => `Year ${items[0].label}`,
            label: (item) => `Demand Score: ${item.raw}/100`
          }
        }
      }
    }
  });
}

// Markdown Export
function downloadMarkdownRoadmap() {
  if (!state.analysisData || !state.analysisData.markdown_roadmap) {
    showToast('No roadmap data to export.', 'error');
    return;
  }

  const blob = new Blob([state.analysisData.markdown_roadmap], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `intelligap_roadmap_${(elements.jobTitleInput.value || 'role').toLowerCase().replace(/\s+/g, '_')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Roadmap exported as Markdown.', 'success');
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '!' : '•';
  toast.innerHTML = `<span style="font-weight:700">${icon}</span> <span>${message}</span>`;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// CV Intake Mode Tabs
function setupCvIntakeTabs() {
  if (elements.cvTabUpload && elements.cvTabPaste) {
    elements.cvTabUpload.addEventListener('click', () => {
      elements.cvTabUpload.classList.add('active');
      elements.cvTabPaste.classList.remove('active');
      elements.cvUploadPane.classList.remove('hidden');
      elements.cvPastePane.classList.add('hidden');
    });

    elements.cvTabPaste.addEventListener('click', () => {
      elements.cvTabPaste.classList.add('active');
      elements.cvTabUpload.classList.remove('active');
      elements.cvPastePane.classList.remove('hidden');
      elements.cvUploadPane.classList.add('hidden');
    });
  }

  if (elements.toggleRawExtractedBtn) {
    elements.toggleRawExtractedBtn.addEventListener('click', () => {
      if (elements.cvTabPaste) elements.cvTabPaste.click();
    });
  }
}

function updateParsedSection(candidateName, fileName, statusText, skillsList) {
  if (elements.parsedFileName) elements.parsedFileName.textContent = fileName || 'Uploaded Resume';
  if (elements.parsedFileStatus) elements.parsedFileStatus.textContent = statusText || 'Ready for analysis';
  if (elements.parsedCandidatePill && elements.parsedCandidateName) {
    elements.parsedCandidateName.textContent = candidateName || 'Candidate';
  }
  if (elements.parsedSkillsCount) {
    elements.parsedSkillsCount.textContent = (skillsList || []).length;
  }

  if (elements.parsedSkillsChips) {
    elements.parsedSkillsChips.innerHTML = '';
    if (!skillsList || skillsList.length === 0) {
      elements.parsedSkillsChips.innerHTML = '<span class="parsed-chip">No skills detected yet</span>';
    } else {
      skillsList.slice(0, 18).forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'parsed-chip';
        chip.textContent = skill;
        elements.parsedSkillsChips.appendChild(chip);
      });
      if (skillsList.length > 18) {
        const moreChip = document.createElement('span');
        moreChip.className = 'parsed-chip';
        moreChip.textContent = `+${skillsList.length - 18} more`;
        elements.parsedSkillsChips.appendChild(moreChip);
      }
    }
  }
}

function extractQuickSkills(text) {
  const commonSkills = [
    'React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS',
    'Node.js', 'FastAPI', 'Python', 'SQL', 'PostgreSQL', 'Docker', 'AWS',
    'Git', 'GitHub', 'CI/CD', 'REST APIs', 'Redux', 'Pandas', 'Scikit-Learn',
    'Machine Learning', 'Kubernetes', 'Redis', 'Agile/Scrum', 'Next.js'
  ];
  return commonSkills.filter(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(text);
  });
}

// AI Strategy & Deep Dive Panel (Clean, Restrained)
const aiElements = {
  careerAdviceBtn: document.getElementById('aiCareerAdviceBtn'),
  roadmapBtn: document.getElementById('aiRoadmapBtn'),
  skillDiveBtn: document.getElementById('aiSkillDiveBtn'),
  skillDiveInput: document.getElementById('aiSkillDiveInput'),
  loading: document.getElementById('aiLoading'),
  resultsContainer: document.getElementById('aiResultsContainer'),
  resultTitle: document.getElementById('aiResultTitle'),
  resultBody: document.getElementById('aiResultBody'),
  closeBtn: document.getElementById('aiCloseBtn'),
  insightsSection: document.getElementById('aiInsightsSection'),
};

function setupAiEventListeners() {
  if (aiElements.careerAdviceBtn) {
    aiElements.careerAdviceBtn.addEventListener('click', requestAiCareerAdvice);
  }
  if (aiElements.roadmapBtn) {
    aiElements.roadmapBtn.addEventListener('click', requestAiRoadmap);
  }
  if (aiElements.skillDiveBtn) {
    aiElements.skillDiveBtn.addEventListener('click', () => {
      const skill = aiElements.skillDiveInput?.value?.trim();
      if (skill) requestAiSkillDeepDive(skill);
      else showToast('Enter a skill name to analyze.', 'error');
    });
  }
  if (aiElements.skillDiveInput) {
    aiElements.skillDiveInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const skill = aiElements.skillDiveInput.value.trim();
        if (skill) requestAiSkillDeepDive(skill);
      }
    });
  }
  if (aiElements.closeBtn) {
    aiElements.closeBtn.addEventListener('click', () => {
      aiElements.resultsContainer.classList.add('hidden');
    });
  }
}

document.addEventListener('DOMContentLoaded', setupAiEventListeners);

function showAiLoading(text = 'Generating insights...') {
  if (aiElements.loading) {
    aiElements.loading.classList.remove('hidden');
    const textEl = aiElements.loading.querySelector('.ai-loading-text');
    if (textEl) textEl.textContent = text;
  }
  if (aiElements.resultsContainer) aiElements.resultsContainer.classList.add('hidden');

  [aiElements.careerAdviceBtn, aiElements.roadmapBtn, aiElements.skillDiveBtn].forEach(btn => {
    if (btn) btn.disabled = true;
  });
}

function hideAiLoading() {
  if (aiElements.loading) aiElements.loading.classList.add('hidden');

  [aiElements.careerAdviceBtn, aiElements.roadmapBtn, aiElements.skillDiveBtn].forEach(btn => {
    if (btn) btn.disabled = false;
  });
}

function showAiResult(title, html) {
  hideAiLoading();
  if (aiElements.resultTitle) aiElements.resultTitle.textContent = title;
  if (aiElements.resultBody) aiElements.resultBody.innerHTML = html;
  if (aiElements.resultsContainer) {
    aiElements.resultsContainer.classList.remove('hidden');
    aiElements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function requestAiCareerAdvice() {
  if (!state.analysisData) {
    showToast('Run a skill gap analysis first.', 'error');
    return;
  }

  const { gap_analysis } = state.analysisData;
  const jobTitle = elements.jobTitleInput?.value?.trim() || 'Target Role';

  showAiLoading('Generating role-specific career strategy...');

  try {
    const response = await fetch('/api/ai-career-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matched_skills: gap_analysis.matched_skills.map(s => s.name),
        missing_skills: gap_analysis.critical_gaps.map(s => s.name),
        extra_skills: gap_analysis.extra_candidate_skills.map(s => s.name),
        job_title: jobTitle,
        match_score: gap_analysis.overall_match_score,
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Request failed');
    }

    const data = await response.json();
    showAiResult('Career Strategy Assessment', renderCareerAdviceHtml(data));
    showToast('Career strategy generated.', 'success');
  } catch (err) {
    hideAiLoading();
    showToast(`Error: ${err.message}`, 'error');
  }
}

function renderCareerAdviceHtml(data) {
  let html = '';

  if (data.executive_summary) {
    html += `
      <div class="ai-card">
        <div class="ai-card-title">Executive Summary</div>
        <div class="ai-card-content">${data.executive_summary}</div>
      </div>`;
  }

  if (data.strengths_analysis) {
    html += `
      <div class="ai-card">
        <div class="ai-card-title">Core Strengths</div>
        <div class="ai-card-content">${data.strengths_analysis}</div>
      </div>`;
  }

  if (data.priority_actions?.length) {
    html += `<div class="ai-section-label">Priority Actions</div>`;
    data.priority_actions.forEach(action => {
      html += `
        <div class="ai-card">
          <div class="ai-card-title">${action.action}</div>
          <div class="ai-card-content">
            ${action.reasoning || ''}
            ${action.timeline ? `<br><strong>Timeline:</strong> ${action.timeline}` : ''}
          </div>
        </div>`;
    });
  }

  if (data.interview_tips?.length) {
    html += `<div class="ai-section-label">Technical Interview Guidance</div>`;
    html += `<ul class="ai-tip-list">${data.interview_tips.map(t => `<li>${t}</li>`).join('')}</ul>`;
  }

  return html || '<p>No strategic findings generated.</p>';
}

async function requestAiRoadmap() {
  if (!state.analysisData) {
    showToast('Run a skill gap analysis first.', 'error');
    return;
  }

  const { gap_analysis } = state.analysisData;
  const jobTitle = elements.jobTitleInput?.value?.trim() || 'Target Role';

  showAiLoading('Synthesizing structured study schedule...');

  try {
    const response = await fetch('/api/ai-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missing_skills: [
          ...gap_analysis.critical_gaps.map(s => s.name),
          ...gap_analysis.secondary_gaps.map(s => s.name)
        ],
        matched_skills: gap_analysis.matched_skills.map(s => s.name),
        job_title: jobTitle,
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Request failed');
    }

    const data = await response.json();
    showAiResult('Structured Learning Plan', renderAiRoadmapHtml(data));
    showToast('Learning schedule generated.', 'success');
  } catch (err) {
    hideAiLoading();
    showToast(`Error: ${err.message}`, 'error');
  }
}

function renderAiRoadmapHtml(data) {
  let html = '';

  if (data.title) {
    html += `<div class="ai-card">
      <div class="ai-card-title">${data.title}</div>
      <div class="ai-card-content">
        <strong>Total Duration:</strong> ${data.total_duration || '12 Weeks'} •
        <strong>Commitment:</strong> ${data.weekly_commitment || '12-15 hrs/wk'}
      </div>
    </div>`;
  }

  if (data.phases?.length) {
    html += `<div class="ai-section-label">Learning Phases</div>`;
    data.phases.forEach(phase => {
      html += `
        <div class="ai-card">
          <div class="ai-card-title">Phase ${phase.phase}: ${phase.name} (${phase.duration || ''})</div>
          <div class="ai-card-content">${phase.focus || ''}</div>
        </div>`;
    });
  }

  return html || '<p>No study plan returned.</p>';
}

async function requestAiSkillDeepDive(skillName) {
  const jobTitle = elements.jobTitleInput?.value?.trim() || 'Target Role';

  showAiLoading(`Analyzing ${skillName}...`);

  try {
    const response = await fetch('/api/ai-skill-deep-dive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skill: skillName,
        target_role: jobTitle,
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Request failed');
    }

    const data = await response.json();
    showAiResult(`Deep Dive: ${data.skill || skillName}`, renderSkillDeepDiveHtml(data));
    showToast(`Deep dive complete for ${skillName}.`, 'success');
  } catch (err) {
    hideAiLoading();
    showToast(`Error: ${err.message}`, 'error');
  }
}

function renderSkillDeepDiveHtml(data) {
  let html = '';
  const ma = data.market_analysis || {};
  const lp = data.learning_path || {};

  html += `<div class="ai-card">
    <div class="ai-card-title">Market Analysis</div>
    <div class="ai-card-content">
      <strong>Demand:</strong> ${ma.demand_level || 'High'} • 
      <strong>Trend:</strong> ${ma.trend || 'Positive'} • 
      <strong>Salary Impact:</strong> ${ma.avg_salary_impact || 'Significant'}
      ${ma.top_companies_hiring?.length ? `<br><strong>Hiring Companies:</strong> ${ma.top_companies_hiring.join(', ')}` : ''}
    </div>
  </div>`;

  if (lp.estimated_time_to_proficiency) {
    html += `<div class="ai-card">
      <div class="ai-card-title">Learning Path</div>
      <div class="ai-card-content">
        <strong>Time to Proficiency:</strong> ${lp.estimated_time_to_proficiency}<br>
        ${lp.intermediate_project ? `<strong>Project:</strong> ${lp.intermediate_project}` : ''}
      </div>
    </div>`;
  }

  return html || '<p>No data returned.</p>';
}
