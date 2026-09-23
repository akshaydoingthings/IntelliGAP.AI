

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


const elements = {
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  presetSelect: document.getElementById('presetSelect'),
  resetAppBtn: document.getElementById('resetAppBtn'),


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
  thunderboltCanvas: document.getElementById('thunderboltCanvas'),

  jobTitleInput: document.getElementById('jobTitleInput'),
  jobTextInput: document.getElementById('jobTextInput'),
  jobCharCount: document.getElementById('jobCharCount'),
  clearJobBtn: document.getElementById('clearJobBtn'),

  analyzeBtn: document.getElementById('analyzeBtn'),
  analyzeSpinner: document.getElementById('analyzeSpinner'),

  // Realistic Scanning Modal Elements
  scanModal: document.getElementById('scanModal'),
  scanModalTitle: document.getElementById('scanModalTitle'),
  scanModalSubtitle: document.getElementById('scanModalSubtitle'),
  scanProgressFill: document.getElementById('scanProgressFill'),
  scanStepLabel: document.getElementById('scanStepLabel'),
  scanPercentLabel: document.getElementById('scanPercentLabel'),
  scanLogBody: document.getElementById('scanLogBody'),


  dashboardSection: document.getElementById('dashboardSection'),
  resultsRoleTitle: document.getElementById('resultsRoleTitle'),
  candidateGreeting: document.getElementById('candidateGreeting'),
  exportMarkdownBtn: document.getElementById('exportMarkdownBtn'),
  printReportBtn: document.getElementById('printReportBtn'),


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


  radarCanvas: document.getElementById('radarChart'),
  simChipsContainer: document.getElementById('simChipsContainer'),
  simProjectedScore: document.getElementById('simProjectedScore'),
  simScoreDelta: document.getElementById('simScoreDelta'),
  resetSimBtn: document.getElementById('resetSimBtn'),

  // 2008-2026 Skill Demand Trajectory Elements
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


  matrixTabs: document.getElementById('matrixTabs'),
  matrixGrid: document.getElementById('matrixGrid'),
  tabCritCount: document.getElementById('tabCritCount'),
  tabSecCount: document.getElementById('tabSecCount'),
  tabMatchCount: document.getElementById('tabMatchCount'),
  tabExtraCount: document.getElementById('tabExtraCount'),


  timelineContainer: document.getElementById('timelineContainer'),
  capstoneTitle: document.getElementById('capstoneTitle'),
  capstoneDesc: document.getElementById('capstoneDesc'),
  capstoneDeliverablesList: document.getElementById('capstoneDeliverablesList'),


  toastContainer: document.getElementById('toastContainer')
};


document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  initThunderboltBackground();
  setupEventListeners();
  setupCvIntakeTabs();
  setupCharCounters();
  setupDropzone();


  if (!elements.resumeTextInput.value.trim()) {
    loadPreset('frontend_to_fullstack');
  }
});


function setupEventListeners() {

  elements.themeToggleBtn.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('intelligap-theme', state.theme);
    applyTheme(state.theme);
    if (state.radarChart) renderRadarChart();
    if (state.demandChart && state.demandCache[state.activeDemandSkill.toLowerCase()]) {
      renderDemandLineChart(state.demandCache[state.activeDemandSkill.toLowerCase()]);
    }
  });


  elements.presetSelect.addEventListener('change', (e) => {
    if (e.target.value) {
      loadPreset(e.target.value);
    }
  });


  elements.clearResumeBtn.addEventListener('click', () => {
    elements.resumeTextInput.value = '';
    updateCharCounts();
  });

  elements.clearJobBtn.addEventListener('click', () => {
    elements.jobTextInput.value = '';
    updateCharCounts();
  });

  elements.resetAppBtn.addEventListener('click', resetAll);


  elements.resumeFileInput.addEventListener('change', handleFileUpload);


  elements.analyzeBtn.addEventListener('click', executeAnalysis);


  elements.resetSimBtn.addEventListener('click', resetSimulator);


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


  elements.matrixTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('matrix-tab')) {
      document.querySelectorAll('.matrix-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      state.currentTab = e.target.dataset.tab;
      renderMatrixCards();
    }
  });


  elements.exportMarkdownBtn.addEventListener('click', downloadMarkdownRoadmap);
  elements.printReportBtn.addEventListener('click', () => window.print());
}

function setupCharCounters() {
  elements.resumeTextInput.addEventListener('input', updateCharCounts);
  elements.jobTextInput.addEventListener('input', updateCharCounts);
  updateCharCounts();
}

function updateCharCounts() {
  elements.resumeCharCount.textContent = `${elements.resumeTextInput.value.length.toLocaleString()} characters`;
  elements.jobCharCount.textContent = `${elements.jobTextInput.value.length.toLocaleString()} characters`;
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
  updateParsedSection('None', 'No file selected', 'Awaiting Upload', []);
  showToast('Reset input fields.', 'info');
}


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

  elements.dropzoneText.textContent = `Analyzing document structure...`;

  try {
    const parsePromise = fetch('/api/parse-resume-file', {
      method: 'POST',
      body: formData
    }).then(async res => {
      if (!res.ok) {
        throw new Error(`File parsing failed: ${res.statusText}`);
      }
      return res.json();
    });

    // Realistic scanning progression
    await sleep(350);
    elements.dropzoneText.textContent = `Parsing ${file.name} tokens & syntax trees...`;
    await sleep(350);
    elements.dropzoneText.textContent = `Extracting technical proficiencies & stack...`;
    await sleep(350);

    const data = await parsePromise;
    elements.resumeTextInput.value = data.raw_text;
    updateCharCounts();
    elements.dropzoneText.textContent = `✓ Uploaded: ${file.name}`;

    const skillsList = Object.keys(data.skills || {});
    updateParsedSection(
      data.candidate_name || 'Uploaded Candidate',
      file.name,
      `NLP Parsed (${(file.size / 1024).toFixed(1)} KB)`,
      skillsList
    );

    triggerLightning(2);
    showToast(`Successfully extracted ${data.total_skills_count} skills from ${file.name}!`, 'success');
  } catch (err) {
    elements.dropzoneText.textContent = 'Drag & drop candidate CV here';
    showToast(`Error parsing file: ${err.message}`, 'error');
  }
}


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
      'Preset Profile Loaded',
      presetSkills
    );

    triggerLightning(1.2);
    showToast(`Loaded demo: ${preset.name}`, 'info');
  } catch (err) {
    console.error('Preset loading error:', err);
  }
}


async function runScanningSimulation(candidateName = 'Candidate') {
  if (!elements.scanModal) return;

  elements.scanModal.classList.remove('hidden');
  elements.scanModalTitle.textContent = `Deconstructing ${candidateName}'s Credentials...`;
  elements.scanLogBody.innerHTML = '';

  const steps = [
    { pct: 18, label: 'Reading document syntax & token hierarchy...', log: '› [0.2s] Syntax trees parsed. Initializing token vectorizer...' },
    { pct: 42, label: 'Extracting technical proficiencies, frameworks & toolchains...', log: '› [0.6s] Detected technical competencies across frontend, backend & AI...' },
    { pct: 68, label: 'Cross-referencing 2008–2026 global market demand indices...', log: '› [1.1s] Querying multi-year tech demand trends (2008–2026)...' },
    { pct: 88, label: 'Computing multi-dimensional fit score & critical gap hierarchy...', log: '› [1.6s] Gap hierarchy mapped: separating mandatory vs preferred requirements...' },
    { pct: 100, label: 'Synthesizing personalized 12-week roadmap & capstone blueprint...', log: '› [2.0s] Synthesis complete. Generating interactive milestone matrix.' }
  ];

  for (const step of steps) {
    elements.scanProgressFill.style.width = `${step.pct}%`;
    elements.scanPercentLabel.textContent = `${step.pct}%`;
    elements.scanStepLabel.textContent = step.label;

    const logItem = document.createElement('div');
    logItem.className = 'log-entry log-active';
    logItem.textContent = step.log;
    elements.scanLogBody.appendChild(logItem);
    elements.scanLogBody.scrollTop = elements.scanLogBody.scrollHeight;

    await sleep(360);
  }

  await sleep(220);
  elements.scanModal.classList.add('hidden');
}


async function executeAnalysis() {
  const resumeText = elements.resumeTextInput.value.trim();
  const jobText = elements.jobTextInput.value.trim();
  const jobTitle = elements.jobTitleInput.value.trim() || 'Target Role';

  if (!resumeText) {
    showToast('Please provide a candidate resume or skill list.', 'error');
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
  triggerLightning(1.6);

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

    const candidateName = elements.parsedCandidateName ? elements.parsedCandidateName.textContent : 'Candidate';
    const [data] = await Promise.all([
      analysisPromise,
      runScanningSimulation(candidateName)
    ]);

    state.analysisData = data;
    state.simulatedSkills.clear();

    triggerLightning(2.5);

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


function renderDashboard(data) {
  const { candidate, job, gap_analysis, roadmap } = data;

  elements.resultsRoleTitle.textContent = `${job.title} Fit Assessment`;
  elements.candidateGreeting.textContent = `Candidate: ${candidate.candidate_name || 'Job Seeker'} | Identified ${candidate.total_skills_count} candidate skills vs ${job.total_skills} role requirements`;

  const score = gap_analysis.overall_match_score;
  animateScoreDial(score);

  elements.readinessBadge.textContent = gap_analysis.readiness;
  elements.readinessBadge.className = `badge badge-${gap_analysis.readiness_badge}`;

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

  elements.strategicAdviceText.textContent = gap_analysis.advice;

  renderRadarChart();

  setupDemandTrajectory(data);

  setupSimulator();

  renderMatrixCards();

  renderRoadmapTimeline(roadmap);

  renderCapstone(roadmap.capstone_project);
}


/* ==========================================================================
   2008 - 2026 Historical & Future Skill Demand Trajectory Logic
   ========================================================================== */

function setupDemandTrajectory(data) {
  if (!elements.demandTrajectoryCard) return;

  const { gap_analysis, demand_trajectories } = data;

  // Cache any pre-computed trajectories
  if (demand_trajectories) {
    Object.entries(demand_trajectories).forEach(([name, traj]) => {
      state.demandCache[name.toLowerCase()] = traj;
    });
  }

  // Build list of recommended skills to display as pills
  const pillSkills = new Set();

  // Matched candidate skills
  (gap_analysis.matched_skills || []).slice(0, 3).forEach(s => pillSkills.add(s.name));

  // Critical gaps (high priority)
  (gap_analysis.critical_gaps || []).slice(0, 3).forEach(s => pillSkills.add(s.name));

  // Secondary gaps
  (gap_analysis.secondary_gaps || []).slice(0, 2).forEach(s => pillSkills.add(s.name));

  // Industry benchmark staples
  ['Python', 'TypeScript', 'React', 'Docker', 'Kubernetes', 'LangChain', 'Next.js', 'Rust'].forEach(s => {
    if (pillSkills.size < 9) pillSkills.add(s);
  });

  const skillsList = Array.from(pillSkills);
  setupDemandQuickPills(skillsList);

  // Default to first skill or Python
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

  // Highlight pill
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
  if (elements.demandMetaMilestone) elements.demandMetaMilestone.textContent = demandData.key_milestone || 'Key industry inflection point.';

  renderDemandLineChart(demandData);
}

function renderDemandLineChart(data) {
  if (!elements.demandLineCanvas) return;

  if (state.demandChart) {
    state.demandChart.destroy();
  }

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const ctx = elements.demandLineCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 260);
  gradient.addColorStop(0, 'rgba(0, 210, 255, 0.35)');
  gradient.addColorStop(0.7, 'rgba(37, 99, 235, 0.1)');
  gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

  state.demandChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.years,
      datasets: [
        {
          label: `${data.skill} Demand Index (2008 – 2026)`,
          data: data.demand_scores,
          borderColor: '#00d2ff',
          backgroundColor: gradient,
          fill: true,
          tension: 0.38,
          borderWidth: 3,
          pointBackgroundColor: '#00f5ff',
          pointBorderColor: isDark ? '#0f172a' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#00d2ff'
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
            font: { family: 'Plus Jakarta Sans', size: 11 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 11 },
            stepSize: 25,
            callback: (v) => `${v}%`
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#38bdf8' : '#2563eb',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: (items) => `Year: ${items[0].label}`,
            label: (item) => `Demand Index: ${item.raw} / 100`
          }
        }
      }
    }
  });
}


function animateScoreDial(targetScore) {
  const circumference = 2 * Math.PI * 58; 
  const offset = circumference - (targetScore / 100) * circumference;

  elements.scoreCircle.style.strokeDashoffset = offset;


  if (targetScore >= 80) {
    elements.scoreCircle.style.stroke = 'var(--color-matched)';
  } else if (targetScore >= 60) {
    elements.scoreCircle.style.stroke = 'var(--primary)';
  } else if (targetScore >= 40) {
    elements.scoreCircle.style.stroke = 'var(--color-secondary-gap)';
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
  }, 25);
}


function renderRadarChart() {
  if (!state.analysisData) return;
  const radarData = state.analysisData.gap_analysis.radar_chart_data;

  if (state.radarChart) {
    state.radarChart.destroy();
  }

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
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
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#818cf8',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1',
          borderWidth: 2
        },
        {
          label: 'Target Role Baseline (%)',
          data: radarData.required,
          fill: true,
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderColor: 'rgba(6, 182, 212, 0.6)',
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#fff',
          borderDash: [4, 4],
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
          angleLines: {
            color: gridColor
          },
          grid: {
            color: gridColor
          },
          pointLabels: {
            color: textColor,
            font: {
              family: 'Plus Jakarta Sans',
              size: 11,
              weight: '600'
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: {
              family: 'Plus Jakarta Sans',
              size: 12
            }
          }
        }
      }
    }
  });
}


function setupSimulator() {
  const { gap_analysis } = state.analysisData;
  const missingSkills = [...gap_analysis.critical_gaps, ...gap_analysis.secondary_gaps];

  elements.simChipsContainer.innerHTML = '';
  elements.simScoreDelta.textContent = `Base: ${gap_analysis.overall_match_score}%`;
  elements.simProjectedScore.textContent = `${gap_analysis.overall_match_score}%`;

  if (missingSkills.length === 0) {
    elements.simChipsContainer.innerHTML = '<p class="text-muted">You already match all role skills!</p>';
    return;
  }

  missingSkills.forEach(skill => {
    const chip = document.createElement('div');
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
    chipElement.textContent = `${skillName}`;
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
      } else {
        elements.simScoreDelta.textContent = `Base: ${base}%`;
        elements.simScoreDelta.style.background = 'rgba(6, 182, 212, 0.15)';
        elements.simScoreDelta.style.color = 'var(--accent-cyan)';
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
  elements.simScoreDelta.style.background = 'rgba(6, 182, 212, 0.15)';
  elements.simScoreDelta.style.color = 'var(--accent-cyan)';
}


function renderMatrixCards() {
  if (!state.analysisData) return;
  const { gap_analysis } = state.analysisData;
  const grid = elements.matrixGrid;
  grid.innerHTML = '';

  let skillsToDisplay = [];

  if (state.currentTab === 'all') {
    skillsToDisplay = [
      ...gap_analysis.critical_gaps.map(s => ({ ...s, status: 'critical', badge: 'Required Gap' })),
      ...gap_analysis.secondary_gaps.map(s => ({ ...s, status: 'secondary', badge: 'Preferred Gap' })),
      ...gap_analysis.matched_skills.map(s => ({ ...s, status: 'matched', badge: 'Matched' })),
      ...gap_analysis.extra_candidate_skills.map(s => ({ ...s, status: 'extra', badge: 'Extra Skill' }))
    ];
  } else if (state.currentTab === 'critical') {
    skillsToDisplay = gap_analysis.critical_gaps.map(s => ({ ...s, status: 'critical', badge: 'Required Gap' }));
  } else if (state.currentTab === 'secondary') {
    skillsToDisplay = gap_analysis.secondary_gaps.map(s => ({ ...s, status: 'secondary', badge: 'Preferred Gap' }));
  } else if (state.currentTab === 'matched') {
    skillsToDisplay = gap_analysis.matched_skills.map(s => ({ ...s, status: 'matched', badge: 'Matched' }));
  } else if (state.currentTab === 'extra') {
    skillsToDisplay = gap_analysis.extra_candidate_skills.map(s => ({ ...s, status: 'extra', badge: 'Extra Skill' }));
  }

  if (skillsToDisplay.length === 0) {
    grid.innerHTML = `<p class="text-muted" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No skills found in this category.</p>`;
    return;
  }

  skillsToDisplay.forEach(skill => {
    const card = document.createElement('div');
    card.className = `skill-card status-${skill.status}`;

    const badgeClass = skill.status === 'matched' ? 'badge-success' : 
                       skill.status === 'critical' ? 'badge-danger' : 
                       skill.status === 'secondary' ? 'badge-warning' : 'badge-primary';

    card.innerHTML = `
      <div class="skill-card-top">
        <span class="skill-card-name">${skill.name}</span>
        <span class="badge ${badgeClass}">${skill.badge}</span>
      </div>
      <div class="skill-card-meta">
        <span>📁 ${skill.category || 'General'}</span>
        <span>⏱️ ~${skill.learning_weeks || 2} wks</span>
        <span>🎯 ${skill.difficulty || 'Intermediate'}</span>
      </div>
      ${skill.project_idea ? `<div class="skill-card-project">💡 ${skill.project_idea}</div>` : ''}
    `;

    grid.appendChild(card);
  });
}


function renderRoadmapTimeline(roadmap) {
  const container = elements.timelineContainer;
  container.innerHTML = '';

  roadmap.phases.forEach(phase => {
    const phaseCard = document.createElement('div');
    phaseCard.className = 'glass-card phase-card';


    let skillsHtml = '';
    if (phase.skills && phase.skills.length > 0) {
      const skillsGridItems = phase.skills.map(s => {
        const resourcesHtml = (s.resources || []).map(r => `
          <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
            <span>${r.title}</span>
            <span class="resource-badge">${r.type} • ${r.free ? 'Free' : 'Paid'}</span>
          </a>
        `).join('');

        return `
          <div class="roadmap-skill-item">
            <div class="roadmap-skill-header">
              <span class="roadmap-skill-name">${s.name}</span>
              <span class="badge badge-subtle">${s.category}</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
              🛠️ <em>${s.project_idea || 'Hands-on practice'}</em>
            </p>
            <div class="roadmap-resources-list">
              ${resourcesHtml}
            </div>
          </div>
        `;
      }).join('');

      skillsHtml = `
        <div class="phase-skills-section">
          <div class="phase-subtitle">Key Skills to Master</div>
          <div class="phase-skills-grid">${skillsGridItems}</div>
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
      <div class="phase-node">${phase.phase_number}</div>
      <div class="phase-header">
        <div>
          <h3 class="phase-title">Phase ${phase.phase_number}: ${phase.title}</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Est. ${phase.estimated_hours_per_week || 12} hrs/week</span>
        </div>
        <span class="phase-weeks-tag">${phase.weeks}</span>
      </div>
      <p class="phase-goal">${phase.goal}</p>
      ${skillsHtml}
      <div class="phase-milestones-section">
        <div class="phase-subtitle">Phase Milestones & Deliverables</div>
        <ul class="milestones-checklist">
          ${milestonesHtml}
        </ul>
      </div>
    `;

    container.appendChild(phaseCard);
  });
}

function renderCapstone(capstone) {
  if (!capstone) return;
  elements.capstoneTitle.textContent = capstone.title;
  elements.capstoneDesc.textContent = capstone.description;

  elements.capstoneDeliverablesList.innerHTML = (capstone.deliverables || []).map(d => `
    <li>${d}</li>
  `).join('');
}


function downloadMarkdownRoadmap() {
  if (!state.analysisData || !state.analysisData.markdown_roadmap) {
    showToast('No roadmap data to export.', 'error');
    return;
  }

  const blob = new Blob([state.analysisData.markdown_roadmap], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `learning_roadmap_${(elements.jobTitleInput.value || 'target_role').toLowerCase().replace(/\s+/g, '_')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Roadmap downloaded as Markdown!', 'success');
}


function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


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


  const liveHeart = document.querySelector('.live-heart');
  if (liveHeart) {
    liveHeart.addEventListener('click', () => {
      triggerLightning(2.2);
      showToast('⚡ Powered with love by Akshay!', 'success');
    });
  }
}

function updateParsedSection(candidateName, fileName, statusText, skillsList) {
  if (elements.parsedFileName) elements.parsedFileName.textContent = fileName || 'Uploaded Resume';
  if (elements.parsedFileStatus) elements.parsedFileStatus.textContent = statusText || 'NLP Extracted Successfully';
  if (elements.parsedCandidatePill && elements.parsedCandidateName) {
    elements.parsedCandidateName.textContent = candidateName || 'Candidate';
  }
  if (elements.parsedSkillsCount) {
    elements.parsedSkillsCount.textContent = (skillsList || []).length;
  }

  if (elements.parsedSkillsChips) {
    elements.parsedSkillsChips.innerHTML = '';
    if (!skillsList || skillsList.length === 0) {
      elements.parsedSkillsChips.innerHTML = '<span class="parsed-chip" style="opacity:0.6">No skills detected yet</span>';
    } else {
      skillsList.slice(0, 25).forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'parsed-chip';
        const boltSpan = document.createElement('span');
        boltSpan.textContent = '⚡ ';
        chip.appendChild(boltSpan);
        chip.appendChild(document.createTextNode(skill));
        elements.parsedSkillsChips.appendChild(chip);
      });
      if (skillsList.length > 25) {
        const moreChip = document.createElement('span');
        moreChip.className = 'parsed-chip';
        moreChip.style.background = 'rgba(255, 255, 255, 0.08)';
        moreChip.textContent = `+${skillsList.length - 25} more`;
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


let lightningEngine = {
  canvas: null,
  ctx: null,
  bolts: [],
  flashAlpha: 0,
  timerId: null,
  animId: null
};

function initThunderboltBackground() {
  const canvas = elements.thunderboltCanvas || document.getElementById('thunderboltCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  lightningEngine.canvas = canvas;
  lightningEngine.ctx = ctx;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();


  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (lightningEngine.flashAlpha > 0.005) {
      const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      ctx.fillStyle = isDark
        ? `rgba(56, 189, 248, ${lightningEngine.flashAlpha * 0.12})`
        : `rgba(99, 102, 241, ${lightningEngine.flashAlpha * 0.08})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      lightningEngine.flashAlpha *= 0.88;
    }


    for (let i = lightningEngine.bolts.length - 1; i >= 0; i--) {
      const bolt = lightningEngine.bolts[i];
      renderBolt(ctx, bolt);
      bolt.life -= bolt.decay;
      if (bolt.life <= 0) {
        lightningEngine.bolts.splice(i, 1);
      }
    }

    lightningEngine.animId = requestAnimationFrame(loop);
  }
  loop();


  scheduleAmbientLightning();
}

function scheduleAmbientLightning() {
  const delay = 4500 + Math.random() * 5500;
  lightningEngine.timerId = setTimeout(() => {
    triggerLightning(1);
    scheduleAmbientLightning();
  }, delay);
}

function triggerLightning(intensity = 1) {
  const canvas = lightningEngine.canvas;
  if (!canvas) return;

  const count = Math.min(3, Math.max(1, Math.round(intensity)));
  const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';

  lightningEngine.flashAlpha = Math.min(1, 0.45 * intensity);

  for (let k = 0; k < count; k++) {
    const startX = canvas.width * (0.15 + Math.random() * 0.7);
    const startY = 0;
    const segments = [];
    buildBoltSegments(startX, startY, canvas.height * (0.45 + Math.random() * 0.45), segments, 0);

    lightningEngine.bolts.push({
      segments,
      life: 1.0,
      decay: 0.035 + Math.random() * 0.025,
      color: isDark ? '#ffffff' : '#312e81',
      glowColor: isDark ? (Math.random() > 0.4 ? '#38bdf8' : '#a855f7') : '#6366f1',
      width: (2.2 + Math.random() * 1.5) * Math.min(intensity, 1.8)
    });
  }
}

function buildBoltSegments(x, y, maxDepth, segments, branchLevel) {
  let currX = x;
  let currY = y;
  const stepCount = 18 + Math.floor(Math.random() * 12);
  const stepY = maxDepth / stepCount;

  for (let i = 0; i < stepCount; i++) {
    const nextX = currX + (Math.random() - 0.5) * 55;
    const nextY = currY + stepY * (0.75 + Math.random() * 0.5);

    segments.push({
      x1: currX,
      y1: currY,
      x2: nextX,
      y2: nextY,
      branchLevel
    });


    if (branchLevel < 2 && Math.random() < 0.18) {
      const branchMaxDepth = maxDepth * (0.35 + Math.random() * 0.35);
      buildBoltSegments(nextX, nextY, branchMaxDepth, segments, branchLevel + 1);
    }

    currX = nextX;
    currY = nextY;
  }
}

function renderBolt(ctx, bolt) {
  const alpha = Math.max(0, Math.min(1, bolt.life));

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';


  ctx.shadowBlur = 18;
  ctx.shadowColor = bolt.glowColor;
  ctx.strokeStyle = bolt.glowColor;
  ctx.globalAlpha = alpha * 0.75;
  ctx.beginPath();
  for (const seg of bolt.segments) {
    const w = bolt.width / (seg.branchLevel + 1);
    ctx.lineWidth = w * 2;
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
  }
  ctx.stroke();


  ctx.shadowBlur = 4;
  ctx.shadowColor = '#ffffff';
  ctx.strokeStyle = bolt.color;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  for (const seg of bolt.segments) {
    const w = bolt.width / (seg.branchLevel + 1);
    ctx.lineWidth = Math.max(1, w * 0.85);
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
  }
  ctx.stroke();

  ctx.restore();
}
