const questions = [
    {
        title: "1. What size are your sheets?",
        options: ["Twin / Single", "Full / Double", "Queen", "King / Cal King"]
    },
    {
        title: "2. What fabric are they?",
        options: ["Regular cotton", "Soft bamboo", "Linen", "Flannel / Microfiber"]
    },
    {
        title: "3. How long since the last wash?",
        options: ["3 to 4 days", "About a week", "2 weeks", "Over a month"]
    },
    {
        title: "4. How dirty are they?",
        options: ["Just a light refresh", "Normal body sweat and oils", "Noticeably dirty or stained", "Need a deep sanitization"]
    },
    {
        title: "5. Who sleeps in the bed?",
        options: ["Just me", "Me and my partner", "We sleep with pets", "Kids or toddlers share the bed"]
    },
    {
        title: "6. Does anyone sleeping here have allergies or sensitive skin?",
        options: ["No specific skin or allergy issues", "Mild seasonal allergies (dust or pollen)", "Sensitive skin or eczema-prone", "Severe allergies or asthma triggers"]
    },
    {
        title: "7. How strict is your regular wash schedule?",
        options: ["Very strict (Always wash on a fixed weekly day)", "Flexible (Wash whenever I remember or notice them)", "Delayed (Only wash when they start smelling or feeling stale)", "Sporadic (No fixed routine at all)"]
    },
    {
        title: "8. Why was this particular wash delayed (if at all)?",
        options: ["Not delayed—right on schedule!", "Just got too busy with work or life", "Kept putting off stripping and making the bed again", "Waited for a full load of laundry to pile up"]
    },
    {
        title: "9. What is your main goal for this specific wash?",
        options: ["Total freshness and crisp scent", "Heavy odor and sweat removal", "Complete allergen and dust mite elimination", "Gentle fabric care to make them last longer"]
    },
    {
        title: "10. Why was this particular wash delayed (if at all)?",
        options: ["Not delayed—right on schedule!", "Just got too busy with work or life", "Kept putting off stripping and making the bed again", "Waited for a full load of laundry to pile up"]
    }
];

let currentQuestionIndex = 0;
const userAnswers = {};

const welcomeScreen = document.getElementById('welcome-screen');
const questionnaireContainer = document.getElementById('questionnaire-container');
const resultsContainer = document.getElementById('results-container');
const pageHeader = document.getElementById('page-header');
const adWrapper = document.getElementById('ad-wrapper');
const pageFooter = document.getElementById('page-footer');

const startBtn = document.getElementById('start-btn');
const homeLinkBtn = document.getElementById('home-link-btn');
const resultsHomeBtn = document.getElementById('results-home-btn');
const questionCounter = document.getElementById('question-counter');
const questionTitle = document.getElementById('question-title');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const skipBtn = document.getElementById('skip-btn');
const nextBtn = document.getElementById('next-btn');
const copyBtn = document.getElementById('copy-btn');
const restartCalcBtn = document.getElementById('restart-calc-btn');
const retryQuestionnaireBtn = document.getElementById('retry-questionnaire-btn');

const resultsBodyContent = document.getElementById('results-body-content');
const resultsActions = document.getElementById('results-actions');
const skippedActionContainer = document.getElementById('skipped-action-container');
const washTimelineBanner = document.getElementById('wash-timeline-banner');

startBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    questionnaireContainer.classList.remove('hidden');
    pageHeader.classList.add('hidden');
    adWrapper.classList.add('hidden');
    pageFooter.classList.add('hidden');
    renderQuestion(currentQuestionIndex);
});

function resetToHome() {
    resultsContainer.classList.add('hidden');
    questionnaireContainer.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    
    pageHeader.classList.remove('hidden');
    adWrapper.classList.remove('hidden');
    pageFooter.classList.remove('hidden');

    currentQuestionIndex = 0;
    for (let key in userAnswers) delete userAnswers[key];
}

homeLinkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetToHome();
});

resultsHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetToHome();
});

restartCalcBtn.addEventListener('click', () => {
    resetToHome();
});

retryQuestionnaireBtn.addEventListener('click', () => {
    resetToHome();
});

function renderQuestion(index) {
    const q = questions[index];
    questionCounter.textContent = `Question ${index + 1} of ${questions.length}`;
    questionTitle.textContent = q.title;

    optionsContainer.innerHTML = '';
    q.options.forEach((opt, optIdx) => {
        const isSelected = userAnswers[index] === optIdx;
        const div = document.createElement('div');
        
        // Dynamic card styling based on selection state
        div.className = `flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            isSelected 
                ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-sm' 
                : 'bg-white/50 border-white/80 hover:bg-white/70 text-slate-700'
        }`;
        
        div.innerHTML = `
            <div class="w-4 h-4 rounded-full border border-rose-400 flex items-center justify-center">
                ${isSelected ? '<div class="w-2 h-2 rounded-full bg-rose-500"></div>' : ''}
            </div>
            <span class="text-sm font-medium">${opt}</span>
        `;

        // Click handler with toggle / deselection logic
        div.addEventListener('click', () => {
            if (userAnswers[index] === optIdx) {
                // Deselect if already selected
                userAnswers[index] = undefined;
            } else {
                // Select new option
                userAnswers[index] = optIdx;
            }
            renderQuestion(currentQuestionIndex); // Re-render to update UI states
        });

        optionsContainer.appendChild(div);
    });

    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    
    if (index === questions.length - 1) {
        nextBtn.textContent = "✨ Calculate Plan";
        nextBtn.className = "calculate-btn transition-all duration-200";
    } else {
        nextBtn.textContent = "Next";
        nextBtn.className = "text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 underline underline-offset-4 transition-colors";
    }

    // Show skip button only if nothing is currently selected for this question
    if (userAnswers[index] !== undefined && userAnswers[index] !== null) {
        skipBtn.classList.add('hidden');
    } else {
        skipBtn.classList.remove('hidden');
    }
}

nextBtn.addEventListener('click', () => {
    const selectedAns = userAnswers[currentQuestionIndex];
    if (selectedAns === undefined || selectedAns === null) {
        alert('Please choose an option to proceed, or click "Skip" if you prefer not to answer.');
        return;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    } else {
        generateResults();
    }
});

skipBtn.addEventListener('click', () => {
    userAnswers[currentQuestionIndex] = null; // Explicitly marked as skipped

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(currentQuestionIndex);
    } else {
        generateResults();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(currentQuestionIndex);
    }
});

function generateResults() {
    questionnaireContainer.classList.add('hidden');
    resultsContainer.classList.remove('hidden');

    pageHeader.classList.add('hidden');
    adWrapper.classList.add('hidden');
    pageFooter.classList.add('hidden');

    let answeredCount = 0;
    questions.forEach((q, idx) => {
        if (userAnswers[idx] !== null && userAnswers[idx] !== undefined) {
            answeredCount++;
        }
    });

    if (answeredCount === 0) {
        resultsBodyContent.classList.add('hidden');
        resultsActions.classList.add('hidden');
        skippedActionContainer.classList.remove('hidden');
        washTimelineBanner.classList.add('hidden');

        document.getElementById('summary-paragraph').textContent = 
            "You haven't answered anything. Please take the questionnaire again to receive your personalized bedsheet wash prescription.";
    } else {
        resultsBodyContent.classList.remove('hidden');
        resultsActions.classList.remove('hidden');
        skippedActionContainer.classList.add('hidden');

        const lastWashIdx = userAnswers[2];
        const frequencyIdx = userAnswers[6];
        const petIdx = userAnswers[4] !== undefined && userAnswers[4] !== null ? userAnswers[4] : 0;
        
        washTimelineBanner.classList.remove('hidden');
        
        if (lastWashIdx !== null && lastWashIdx !== undefined) {
            if (lastWashIdx === 0) {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>🌱</span> Status: Fresh! Next wash due in about 3 to 4 days.";
            } else if (lastWashIdx === 1) {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>📅</span> Status: Right on schedule for your weekly wash cycle!";
            } else if (lastWashIdx === 2) {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>⚠️</span> Status: Overdue! Sheets should ideally be washed every 7 to 10 days.";
            } else {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>🚨</span> Status: Heavily overdue! Deep sanitation cycle required immediately.";
            }
        } else {
            if (petIdx === 2) {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>🐾</span> Wash Frequency Note: Because pets share your bed, a strict 4 to 5 day wash cycle is recommended to manage dander.";
            } else if (frequencyIdx === 0) {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>📅</span> Wash Frequency Note: Based on your strict schedule, maintain your fixed weekly wash day.";
            } else {
                washTimelineBanner.className = "mb-4 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-bold flex items-center gap-2";
                washTimelineBanner.innerHTML = "<span>💡</span> Wash Frequency Note: Aim for a regular 7-day wash cycle to prevent buildup of body oils and allergens.";
            }
        }

        const answeredParts = [];
        questions.forEach((q, idx) => {
            const ansIdx = userAnswers[idx];
            if (ansIdx !== null && ansIdx !== undefined) {
                const cleanQTitle = q.title.replace(/^\d+\.\s*/, '').toLowerCase();
                answeredParts.push(`${cleanQTitle} (${q.options[ansIdx].toLowerCase()})`);
            }
        });
        
        document.getElementById('summary-paragraph').textContent = 
            `Disclaimer: This custom wash prescription has been prepared based on your inputs regarding ${answeredParts.slice(0, 3).join(', ')}, and other care preferences.`;

        const fabricIdx = userAnswers[1] !== undefined && userAnswers[1] !== null ? userAnswers[1] : 0;
        const allergyIdx = userAnswers[5] !== undefined && userAnswers[5] !== null ? userAnswers[5] : 0;

        let tempText = "Warm (30°C / 85°F)";
        let cycleText = "Normal Cycle, Medium Spin";
        let detergentText = "Use measured liquid detergent. Standard rinse cycle.";
        let dryingText = "Tumble dry on medium heat or line dry.";

        if (allergyIdx === 3 || petIdx === 2) {
            tempText = "Hot (40°C–60°C / 105°F–140°F) for allergen & dander sanitization";
        } else if (fabricIdx === 1 || fabricIdx === 2) {
            tempText = "Cold or Cool (20°C–30°C / 70°F–85°F) to protect delicate fibers";
        }

        if (fabricIdx === 1 || fabricIdx === 2) {
            cycleText = "Gentle / Delicate Cycle, Low Spin (600 RPM)";
            dryingText = "Remove bamboo or linen sheets while slightly damp (avoid bone-dry) to prevent deep wrinkles and maintain breathability.";
        } else if (fabricIdx === 3) {
            cycleText = "Permanent Press / Synthetic Cycle";
            dryingText = "Tumble dry on low heat to prevent static cling and pilling.";
        }

        if (allergyIdx >= 2 || petIdx === 2) {
            detergentText = "Hypoallergenic, fragrance-free detergent. An *extra rinse cycle* is strongly recommended to remove soap residue.";
        }

        let insightText = "Because of your washing frequency and routine, your sheets accumulate body oils faster than a standard weekly cycle. This custom plan balances deep cleaning without wearing out your fabric.";
        if (petIdx === 2) {
            insightText = "Because you share your bed with pets, your sheets accumulate dander and oils faster than a standard weekly cycle. This custom plan uses a slightly deeper agitation to lift trapped allergens without ruining your fabric.";
        } else if (fabricIdx === 1 || fabricIdx === 2) {
            insightText = "Because your sheets consist of delicate natural fibers and experience regular wear, maintaining precise temperature control is critical to protect fabric integrity while ensuring total freshness.";
        } else if (allergyIdx === 3) {
            insightText = "Because of severe allergen sensitivities, standard cold washes leave behind microscopic triggers. This targeted warm-to-hot cycle neutralizes dust mites without compromising your sheet texture.";
        }

        document.getElementById('res-temp').textContent = tempText;
        document.getElementById('res-cycle').textContent = cycleText;
        document.getElementById('res-detergent').textContent = detergentText;
        document.getElementById('res-insight').textContent = insightText;
        document.getElementById('res-drying').textContent = dryingText;
    }
}

copyBtn.addEventListener('click', () => {
    const planText = `--- BEDSHEET WASH PRESCRIPTION ---
Water Temp: ${document.getElementById('res-temp').textContent}
Cycle: ${document.getElementById('res-cycle').textContent}
Detergent: ${document.getElementById('res-detergent').textContent}
Drying Tip: ${document.getElementById('res-drying').textContent}
Recommended by BedsheetWashCalculator.com`;

    navigator.clipboard.writeText(planText).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✓ Copied to Clipboard!";
        setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
    });
});