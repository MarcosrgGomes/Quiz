// Dados completos do quiz
const quizData = {
    relevo: [
        {
            question: "Qual é a montanha mais alta da Europa Ocidental?",
            options: ["Monte Branco", "Monte Elbrus", "Pirineus", "Cárpatos"],
            answer: "Monte Branco",
            fact: "O Monte Branco nos Alpes tem 4.810m e fica na fronteira entre França e Itália."
        },
        {
            question: "Qual planície se estende da França até a Rússia?",
            options: ["Planície Europeia", "Planície Siberiana", "Planície do Danúbio", "Planície Ibérica"],
            answer: "Planície Europeia",
            fact: "Com cerca de 4.000km de extensão, é uma das maiores planícies do mundo."
        }
    ],
    hidrografia: [
        {
            question: "Qual é o rio mais longo da Europa?",
            options: ["Volga", "Danúbio", "Reno", "Sena"],
            answer: "Volga",
            fact: "O Volga percorre 3.690km pela Rússia até desaguar no Mar Cáspio."
        },
        {
            question: "Quantos países o rio Danúbio atravessa?",
            options: ["10", "6", "8", "12"],
            answer: "10",
            fact: "O Danúbio passa por Alemanha, Áustria, Eslováquia, Hungria, Croácia, Sérvia, Romênia, Bulgária, Moldávia e Ucrânia."
        }
    ],
    vegetacao: [
        {
            question: "Qual vegetação predomina no norte da Europa?",
            options: ["Tundra", "Floresta Temperada", "Vegetação Mediterrânea", "Estepe"],
            answer: "Tundra",
            fact: "Caracterizada por musgos, líquens e vegetação rasteira, adaptada ao frio extremo."
        }
    ],
    clima: [
        {
            question: "Qual corrente oceânica aquece o noroeste europeu?",
            options: ["Corrente do Golfo", "Corrente de Humboldt", "Corrente da Califórnia", "Corrente de Benguela"],
            answer: "Corrente do Golfo",
            fact: "Transporta águas quentes do Golfo do México, amenizando o clima da região."
        }
    ],
    recursos: [
        {
            question: "Onde estão as principais reservas de carvão na Europa?",
            options: ["Bacia do Ruhr (Alemanha)", "Pirineus", "Alpes", "Cárpatos"],
            answer: "Bacia do Ruhr (Alemanha)",
            fact: "Foi fundamental para a Revolução Industrial alemã."
        }
    ]
};

// Variáveis globais
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let playerName = "";
let questions = [];
let leaderboard = JSON.parse(localStorage.getItem('europeQuizLeaderboard')) || [];

// Elementos DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const playerNameInput = document.getElementById('player-name');
const nameError = document.getElementById('name-error');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const progressElement = document.getElementById('progress');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const timerElement = document.getElementById('timer');
const leaderboardElement = document.getElementById('leaderboard');
const scoreBar = document.getElementById('score-bar');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startQuiz();
});

// Iniciar o quiz
function startQuiz() {
    playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        nameError.textContent = "Por favor, digite seu nome!";
        nameError.style.display = "block";
        return;
    }
    
    // Seleciona 10 perguntas aleatórias de todos os tópicos
    const allQuestions = [
        ...quizData.relevo,
        ...quizData.hidrografia,
        ...quizData.vegetacao,
        ...quizData.clima,
        ...quizData.recursos
    ];
    
    // Embaralha e seleciona 10 questões
    questions = allQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
    
    // Resetar variáveis
    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    
    // Mostrar tela do quiz
    startScreen.classList.remove('active-screen');
    quizScreen.classList.add('active-screen');
    resultsScreen.classList.remove('active-screen');
    
    // Carregar primeira pergunta
    loadQuestion();
}

// Carregar pergunta
function loadQuestion() {
    // Limpar timer anterior
    clearInterval(timer);
    
    // Resetar timer
    timeLeft = 30;
    updateTimer();
    
    // Obter questão atual
    const question = questions[currentQuestion];
    
    // Atualizar elementos da tela
    questionElement.textContent = question.question;
    progressElement.innerHTML = `<i class="fas fa-question-circle"></i> ${currentQuestion + 1}/${questions.length}`;
    scoreElement.innerHTML = `<i class="fas fa-star"></i> ${score} pontos`;
    feedbackElement.innerHTML = '';
    nextBtn.classList.add('hidden');
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Adicionar novas opções (embaralhadas)
    question.options.sort(() => 0.5 - Math.random()).forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.innerHTML = `<i class="far fa-circle"></i> ${option}`;
        button.addEventListener('click', () => selectAnswer(option, button));
        optionsContainer.appendChild(button);
    });
    
    // Iniciar temporizador
    startTimer();
}

// Selecionar resposta
function selectAnswer(selectedOption, selectedButton) {
    clearInterval(timer);
    const correctAnswer = questions[currentQuestion].answer;
    const isCorrect = selectedOption === correctAnswer;
    
    // Desativar todas as opções
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.disabled = true;
        
        // Marcar a resposta correta
        if (button.textContent.includes(correctAnswer)) {
            button.className = 'quiz-option correct';
            button.innerHTML = `<i class="fas fa-check-circle"></i> ${correctAnswer}`;
        }
        
        // Marcar resposta errada se for o caso
        if (button === selectedButton && !isCorrect) {
            button.className = 'quiz-option wrong';
            button.innerHTML = `<i class="fas fa-times-circle"></i> ${selectedOption}`;
        }
    });
    
    // Atualizar pontuação e feedback
    if (isCorrect) {
        score += 10;
        feedbackElement.innerHTML = `
            <div class="feedback-correct">
                <i class="fas fa-check"></i> 
                <strong>Correto!</strong> ${questions[currentQuestion].fact}
            </div>
        `;
    } else {
        feedbackElement.innerHTML = `
            <div class="feedback-incorrect">
                <i class="fas fa-times"></i> 
                <strong>Incorreto!</strong> A resposta correta é: ${correctAnswer}. 
                ${questions[currentQuestion].fact}
            </div>
        `;
    }
    
    // Atualizar pontuação
    scoreElement.innerHTML = `<i class="fas fa-star"></i> ${score} pontos`;
    nextBtn.classList.remove('hidden');
}

// Próxima pergunta
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

// Finalizar quiz
function endQuiz() {
    // Atualizar ranking
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('europeQuizLeaderboard', JSON.stringify(leaderboard));
    
    // Mostrar tela de resultados
    quizScreen.classList.remove('active-screen');
    resultsScreen.classList.add('active-screen');
    
    // Calcular porcentagem de acertos
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    
    // Atualizar elementos
    finalScoreElement.textContent = `${playerName}, você acertou ${score / 10} de ${questions.length} perguntas! (${percentage}%)`;
    scoreBar.style.width = `${percentage}%`;
    
    // Atualizar ranking
    leaderboardElement.innerHTML = '';
    leaderboard.forEach((player, index) => {
        const medal = ['🥇', '🥈', '🥉'][index] || `${index + 1}.`;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${medal} ${player.name}</span>
            <span>${player.score} pts</span>
        `;
        leaderboardElement.appendChild(li);
    });
}

// Reiniciar quiz
function restartQuiz() {
    resultsScreen.classList.remove('active-screen');
    startScreen.classList.add('active-screen');
    playerNameInput.value = '';
    nameError.style.display = 'none';
    clearInterval(timer);
}

// Funções do timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.innerHTML = `<i class="fas fa-clock"></i> ${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
    timerElement.style.color = timeLeft <= 10 ? 'var(--error)' : 'var(--primary)';
}

function timeUp() {
    feedbackElement.innerHTML = `
        <div class="feedback-incorrect">
            <i class="fas fa-hourglass-end"></i> 
            <strong>Tempo esgotado!</strong>
        </div>
    `;
    
    // Mostrar resposta correta
    const correctAnswer = questions[currentQuestion].answer;
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.disabled = true;
        if (button.textContent.includes(correctAnswer)) {
            button.className = 'quiz-option correct';
            button.innerHTML = `<i class="fas fa-check-circle"></i> ${correctAnswer}`;
        }
    });
    
    nextBtn.classList.remove('hidden');
}
