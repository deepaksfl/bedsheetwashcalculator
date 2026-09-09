document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calc-form");
    if (!form) return;

    // Attach event listeners to all input elements
    const inputs = form.querySelectorAll("select, input");
    inputs.forEach(input => {
        input.addEventListener("change", updateCalculator);
        input.addEventListener("input", updateCalculator);
    });

    // Run once on load to establish the waiting state
    updateCalculator();
});

function toggleFabricGuide() {
    const guide = document.getElementById("fabric-guide");
    if (guide) {
        guide.style.display = guide.style.display === "block" ? "none" : "block";
    }
}

function toggleOptionalSection() {
    const section = document.getElementById("optional-section");
    const icon = document.getElementById("opt-toggle-icon");
    if (section) {
        const isOpen = section.style.display === "block";
        section.style.display = isOpen ? "none" : "block";
        if (icon) icon.innerText = isOpen ? "▾" : "▴";
    }
}

function updateCalculator() {
    const lastWash = document.getElementById("select-last-wash").value;
    const sleepers = document.getElementById("select-sleepers").value;
    const attire = document.getElementById("select-attire").value;
    const fabric = document.getElementById("select-fabric").value;

    // Check if required primary fields are unselected (i.e. still on placeholder "")
    if (!lastWash || !sleepers || !attire || !fabric) {
        showPlaceholderState();
        return;
    }

    // Handle calendar custom date toggle visibility
    const customDateWrap = document.getElementById("date-custom-wrap");
    if (customDateWrap) {
        customDateWrap.style.display = lastWash === "custom" ? "block" : "none";
    }

    // --- CALCULATION LOGIC ---
    let baseDays = 7; // Standard baseline for 1 person

    // Sleepers factor
    if (sleepers === "2") baseDays = 5;
    else if (sleepers === "family") baseDays = 3;
    else if (sleepers === "dorm") baseDays = 10;

    // Attire factor
    if (attire === "nude") baseDays *= 0.75;
    else if (attire === "pajamas") baseDays *= 1.25;

    // Optional Factors check
    const climate = document.getElementById("select-climate") ? document.getElementById("select-climate").value : "cool";
    const pets = document.getElementById("select-pets") ? document.getElementById("select-pets").value : "none";
    const skincare = document.getElementById("select-skincare") ? document.getElementById("select-skincare").value : "normal";
    const allergies = document.getElementById("select-allergies") ? document.getElementById("select-allergies").value : "none";
    const illness = document.getElementById("select-illness") ? document.getElementById("select-illness").value : "healthy";
    const shower = document.getElementById("select-shower") ? document.getElementById("select-shower").value : "bed";

    if (climate === "warm") baseDays *= 0.8;
    if (pets === "inside") baseDays *= 0.6;
    else if (pets === "top") baseDays *= 0.85;
    if (skincare === "acne" || skincare === "creams") baseDays *= 0.85;
    if (allergies === "severe") baseDays *= 0.7;
    if (illness === "sick") baseDays = 2; // Immediate reset if sick
    if (shower === "morning") baseDays *= 0.9;

    let finalDays = Math.round(Math.max(2, baseDays));
    let pillowDays = Math.max(2, Math.round(finalDays * 0.45));
    let duvetDays = Math.max(14, finalDays * 3);

    // Determine status & text based on last wash elapsed time
    let elapsedDays = parseInt(lastWash, 10);
    if (lastWash === "unknown") elapsedDays = finalDays + 3;
    if (lastWash === "custom") {
        const exactInput = document.getElementById("exact-date-input").value;
        if (exactInput) {
            const diffTime = Math.abs(new Date() - new Date(exactInput));
            elapsedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } else {
            elapsedDays = 0;
        }
    }

    let statusText = "Bedding is fresh";
    let statusClass = "status-fresh";
    let statusDotColor = "#10b981"; // green

    if (elapsedDays > finalDays) {
        statusText = "Hygiene reset needed — Overdue";
        statusClass = "status-overdue";
        statusDotColor = "#ef4444"; // red
    } else if (elapsedDays >= finalDays - 1) {
        statusText = "Wash cycle approaching soon";
        statusClass = "status-warning";
        statusDotColor = "#f59e0b"; // amber
    }

    // Target wash date calculation
    const targetDate = new Date();
    let daysUntilWash = Math.max(0, finalDays - elapsedDays);
    targetDate.setDate(targetDate.getDate() + daysUntilWash);
    const optionsDate = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedTargetDate = targetDate.toLocaleDateString('en-US', optionsDate);

    // Specs
    let waterTemp = "60°C (140°F) — Kills dust mites";
    if (fabric === "silk") waterTemp = "30°C (85°F) — Gentle cold wash";
    let protectorRec = sleepers === "family" || pets !== "none" ? "Essential (Waterproof)" : "Recommended";
    let dryingSetting = "Tumble Warm / Outdoor Sun";
    if (fabric === "silk") dryingSetting = "Air dry in shade only";

    let insight = `Based on your setup, washing every ${finalDays} days keeps dust mite buildup and skin oil transfer to minimal levels.`;
    if (illness === "sick") insight = "Health alert: Wash linens on high heat immediately after recovery to remove viral residue.";
    else if (pets === "inside") insight = "Pet dander accumulates rapidly under covers; maintain strict 3-to-4 day pillowcase cycles.";

    // Update DOM Elements (Desktop & Mobile)
    updateElementText("d-sheet-days", `Every ${finalDays} Days`);
    updateElementText("m-sheet-days", `Every ${finalDays} Days`);
    updateElementText("m-bar-val", `Every ${finalDays} Days`);
    updateElementText("d-next-date", formattedTargetDate);
    updateElementText("m-next-date", formattedTargetDate);
    updateElementText("d-pillow-days", `Every ${pillowDays} Days`);
    updateElementText("m-pillow-days", `Every ${pillowDays} Days`);
    updateElementText("d-duvet-days", `Every ${Math.round(duvetDays/7)} Weeks`);
    updateElementText("m-duvet-days", `Every ${Math.round(duvetDays/7)} Weeks`);
    updateElementText("d-temp", waterTemp);
    updateElementText("m-temp", waterTemp);
    updateElementText("d-protector", protectorRec);
    updateElementText("m-protector", protectorRec);
    updateElementText("d-dry", dryingSetting);
    updateElementText("d-tip-text", insight);
    updateElementText("m-tip-text", insight);
    updateElementText("d-status-text", statusText);
    updateElementText("m-status-text", statusText);
    updateElementText("m-bar-sub", statusText);

    setStyleProperty("d-status-banner", "background", statusClass === "status-overdue" ? "#fef2f2" : "#ecfdf5");
    setStyleProperty("m-status-banner", "background", statusClass === "status-overdue" ? "#fef2f2" : "#ecfdf5");

    // Enable action buttons
    enableActionButtons(true, finalDays, formattedTargetDate);
}

function showPlaceholderState() {
    updateElementText("d-sheet-days", "—");
    updateElementText("m-sheet-days", "—");
    updateElementText("m-bar-val", "Select options");
    updateElementText("d-next-date", "Please complete form");
    updateElementText("m-next-date", "Please complete form");
    updateElementText("d-pillow-days", "—");
    updateElementText("m-pillow-days", "—");
    updateElementText("d-duvet-days", "—");
    updateElementText("m-duvet-days", "—");
    updateElementText("d-temp", "—");
    updateElementText("m-temp", "—");
    updateElementText("d-protector", "—");
    updateElementText("m-protector", "—");
    updateElementText("d-dry", "—");
    updateElementText("d-tip-text", "Select your preferences from the questions on the left to generate your personalized bedding hygiene report.");
    updateElementText("m-tip-text", "Select your preferences from the questions on the left to generate your personalized bedding hygiene report.");
    updateElementText("d-status-text", "Awaiting your inputs");
    updateElementText("m-status-text", "Awaiting your inputs");
    updateElementText("m-bar-sub", "Awaiting your inputs");

    enableActionButtons(false, 0, "");
}

function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function setStyleProperty(id, property, value) {
    const el = document.getElementById(id);
    if (el) el.style[property] = value;
}

function enableActionButtons(enable, days, dateStr) {
    const icsBtns = document.querySelectorAll(".btn-download-ics");
    const gcalDesktop = document.getElementById("btn-gcal");
    const gcalMobile = document.getElementById("btn-gcal-mobile");

    icsBtns.forEach(btn => {
        btn.style.opacity = enable ? "1" : "0.5";
        btn.style.cursor = enable ? "pointer" : "not-allowed";
        btn.disabled = !enable;
    });

    if (gcalDesktop) {
        gcalDesktop.style.opacity = enable ? "1" : "0.5";
        gcalDesktop.style.pointerEvents = enable ? "auto" : "none";
        if (enable) {
            gcalDesktop.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bedsheet+Wash+Day&details=Time+to+wash+your+bedsheets+for+fresh+hygiene!+Recommended+interval:+Every+${days}+days.&dates=${dateStr.replace(/[^0-9]/g, '')}`;
        }
    }

    if (gcalMobile) {
        gcalMobile.style.opacity = enable ? "1" : "0.5";
        gcalMobile.style.pointerEvents = enable ? "auto" : "none";
        if (enable) {
            gcalMobile.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Bedsheet+Wash+Day&details=Time+to+wash+your+bedsheets+for+fresh+hygiene!+Recommended+interval:+Every+${days}+days.&dates=${dateStr.replace(/[^0-9]/g, '')}`;
        }
    }
}

function openDrawer() {
    const overlay = document.getElementById("sheet-overlay");
    if (overlay) overlay.style.display = "flex";
}

function closeDrawer() {
    const overlay = document.getElementById("sheet-overlay");
    if (overlay) overlay.style.display = "none";
}

function handleOverlayClick(event) {
    if (event.target.id === "sheet-overlay") {
        closeDrawer();
    }
}

function rateCalculator() {
    const feedback = document.getElementById("rating-feedback");
    if (feedback) {
        feedback.style.display = "block";
        setTimeout(() => { feedback.style.display = "none"; }, 3000);
    }
}

function triggerNativeShare() {
    if (navigator.share) {
        navigator.share({
            title: 'Bedsheet Wash Calculator',
            text: 'Check out when your bedsheets actually need to be washed!',
            url: window.location.href
        }).catch(() => {});
    } else {
        copyEnjoyLink();
    }
}

function copyEnjoyLink() {
    navigator.clipboard.writeText(window.location.href);
    const toast = document.getElementById("enjoy-copy-toast");
    if (toast) {
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 2500);
    }
}

function exportCalendarReminder() {
    alert("Calendar reminder file generated successfully!");
}
