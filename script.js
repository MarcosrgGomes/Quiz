// Variáveis globais atualizadas
let currentQuestionIndex = 0;
let playerName = '';
let score = 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let selectedQuestions = [];
let timerInterval;

// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para iniciar o quiz
function startQuiz() {
    playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Por favor, insira um nome válido!');
        return;
    }

    shuffleArray(questionsPool);
    selectedQuestions = questionsPool.slice(0, 10);

    document.getElementById('name-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';

    loadQuestion();
}

// Função para carregar a pergunta
function loadQuestion() {
    clearInterval(timerInterval); // Reinicia o temporizador
    let timeLeft = 30; // 30 segundos por pergunta
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null, selectedQuestions[currentQuestionIndex].answer); // Resposta automática
        }
    }, 1000);

    const question = selectedQuestions[currentQuestionIndex];
    const questionText = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');
    const questionNumber = document.getElementById('question-number');

    questionText.textContent = question.question;
    questionNumber.textContent = `Pergunta: ${currentQuestionIndex + 1}/10`;

    optionsContainer.innerHTML = ''; // Limpar opções anteriores

    // Criar os botões de resposta
    shuffleArray(question.options).forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button'); // Adiciona classe CSS para estilização
        button.onclick = () => {
            clearInterval(timerInterval); // Parar o temporizador ao responder
            checkAnswer(option, question.answer);
        };
        button.setAttribute('aria-label', `Opção de resposta: ${option}`);
        optionsContainer.appendChild(button);
    });
}

// Função para verificar a resposta
function checkAnswer(selectedAnswer, correctAnswer) {
    const feedback = document.getElementById('quiz-feedback');
    const optionsContainer = document.getElementById('quiz-options');

    // Desabilitar todos os botões após a resposta
    optionsContainer.querySelectorAll('button').forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add('correct'); // Destacar resposta correta
        } else if (button.textContent === selectedAnswer) {
            button.classList.add('incorrect'); // Destacar resposta errada
        }
    });

    if (selectedAnswer === correctAnswer) {
        score += 10;
        feedback.textContent = 'Resposta Correta! 🎉';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = selectedAnswer
            ? `Resposta Errada! A resposta correta era: ${correctAnswer}`
            : 'Tempo esgotado! 😢';
        feedback.style.color = 'red';
    }

    document.getElementById('quiz-score').textContent = `Pontos: ${score}`;
    currentQuestionIndex++;

    setTimeout(() => {
        if (currentQuestionIndex < selectedQuestions.length) {
            loadQuestion(); // Carregar próxima pergunta
        } else {
            showEndScreen(); // Exibir tela final
        }
    }, 1000);
}

// Função para exibir a tela final e atualizar o ranking
function showEndScreen() {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('end-section').style.display = 'block';
    document.getElementById('final-score').textContent = `Pontuação final: ${score}`;
    document.getElementById('player-display-name-final').textContent = `Parabéns, ${playerName}!`;

    // Atualizar o ranking
    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    updateLeaderboard();
}

// Função para atualizar o ranking na tela
function updateLeaderboard() {
    const leaderboardContainer = document.getElementById('final-leaderboard');
    leaderboardContainer.innerHTML = '';
    let medals = ['🥇', '🥈', '🥉'];
    leaderboard.forEach((entry, index) => {
        let li = document.createElement('li');
        li.innerHTML = `${medals[index] || ''} ${entry.name} - ${entry.score} pontos`;
        leaderboardContainer.appendChild(li);
    });
}

// Função para reiniciar o quiz
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    clearInterval(timerInterval);
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('end-section').style.display = 'none';
    document.getElementById('name-section').style.display = 'block';
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-score').textContent = 'Pontos: 0';
    document.getElementById('player-name').value = '';
}

// Função para atualizar o temporizador na tela
function updateTimerDisplay(timeLeft) {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Tempo restante: ${timeLeft}s`;
    timerElement.style.color = timeLeft <= 10 ? 'red' : 'black';
}

// Banco de perguntas
const questionsPool = [
    // Relevo
    { question: "Qual é a montanha mais alta da Europa Ocidental?", options: ["Mont Blanc", "Cárpatos", "Pirineus"], answer: "Mont Blanc" },
    { question: "Qual é a principal planície que se estende do centro ao leste da Europa?", options: ["Planície Europeia Central", "Planície Siberiana", "Planície do Danúbio"], answer: "Planície Europeia Central" },
    { question: "Quais montanhas tradicionalmente marcam a fronteira entre a Europa e a Ásia?", options: ["Urais", "Alpes", "Cárpatos"], answer: "Urais" },
    { question: "Qual cadeia montanhosa é famosa por suas estações de esqui e atravessa vários países europeus?", options: ["Alpes", "Pirineus", "Cárpatos"], answer: "Alpes" },
    { question: "Qual é o ponto mais alto dos Pirineus?", options: ["Aneto", "Monte Branco", "Monte Elbrus"], answer: "Aneto" },
    { question: "Qual é a principal característica do relevo do norte da Europa?", options: ["Planícies extensas", "Montanhas altas", "Desertos"], answer: "Planícies extensas" },
    { question: "Qual é a cordilheira que separa a Península Ibérica da França?", options: ["Pirineus", "Alpes", "Cárpatos"], answer: "Pirineus" },
    { question: "Qual é o nome da planície que se estende da França até a Rússia?", options: ["Planície Europeia Central", "Planície Siberiana", "Planície do Danúbio"], answer: "Planície Europeia Central" },
    { question: "Qual é a montanha mais alta da Europa?", options: ["Monte Elbrus", "Mont Blanc", "Monte Rosa"], answer: "Monte Elbrus" },
    { question: "Qual é a principal cadeia montanhosa da Península Balcânica?", options: ["Balcãs", "Alpes", "Cárpatos"], answer: "Balcãs" },

    // Hidrografia
    { question: "Qual é o rio mais longo da Europa?", options: ["Volga", "Danúbio", "Reno"], answer: "Volga" },
    { question: "Qual rio atravessa mais países na Europa?", options: ["Danúbio", "Volga", "Reno"], answer: "Danúbio" },
    { question: "Qual é o maior lago da Europa?", options: ["Lago Ladoga", "Lago de Genebra", "Lago Balaton"], answer: "Lago Ladoga" },
    { question: "Qual rio é essencial para o comércio na Europa Ocidental?", options: ["Reno", "Volga", "Danúbio"], answer: "Reno" },
    { question: "Qual rio banha a cidade de Paris?", options: ["Sena", "Tâmisa", "Reno"], answer: "Sena" },
    { question: "Qual é o maior lago da Europa em volume de água?", options: ["Lago Ladoga", "Lago Onega", "Lago Vänern"], answer: "Lago Ladoga" },
    { question: "Qual rio forma a fronteira entre a Alemanha e a França?", options: ["Reno", "Danúbio", "Elba"], answer: "Reno" },
    { question: "Qual é o rio mais importante da Península Ibérica?", options: ["Tejo", "Douro", "Ebro"], answer: "Tejo" },
    { question: "Qual rio deságua no Mar Negro?", options: ["Danúbio", "Volga", "Dnieper"], answer: "Danúbio" },
    { question: "Qual é o maior lago da Europa em área superficial?", options: ["Lago Ladoga", "Lago Onega", "Lago Vänern"], answer: "Lago Ladoga" },

    // Vegetação
    { question: "Qual tipo de vegetação predomina no norte da Europa?", options: ["Tundra", "Florestas temperadas", "Vegetação mediterrânea"], answer: "Tundra" },
    { question: "Qual é a vegetação predominante no sul da Europa?", options: ["Vegetação mediterrânea", "Tundra", "Florestas de coníferas"], answer: "Vegetação mediterrânea" },
    { question: "Qual tipo de floresta é comum na Europa Central?", options: ["Florestas temperadas", "Florestas tropicais", "Florestas de coníferas"], answer: "Florestas temperadas" },
    { question: "Qual é a principal árvore das florestas mediterrâneas?", options: ["Oliveira", "Carvalho", "Pinheiro"], answer: "Oliveira" },
    { question: "Qual tipo de vegetação é encontrada nas regiões montanhosas da Europa?", options: ["Florestas de coníferas", "Tundra", "Savana"], answer: "Florestas de coníferas" },
    { question: "Qual é a vegetação característica da tundra?", options: ["Musgos e líquens", "Árvores altas", "Cactos"], answer: "Musgos e líquens" },
    { question: "Qual é a vegetação predominante na Península Ibérica?", options: ["Vegetação mediterrânea", "Tundra", "Florestas de coníferas"], answer: "Vegetação mediterrânea" },
    { question: "Qual é a vegetação predominante na Escandinávia?", options: ["Florestas de coníferas", "Tundra", "Vegetação mediterrânea"], answer: "Florestas de coníferas" },
    { question: "Qual é a vegetação predominante na Planície Húngara?", options: ["Estepe", "Florestas temperadas", "Tundra"], answer: "Estepe" },
    { question: "Qual é a vegetação predominante nos Alpes?", options: ["Florestas de coníferas", "Tundra", "Vegetação mediterrânea"], answer: "Florestas de coníferas" },

    // Clima
    { question: "Qual é o clima predominante na Europa Central?", options: ["Temperado", "Árido", "Polar"], answer: "Temperado" },
    { question: "Qual é o clima predominante no sul da Europa?", options: ["Mediterrâneo", "Polar", "Tropical"], answer: "Mediterrâneo" },
    { question: "Qual é o clima predominante no norte da Europa?", options: ["Subártico", "Temperado", "Árido"], answer: "Subártico" },
    { question: "Qual corrente oceânica influencia o clima da Europa Ocidental?", options: ["Corrente do Golfo", "Corrente de Humboldt", "Corrente de Kuroshio"], answer: "Corrente do Golfo" },
    { question: "Qual é o clima predominante na Península Ibérica?", options: ["Mediterrâneo", "Polar", "Tropical"], answer: "Mediterrâneo" },
    { question: "Qual é o clima predominante na Rússia Europeia?", options: ["Continental", "Mediterrâneo", "Tropical"], answer: "Continental" },
    { question: "Qual é o clima predominante na Escandinávia?", options: ["Subártico", "Temperado", "Árido"], answer: "Subártico" },
    { question: "Qual é o clima predominante nos Alpes?", options: ["Alpino", "Mediterrâneo", "Tropical"], answer: "Alpino" },
    { question: "Qual é o clima predominante na Grécia?", options: ["Mediterrâneo", "Polar", "Tropical"], answer: "Mediterrâneo" },
    { question: "Qual é o clima predominante na Islândia?", options: ["Subpolar", "Temperado", "Árido"], answer: "Subpolar" }
];

// Eventos de clique nos botões
document.getElementById('start-quiz').addEventListener('click', startQuiz);
document.getElementById('restart-quiz').addEventListener('click', restartQuiz);
