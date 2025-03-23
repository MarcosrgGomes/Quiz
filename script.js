// script.js

// Banco de perguntas com 20 questões sobre as características físicas da Europa
const questionsPool = [
    { question: "Qual é a montanha mais alta da Europa Ocidental?", options: ["Mont Blanc", "Cárpatos", "Pirineus"], answer: "Mont Blanc" },
    { question: "Qual é a principal planície que se estende do centro ao leste da Europa?", options: ["Planície Europeia Central", "Planície Siberiana", "Planície do Danúbio"], answer: "Planície Europeia Central" },
    { question: "Qual rio é o mais longo da Europa?", options: ["Volga", "Danúbio", "Reno"], answer: "Volga" },
    { question: "Qual rio passa por vários países da Europa Central e Oriental?", options: ["Danúbio", "Volga", "Tâmisa"], answer: "Danúbio" },
    { question: "Quais montanhas tradicionalmente marcam a fronteira entre a Europa e a Ásia?", options: ["Urais", "Alpes", "Cárpatos"], answer: "Urais" },
    { question: "Qual é o mar que banha o sul da Europa?", options: ["Mar Mediterrâneo", "Mar do Norte", "Mar Báltico"], answer: "Mar Mediterrâneo" },
    { question: "Qual oceano banha a costa oeste da Europa?", options: ["Oceano Atlântico", "Oceano Pacífico", "Oceano Índico"], answer: "Oceano Atlântico" },
    { question: "Qual península abriga os países de Espanha e Portugal?", options: ["Península Ibérica", "Península Itálica", "Península Balcânica"], answer: "Península Ibérica" },
    { question: "Qual país europeu é conhecido por sua grande quantidade de fiordes?", options: ["Noruega", "Grécia", "França"], answer: "Noruega" },
    { question: "Que lago europeu está localizado entre a Suíça e a França?", options: ["Lago de Genebra", "Lago Balaton", "Lago Onega"], answer: "Lago de Genebra" },
    { question: "Quais são as principais florestas do norte da Europa?", options: ["Florestas de coníferas", "Florestas tropicais", "Florestas de mangue"], answer: "Florestas de coníferas" },
    { question: "Que tipo de vegetação é predominante no sul da Europa, especialmente na região mediterrânea?", options: ["Vegetação mediterrânea", "Tundra", "Taiga"], answer: "Vegetação mediterrânea" },
    { question: "Qual cidade famosa é atravessada pelo Rio Sena?", options: ["Paris", "Londres", "Berlim"], answer: "Paris" },
    { question: "Que rio é essencial para a navegação e comércio na Europa Ocidental?", options: ["Reno", "Volga", "Danúbio"], answer: "Reno" },
    { question: "Qual lago europeu é o maior em volume de água?", options: ["Lago Ladoga", "Lago de Genebra", "Lago Balaton"], answer: "Lago Ladoga" },
    { question: "Qual das seguintes opções NÃO é uma das principais cadeias montanhosas da Europa?", options: ["Himalaia", "Alpes", "Pirineus"], answer: "Himalaia" },
    { question: "Qual é o clima predominante na Europa Central?", options: ["Temperado", "Árido", "Polar"], answer: "Temperado" },
    { question: "Que tipo de solo predomina nas planícies férteis da Europa Central?", options: ["Solos férteis", "Solos arenosos", "Solos vulcânicos"], answer: "Solos férteis" },
    { question: "A Tundra é um bioma característico de qual região da Europa?", options: ["Norte", "Sul", "Centro"], answer: "Norte" },
    { question: "Qual mar separa a Europa da África?", options: ["Mar Mediterrâneo", "Mar Báltico", "Mar Negro"], answer: "Mar Mediterrâneo" }
];

// Variáveis globais
let currentIndex = 0; // Índice da pergunta atual
let selectedQuestions = []; // Perguntas selecionadas aleatoriamente
let score = 0; // Pontuação do jogador
let leaderboardData = []; // Dados do ranking

// Seletores do DOM
const leaderboard = document.getElementById("leaderboard");
const nameSection = document.getElementById("name-section");
const playerNameInput = document.getElementById("player-name");
const startQuizButton = document.getElementById("start-quiz");

const quizSection = document.getElementById("quiz-section");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");
const quizScore = document.getElementById("quiz-score");

const endSection = document.getElementById("end-section");
const finalScore = document.getElementById("final-score");
const playerDisplayName = document.getElementById("player-display-name");
const restartQuizButton = document.getElementById("restart-quiz");

// Função para selecionar 10 perguntas aleatórias
function selectRandomQuestions() {
    const shuffled = questionsPool.sort(() => Math.random() - 0.5); // Embaralha o banco de perguntas
    return shuffled.slice(0, 10); // Retorna as 10 primeiras perguntas embaralhadas
}

// Função para iniciar o quiz
startQuizButton.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Por favor, insira seu nome antes de começar!");
        return;
    }

    // Inicializa o quiz
    playerDisplayName.textContent = playerName;
    selectedQuestions = selectRandomQuestions();
    currentIndex = 0;
    score = 0;
    quizScore.textContent = "Pontos: 0";

    // Oculta a seção de nome e exibe o quiz
    nameSection.style.display = "none";
    quizSection.style.display = "block";

    showQuestion(); // Mostra a primeira pergunta
});

// Função para exibir a pergunta atual
function showQuestion() {
    const question = selectedQuestions[currentIndex];
    quizQuestion.textContent = question.question;
    quizOptions.innerHTML = ""; // Limpa opções anteriores

    question.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.className = "quiz-option";
        button.addEventListener("click", () => checkAnswer(option)); // Adiciona evento de clique
        quizOptions.appendChild(button);
    });

    // Atualiza o número da pergunta atual
    const questionNumber = document.getElementById("question-number");
    questionNumber.textContent = currentIndex + 1;
}

// Função para verificar a resposta
function checkAnswer(selected) {
    const question = selectedQuestions[currentIndex];
    if (selected === question.answer) {
        score += 10; // Adiciona pontos se a resposta estiver correta
        quizFeedback.textContent = "🎉 Correto!";
        quizFeedback.style.color = "green";
    } else {
        quizFeedback.textContent = "❌ Errado!";
        quizFeedback.style.color = "red";
    }

    quizScore.textContent = `Pontos: ${score}`; // Atualiza pontuação exibida

    // Avança para a próxima pergunta
    currentIndex++;
    setTimeout(() => {
        quizFeedback.textContent = ""; // Limpa feedback após 1 segundo
        if (currentIndex < selectedQuestions.length) {
            showQuestion(); // Mostra próxima pergunta
        } else {
            finishQuiz(); // Finaliza o quiz se todas as perguntas foram respondidas
        }
    }, 1000);
}

// Função para finalizar o quiz
function finishQuiz() {
    quizSection.style.display = "none";
    endSection.style.display = "block";
    finalScore.textContent = `Você marcou ${score} pontos!`;

    // Adiciona o jogador ao ranking
    leaderboardData.push({ name: playerDisplayName.textContent, score });
    leaderboardData.sort((a, b) => b.score - a.score); // Ordena ranking por pontuação
    updateLeaderboard();
}

// Função para atualizar o ranking
function updateLeaderboard() {
    leaderboard.innerHTML = ""; // Limpa ranking existente
    leaderboardData.forEach(player => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.score} pontos`;
        leaderboard.appendChild(li);
    });
}

// Função para reiniciar o quiz
restartQuizButton.addEventListener("click", () => {
    endSection.style.display = "none";
    nameSection.style.display = "block";
    playerNameInput.value = ""; // Reseta o campo de nome
});