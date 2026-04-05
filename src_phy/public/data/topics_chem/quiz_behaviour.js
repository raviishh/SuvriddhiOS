let pageTitle = document.title;
let questions = [];

let questionnumber = 0;
let correctanswer = 0;

fetch("/data/topics_chem/questions.json")
    .then((res) => res.json())
    .then((data) => {
        questions = data[pageTitle];
        console.log(questions);
        FetchAndUpdateQuestion();
    });

// HTML objects
const option_buttons = document.querySelectorAll(".option");
const question_text = document.querySelector(".question");
const explanation = document.getElementById("explanation");
const next_btn = document.getElementById("next");
const progress_outer = document.querySelector(".progress_outer");
const progress_inner = document.querySelector(".progress_inner");

function FetchAndUpdateQuestion() {
    progress_inner.style.width = `${(questionnumber / questions.length) * 100}%`;
    let MCQ = questions[questionnumber];
    question_text.textContent = MCQ.question;
    option_buttons.forEach((btn, i) => {
        btn.textContent = MCQ.options[i];
        btn.classList.remove("correct", "wrong", "faded");
        btn.disabled = false;
    });
    explanation.textContent = MCQ.explanation;
    explanation.classList.remove("visible");
    next_btn.classList.remove("visible");
}

function handleAnswer(selected) {
    let MCQ = questions[questionnumber];

    option_buttons.forEach((btn, i) => {
        if (i === MCQ.answer) {
            btn.classList.add("correct");
        } else if (i === selected) {
            btn.classList.add("wrong");
        } else {
            btn.classList.add("faded");
        }
        btn.disabled = true;
    });

    if (selected === MCQ.answer) correctanswer++;

    explanation.classList.add("visible");
    next_btn.classList.add("visible");
}

function onNextButtonClick() {
    questionnumber += 1;
    if (questionnumber === questions.length) {
        progress_inner.style.width = `${(questionnumber / questions.length) * 100}%`;
        progress_outer.classList.add("complete");
        option_buttons.forEach((btn) => btn.classList.add("hidden"));
        explanation.classList.remove("visible");
        next_btn.classList.remove("visible");
        question_text.classList.add("hidden");
        document.getElementById("completion").classList.add("visible");
        document.getElementById("score").textContent =
            `You got ${correctanswer}/${questions.length} correct`;
    } else {
        FetchAndUpdateQuestion();
    }
}
