const questions = [
    {
        question: "Qual desses ambientes mais combina contigo?",
        options: [
            { text: "☕ cafeteria", value: "cafe" },
            { text: "🌊 praia", value: "praia" },
            { text: "🏕️ acampamento", value: "acampa" },
            { text: "🎉 festa junina", value: "junina" }
        ],
        triggerGame: false
    },
    {
        question: "Qual teu nível de perigo?",
        options: [
            { text: "🥋 sei dar mata leão", value: "jiujitsu" },
            { text: "🐕 domo fila brasileiro", value: "dog" },
            { text: "🔫 talvez eu atire também", value: "tiro" },
            { text: "😇 sou inocente", value: "inocente" }
        ],
        triggerGame: true // Dispara o minigame após responder esta
    },
    {
        question: "O que mais te irrita?",
        options: [
            { text: "🍺 gente bêbada", value: "bebada" },
            { text: "💊 gente drogada", value: "drogada" },
            { text: "🐱 gato laranja psicopata", value: "gato" },
            { text: "🙄 homem sem atitude", value: "atitude" }
        ]
    },
    {
        question: "Qual teu rolê ideal?",
        options: [
            { text: "☕ café e conversa", value: "cafe" },
            { text: "🌅 praia no fim da tarde", value: "praia" },
            { text: "🍝 rolê gastronômico", value: "gastro" },
            { text: "🏕️ trilha/acampamento", value: "trilha" }
        ]
    },
    {
        question: "Qual tua personalidade?",
        options: [
            { text: "😌 low profile", value: "low" },
            { text: "😂 debochada", value: "debochada" },
            { text: "🥋 perigosa", value: "perigosa" },
            { text: "☕ jovem senhora", value: "senhora" }
        ]
    }
];

let currentQuestionIndex = 0;
let catsCaught = 0;
const userAnswers = {};

// Initialize app
function startApp() {
    fadeOut('home', () => {
        showQuestion();
    });
}

function showQuestion() {
    const q = questions[currentQuestionIndex];
    const quizSection = document.getElementById('quiz');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');

    questionText.textContent = q.question;
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = opt.text;
        btn.onclick = (e) => selectOption(e, opt);
        optionsContainer.appendChild(btn);
    });

    fadeIn('quiz');
}

function selectOption(e, opt) {
    const q = questions[currentQuestionIndex];
    
    // Salvar resposta da pergunta atual
    userAnswers[currentQuestionIndex] = opt;
    
    // Feedback visual
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.classList.remove('selected'));
    
    // Garantir que pegamos o botão mesmo se clicar no emoji
    const target = e.currentTarget;
    target.classList.add('selected');

    setTimeout(() => {
        fadeOut('quiz', () => {
            if (q.triggerGame) {
                startCatAlert();
            } else {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    showResult();
                }
            }
        });
    }, 400);
}

// Mini-game logic
function startCatAlert() {
    const alert = document.getElementById('cat-alert');
    alert.style.display = 'flex';
    
    setTimeout(() => {
        alert.style.display = 'none';
        startMiniGame();
    }, 5000); // 5 segundos para dar tempo de ler
}

let catMoveInterval;

function startMiniGame() {
    fadeIn('game-container');
    spawnCat();
}

function spawnCat() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    
    const cat = document.createElement('div');
    cat.className = 'cat-emoji';
    cat.textContent = '🐈';
    
    // Transição suave e ultra rápida para o gatinho arisco deslizar
    cat.style.transition = 'left 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.15s';
    
    gameArea.appendChild(cat);

    function reposition() {
        const areaRect = gameArea.getBoundingClientRect();
        // Garante que o gatinho não saia do card de jogo
        const maxX = Math.max(0, areaRect.width - 60);
        const maxY = Math.max(0, areaRect.height - 60);
        
        cat.style.left = Math.random() * maxX + 'px';
        cat.style.top = Math.random() * maxY + 'px';
    }

    // Posicionamento inicial
    reposition();
    
    cat.onclick = (e) => catchCat(e);

    // Limpa o temporizador anterior antes de criar um novo
    if (catMoveInterval) clearInterval(catMoveInterval);

    // O gatinho psicopata muda de posição sozinho de forma arisca a cada 600ms!
    catMoveInterval = setInterval(reposition, 600);
}

function catchCat(e) {
    catsCaught++;
    document.getElementById('cat-count').textContent = catsCaught;
    
    // Vibração no celular
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    // Animação fofa de clique
    if (e && e.target) {
        e.target.style.transform = 'scale(1.4) rotate(15deg)';
    }
    
    if (catsCaught < 5) {
        spawnCat();
    } else {
        if (catMoveInterval) clearInterval(catMoveInterval);
        document.getElementById('game-area').innerHTML = '<div style="font-size: 4rem; text-align: center; margin-top: 80px;">😌🐾</div>';
        document.getElementById('game-feedback').style.display = 'block';
        document.getElementById('btn-continue').style.display = 'block';
    }
}

function showNextQuestion() {
    fadeOut('game-container', () => {
        currentQuestionIndex++;
        showQuestion();
    });
}

function showResult() {
    const detailsContainer = document.getElementById('result-details');
    detailsContainer.innerHTML = ''; // Limpa o conteúdo estático do HTML

    // 1. Café (sempre elevado)
    const cafeItem = document.createElement('div');
    cafeItem.className = 'result-item';
    cafeItem.innerHTML = '☕ nível de café: elevado';
    detailsContainer.appendChild(cafeItem);

    // 2. Resposta da Pergunta 2 (Nível de perigo - índice 1)
    const p2Answer = userAnswers[1];
    if (p2Answer) {
        const p2Item = document.createElement('div');
        p2Item.className = 'result-item';
        
        switch (p2Answer.value) {
            case 'jiujitsu':
                p2Item.innerHTML = '🥋 risco de mata leão: preocupante 🔥';
                break;
            case 'dog':
                p2Item.innerHTML = '🐕 capacidade de domar fila brasileiro: confirmada 🐕';
                break;
            case 'tiro':
                p2Item.innerHTML = '🔫 índice de periculosidade: melhor não contrariar 💥';
                break;
            case 'inocente':
                p2Item.innerHTML = '😇 nível de inocência: suspeito (diz ser inofensiva) 👀';
                break;
            default:
                p2Item.innerHTML = '🛡️ nível de defesa pessoal: ativado';
        }
        detailsContainer.appendChild(p2Item);
    }

    // 3. Resposta da Pergunta 3 (O que mais te irrita - índice 2)
    const p3Answer = userAnswers[2];
    if (p3Answer) {
        const p3Item = document.createElement('div');
        p3Item.className = 'result-item';

        switch (p3Answer.value) {
            case 'bebada':
                p3Item.innerHTML = '🍺 paciência com gente bêbada: zero 🚫';
                break;
            case 'drogada':
                p3Item.innerHTML = '💊 tolerância a nóias: inexistente 🙅‍♀️';
                break;
            case 'gato':
                p3Item.innerHTML = '🐱 trauma de gato laranja psicopata: validado 🐈';
                break;
            case 'atitude':
                p3Item.innerHTML = '🙄 aversão a homem sem atitude: absoluta (ainda bem que o Gui tem!) 😌';
                break;
            default:
                p3Item.innerHTML = '⚠️ gatilho de paciência: sensível';
        }
        detailsContainer.appendChild(p3Item);
    }

    // 4. Ameaça Felina (Baseado no mini-game)
    const catItem = document.createElement('div');
    catItem.className = 'result-item';
    catItem.innerHTML = `🐈 controle de felinos: ${catsCaught}/5 gatos laranja capturados 😌`;
    detailsContainer.appendChild(catItem);

    fadeIn('result');
}

// Helper transitions
function fadeIn(id) {
    const el = document.getElementById(id);
    el.style.display = 'block';
    el.style.opacity = ''; // Limpa opacidade inline do fadeOut
    el.classList.remove('active');
    void el.offsetWidth; // Força reflow para reiniciar animação CSS
    el.classList.add('active');
}

function fadeOut(id, callback) {
    const el = document.getElementById(id);
    let opacity = 1;
    const interval = setInterval(() => {
        opacity -= 0.15;
        el.style.opacity = opacity;
        if (opacity <= 0) {
            clearInterval(interval);
            el.style.display = 'none';
            el.style.opacity = ''; // Limpa para o próximo fadeIn
            if (callback) callback();
        }
    }, 20);
}

// background particles generator
function createParticles() {
    const container = document.getElementById('particles-js');
    const particleCount = 25;
    
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.width = '2px';
        p.style.height = '2px';
        p.style.background = Math.random() > 0.5 ? '#ff8c00' : '#6f4e37';
        p.style.borderRadius = '50%';
        p.style.opacity = Math.random();
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        
        const duration = 10 + Math.random() * 20;
        p.style.animation = `float ${duration}s linear infinite`;
        
        container.appendChild(p);
    }
}

// Add CSS for particles animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
    }
`;
document.head.appendChild(style);

createParticles();
