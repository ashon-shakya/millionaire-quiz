// constants
// display prize money
// display timer

const QUESTION_TIMER = 30;
const ANSWER_NO = 4;
const OPTION_SELECT_TIME = 3000;
const OPTION_REVEAL_TIME = 6000;
const FINAL_REVEAL_TIME = 5000;
const QUIZ_START_TIME = 4000;
const QUESTIONS_REQUIRED = 15;

let questionList = [];
let currQuestion = 0;

let lifeLineList = [
    {
        name: "fifty",
        label: "50 - 50",
        isUsed: false,
        img: "./assets/fifty.png",
    },
    {
        name: "poll",
        label: "Audience Poll",
        isUsed: false,
        img: "./assets/poll.png",
    },
    {
        name: "web",
        label: "Web Search",
        isUsed: false,
        img: "./assets/web.png",
    },
];

let prizeTable = [
    {
        value: 100,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 200,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 300,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 500,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 1000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 2000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 4000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 8000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 16000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 32000,
        isGuarantee: true,
        hasWon: false,
    },
    {
        value: 64000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 125000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 250000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 500000,
        isGuarantee: false,
        hasWon: false,
    },
    {
        value: 1000000,
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
        <tr class = '${
            i == currQuestion - 1
                ? "currentWin"
                : prizeTable[i].isGuarantee
                ? "guaranteed"
                : ""
        } ' >
            <td style="    text-align: right !important;">
                ${i + 1}
            </td>
            <td ${prizeTable[i].hasWon ? 'class="guaranteed"' : ""} >
                ${
                    prizeTable[i].hasWon
                        ? '<i class="fa-solid fa-gem"></i>'
                        : '<i class="fa-regular fa-circle"></i>'
                }
            </td>
            <td>
               $ ${prizeTable[i].value}
            </td>
        </tr>
    `;
    }

    prizeTableElement.innerHTML = prizeTableContent;

    displayLifeLine();
};

const displayLifeLine = () => {
    const lifeLineElement = document.getElementById("lifeLine");

    let lifeLineContent = "";

    lifeLineList.forEach((item) => {
        lifeLineContent += `
            <div class="col-4 btn">
                    <img class="img-fluid p-10 lifeLine ${
                        item.isUsed ? "usedLifeLine" : ""
                    } " src="${
            item.img
        }" alt="" srcset="" onclick="selectLifeLine('${
            item.isUsed ? "" : item.name
        }')">
            </div>`;
    });

    lifeLineElement.innerHTML = lifeLineContent;
};

const displayQuestion = (questionIndex) => {
    playAudio("early");

    currQuestion = questionIndex;
    const questionSpan = document.getElementById("question-span");
    const answerSpan = document.getElementById("answer-span");

    let optionsContent = "";

    for (i = 0; i < ANSWER_NO; i++) {
        optionsContent += `
            <div class="col-6 btn btn-primary bg-notched bg-question" onclick="submitAnswer(${i})" id="answer-${i}">
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
    correctAnswerElement.classList.remove("bg-question");
    correctAnswerElement.classList.add("btn-success");
};

const submitAnswer = (selectedAnswerKey) => {
    if (!isLoading) {
        playAudio("lock");
        isLoading = true;

        let currQuestObj = questionList[currQuestion];

        const selectedAnswerElement = document.getElementById(
            "answer-" + selectedAnswerKey
        );
        selectedAnswerElement.classList.remove("bg-question");
        selectedAnswerElement.classList.add("btn-warning");

        const selectedOptionAnswer = document.getElementById(
            "answer-" + selectedAnswerKey
        ).innerText;

        let correctAnswerKey = currQuestObj.options.indexOf(
            currQuestObj.answer
        );
        setTimeout(() => {
            if (currQuestObj.answer === selectedOptionAnswer) {
                playAudio("correct");
            } else {
                playAudio("wrong");
            }

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

    lifeLineList.forEach((item) => {
        item.isUsed = false;
    });
};

const startQuestion = async () => {
    await fetchQuestion();
    clearPrize();

    playAudio("start");

    setTimeout(() => {
        displayModule("quiz-module");
        displayQuestion(0);
    }, QUIZ_START_TIME);
};

const displayScore = () => {
    const scoreElement = document.getElementById("score");
    const winTextElement = document.getElementById("winText");

    if (prizeTable[currQuestion].hasWon) {
        scoreElement.innerText = prizeTable[currQuestion].value;
        winTextElement.innerText =
            "Congratulations!! You have become a Millionaire !!!";
        playAudio("million");
    } else {
        winTextElement.innerText = "Better luck next time!";
        if (prizeTable[currQuestion - 1]) {
            scoreElement.innerText = prizeTable[currQuestion - 1].value;
        } else {
            scoreElement.innerText = "0";
        }
    }
    displayModule("score-module");
};

const playAudio = (audioType) => {
    let audioSourceList = [
        {
            name: "intro",
            source: "./assets/sound/intro.mp3",
        },
        {
            name: "start",
            source: "./assets/sound/lets-play.mp3",
        },
        {
            name: "early",
            source: "./assets/sound/early-music.mp3",
        },
        {
            name: "correct",
            source: "./assets/sound/correct-music.mp3",
        },
        {
            name: "wrong",
            source: "./assets/sound/wrong-music.mp3",
        },
        {
            name: "lock",
            source: "./assets/sound/answer-lock.mp3",
        },
        {
            name: "intense",
            source: "./assets/sound/100000-music.mp3",
        },

        {
            name: "million",
            source: "./assets/sound/million-win.mp3",
        },
    ];

    var audio = document.getElementById("quizAudio");
    audio.pause();

    const audioSource = audioSourceList.find((item) => item.name == audioType);

    if (audioSource) {
        var source = document.getElementById("audioSource");

        // Change the source file
        source.src = audioSource.source;

        // Load the new source
        audio.load();
        // Play the audio
        audio.play();
    }
};

const startQuiz = () => {
    playAudio("intro");
    displayModule("intro-module");
};

const selectLifeLine = (lifeLine) => {
    switch (lifeLine) {
        case "fifty":
            var audio = document.getElementById("lifeLineAudio");
            audio.play();

            const currentQuestionObj = questionList[currQuestion];

            let optionsIndexList = [0, 1, 2, 3];

            let answerIndex = currentQuestionObj.options.indexOf(
                currentQuestionObj.answer
            );

            console.log(1, answerIndex);

            optionsIndexList = optionsIndexList.filter(
                (item) => item != answerIndex
            );

            let arr = [1, 2, 4];

            // Generate a random index between 0 and arr.length - 1
            let randomIndex = Math.floor(
                Math.random() * optionsIndexList.length
            );

            // Remove the element at the random index
            optionsIndexList.splice(randomIndex, 1);

            console.log(optionsIndexList);

            optionsIndexList.forEach((index) => {
                currentQuestionObj.options[index] = "";
            });

            lifeLineList.forEach((item) => {
                if (item.name == lifeLine) {
                    item.isUsed = true;
                }
            });

            displayQuestion(currQuestion);

            break;
        case "web":
            var audio = document.getElementById("lifeLineAudio");
            audio.play();
            openGoogleSearch(questionList[currQuestion].question);
            lifeLineList.forEach((item) => {
                if (item.name == lifeLine) {
                    item.isUsed = true;
                }
            });
            displayQuestion(currQuestion);

            break;
    }
};

const openGoogleSearch = (query) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        query
    )}`;
    window.open(searchUrl, "_blank");
};

window.addEventListener("load", (event) => {
    startQuiz();
});
