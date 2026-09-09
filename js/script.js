function calculateHygiene() {
    const lastWash = document.getElementById('select-last-wash').value;
    const sleepers = document.getElementById('select-sleepers').value;
    const attire = document.getElementById('select-attire').value;
    const fabric = document.getElementById('select-fabric').value;

    // If any required field is still unselected ("Pick your option..."), show placeholder state
    if (!lastWash || !sleepers || !attire || !fabric) {
        showPlaceholderState();
        return;
    }

    // ... your normal calculation code continues below ...
}

function showPlaceholderState() {
    document.getElementById('d-sheet-days').innerText = "—";
    document.getElementById('d-next-date').innerText = "Please complete form";
    document.getElementById('d-pillow-days').innerText = "—";
    document.getElementById('d-duvet-days').innerText = "—";
    document.getElementById('d-temp').innerText = "—";
    document.getElementById('d-protector').innerText = "—";
    document.getElementById('d-dry').innerText = "—";
    document.getElementById('d-tip-text').innerText = "Select your preferences from the questions on the left to generate your personalized bedding hygiene report.";
    
    // Do the same for mobile elements if needed
}
