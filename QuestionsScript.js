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
const NUMBER_OF_QUESTIONS = 6
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
    constructor(question, userAnswers, choice1, choice2, choice3, choice4, correctAnswers, local_time_left) {
        this.question = question;
        this.userAnswers = userAnswers;
        this.choice1 = choice1;
        this.choice2 = choice2;
        this.choice3 = choice3;
        this.choice4 = choice4;
        this.correctAnswers = correctAnswers;
        this.local_time_left = local_time_left;
        total_time_left += local_time_left;
    }


    // DIY constructor for true or false type questions
    static TrueOrFalse(question, choice1, choice2, correctAnswers, local_time_left=60) {
        choice1 += '<label for="ans1">Αλήθές</label>'; // Add the apropriate label for each choice
        choice2 += '<label for="ans2">Ψευδές</label>'; // ^
        return new QuizQuestion(question, [0, 0], choice1, choice2, "", "", correctAnswers, local_time_left)
    }

    static MultipleChoice(question, choice1, choice2, choice3, correctAnswers, local_time_left=60) {
        return new QuizQuestion(question, [0, 0, 0], choice1, choice2, choice3, "", correctAnswers, local_time_left)
    }

    // getter method that returns the whole question
    get Question() {
        return this.constructQuestion();
    }

    // Add and return the question and all the choices in a big string
    constructQuestion() {
        return `<p>${this.question}</p>`
        + this.choice1
        + this.choice2
        + this.choice3
        + this.choice4;
    }

    // Fires everytime the user selects and answer
    // Saves the user's answers inside an array
    SaveAnswers(ans) {
        // Only save the answers if its not the same and the one already saved
        if (this.userAnswers[ans] == 0) {
            this.userAnswers[ans] = 1;
            this.userAnswers[Math.abs(ans - 1)] = 0;
            this.FormatTrueOrFalseQuestions(ans);
        }
    }

    // Changes the HTML code of the choices to add or remove the 'checked' attribute
    FormatTrueOrFalseQuestions(ans) {
        if (ans == 0) {
            this.choice1 = this.choice1.substr(0, 7) + "checked " + this.choice1.substr(7, this.choice1.legth);
            this.choice2 = this.choice2.replace("checked ", "");
        } else {
            this.choice2 = this.choice2.substr(0, 7) + "checked " + this.choice2.substr(7, this.choice2.legth);
            this.choice1 = this.choice1.replace("checked ", "");
        }
    }
}

// #region define questions

// #region True or False qeustions
let q0 = QuizQuestion.TrueOrFalse
(
    'Οι ζώνες στο Brazilian Jiu-Jitsu συμβολίζουν το επίπεδο επιδεξιότητας του αθλητή.', // question
    '<input type="radio" id="ans1" name="question0" onclick="q0.SaveAnswers(0)">', // choice 1
    '<input type="radio" id="ans2" name="question0" onclick="q0.SaveAnswers(1)">', // choice 2
    [1 , 0] // correct answers
)

let q1 = QuizQuestion.TrueOrFalse
(
    'Η έκφραση "OSS" που χρησιμοποιείται συχνά στο Brazilian Jiu-Jitsu σημαίνει "Only Submissions Succeed".', // question
    '<input type="radio" id="ans1" name="question1" onclick="q1.SaveAnswers(0)">', // choice 1
    '<input type="radio" id="ans2" name="question1" onclick="q1.SaveAnswers(1)">', // choice 2
    [1 , 0] // correct answers
)

let q2 = QuizQuestion.TrueOrFalse
(
    'Στο Brazilian Jiu-Jitsu, ο όρος "Shrimping" αναφέρεται σε ένα είδος χτυπήματος.', // question
    '<input type="radio" id="ans1" name="question2" onclick="q2.SaveAnswers(0)">', // choice 1
    '<input type="radio" id="ans2" name="question2" onclick="q2.SaveAnswers(1)">', // choice 2
    [0, 1] // correct answers
)

// #endregion

let q3 = QuizQuestion.MultipleChoice
(
    'Ποιος από τους παρακάτω θεωρείται "πατέρας" του Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="ans1" name="question3"><label for="ans1">Bruce Lee</label><br>', // choice 1
    '<input type="radio" id="ans2" name="question3"><label for="ans2">Helio Gracie</label><br>', // choice 2
    '<input type="radio" id="ans3" name="question3"><label for="ans3">Muhammad Ali</label><br>', // choice 3
    [0, 1, 0] // correct answers
)

/*
let q4 = new QuizQuestion
('Η "guard" στο BJJ αναφέρεται σε:',
`   
    <input type="radio" id="ans1" name="q2" value="true">
    <label for="ans1">Στάση που ο αθλητής βρίσκεται στο έδαφος</label><br>
    <input type="radio" id="ans2" name="q2" value="false">
    <label for="ans2">Υποταγή</label><br>
    <input type="radio" id="ans3" name="q2" value="false">
    <label for="ans3">Στάση που ο αθλητής βρίσκεται όρθιος</label><br>
`)

let q5 = new QuizQuestion
('Ποιο από τα παρακάτω ΔΕΝ είναι ένας τύπος τεχνικής υποταγής στο BJJ;',
`   
    <input type="radio" id="ans1" name="q2" value="true">
    <label for="ans1">Armbar</label><br>
    <input type="radio" id="ans2" name="q2" value="false">
    <label for="ans2">Rear Naked Choke</label><br>
    <input type="radio" id="ans3" name="q2" value="false">
    <label for="ans3">Roundhouse Kick</label><br>
`)*/
// #endregion

let questionDataBase = [q0 ,q0, q1, q2, q3, q3]
let questionNum = 0

// Change the innerHTML of the main page to a question
function showQuestion(questionNum) {
    document.getElementById("mainForm").innerHTML = `<h3>Ερώτηση ${questionNum + 1}</h3>`;
    document.getElementById("mainForm").innerHTML += questionDataBase[questionsIndex[questionNum]].Question;
    //document.getElementById("mainForm").innerHTML = questionsIndex; -- (useful to check if the random suff works)
}

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

// Show the final resutls
function ShowResults() {
    document.getElementById("mainForm").innerHTML = "";
    for (let i = 0; i < 6; i++) {
        document.getElementById("mainForm").innerHTML += questionDataBase[questionsIndex[i]].userAnswers + "<br>";
        document.getElementById("mainForm").innerHTML += questionDataBase[questionsIndex[i]].correctAnswers + "<br>";
    }
}

document.getElementById("timer").innerHTML = `Time left: ${total_time_left} seconds`;

// Update the count down every 1 second
// TODO: https://codepen.io/vaughnantonyan/pen/baypWZ
let total_time_counter = setInterval(function() {
    total_time_left--;
    document.getElementById("timer").innerHTML = `Time left: ${total_time_left} seconds`;
}, 1000);
