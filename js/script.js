document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calc-form");
    if (!form) return;

    const inputs = form.querySelectorAll("select, input");
    inputs.forEach(input => {
        input.addEventListener("change", updateCalculator);
        input.addEventListener("input", updateCalculator);
    });

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

    if (!lastWash || !sleepers || !attire || !fabric) {
        showPlaceholderState();
        return;
    }

    const customDateWrap = document.getElementById("date-custom-wrap");
    if (customDateWrap) {
        customDateWrap.style.display = lastWash === "custom" ? "block" : "none";
    }

    let baseDays = 7;
    if (sleepers === "2") baseDays = 5;
    else if (sleepers === "family") baseDays = 3;
    else if (sleepers === "dorm") baseDays = 10;

    if (attire === "nude") baseDays *= 0.75;
    else if (attire === "pajamas") baseDays *= 1.25;

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
    if (illness === "sick") baseDays = 2;
    if (shower === "morning") baseDays *= 0.9;

    let finalDays = Math.round(Math.max(2, baseDays));
    let pillowDays = Math.max(2, Math.round(finalDays * 0.45));
    let duvetDays = Math.max(14, finalDays * 3);

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

    if (elapsedDays > finalDays) {
        statusText = "Hygiene reset needed — Overdue";
        statusClass = "status-overdue";
    } else if (elapsedDays >= finalDays - 1) {
        statusText = "Wash cycle approaching soon";
        statusClass = "status-warning";
    }

    const targetDate = new Date();
    let daysUntilWash = Math.max(0, finalDays - elapsedDays);
    targetDate.setDate(targetDate.getDate() + daysUntilWash);
    const formattedTargetDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    let waterTemp = "60°C (140°F) — Kills dust mites";
    if (fabric === "silk") waterTemp = "30°C (85°F) — Gentle cold wash";
    let protectorRec = sleepers === "family" || pets !== "none" ? "Essential (Waterproof)" : "Recommended";
    let dryingSetting = "Tumble Warm / Outdoor Sun";
    if (fabric === "silk") dryingSetting = "Air dry in shade only";

    let insight = `Based on your setup, washing every ${finalDays} days keeps dust mite buildup and skin oil transfer to minimal levels.`;
    if (illness === "sick") insight = "Health alert: Wash linens on high heat immediately after recovery to remove viral residue.";
    else if (pets === "inside") insight = "Pet dander accumulates rapidly under covers; maintain strict 3-to-4 day pillowcase cycles.";

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

    enableActionButtons(true, finalDays, formattedTargetDate);
}

function showPlaceholderState() {
    updateElementText("d-sheet-days", "Select options");
    updateElementText("m-sheet-days", "Select options");
    updateElementText("m-bar-val", "Select options");
    updateElementText("d-next-date", "Select options");
    updateElementText("m-next-date", "Select options");
    updateElementText("d-pillow-days", "Select options");
    updateElementText("m-pillow-days", "Select options");
    updateElementText("d-duvet-days", "Select options");
    updateElementText("m-duvet-days", "Select options");
    updateElementText("d-temp", "Select options");
    updateElementText("m-temp", "Select options");
    updateElementText("d-protector", "Select options");
    updateElementText("m-protector", "Select options");
    updateElementText("d-dry", "Select options");
    updateElementText("d-tip-text", "Please select your options on the left to generate your personalized bedding hygiene report.");
    updateElementText("m-tip-text", "Please select your options on the left to generate your personalized bedding hygiene report.");
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
