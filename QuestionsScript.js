// Get a random integer between two values
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

// Fill and array with i number of random numbers that range between
// the two numbers inside the getRandomInt(min, max) method
let questionsIndex = [];
const NUMBER_OF_QUESTIONS = 6;
// Define the first number to use as a point of reference
questionsIndex[0] = getRandomInt(0, NUMBER_OF_QUESTIONS);
let randomInt;
let i = 1;
do {
    // get a random integer between 0 and the number of questions
    randomInt = getRandomInt(0, NUMBER_OF_QUESTIONS);
    // make sure there are no duplicates
    if (!questionsIndex.includes(randomInt)) {
        questionsIndex[i] = randomInt;
        i++
    }
} while (i < 6)

let total_time_left = 0;

class QuizQuestion {
    // Constructor!
    constructor(question, userAnswers, pairWords, choice1, choice2, choice3, choice4, questionType, correctAnswers, local_time_left) {
        this.question = question;
        this.userAnswers = userAnswers;
        this.pairWords = pairWords;
        this.choice1 = choice1;
        this.choice2 = choice2;
        this.choice3 = choice3;
        this.choice4 = choice4;
        this.questionType = questionType;
        this.correctAnswers = correctAnswers;
        this.local_time_left = local_time_left;
        total_time_left += local_time_left; // sucks ass
    }


    // DIY constructor for true or false type questions
    static TrueOrFalse(question, choice1, choice2, correctAnswers, local_time_left=60) {
        question += '<br>'
        choice1 += '<label for="ans1">Αλήθές</label>'; // Add the apropriate label for each choice
        choice2 += '<label for="ans2">Ψευδές</label>'; // ^
        return new QuizQuestion(question, [0, 0], "", choice1, choice2, "", "", "TrueOrFalse", correctAnswers, local_time_left)
    }

    static MultipleChoice(question, choice1, choice2, choice3, correctAnswers, local_time_left=60) {
        question += '<br>'
        return new QuizQuestion(question, [0, 0, 0], "", choice1, choice2, choice3, "", "MultipleChoice", correctAnswers, local_time_left)
    }

    static MultipleAnswer(question, choice1, choice2, choice3, choice4, correctAnswers, local_time_left=60) {
        question += '<br>'
        return new QuizQuestion(question, [0, 0, 0, 0], "", choice1, choice2, choice3, choice4, "MultipleAnswers", correctAnswers, local_time_left)
    }

    static CompleteSentence(question, choice1, correctAnswers, local_time_left=60) {
        return new QuizQuestion(question, [""], "", choice1, "", "", "", "CompleteSentence", correctAnswers, local_time_left)
    }

    static PairWords(question, pairWords, choice1, choice2, choice3, choice4, correctAnswers, local_time_left=60) {
        return new QuizQuestion(question, [""], pairWords, choice1, choice2, choice3, choice4, "PairWords", correctAnswers, local_time_left)
    }

    // getter method that returns the whole question
    get Question() {
        return this.constructQuestion();
    }

    // Add and return the question and all the choices in a big string
    constructQuestion() {
        return this.question
        + this.pairWords
        + this.choice1
        + this.choice2
        + this.choice3
        + this.choice4;
    }

    // Fires everytime the user selects and answer
    // Saves the user's answers inside an array
    // used only for true or false and multiple choice questions
    SaveAnswer(ans) {
        // Runs a different block of code depending on the nature of the question
        if (this.questionType == "TrueOrFalse" || this.questionType == "MultipleChoice") {
            // Only save the answers if they are new
            if (this.userAnswers[ans] == 0) {
                this.userAnswers.forEach(CheckAnswers);
                function CheckAnswers(NULL, index, userAnswers) {
                    if (index == ans) {
                        userAnswers[index] = 1;
                    } else {
                        userAnswers[index] = 0;
                    }
                }
                // Call the correct function to format the code depending on wether
                // the question is true or false, or multiple choice
                this.questionType == "TrueOrFalse" ? this.FormatTrueOrFalseQuestions(ans) : this.FormatMultipleChoiceQuestions(ans);
            }
        } else if (this.questionType == "MultipleAnswers") {
            this.userAnswers[ans] = Math.abs(this.userAnswers[ans] - 1);
            this.FormatMultipleAnswersQuestions(ans);
        } else if (this.questionType == "CompleteSentence") {   
            this.userAnswers[0] = ans;
            this.FormatCompleteSentenceQuestions(ans);
            
        }
    }

    // Changes the HTML code of the choices save the answers inside the code

    // For Ture or False questions each time a choice is checked,
    // the other option must be un-checked
    FormatTrueOrFalseQuestions(ans) {
        if (ans == 0) {
            this.choice1 = this.choice1.substr(0, 7) + "checked " + this.choice1.substr(7);
            this.choice2 = this.choice2.replace("checked ", "");
        } else {
            this.choice2 = this.choice2.substr(0, 7) + "checked " + this.choice2.substr(7);
            this.choice1 = this.choice1.replace("checked ", "");
        }
    }

    // Same logic with true or false questions
    // But with 3 choices
    FormatMultipleChoiceQuestions(ans) {
        if (ans == 0) {
            this.choice1 = this.choice1.substr(0, 7) + "checked " + this.choice1.substr(7);
            this.choice2 = this.choice2.replace("checked ", "");
            this.choice3 = this.choice3.replace("checked ", "");
        } else if (ans == 1) {
            this.choice2 = this.choice2.substr(0, 7) + "checked " + this.choice2.substr(7);
            this.choice3 = this.choice3.replace("checked ", "");
            this.choice1 = this.choice1.replace("checked ", "");
        } else {
            this.choice3 = this.choice3.substr(0, 7) + "checked " + this.choice3.substr(7);
            this.choice1 = this.choice1.replace("checked ", "");
            this.choice2 = this.choice2.replace("checked ", "");
        }
    }

    // For multiple answers type questions each option is independent for one another
    // Meaning that chosing one does not result to having to un-chose the others
    FormatMultipleAnswersQuestions(ans) {
        if (ans == 0) {
            if (this.choice1.includes("checked")) {
                this.choice1 = this.choice1.replace("checked ", "");
            } else {
                this.choice1 = this.choice1.substr(0, 7) + "checked " + this.choice1.substr(7);
            }
        } else if (ans == 1) {
            if (this.choice2.includes("checked")) {
                this.choice2 = this.choice2.replace("checked ", "");
            } else {
                this.choice2 = this.choice2.substr(0, 7) + "checked " + this.choice2.substr(7);
            }
        } else if (ans == 2) {
            if (this.choice3.includes("checked")) {
                this.choice3 = this.choice3.replace("checked ", "");
            } else {
                this.choice3 = this.choice3.substr(0, 7) + "checked " + this.choice3.substr(7);
            }
        } else {
            if (this.choice4.includes("checked")) {
                this.choice4 = this.choice4.replace("checked ", "");
            } else {
                this.choice4 = this.choice4.substr(0, 7) + "checked " + this.choice4.substr(7);
            }
        }
    }

    // Triggers everytime there is an input at the text box
    // replaces everytime the old value with the new one
    FormatCompleteSentenceQuestions(ans) {
        // the oldValue is extracted by searching for a regex expression inside the html code (choice1)
        // then is gets replaced by the new value
        // these 2 lines of code took me 4 hours to write (●'◡'●)
        let oldValue = this.choice1.match(/value="[^"]*"/gi);
        this.choice1 = this.choice1.replace(oldValue, `value="${ans}"`);
    }
}

// #region define questions

// #region True or False qeustions
let q0 = QuizQuestion.TrueOrFalse
(
    'Οι ζώνες στο Brazilian Jiu-Jitsu συμβολίζουν το επίπεδο επιδεξιότητας του αθλητή.', // question
    '<input type="radio" id="ans1" name="question0" onclick="q0.SaveAnswer(0)">', // choice 1
    '<input type="radio" id="ans2" name="question0" onclick="q0.SaveAnswer(1)">', // choice 2
    [1 , 0] // correct answers
)

let q1 = QuizQuestion.TrueOrFalse
(
    'Η έκφραση "OSS" που χρησιμοποιείται συχνά στο Brazilian Jiu-Jitsu σημαίνει "Only Submissions Succeed".', // question
    '<input type="radio" id="ans1" name="question1" onclick="q1.SaveAnswer(0)">', // choice 1
    '<input type="radio" id="ans2" name="question1" onclick="q1.SaveAnswer(1)">', // choice 2
    [1 , 0] // correct answers
)

let q2 = QuizQuestion.TrueOrFalse
(
    'Στο Brazilian Jiu-Jitsu, ο όρος "Shrimping" αναφέρεται σε ένα είδος χτυπήματος.', // question
    '<input type="radio" id="ans1" name="question2" onclick="q2.SaveAnswer(0)">', // choice 1
    '<input type="radio" id="ans2" name="question2" onclick="q2.SaveAnswer(1)">', // choice 2
    [0, 1] // correct answers
)
// #endregion

// #region Multiple Choice qeustions
let q3 = QuizQuestion.MultipleChoice
(
    'Ποιος από τους παρακάτω θεωρείται "πατέρας" του Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="ans1" name="question3" onclick="q3.SaveAnswer(0)"><label for="ans1">Bruce Lee</label><br>', // choice 1
    '<input type="radio" id="ans2" name="question3" onclick="q3.SaveAnswer(1)"><label for="ans2">Helio Gracie</label><br>', // choice 2
    '<input type="radio" id="ans3" name="question3" onclick="q3.SaveAnswer(2)"><label for="ans3">Muhammad Ali</label><br>', // choice 3
    [0, 1, 0] // correct answers
)

let q4 = QuizQuestion.MultipleChoice
(
    'Ποιο από τα παρακάτω ΔΕΝ είναι ένας τύπος τεχνικής υποταγής στο Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="ans1" name="question4" onclick="q4.SaveAnswer(0)"><label for="ans1">Armbar</label><br>', // choice 1
    '<input type="radio" id="ans2" name="question4" onclick="q4.SaveAnswer(1)"><label for="ans2">Rear Naked Choke</label><br>', // choice 2
    '<input type="radio" id="ans3" name="question4" onclick="q4.SaveAnswer(2)"><label for="ans3">Roundhouse Kick</label><br>', // choice 3
    [0, 0, 1] // correct answers
)

let q5 = QuizQuestion.MultipleChoice
(
    'Η "guard" στο Brazilian Jiu-Jitsu αναφέρεται σε:', // question
    '<input type="radio" id="ans1" name="question5" onclick="q5.SaveAnswer(0)"><label for="ans1">Στάση που ο αθλητής βρίσκεται στο έδαφος</label><br>', // choice 1
    '<input type="radio" id="ans2" name="question5" onclick="q5.SaveAnswer(1)"><label for="ans2">Υποταγή</label><br>', // choice 2
    '<input type="radio" id="ans3" name="question5" onclick="q5.SaveAnswer(2)"><label for="ans3">Στάση που ο αθλητής βρίσκεται όρθιος</label><br>', // choice 3
    [1, 0, 0] // correct answers
)

let q6 = QuizQuestion.MultipleChoice
(
    'Η έκφραση "rolling" στο Brazilian Jiu-Jitsu αναφέρεται σε:', // question
    '<input type="radio" id="ans1" name="question6" onclick="q6.SaveAnswer(0)"><label for="ans1">Την κίνηση προς τα πίσω</label><br>', // choice 1
    '<input type="radio" id="ans2" name="question6" onclick="q6.SaveAnswer(1)"><label for="ans2">Έναν "γύρο" μάχης πραγματικής αντίστασης με σκοπό την υποταγή</label><br>', // choice 2
    '<input type="radio" id="ans3" name="question6" onclick="q6.SaveAnswer(2)"><label for="ans3">Την προσπάθεια εκτέλεσης υποταγής</label><br>', // choice 3
    [0, 1, 0] // correct answers
)

let q7 = QuizQuestion.MultipleChoice
(
    'Ποιο από τα παρακάτω ΔΕΝ είναι στάση στο Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="ans1" name="question7" onclick="q7.SaveAnswer(0)"><label for="ans1">Spider Guard</label><br>', // choice 1
    '<input type="radio" id="ans2" name="question7" onclick="q7.SaveAnswer(1)"><label for="ans2">Turtle Position</label><br>', // choice 2
    '<input type="radio" id="ans3" name="question7" onclick="q7.SaveAnswer(2)"><label for="ans3">Frog Stance</label><br>', // choice 3
    [0, 0, 1] // correct answers
)
// #endregion

// #region Multiple Answer qeustions
let q8 = QuizQuestion.MultipleAnswer
(
    'Ποιοι από τους παρακάτω είναι βασικοί στόχοι του Brazilian Jiu-Jitsu;',
    '<input type="checkbox" id="ans1" name="q8" onclick="q8.SaveAnswer(0)"><label for="ans1">Υποταγή</label><br>', // choice 1
    '<input type="checkbox" id="ans2" name="q8" onclick="q8.SaveAnswer(1)"><label for="ans2">Πάλη στο έδαφος</label><br>', // choice 2
    '<input type="checkbox" id="ans3" name="q8" onclick="q8.SaveAnswer(2)"><label for="ans3">Έλενχος του αντιπάλου</label><br>', // choice 3
    '<input type="checkbox" id="ans4" name="q8" onclick="q8.SaveAnswer(3)"><label for="ans4">Αφοπλισμός όπλου</label><br>', // choice 4
    [1, 1, 1, 0] // correct answers
)

let q9 = QuizQuestion.MultipleAnswer
(
    'Ποια από τις παρακάτω είναι είδη υποταγών στο Brazilian Jiu-Jitsu;',
    '<input type="checkbox" id="ans1" name="q9" onclick="q9.SaveAnswer(0)"><label for="ans1">Kimura Grip</label><br>', // choice 1
    '<input type="checkbox" id="ans2" name="q9" onclick="q9.SaveAnswer(1)"><label for="ans2">Triangle Choke</label><br>', // choice 2
    '<input type="checkbox" id="ans3" name="q9" onclick="q9.SaveAnswer(2)"><label for="ans3">Armbar</label><br>', // choice 3
    '<input type="checkbox" id="ans4" name="q9" onclick="q9.SaveAnswer(3)"><label for="ans4">Kimura</label><br>', // choice 4
    [0, 1, 1, 1] // correct answers
)

let q10 = QuizQuestion.MultipleAnswer
(
    'Ποιοι από τους παρακάτω αποτελούν μέρος του "guard" στο Brazilian Jiu-Jitsu;',
    '<input type="checkbox" id="ans1" name="q10" onclick="q10.SaveAnswer(0)"><label for="ans1">De la Riva</label><br>', // choice 1
    '<input type="checkbox" id="ans2" name="q10" onclick="q10.SaveAnswer(1)"><label for="ans2">Half Guard</label><br>', // choice 2
    '<input type="checkbox" id="ans3" name="q10" onclick="q10.SaveAnswer(2)"><label for="ans3">Kneebar</label><br>', // choice 3
    '<input type="checkbox" id="ans4" name="q10" onclick="q10.SaveAnswer(3)"><label for="ans4">Όλα τα παραπάνω</label><br>', // choice 4
    [1, 1, 0, 0] // correct answers
)
// #endregion

// #region Complete the Sentence qeustions
let q11 = QuizQuestion.CompleteSentence
(
    'Στο Brazilian Jiu-Jitsu, η τεχνική του ',
    '<input value="" type="text" name="q11" oninput="q11.SaveAnswer(value)"> χρησιμοποιείται για να ρίξει αντίπαλο στο έδαφος.<br>', // choice 1
    ["Takedown"] // correct answers
);

let q12 = QuizQuestion.CompleteSentence
(
    'Στο Brazilian Jiu-Jitsu, ο όρος ',
    '<input value="" type="text" name="q12" oninput="q12.SaveAnswer(value)"> αναφέρεται στην δράση του επιθετικού παίχτη να περάσει/ελευθερωθεί απο τα πόδια του αντιπάλου.<br>', // choice 1
    ["Guard Pass"] // correct answers
);

let q13 = QuizQuestion.CompleteSentence
(
    'Η τεχνική ',
    '<input value="" type="text" name="q13" oninput="q13.SaveAnswer(value)"> εστιάζει στον πνιγμό του αντιπάλου με τη χρήση του μανικιού.<br>', // choice 1
    ["Ezekiel"] // correct answers
);
// #endregion


// https://jsfiddle.net/xptLU/ -> useful
let q14 = QuizQuestion.PairWords
(
    'Συνδέστε τις σωστές στάσεις στο Brazilian Jiu-Jitsu με τα ονόματά τους:',
    `<div id="drag1">
    <span id="play" draggable="true" ondragstart="drag(event)"><b>Open</b></span> 
    <span id="guitar" draggable="true" ondragstart="drag(event)"><b>Side</b></span>
    <span id="play" draggable="true" ondragstart="drag(event)"><b>Cross</b></span> 
    <span id="guitar" draggable="true" ondragstart="drag(event)"><b>Back</b></span>
    </div>`,
    '<div name="q14" class="pairWordsInput" id="option0" ondrop="drop(event)" ondragover="allowDrop(event)"></div><span class="explanation">Guard</span><br>', // choice 1
    '<div name="q14" class="pairWordsInput" id="option1" ondrop="drop(event)" ondragover="allowDrop(event)"></div><span class="explanation">Control</span><br>', // choice 2
    '<div name="q14" class="pairWordsInput" id="option2" ondrop="drop(event)" ondragover="allowDrop(event)"></div><span class="explanation">Collar Choke</span><br>', // choice 3
    '<div name="q14" class="pairWordsInput" id="option3" ondrop="drop(event)" ondragover="allowDrop(event)"></div><span class="explanation">Take</span><br>', // choice 4
    [1, 1, 1, 0] // correct answers
)

// #endregion

//let questionDataBase = [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13]
let questionDataBase = [q14, q14, q14, q14, q14, q14]


// Change the innerHTML of the main page to a question
function showQuestion(questionNum) {
    document.getElementById("mainForm").innerHTML = `<h3>Ερώτηση ${questionNum + 1}</h3>`;
    document.getElementById("mainForm").innerHTML += questionDataBase[questionsIndex[questionNum]].Question;
    //document.getElementById("mainForm").innerHTML = questionsIndex; // (uncomment to check if the random suff works)
}


let questionNum = 0
// questionNum is always equal to 0 when this runs
// It shows the first question when the page loads for the first time
showQuestion(questionNum);

// Change to the next question
function NextQuestion() {
    questionNum == 5 ? questionNum = 0 : questionNum++;
    showQuestion(questionNum);
}

// Change to the previous question
function PrevQuestion() {
    questionNum == 0 ? questionNum = 5 : questionNum--;
    showQuestion(questionNum);
}

// Change to a specific question
function jumpToQuestion(num) {
    questionNum = Number(num);
    showQuestion(questionNum);
}

// TODO: Show the final resutls
function ShowResults() {
    document.getElementById("mainForm").innerHTML = "";
    for (let i = 0; i < 6; i++) {
        document.getElementById("mainForm").innerHTML += questionDataBase[questionsIndex[i]].userAnswers + "<br>";
        document.getElementById("mainForm").innerHTML += questionDataBase[questionsIndex[i]].correctAnswers + "<br>";
    }
}

// GYAAT
document.getElementById("timer").innerHTML = `Time left: ${total_time_left} seconds`;

// Update the count down every 1 second
// TODO: https://codepen.io/vaughnantonyan/pen/baypWZ
let total_time_counter = setInterval(function() {
    total_time_left--;
    document.getElementById("timer").innerHTML = `Time left: ${total_time_left} seconds`;
}, 1000);
