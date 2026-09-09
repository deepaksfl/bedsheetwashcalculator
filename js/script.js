const form = document.getElementById('calc-form');
const selectLastWash = document.getElementById('select-last-wash');
const customDateWrap = document.getElementById('date-custom-wrap');
const exactDateInput = document.getElementById('exact-date-input');

let currentCalculatedSheetDays = 9;
let currentTargetDate = new Date();

const initDate = new Date();
initDate.setDate(initDate.getDate() - 5);
exactDateInput.value = initDate.toISOString().split('T')[0];

function rateCalculator() {
  const feedback = document.getElementById('rating-feedback');
  feedback.style.display = 'block';
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 3000);
}

function triggerNativeShare() {
  if (navigator.share) {
    navigator.share({
      title: 'BedsheetWashCalculator.com',
      text: 'Check when your bed sheets actually need washing!',
      url: window.location.href,
    }).catch(() => {});
  } else {
    copyEnjoyLink();
  }
}

function copyEnjoyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const toast = document.getElementById('enjoy-copy-toast');
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  });
}

function toggleFabricGuide() {
  const guide = document.getElementById('fabric-guide');
  guide.style.display = guide.style.display === 'block' ? 'none' : 'block';
}

function toggleOptionalSection() {
  const sec = document.getElementById('optional-section');
  const icon = document.getElementById('opt-toggle-icon');
  if (sec.style.display === 'block') {
    sec.style.display = 'none';
    icon.innerText = '▾';
  } else {
    sec.style.display = 'block';
    icon.innerText = '▴';
  }
}

function handleLastWashChange() {
  if (selectLastWash.value === 'custom') {
    customDateWrap.style.display = 'block';
  } else {
    customDateWrap.style.display = 'none';
  }
  recalculate();
}

function recalculate() {
  let sheetDays = 14;
  let pillowDays = 7;
  let duvetWeeks = 4;
  let temp = "60°C (140°F)";
  let dry = "Tumble Warm / Sun";
  let protector = "Recommended";
  let notes = [];

  // 1. Occupancy
  const sleepers = document.getElementById('select-sleepers').value;
  if (sleepers === "2") {
    sheetDays -= 3;
    duvetWeeks = Math.max(2, duvetWeeks - 1);
  } else if (sleepers === "family") {
    sheetDays -= 5;
    pillowDays -= 2;
    duvetWeeks = Math.max(2, duvetWeeks - 2);
    protector = "Critical (Waterproof)";
    notes.push("Family co-sleeping significantly concentrates saliva, crumbs, and body heat; a waterproof mattress protector is essential.");
  } else if (sleepers === "dorm") {
    sheetDays -= 2;
    notes.push("Dorm rooms accumulate elevated airborne dust and shared building particulates; wash every 7–9 days.");
  }

  // 2. Skin Contact & Barrier
  const attire = document.getElementById('select-attire').value;
  if (attire === "light") {
    sheetDays -= 2;
  } else if (attire === "nude") {
    sheetDays -= 4;
    notes.push("Direct skin-on-sheet contact deposits natural body oils and dead skin cells straight into the weave; wash weekly.");
  } else if (attire === "pajamas") {
    notes.push("Full-coverage sleepwear acts as a barrier, trapping body oils so your sheets stay fresh longer.");
  }

  // 3. Touch & Feel Fabric Logic
  const fabric = document.getElementById('select-fabric').value;
  if (fabric === "standard") {
    temp = "60°C (140°F)";
    notes.push("For regular everyday sheets, a warm 60°C wash effectively sanitizes without risking fabric damage.");
  } else if (fabric === "cotton") {
    temp = "60°C (140°F)";
    notes.push("Natural cotton weaves withstand higher wash temperatures, which is ideal for dissolving dust mite allergens.");
  } else if (fabric === "silk") {
    temp = "30°C (85°F) Delicate";
    dry = "Air / Line Dry Only";
    notes.push("Glossy silk/satin fabrics require cold water and enzyme-free gentle detergent to protect delicate fibers.");
  } else if (fabric === "poly") {
    sheetDays -= 1;
    notes.push("Synthetic microfiber holds onto body oils and odor faster than natural cotton weaves.");
  } else if (fabric === "flannel") {
    temp = "40°C (105°F)";
    notes.push("Fuzzy flannel sheets trap lint and loose dead skin deeply in their brushed pile; shake out before washing.");
  }

  // 4. Shower & Climate
  const shower = document.getElementById('select-shower').value;
  if (shower === "morning") {
    sheetDays -= 2;
    pillowDays -= 2;
  }

  const climate = document.getElementById('select-climate').value;
  if (climate === "warm") {
    sheetDays -= 3;
    pillowDays -= 2;
  }

  // 5. Special Circumstances
  const pets = document.getElementById('select-pets').value;
  if (pets === "top") {
    sheetDays -= 2;
    duvetWeeks = Math.max(2, duvetWeeks - 1);
    notes.push("Pets sleeping on the duvet transfer fur and dander to the top layer; wash or vacuum the duvet cover regularly.");
  } else if (pets === "inside") {
    sheetDays -= 4;
    pillowDays -= 2;
    duvetWeeks = Math.max(1, duvetWeeks - 2);
    notes.push("Pets under the covers bring outdoor dirt, dander, and shed fur directly onto sheets; wash weekly or every 3–4 days.");
  }

  const skincare = document.getElementById('select-skincare').value;
  if (skincare === "creams") {
    pillowDays = Math.min(pillowDays, 4);
    notes.push("Night balms, serums, and hair oils transfer into pillow fabric; rotate pillowcases every 3–4 days to prevent stale oil oxidation.");
  } else if (skincare === "acne") {
    pillowDays = Math.min(pillowDays, 2);
    notes.push("For acne-prone skin, dermatologists recommend changing pillowcases every 2–3 days to stop bacteria and sebum re-clogging facial pores.");
  }

  const allergies = document.getElementById('select-allergies').value;
  if (allergies === "mild") {
    sheetDays -= 1;
  } else if (allergies === "severe") {
    sheetDays = Math.min(sheetDays, 7);
    pillowDays = Math.min(pillowDays, 4);
    if (fabric !== "silk") temp = "60°C (140°F)+ Sanitize";
    notes.push("Dust mite allergy proteins only denature at 60°C (140°F) or above; hot washing every 7 days is essential for asthma control.");
  }

  const illness = document.getElementById('select-illness').value;
  if (illness === "sick") {
    sheetDays = 3;
    pillowDays = 2;
    if (fabric !== "silk") temp = "60°C (140°F)+ Sanitize";
    notes.unshift("Active/recent illness requires stripping sheets and pillowcases immediately after fever breaks to eliminate lingering microbes.");
  }

  // Clamp Bounds
  sheetDays = Math.max(3, Math.min(14, sheetDays));
  pillowDays = Math.max(2, Math.min(7, pillowDays));
  duvetWeeks = Math.max(1, Math.min(4, duvetWeeks));

  currentCalculatedSheetDays = sheetDays;

  // 6. Last Wash & Status Calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWashVal = selectLastWash.value;
  let statusClass = "status-fresh";
  let statusMsg = "";
  let targetDate = new Date(today);

  if (lastWashVal === 'unknown') {
    statusClass = "status-overdue";
    statusMsg = "Immediate Wash Required: Reset hygiene & wash today";
    targetDate = new Date(today);
    notes.unshift("If you cannot remember the last wash date, microbial loads and skin cell debris have peaked. Strip your bed and wash immediately.");
  } else {
    let daysAgo = 0;

    if (lastWashVal === 'custom') {
      const pickedDate = new Date(exactDateInput.value);
      if (!isNaN(pickedDate.getTime())) {
        const diffTime = today.getTime() - pickedDate.getTime();
        daysAgo = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      }
    } else {
      daysAgo = parseInt(lastWashVal, 10);
    }

    const remainingDays = sheetDays - daysAgo;
    targetDate = new Date(today);
    targetDate.setDate(today.getDate() + remainingDays);

    if (remainingDays < 0) {
      statusClass = "status-overdue";
      const overdue = Math.abs(remainingDays);
      statusMsg = `Urgent: Overdue by ${overdue} day${overdue > 1 ? 's' : ''} — wash today!`;
    } else if (remainingDays === 0) {
      statusClass = "status-warn";
      statusMsg = "Due Today: Wash sheets tonight";
    } else if (remainingDays === 1) {
      statusClass = "status-warn";
      statusMsg = "Due Tomorrow (1 day remaining)";
    } else {
      statusClass = "status-fresh";
      statusMsg = `Fresh: ${remainingDays} days remaining until next wash`;
    }
  }

  currentTargetDate = targetDate;
  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString(undefined, dateOptions);

  const sheetStr = `Every ${sheetDays} Days`;
  const pillowStr = `Every ${pillowDays} Days`;
  const duvetStr = `Every ${duvetWeeks} Week${duvetWeeks > 1 ? 's' : ''}`;
  const finalNote = notes.length > 0 ? notes[0] : "Showering before bed preserves linen freshness up to 40% longer by avoiding outdoor dust transfer.";

  // DOM Updates (Desktop)
  document.getElementById('d-sheet-days').innerText = sheetStr;
  document.getElementById('d-pillow-days').innerText = pillowStr;
  document.getElementById('d-duvet-days').innerText = duvetStr;
  document.getElementById('d-temp').innerText = temp;
  document.getElementById('d-protector').innerText = protector;
  document.getElementById('d-tip-text').innerText = finalNote;
  document.getElementById('d-next-date').innerText = (lastWashVal === 'unknown') ? "Immediate (Wash Today)" : formattedDate;

  const dStatusBanner = document.getElementById('d-status-banner');
  dStatusBanner.className = `integrated-status-badge ${statusClass}`;
  document.getElementById('d-status-text').innerText = statusMsg;

  // DOM Updates (Mobile)
  document.getElementById('m-bar-sub').innerText = statusMsg;
  document.getElementById('m-bar-val').innerText = sheetStr;
  document.getElementById('m-sheet-days').innerText = sheetStr;
  document.getElementById('m-pillow-days').innerText = pillowStr;
  document.getElementById('m-duvet-days').innerText = duvetStr;
  document.getElementById('m-temp').innerText = temp;
  document.getElementById('m-protector').innerText = protector;
  document.getElementById('m-tip-text').innerText = finalNote;
  document.getElementById('m-next-date').innerText = (lastWashVal === 'unknown') ? "Immediate (Wash Today)" : formattedDate;

  const mStatusBanner = document.getElementById('m-status-banner');
  mStatusBanner.className = `integrated-status-badge ${statusClass}`;
  document.getElementById('m-status-text').innerText = statusMsg;

  updateGoogleCalendarUrl(sheetDays, targetDate);
}

function updateGoogleCalendarUrl(intervalDays, targetDate) {
  const pad = (n) => (n < 10 ? '0' + n : n);
  const formatGCalDate = (d) =>
    d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T090000Z';

  const start = formatGCalDate(targetDate);
  const title = encodeURIComponent("Wash Bed Sheets & Linens");
  const details = encodeURIComponent(`Regular bed sheet change cycle (Every ${intervalDays} days). Wash at recommended hygiene temperature to keep dust mites and bacteria at bay.`);
  const recur = encodeURIComponent(`RRULE:FREQ=DAILY;INTERVAL=${intervalDays}`);

  const gcalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${start}&details=${details}&recur=${recur}`;
  const gcalBtn = document.getElementById('btn-gcal');
  const gcalBtnMobile = document.getElementById('btn-gcal-mobile');
  if (gcalBtn) gcalBtn.href = gcalLink;
  if (gcalBtnMobile) gcalBtnMobile.href = gcalLink;
}

function openDrawer() {
  document.getElementById('sheet-overlay').style.display = 'flex';
}

function closeDrawer() {
  document.getElementById('sheet-overlay').style.display = 'none';
}

function handleOverlayClick(e) {
  if (e.target.id === 'sheet-overlay') closeDrawer();
}

function exportCalendarReminder() {
  const now = new Date();
  const target = new Date(currentTargetDate);
  target.setHours(9, 0, 0, 0);

  const pad = (n) => (n < 10 ? '0' + n : n);
  const formatDateICS = (d) =>
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) + 'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) + '00Z';

  const start = formatDateICS(target);
  const end = formatDateICS(new Date(target.getTime() + 30 * 60000));

  const ics = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BedsheetWashCalculator//HygieneEngine//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wash-${Date.now()}@bedsheetwashcalculator.com
DTSTAMP:${formatDateICS(now)}
DTSTART:${start}
DTEND:${end}
RRULE:FREQ=DAILY;INTERVAL=${currentCalculatedSheetDays}
SUMMARY:Wash Bed Sheets & Linens
DESCRIPTION:Scheduled bed linen change cycle from BedsheetWashCalculator.com. Wash at optimal hygiene temperature to clear body oils and allergen proteins.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wash-bedsheets-schedule.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

form.addEventListener('change', recalculate);
selectLastWash.addEventListener('change', handleLastWashChange);
exactDateInput.addEventListener('change', recalculate);

handleLastWashChange();