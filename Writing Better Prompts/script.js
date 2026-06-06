/* ==========================================
   PROMPTFORGE AI
   FINAL CORRECTED SCRIPT.JS - PART 1
   CORE ENGINE + PROMPT BUILDER
========================================== */

document.addEventListener(
"DOMContentLoaded",
() => {

/* ==========================================
   DOM ELEMENTS
========================================== */

const body =
document.body;

const themeToggle =
document.getElementById(
"themeToggle"
);

const mobileMenuBtn =
document.getElementById(
"mobileMenuBtn"
);

const navLinks =
document.querySelector(
".nav-links"
);

const taskType =
document.getElementById(
"taskType"
);

const toneSelect =
document.getElementById(
"toneSelect"
);

const topicInput =
document.getElementById(
"topicInput"
);

const promptTechnique =
document.getElementById(
"promptTechnique"
);

const creativitySlider =
document.getElementById(
"creativitySlider"
);

const detailSlider =
document.getElementById(
"detailSlider"
);

const lengthSlider =
document.getElementById(
"lengthSlider"
);

const creativityValue =
document.getElementById(
"creativityValue"
);

const detailValue =
document.getElementById(
"detailValue"
);

const lengthValue =
document.getElementById(
"lengthValue"
);

const livePromptPreview =
document.getElementById(
"livePromptPreview"
);

const addExampleBtn =
document.getElementById(
"addExampleBtn"
);

const examplesContainer =
document.getElementById(
"examplesContainer"
);

const promptScore =
document.getElementById(
"promptScore"
);

const scoreRecommendation =
document.getElementById(
"scoreRecommendation"
);

const scoreProgress =
document.getElementById(
"scoreProgress"
);

const copyPrompt =
document.getElementById(
"copyPrompt"
);

const clearPrompt =
document.getElementById(
"clearPrompt"
);

/* ==========================================
   APP STATE
========================================== */

let selectedPersona =
"Founder";

let typingTimer =
null;

/* ==========================================
   THEME MANAGEMENT
========================================== */

function loadTheme(){

    const savedTheme =
    localStorage.getItem(
    "promptforge-theme"
    );

    if(
    savedTheme === "light"
    ){

        body.classList.add(
        "light-mode"
        );

    }

}

function toggleTheme(){

    body.classList.toggle(
    "light-mode"
    );

    const theme =

    body.classList.contains(
    "light-mode"
    )
    ? "light"
    : "dark";

    localStorage.setItem(
    "promptforge-theme",
    theme
    );

}

themeToggle?.addEventListener(
"click",
toggleTheme
);

loadTheme();

/* ==========================================
   MOBILE MENU
========================================== */

mobileMenuBtn?.addEventListener(
"click",
()=>{

    navLinks?.classList.toggle(
    "show"
    );

}
);

/* ==========================================
   PERSONA ENGINE
========================================== */

const personaCards =
document.querySelectorAll(
".persona-card"
);

personaCards.forEach(card=>{

    card.addEventListener(
    "click",
    ()=>{

        personaCards.forEach(
        persona=>{

            persona.classList.remove(
            "active-persona"
            );

        });

        card.classList.add(
        "active-persona"
        );

        selectedPersona =
        card.dataset.persona;

        generatePrompt();

        updatePromptScore();

    });

});

/* ==========================================
   SLIDER VALUES
========================================== */

function updateSliderValues(){

    creativityValue.textContent =
    creativitySlider.value;

    detailValue.textContent =
    detailSlider.value;

    lengthValue.textContent =
    lengthSlider.value;

}

[
creativitySlider,
detailSlider,
lengthSlider
].forEach(slider=>{

    slider?.addEventListener(
    "input",
    ()=>{

        updateSliderValues();

        generatePrompt();

        updatePromptScore();

    });

});

updateSliderValues();

/* ==========================================
   PROMPT GENERATOR
========================================== */

function collectExamples(){

    let examplesText = "";

    document
    .querySelectorAll(
    ".example-card"
    )
    .forEach((card,index)=>{

        const input =
        card.querySelector(
        "input"
        );

        const output =
        card.querySelector(
        "textarea"
        );

        if(
        input?.value.trim() ||
        output?.value.trim()
        ){

            examplesText +=

`
Example ${index + 1}

Input:
${input.value}

Output:
${output.value}

`;

        }

    });

    return examplesText;

}

function generatePrompt(){

    if(
    !livePromptPreview
    ) return;

    const prompt =

`SYSTEM:
You are an expert AI assistant.

PERSONA:
${selectedPersona}

TASK:
${taskType.value}

TOPIC:
${topicInput.value || "No topic provided"}

TONE:
${toneSelect.value}

TECHNIQUE:
${promptTechnique.value}

CREATIVITY:
${creativitySlider.value}/100

DETAIL:
${detailSlider.value}/100

OUTPUT LENGTH:
${lengthSlider.value}/100

${collectExamples()}

INSTRUCTIONS:

1. Follow the selected persona.
2. Match the chosen tone.
3. Generate creative and practical outputs.
4. Use structured reasoning.
5. Provide a detailed response.
`;

    livePromptPreview.textContent =
    prompt;

}

[
taskType,
toneSelect,
topicInput,
promptTechnique
].forEach(element=>{

    element?.addEventListener(
    "input",
    generatePrompt
    );

});

/* ==========================================
   FEW SHOT BUILDER
========================================== */

function attachRemoveEvents(){

    document
    .querySelectorAll(
    ".remove-example"
    )
    .forEach(button=>{

        button.onclick = ()=>{

            const cards =
            document.querySelectorAll(
            ".example-card"
            );

            if(cards.length === 1){

                return;

            }

            button.closest(
            ".example-card"
            )?.remove();

            generatePrompt();

            updatePromptScore();

        };

    });

}

addExampleBtn?.addEventListener(
"click",
()=>{

    const card =
    document.createElement(
    "div"
    );

    card.className =
    "example-card";

    card.innerHTML =

`
<div class="example-header">

<span>
New Example
</span>

<button
type="button"
class="remove-example">

<i class="ri-delete-bin-line"></i>

</button>

</div>

<input
type="text"
placeholder="Input Example">

<textarea
placeholder="Output Example"></textarea>
`;

    examplesContainer.appendChild(
    card
    );

    attachRemoveEvents();

    generatePrompt();

    updatePromptScore();

});

/* Live Update Examples */

examplesContainer?.addEventListener(
"input",
()=>{

    generatePrompt();

    updatePromptScore();

}
);

attachRemoveEvents();

/* ==========================================
   COPY PROMPT
========================================== */

copyPrompt?.addEventListener(
"click",
async()=>{

    try{

        await navigator
        .clipboard
        .writeText(
        livePromptPreview.textContent
        );

        copyPrompt.innerHTML =
        "✓ Copied";

        setTimeout(()=>{

            copyPrompt.innerHTML =

            `<i class="ri-file-copy-line"></i>
             Copy`;

        },1500);

    }

    catch(error){

        console.error(error);

    }

});

/* ==========================================
   PROMPTFORGE AI
   FINAL CORRECTED SCRIPT.JS - PART 2
   SCORE ENGINE + PARTICLES + BATTLE ARENA
========================================== */

/* ==========================================
   CLEAR PROMPT
========================================== */

clearPrompt?.addEventListener(
"click",
()=>{

    topicInput.value = "";

    document
    .querySelectorAll(
    ".example-card input"
    )
    .forEach(input=>{

        input.value = "";

    });

    document
    .querySelectorAll(
    ".example-card textarea"
    )
    .forEach(textarea=>{

        textarea.value = "";

    });

    generatePrompt();

    updatePromptScore();

});
    
/* ==========================================
   PROMPT SCORE ENGINE
========================================== */

function updatePromptScore(){

    if(
    !promptScore ||
    !scoreProgress
    ){
        return;
    }

    let score = 45;

    score +=
    Number(
    creativitySlider.value
    ) * 0.15;

    score +=
    Number(
    detailSlider.value
    ) * 0.15;

    score +=
    Number(
    lengthSlider.value
    ) * 0.05;

    if(selectedPersona){

        score += 8;

    }

    const examplesCount =

    document.querySelectorAll(
    ".example-card"
    ).length;

    score +=
    examplesCount * 4;

    score =
    Math.min(
    100,
    Math.round(score)
    );

    promptScore.textContent =
    score;

    /* SVG Ring Animation */

    const radius = 70;

    const circumference =

    2 *
    Math.PI *
    radius;

    scoreProgress.style
    .strokeDasharray =
    circumference;

    scoreProgress.style
    .strokeDashoffset =

    circumference -

    (
        score / 100
    ) * circumference;

    /* Recommendation */

    if(score < 60){

        scoreRecommendation.textContent =

        "Add examples, constraints and more context to improve prompt quality.";

    }

    else if(score < 80){

        scoreRecommendation.textContent =

        "Good structure. Consider increasing specificity and output constraints.";

    }

    else{

        scoreRecommendation.textContent =

        "Excellent prompt. Strong balance of context, persona and detail.";

    }

}

/* ==========================================
   TYPING ANIMATION (FIXED)
========================================== */

function typePrompt(){

    if(
    !livePromptPreview
    ) return;

    const fullText =
    livePromptPreview.textContent;

    clearInterval(
    typingTimer
    );

    livePromptPreview.textContent =
    "";

    let i = 0;

    typingTimer =
    setInterval(()=>{

        if(
        i < fullText.length
        ){

            livePromptPreview
            .textContent +=

            fullText.charAt(i);

            i++;

        }

        else{

            clearInterval(
            typingTimer
            );

        }

    },5);

}

/* ==========================================
   SAFE PARTICLE SYSTEM
========================================== */

const canvas =
document.getElementById(
"particlesCanvas"
);

if(canvas){

    const ctx =
    canvas.getContext("2d");

    let particles = [];

    function resizeCanvas(){

        canvas.width =
        window.innerWidth;

        canvas.height =
        window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener(
    "resize",
    resizeCanvas
    );

    class Particle{

        constructor(){

            this.x =
            Math.random() *
            canvas.width;

            this.y =
            Math.random() *
            canvas.height;

            this.radius =
            Math.random() * 2 + 1;

            this.speed =
            Math.random() * 0.5 + 0.2;

        }

        update(){

            this.y -= this.speed;

            if(this.y < 0){

                this.y =
                canvas.height;

                this.x =
                Math.random() *
                canvas.width;

            }

        }

        draw(){

            ctx.beginPath();

            ctx.arc(

                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2

            );

            ctx.fillStyle =

            "rgba(0,229,255,.65)";

            ctx.fill();

        }

    }

    function createParticles(){

        particles = [];

        for(
        let i = 0;
        i < 90;
        i++
        ){

            particles.push(
            new Particle()
            );

        }

    }

    createParticles();

    function animateParticles(){

        ctx.clearRect(

            0,
            0,
            canvas.width,
            canvas.height

        );

        particles.forEach(
        particle=>{

            particle.update();

            particle.draw();

        });

        requestAnimationFrame(
        animateParticles
        );

    }

    animateParticles();

}

/* ==========================================
   BATTLE ARENA OUTPUTS
========================================== */

const outputA =
document.getElementById(
"outputA"
);

const outputB =
document.getElementById(
"outputB"
);

const outputC =
document.getElementById(
"outputC"
);

const outputD =
document.getElementById(
"outputD"
);

function generateBattleOutputs(){

    if(
    !outputA ||
    !outputB ||
    !outputC ||
    !outputD
    ){
        return;
    }

    const topic =

    topicInput.value.trim() ||

    "AI Startup";

    outputA.innerHTML =

`
<strong>Zero-Shot</strong>
<br><br>

Create a solution around
${topic}
using a direct prompt.
`;

    outputB.innerHTML =

`
<strong>Few-Shot</strong>
<br><br>

Generate a structured
solution using examples,
templates and reference
outputs.
`;

    outputC.innerHTML =

`
<strong>${selectedPersona}</strong>
<br><br>

Analyze ${topic}
from the perspective of
a ${selectedPersona}.
`;

    outputD.innerHTML =

`
<strong>Chain-of-Thought</strong>
<br><br>

Problem →
Analysis →
Options →
Decision →
Final Solution
`;

}

/* ==========================================
   VOTING SYSTEM (FIXED)
========================================== */

const voteButtons =
document.querySelectorAll(
".vote-btn"
);

voteButtons.forEach(button=>{

    button.addEventListener(
    "click",
    ()=>{

        voteButtons.forEach(
        btn=>{

            btn.classList.remove(
            "winner"
            );

            btn.innerHTML =
            "Vote Winner";

        });

        button.classList.add(
        "winner"
        );

        button.innerHTML =
        "🏆 Winner";

    });

});

/* ==========================================
   OUTPUT REFRESH
========================================== */

function refreshPromptSystems(){

    generatePrompt();

    updatePromptScore();

    generateBattleOutputs();

}

[
taskType,
toneSelect,
topicInput,
promptTechnique,
creativitySlider,
detailSlider,
lengthSlider
].forEach(element=>{

    element?.addEventListener(
    "input",
    refreshPromptSystems
    );

});

/* ==========================================
   PERSONA REFRESH
========================================== */

personaCards.forEach(card=>{

    card.addEventListener(
    "click",
    ()=>{

        generateBattleOutputs();

    });

});

/* ==========================================
   INITIALIZATION
========================================== */

generatePrompt();

updatePromptScore();

generateBattleOutputs();

/* ==========================================
   PROMPTFORGE AI
   FINAL CORRECTED SCRIPT.JS - PART 3
   ANALYTICS + HISTORY + GAMIFICATION
========================================== */

/* ==========================================
   CHART HELPERS
========================================== */

function getChartTextColor(){

    return body.classList.contains(
    "light-mode"
    )
    ? "#111827"
    : "#ffffff";

}

let radarChart = null;
let barChart = null;
let lineChart = null;

/* ==========================================
   RADAR CHART
========================================== */

function initializeRadarChart(){

    const radarCanvas =
    document.getElementById(
    "radarChart"
    );

    if(!radarCanvas) return;

    const ctx =
    radarCanvas.getContext("2d");

    radarChart =
    new Chart(ctx,{

        type:"radar",

        data:{

            labels:[

                "Creativity",
                "Detail",
                "Originality",
                "Clarity",
                "Tone Match"

            ],

            datasets:[{

                label:
                "Prompt Quality",

                data:[
                    85,
                    80,
                    90,
                    82,
                    88
                ],

                borderColor:
                "#00e5ff",

                backgroundColor:
                "rgba(0,229,255,.15)",

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{
                r:{
                    ticks:{
                        color:
                        getChartTextColor()
                    },
                    pointLabels:{
                        color:
                        getChartTextColor()
                    }
                }
            },

            plugins:{
                legend:{
                    labels:{
                        color:
                        getChartTextColor()
                    }
                }
            }

        }

    });

}

/* ==========================================
   BAR CHART
========================================== */

function initializeBarChart(){

    const canvas =
    document.getElementById(
    "barChart"
    );

    if(!canvas) return;

    const ctx =
    canvas.getContext("2d");

    barChart =
    new Chart(ctx,{

        type:"bar",

        data:{

            labels:[

                "Zero-Shot",
                "Few-Shot",
                "Persona",
                "CoT"

            ],

            datasets:[{

                label:
                "Effectiveness",

                data:[
                    72,
                    86,
                    91,
                    95
                ],

                backgroundColor:[

                    "#00e5ff",
                    "#8b5cf6",
                    "#00ff9d",
                    "#f97316"

                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{
                legend:{
                    labels:{
                        color:
                        getChartTextColor()
                    }
                }
            },

            scales:{

                x:{
                    ticks:{
                        color:
                        getChartTextColor()
                    }
                },

                y:{
                    ticks:{
                        color:
                        getChartTextColor()
                    }
                }

            }

        }

    });

}

/* ==========================================
   LINE CHART
========================================== */

function initializeLineChart(){

    const canvas =
    document.getElementById(
    "lineChart"
    );

    if(!canvas) return;

    const ctx =
    canvas.getContext("2d");

    lineChart =
    new Chart(ctx,{

        type:"line",

        data:{

            labels:[
                "Exp1",
                "Exp2",
                "Exp3",
                "Exp4",
                "Exp5"
            ],

            datasets:[{

                label:
                "Prompt Score",

                data:[
                    52,
                    68,
                    74,
                    88,
                    96
                ],

                borderColor:
                "#00e5ff",

                backgroundColor:
                "rgba(0,229,255,.12)",

                fill:true,

                tension:.4

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{
                legend:{
                    labels:{
                        color:
                        getChartTextColor()
                    }
                }
            },

            scales:{

                x:{
                    ticks:{
                        color:
                        getChartTextColor()
                    }
                },

                y:{
                    ticks:{
                        color:
                        getChartTextColor()
                    }
                }

            }

        }

    });

}

/* ==========================================
   AI INSIGHTS
========================================== */

const insightsList =
document.getElementById(
"insightsList"
);

function generateInsights(){

    if(!insightsList) return;

    const insights = [];

    if(
    Number(creativitySlider.value)
    > 80
    ){

        insights.push(
        "High creativity settings improve originality and ideation."
        );

    }

    if(
    Number(detailSlider.value)
    > 80
    ){

        insights.push(
        "Detailed prompts improve consistency and output quality."
        );

    }

    insights.push(
    `Persona prompting using ${selectedPersona} improves style alignment.`
    );

    insights.push(
    "Few-shot prompting generally improves reliability."
    );

    insights.push(
    "Chain-of-Thought increases reasoning transparency."
    );

    insightsList.innerHTML =

    insights.map(item=>

    `<li>${item}</li>`

    ).join("");

}

/* ==========================================
   XP SYSTEM
========================================== */

const xpValue =
document.getElementById(
"xpValue"
);

const xpFill =
document.getElementById(
"xpFill"
);

const userRank =
document.getElementById(
"userRank"
);

let userXP =

Number(
localStorage.getItem(
"promptforgeXP"
)
) || 250;

function updateXP(){

    const progress =

    Math.min(
    100,
    (userXP % 1000)/10
    );

    if(xpFill){

        xpFill.style.width =
        `${progress}%`;

    }

    if(xpValue){

        xpValue.textContent =
        `${userXP} XP`;

    }

    let rank =
    "Prompt Apprentice";

    if(userXP > 500)
        rank =
        "Prompt Engineer";

    if(userXP > 1000)
        rank =
        "Prompt Architect";

    if(userXP > 2500)
        rank =
        "Prompt Scientist";

    if(userXP > 5000)
        rank =
        "Prompt Master";

    if(userRank){

        userRank.textContent =
        rank;

    }

    localStorage.setItem(
    "promptforgeXP",
    userXP
    );

}

function awardXP(points){

    userXP += points;

    updateXP();

}

/* ==========================================
   HISTORY SYSTEM
========================================== */

const historyContainer =
document.querySelector(
".history-container"
);

function getHistory(){

    return JSON.parse(

        localStorage.getItem(
        "promptHistory"
        )

    ) || [];

}

function savePromptHistory(){

    const history =
    getHistory();

    history.unshift({

        topic:
        topicInput.value,

        technique:
        promptTechnique.value,

        timestamp:
        new Date()
        .toLocaleString()

    });

    localStorage.setItem(

        "promptHistory",

        JSON.stringify(
        history.slice(0,20)
        )

    );

}

function renderHistory(){

    if(!historyContainer) return;

    const history =
    getHistory();

    historyContainer.innerHTML =
    "";

    history.forEach(
    (item,index)=>{

        const div =
        document.createElement(
        "div"
        );

        div.className =
        "history-item";

        div.innerHTML =

`
<div>

<h4>
${item.topic || "Untitled Prompt"}
</h4>

<small>
${item.technique}
•
${item.timestamp}
</small>

</div>

<div class="history-actions">

<button
data-load="${index}">
Reload
</button>

<button
data-delete="${index}">
Delete
</button>

</div>
`;

        historyContainer
        .appendChild(div);

    });

}

/* ==========================================
   HISTORY EVENTS
========================================== */

document.addEventListener(
"click",
(event)=>{

    const loadIndex =
    event.target.dataset.load;

    const deleteIndex =
    event.target.dataset.delete;

    if(loadIndex !== undefined){

        const history =
        getHistory();

        const item =
        history[loadIndex];

        if(item){

            topicInput.value =
            item.topic;

            promptTechnique.value =
            item.technique;

            refreshPromptSystems();

        }

    }

    if(deleteIndex !== undefined){

        const history =
        getHistory();

        history.splice(
        deleteIndex,
        1
        );

        localStorage.setItem(

            "promptHistory",

            JSON.stringify(
            history
            )

        );

        renderHistory();

    }

});

/* ==========================================
   EXPORT REPORT
========================================== */

function exportReport(){

    const report =

`
PROMPTFORGE AI REPORT

====================

Prompt Score:
${promptScore.textContent}

Persona:
${selectedPersona}

Technique:
${promptTechnique.value}

Topic:
${topicInput.value}

Generated:
${new Date()
.toLocaleString()}

====================

PROMPT

${livePromptPreview.textContent}
`;

    const blob =
    new Blob(
    [report],
    {
        type:
        "text/plain"
    });

    const url =
    URL.createObjectURL(
    blob
    );

    const link =
    document.createElement(
    "a"
    );

    link.href = url;

    link.download =
    "PromptForge_Report.txt";

    link.click();

    URL.revokeObjectURL(
    url
    );

}

/* ==========================================
   EXPORT BUTTON
========================================== */

const ctaButton =
document.querySelector(
".cta-card .primary-btn"
);

ctaButton?.addEventListener(
"click",
exportReport
);

/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements =

document.querySelectorAll(
".glass-card"
);

function revealOnScroll(){

    revealElements.forEach(
    element=>{

        const top =

        element
        .getBoundingClientRect()
        .top;

        if(

        top <

        window.innerHeight
        - 80

        ){

            element.classList.add(
            "active"
            );

        }

    });

}

window.addEventListener(
"scroll",
revealOnScroll
);

revealOnScroll();

/* ==========================================
   DAILY CHALLENGE
========================================== */

const challengeElement =
document.getElementById(
"dailyChallenge"
);

const challenges = [

"Build an AI startup reducing food waste.",

"Create a futuristic healthcare platform.",

"Generate a climate-tech innovation idea.",

"Design an AI-powered smart city solution.",

"Create a viral marketing campaign for an AI product."

];

if(challengeElement){

    challengeElement.textContent =

    challenges[
    Math.floor(
    Math.random() *
    challenges.length
    )
    ];

}

/* ==========================================
   AUTO SAVE
========================================== */

topicInput?.addEventListener(
"change",
()=>{

    savePromptHistory();

    renderHistory();

    awardXP(10);

});

/* ==========================================
   CHART REFRESH
========================================== */

function refreshCharts(){

    if(radarChart){

        radarChart.data.datasets[0]
        .data = [

            Number(
            creativitySlider.value
            ),

            Number(
            detailSlider.value
            ),

            85,
            88,
            90

        ];

        radarChart.update();

    }

}

/* ==========================================
   FINAL INITIALIZATION
========================================== */

initializeRadarChart();
initializeBarChart();
initializeLineChart();

generateInsights();
renderHistory();
updateXP();
refreshCharts();

awardXP(0);

console.log(
"PromptForge AI Loaded Successfully"
);

/* ==========================================
   CLOSE DOMCONTENTLOADED
========================================== */

});