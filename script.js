// constants
// display prize money
// display timer

const QUESTION_TIMER = 30;
const ANSWER_NO = 4;
const OPTION_SELECT_TIME = 1000;
const OPTION_REVEAL_TIME = 2000;

const FINAL_REVEAL_TIME = 4000;

const QUESTIONS_REQUIRED = 10;

let questionList = [];

let currQuestion = 0;

let helpline = [
    {
        name: "5050",
        label: "50 - 50",
        isUsed: false,
    },
    {
        name: "poll",
        label: "Audience Poll",
        isUsed: false,
    },
    {
        name: "web",
        label: "Web Search",
        isUsed: false,
    },
];

let prizeTable = [
    {
        value: 1000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 2000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 3000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 4000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 5000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 6000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 7000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 8000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 9000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 10000,
        isGuarantee: true,
        hasWon: false,
    },
];

let isLoading = false;

const displayModule = (moduleName) => {
    const sectionList = document.querySelectorAll("section");

    sectionList.forEach((item) => {
        if (item.id != moduleName) {
            item.classList.add("hidden");
        } else {
            item.classList.remove("hidden");
        }
    });
};

const displayPrizeTable = () => {
    const prizeTableElement = document.getElementById("prizeTable");

    let prizeTableContent = "";
    let prizeLength = prizeTable.length;

    const tempPrizeTable = [...prizeTable];

    const questionLength =
        questionList.length < prizeTable.length
            ? questionList.length
            : prizeTable.length;

    for (i = questionLength - 1; i >= 0; i--) {
        prizeTableContent += `
        <tr>
            <td>
                ${i + 1}
            </td>
            <td>
                ${prizeTable[i].hasWon ? "*" : "-"}
            </td>
            <td>
                ${prizeTable[i].value}
            </td>
        </tr>
    `;
    }

    prizeTableElement.innerHTML = prizeTableContent;
};

const displayQuestion = (questionIndex) => {
    currQuestion = questionIndex;
    const questionSpan = document.getElementById("question-span");
    const answerSpan = document.getElementById("answer-span");

    let optionsContent = "";

    for (i = 0; i < ANSWER_NO; i++) {
        optionsContent += `
            <div class="col-6 btn btn-primary btn-notched" onclick="submitAnswer(${i})" id="answer-${i}">
                ${questionList[currQuestion].options[i]}
            </div> 
        
        `;
    }

    answerSpan.innerHTML = optionsContent;
    questionSpan.innerText = `${questionIndex + 1}. ${
        questionList[questionIndex].question
    }`;

    isLoading = false;

    displayPrizeTable();
};

const displayAnswer = (ck) => {
    const correctAnswerElement = document.getElementById("answer-" + ck);
    correctAnswerElement.classList.remove("btn-warning");
    correctAnswerElement.classList.remove("btn-primary");
    correctAnswerElement.classList.add("btn-success");
};

const submitAnswer = (selectedAnswerKey) => {
    if (!isLoading) {
        isLoading = true;

        let currQuestObj = questionList[currQuestion];

        const selectedAnswerElement = document.getElementById(
            "answer-" + selectedAnswerKey
        );
        selectedAnswerElement.classList.add("btn-warning");

        const selectedOptionAnswer = document.getElementById(
            "answer-" + selectedAnswerKey
        ).innerText;

        let correctAnswerKey = currQuestObj.options.indexOf(
            currQuestObj.answer
        );
        setTimeout(() => {
            displayAnswer(correctAnswerKey);
        }, OPTION_SELECT_TIME);

        if (currQuestObj.answer === selectedOptionAnswer) {
            prizeTable[currQuestion].hasWon = true;

            if (isLastQuestion(currQuestion)) {
                setTimeout(() => {
                    displayScore();
                }, FINAL_REVEAL_TIME);
            } else {
                currQuestion += 1;

                setTimeout(() => {
                    displayQuestion(currQuestion);
                }, OPTION_REVEAL_TIME);
            }
        } else {
            setTimeout(() => {
                displayScore();
            }, FINAL_REVEAL_TIME);
        }
    }
};

const isLastQuestion = (cqk) => {
    return cqk >= questionList.length - 1;
};

const fetchQuestion = async () => {
    const response = await fetch("questions.json");
    const data = await response.json();

    let randomQuestions = data.sort(() => Math.random() - 0.5);

    randomQuestions = randomQuestions.map((q) => {
        q.options.sort(() => Math.random() - 0.5);

        return q;
    });
    questionList = randomQuestions.slice(0, QUESTIONS_REQUIRED);
};

const clearPrize = () => {
    prizeTable.forEach((item) => {
        item.hasWon = false;
    });
};

const startQuestion = async () => {
    await fetchQuestion();
    clearPrize();
    displayModule("quiz-module");
    displayQuestion(0);
};

const displayScore = () => {
    const scoreElement = document.getElementById("score");

    if (prizeTable[currQuestion].hasWon) {
        scoreElement.innerText = prizeTable[currQuestion].value;
    } else {
        if (prizeTable[currQuestion - 1]) {
            scoreElement.innerText = prizeTable[currQuestion - 1].value;
        } else {
            scoreElement.innerText = "0";
        }
    }
    displayModule("score-module");
};

displayModule("intro-module");
