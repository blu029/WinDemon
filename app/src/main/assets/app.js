/**
 * WinDemon Dementia Care Platform - Application Logic
 * Modular State Management, 100% Multilingual UI & Speech, Safe Zone Simulation, Home Explorer, and PIN Portal
 */

// --- STATE MANAGEMENT & LOCAL STORAGE ---
const STORAGE_KEY = 'WINDEMON_APP_STATE_V2';

const DEFAULT_TASK_KEYS = {
  t1: { titleKey: 'taskMorningMedsTitle', noteKey: 'taskMorningMedsNote' },
  t2: { titleKey: 'taskWaterTitle', noteKey: 'taskWaterNote' },
  t3: { titleKey: 'taskLunchTitle', noteKey: 'taskLunchNote' },
  t4: { titleKey: 'taskAfternoonWaterTitle', noteKey: 'taskAfternoonWaterNote' },
  t5: { titleKey: 'taskBalconyTitle', noteKey: 'taskBalconyNote' },
  t6: { titleKey: 'taskEveningMedsTitle', noteKey: 'taskEveningMedsNote' }
};

const DEFAULT_STATE = {
  currentTab: 'home',
  language: 'en',
  theme: 'light', // 'light' | 'dark'
  fontScale: 'md', // 'sm' | 'md' | 'lg' | 'xl'
  caregiverPin: '1234',
  isCaregiverUnlocked: false,
  ttsEnabled: false, // off by default; user enables under Settings > Voice Feedback
  address: 'Home - Greenview Lane, Guwahati',
  profile: null,
  gameHistory: [],
  safeZone: {
    lat: 26.1445,
    lng: 91.7362,
    radius: 500, // in meters
    patientOffsetDistance: 120, // distance from center in meters
    patientOffsetAngle: 45, // in degrees
    isBreached: false
  },
  streak: {
    current: 12,
    lastActiveDate: '',
    history: {}
  },
  tasks: [
    { id: 't1', titleKey: 'taskMorningMedsTitle', noteKey: 'taskMorningMedsNote', category: 'meds', time: '08:30 AM', completed: true, completedAt: '08:32 AM' },
    { id: 't2', titleKey: 'taskWaterTitle', noteKey: 'taskWaterNote', category: 'water', time: '10:30 AM', completed: true, completedAt: '10:35 AM' },
    { id: 't3', titleKey: 'taskLunchTitle', noteKey: 'taskLunchNote', category: 'routine', time: '01:00 PM', completed: true, completedAt: '01:15 PM' },
    { id: 't4', titleKey: 'taskAfternoonWaterTitle', noteKey: 'taskAfternoonWaterNote', category: 'water', time: '03:30 PM', completed: false, completedAt: null },
    { id: 't5', titleKey: 'taskBalconyTitle', noteKey: 'taskBalconyNote', category: 'routine', time: '05:30 PM', completed: false, completedAt: null },
    { id: 't6', titleKey: 'taskEveningMedsTitle', noteKey: 'taskEveningMedsNote', category: 'meds', time: '08:00 PM', completed: false, completedAt: null }
  ],
  explorerItems: [
    {
      id: 'e1',
      titleKey: 'medBoxTitle',
      locKey: 'medBoxLoc',
      title: 'Medicine Box',
      location: 'On the bedroom nightstand next to the lamp',
      category: 'meds',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Default'
    },
    {
      id: 'e2',
      titleKey: 'waterPitcherTitle',
      locKey: 'waterPitcherLoc',
      title: 'Water Pitcher',
      location: 'On the kitchen dining counter next to the ceramic cups',
      category: 'water',
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Default'
    },
    {
      id: 'e3',
      titleKey: 'glassesTitle',
      locKey: 'glassesLoc',
      title: 'Reading Spectacles',
      location: 'In the brown leather case on the living room tea table',
      category: 'personal',
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Default'
    },
    {
      id: 'e4',
      titleKey: 'keysTitle',
      locKey: 'keysLoc',
      title: 'House Key Set',
      location: 'Hanging on the wall magnetic hook near the front foyer entrance',
      category: 'keys',
      image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Default'
    }
  ],
  leaderboard: [
    { rank: 1, name: 'SilverMind #402', score: 2850, badge: 'Grandmaster' },
    { rank: 2, name: 'You (Patient #123)', score: 2400, badge: 'Champion', isCurrent: true },
    { rank: 3, name: 'MindGlow #502', score: 2150, badge: 'Expert' },
    { rank: 4, name: 'CalmRiver #881', score: 1980, badge: 'Scholar' },
    { rank: 5, name: 'StarSeeker #771', score: 1720, badge: 'Explorer' }
  ],
  ngoEvents: [
    {
      id: 'ngo1',
      title: 'Dementia Caregivers Support Group',
      organizer: 'Alzheimer & Related Disorders Society (ARDSI)',
      time: 'Saturday, 4:00 PM - 5:30 PM',
      location: 'Guwahati Community Health Hall & Online Hybrid',
      description: 'Peer support group, emotional wellness sharing, and expert consultation on daily routines.',
      rsvpd: true,
      attendees: 24
    },
    {
      id: 'ngo2',
      title: 'Annual Memory Walk & Sensory Garden',
      organizer: 'North-East Cognitive Care Foundation',
      time: 'Sunday, 8:00 AM - 10:00 AM',
      location: 'Dighalipukhuri Park Walking Path',
      description: 'Gentle therapeutic morning walk designed with wheelchair accessibility and sensory flowers.',
      rsvpd: false,
      attendees: 58
    },
    {
      id: 'ngo3',
      title: 'Free Memory Screening & Nutrition Camp',
      organizer: 'Sanjeevani Elder Care NGO',
      time: 'Next Wednesday, 10:00 AM - 2:00 PM',
      location: 'Dispur Medical Center Annex',
      description: 'Comprehensive MMSE evaluation, hearing check, and personalized elder dietary guides.',
      rsvpd: false,
      attendees: 36
    }
  ]
};

// Global App State
let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const loaded = { ...DEFAULT_STATE, ...parsed };
      
      // Ensure tasks are mapped with translation keys if they are default IDs
      if (loaded.tasks && Array.isArray(loaded.tasks)) {
        loaded.tasks.forEach(t => {
          if (DEFAULT_TASK_KEYS[t.id]) {
            t.titleKey = DEFAULT_TASK_KEYS[t.id].titleKey;
            t.noteKey = DEFAULT_TASK_KEYS[t.id].noteKey;
          }
        });
      }

      return loaded;
    }
  } catch (e) {
    console.warn('Could not load state from localStorage:', e);
  }
  return { ...DEFAULT_STATE };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (typeof AndroidStreak !== 'undefined' && state.streak) {
      AndroidStreak.saveStreak(state.streak.current || 0, state.streak.lastActiveDate || '');
    }
  } catch (e) {
    console.warn('Could not save state to localStorage:', e);
  }
}

// --- DUOLINGO & GITHUB PATIENT STREAK WIDGETS LOGIC ---
function populateSimulatedStreakHistory() {
  // NOTE: this used to fabricate ~84 days of random "patient was active" history
  // and show it to the caregiver as real data. For a care app that's misleading,
  // not just cosmetic — a caregiver could believe the patient engaged on days
  // they didn't. We now start from a real, empty history and only ever add an
  // entry when logStreakActivity() records an actual session (see below).
  if (!state.streak) {
    state.streak = { current: 0, lastActiveDate: '', history: {} };
    saveState();
  }
}

function logStreakActivity() {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!state.streak) {
    state.streak = { current: 1, lastActiveDate: todayStr, history: {} };
  }
  if (!state.streak.history) {
    state.streak.history = {};
  }
  
  // Increment activity count for today
  state.streak.history[todayStr] = (state.streak.history[todayStr] || 0) + 1;
  
  // Update current streak
  if (state.streak.lastActiveDate !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (state.streak.lastActiveDate === yesterdayStr || state.streak.lastActiveDate === '') {
      state.streak.current += 1;
    } else {
      state.streak.current = 1; // Reset streak if missed a day
    }
    state.streak.lastActiveDate = todayStr;
  }
  
  saveState();
  
  // Update header counters
  const topStreak = document.getElementById('topStreakCounter');
  if (topStreak) topStreak.textContent = state.streak.current;
  
  renderStreakWidgets();
}

function renderStreakWidgets() {
  if (!state.streak) return;

  // Sync top header streak count
  const topStreak = document.getElementById('topStreakCounter');
  if (topStreak) topStreak.textContent = state.streak.current || 0;

  // Render Duolingo Streak Count
  const duoCount = document.getElementById('duoStreakCount');
  if (duoCount) duoCount.textContent = state.streak.current || 0;

  // Render Duolingo Week Calendar Checkboxes (Sun-Sat)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0: Sun, 1: Mon, etc.
  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - currentDayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isCompleted = state.streak.history && state.streak.history[dateStr] > 0;
    
    const dayEl = document.getElementById(`streakDay-${i}`);
    if (dayEl) {
      if (isCompleted) {
        dayEl.innerHTML = '<span class="material-symbols-outlined text-green-600 font-black text-lg fill-icon">check_circle</span>';
        dayEl.className = 'w-8 h-8 rounded-full border-2 border-green-500 bg-green-50 flex items-center justify-center';
      } else if (i === currentDayOfWeek) {
        dayEl.innerHTML = today.getDate();
        dayEl.className = 'w-8 h-8 rounded-full border-2 border-amber-500 text-amber-600 bg-amber-50 font-extrabold flex items-center justify-center animate-pulse';
      } else {
        dayEl.innerHTML = d.getDate();
        dayEl.className = 'w-8 h-8 rounded-full border-2 border-slate-300 text-slate-400 flex items-center justify-center text-xs';
      }
    }
  }

  // Render GitHub Activity Grid (7 rows x 12 columns)
  const gridBody = document.getElementById('githubGridBody');
  if (gridBody) {
    gridBody.innerHTML = '';
    const today = new Date();
    
    // Create 12 columns (weeks)
    for (let w = 0; w < 12; w++) {
      let colHtml = '<div class="flex flex-col gap-[3px]">';
      
      // 7 rows (Sun to Sat)
      for (let d = 0; d < 7; d++) {
        // Calculate the date for this cell
        const cellDate = new Date();
        const daysAgo = (11 - w) * 7 + (today.getDay() - d);
        cellDate.setDate(today.getDate() - daysAgo);
        const dateStr = cellDate.toISOString().split('T')[0];
        
        // Activity count
        const count = state.streak.history ? (state.streak.history[dateStr] || 0) : 0;
        
        // Color mapping based on intensity
        let colorClass = 'bg-slate-100 dark:bg-slate-900 border border-slate-200/20'; // 0
        if (count > 0) {
          if (count <= 2) {
            colorClass = 'bg-emerald-200 border border-emerald-300/30';
          } else if (count <= 4) {
            colorClass = 'bg-emerald-400 border border-emerald-500/30';
          } else {
            colorClass = 'bg-emerald-600 border border-emerald-700/30';
          }
        }
        
        colHtml += `<div class="w-[11px] h-[11px] rounded-sm ${colorClass}" title="${dateStr}: ${count} activities"></div>`;
      }
      colHtml += '</div>';
      gridBody.innerHTML += colHtml;
    }
  }
}

// --- PROFILE MANAGEMENT & MOCK DATABASE / DYNAMIC FORMS ---
function checkProfileStatus() {
  if (!state.profile) {
    // Show the profile creation modal (also populates Day/Month/Year selects
    // and hides the close button to force creation on first login)
    showProfileCreationModal();
  } else {
    // Show the close button for editing
    const closeBtn = document.getElementById('closeProfileCreationBtn');
    if (closeBtn) closeBtn.classList.remove('hidden');
    
    updateHeaderAndDetailsFromProfile();
  }
}

let tempAvatarBase64 = '';

function showProfileCreationModal() {
  const modal = document.getElementById('profileCreationModal');
  if (modal) {
    // Populate Day Selector dynamically if empty
    const daySelect = document.getElementById('profDobDay');
    if (daySelect && daySelect.options.length <= 1) {
      for (let d = 1; d <= 31; d++) {
        const val = d < 10 ? '0' + d : '' + d;
        daySelect.add(new Option(d, val));
      }
    }

    // Populate Month Selector dynamically if empty (defensive fallback - normally
    // hardcoded in index.html, but this guards against those options ever being
    // stripped, consistent with the Day/Year population pattern)
    const monthSelect = document.getElementById('profDobMonth');
    if (monthSelect && monthSelect.options.length <= 1) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      for (let m = 1; m <= 12; m++) {
        const val = m < 10 ? '0' + m : '' + m;
        monthSelect.add(new Option(monthNames[m - 1], val));
      }
    }

    // Populate Year Selector dynamically if empty (from current year down to 1910)
    const yearSelect = document.getElementById('profDobYear');
    if (yearSelect && yearSelect.options.length <= 1) {
      const currentYear = new Date().getFullYear();
      for (let y = currentYear; y >= 1910; y--) {
        yearSelect.add(new Option(y, y));
      }
    }

    // Populate form fields if editing existing profile
    if (state.profile) {
      document.getElementById('profName').value = state.profile.name || '';
      document.getElementById('profSex').value = state.profile.sex || 'Male';
      document.getElementById('profHeight').value = state.profile.height || '';
      document.getElementById('profWeight').value = state.profile.weight || '';
      document.getElementById('profBloodType').value = state.profile.bloodType || 'A+';
      document.getElementById('profDonor').value = state.profile.donor || 'No';
      document.getElementById('profAddress').value = state.profile.address || '';
      document.getElementById('profEmergencyName').value = state.profile.emergencyName || '';
      document.getElementById('profEmergencyPhone').value = state.profile.emergencyPhone || '';
      document.getElementById('profRemarks').value = state.profile.remarks || '';
      
      // Load Date of Birth to selectors
      const dob = state.profile.dob || '';
      document.getElementById('profDob').value = dob;
      if (dob) {
        const parts = dob.split('-');
        if (parts.length === 3) {
          document.getElementById('profDobYear').value = parts[0];
          document.getElementById('profDobMonth').value = parts[1];
          document.getElementById('profDobDay').value = parts[2];
        }
      }

      // Load avatar preview
      const preview = document.getElementById('profAvatarPreview');
      const placeholder = document.getElementById('profAvatarPlaceholder');
      if (state.profile.avatar) {
        tempAvatarBase64 = state.profile.avatar;
        if (preview) {
          preview.src = state.profile.avatar;
          preview.classList.remove('hidden');
        }
        if (placeholder) placeholder.classList.add('hidden');
      } else {
        tempAvatarBase64 = '';
        if (preview) preview.classList.add('hidden');
        if (placeholder) placeholder.classList.remove('hidden');
      }
      
      const closeBtn = document.getElementById('closeProfileCreationBtn');
      if (closeBtn) closeBtn.classList.remove('hidden');
    } else {
      tempAvatarBase64 = '';
      const preview = document.getElementById('profAvatarPreview');
      const placeholder = document.getElementById('profAvatarPlaceholder');
      if (preview) preview.classList.add('hidden');
      if (placeholder) placeholder.classList.remove('hidden');
      
      const closeBtn = document.getElementById('closeProfileCreationBtn');
      if (closeBtn) closeBtn.classList.add('hidden');
    }
    modal.classList.remove('hidden');
  }
}

function handleAvatarSelection(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    tempAvatarBase64 = e.target.result;
    const preview = document.getElementById('profAvatarPreview');
    const placeholder = document.getElementById('profAvatarPlaceholder');
    if (preview) {
      preview.src = tempAvatarBase64;
      preview.classList.remove('hidden');
    }
    if (placeholder) placeholder.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function updateHiddenDob() {
  const y = document.getElementById('profDobYear').value;
  const m = document.getElementById('profDobMonth').value;
  const d = document.getElementById('profDobDay').value;
  const hiddenInput = document.getElementById('profDob');
  if (y && m && d) {
    hiddenInput.value = `${y}-${m}-${d}`;
  } else {
    hiddenInput.value = '';
  }
}

function closeProfileCreationModal() {
  // Only allow closing if a profile already exists
  if (!state.profile) {
    showToast(t('profileCreationRequired'), "error");
    return;
  }
  const modal = document.getElementById('profileCreationModal');
  if (modal) modal.classList.add('hidden');
}

function saveProfile(event) {
  if (event) event.preventDefault();
  
  const name = document.getElementById('profName').value.trim();
  const dob = document.getElementById('profDob').value;
  const sex = document.getElementById('profSex').value;
  const height = parseFloat(document.getElementById('profHeight').value);
  const weight = parseFloat(document.getElementById('profWeight').value);
  const bloodType = document.getElementById('profBloodType').value;
  const donor = document.getElementById('profDonor').value;
  const address = document.getElementById('profAddress').value.trim();
  const emergencyName = document.getElementById('profEmergencyName').value.trim();
  const emergencyPhone = document.getElementById('profEmergencyPhone').value.trim();
  const remarks = document.getElementById('profRemarks').value.trim();

  if (!name || !dob || !sex || !height || !weight || !address || !emergencyName || !emergencyPhone) {
    showToast(t('fillRequiredFields'), "error");
    return;
  }

  state.profile = {
    name, dob, sex, height, weight, bloodType, donor, address, emergencyName, emergencyPhone, remarks,
    avatar: tempAvatarBase64
  };
  
  // Sync address to safeZone settings
  state.address = address;
  
  saveState();
  updateHeaderAndDetailsFromProfile();
  
  // Trigger location fetching
  fetchDeviceLocation();
  
  // Hide modal
  const modal = document.getElementById('profileCreationModal');
  if (modal) modal.classList.add('hidden');
  
  showToast(t('profileSaved'), "verified");
  playSuccessChime();
}

function updateHeaderAndDetailsFromProfile() {
  if (!state.profile) return;
  
  // Get initials (first letter of first and last name if possible)
  const nameParts = state.profile.name.trim().split(/\s+/);
  let initials = nameParts[0].charAt(0).toUpperCase();
  if (nameParts.length > 1) {
    initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  } else {
    initials += nameParts[0].charAt(Math.min(1, nameParts[0].length - 1)).toUpperCase();
  }
  
  // Update header initials
  const headerInitials = document.getElementById('topAvatarInitials');
  if (headerInitials) headerInitials.textContent = initials;
  
  const detailAvatar = document.getElementById('detailAvatarInitials');
  if (detailAvatar) detailAvatar.textContent = initials;

  // Handle Avatar Images
  const topAvatarImg = document.getElementById('topAvatarImg');
  const detailAvatarImg = document.getElementById('detailAvatarImg');
  
  if (state.profile.avatar) {
    if (topAvatarImg) {
      topAvatarImg.src = state.profile.avatar;
      topAvatarImg.classList.remove('hidden');
    }
    if (headerInitials) headerInitials.classList.add('hidden');
    
    if (detailAvatarImg) {
      detailAvatarImg.src = state.profile.avatar;
      detailAvatarImg.classList.remove('hidden');
    }
    if (detailAvatar) detailAvatar.classList.add('hidden');
  } else {
    if (topAvatarImg) topAvatarImg.classList.add('hidden');
    if (headerInitials) headerInitials.classList.remove('hidden');
    
    if (detailAvatarImg) detailAvatarImg.classList.add('hidden');
    if (detailAvatar) detailAvatar.classList.remove('hidden');
  }
  
  // Update address at top
  const topLocation = document.getElementById('topLocationText');
  if (topLocation) topLocation.textContent = state.profile.address;

  // Update detail modal values
  const dName = document.getElementById('detailProfName');
  if (dName) dName.textContent = state.profile.name;
  
  // Age calculation
  let age = "--";
  if (state.profile.dob) {
    const dobDate = new Date(state.profile.dob);
    const ageDifMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(ageDifMs); 
    age = Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  
  const dAgeSex = document.getElementById('detailProfAgeSex');
  if (dAgeSex) dAgeSex.textContent = `Age: ${age} | Sex: ${state.profile.sex}`;
  
  const dHeight = document.getElementById('detailProfHeight');
  if (dHeight) dHeight.textContent = `${state.profile.height} cm`;
  
  const dWeight = document.getElementById('detailProfWeight');
  if (dWeight) dWeight.textContent = `${state.profile.weight} kg`;
  
  // BMI calculation
  let bmi = "--";
  if (state.profile.height && state.profile.weight) {
    const heightM = state.profile.height / 100;
    bmi = (state.profile.weight / (heightM * heightM)).toFixed(1);
  }
  const dBmi = document.getElementById('detailProfBmi');
  if (dBmi) dBmi.textContent = bmi;
  
  const dAddress = document.getElementById('detailProfAddress');
  if (dAddress) dAddress.textContent = state.profile.address;
  
  const dBloodType = document.getElementById('detailProfBloodType');
  if (dBloodType) dBloodType.textContent = state.profile.bloodType;
  
  const dDonor = document.getElementById('detailProfDonor');
  if (dDonor) dDonor.textContent = state.profile.donor;
  
  const dRemarks = document.getElementById('detailProfRemarks');
  if (dRemarks) dRemarks.textContent = state.profile.remarks || 'None';
  
  const dEmergName = document.getElementById('detailProfEmergencyName');
  if (dEmergName) dEmergName.textContent = state.profile.emergencyName;
  
  const dEmergPhone = document.getElementById('detailProfEmergencyPhone');
  if (dEmergPhone) dEmergPhone.textContent = state.profile.emergencyPhone;
  
  const dEmergCall = document.getElementById('detailProfEmergencyCall');
  if (dEmergCall) dEmergCall.href = `tel:${state.profile.emergencyPhone}`;
}

function openProfileDetailModal() {
  if (!state.profile) {
    showProfileCreationModal();
    return;
  }
  updateHeaderAndDetailsFromProfile();
  const modal = document.getElementById('profileDetailModal');
  if (modal) modal.classList.remove('hidden');
}

function closeProfileDetailModal() {
  const modal = document.getElementById('profileDetailModal');
  if (modal) modal.classList.add('hidden');
}

function editProfileFromDetail() {
  closeProfileDetailModal();
  showProfileCreationModal();
}

// CAREGIVER PORTAL SECURITY PIN CONFIGURATION
function changeCaregiverPin() {
  const newPinInput = document.getElementById('newCaregiverPin');
  const confirmPinInput = document.getElementById('confirmCaregiverPin');
  
  const newPin = newPinInput ? newPinInput.value.trim() : '';
  const confirmPin = confirmPinInput ? confirmPinInput.value.trim() : '';
  
  if (!newPin || newPin.length < 4) {
    showToast(t('pinLengthError'), "error");
    return;
  }
  
  if (newPin !== confirmPin) {
    showToast(t('pinsDoNotMatch'), "error");
    return;
  }
  
  state.caregiverPin = newPin;
  saveState();
  
  if (newPinInput) newPinInput.value = '';
  if (confirmPinInput) confirmPinInput.value = '';
  
  showToast(t('pinUpdated'), "verified");
  playSuccessChime();
}

// --- TEXT-TO-SPEECH (TTS) ENGINE ---
const synth = typeof window !== 'undefined' ? (window.speechSynthesis || null) : null;
let cachedVoices = [];

function loadVoices() {
  if (synth) {
    cachedVoices = synth.getVoices() || [];
  }
}

if (synth) {
  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
}

function speakText(text, explicitLang) {
  if (!state.ttsEnabled) return;
  if (!synth) return; // silently skip — mobile may not support it
  if (!text || text.trim() === '') return;

  synth.cancel();

  const currentLang = explicitLang || state.language || 'en';

  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    as: 'as-IN',
    bodo: 'hi-IN',
    garo: 'en-IN',
    karbi: 'en-IN',
    khasi: 'en-IN',
    kokborok: 'bn-IN',
    meitei: 'en-IN',
    mishing: 'as-IN',
    mizo: 'en-IN',
    nepali: 'ne-NP',
    sadri: 'hi-IN'
  };

  const targetLangCode = langMap[currentLang] || 'en-IN';

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLangCode;
  utterance.rate = 0.88;
  utterance.pitch = 1.0;

  if (cachedVoices.length === 0) loadVoices();

  // Try exact lang match first, then prefix match, then en-IN fallback
  const matchedVoice =
    cachedVoices.find(v => v.lang.toLowerCase() === targetLangCode.toLowerCase()) ||
    cachedVoices.find(v => v.lang.toLowerCase().startsWith(targetLangCode.split('-')[0])) ||
    cachedVoices.find(v => v.lang.toLowerCase().startsWith('en'));

  if (matchedVoice) utterance.voice = matchedVoice;

  synth.speak(utterance);
}

function toggleTTS() {
  state.ttsEnabled = !state.ttsEnabled;
  saveState();
  updateTTSToggleUI();
  if (state.ttsEnabled) {
    speakText('Voice feedback on', state.language);
  }
}

function updateTTSToggleUI() {
  const btn = document.getElementById('ttsToggleBtn');
  const thumb = document.getElementById('ttsToggleThumb');
  if (!btn || !thumb) return;
  if (state.ttsEnabled) {
    btn.classList.remove('bg-slate-300', 'dark:bg-slate-700');
    btn.classList.add('bg-[var(--primary-purple)]');
    thumb.style.transform = 'translateX(20px)';
  } else {
    btn.classList.add('bg-slate-300', 'dark:bg-slate-700');
    btn.classList.remove('bg-[var(--primary-purple)]');
    thumb.style.transform = 'translateX(0)';
  }
}

function speakTemplate(templateKey, params = {}, explicitLang = null) {
  if (!state.ttsEnabled) return;
  const lang = explicitLang || state.language || 'en';
  let template = '';

  if (typeof translations !== 'undefined' && translations[lang] && translations[lang][templateKey]) {
    template = translations[lang][templateKey];
  } else if (typeof translations !== 'undefined' && translations.en && translations.en[templateKey]) {
    template = translations.en[templateKey];
  } else {
    template = templateKey;
  }

  let interpolated = template;
  for (const [k, v] of Object.entries(params)) {
    interpolated = interpolated.replace(new RegExp(`\\{${k}\\}`, 'g'), v || '');
  }

  speakText(interpolated, lang);
}

// --- AUDIO FEEDBACK / WEB AUDIO SYNTHESIZER ---
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // fallback
  }
}

function playSuccessChime() {
  playTone(523.25, 'sine', 0.15);
  setTimeout(() => playTone(659.25, 'sine', 0.15), 120);
  setTimeout(() => playTone(783.99, 'sine', 0.25), 240);
}

function playAlertChime() {
  playTone(440, 'triangle', 0.15);
  setTimeout(() => playTone(880, 'triangle', 0.25), 180);
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, icon = 'info') {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined fill-icon text-primary-purple">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// --- TRANSLATION HELPER ---
function t(key) {
  const lang = state.language || 'en';
  if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  if (typeof translations !== 'undefined' && translations.en && translations.en[key]) {
    return translations.en[key];
  }
  return key;
}

// Helper to get localized task title and note
function getTaskDisplay(task) {
  const title = task.titleKey && t(task.titleKey) !== task.titleKey ? t(task.titleKey) : (task.title || task.titleKey);
  const note = task.noteKey && t(task.noteKey) !== task.noteKey ? t(task.noteKey) : (task.note || task.noteKey || '');
  return { title, note };
}

// Helper to get localized item title and location
function getItemDisplay(item) {
  const title = item.titleKey && t(item.titleKey) !== item.titleKey ? t(item.titleKey) : (item.title || item.titleKey);
  const location = item.locKey && t(item.locKey) !== item.locKey ? t(item.locKey) : (item.location || item.locKey);
  return { title, location };
}

// --- DYNAMIC FULL-APP INTERNATIONALIZATION (i18n) ---
function updateDOMTranslations() {
  if (typeof document === 'undefined') return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      el.setAttribute('placeholder', t(key));
    }
  });
}

// --- UI THEME & ACCESSIBILITY CONTROLS ---
function initAccessibility() {
  applyTheme(state.theme);
  applyFontScale(state.fontScale);
  updateDOMTranslations();
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', state.language || 'en');
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const themeIcon = document.getElementById('themeToggleIcon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }
  saveState();
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(newTheme === 'dark' ? t('darkMode') : t('lightMode'), 'palette');
}

function applyFontScale(scale) {
  state.fontScale = scale;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg', 'font-scale-xl');
    document.documentElement.classList.add(`font-scale-${scale}`);

    const fontLabel = document.getElementById('fontSizeBtnLabel');
    if (fontLabel) {
      if (scale === 'sm') fontLabel.innerHTML = 'A<sub class="text-[10px]">-</sub>';
      else if (scale === 'md') fontLabel.innerHTML = 'A';
      else if (scale === 'lg') fontLabel.innerHTML = 'A<sup class="text-[10px]">+</sup>';
      else if (scale === 'xl') fontLabel.innerHTML = 'A<sup class="text-[12px] font-bold">++</sup>';
    }
  }
  saveState();
}

function cycleFontScale() {
  const scales = ['sm', 'md', 'lg', 'xl'];
  const currentIndex = scales.indexOf(state.fontScale);
  const nextScale = scales[(currentIndex + 1) % scales.length];
  applyFontScale(nextScale);
  showToast(`${t('fontSizeScale')}: ${nextScale.toUpperCase()}`, 'format_size');
}

// --- TAB NAVIGATION ---
function switchTab(tabId) {
  state.currentTab = tabId;
  saveState();

  if (typeof document === 'undefined') return;

  document.querySelectorAll('.app-screen').forEach(screen => {
    screen.classList.add('hidden');
  });

  const targetScreen = document.getElementById(`screen-${tabId}`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }

  // Update Nav Items
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  updateDOMTranslations();

  // Re-render specific tab contents
  if (tabId === 'home') renderHomeScreen();
  if (tabId === 'tasks') renderTasksScreen();
  if (tabId === 'explorer') renderExplorerScreen();
  if (tabId === 'games') renderGamesScreen();
  if (tabId === 'settings') renderSettingsScreen();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Android physical back button handler — keeps navigation within the SPA
function handleAndroidBack() {
  // 1. Close any open modal first
  const modals = ['languageModal', 'pinAuthModal', 'sosAlertModal', 'profileCreationModal', 'profileDetailModal', 'addTaskModal', 'addExplorerModal', 'mockGameModal'];
  for (const id of modals) {
    const m = document.getElementById(id);
    if (m && !m.classList.contains('hidden')) {
      m.classList.add('hidden');
      return;
    }
  }

  // 2. Exit active sub-game back to games list
  if (activeSubGameId) {
    exitGame();
    return;
  }

  // 3. If on a non-home tab, go home
  if (state.currentTab && state.currentTab !== 'home') {
    switchTab('home');
    return;
  }

  // 4. If already on home — minimize the app (Android handles this natively)
  if (typeof window.AndroidStreak !== 'undefined') {
    // We're in Android; let the system handle it (moves app to background)
    // We can't call super.onBackPressed() from JS, so we do nothing here
    // MainActivity.java will call finish() only if evaluateJavascript returns nothing
  }
}



// 1. HOME SCREEN
function renderHomeScreen() {
  const completedCount = state.tasks.filter(t => t.completed).length;
  const totalCount = state.tasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const pendingCount = totalCount - completedCount;
  const pendingLabel = document.getElementById('homePendingTasksCount');
  if (pendingLabel) {
    pendingLabel.textContent = `${pendingCount} ${t('tasksRemaining')}`;
  }

  // Next Upcoming Task Card
  const nextTask = state.tasks.find(t => !t.completed) || state.tasks[0];
  const nextTaskCard = document.getElementById('homeNextTaskContainer');
  if (nextTaskCard && nextTask) {
    const td = getTaskDisplay(nextTask);
    nextTaskCard.innerHTML = `
      <div class="pp-card flex items-center justify-between border-l-4 border-l-[#5f259f]">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-[var(--primary-purple-bg)] text-[var(--primary-purple)] flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-2xl fill-icon">${getCategoryIcon(nextTask.category)}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--primary-purple)]">${nextTask.time}</span>
              <button onclick="speakTaskDetails('${nextTask.id}')" class="text-[var(--text-muted)] hover:text-[var(--primary-purple)]" aria-label="Listen">
                <span class="material-symbols-outlined text-[18px]">volume_up</span>
              </button>
            </div>
            <h4 class="font-bold text-base text-[var(--text-main)]">${td.title}</h4>
            <p class="text-xs text-[var(--text-muted)]">${td.note || ''}</p>
          </div>
        </div>
        ${
          nextTask.completed
            ? `<div class="px-3 py-1.5 rounded-full bg-[var(--success-green-bg)] text-[var(--success-green)] text-xs font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] fill-icon">check_circle</span> ${t('done')}
               </div>`
            : `<button onclick="toggleTaskCompletion('${nextTask.id}')" class="px-3.5 py-2 rounded-xl bg-[var(--primary-purple)] text-white text-xs font-bold active:scale-95 transition-transform flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px]">check</span> ${t('markDone')}
               </button>`
        }
      </div>
    `;
  }

  // Render Duolingo & GitHub style Streak widgets
  renderStreakWidgets();

  // Quick Home Explorer Preview Tiles (Localized!)
  const previewBox = document.getElementById('homeExplorerQuickPreview');
  if (previewBox) {
    const item1 = state.explorerItems[0] || DEFAULT_STATE.explorerItems[0];
    const item2 = state.explorerItems[1] || DEFAULT_STATE.explorerItems[1];

    const d1 = getItemDisplay(item1);
    const d2 = getItemDisplay(item2);

    previewBox.innerHTML = `
      <div onclick="speakItemLocation('${item1.id}')" 
           class="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform">
        <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-[var(--primary-purple)] flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-xl fill-icon">${getCategoryIcon(item1.category)}</span>
        </div>
        <div class="overflow-hidden">
          <h5 class="text-xs font-bold text-[var(--text-main)] truncate">${d1.title}</h5>
          <span class="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px]">volume_up</span> ${d1.location}</span>
        </div>
      </div>

      <div onclick="speakItemLocation('${item2.id}')" 
           class="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform">
        <div class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-[var(--secondary-teal)] flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-xl fill-icon">${getCategoryIcon(item2.category)}</span>
        </div>
        <div class="overflow-hidden">
          <h5 class="text-xs font-bold text-[var(--text-main)] truncate">${d2.title}</h5>
          <span class="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px]">volume_up</span> ${d2.location}</span>
        </div>
      </div>
    `;
  }
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'meds': return 'medication';
    case 'water': return 'water_drop';
    case 'routine': return 'schedule';
    case 'keys': return 'key';
    case 'personal': return 'visibility';
    default: return 'task_alt';
  }
}

// 2. TASKS SCREEN (No strikethroughs, gentle positive badges, 100% localized task titles & notes)
function renderTasksScreen() {
  const taskList = document.getElementById('patientTaskList');
  if (!taskList) return;

  const completedCount = state.tasks.filter(t => t.completed).length;
  const totalCount = state.tasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const taskStats = document.getElementById('taskProgressStats');
  if (taskStats) {
    taskStats.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-semibold text-[var(--text-muted)]">${t('todayCompletion')}: ${completedCount}/${totalCount} (${pct}%)</span>
        <span class="text-sm font-bold text-[var(--primary-purple)]">${pct}%</span>
      </div>
      <div class="w-full h-2.5 bg-[var(--border-color)] rounded-full overflow-hidden">
        <div class="h-full bg-[var(--primary-purple)] rounded-full transition-all duration-300" style="width: ${pct}%"></div>
      </div>
    `;
  }

  taskList.innerHTML = state.tasks.map(task => {
    const td = getTaskDisplay(task);
    return `
      <div class="task-item ${task.completed ? 'is-completed' : ''}" id="task-card-${task.id}">
        <div class="flex items-center gap-3.5 flex-1 pr-2">
          <button onclick="speakTaskDetails('${task.id}')" 
                  class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${task.completed ? 'bg-[var(--success-green-bg)] text-[var(--success-green)]' : 'bg-[var(--surface-bg)] text-[var(--text-muted)]'} hover:opacity-80"
                  aria-label="Speak task in chosen language">
            <span class="material-symbols-outlined text-[20px]">volume_up</span>
          </button>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-[var(--text-muted)]">${task.time}</span>
              ${task.completed && task.completedAt ? `<span class="text-[11px] font-bold text-[var(--success-green)]">• ${t('completed')} (${task.completedAt})</span>` : ''}
            </div>
            <h4 class="task-title text-base font-medium">${td.title}</h4>
            ${td.note ? `<p class="text-xs text-[var(--text-muted)] mt-0.5">${td.note}</p>` : ''}
          </div>
        </div>
        <button onclick="toggleTaskCompletion('${task.id}')" 
                class="task-checkbox-btn"
                aria-label="${task.completed ? 'Mark uncompleted' : 'Mark completed'}">
          <span class="material-symbols-outlined text-[22px] ${task.completed ? 'fill-icon' : ''}">
            ${task.completed ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </button>
      </div>
    `;
  }).join('');
}

function speakTaskDetails(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  const td = getTaskDisplay(task);

  if (task.completed) {
    speakTemplate('ttsTaskDone', { title: td.title });
  } else {
    speakTemplate('ttsTaskPending', {
      title: td.title,
      time: task.time,
      note: td.note || ''
    });
  }
}

function toggleTaskCompletion(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  if (task.completed) {
    const now = new Date();
    task.completedAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    playSuccessChime();
    logStreakActivity();
    
    const td = getTaskDisplay(task);
    const greatJobPhrase = t('greatJob');
    speakText(`${greatJobPhrase} ${td.title}`, state.language);
    showToast(`${greatJobPhrase} ${td.title}`, 'check_circle');
  } else {
    task.completedAt = null;
  }

  saveState();
  renderTasksScreen();
  renderHomeScreen();
}

function openAddTaskModal() {
  const modal = document.getElementById('addTaskModal');
  if (modal) modal.classList.remove('hidden');
  const input = document.getElementById('customTaskTitleInput');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 150);
  }
}

function closeAddTaskModal() {
  const modal = document.getElementById('addTaskModal');
  if (modal) modal.classList.add('hidden');
}

function saveCustomTask() {
  const titleInput = document.getElementById('customTaskTitleInput');
  const timeInput = document.getElementById('customTaskTimeInput');
  const noteInput = document.getElementById('customTaskNoteInput');
  const categorySelect = document.getElementById('customTaskCategorySelect');

  const title = titleInput ? titleInput.value.trim() : '';
  if (!title) {
    showToast(t('enterTaskName'), 'error');
    return;
  }

  const timeVal = timeInput && timeInput.value ? formatTimeDisplay(timeInput.value) : 'Anytime';
  const noteVal = noteInput ? noteInput.value.trim() : '';
  const catVal = categorySelect ? categorySelect.value : 'routine';

  const newTask = {
    id: 'task_' + Date.now(),
    title: title,
    time: timeVal,
    category: catVal,
    completed: false,
    completedAt: null,
    note: noteVal
  };

  state.tasks.push(newTask);
  saveState();
  closeAddTaskModal();
  renderTasksScreen();
  renderHomeScreen();
  
  speakText(`${newTask.title}`, state.language);
  showToast(`${t('addedTask')} ${newTask.title}`, 'add_task');
}

function formatTimeDisplay(timeStr) {
  try {
    const [h, m] = timeStr.split(':');
    const d = new Date();
    d.setHours(parseInt(h, 10));
    d.setMinutes(parseInt(m, 10));
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return timeStr;
  }
}

// 3. HOME EXPLORER (Visual Item Locator + Image Upload + Multi-Language TTS)
function renderExplorerScreen() {
  const container = document.getElementById('explorerItemsList');
  if (!container) return;

  container.innerHTML = state.explorerItems.map(item => {
    const d = getItemDisplay(item);
    return `
      <div class="pp-card flex flex-col gap-3 overflow-hidden">
        <div class="relative w-full h-48 rounded-xl overflow-hidden bg-[var(--surface-bg)] border border-[var(--border-color)]">
          <img src="${item.image}" alt="${d.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'" />
          <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px] fill-icon">${getCategoryIcon(item.category)}</span>
            ${d.title}
          </div>
        </div>
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="font-bold text-lg text-[var(--text-main)]">${d.title}</h4>
            <p class="text-sm text-[var(--text-muted)] mt-1 flex items-start gap-1">
              <span class="material-symbols-outlined text-[18px] text-[var(--primary-purple)] shrink-0 mt-0.5">place</span>
              <span>${d.location}</span>
            </p>
          </div>
        </div>
        <div class="pt-2 flex items-center gap-2">
          <button onclick="speakItemLocation('${item.id}')" class="flex-1 py-2.5 px-4 rounded-xl bg-[var(--primary-purple)] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform">
            <span class="material-symbols-outlined text-[20px]">volume_up</span>
            <span>${t('speakLocation')}</span>
          </button>
          ${state.isCaregiverUnlocked ? `
            <button onclick="deleteExplorerItem('${item.id}')" class="p-2.5 rounded-xl border border-[var(--danger-red)] text-[var(--danger-red)] hover:bg-[var(--danger-red-bg)]" aria-label="Delete item">
              <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function speakItemLocation(itemId) {
  const item = state.explorerItems.find(i => i.id === itemId);
  if (!item) return;

  const d = getItemDisplay(item);

  speakTemplate('ttsItemLocation', {
    item: d.title,
    location: d.location
  });
  showToast(`${d.title}: ${d.location}`, 'record_voice_over');
}

function openAddExplorerModal() {
  const modal = document.getElementById('addExplorerModal');
  if (modal) modal.classList.remove('hidden');
  const titleInput = document.getElementById('explorerItemTitle');
  const locationInput = document.getElementById('explorerItemLocation');
  const previewImg = document.getElementById('uploadedImagePreview');
  const previewContainer = document.getElementById('uploadedImagePreviewContainer');
  
  if (titleInput) titleInput.value = '';
  if (locationInput) locationInput.value = '';
  if (previewContainer) previewContainer.classList.add('hidden');
  if (previewImg) previewImg.src = '';
  tempUploadedImageBase64 = null;
}

function closeAddExplorerModal() {
  const modal = document.getElementById('addExplorerModal');
  if (modal) modal.classList.add('hidden');
}

let tempUploadedImageBase64 = null;

function handleImageFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    tempUploadedImageBase64 = e.target.result;
    const previewContainer = document.getElementById('uploadedImagePreviewContainer');
    const previewImg = document.getElementById('uploadedImagePreview');
    if (previewContainer && previewImg) {
      previewImg.src = tempUploadedImageBase64;
      previewContainer.classList.remove('hidden');
    }
  };
  reader.readAsDataURL(file);
}

function saveNewExplorerItem() {
  const titleInput = document.getElementById('explorerItemTitle');
  const locationInput = document.getElementById('explorerItemLocation');
  const categorySelect = document.getElementById('explorerItemCategory');

  const title = titleInput ? titleInput.value.trim() : '';
  const loc = locationInput ? locationInput.value.trim() : '';
  const cat = categorySelect ? categorySelect.value : 'personal';

  if (!title || !loc) {
    showToast(t('provideItemDetails'), 'error');
    return;
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
  const finalImage = tempUploadedImageBase64 || fallbackImage;

  const newItem = {
    id: 'exp_' + Date.now(),
    title: title,
    location: loc,
    category: cat,
    image: finalImage,
    timestamp: 'Added on ' + new Date().toLocaleDateString()
  };

  state.explorerItems.unshift(newItem);
  saveState();
  closeAddExplorerModal();
  renderExplorerScreen();
  renderHomeScreen();
  
  speakTemplate('ttsItemLocation', { item: newItem.title, location: newItem.location });
  showToast(`${t('itemSaved')} ${newItem.title}`, 'photo_camera');
}

function deleteExplorerItem(itemId) {
  state.explorerItems = state.explorerItems.filter(i => i.id !== itemId);
  saveState();
  renderExplorerScreen();
  renderHomeScreen();
  showToast(t('itemRemoved'), 'delete');
}

// 4. COGNITIVE GAMES & LOCAL ANONYMOUS LEADERBOARD
let simonSequence = [];
let playerSequence = [];
let simonRound = 0;
let isSimonPlaying = false;
let isPlayerTurn = false;

// Global AI Difficulty Engine state
if (state.aiAdaptiveMode === undefined) state.aiAdaptiveMode = true;
if (state.manualDifficulty === undefined) state.manualDifficulty = 'Medium';

function getAdaptedDifficulty() {
  if (!state.aiAdaptiveMode) {
    return state.manualDifficulty;
  }
  
  // Calculate average game performance
  const history = state.gameHistory || [];
  if (history.length === 0) {
    return 'Medium';
  }
  
  const last5 = history.slice(-5);
  const avgScore = last5.reduce((sum, item) => sum + item.score, 0) / last5.length;
  
  if (avgScore >= 1200) {
    return 'Hard';
  } else if (avgScore >= 400) {
    return 'Medium';
  } else {
    return 'Easy';
  }
}

function toggleAIAdaptiveMode() {
  state.aiAdaptiveMode = !state.aiAdaptiveMode;
  saveState();
  updateAIDifficultyDisplay();
}

function cycleManualDifficulty() {
  const levels = ['Easy', 'Medium', 'Hard'];
  const nextIdx = (levels.indexOf(state.manualDifficulty) + 1) % 3;
  state.manualDifficulty = levels[nextIdx];
  saveState();
  updateAIDifficultyDisplay();
}

function updateAIDifficultyDisplay() {
  const aiIndexEl = document.getElementById('aiCognitiveIndex');
  const aiLevelEl = document.getElementById('aiAdaptedLevel');
  const aiToggleEl = document.getElementById('aiToggleBtn');
  const manualEl = document.getElementById('manualDiffBtn');

  // Dynamic MMSE calculation
  const history = state.gameHistory || [];
  let mmse = 28.0;
  if (history.length > 0) {
    const avg = history.slice(-5).reduce((sum, h) => sum + h.score, 0) / Math.min(5, history.length);
    mmse = Math.min(30, 18 + (avg / 150));
  }
  if (aiIndexEl) aiIndexEl.textContent = `${mmse.toFixed(1)} / 30 MMSE`;

  const adapted = getAdaptedDifficulty();
  if (aiLevelEl) aiLevelEl.textContent = `${adapted} ${state.aiAdaptiveMode ? '(Auto)' : '(Manual)'}`;

  if (aiToggleEl) {
    if (state.aiAdaptiveMode) {
      aiToggleEl.textContent = 'Auto-Adaptive';
      aiToggleEl.className = 'px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold active:scale-95 transition-transform';
      if (manualEl) manualEl.classList.add('hidden');
    } else {
      aiToggleEl.textContent = 'Manual';
      aiToggleEl.className = 'px-3 py-1 rounded-full bg-slate-400 text-white font-extrabold active:scale-95 transition-transform';
      if (manualEl) {
        manualEl.classList.remove('hidden');
        manualEl.textContent = state.manualDifficulty;
      }
    }
  }
}

function renderGamesScreen() {
  updateAIDifficultyDisplay();
  renderLeaderboard();
}

// Sub-screen navigation helpers
let activeSubGameId = null;

function launchSubGame(gameId) {
  document.getElementById('screen-games').classList.add('hidden');
  
  const targetScreen = document.getElementById(`screen-game-${gameId}`);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    activeSubGameId = gameId;
  }
  
  const diff = getAdaptedDifficulty();
  if (gameId === 'memory-match') {
    speakTemplate('ttsMemoryMatchIntro');
    const badge = document.getElementById('memoryDifficultyBadge');
    if (badge) badge.textContent = diff;
  } else if (gameId === 'sequence-recall') {
    speakTemplate('ttsSequenceRecallIntro');
    const badge = document.getElementById('simonDifficultyBadge');
    if (badge) badge.textContent = diff;
  } else if (gameId === 'stroop-test') {
    speakTemplate('ttsStroopTestIntro');
    const badge = document.getElementById('stroopDifficultyBadge');
    if (badge) badge.textContent = diff;
  } else if (gameId === 'word-search') {
    speakTemplate('ttsWordSearchIntro');
  } else if (gameId === 'tangram') {
    speakTemplate('ttsTangramIntro');
  } else if (gameId === 'sudoku') {
    speakTemplate('ttsSudokuIntro');
  } else if (gameId === 'hidden-objects') {
    speakTemplate('ttsHiddenObjectsIntro');
  } else if (gameId === 'grocery-math') {
    speakTemplate('ttsGroceryMathIntro');
  } else if (gameId === 'shape-matching') {
    speakTemplate('ttsShapeMatchingIntro');
  } else if (gameId === 'wide-maze') {
    speakTemplate('ttsWideMazeIntro');
  }
}

function exitGame() {
  if (activeSubGameId) {
    const activeScreen = document.getElementById(`screen-game-${activeSubGameId}`);
    if (activeScreen) activeScreen.classList.add('hidden');
    
    stopMemoryMatchGame();
    stopStroopGame();
    stopMazeGame();
    isSimonPlaying = false;
    isPlayerTurn = false;
    
    document.getElementById('screen-games').classList.remove('hidden');
    activeSubGameId = null;
    
    renderGamesScreen();
  }
}

// MOCK PREVIEW SIMULATOR FOR OTHER 7 GAMES
function launchMockGame(title) {
  const modal = document.getElementById('mockGameModal');
  const modalTitle = document.getElementById('mockGameTitle');
  const modalParams = document.getElementById('mockGameParams');

  if (modalTitle) modalTitle.textContent = `${title} AI Adaptor`;
  
  const diff = getAdaptedDifficulty();
  let paramsText = '';
  if (diff === 'Easy') {
    paramsText = `- Difficulty: Easy (Adapting...)\n- Grid Scale: 1.5x Large\n- Prompt Assistance: Enabled\n- Action Delay: 1200ms`;
  } else if (diff === 'Hard') {
    paramsText = `- Difficulty: Hard (Adapting...)\n- Grid Scale: Standard Compact\n- Focus Distractors: Active (+3)\n- Speed Rate: Fast (1.5x)`;
  } else {
    paramsText = `- Difficulty: Medium (Adapting...)\n- Grid Scale: 1.2x Normal\n- Distractor items: Standard\n- Response rate: 800ms`;
  }
  
  if (modalParams) modalParams.textContent = paramsText;
  if (modal) modal.classList.remove('hidden');
  
  speakTemplate('ttsGameParametersAdjusted', { title, diff });
}

function dismissMockGame() {
  const modal = document.getElementById('mockGameModal');
  if (modal) modal.classList.add('hidden');
}

// PLAYABLE NOSTALGIC MEMORY MATCH GAME
let memoryCards = [];
let memoryFlipped = [];
let memoryMatches = 0;
let isMemoryActive = false;

const NOSTALGIC_ICONS = ['☎️', '📻', '📺', '✉️', ' Candle ', '🔑', '⏰', '📖'];

function startMemoryMatchGame() {
  const gridContainer = document.getElementById('memoryGrid');
  const startBtn = document.getElementById('memoryStartBtn');
  const statusText = document.getElementById('memoryStatusText');
  const counterText = document.getElementById('memoryScoreCounter');
  
  if (!gridContainer) return;
  
  isMemoryActive = true;
  memoryFlipped = [];
  memoryMatches = 0;
  
  if (startBtn) startBtn.classList.add('hidden');
  if (statusText) statusText.textContent = "Find matching pairs!";
  if (counterText) counterText.textContent = "Pairs: 0";

  const diff = getAdaptedDifficulty();
  let pairCount = 4; // default Medium
  if (diff === 'Easy') {
    pairCount = 2; // 4 cards
  } else if (diff === 'Hard') {
    pairCount = 6; // 12 cards
  }
  
  gridContainer.className = pairCount === 2 ? 'grid grid-cols-2 gap-4 max-w-[200px] w-full' : 'grid grid-cols-4 gap-2.5 max-w-[320px] w-full';

  const selectedIcons = NOSTALGIC_ICONS.slice(0, pairCount);
  const items = [...selectedIcons, ...selectedIcons];
  items.sort(() => Math.random() - 0.5);

  memoryCards = items.map((icon, idx) => ({
    id: idx,
    icon: icon,
    isMatched: false,
    isFlipped: false
  }));

  renderMemoryGrid();
}

function renderMemoryGrid() {
  const gridContainer = document.getElementById('memoryGrid');
  if (!gridContainer) return;
  
  gridContainer.innerHTML = memoryCards.map(card => {
    const showContent = card.isFlipped || card.isMatched;
    return `
      <button onclick="flipMemoryCard(${card.id})" 
              class="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-300 shadow-md ${showContent ? 'bg-white border-2 border-orange-500 scale-95' : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95'}"
              style="min-height:64px;"
              ${card.isMatched ? 'disabled' : ''}>
        ${showContent ? card.icon : '❓'}
      </button>
    `;
  }).join('');
}

function flipMemoryCard(cardId) {
  if (!isMemoryActive) return;
  
  const card = memoryCards.find(c => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) return;
  
  if (memoryFlipped.length >= 2) return;

  card.isFlipped = true;
  memoryFlipped.push(card);
  renderMemoryGrid();
  playTone(400, 'sine', 0.1);

  if (memoryFlipped.length === 2) {
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const [c1, c2] = memoryFlipped;
  const statusText = document.getElementById('memoryStatusText');
  const counterText = document.getElementById('memoryScoreCounter');

  if (c1.icon === c2.icon) {
    c1.isMatched = true;
    c2.isMatched = true;
    memoryMatches++;
    memoryFlipped = [];
    playSuccessChime();
    
    const pairCount = memoryCards.length / 2;
    if (counterText) counterText.textContent = `Pairs: ${memoryMatches}/${pairCount}`;
    if (statusText) statusText.textContent = "Matched!";

    if (memoryMatches === pairCount) {
      isMemoryActive = false;
      setTimeout(() => {
        if (statusText) statusText.textContent = "Superb! Pairs Completed!";
        speakTemplate('ttsMemoryMatchFinished');
        
        const scoreEarned = pairCount * 300;
        submitScoreToBackend(state.profile ? state.profile.name : 'Patient #123', scoreEarned, 'Memory Expert');
        logStreakActivity();

        state.gameHistory.push({ timestamp: Date.now(), score: scoreEarned });
        saveState();

        const startBtn = document.getElementById('memoryStartBtn');
        if (startBtn) {
          startBtn.classList.remove('hidden');
          startBtn.textContent = 'Play Again';
        }
      }, 500);
    } else {
      setTimeout(() => {
        renderMemoryGrid();
      }, 400);
    }
  } else {
    if (statusText) statusText.textContent = "Try again!";
    playTone(180, 'sawtooth', 0.25);
    setTimeout(() => {
      c1.isFlipped = false;
      c2.isFlipped = false;
      memoryFlipped = [];
      renderMemoryGrid();
      if (statusText) statusText.textContent = "Find matching pairs!";
    }, 1000);
  }
}

function stopMemoryMatchGame() {
  isMemoryActive = false;
  const startBtn = document.getElementById('memoryStartBtn');
  if (startBtn) startBtn.classList.remove('hidden');
  const grid = document.getElementById('memoryGrid');
  if (grid) grid.innerHTML = '';
}

// PLAYABLE STROOP TEST FOCUS GAME
let stroopScore = 0;
let stroopCorrectColor = '';
let stroopTimer = null;
let stroopTimeLeft = 100;
let isStroopActive = false;

const STROOP_COLORS = [
  { name: 'RED', hex: '#ef4444' },
  { name: 'GREEN', hex: '#22c55e' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'YELLOW', hex: '#eab308' },
  { name: 'ORANGE', hex: '#f97316' }
];

function startStroopGame() {
  const startBtn = document.getElementById('stroopStartBtn');
  const counter = document.getElementById('stroopScoreCounter');
  
  if (startBtn) startBtn.classList.add('hidden');
  if (counter) counter.textContent = "Score: 0";
  
  isStroopActive = true;
  stroopScore = 0;
  
  nextStroopRound();
}

function nextStroopRound() {
  if (!isStroopActive) return;

  const display = document.getElementById('stroopWordDisplay');
  const optionsContainer = document.getElementById('stroopOptionsContainer');
  const diff = getAdaptedDifficulty();

  const shuffledColors = [...STROOP_COLORS].sort(() => Math.random() - 0.5);
  const targetWord = shuffledColors[0].name;
  const targetColorObj = shuffledColors[1 % shuffledColors.length];
  stroopCorrectColor = targetColorObj.name;

  if (display) {
    display.textContent = targetWord;
    display.style.color = targetColorObj.hex;
  }

  let optionCount = 3;
  let duration = 3000;
  
  if (diff === 'Easy') {
    optionCount = 2;
    duration = 5000;
  } else if (diff === 'Hard') {
    optionCount = 4;
    duration = 1600;
  }

  const choices = STROOP_COLORS.slice(0, optionCount);
  if (!choices.find(c => c.name === stroopCorrectColor)) {
    choices[0] = STROOP_COLORS.find(c => c.name === stroopCorrectColor);
  }
  choices.sort(() => Math.random() - 0.5);

  if (optionsContainer) {
    optionsContainer.innerHTML = choices.map(color => `
      <button onclick="handleStroopAnswer('${color.name}')" 
              class="w-full py-2.5 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-color)] text-[var(--text-main)] text-sm font-bold active:scale-[0.98] transition-transform">
        ${color.name}
      </button>
    `).join('');
  }

  clearInterval(stroopTimer);
  stroopTimeLeft = 100;
  const decrement = 100 / (duration / 100);
  
  const timerBar = document.getElementById('stroopTimerBar');
  
  stroopTimer = setInterval(() => {
    stroopTimeLeft -= decrement;
    if (timerBar) timerBar.style.width = `${Math.max(0, stroopTimeLeft)}%`;
    
    if (stroopTimeLeft <= 0) {
      clearInterval(stroopTimer);
      handleStroopTimeout();
    }
  }, 100);
}

function handleStroopAnswer(chosenColorName) {
  if (!isStroopActive) return;
  clearInterval(stroopTimer);

  const counter = document.getElementById('stroopScoreCounter');

  if (chosenColorName === stroopCorrectColor) {
    stroopScore += 200;
    if (counter) counter.textContent = `Score: ${stroopScore}`;
    playSuccessChime();
    setTimeout(nextStroopRound, 200);
  } else {
    endStroopGame("Oops! That color didn't match.");
  }
}

function handleStroopTimeout() {
  endStroopGame("Time's up! Stay focused.");
}

function endStroopGame(message) {
  isStroopActive = false;
  clearInterval(stroopTimer);
  
  const display = document.getElementById('stroopWordDisplay');
  const options = document.getElementById('stroopOptionsContainer');
  const startBtn = document.getElementById('stroopStartBtn');
  
  if (display) {
    display.textContent = "GAME OVER";
    display.style.color = "#dc2626";
  }
  if (options) options.innerHTML = `<p class="text-xs text-[var(--text-muted)]">${message}</p>`;
  
  if (startBtn) {
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'Play Again';
  }

  if (stroopScore > 0) {
    speakTemplate('ttsStroopTestFinished', { score: stroopScore });
    submitScoreToBackend(state.profile ? state.profile.name : 'Patient #123', stroopScore, 'Focus Champion');
    logStreakActivity();

    state.gameHistory.push({ timestamp: Date.now(), score: stroopScore });
    saveState();
  } else {
    playTone(180, 'sawtooth', 0.4);
  }
}

function stopStroopGame() {
  isStroopActive = false;
  clearInterval(stroopTimer);
  const startBtn = document.getElementById('stroopStartBtn');
  if (startBtn) startBtn.classList.remove('hidden');
  const display = document.getElementById('stroopWordDisplay');
  if (display) {
    display.textContent = "🎨";
    display.style.color = "currentColor";
  }
  const options = document.getElementById('stroopOptionsContainer');
  if (options) options.innerHTML = '';
}

// PLAYABLE SEQUENCE RECALL (SIMON GRID ADJUSTED BY AI DIFFICULTY)
function startSequenceGame() {
  simonSequence = [];
  playerSequence = [];
  simonRound = 0;
  isSimonPlaying = true;
  document.getElementById('simonStartBtn').classList.add('hidden');
  document.getElementById('simonRestartBtn').classList.remove('hidden');
  document.getElementById('simonStatusText').textContent = t('pressStart');
  
  // Set up pad visibility according to difficulty
  const diff = getAdaptedDifficulty();
  const pad4 = document.getElementById('simonPad4');
  if (pad4) {
    if (diff === 'Easy') {
      pad4.classList.add('invisible'); // hide pad 4 for easy mode (3 choices)
    } else {
      pad4.classList.remove('invisible');
    }
  }

  nextSimonRound();
}

function nextSimonRound() {
  simonRound++;
  playerSequence = [];
  isPlayerTurn = false;
  document.getElementById('simonRoundCounter').textContent = `${t('round')} ${simonRound}`;
  document.getElementById('simonStatusText').textContent = '...';

  const diff = getAdaptedDifficulty();
  const maxPads = diff === 'Easy' ? 3 : 4;
  const nextPad = Math.floor(Math.random() * maxPads) + 1;
  simonSequence.push(nextPad);

  playSimonSequence();
}

function playSimonSequence() {
  let step = 0;
  const diff = getAdaptedDifficulty();
  
  // Adjust speed interval based on difficulty
  let speed = 750; // medium
  if (diff === 'Easy') speed = 1000;
  if (diff === 'Hard') speed = 500;

  const interval = setInterval(() => {
    if (step >= simonSequence.length) {
      clearInterval(interval);
      isPlayerTurn = true;
      document.getElementById('simonStatusText').textContent = t('sequenceRecall');
      return;
    }
    flashPad(simonSequence[step]);
    step++;
  }, speed);
}

function flashPad(padNum) {
  const pad = document.getElementById(`simonPad${padNum}`);
  if (!pad) return;

  const freqs = { 1: 329.63, 2: 261.63, 3: 220.00, 4: 164.81 };
  playTone(freqs[padNum] || 300, 'sine', 0.35);

  pad.classList.add('lit');
  setTimeout(() => pad.classList.remove('lit'), 400);
}

function handlePadPress(padNum) {
  if (!isPlayerTurn) return;

  flashPad(padNum);
  playerSequence.push(padNum);

  const currentStep = playerSequence.length - 1;
  if (playerSequence[currentStep] !== simonSequence[currentStep]) {
    isPlayerTurn = false;
    isSimonPlaying = false;
    playTone(150, 'sawtooth', 0.6);
    document.getElementById('simonStatusText').textContent = `${t('round')} ${simonRound}`;
    document.getElementById('simonStartBtn').classList.remove('hidden');
    document.getElementById('simonRestartBtn').classList.add('hidden');

    const scoreEarned = (simonRound - 1) * 250;
    if (scoreEarned > 0) {
      submitScoreToBackend(state.profile ? state.profile.name : 'Patient #123', scoreEarned, 'Sequence Expert');
      logStreakActivity();

      state.gameHistory.push({ timestamp: Date.now(), score: scoreEarned });
      saveState();
    }
    speakTemplate('ttsScoreAnnounce', { score: scoreEarned });
    return;
  }

  if (playerSequence.length === simonSequence.length) {
    isPlayerTurn = false;
    playSuccessChime();
    setTimeout(() => {
      nextSimonRound();
    }, 1000);
  }
}

function updatePlayerLeaderboardScore(newPoints) {
  const userEntry = state.leaderboard.find(p => p.isCurrent);
  if (userEntry) {
    userEntry.score += newPoints;
    state.leaderboard.sort((a, b) => b.score - a.score);
    state.leaderboard.forEach((item, idx) => {
      item.rank = idx + 1;
    });
    saveState();
    renderLeaderboard();
  }
}

function renderLeaderboard() {
  const container = document.getElementById('anonLeaderboardList');
  if (!container) return;

  container.innerHTML = state.leaderboard.map(item => {
    const rankColors = {
      1: 'bg-amber-400 text-amber-950 font-black',
      2: 'bg-slate-300 text-slate-900 font-bold',
      3: 'bg-amber-700 text-white font-bold'
    };

    return `
      <div class="flex items-center justify-between p-3 rounded-xl ${item.isCurrent ? 'bg-[var(--primary-purple-bg)] border border-[var(--primary-purple)]' : 'bg-[var(--card-bg)] border border-[var(--border-color)]'}">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs ${rankColors[item.rank] || 'bg-[var(--surface-bg)] text-[var(--text-muted)]'}">
            #${item.rank}
          </div>
          <div>
            <div class="font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5">
              <span>${item.name}</span>
              ${item.isCurrent ? '<span class="px-1.5 py-0.5 rounded bg-[var(--primary-purple)] text-white text-[10px]">Active</span>' : ''}
            </div>
            <span class="text-xs text-[var(--text-muted)]">${item.badge}</span>
          </div>
        </div>
        <div class="text-right">
          <div class="font-black text-sm text-[var(--primary-purple)]">${item.score.toLocaleString()} pts</div>
        </div>
      </div>
    `;
  }).join('');
}

// 5. SETTINGS SCREEN & PASSWORD PROTECTED CAREGIVER PORTAL
function renderSettingsScreen() {
  const lockStatus = document.getElementById('caregiverLockStatus');
  const portalContent = document.getElementById('caregiverPortalView');
  const lockBtnText = document.getElementById('caregiverToggleBtnText');
  const lockBtnIcon = document.getElementById('caregiverToggleBtnIcon');

  if (state.isCaregiverUnlocked) {
    if (lockStatus) lockStatus.innerHTML = `<span class="text-[var(--success-green)] font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[18px] fill-icon">lock_open</span> ${t('unlock')}</span>`;
    if (portalContent) portalContent.classList.remove('hidden');
    if (lockBtnText) lockBtnText.textContent = t('lockCaregiver');
    if (lockBtnIcon) lockBtnIcon.textContent = 'lock';
    renderCaregiverDashboard();
  } else {
    if (lockStatus) lockStatus.innerHTML = `<span class="text-[var(--text-muted)] font-medium flex items-center gap-1"><span class="material-symbols-outlined text-[18px]">lock</span> ${t('pinRequired')}</span>`;
    if (portalContent) portalContent.classList.add('hidden');
    if (lockBtnText) lockBtnText.textContent = t('unlockCaregiver');
    if (lockBtnIcon) lockBtnIcon.textContent = 'key';
  }
  updateTTSToggleUI();
}

function handleCaregiverAuthToggle() {
  if (state.isCaregiverUnlocked) {
    state.isCaregiverUnlocked = false;
    saveState();
    renderSettingsScreen();
    showToast(t('lockCaregiver'), 'lock');
  } else {
    openPinModal();
  }
}

function openPinModal() {
  const modal = document.getElementById('pinAuthModal');
  if (modal) modal.classList.remove('hidden');
  const pinInput = document.getElementById('pinAuthInput');
  if (pinInput) {
    pinInput.value = '';
    setTimeout(() => pinInput.focus(), 150);
  }
}

function closePinModal() {
  const modal = document.getElementById('pinAuthModal');
  if (modal) modal.classList.add('hidden');
}

// A 4-digit PIN only has 10,000 combinations. With no attempt limiting,
// verifyCaregiverPin() could previously be brute-forced by anyone with the
// device in hand (or a script tapping the on-screen keypad) in well under a
// minute. This adds a simple escalating lockout: 5 wrong tries -> 30s lock,
// each further failed round doubles the lockout, up to 5 minutes.
const PIN_LOCKOUT_MAX_ATTEMPTS = 5;
const PIN_LOCKOUT_BASE_MS = 30 * 1000;
const PIN_LOCKOUT_MAX_MS = 5 * 60 * 1000;
let pinFailedAttempts = 0;
let pinLockedUntil = 0;

function verifyCaregiverPin() {
  const pinInput = document.getElementById('pinAuthInput');

  const now = Date.now();
  if (now < pinLockedUntil) {
    const secondsLeft = Math.ceil((pinLockedUntil - now) / 1000);
    playAlertChime();
    showToast(`${t('incorrectPin')} (${secondsLeft}s)`, 'error');
    return;
  }

  const entered = pinInput ? pinInput.value.trim() : '';

  if (entered === state.caregiverPin) {
    pinFailedAttempts = 0;
    pinLockedUntil = 0;
    state.isCaregiverUnlocked = true;
    saveState();
    closePinModal();
    renderSettingsScreen();
    playSuccessChime();
    showToast(t('unlockCaregiver'), 'verified_user');
  } else {
    pinFailedAttempts++;
    playAlertChime();

    if (pinFailedAttempts >= PIN_LOCKOUT_MAX_ATTEMPTS) {
      const lockoutRounds = Math.floor(pinFailedAttempts / PIN_LOCKOUT_MAX_ATTEMPTS) - 1;
      const lockoutMs = Math.min(PIN_LOCKOUT_BASE_MS * Math.pow(2, lockoutRounds), PIN_LOCKOUT_MAX_MS);
      pinLockedUntil = now + lockoutMs;
      showToast(`${t('incorrectPin')} — locked ${Math.round(lockoutMs / 1000)}s`, 'error');
    } else {
      showToast(t('incorrectPin'), 'error');
    }

    if (pinInput) {
      pinInput.value = '';
      pinInput.classList.add('border-red-500');
      setTimeout(() => pinInput.classList.remove('border-red-500'), 1500);
    }
  }
}

// CAREGIVER DASHBOARD INTERNAL MODULES
function renderCaregiverDashboard() {
  renderSafeZoneRadar();
  renderNGOFeed();
  renderMMSEGraph();
  refreshAnalyticsDashboard();
  fetchLeaderboardFromBackend();
  fetchNgoEventsFromBackend();
  fetchDeviceLocation();
}

// A. SAFE ZONE RADAR & SIMULATION
// Leaflet map globals
let safeZoneMap = null;
let safeZoneCircle = null;
let homeMarker = null;
let patientMarker = null;

let geoWatchId = null;

function fetchDeviceLocation() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    console.warn("Geolocation API not available");
    return;
  }

  // Clear any previous watcher to avoid duplicates
  if (geoWatchId !== null) {
    navigator.geolocation.clearWatch(geoWatchId);
    geoWatchId = null;
  }

  geoWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // If no home center has been set yet (first use), set it to current location
      if (!state.safeZone.homeSet) {
        state.safeZone.lat = lat;
        state.safeZone.lng = lng;
        state.safeZone.homeSet = true;
      }

      // Store patient's live GPS coordinates
      state.safeZone.patientLat = lat;
      state.safeZone.patientLng = lng;

      // Calculate real distance from home center to patient's current GPS position
      const dist = haversineDistance(
        state.safeZone.lat, state.safeZone.lng,
        lat, lng
      );
      state.safeZone.patientOffsetDistance = Math.round(dist);

      // Calculate bearing for angle
      state.safeZone.patientOffsetAngle = calculateBearing(
        state.safeZone.lat, state.safeZone.lng,
        lat, lng
      );

      saveState();

      // Update map if it's rendered
      if (safeZoneMap) {
        renderSafeZoneRadar();
      }

      // Reverse-geocode for display address
      reverseGeocode(lat, lng);
    },
    (err) => {
      console.warn("Geolocation error:", err.code, err.message);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
  );
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6378137; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

function reverseGeocode(lat, lng) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.address) {
        const addressParts = data.address;
        const road = addressParts.road || addressParts.suburb || '';
        const city = addressParts.city || addressParts.town || addressParts.village || addressParts.state || '';
        const cleanAddress = (road ? road + ', ' : '') + city;

        state.address = cleanAddress || data.display_name;
        saveState();

        const topLocation = document.getElementById('topLocationText');
        if (topLocation) topLocation.textContent = state.address;
      }
    })
    .catch(err => {
      console.warn("Reverse-geocoding failed", err);
      state.address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      saveState();

      const topLocation = document.getElementById('topLocationText');
      if (topLocation) topLocation.textContent = state.address;
    });
}

function setHomeToCurrentLocation() {
  if (state.safeZone.patientLat && state.safeZone.patientLng) {
    state.safeZone.lat = state.safeZone.patientLat;
    state.safeZone.lng = state.safeZone.patientLng;
    state.safeZone.homeSet = true;
    saveState();
    renderSafeZoneRadar();
    showToast(t('homeLocationUpdated') || 'Home location updated', 'verified');
  }
}

// A. SAFE ZONE MAP & SIMULATION
function renderSafeZoneRadar() {
  const radiusSlider = document.getElementById('safeZoneRadiusSlider');
  const radiusVal = document.getElementById('safeZoneRadiusValue');
  const statusBadge = document.getElementById('safeZoneStatusBadge');

  if (radiusSlider) radiusSlider.value = state.safeZone.radius;
  if (radiusVal) radiusVal.textContent = `${state.safeZone.radius}m`;

  const centerLat = state.safeZone.lat;
  const centerLng = state.safeZone.lng;

  // Use live GPS coordinates if available, otherwise fall back to offset simulation
  let patientLat, patientLng;
  if (state.safeZone.patientLat && state.safeZone.patientLng) {
    patientLat = state.safeZone.patientLat;
    patientLng = state.safeZone.patientLng;
  } else {
    // Fallback: Calculate patient coordinates using bearing and offset distance (geodesic math)
    const earthRadius = 6378137;
    const latRad = centerLat * Math.PI / 180;
    const lngRad = centerLng * Math.PI / 180;
    const bearingRad = state.safeZone.patientOffsetAngle * Math.PI / 180;
    const distanceRatio = state.safeZone.patientOffsetDistance / earthRadius;

    const patientLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(distanceRatio) +
      Math.cos(latRad) * Math.sin(distanceRatio) * Math.cos(bearingRad)
    );
    const patientLngRad = lngRad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(distanceRatio) * Math.cos(latRad),
      Math.cos(distanceRatio) - Math.sin(latRad) * Math.sin(patientLatRad)
    );

    patientLat = patientLatRad * 180 / Math.PI;
    patientLng = patientLngRad * 180 / Math.PI;
  }

  const isOutside = state.safeZone.patientOffsetDistance > state.safeZone.radius;
  state.safeZone.isBreached = isOutside;

  if (isOutside) {
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="px-2.5 py-1 rounded-full bg-[var(--danger-red-bg)] text-[var(--danger-red)] font-bold text-xs flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">warning</span> ${t('breached')}</span>`;
    }
  } else {
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="px-2.5 py-1 rounded-full bg-[var(--success-green-bg)] text-[var(--success-green)] font-bold text-xs flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">check_circle</span> ${t('insideSafe')}</span>`;
    }
  }

  // Initialize Leaflet Map if container exists
  const mapContainer = document.getElementById('safeZoneMap');
  if (mapContainer && typeof L !== 'undefined') {
    const homeCoords = [centerLat, centerLng];
    const patientCoords = [patientLat, patientLng];

    try {
      if (!safeZoneMap) {
        // Initialize L.map
        safeZoneMap = L.map('safeZoneMap', { zoomControl: false }).setView(homeCoords, 15);

        // Load OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(safeZoneMap);

        // Custom home icon
        const homeIcon = L.divIcon({
          html: `<div class="w-8 h-8 rounded-full bg-[#470085] border-2 border-white flex items-center justify-center text-white shadow-md"><span class="material-symbols-outlined text-sm">home</span></div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // Add Center/Home marker
        homeMarker = L.marker(homeCoords, { icon: homeIcon }).addTo(safeZoneMap);

        // Add Safe Zone Circle boundary
        safeZoneCircle = L.circle(homeCoords, {
          radius: state.safeZone.radius,
          color: '#470085',
          fillColor: '#470085',
          fillOpacity: 0.1,
          weight: 2
        }).addTo(safeZoneMap);

        // Custom patient icon
        const patientIcon = L.divIcon({
          html: `<div id="mapPatientDot" class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md animate-bounce"><span class="material-symbols-outlined text-[10px]">person</span></div>`,
          className: '',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        // Add patient marker
        patientMarker = L.marker(patientCoords, { icon: patientIcon }).addTo(safeZoneMap);
      } else {
        // Update existing leaflet objects
        homeMarker.setLatLng(homeCoords);
        safeZoneCircle.setLatLng(homeCoords);
        safeZoneCircle.setRadius(state.safeZone.radius);
        patientMarker.setLatLng(patientCoords);
      }

      // Update color scheme based on breach state
      const patientDotEl = document.getElementById('mapPatientDot');
      if (patientDotEl) {
        if (isOutside) {
          patientDotEl.classList.remove('bg-emerald-500');
          patientDotEl.classList.add('bg-red-600');
        } else {
          patientDotEl.classList.add('bg-emerald-500');
          patientDotEl.classList.remove('bg-red-600');
        }
      }

      if (isOutside) {
        safeZoneCircle.setStyle({ color: '#dc2626', fillColor: '#dc2626' });
      } else {
        safeZoneCircle.setStyle({ color: '#470085', fillColor: '#470085' });
      }

      // Fit bounds to show both markers
      const bounds = L.latLngBounds([homeCoords, patientCoords]);
      safeZoneMap.fitBounds(bounds.pad(0.35));

      // Force render sizing correction
      setTimeout(() => {
        safeZoneMap.invalidateSize();
      }, 200);

    } catch (err) {
      console.warn("Leaflet rendering error", err);
    }
  }
}

function handleSafeZoneRadiusChange(e) {
  state.safeZone.radius = parseInt(e.target.value, 10);
  saveState();
  renderSafeZoneRadar();
}

function simulatePatientMove(distanceDelta) {
  state.safeZone.patientOffsetDistance = Math.max(20, Math.min(1200, state.safeZone.patientOffsetDistance + distanceDelta));
  state.safeZone.patientOffsetAngle = (state.safeZone.patientOffsetAngle + 35) % 360;
  saveState();
  renderSafeZoneRadar();

  if (state.safeZone.patientOffsetDistance > state.safeZone.radius) {
    playAlertChime();
    speakTemplate('ttsGeofenceBreach');
    showToast(t('breached'), 'warning');
  } else {
    showToast(`${state.safeZone.patientOffsetDistance}m`, 'navigation');
  }
}

// B. REMOTE REMINDERS DISPATCHER
function sendRemoteReminder(type) {
  playAlertChime();
  let message = '';

  if (type === 'meds') {
    message = t('medReminder');
    speakTemplate('ttsRemoteMeds');
  } else if (type === 'water') {
    message = t('waterReminder');
    speakTemplate('ttsRemoteWater');
  } else if (type === 'posture') {
    message = t('postureReminder');
    speakTemplate('ttsRemotePosture');
  } else if (type === 'custom') {
    message = t('sendReminder');
    speakTemplate('ttsRemoteCheckin');
  }

  showToast(message, 'cell_tower');
}

// C. NGO ACTIVITY FEED & COMMUNITY HUB
function renderNGOFeed() {
  const container = document.getElementById('caregiverNGOList');
  if (!container) return;

  container.innerHTML = state.ngoEvents.map(event => {
    return `
      <div class="pp-card flex flex-col gap-2">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="font-bold text-base text-[var(--text-main)]">${event.title}</h4>
            <p class="text-xs font-semibold text-[var(--primary-purple)]">${event.organizer}</p>
          </div>
          <span class="px-2 py-0.5 rounded bg-[var(--surface-bg)] text-xs font-bold text-[var(--text-muted)]">${event.attendees} ${t('registered')}</span>
        </div>
        <p class="text-xs text-[var(--text-muted)]">${event.description}</p>
        <div class="text-xs text-[var(--text-muted)] flex items-center gap-1.5 pt-1">
          <span class="material-symbols-outlined text-[16px] text-[var(--primary-purple)]">calendar_month</span>
          <span>${event.time}</span>
        </div>
        <div class="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px] text-[var(--primary-purple)]">location_on</span>
          <span>${event.location}</span>
        </div>
        <div class="pt-2 flex items-center justify-between border-t border-[var(--border-color)] mt-1">
          <button onclick="toggleNgoRsvp('${event.id}')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${event.rsvpd ? 'bg-[var(--success-green-bg)] text-[var(--success-green)] border border-[var(--success-green)]' : 'bg-[var(--primary-purple)] text-white'} transition-colors">
            ${event.rsvpd ? t('rsvpConfirmed') : t('rsvpRegister')}
          </button>
          <button onclick="speakText('${event.title}. ${event.description}. ${event.time}', state.language)" class="text-[var(--text-muted)] hover:text-[var(--primary-purple)] p-1" aria-label="Listen">
            <span class="material-symbols-outlined text-[18px]">volume_up</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleNgoRsvp(eventId) {
  const event = state.ngoEvents.find(e => e.id === eventId);
  if (!event) return;

  event.rsvpd = !event.rsvpd;
  event.attendees += event.rsvpd ? 1 : -1;
  saveState();
  renderNGOFeed();
  showToast(event.rsvpd ? t('rsvpConfirmed') : t('cancel'), 'event_available');
}

// D. MMSE COGNITIVE RETENTION GRAPH — Dynamic Linear Regression
function renderMMSEGraph() {
  const container = document.getElementById('mmseGraphContainer');
  if (!container) return;

  const W = 400, H = 160;
  const padL = 40, padR = 10, padT = 20, padB = 20;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  // Map gameHistory scores to MMSE equivalents (0-30 scale)
  const history = state.gameHistory || [];
  const mmsePoints = history.length > 0 ? history.map((h, i) => ({
    x: i,
    y: Math.min(30, 18 + (h.score / 200))
  })) : [{ x: 0, y: 28 }, { x: 1, y: 27.5 }];

  // Linear Regression: y = mx + c
  const n = mmsePoints.length;
  const sumX = mmsePoints.reduce((s, p) => s + p.x, 0);
  const sumY = mmsePoints.reduce((s, p) => s + p.y, 0);
  const sumXY = mmsePoints.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = mmsePoints.reduce((s, p) => s + p.x * p.x, 0);
  const denom = (n * sumX2 - sumX * sumX);
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;

  // Project 12 months worth of points (x: 0 to 11)
  const months = 12;
  const mmseMin = 18, mmseMax = 30;

  function toSvgX(monthIdx) {
    return padL + (monthIdx / (months - 1)) * chartW;
  }
  function toSvgY(mmseVal) {
    return padT + chartH - ((mmseVal - mmseMin) / (mmseMax - mmseMin)) * chartH;
  }

  // Build platform line (with regression projection)
  let platformPath = '';
  let platformDots = '';
  for (let m = 0; m < months; m++) {
    const predictedMMSE = Math.max(mmseMin, Math.min(mmseMax, intercept + slope * m));
    const x = toSvgX(m);
    const y = toSvgY(predictedMMSE);
    if (m === 0) platformPath = `M ${x} ${y}`;
    else platformPath += ` L ${x} ${y}`;

    if (m < mmsePoints.length) {
      const actualY = toSvgY(mmsePoints[m].y);
      platformDots += `<circle cx="${x}" cy="${actualY}" r="3.5" fill="#2e7d32" opacity="0.9"/>`;
    }
  }

  // Build decline control line (without intervention)
  let declinePath = '';
  for (let m = 0; m < months; m++) {
    const declineMMSE = 28 - m * 0.9; // ~ -0.9 MMSE/month natural decline
    const x = toSvgX(m);
    const y = toSvgY(Math.max(mmseMin, declineMMSE));
    if (m === 0) declinePath = `M ${x} ${y}`;
    else declinePath += ` L ${x} ${y}`;
  }

  // Compute retention status
  const projectedAt12 = intercept + slope * 11;
  const declineAt12 = 28 - 11 * 0.9;
  const deltaMMSE = projectedAt12 - declineAt12;
  let statusLabel = '';
  let statusClass = '';
  if (deltaMMSE > 2) {
    statusLabel = `+${deltaMMSE.toFixed(1)} pts Retained`;
    statusClass = 'bg-[var(--success-green-bg)] text-[var(--success-green)]';
  } else if (deltaMMSE > 0) {
    statusLabel = `+${deltaMMSE.toFixed(1)} pts Stable`;
    statusClass = 'bg-amber-100 text-amber-700';
  } else {
    statusLabel = `${deltaMMSE.toFixed(1)} pts Declining`;
    statusClass = 'bg-[var(--danger-red-bg)] text-[var(--danger-red)]';
  }

  // Grid lines
  let gridLines = '';
  [30, 26, 22, 18].forEach(v => {
    const y = toSvgY(v);
    gridLines += `
      <line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="currentColor" stroke-opacity="0.1" stroke-dasharray="3"/>
      <text x="${padL - 4}" y="${y + 4}" text-anchor="end" class="text-[9px] fill-current opacity-60">${v}</text>`;
  });

  // Month labels
  let monthLabels = '';
  [0, 3, 6, 9, 11].forEach(m => {
    monthLabels += `<text x="${toSvgX(m)}" y="${H - 3}" text-anchor="middle" class="text-[9px] fill-current opacity-60">${m}m</text>`;
  });

  container.innerHTML = `
    <div class="pp-card bg-[var(--card-bg)] flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-bold text-base text-[var(--text-main)]">${t('slowingDecline')}</h4>
          <p class="text-xs text-[var(--text-muted)]">${t('clinicalMmse')}</p>
        </div>
        <span class="px-2 py-1 rounded-full ${statusClass} text-xs font-black">${statusLabel}</span>
      </div>

      <div class="w-full h-44 relative bg-[var(--surface-bg)] rounded-xl p-2 border border-[var(--border-color)]">
        <svg viewBox="0 0 ${W} ${H}" class="w-full h-full">
          ${gridLines}
          <path d="${declinePath}" fill="none" stroke="#ef5350" stroke-width="2" stroke-dasharray="5 3"/>
          <path d="${platformPath}" fill="none" stroke="#2e7d32" stroke-width="2.5"/>
          ${platformDots}
          ${monthLabels}
        </svg>
      </div>

      <div class="flex items-center justify-around text-xs pt-1">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-full bg-[#2e7d32]"></span>
          <span class="font-bold text-[var(--text-main)]">${t('withPlatform')}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-5 h-0.5 border-t-2 border-dashed border-[#ef5350] inline-block"></span>
          <span class="text-[var(--text-muted)]">${t('withoutIntervention')}</span>
        </div>
      </div>
    </div>
  `;
}

// E. BACKEND LEADERBOARD + NGO SYNC (Supabase)
//
// The previous code pointed at http://localhost:3000, which only ever
// resolves to the device itself — on a real phone that endpoint never
// exists, so every call to it was a guaranteed, silent failure. This uses
// Supabase's REST API (PostgREST) directly via fetch — no SDK/build step
// needed, which keeps this a drop-in for a plain WebView asset file.
//
// Fill these in from Supabase: Settings -> Data API (Project URL + the
// "Publishable" / anon public key). Leaving SUPABASE_URL empty disables all
// network calls and the app silently falls back to localStorage only.
const SUPABASE_URL = 'https://lyacvnahudxmxtandoaq.supabase.co/rest/v1/'; // e.g. 'https://xxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_u4whjIzOlfblWcyYRTJEGQ_ui9eQGDT'; // the "Publishable key" from Settings -> Data API

function getAnonDeviceId() {
  // Anonymous per-device identity so scores persist across app restarts
  // without requiring a login. Reinstalling the app / clearing app data
  // generates a new id (and a fresh leaderboard entry) — that's a known,
  // accepted tradeoff for a casual leaderboard with no accounts.
  let id = localStorage.getItem('WINDEMON_DEVICE_ID');
  if (!id) {
    id = 'device_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('WINDEMON_DEVICE_ID', id);
  }
  return id;
}

function supabaseHeaders(extra = {}) {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extra
  };
}

async function submitScoreToBackend(name, score, badge) {
  // Always update local state immediately
  const userEntry = state.leaderboard.find(p => p.isCurrent);
  if (userEntry) {
    if (score > userEntry.score) userEntry.score = score;
    if (badge) userEntry.badge = badge;
    userEntry.name = name || userEntry.name;
    state.leaderboard.sort((a, b) => b.score - a.score);
    state.leaderboard.forEach((item, idx) => { item.rank = idx + 1; });
    saveState();
    renderLeaderboard();
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return; // Supabase not configured yet

  try {
    // Upsert on device_id: each device has exactly one row, keeping its
    // personal best score instead of appending a new row per game.
    const deviceId = getAnonDeviceId();
    await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?on_conflict=device_id`, {
      method: 'POST',
      headers: supabaseHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
      body: JSON.stringify({
        device_id: deviceId,
        name: name || 'Patient',
        score,
        badge: badge || 'Brain Champ',
        updated_at: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(5000)
    });
  } catch {
    // Offline - localStorage fallback already done above
  }
}

async function fetchLeaderboardFromBackend() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return; // Supabase not configured yet

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/leaderboard?select=name,score,badge&order=score.desc&limit=20`,
      { headers: supabaseHeaders(), signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Merge server data, keeping isCurrent flag for local player
        const currentLocal = state.leaderboard.find(p => p.isCurrent);
        state.leaderboard = data.map((item, idx) => ({
          ...item,
          rank: idx + 1,
          isCurrent: currentLocal && item.name === currentLocal.name
        }));
        if (!state.leaderboard.find(p => p.isCurrent) && currentLocal) {
          state.leaderboard.push(currentLocal);
        }
        state.leaderboard.sort((a, b) => b.score - a.score);
        state.leaderboard.forEach((item, idx) => { item.rank = idx + 1; });
        saveState();
        renderLeaderboard();
      }
    }
  } catch {
    // Offline — already using localStorage
  }
}

async function fetchNgoEventsFromBackend() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return; // Supabase not configured yet

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/ngo_events?select=*&order=created_at.asc`,
      { headers: supabaseHeaders(), signal: AbortSignal.timeout(5000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Preserve local rsvpd/attendees state where an event already exists
        const localById = Object.fromEntries((state.ngoEvents || []).map(e => [e.id, e]));
        state.ngoEvents = data.map(e => ({
          ...e,
          rsvpd: localById[e.id] ? localById[e.id].rsvpd : (e.rsvpd || false),
          attendees: localById[e.id] ? localById[e.id].attendees : (e.attendees || 0)
        }));
        saveState();
        renderNGOFeed();
      }
    }
  } catch {
    // Offline — already using local defaults
  }
}

// F. CAREGIVER ANALYTICS DASHBOARD RENDERER
function refreshAnalyticsDashboard() {
  const history = state.gameHistory || [];
  const tasks = state.tasks || [];
  const streak = state.streak || {};

  // ---- Key Stats Grid ----
  const statsGrid = document.getElementById('analyticsStatsGrid');
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const totalSessions = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0;
  const avgScore = history.length > 0 
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) 
    : 0;

  if (statsGrid) {
    statsGrid.innerHTML = `
      <div class="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex flex-col gap-0.5">
        <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase">Games Played</div>
        <div class="text-2xl font-black text-[var(--primary-purple)]">${totalSessions}</div>
        <div class="text-[9px] text-[var(--text-muted)]">total sessions</div>
      </div>
      <div class="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex flex-col gap-0.5">
        <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase">Best Score</div>
        <div class="text-2xl font-black text-amber-500">${bestScore.toLocaleString()}</div>
        <div class="text-[9px] text-[var(--text-muted)]">pts (all-time)</div>
      </div>
      <div class="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex flex-col gap-0.5">
        <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase">Avg. Score</div>
        <div class="text-2xl font-black text-[var(--secondary-teal)]">${avgScore.toLocaleString()}</div>
        <div class="text-[9px] text-[var(--text-muted)]">per session</div>
      </div>
      <div class="p-3 rounded-xl bg-[var(--surface-bg)] border border-[var(--border-color)] flex flex-col gap-0.5">
        <div class="text-[10px] text-[var(--text-muted)] font-bold uppercase">Daily Streak</div>
        <div class="text-2xl font-black text-orange-500">🔥 ${streak.current || 0}</div>
        <div class="text-[9px] text-[var(--text-muted)]">days active</div>
      </div>
    `;
  }

  // ---- Score History Bar Chart ----
  const chart = document.getElementById('scoreHistoryChart');
  if (chart) {
    const last10 = history.slice(-10);
    if (last10.length === 0) {
      chart.innerHTML = `<text x="170" y="55" text-anchor="middle" class="text-[10px] fill-current opacity-40">No game history yet. Play a game to see stats.</text>`;
    } else {
      const maxScore = Math.max(...last10.map(h => h.score), 1);
      const barW = 28;
      const spacing = 34;
      const startX = 10;
      const chartH = 90;

      let bars = '';
      last10.forEach((h, i) => {
        const barH = Math.max(4, (h.score / maxScore) * chartH);
        const x = startX + i * spacing;
        const y = chartH - barH;
        const date = new Date(h.timestamp);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        const hue = i === last10.length - 1 ? '#5f259f' : '#c4b5fd';
        bars += `
          <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${hue}" opacity="0.9"/>
          <text x="${x + barW / 2}" y="${chartH + 9}" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.5">${label}</text>
          <text x="${x + barW / 2}" y="${y - 2}" text-anchor="middle" font-size="7" fill="currentColor" opacity="0.7">${h.score}</text>
        `;
      });
      chart.innerHTML = bars;
    }
  }

  // ---- Task Completion Donut ----
  const donutArc = document.getElementById('taskDonutArc');
  const donutPct = document.getElementById('taskDonutPct');
  const donutLabel = document.getElementById('taskDonutLabel');
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const circumference = 100; // stroke-dasharray denominator
  if (donutArc) donutArc.setAttribute('stroke-dasharray', `${pct} ${circumference - pct}`);
  if (donutPct) donutPct.textContent = `${pct}%`;
  if (donutLabel) donutLabel.textContent = `${completedTasks} of ${totalTasks} tasks completed today`;

  // ---- Weekly Engagement Bars ----
  const weekBars = document.getElementById('weeklyEngagementBars');
  if (weekBars) {
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      return streak.history ? (streak.history[dateStr] || 0) : 0;
    });

    const maxActivities = Math.max(...days, 1);
    weekBars.innerHTML = days.map((count, i) => {
      const heightPct = Math.max(6, Math.round((count / maxActivities) * 100));
      const isToday = i === today.getDay();
      const color = count > 0 
        ? (isToday ? 'bg-[var(--primary-purple)]' : 'bg-indigo-300 dark:bg-indigo-800')
        : 'bg-slate-200 dark:bg-slate-800';
      return `
        <div class="flex-1 flex flex-col items-center gap-0.5">
          <div class="w-full ${color} rounded-t" style="height:${heightPct}%"></div>
        </div>`;
    }).join('');
  }

  // ---- Cognitive Risk Index ----
  const cogBar = document.getElementById('cogRiskBar');
  const cogMarker = document.getElementById('cogRiskMarker');
  const cogDesc = document.getElementById('cogRiskDescription');

  let mmseEquiv = 28;
  if (history.length > 0) {
    const avg = history.slice(-5).reduce((s, h) => s + h.score, 0) / Math.min(5, history.length);
    mmseEquiv = Math.min(30, 18 + (avg / 200));
  }

  // Normalize to risk % (MMSE 30=0% risk, 18=100% risk)
  const riskPct = Math.max(0, Math.min(100, Math.round((1 - (mmseEquiv - 18) / 12) * 100)));
  if (cogBar) cogBar.style.width = `${riskPct}%`;
  if (cogMarker) cogMarker.style.left = `${riskPct}%`;

  let riskText = '';
  if (riskPct < 30) {
    riskText = `MMSE Equivalent: ${mmseEquiv.toFixed(1)}/30. Patient is cognitively stable. Continue current exercise regimen. Schedule next review in 4 weeks.`;
  } else if (riskPct < 65) {
    riskText = `MMSE Equivalent: ${mmseEquiv.toFixed(1)}/30. Moderate cognitive fluctuation detected. Consider increasing exercise frequency. Consult specialist at next visit.`;
  } else {
    riskText = `MMSE Equivalent: ${mmseEquiv.toFixed(1)}/30. High cognitive risk detected. Recommend immediate clinical assessment. Consider caregiver support increase.`;
  }
  if (cogDesc) cogDesc.textContent = riskText;

  // ---- Recent Game Sessions Table ----
  const sessionsContainer = document.getElementById('recentGameSessions');
  if (sessionsContainer) {
    if (history.length === 0) {
      sessionsContainer.innerHTML = `<p class="text-xs text-[var(--text-muted)] text-center py-2">No game sessions recorded yet.</p>`;
    } else {
      const recent = history.slice(-5).reverse();
      sessionsContainer.innerHTML = recent.map((h) => {
        const d = new Date(h.timestamp);
        const timeStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) + ' ' +
                        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const mmseEq = Math.min(30, 18 + (h.score / 200)).toFixed(1);
        return `
          <div class="flex items-center justify-between p-2.5 rounded-lg bg-[var(--surface-bg)] border border-[var(--border-color)]">
            <div>
              <div class="font-bold text-[var(--text-main)]">${timeStr}</div>
              <div class="text-[10px] text-[var(--text-muted)]">MMSE eq: ${mmseEq}/30</div>
            </div>
            <div class="text-right">
              <div class="font-black text-[var(--primary-purple)]">${h.score.toLocaleString()} pts</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  showToast(t('analyticsRefreshed'), 'analytics');
}

// --- SOS EMERGENCY TRIGGER ---
function triggerSOS() {
  playAlertChime();
  
  let locationCoordinates = 'Lat: 26.1445° N, Lng: 91.7362° E';
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationCoordinates = `Lat: ${pos.coords.latitude.toFixed(4)}°, Lng: ${pos.coords.longitude.toFixed(4)}°`;
        showSOSAlertModal(locationCoordinates);
      },
      () => {
        showSOSAlertModal(locationCoordinates);
      },
      { timeout: 4000 }
    );
  } else {
    showSOSAlertModal(locationCoordinates);
  }
}

function showSOSAlertModal(coords) {
  const modal = document.getElementById('sosAlertModal');
  const coordsLabel = document.getElementById('sosLocationCoords');
  if (coordsLabel) coordsLabel.textContent = coords;
  if (modal) modal.classList.remove('hidden');

  speakTemplate('ttsSosAlert');
}

function closeSOSAlertModal() {
  const modal = document.getElementById('sosAlertModal');
  if (modal) modal.classList.add('hidden');
}

// --- LANGUAGE PICKER MODAL ---
function openLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) modal.classList.remove('hidden');
}

function closeLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) modal.classList.add('hidden');
}

function selectLanguage(langKey) {
  state.language = langKey;
  saveState();
  closeLanguageModal();
  initAccessibility();

  // If a sub-game is currently open, updateDOMTranslations handles it (runs on all screens)
  // Also re-apply to whichever main tab is active
  if (!activeSubGameId) {
    switchTab(state.currentTab);
  } else {
    updateDOMTranslations();
  }

  const langNames = {
    en: 'English', hi: 'हिंदी', as: 'অসমীয়া', bn: 'বাংলা',
    bodo: 'बड़ो', garo: 'A·chik', karbi: 'Karbi', khasi: 'Khasi',
    kokborok: 'Kokborok', meitei: 'মৈতৈলোন্', mishing: 'Mishing',
    mizo: 'Mizo ṭawng', nepali: 'नेपाली', sadri: 'सादरी'
  };

  const currentLangLabel = langNames[langKey] || langKey.toUpperCase();
  showToast(`${t('languageDictionary')}: ${currentLangLabel}`, 'language');
  speakText(currentLangLabel, langKey);
}


// --- WORD SEARCH GAME ---
const WS_WORDS = ['BREAD', 'MILK', 'APPLE', 'DOOR', 'CLOCK'];
const WS_GRID_SIZE = 8;
let wsGrid = [];
let wsWordPlacements = {};
let wsFoundWords = new Set();
let wsSelecting = false;
let wsStartCell = null;
let wsEndCell = null;

function startWordSearch() {
  wsFoundWords = new Set();
  wsGrid = [];
  wsWordPlacements = {};
  wsSelecting = false;
  wsStartCell = null;
  wsEndCell = null;

  // Init blank grid
  for (let r = 0; r < WS_GRID_SIZE; r++) {
    wsGrid.push([]);
    for (let c = 0; c < WS_GRID_SIZE; c++) wsGrid[r].push('');
  }

  // Place words
  const directions = [[0,1],[1,0],[1,1]];
  for (const word of WS_WORDS) {
    let placed = false;
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxR = WS_GRID_SIZE - (dir[0] * word.length);
      const maxC = WS_GRID_SIZE - (dir[1] * word.length);
      if (maxR < 0 || maxC < 0) continue;
      const sr = Math.floor(Math.random() * maxR);
      const sc = Math.floor(Math.random() * maxC);
      let ok = true;
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        const r = sr + dir[0] * i;
        const c = sc + dir[1] * i;
        if (wsGrid[r][c] !== '' && wsGrid[r][c] !== word[i]) { ok = false; break; }
        cells.push([r, c]);
      }
      if (ok) {
        cells.forEach(([r, c], i) => { wsGrid[r][c] = word[i]; });
        wsWordPlacements[word] = cells;
        placed = true;
      }
    }
  }

  // Fill blanks with random letters
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < WS_GRID_SIZE; r++)
    for (let c = 0; c < WS_GRID_SIZE; c++)
      if (!wsGrid[r][c]) wsGrid[r][c] = alpha[Math.floor(Math.random() * 26)];

  renderWordSearchGrid();
  renderWordList();
  const status = document.getElementById('wsStatus');
  if (status) status.textContent = 'Tap start cell, then tap end cell of a word!';
  const btn = document.getElementById('wsStartBtn');
  if (btn) btn.textContent = 'New Game';
  updateWsCounter();
}

function renderWordSearchGrid() {
  const container = document.getElementById('wsGrid');
  if (!container) return;
  container.innerHTML = '';
  for (let r = 0; r < WS_GRID_SIZE; r++) {
    for (let c = 0; c < WS_GRID_SIZE; c++) {
      const cell = document.createElement('button');
      cell.id = `wsCell-${r}-${c}`;
      cell.textContent = wsGrid[r][c];
      cell.className = 'w-8 h-8 text-xs font-extrabold rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[var(--text-main)] active:scale-95 transition-transform';
      cell.onclick = () => handleWsCellClick(r, c);
      container.appendChild(cell);
    }
  }
}

function handleWsCellClick(r, c) {
  if (!wsStartCell) {
    wsStartCell = [r, c];
    highlightCell(r, c, 'selected');
    const status = document.getElementById('wsStatus');
    if (status) status.textContent = 'Now tap the end cell of your word!';
  } else {
    wsEndCell = [r, c];
    checkWordSelection(wsStartCell, wsEndCell);
    wsStartCell = null;
    wsEndCell = null;
  }
}

function highlightCell(r, c, type) {
  const cell = document.getElementById(`wsCell-${r}-${c}`);
  if (!cell) return;
  if (type === 'selected') cell.classList.add('bg-yellow-200', 'dark:bg-yellow-700');
  else if (type === 'found') cell.classList.add('bg-teal-300', 'dark:bg-teal-600', 'text-white');
  else cell.classList.remove('bg-yellow-200', 'dark:bg-yellow-700');
}

function checkWordSelection(start, end) {
  // Clear yellow highlights
  for (let r = 0; r < WS_GRID_SIZE; r++)
    for (let c = 0; c < WS_GRID_SIZE; c++)
      document.getElementById(`wsCell-${r}-${c}`)?.classList.remove('bg-yellow-200', 'dark:bg-yellow-700');

  // Determine direction
  const dr = Math.sign(end[0] - start[0]);
  const dc = Math.sign(end[1] - start[1]);
  const len = Math.max(Math.abs(end[0] - start[0]), Math.abs(end[1] - start[1])) + 1;
  const cells = [];
  let word = '';
  for (let i = 0; i < len; i++) {
    const r = start[0] + dr * i;
    const c = start[1] + dc * i;
    if (r < 0 || r >= WS_GRID_SIZE || c < 0 || c >= WS_GRID_SIZE) break;
    cells.push([r, c]);
    word += wsGrid[r][c];
  }

  const status = document.getElementById('wsStatus');
  if (WS_WORDS.includes(word) && !wsFoundWords.has(word)) {
    wsFoundWords.add(word);
    cells.forEach(([r, c]) => highlightCell(r, c, 'found'));
    if (status) status.textContent = `Found: ${word}!`;
    updateWordListItem(word, true);
    updateWsCounter();
    if (wsFoundWords.size === WS_WORDS.length) {
      if (status) status.textContent = 'Excellent! All words found!';
      submitGameScore('word-search', wsFoundWords.size * 20);
    }
  } else {
    if (status) status.textContent = 'Not a word here. Try again!';
  }
}

function renderWordList() {
  const container = document.getElementById('wsWordList');
  if (!container) return;
  container.innerHTML = '';
  WS_WORDS.forEach(word => {
    const span = document.createElement('span');
    span.id = `wsWord-${word}`;
    span.textContent = word;
    span.className = 'px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 text-xs font-bold';
    container.appendChild(span);
  });
}

function updateWordListItem(word, found) {
  const el = document.getElementById(`wsWord-${word}`);
  if (el) {
    el.className = 'px-2.5 py-1 rounded-full bg-teal-500 text-white text-xs font-bold line-through';
  }
}

function updateWsCounter() {
  const el = document.getElementById('wsFoundCounter');
  if (el) el.textContent = `Found: ${wsFoundWords.size}/${WS_WORDS.length}`;
}

// --- TANGRAM PUZZLES GAME ---
const TANGRAM_PUZZLES = [
  { target: '▲', label: 'Triangle', shapes: ['▲ + ▲', '■ + ▲', '◆ + ◆'], answer: 0 },
  { target: '■', label: 'Square', shapes: ['▲ + ▲', '▲ + ▲ + ▲ + ▲', '◆ + ▲'], answer: 1 },
  { target: '◆', label: 'Diamond', shapes: ['▲ + ▲', '■ + ■', '◆ + ▲'], answer: 0 },
  { target: '⬟', label: 'Pentagon', shapes: ['■ + ▲', '▲ + ▲ + ▲', '◆ + ◆'], answer: 0 },
  { target: '⬡', label: 'Hexagon', shapes: ['▲ × 6', '◆ + ▲ + ▲', '■ + ▲ + ▲'], answer: 0 },
  { target: '▭', label: 'Rectangle', shapes: ['■ + ■', '▲ + ▲', '▲ × 4'], answer: 0 },
  { target: '⬭', label: 'Ellipse', shapes: ['◆ + ◆ + ▲', '▲ + ▲', '■ + ■ + ▲'], answer: 0 },
  { target: '⬔', label: 'Parallelogram', shapes: ['▲ + ▲', '◆ + ■', '▲ × 3'], answer: 0 },
];

let tangramCurrentRound = 0;
let tangramScore = 0;
let tangramActive = false;

function startTangram() {
  tangramCurrentRound = 0;
  tangramScore = 0;
  tangramActive = true;
  const btn = document.getElementById('tangramStartBtn');
  if (btn) btn.classList.add('hidden');
  renderTangramRound();
}

function renderTangramRound() {
  if (tangramCurrentRound >= TANGRAM_PUZZLES.length) {
    const fb = document.getElementById('tangramFeedback');
    if (fb) fb.textContent = `Game Over! Score: ${tangramScore}/${TANGRAM_PUZZLES.length}`;
    document.getElementById('tangramOptions').innerHTML = '';
    const btn = document.getElementById('tangramStartBtn');
    if (btn) { btn.classList.remove('hidden'); btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">replay</span> Play Again'; }
    submitGameScore('tangram', Math.round((tangramScore / TANGRAM_PUZZLES.length) * 100));
    return;
  }
  const puzzle = TANGRAM_PUZZLES[tangramCurrentRound];
  const roundEl = document.getElementById('tangramRound');
  if (roundEl) roundEl.textContent = `Round ${tangramCurrentRound + 1} / ${TANGRAM_PUZZLES.length}`;

  const target = document.getElementById('tangramTarget');
  if (target) target.innerHTML = `<span style="font-size: 72px; line-height: 1;">${puzzle.target}</span>`;

  const fb = document.getElementById('tangramFeedback');
  if (fb) fb.textContent = `Make the ${puzzle.label}`;

  const opts = document.getElementById('tangramOptions');
  if (!opts) return;
  opts.innerHTML = '';

  // Shuffle option order
  const indices = [0, 1, 2];
  indices.sort(() => Math.random() - 0.5);
  const shuffled = indices.map(i => ({ text: puzzle.shapes[i], isCorrect: i === puzzle.answer }));

  shuffled.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.className = 'p-3 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-xs font-bold text-purple-900 dark:text-purple-200 active:scale-95 transition-all text-center';
    btn.onclick = () => handleTangramAnswer(opt.isCorrect, btn, opts);
    opts.appendChild(btn);
  });
}

function handleTangramAnswer(correct, btn, opts) {
  // Disable all buttons
  opts.querySelectorAll('button').forEach(b => b.disabled = true);
  const fb = document.getElementById('tangramFeedback');
  if (correct) {
    btn.classList.add('border-green-500', 'bg-green-100', 'dark:bg-green-900/40');
    if (fb) fb.textContent = 'Correct!';
    tangramScore++;
    const sc = document.getElementById('tangramScore');
    if (sc) sc.textContent = `Score: ${tangramScore}`;
  } else {
    btn.classList.add('border-red-500', 'bg-red-100', 'dark:bg-red-900/40');
    if (fb) fb.textContent = 'Not quite — try the next one!';
  }
  tangramCurrentRound++;
  setTimeout(renderTangramRound, 1200);
}

// --- SUDOKU 4x4 GAME ---
const SUDOKU_PUZZLES = [
  { puzzle: [1,0,0,4, 0,4,1,0, 0,1,4,0, 4,0,0,1], solution: [1,2,3,4, 3,4,1,2, 2,1,4,3, 4,3,2,1] },
  { puzzle: [0,2,0,4, 4,0,2,0, 0,4,0,2, 2,0,4,0], solution: [1,2,3,4, 4,3,2,1, 3,4,1,2, 2,1,4,3] },
  { puzzle: [0,0,3,0, 3,0,0,2, 0,3,0,0, 2,0,0,3], solution: [2,1,3,4, 3,4,1,2, 1,3,2,4, 2,4,3,1] },
  { puzzle: [2,0,0,3, 0,3,2,0, 0,2,3,0, 3,0,0,2], solution: [2,4,1,3, 1,3,2,4, 4,2,3,1, 3,1,4,2] },
];

let sudokuPuzzle = [];
let sudokuSolution = [];
let sudokuUserGrid = [];
let sudokuSelectedCell = null;

function startSudoku() {
  const idx = Math.floor(Math.random() * SUDOKU_PUZZLES.length);
  sudokuPuzzle = [...SUDOKU_PUZZLES[idx].puzzle];
  sudokuSolution = [...SUDOKU_PUZZLES[idx].solution];
  sudokuUserGrid = [...sudokuPuzzle];
  sudokuSelectedCell = null;
  renderSudokuGrid();
  renderSudokuNumberPad();
  const fb = document.getElementById('sudokuFeedback');
  if (fb) fb.textContent = 'Tap an empty cell, then tap a number!';
  const status = document.getElementById('sudokuStatus');
  if (status) status.textContent = 'Sudoku — 4×4';
}

function renderSudokuGrid() {
  const container = document.getElementById('sudokuGrid');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('button');
    cell.id = `sdkCell-${i}`;
    const r = Math.floor(i / 4);
    const c = i % 4;
    const isFixed = sudokuPuzzle[i] !== 0;
    // Box borders for 2x2 boxes
    let extraBorder = '';
    if (c === 2) extraBorder += ' border-l-2 border-l-slate-400';
    if (r === 2) extraBorder += ' border-t-2 border-t-slate-400';
    cell.className = `h-14 w-full text-xl font-extrabold rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center transition-all ${isFixed ? 'bg-slate-100 dark:bg-slate-800 text-[var(--text-main)] cursor-default' : 'bg-white dark:bg-slate-900 text-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20'} ${extraBorder}`;
    cell.textContent = sudokuUserGrid[i] !== 0 ? sudokuUserGrid[i] : '';
    if (!isFixed) cell.onclick = () => selectSudokuCell(i);
    container.appendChild(cell);
  }
}

function selectSudokuCell(idx) {
  // Clear previous selection
  for (let i = 0; i < 16; i++) {
    document.getElementById(`sdkCell-${i}`)?.classList.remove('ring-2', 'ring-blue-500');
  }
  sudokuSelectedCell = idx;
  document.getElementById(`sdkCell-${idx}`)?.classList.add('ring-2', 'ring-blue-500');
}

function renderSudokuNumberPad() {
  const pad = document.getElementById('sudokuNumberPad');
  if (!pad) return;
  pad.classList.remove('hidden');
  pad.innerHTML = '';
  [1, 2, 3, 4].forEach(n => {
    const btn = document.createElement('button');
    btn.textContent = n;
    btn.className = 'w-12 h-12 rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-extrabold text-lg active:scale-95 transition-transform';
    btn.onclick = () => sudokuInput(n);
    pad.appendChild(btn);
  });
  const clrBtn = document.createElement('button');
  clrBtn.textContent = '✕';
  clrBtn.className = 'w-12 h-12 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 font-extrabold text-lg active:scale-95 transition-transform';
  clrBtn.onclick = () => sudokuInput(0);
  pad.appendChild(clrBtn);
}

function sudokuInput(num) {
  if (sudokuSelectedCell === null) return;
  if (sudokuPuzzle[sudokuSelectedCell] !== 0) return;
  sudokuUserGrid[sudokuSelectedCell] = num;
  const cell = document.getElementById(`sdkCell-${sudokuSelectedCell}`);
  if (cell) cell.textContent = num !== 0 ? num : '';
}

function checkSudoku() {
  const fb = document.getElementById('sudokuFeedback');
  // Check if complete
  const allFilled = sudokuUserGrid.every(v => v !== 0);
  if (!allFilled) {
    if (fb) fb.textContent = 'Fill all cells first!';
    return;
  }
  const correct = sudokuUserGrid.every((v, i) => v === sudokuSolution[i]);
  if (correct) {
    if (fb) { fb.textContent = 'Solved! Well done!'; fb.className = 'text-sm font-bold text-green-600 text-center'; }
    submitGameScore('sudoku', 100);
  } else {
    if (fb) { fb.textContent = 'Some cells are wrong. Keep trying!'; fb.className = 'text-sm font-bold text-red-500 text-center'; }
    // Highlight wrong cells
    for (let i = 0; i < 16; i++) {
      const cell = document.getElementById(`sdkCell-${i}`);
      if (!cell) continue;
      if (sudokuPuzzle[i] === 0 && sudokuUserGrid[i] !== 0 && sudokuUserGrid[i] !== sudokuSolution[i]) {
        cell.classList.add('ring-2', 'ring-red-400');
      }
    }
    setTimeout(() => {
      for (let i = 0; i < 16; i++) document.getElementById(`sdkCell-${i}`)?.classList.remove('ring-2', 'ring-red-400');
      if (fb) fb.className = 'text-sm font-bold min-h-[20px] text-center';
    }, 1500);
  }
}

// --- HIDDEN OBJECTS GAME ---
const HO_KITCHEN_BACKGROUND = `
<svg viewBox="0 0 400 300" width="100%" height="100%" style="position:absolute; top:0; left:0; width:100%; height:100%;">
  <!-- Floor -->
  <rect x="0" y="200" width="400" height="100" fill="#d2b48c" />
  <!-- Wall -->
  <rect x="0" y="0" width="400" height="200" fill="#f5f5dc" />
  <!-- Window -->
  <rect x="50" y="30" width="80" height="80" fill="#add8e6" stroke="#8b4513" stroke-width="4" />
  <line x1="90" y1="30" x2="90" y2="110" stroke="#8b4513" stroke-width="2" />
  <line x1="50" y1="70" x2="130" y2="70" stroke="#8b4513" stroke-width="2" />
  <!-- Wall Clock -->
  <circle cx="200" cy="55" r="22" fill="#fff" stroke="#8b4513" stroke-width="3" />
  <line x1="200" y1="55" x2="200" y2="40" stroke="#333" stroke-width="2" />
  <line x1="200" y1="55" x2="212" y2="55" stroke="#333" stroke-width="2" />
  <!-- Shelf -->
  <rect x="260" y="45" width="110" height="8" fill="#8b4513" />
  <!-- Table -->
  <rect x="130" y="165" width="140" height="12" fill="#a0522d" rx="2" />
  <rect x="145" y="177" width="12" height="45" fill="#a0522d" />
  <rect x="225" y="177" width="12" height="45" fill="#a0522d" />
  <!-- Stove/Counter -->
  <rect x="0" y="170" width="90" height="60" fill="#b0c4de" />
  <rect x="0" y="160" width="95" height="10" fill="#708090" />
  <circle cx="30" cy="165" r="8" fill="#555" />
  <circle cx="65" cy="165" r="8" fill="#555" />
</svg>`;

const HO_ITEMS_POOL = [
  { label: 'Teapot', icon: '🫖', x: 30, y: 50 },
  { label: 'Clock', icon: '🕰', x: 50, y: 18.3 },
  { label: 'Book', icon: '📖', x: 48, y: 51 },
  { label: 'Candle', icon: '🕯', x: 78, y: 10 },
  { label: 'Key', icon: '🗝', x: 7.5, y: 62 },
  { label: 'Radio', icon: '📻', x: 68, y: 50 },
  { label: 'Apple', icon: '🍎', x: 38, y: 52 },
  { label: 'Coffee Cup', icon: '☕', x: 18.5, y: 50 }
];

let hoActiveItems = [];
let hoFound = new Set();

function startHiddenObjects() {
  hoFound = new Set();
  
  // Pick 6 random items from the pool of 8 to keep it fresh
  hoActiveItems = [...HO_ITEMS_POOL].sort(() => Math.random() - 0.5).slice(0, 6);
  
  renderHOScene();
  renderHOItemList();
  updateHOCounter();
  
  const fb = document.getElementById('hoFeedback');
  if (fb) {
    fb.textContent = 'Tap each hidden item when you spot it!';
    fb.className = 'text-sm font-bold text-[var(--text-muted)] text-center min-h-[20px]';
  }
  const btn = document.getElementById('hoStartBtn');
  if (btn) btn.textContent = 'New Game';
}

function renderHOScene() {
  const scene = document.getElementById('hoScene');
  if (!scene) return;
  scene.innerHTML = '';

  // Render Illustrated SVG Kitchen background
  const bgContainer = document.createElement('div');
  bgContainer.className = 'absolute inset-0';
  bgContainer.innerHTML = HO_KITCHEN_BACKGROUND;
  scene.appendChild(bgContainer);

  // Render camouflaged items
  hoActiveItems.forEach(item => {
    const el = document.createElement('button');
    // We apply strong filters, reduced opacity and blend mode to camouflage the items in the scene
    el.style.cssText = `position:absolute;left:${item.x}%;top:${item.y}%;transform:translate(-50%,-50%);font-size:24px;line-height:1;background:transparent;border:none;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;opacity:0.22;filter:grayscale(60%) sepia(30%) contrast(90%);mix-blend-mode:multiply;`;
    el.textContent = item.icon;
    el.title = item.label;
    el.onclick = () => handleHOTap(item.label, el);
    
    if (hoFound.has(item.label)) {
      el.style.opacity = '1.0';
      el.style.filter = 'none';
      el.style.transform = 'translate(-50%,-50%) scale(1.2)';
      el.disabled = true;
    }
    scene.appendChild(el);
  });
}

function handleHOTap(label, el) {
  if (hoFound.has(label)) return;
  hoFound.add(label);
  
  // Highlight and reveal item
  el.style.opacity = '1.0';
  el.style.filter = 'none';
  el.style.transform = 'translate(-50%,-50%) scale(1.2)';
  el.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  el.disabled = true;
  
  // Confetti / sparkle impact
  el.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.8)';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = 'rgba(253, 243, 219, 0.8)';
  
  const fb = document.getElementById('hoFeedback');
  if (fb) {
    fb.textContent = `Found: ${label}!`;
    fb.className = 'text-sm font-bold text-green-600 text-center min-h-[20px]';
  }
  
  updateHOItemList(label);
  updateHOCounter();
  
  if (hoFound.size === hoActiveItems.length) {
    if (fb) {
      fb.textContent = 'All items found! You have great focus!';
      fb.className = 'text-sm font-bold text-green-600 text-center min-h-[20px]';
    }
    submitGameScore('hidden-objects', 100);
  }
}

function renderHOItemList() {
  const list = document.getElementById('hoItemList');
  if (!list) return;
  list.innerHTML = '';
  hoActiveItems.forEach(item => {
    const span = document.createElement('span');
    span.id = `hoItem-${item.label}`;
    span.textContent = `🔍 ${item.label}`;
    span.className = 'px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all';
    list.appendChild(span);
  });
}

function updateHOItemList(label) {
  const el = document.getElementById(`hoItem-${label}`);
  if (el) {
    el.textContent = `✓ ${label}`;
    el.className = 'px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold border border-green-600 line-through scale-95 opacity-70';
  }
}

function updateHOCounter() {
  const el = document.getElementById('hoFoundCounter');
  if (el) el.textContent = `Found: ${hoFound.size}/${hoActiveItems.length}`;
}

// --- GROCERY MATH GAME ---
const GM_ITEMS_POOL = [
  { name: 'Bread', price: 25 }, { name: 'Milk', price: 30 }, { name: 'Eggs', price: 60 },
  { name: 'Rice', price: 80 }, { name: 'Tea', price: 45 }, { name: 'Sugar', price: 40 },
  { name: 'Salt', price: 20 }, { name: 'Biscuit', price: 15 }, { name: 'Soap', price: 35 },
];
let gmRound = 0;
let gmScore = 0;
const GM_TOTAL_ROUNDS = 8;

function startGroceryMath() {
  gmRound = 0;
  gmScore = 0;
  const btn = document.getElementById('gmStartBtn');
  if (btn) btn.classList.add('hidden');
  renderGroceryRound();
}

function renderGroceryRound() {
  if (gmRound >= GM_TOTAL_ROUNDS) {
    const fb = document.getElementById('gmFeedback');
    if (fb) fb.textContent = `Finished! Score: ${gmScore}/${GM_TOTAL_ROUNDS}`;
    document.getElementById('gmItemDisplay').innerHTML = '';
    document.getElementById('gmQuestion').textContent = '';
    document.getElementById('gmOptions').innerHTML = '';
    const btn = document.getElementById('gmStartBtn');
    if (btn) { btn.classList.remove('hidden'); btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">replay</span> Play Again'; }
    submitGameScore('grocery-math', Math.round((gmScore / GM_TOTAL_ROUNDS) * 100));
    return;
  }

  // Pick 2-3 random items
  const pool = [...GM_ITEMS_POOL].sort(() => Math.random() - 0.5);
  const count = Math.random() > 0.5 ? 3 : 2;
  const items = pool.slice(0, count);
  const correct = items.reduce((sum, it) => sum + it.price, 0);

  // Display items
  const display = document.getElementById('gmItemDisplay');
  if (display) {
    display.innerHTML = '';
    items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800';
      row.innerHTML = `<span class="text-sm font-semibold text-[var(--text-main)]">${item.name}</span><span class="text-sm font-extrabold text-green-700 dark:text-green-400">₹${item.price}</span>`;
      display.appendChild(row);
    });
  }

  const q = document.getElementById('gmQuestion');
  if (q) q.textContent = 'What is the total?';

  // Generate distractors
  const wrongs = new Set();
  while (wrongs.size < 3) {
    const w = correct + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 5 : -5);
    if (w > 0 && w !== correct) wrongs.add(w);
  }
  const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);

  const opts = document.getElementById('gmOptions');
  if (opts) {
    opts.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = `₹${opt}`;
      btn.className = 'py-3 rounded-xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-200 font-extrabold text-base active:scale-95 transition-all';
      btn.onclick = () => handleGMAnswer(opt === correct, btn, opts);
      opts.appendChild(btn);
    });
  }

  const counter = document.getElementById('gmScoreCounter');
  if (counter) counter.textContent = `${gmScore} / ${GM_TOTAL_ROUNDS}`;
  const fb = document.getElementById('gmFeedback');
  if (fb) { fb.textContent = `Round ${gmRound + 1} of ${GM_TOTAL_ROUNDS}`; fb.className = 'text-sm font-bold text-[var(--text-muted)] text-center'; }
}

function handleGMAnswer(correct, btn, opts) {
  opts.querySelectorAll('button').forEach(b => b.disabled = true);
  const fb = document.getElementById('gmFeedback');
  if (correct) {
    btn.classList.add('border-green-600', 'bg-green-200', 'dark:bg-green-800');
    if (fb) { fb.textContent = 'Correct!'; fb.className = 'text-sm font-bold text-green-600 text-center'; }
    gmScore++;
  } else {
    btn.classList.add('border-red-500', 'bg-red-100', 'dark:bg-red-900/30');
    if (fb) { fb.textContent = 'Not quite — check the total!'; fb.className = 'text-sm font-bold text-red-500 text-center'; }
  }
  gmRound++;
  setTimeout(renderGroceryRound, 1200);
}

// --- SHAPE MATCHING GAME ---
const SM_SHAPES = [
  { name: 'Circle', svg: '<circle cx="40" cy="40" r="36" fill="#3b82f6"/>', shadow: '<circle cx="40" cy="40" r="36" fill="#1e293b"/>' },
  { name: 'Square', svg: '<rect x="8" y="8" width="64" height="64" rx="4" fill="#8b5cf6"/>', shadow: '<rect x="8" y="8" width="64" height="64" rx="4" fill="#1e293b"/>' },
  { name: 'Triangle', svg: '<polygon points="40,6 74,74 6,74" fill="#ef4444"/>', shadow: '<polygon points="40,6 74,74 6,74" fill="#1e293b"/>' },
  { name: 'Star', svg: '<polygon points="40,4 49,30 76,30 55,47 62,74 40,57 18,74 25,47 4,30 31,30" fill="#f59e0b"/>', shadow: '<polygon points="40,4 49,30 76,30 55,47 62,74 40,57 18,74 25,47 4,30 31,30" fill="#1e293b"/>' },
  { name: 'Pentagon', svg: '<polygon points="40,4 74,30 62,70 18,70 6,30" fill="#10b981"/>', shadow: '<polygon points="40,4 74,30 62,70 18,70 6,30" fill="#1e293b"/>' },
  { name: 'Diamond', svg: '<polygon points="40,4 74,40 40,76 6,40" fill="#ec4899"/>', shadow: '<polygon points="40,4 74,40 40,76 6,40" fill="#1e293b"/>' },
  { name: 'Cross', svg: '<path d="M30,4 H50 V30 H76 V50 H50 V76 H30 V50 H4 V30 H30 Z" fill="#06b6d4"/>', shadow: '<path d="M30,4 H50 V30 H76 V50 H50 V76 H30 V50 H4 V30 H30 Z" fill="#1e293b"/>' },
  { name: 'Arrow', svg: '<polygon points="40,4 72,40 54,40 54,76 26,76 26,40 8,40" fill="#f97316"/>', shadow: '<polygon points="40,4 72,40 54,40 54,76 26,76 26,40 8,40" fill="#1e293b"/>' },
];

let smRound = 0;
let smScore = 0;
let smCurrentShape = null;
const SM_TOTAL_ROUNDS = 8;

function startShapeMatching() {
  smRound = 0;
  smScore = 0;
  const btn = document.getElementById('smStartBtn');
  if (btn) btn.classList.add('hidden');
  renderShapeRound();
}

function renderShapeRound() {
  if (smRound >= SM_TOTAL_ROUNDS) {
    document.getElementById('smShapeDisplay').innerHTML = '';
    document.getElementById('smShadowDisplay').innerHTML = '';
    document.getElementById('smOptions').innerHTML = '';
    const fb = document.getElementById('smFeedback');
    if (fb) fb.textContent = `Done! Score: ${smScore}/${SM_TOTAL_ROUNDS}`;
    const btn = document.getElementById('smStartBtn');
    if (btn) { btn.classList.remove('hidden'); btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">replay</span> Play Again'; }
    submitGameScore('shape-matching', Math.round((smScore / SM_TOTAL_ROUNDS) * 100));
    return;
  }

  const roundEl = document.getElementById('smRound');
  if (roundEl) roundEl.textContent = `Round ${smRound + 1} / ${SM_TOTAL_ROUNDS}`;

  // Pick a shape
  const shuffled = [...SM_SHAPES].sort(() => Math.random() - 0.5);
  smCurrentShape = shuffled[0];

  // Display colored shape
  const shapeEl = document.getElementById('smShapeDisplay');
  if (shapeEl) shapeEl.innerHTML = `<svg viewBox="0 0 80 80" width="80" height="80">${smCurrentShape.svg}</svg>`;

  // Display its shadow
  const shadowEl = document.getElementById('smShadowDisplay');
  if (shadowEl) shadowEl.innerHTML = `<svg viewBox="0 0 80 80" width="80" height="80">${smCurrentShape.shadow}</svg>`;

  // 3 options: correct + 2 wrong
  const wrongs = shuffled.slice(1, 3);
  const options = [{ shape: smCurrentShape, correct: true }, ...wrongs.map(s => ({ shape: s, correct: false }))].sort(() => Math.random() - 0.5);

  const opts = document.getElementById('smOptions');
  if (!opts) return;
  opts.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.innerHTML = `<svg viewBox="0 0 80 80" width="56" height="56" style="opacity:0.5;">${opt.shape.shadow}</svg><div style="font-size:10px;font-weight:700;margin-top:4px;">${opt.shape.name}</div>`;
    btn.className = 'flex flex-col items-center p-2 rounded-xl border-2 border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/30 active:scale-95 transition-all';
    btn.onclick = () => handleSMAnswer(opt.correct, btn, opts);
    opts.appendChild(btn);
  });

  const fb = document.getElementById('smFeedback');
  if (fb) { fb.textContent = ''; fb.className = 'text-sm font-bold min-h-[20px]'; }
  const sc = document.getElementById('smScoreCounter');
  if (sc) sc.textContent = `Score: ${smScore}/${SM_TOTAL_ROUNDS}`;
}

function handleSMAnswer(correct, btn, opts) {
  opts.querySelectorAll('button').forEach(b => b.disabled = true);
  const fb = document.getElementById('smFeedback');
  if (correct) {
    btn.classList.add('border-green-500', 'bg-green-100', 'dark:bg-green-900/40');
    if (fb) fb.textContent = 'Correct match!';
    smScore++;
    const sc = document.getElementById('smScoreCounter');
    if (sc) sc.textContent = `Score: ${smScore}/${SM_TOTAL_ROUNDS}`;
  } else {
    btn.classList.add('border-red-500', 'bg-red-100', 'dark:bg-red-900/40');
    if (fb) fb.textContent = `That was ${btn.querySelector('div')?.textContent}. Try next!`;
  }
  smRound++;
  setTimeout(renderShapeRound, 1200);
}

// --- WIDE-TRACK MAZE GAME (HTML GRID + ACCESSIBLE SWIPES + D-PAD) ---
let mazeTimerInterval = null;
let mazeSeconds = 0;
let mazeActive = false;
let mazePlayerPos = [0, 0];

const MAZE_CONFIGS = {
  easy: {
    walls: [
      [[1,0,1,1], [1,0,0,0], [1,1,0,0], [1,0,1,1], [1,1,0,0]],
      [[1,0,0,1], [0,1,1,0], [0,0,1,1], [1,0,0,0], [0,1,1,0]],
      [[0,1,0,1], [1,0,0,1], [1,1,0,0], [0,0,1,1], [1,1,0,0]],
      [[0,0,1,1], [0,1,1,0], [0,0,0,1], [1,1,0,0], [0,1,1,1]],
      [[1,0,1,1], [1,0,1,0], [0,0,1,0], [0,0,1,0], [1,1,1,0]]
    ],
    start: [0, 0],
    exit: [4, 4]
  },
  medium: {
    walls: [
      [[1,0,0,1], [1,0,1,0], [1,1,0,0], [1,0,1,1], [1,1,0,0]],
      [[0,1,0,1], [1,0,0,1], [0,1,1,0], [1,0,0,1], [0,1,1,0]],
      [[0,0,1,1], [0,1,0,0], [1,0,1,1], [0,1,1,0], [1,1,0,1]],
      [[1,1,0,0], [0,0,1,1], [1,0,0,0], [1,1,0,0], [0,1,1,1]],
      [[0,0,1,1], [1,0,1,0], [0,0,1,0], [0,0,1,0], [1,1,1,0]]
    ],
    start: [0, 0],
    exit: [4, 4]
  },
  hard: {
    walls: [
      [[1,0,1,1], [1,1,0,0], [1,0,1,1], [1,0,0,0], [1,1,1,0]],
      [[1,0,0,1], [0,0,1,0], [1,1,0,0], [0,1,1,1], [1,1,0,1]],
      [[0,1,0,1], [1,0,0,1], [0,1,1,0], [1,0,0,1], [0,1,1,0]],
      [[0,0,1,1], [0,1,1,0], [1,0,0,1], [0,0,1,0], [1,1,0,1]],
      [[1,0,1,1], [1,0,1,0], [0,0,1,0], [1,0,1,0], [0,1,1,0]]
    ],
    start: [0, 0],
    exit: [4, 4]
  }
};

function getActiveMazeConfig() {
  const select = document.getElementById('mazeDifficultySelect');
  const diff = select ? select.value : 'medium';
  return MAZE_CONFIGS[diff] || MAZE_CONFIGS.medium;
}

function startMaze() {
  clearInterval(mazeTimerInterval);
  mazeSeconds = 0;
  mazeActive = true;
  
  const config = getActiveMazeConfig();
  mazePlayerPos = [...config.start];

  const fb = document.getElementById('mazeFeedback');
  if (fb) {
    fb.textContent = 'Guide the smiley (●) to the green EXIT!';
    fb.className = 'text-sm font-bold text-[var(--text-muted)] text-center min-h-[20px]';
  }
  const btn = document.getElementById('mazeStartBtn');
  if (btn) btn.textContent = 'Restart';

  mazeTimerInterval = setInterval(() => {
    mazeSeconds++;
    const timer = document.getElementById('mazeTimer');
    if (timer) timer.textContent = `${mazeSeconds}s`;
  }, 1000);

  drawMaze();
  setupMazeSwipeControls();
}

function drawMaze() {
  const grid = document.getElementById('mazeGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const config = getActiveMazeConfig();
  const walls = config.walls;
  const size = config.walls.length;

  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement('div');
      cell.className = 'flex items-center justify-center bg-white dark:bg-slate-900 transition-colors relative';
      
      // Apply borders based on walls config [top, right, bottom, left]
      const cellWalls = walls[r][c];
      let borderStyle = '';
      if (cellWalls[0] === 1) borderStyle += 'border-top: 4px solid #475569; ';
      if (cellWalls[1] === 1) borderStyle += 'border-right: 4px solid #475569; ';
      if (cellWalls[2] === 1) borderStyle += 'border-bottom: 4px solid #475569; ';
      if (cellWalls[3] === 1) borderStyle += 'border-left: 4px solid #475569; ';
      
      cell.style.cssText = borderStyle;

      // Draw player or exit
      if (r === mazePlayerPos[0] && c === mazePlayerPos[1]) {
        // Player marker
        const marker = document.createElement('span');
        marker.className = 'text-2xl animate-pulse';
        marker.textContent = '😊';
        cell.appendChild(marker);
      } else if (r === config.exit[0] && c === config.exit[1]) {
        // Exit marker
        cell.className += ' bg-emerald-100 dark:bg-emerald-950/40';
        const exitText = document.createElement('span');
        exitText.className = 'text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest';
        exitText.textContent = 'EXIT';
        cell.appendChild(exitText);
      }

      grid.appendChild(cell);
    }
  }
}

function setupMazeSwipeControls() {
  const grid = document.getElementById('mazeGrid');
  if (!grid) return;

  let startX = 0;
  let startY = 0;

  grid.ontouchstart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  grid.ontouchend = (e) => {
    if (!startX || !startY) return;
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;

    // Threshold of 30px swipe
    if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        tryMazeMove(0, diffX > 0 ? 1 : -1);
      } else {
        // Vertical swipe
        tryMazeMove(diffY > 0 ? 1 : -1, 0);
      }
    }
    startX = 0;
    startY = 0;
  };
}

function tryMazeMove(dr, dc) {
  if (!mazeActive) return;
  const config = getActiveMazeConfig();
  const walls = config.walls;
  const size = walls.length;

  const r = mazePlayerPos[0];
  const c = mazePlayerPos[1];
  const nr = r + dr;
  const nc = c + dc;

  if (nr < 0 || nr >= size || nc < 0 || nc >= size) return;

  // Verify walls:
  const currentCellWalls = walls[r][c];
  const targetCellWalls = walls[nr][nc];

  let blocked = false;
  if (dr === -1 && (currentCellWalls[0] === 1 || targetCellWalls[2] === 1)) blocked = true; // UP
  if (dc === 1 && (currentCellWalls[1] === 1 || targetCellWalls[3] === 1)) blocked = true;  // RIGHT
  if (dr === 1 && (currentCellWalls[2] === 1 || targetCellWalls[0] === 1)) blocked = true;  // DOWN
  if (dc === -1 && (currentCellWalls[3] === 1 || targetCellWalls[1] === 1)) blocked = true; // LEFT

  if (blocked) {
    const fb = document.getElementById('mazeFeedback');
    if (fb) {
      fb.textContent = 'Oops, blocked by a wall!';
      fb.className = 'text-sm font-bold text-red-500 text-center min-h-[20px]';
    }
    return;
  }

  mazePlayerPos = [nr, nc];
  drawMaze();

  const fb = document.getElementById('mazeFeedback');
  if (fb) {
    fb.textContent = 'Moving...';
    fb.className = 'text-sm font-bold text-indigo-600 text-center min-h-[20px]';
  }

  if (nr === config.exit[0] && nc === config.exit[1]) {
    mazeActive = false;
    clearInterval(mazeTimerInterval);
    if (fb) {
      fb.textContent = `Completed in ${mazeSeconds} seconds! Brilliant!`;
      fb.className = 'text-sm font-bold text-green-600 text-center min-h-[20px]';
    }
    // Score based on time taken (min score 30, max score 100)
    const score = Math.max(30, Math.min(100, 500 - (mazeSeconds * 5)));
    submitGameScore('wide-maze', score);
  }
}

function stopMazeGame() {
  clearInterval(mazeTimerInterval);
  mazeActive = false;
}

// Helper: submit score for any game ID
function submitGameScore(gameId, score) {
  const gameNames = {
    'word-search': 'Word Search',
    'tangram': 'Tangram Puzzles',
    'sudoku': 'Sudoku',
    'hidden-objects': 'Hidden Objects',
    'grocery-math': 'Grocery Math',
    'shape-matching': 'Shape Matching',
    'wide-maze': 'Wide-Track Maze',
  };
  const title = gameNames[gameId] || gameId;
  const diff = getAdaptedDifficulty();
  const entry = {
    game: title, score, difficulty: diff,
    date: new Date().toLocaleDateString(), timestamp: Date.now(),
  };
  state.gameHistory.push(entry);
  state.leaderboard = state.leaderboard || [];
  state.leaderboard.push({ name: state.profile?.name || 'Player', score, game: title });
  state.leaderboard.sort((a, b) => b.score - a.score);
  if (state.leaderboard.length > 20) state.leaderboard = state.leaderboard.slice(0, 20);
  saveState();
  showToast(`${title}: ${score} pts`, 'star');
  submitScoreToBackend(state.profile?.name || 'Player', score, title).catch(() => {});
}

// --- INITIALIZATION ---
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    populateSimulatedStreakHistory();
    checkProfileStatus();
    fetchDeviceLocation();
    switchTab(state.currentTab || 'home');
  });
}
