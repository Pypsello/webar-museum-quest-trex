// quiz.js
const questions = [
  {
    text: "Как расшифровывается название T-Rex?",
    options: [
      "Тираннозавр Реконструированный",
      "Тираннозавр Рекс",
      "Травоядный Рекс"
    ],
    correct: 1,
  },
  {
    text: "В каком периоде жил T-Rex?",
    options: [
      "Юрский период",
      "Триасовый период",
      "Меловой период"
    ],
    correct: 2,
  },
  {
    text: "Чем, по современным данным, питался T-Rex?",
    options: [
      "В основном растениями",
      "Был хищником и падальщиком",
      "Только рыбой"
    ],
    correct: 1,
  },
];

let currentIndex = 0;
let correctCount = 0;
let quizStarted = false;
let locked = false;

const panel = document.getElementById("quiz-panel");
const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const progressEl = document.getElementById("quiz-progress");
const resultEl = document.getElementById("quiz-result");
const nextBtn = document.getElementById("quiz-next");
const hintEl = document.getElementById("hint");

function showPanel() {
  if (!panel) return;
  panel.classList.add("visible");
}

function hidePanel() {
  if (!panel) return;
  panel.classList.remove("visible");
}

function renderQuestion() {
  const q = questions[currentIndex];
  if (!q) return;

  questionEl.textContent = q.text;
  progressEl.textContent = `Вопрос ${currentIndex + 1} из ${questions.length}`;
  resultEl.textContent = "";
  nextBtn.style.display = "none";
  nextBtn.disabled = true;
  locked = false;

  optionsEl.innerHTML = "";
  q.options.forEach((text, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = text;
    btn.addEventListener("click", () => handleAnswer(idx, btn));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(idx, btn) {
  if (locked) return;
  locked = true;

  const q = questions[currentIndex];
  const optionsBtns = optionsEl.querySelectorAll(".quiz-option");

  optionsBtns.forEach((b, i) => {
    if (i === q.correct) {
      b.classList.add("correct");
    }
    if (i === idx && i !== q.correct) {
      b.classList.add("wrong");
    }
    b.disabled = true;
  });

  if (idx === q.correct) {
    correctCount += 1;
    resultEl.textContent = "Верно!";
  } else {
    resultEl.textContent = "Неверно.";
  }

  if (currentIndex === questions.length - 1) {
    // последний вопрос
    nextBtn.textContent = "Завершить";
  } else {
    nextBtn.textContent = "Следующий вопрос";
  }

  nextBtn.style.display = "block";
  nextBtn.disabled = false;
}

function finishQuiz() {
  const total = questions.length;
  if (correctCount === total) {
    resultEl.textContent = `Победа! Ты ответил(а) правильно на все ${total} вопроса.`;
    if (hintEl) {
      hintEl.textContent = "Поздравляем! Квест пройден.";
    }
  } else {
    resultEl.textContent = `Ты ответил(а) правильно на ${correctCount} из ${total}. Попробуй ещё раз — наведи камеру на маркер.`;
    if (hintEl) {
      hintEl.textContent = "Можно попробовать пройти квест ещё раз.";
    }
  }

  // блокируем кнопку и ответы
  nextBtn.disabled = true;
}

function gotoNext() {
  if (currentIndex === questions.length - 1) {
    finishQuiz();
  } else {
    currentIndex += 1;
    renderQuestion();
  }
}

nextBtn.addEventListener("click", gotoNext);

// ===== Связь с AR через кастомные события =====

// стартуем квиз один раз при первом обнаружении маркера
window.addEventListener("trex-marker-found", () => {
  if (quizStarted) return;
  quizStarted = true;
  currentIndex = 0;
  correctCount = 0;
  showPanel();
  renderQuestion();
});

// если хочется скрывать панель, когда маркер пропадает:
window.addEventListener("trex-marker-lost", () => {
  // hidePanel(); // можно раскомментировать, если нужно прятать квиз
});
