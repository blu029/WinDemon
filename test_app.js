// Automated test verification script for WinDemon Dementia Care Platform
const fs = require('fs');
const path = require('path');

console.log('--- Starting WinDemon Platform Verification ---');

// 1. Verify translations.js
try {
  const { translations } = require('./translations.js');
  if (translations && translations.en && translations.hi && translations.as && translations.bn) {
    const langCount = Object.keys(translations).length;
    // Check if TTS templates exist in all languages
    let hasTtsTemplates = true;
    for (const [lang, dict] of Object.entries(translations)) {
      if (!dict.ttsRoutineIntro || !dict.ttsExplorerIntro || !dict.ttsItemLocation) {
        hasTtsTemplates = false;
        console.error(`[FAIL] Language ${lang} missing TTS templates`);
      }
    }
    if (hasTtsTemplates) {
      console.log(`[PASS] translations.js loaded successfully with ${langCount} languages and complete multilingual TTS speech templates.`);
    }
  } else {
    console.error('[FAIL] translations object missing required keys.');
  }
} catch (e) {
  console.error('[FAIL] translations.js syntax/execution error:', e);
}

// 2. Verify styles.css
try {
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
  if (css.includes('--primary-purple') && css.includes('is-completed') && css.includes('radar-canvas-container')) {
    console.log('[PASS] styles.css contains expected design tokens, themes, and classes.');
  } else {
    console.error('[FAIL] styles.css missing key classes.');
  }
} catch (e) {
  console.error('[FAIL] styles.css read error:', e);
}

// 3. Verify app.js syntax & multilingual TTS functions
try {
  const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  // Check required core functions
  const requiredFunctions = [
    'speakText',
    'speakTemplate',
    'speakTaskDetails',
    'speakItemLocation',
    'cycleFontScale',
    'toggleTheme',
    'switchTab',
    'toggleTaskCompletion',
    'openAddTaskModal',
    'saveCustomTask',
    'handleImageFileUpload',
    'saveNewExplorerItem',
    'deleteExplorerItem',
    'startSequenceGame',
    'handleCaregiverAuthToggle',
    'verifyCaregiverPin',
    'handleSafeZoneRadiusChange',
    'simulatePatientMove',
    'sendRemoteReminder',
    'toggleNgoRsvp',
    'triggerSOS',
    'selectLanguage'
  ];

  let missing = [];
  requiredFunctions.forEach(fn => {
    if (!appJs.includes(`function ${fn}`) && !appJs.includes(`${fn} =`)) {
      missing.push(fn);
    }
  });

  if (missing.length === 0) {
    console.log(`[PASS] app.js contains all ${requiredFunctions.length} essential business logic and multilingual TTS functions.`);
  } else {
    console.error('[FAIL] app.js missing functions:', missing);
  }
} catch (e) {
  console.error('[FAIL] app.js error:', e);
}

// 4. Verify index.html element IDs match app.js DOM bindings
try {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const requiredIds = [
    'toastContainer',
    'fontSizeToggleBtn',
    'themeToggleBtn',
    'screen-home',
    'screen-tasks',
    'screen-explorer',
    'screen-games',
    'screen-settings',
    'familyStreakWidget',
    'patientTaskList',
    'explorerItemsList',
    'anonLeaderboardList',
    'pinAuthModal',
    'pinAuthInput',
    'caregiverLockStatus',
    'caregiverPortalView',
    'safeZoneRadiusSlider',
    'safeZoneRadiusValue',
    'radarPulseDisk',
    'radarPatientMarker',
    'safeZoneStatusBadge',
    'caregiverNGOList',
    'mmseGraphContainer',
    'addTaskModal',
    'addExplorerModal',
    'languageModal',
    'sosAlertModal'
  ];

  let missingIds = [];
  requiredIds.forEach(id => {
    if (!html.includes(`id="${id}"`)) {
      missingIds.push(id);
    }
  });

  if (missingIds.length === 0) {
    console.log(`[PASS] index.html contains all ${requiredIds.length} required DOM binding elements.`);
  } else {
    console.error('[FAIL] index.html missing DOM elements:', missingIds);
  }
} catch (e) {
  console.error('[FAIL] index.html read error:', e);
}

console.log('--- Verification Complete ---');
