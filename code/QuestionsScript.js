// #region Random shenanigans...
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
const NUMBER_OF_QUESTIONS = 20;
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
//#endregion

class QuizQuestion {
    // Constructor!
    constructor(question, userAnswers, availableWords, choice1, choice2, choice3, choice4, questionType, correctAnswers, local_time_left) {
        this.question = question;
        this.userAnswers = userAnswers;
        this.pairWords = availableWords;
        this.allChoices = [choice1, choice2, choice3, choice4];
        this.questionType = questionType;
        this.correctAnswers = correctAnswers;
        this.local_time_left = local_time_left;
    }


    // DIY constructor for true or false type questions
    static TrueOrFalse(question, choice1, choice2, correctAnswers, local_time_left=20) {
        question += '<br><br>';
        return new QuizQuestion(question, [0, 0], "", choice1, choice2, "", "", "TrueOrFalse", correctAnswers, local_time_left)
    }

    static MultipleChoice(question, choice1, choice2, choice3, correctAnswers, local_time_left=20) {
        question += '<br><br>';
        return new QuizQuestion(question, [0, 0, 0], "", choice1, choice2, choice3, "", "MultipleChoice", correctAnswers, local_time_left)
    }

    static MultipleAnswer(question, choice1, choice2, choice3, choice4, correctAnswers, local_time_left=30) {
        question += '<br><br>';
        return new QuizQuestion(question, [0, 0, 0, 0], "", choice1, choice2, choice3, choice4, "MultipleAnswers", correctAnswers, local_time_left)
    }

    static CompleteSentence(question, choice1, correctAnswers, local_time_left=40) {
        return new QuizQuestion(question, [""], "", choice1, "", "", "", "CompleteSentence", correctAnswers, local_time_left)
    }

    static PairWords(question, availableWords, choice1, choice2, choice3, choice4, correctAnswers, local_time_left=60) {
        return new QuizQuestion(question, ["", "", "", ""], availableWords, choice1, choice2, choice3, choice4, "PairWords", correctAnswers, local_time_left)
    }

    static WordArrangement(question, availableWords, choice1, choice2, choice3, choice4, correctAnswers, local_time_left=60) {
        return new QuizQuestion(question, ["", "", "", ""], availableWords, choice1, choice2, choice3, choice4, "WordArrangement", correctAnswers, local_time_left)
    }

    // getter method that returns the whole questions
    get Question() {
        return this.constructQuestion();
    }

    constructAnswers() {
        return this.allChoices[0]
        + this.allChoices[1]
        + this.allChoices[2]
        + this.allChoices[3];
    }

    // Add and return the question and all the choices in a big string
    constructQuestion() {
        return this.question
        + this.pairWords
        + this.constructAnswers();
    }

    get Answers() {
        return this.constructAnswers();
    }

    constructAnswers() {
        return this.allChoices[0]
        + this.allChoices[1]
        + this.allChoices[2]
        + this.allChoices[3];
    }

    // Fires everytime the user selects and answer
    // Saves the user's answers inside an array
    // used only for true or false and multiple choice questions
    SaveAnswer(ans) {
        // Runs a different block of code depending on the nature of the question
        if (this.questionType == "TrueOrFalse" || this.questionType == "MultipleChoice") {
            this.SaveTrueOrFalseAndMutipleChoiceAnswers(ans)
        } else if (this.questionType == "MultipleAnswers") {
            this.userAnswers[ans] = Math.abs(this.userAnswers[ans] - 1);
            this.FormatMultipleAnswersQuestions(ans);
        } else if (this.questionType == "CompleteSentence") {   
            this.userAnswers[0] = ans;
            this.FormatCompleteSentenceQuestions(ans);      
        } else if (this.questionType == "PairWords" || this.questionType == "WordArrangement") {
            // When the question type is PairWords ans is an array with a length of 3
            // ans[0] -- Is the div element "draggableWords" that contains all the unpaired words
            // ans[1] -- Is the div element that the users drops his word into (new parent)
            // ans[2] -- Is the ID of the div element that dragged the word FROM (orignal paren)
            this.SaveWordsAnwers(ans);
        }
    }

    SaveTrueOrFalseAndMutipleChoiceAnswers(ans) {
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
    }

    SaveWordsAnwers(data) {
        // Firstly depending on the new parent the word's text is insertend into the userAnswers array
        if (data[1].id == "option0") {
            this.userAnswers[0] = data[1].firstChild.innerHTML
        } else if (data[1].id == "option1") {
            this.userAnswers[1] = data[1].firstChild.innerHTML
        } else if (data[1].id == "option2") {
            this.userAnswers[2] = data[1].firstChild.innerHTML
        } else {
            this.userAnswers[3] = data[1].firstChild.innerHTML
        }

        // Secondly depending on the original parent of the word
        // the userAnswers is updated
        if (data[2] != "draggableWords") {
            if (data[2] == "option0") {
                this.userAnswers[0] = "";
            } else if (data[2] == "option1") {
                this.userAnswers[1] = "";
            } else if (data[2] == "option2") {
                this.userAnswers[2] = "";
            } else {
                this.userAnswers[3] = "";
            }
        }
        this.FormatWordsAnswers(data);
    }

    // Changes the HTML code of the choices save the answers inside the code

    // For Ture or False questions each time a choice is checked,
    // the other option must be un-checked
    FormatTrueOrFalseQuestions(ans) {
        for (let i = 0; i < 2; i++) {
            if (i == ans) {
                this.allChoices[i] = this.allChoices[i].substr(0, 7) + "checked " + this.allChoices[i].substr(7);
            } else {
                this.allChoices[i] = this.allChoices[i].replace("checked ", "");
            }
        } 
    }

    // Same logic with true or false questions
    // But with 3 choices
    FormatMultipleChoiceQuestions(ans) {
        for (let i = 0; i < 3; i++) {
            if (i == ans) {
                this.allChoices[i] = this.allChoices[i].substr(0, 7) + "checked " + this.allChoices[i].substr(7);
            } else {
                this.allChoices[i] = this.allChoices[i].replace("checked ", "");
            }
        } 
    }

    // For multiple answers type questions each option is independent for one another
    // Meaning that chosing one does not result to having to un-chose the others
    FormatMultipleAnswersQuestions(ans) {
        for (let i = 0; i < 4; i++) {
            if (i == ans) {
                if (this.allChoices[i].includes("checked")) {
                    this.allChoices[i] = this.allChoices[i].replace("checked ", "");
                } else {
                    this.allChoices[i] = this.allChoices[i].substr(0, 7) + "checked " + this.allChoices[i].substr(7);
                }
            } 
        } 
    }

    // Triggers everytime there is an input at the text box
    // replaces everytime the old value with the new one
    FormatCompleteSentenceQuestions(ans) {
        // the oldValue is extracted by searching for a regex expression inside the html code (choice1)
        // then is gets replaced by the new value
        // these 2 lines of code took me 4 hours to write (●'◡'●)
        let oldValue = this.allChoices[0].match(/value="[^"]*"/gi);
        this.allChoices[0] = this.allChoices[0].replace(oldValue, `value="${ans}"`);
    }

    // Formats both Pair words and word and Word arrangement type questions
    // data[0] -- Is the div element "draggableWords" that contains all the unpaired words
    // data[1] -- Is the div element that the users drops his word into (new parent)
    // data[2] -- Is the ID of the div element that the word was dragged FROM (orignal parent)
    FormatWordsAnswers(data) {
        this.pairWords = '<div id="draggableWords">' + data[0].innerHTML + '</div>';
        let all_but_second_word;
        let second_word;
        let pattern = /<div(.*)div>/g
        for (let i = 0; i < 4; i++)  {
            // i cba
            if (data[1].id == `option${i}`) {
                all_but_second_word = this.allChoices[i].match(pattern);
                second_word = this.allChoices[i].substr(all_but_second_word[0].length)
                this.allChoices[i] = data[1].outerHTML.toString() + second_word;
            }
            // Clear the value of the original parent
            if(data[2] != "draggableWords") { 
                if (data[2] == `option${i}`) { 
                    let oldValue = this.allChoices[i].match(/">(.*)div>/g);
                    this.allChoices[i] = this.allChoices[i].replace(oldValue, '"></div>');
                }
            }
        }
    }

    // Calculate the score for each type of question
    CalqulateScore() {
        if (this.questionType == "TrueOrFalse" || this.questionType == "MultipleChoice") {
            let numOfQuestions = this.correctAnswers.length;
            for (let i = 0; i < numOfQuestions; i++) {
                if (this.userAnswers[i] == 1) {
                    if (this.userAnswers[i] == this.correctAnswers[i]) {
                        return 1;
                    }
                }
            }
        // For Multiple Answers type question the user is subtracted
        // points if they check a false answer
        } else if (this.questionType == "MultipleAnswers") {   
            let numOfCorrAns = 0;
            let numOfWrongAns = 0;
            let answers = 0;
            for (let i = 0; i < 4; i++) {
                if (this.userAnswers[i] == 1) {
                    if (this.userAnswers[i] == this.correctAnswers[i]) {
                        numOfCorrAns++;
                    } else {
                        numOfWrongAns++;
                    }
                } 
                answers += this.correctAnswers[i];
            }
            if (numOfWrongAns >= numOfCorrAns) {
                return 0
            } else {
                return (numOfCorrAns - numOfWrongAns)/answers;
            }
        // For questions where the user have to complete the sentence
        // the check is case insensitive
        } else if (this.questionType == "CompleteSentence") {   
            if(this.userAnswers[0].toUpperCase() == this.correctAnswers[0].toUpperCase()) {
                return 1
            }
            return 0
        } else if (this.questionType == "PairWords" || this.questionType == "WordArrangement") {
            let answers = 4;
            // Some Word Arrangement type questions have 3 answers isntead of 4
            if (this.correctAnswers[3] == "") {
                answers = 3;
            }
            let numOfCorrAns = 0;
            for (let i = 0; i < answers; i++) {
                if (this.userAnswers[i] == this.correctAnswers[i]) {
                    numOfCorrAns++;
                }
            }
            return numOfCorrAns/answers;
        }
        return 0;
    }

    // Shows the correct answers...
    ShowCorrectAnswers() {
        let text;
        if (this.questionType == "TrueOrFalse") {
            text = "<br>Σωστή απάντηση: ";
            if (this.correctAnswers[0] == 1) {
                return text + "Αληθές"
            } else {
                return text + "Ψευδές"
            }
        } else if (this.questionType == "MultipleChoice") { 
            text = "Σωστή απάντηση: "; 
            let indexOfCorrAns = this.correctAnswers.indexOf(1)
            if (indexOfCorrAns == 0) {
                return text + "A";
            } else if (indexOfCorrAns == 1) {
                return text + "B";
            } else {
                return text + "C";
            }
        } else if (this.questionType == "MultipleAnswers") {  
            text = "Σωστές απαντήσεις: ";
            for (let i = 0; i < 4; i++) {
                if (this.correctAnswers[i] == 1) {
                    if (i == 0) {
                        text += "A, ";
                    } else if (i == 1) {
                        text += "B, ";
                    } else if (i == 2) {
                        text += "C, ";
                    } else if (i == 3) {
                        text += "D, ";
                    }
                }
            }
            return text;
        } else if (this.questionType == "CompleteSentence") {
            text = "Σωστή απάντηση: ";  
            return text + this.correctAnswers[0];
        } else {
            text = "Σωστές απαντήσεις:<br>";
            let answers = 4;
            if (this.correctAnswers[3] == "") {
                answers = 3;
            } for (let i = 0; i < answers; i++) {
                if (i == 0) {
                    text += `A) ${this.correctAnswers[i]}<br>`;
                } else if (i == 1) {
                    text += `B) ${this.correctAnswers[i]}<br>`;
                } else if (i == 2) {
                    text += `C) ${this.correctAnswers[i]}<br>`;
                } else if (i == 3) {
                    text += `D) ${this.correctAnswers[i]}<br>`;
                }
            }
            return text;
        }
    }

    // Called everytime the interval fires (every second)
    // changes the value of the local time left by -1
    UpdateLocalTimeLeft() {
        this.local_time_left--;
        return this.local_time_left;
    }
}

// #region Define questions

// #region True or False qeustions
let q0 = QuizQuestion.TrueOrFalse
(
    'Οι ζώνες στο Brazilian Jiu-Jitsu συμβολίζουν το επίπεδο επιδεξιότητας του αθλητή.', // question
    '<input type="radio" id="q0ans1" name="question0" onclick="q0.SaveAnswer(0)"><label for="q0ans1">Αλήθές</label> ', // choice 1
    '<input type="radio" id="q0ans2" name="question0" onclick="q0.SaveAnswer(1)"><label for="q0ans2">Ψευδές</label>', // choice 2
    [1 , 0] // correct answers
)

let q1 = QuizQuestion.TrueOrFalse
(
    'Η έκφραση "OSS" που χρησιμοποιείται συχνά στο Brazilian Jiu-Jitsu σημαίνει "Only Submissions Succeed".', // question
    '<input type="radio" id="q1ans1" name="question1" onclick="q1.SaveAnswer(0)"><label for="q1ans1">Αλήθές</label> ', // choice 1
    '<input type="radio" id="q1ans2" name="question1" onclick="q1.SaveAnswer(1)"><label for="q1ans2">Ψευδές</label>', // choice 2
    [1 , 0] // correct answers
)

let q2 = QuizQuestion.TrueOrFalse
(
    'Στο Brazilian Jiu-Jitsu, ο όρος "Shrimping" αναφέρεται σε ένα είδος χτυπήματος.', // question
    '<input type="radio" id="q2ans1" name="question2" onclick="q2.SaveAnswer(0)"><label for="q2ans1">Αλήθές</label> ', // choice 1
    '<input type="radio" id="q2ans2" name="question2" onclick="q2.SaveAnswer(1)"><label for="q2ans2">Ψευδές</label>', // choice 2
    [0, 1] // correct answers
)
// #endregion

// #region Multiple Choice qeustions
let q3 = QuizQuestion.MultipleChoice
(
    'Ποιος από τους παρακάτω θεωρείται "πατέρας" του Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="q3ans1" name="question3" onclick="q3.SaveAnswer(0)"><label for="q3ans1">Bruce Lee</label><br>', // choice 1
    '<input type="radio" id="q3ans2" name="question3" onclick="q3.SaveAnswer(1)"><label for="q3ans2">Helio Gracie</label><br>', // choice 2
    '<input type="radio" id="q3ans3" name="question3" onclick="q3.SaveAnswer(2)"><label for="q3ans3">Muhammad Ali</label><br>', // choice 3
    [0, 1, 0] // correct answers
)

let q4 = QuizQuestion.MultipleChoice
(
    'Ποιο από τα παρακάτω ΔΕΝ είναι ένας τύπος τεχνικής υποταγής στο Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="q4ans1" name="question4" onclick="q4.SaveAnswer(0)"><label for="q4ans1">Armbar</label><br>', // choice 1
    '<input type="radio" id="q4ans2" name="question4" onclick="q4.SaveAnswer(1)"><label for="q4ans2">Rear Naked Choke</label><br>', // choice 2
    '<input type="radio" id="q4ans3" name="question4" onclick="q4.SaveAnswer(2)"><label for="q4ans3">Roundhouse Kick</label><br>', // choice 3
    [0, 0, 1] // correct answers
)

let q5 = QuizQuestion.MultipleChoice
(
    'Η "guard" στο Brazilian Jiu-Jitsu αναφέρεται σε:', // question
    '<input type="radio" id="q5ans1" name="question5" onclick="q5.SaveAnswer(0)"><label for="q5ans1">Στάση που ο αθλητής βρίσκεται στο έδαφος</label><br>', // choice 1
    '<input type="radio" id="q5ans2" name="question5" onclick="q5.SaveAnswer(1)"><label for="q5ans2">Υποταγή</label><br>', // choice 2
    '<input type="radio" id="q5ans3" name="question5" onclick="q5.SaveAnswer(2)"><label for="q5ans3">Στάση που ο αθλητής βρίσκεται όρθιος</label><br>', // choice 3
    [1, 0, 0] // correct answers
)

let q6 = QuizQuestion.MultipleChoice
(
    'Η έκφραση "rolling" στο Brazilian Jiu-Jitsu αναφέρεται σε:', // question
    '<input type="radio" id="q6ans1" name="question6" onclick="q6.SaveAnswer(0)"><label for="q6ans1">Την κίνηση προς τα πίσω</label><br>', // choice 1
    '<input type="radio" id="q6ans2" name="question6" onclick="q6.SaveAnswer(1)"><label for="q6ans2">Έναν "γύρο" μάχης πραγματικής αντίστασης με σκοπό την υποταγή</label><br>', // choice 2
    '<input type="radio" id="q6ans3" name="question6" onclick="q6.SaveAnswer(2)"><label for="q6ans3">Την προσπάθεια εκτέλεσης υποταγής</label><br>', // choice 3
    [0, 1, 0] // correct answers
)

let q7 = QuizQuestion.MultipleChoice
(
    'Ποιο από τα παρακάτω ΔΕΝ είναι στάση στο Brazilian Jiu-Jitsu;', // question
    '<input type="radio" id="q7ans1" name="question7" onclick="q7.SaveAnswer(0)"><label for="q7ans1">Spider Guard</label><br>', // choice 1
    '<input type="radio" id="q7ans2" name="question7" onclick="q7.SaveAnswer(1)"><label for="q7ans2">Turtle Position</label><br>', // choice 2
    '<input type="radio" id="q7ans3" name="question7" onclick="q7.SaveAnswer(2)"><label for="q7ans3">Frog Stance</label><br>', // choice 3
    [0, 0, 1] // correct answers
)
// #endregion

// #region Multiple Answer qeustions
let q8 = QuizQuestion.MultipleAnswer
(
    'Ποιοι από τους παρακάτω είναι βασικοί στόχοι του Brazilian Jiu-Jitsu;',
    '<input type="checkbox" id="q8ans1" name="q8" onclick="q8.SaveAnswer(0)"><label for="q8ans1">Υποταγή</label><br>', // choice 1
    '<input type="checkbox" id="q8ans2" name="q8" onclick="q8.SaveAnswer(1)"><label for="q8ans2">Πάλη στο έδαφος</label><br>', // choice 2
    '<input type="checkbox" id="q8ans3" name="q8" onclick="q8.SaveAnswer(2)"><label for="q8ans3">Έλενχος του αντιπάλου</label><br>', // choice 3
    '<input type="checkbox" id="q8ans4" name="q8" onclick="q8.SaveAnswer(3)"><label for="q8ans4">Αφοπλισμός όπλου</label><br>', // choice 4
    [1, 1, 1, 0] // correct answers
)

let q9 = QuizQuestion.MultipleAnswer
(
    'Ποια από τις παρακάτω είναι είδη υποταγών στο Brazilian Jiu-Jitsu;',
    '<input type="checkbox" id="q9ans1" name="q9" onclick="q9.SaveAnswer(0)"><label for="q9ans1">Kimura Grip</label><br>', // choice 1
    '<input type="checkbox" id="q9ans2" name="q9" onclick="q9.SaveAnswer(1)"><label for="q9ans2">Triangle Choke</label><br>', // choice 2
    '<input type="checkbox" id="q9ans3" name="q9" onclick="q9.SaveAnswer(2)"><label for="q9ans3">Armbar</label><br>', // choice 3
    '<input type="checkbox" id="q9ans4" name="q9" onclick="q9.SaveAnswer(3)"><label for="q9ans4">Kimura</label><br>', // choice 4
    [0, 1, 1, 1] // correct answers
)

let q10 = QuizQuestion.MultipleAnswer
(
    'Ποιοι από τους παρακάτω αποτελούν μέρος του "guard" στο Brazilian Jiu-Jitsu;',
    '<input type="checkbox" id="q10ans1" name="q10" onclick="q10.SaveAnswer(0)"><label for="q10ans1">De la Riva</label><br>', // choice 1
    '<input type="checkbox" id="q10ans2" name="q10" onclick="q10.SaveAnswer(1)"><label for="q10ans2">Half Guard</label><br>', // choice 2
    '<input type="checkbox" id="q10ans3" name="q10" onclick="q10.SaveAnswer(2)"><label for="q10ans3">Kneebar</label><br>', // choice 3
    '<input type="checkbox" id="q10ans4" name="q10" onclick="q10.SaveAnswer(3)"><label for="q10ans4">Όλα τα παραπάνω</label><br>', // choice 4
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

//#region Pair Words questions - https://jsfiddle.net/xptLU/ -> useful

let q14 = QuizQuestion.PairWords
(
    'Συνδέστε τις σωστές στάσεις στο Brazilian Jiu-Jitsu με τα ονόματά τους:',
    `<div id="draggableWords">
    <span class="dragWord" id="word3" draggable="true" ondragstart="drag(event)">Back</span>
    <span class="dragWord" id="word0" draggable="true" ondragstart="drag(event)">Open</span> 
    <span class="dragWord" id="word2" draggable="true" ondragstart="drag(event)">Cross</span> 
    <span class="dragWord" id="word1" draggable="true" ondragstart="drag(event)">Side</span>
    </div>`,
    '<div name="q14" class="pairWordsInput" id="option0" ondrop="drop(event, q14)" ondragover="allowDrop(event)"></div><span class="secondWord">Guard</span><br>', // choice 1
    '<div name="q14" class="pairWordsInput" id="option1" ondrop="drop(event, q14)" ondragover="allowDrop(event)"></div><span class="secondWord">Control</span><br>', // choice 2
    '<div name="q14" class="pairWordsInput" id="option2" ondrop="drop(event, q14)" ondragover="allowDrop(event)"></div><span class="secondWord">Collar Choke</span><br>', // choice 3
    '<div name="q14" class="pairWordsInput" id="option3" ondrop="drop(event, q14)" ondragover="allowDrop(event)"></div><span class="secondWord">Take</span><br>', // choice 4
    ["Open", "Side", "Cross", "Back"] // correct answers
)

let q15 = QuizQuestion.PairWords
(
    'Συνδέστε τις σωστές στάσεις στο Brazilian Jiu-Jitsu με τα ονόματά τους:',
    `<div id="draggableWords">
    <span class="dragWord" id="word3" draggable="true" ondragstart="drag(event)">Kimura</span>
    <span class="dragWord" id="word0" draggable="true" ondragstart="drag(event)">North</span> 
    <span class="dragWord" id="word2" draggable="true" ondragstart="drag(event)">Foot</span> 
    <span class="dragWord" id="word1" draggable="true" ondragstart="drag(event)">Butterfly</span>
    </div>`,
    '<div name="q15" class="pairWordsInput" id="option0" ondrop="drop(event, q15)" ondragover="allowDrop(event)"></div><span class="secondWord">South Position</span><br>', // choice 1
    '<div name="q15" class="pairWordsInput" id="option1" ondrop="drop(event, q15)" ondragover="allowDrop(event)"></div><span class="secondWord">Guard</span><br>', // choice 2
    '<div name="q15" class="pairWordsInput" id="option2" ondrop="drop(event, q15)" ondragover="allowDrop(event)"></div><span class="secondWord">Lock</span><br>', // choice 3
    '<div name="q15" class="pairWordsInput" id="option3" ondrop="drop(event, q15)" ondragover="allowDrop(event)"></div><span class="secondWord">Grip</span><br>', // choice 4
    ["North", "Butterfly", "Foot", "Kimura"] // correct answers
)

let q16 = QuizQuestion.PairWords
(
    'Συνδέστε τις σωστές στάσεις στο Brazilian Jiu-Jitsu με τα ονόματά τους:',
    `<div id="draggableWords">
    <span class="dragWord" id="word3" draggable="true" ondragstart="drag(event)">Baseball bat</span>
    <span class="dragWord" id="word0" draggable="true" ondragstart="drag(event)">Half</span> 
    <span class="dragWord" id="word2" draggable="true" ondragstart="drag(event)">Bow and</span> 
    <span class="dragWord" id="word1" draggable="true" ondragstart="drag(event)">Knee on</span>
    </div>`,
    '<div name="q16" class="pairWordsInput" id="option0" ondrop="drop(event, q16)" ondragover="allowDrop(event)"></div><span class="secondWord">Guard</span><br>', // choice 1
    '<div name="q16" class="pairWordsInput" id="option1" ondrop="drop(event, q16)" ondragover="allowDrop(event)"></div><span class="secondWord">Belly</span><br>', // choice 2
    '<div name="q16" class="pairWordsInput" id="option2" ondrop="drop(event, q16)" ondragover="allowDrop(event)"></div><span class="secondWord">Arrow</span><br>', // choice 3
    '<div name="q16" class="pairWordsInput" id="option3" ondrop="drop(event, q16)" ondragover="allowDrop(event)"></div><span class="secondWord">Choke</span><br>', // choice 4
    ["Half", "Knee on", "Bow and", "Baseball bat"] // correct answers
)
// #endregion

//#region Word Arrangement questions
let q17 = QuizQuestion.WordArrangement
(
    'Ταξινομήστε τα παρακάτω βήματα ενός αγώνα Brazilian Jiu-Jitsu σε σωστή σειρά:',
    `<div id="draggableWords">
    <span class="dragWord" id="word3" draggable="true" ondragstart="drag(event)">Submission</span>
    <span class="dragWord" id="word0" draggable="true" ondragstart="drag(event)">Control</span> 
    <span class="dragWord" id="word2" draggable="true" ondragstart="drag(event)">Guard Pass</span> 
    <span class="dragWord" id="word1" draggable="true" ondragstart="drag(event)">Take Down</span>
    </div>`,
    '<div name="q17" class="pairWordsInput" id="option0" ondrop="drop(event, q17)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 1
    '<div name="q17" class="pairWordsInput" id="option1" ondrop="drop(event, q17)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 2
    '<div name="q17" class="pairWordsInput" id="option2" ondrop="drop(event, q17)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 3
    '<div name="q17" class="pairWordsInput" id="option3" ondrop="drop(event, q17)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 4
    ["Take Down", "Guard Pass", "Control", "Submission"] // correct answers
)

let q18 = QuizQuestion.WordArrangement
(
    'Ταξινομήστε τα βήματα για την εκτέλεση μιας τεχνικής "Armbar" σε σωστή σειρά:',
    `<div id="draggableWords">
    <span class="dragWord" id="word0" draggable="true" ondragstart="drag(event)">Γέφυρα με την μέση</span> 
    <span class="dragWord" id="word2" draggable="true" ondragstart="drag(event)">Σπάσιμο χεριού</span> 
    <span class="dragWord" id="word1" draggable="true" ondragstart="drag(event)">Ρίξιμο βάρος προς τα πίσω</span>
    </div>`,
    '<div name="q18" class="pairWordsInput" id="option0" ondrop="drop(event, q18)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 1
    '<div name="q18" class="pairWordsInput" id="option1" ondrop="drop(event, q18)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 2
    '<div name="q18" class="pairWordsInput" id="option2" ondrop="drop(event, q18)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 3
    '<div name="q18" id="option3" ondrop="drop(event, q18)" ondragover="allowDrop(event)" hidden></div><span class="secondWord"></span><br>', // hidden
    ["Γέφυρα με την μέση", "Ρίξιμο βάρος προς τα πίσω", "Σπάσιμο χεριού", ""] // correct answers
)

let q19 = QuizQuestion.WordArrangement
(
    'Ταξινομήστε τα βήματα για την εκτέλεση μιας τεχνικής "Armbar" σε σωστή σειρά:',
    `<div id="draggableWords">
    <span class="dragWord" id="word0" draggable="true" ondragstart="drag(event)">Mount</span> 
    <span class="dragWord" id="word2" draggable="true" ondragstart="drag(event)">Guard pass</span> 
    <span class="dragWord" id="word1" draggable="true" ondragstart="drag(event)">Takedown</span>
    </div>`,
    '<div name="q19" class="pairWordsInput" id="option0" ondrop="drop(event, q19)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 1
    '<div name="q19" class="pairWordsInput" id="option1" ondrop="drop(event, q19)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 2
    '<div name="q19" class="pairWordsInput" id="option2" ondrop="drop(event, q19)" ondragover="allowDrop(event)"></div><span class="secondWord"></span><br>', // choice 3
    '<div name="q19" id="option3" ondrop="drop(event, q19)" ondragover="allowDrop(event)" hidden></div><span class="secondWord"></span><br>', // hidden
    ["Takedown", "Guard pass", "Mount", ""] // correct answers
)
// #endregion

// #endregion

// #region stuff...
let questionDataBase = [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19]

// Calculate the total_time_left by summing up the
// local_time_left of each question
function getTotalTimeLeft() {
    let total_time_left = 0;
    for (let i = 0; i < 6; i++) {
        total_time_left += questionDataBase[questionsIndex[i]].local_time_left;
    }
    return total_time_left;
}

// Initialize the value of the timer to be that of the sum of the time of all the questions
document.getElementById("timer_value").innerHTML = getTotalTimeLeft();

let questionShown;
let quizOver = false;
// Change the innerHTML of the main page to a question
function showQuestion(questionNum) {
    questionShown = questionDataBase[questionsIndex[questionNum]];
    let local_time_left_message;
    if (questionShown.local_time_left > 0) {
        local_time_left_message = ` <i class="fa fa-clock-o" aria-hidden="true"></i> ${questionShown.local_time_left} δευτερόλεπτα`;
    } else {
        local_time_left_message = ` Τέλος χρόνου ερώτησης`;
    }
    document.getElementById("mainForm").innerHTML = `<h3>Ερώτηση ${questionNum + 1}<span id="local_time">${local_time_left_message}</span></h3>`;
    document.getElementById("mainForm").innerHTML += questionShown.Question;
}

// questionNum is always equal to 0 when this runs
// It shows the first question when the page loads for the first time
let questionNum = 0;
showQuestion(questionNum);

function UpdateTimeLeft() {
   if (quizOver == false) {
        // If there is no more time left show the results
        if (getTotalTimeLeft() <= 0) {
            ShowResults(true);
        } else {
            // if there is no more question time left, disable the ability to chose/change answer
            if (questionShown.local_time_left <= 0) {
                DisableAnswers();
                let local_time_left_message = ` Τέλος χρόνου ερώτησης`;
                document.getElementById("local_time").innerHTML = local_time_left_message;
                questionShown.UpdateLocalTimeLeft() 
            } else {
                let local_time_left_message = ` <i class="fa fa-clock-o" aria-hidden="true"></i> ${questionShown.UpdateLocalTimeLeft()} δευτερόλεπτα`;
                document.getElementById("local_time").innerHTML = local_time_left_message;
            }
            document.getElementById("timer_value").innerHTML = getTotalTimeLeft();
        }
   } else {
    clearInterval(timer);
   }
}
let timer = setInterval(UpdateTimeLeft, 1000);

// Disables the ability to chose/change the answers
function DisableAnswers() {
    // finds all child elements and stores them in an array "allChildren"
    let allChildren = document.getElementById("mainForm").children;
    for (let i = 0; i < allChildren.length; i++) {
        // if child is an input simply disable it
        if(allChildren[i] instanceof HTMLInputElement) {
            allChildren[i].disabled = true;
        // if child is a div then the children of the div element
        // are draggable span elements, and must be turned off
        } else if (allChildren[i] instanceof HTMLDivElement) {
            let draggableElements = allChildren[i].children;
            for (let j = 0; j < draggableElements.length; j++) { 
                draggableElements[j].draggable = false;
            }
        }
        
    }
}
// #endregion

// #region Button functions

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

// Creates the Results page that appears
// after pressing the "Submit" button
function ShowResults(time_is_up=false) {
    let resultPage = document.getElementById("mainForm");
    if (time_is_up) {
        resultPage.innerHTML = "<h3>Τέλος Χρόνου!<h3>"; 
    } else {
        resultPage.innerHTML = "";
    } 
    let totalScore = 0;
    let currentQuestion;
    // Calculate the score for each of the 6 questions
    for (let i = 0; i < 6; i++) {
        currentQuestion = questionDataBase[questionsIndex[i]];
        totalScore += currentQuestion.CalqulateScore();
    }
    // Convert the result into a percentage and show it
    let pecentageResult = Math.ceil(totalScore/6 * 100);
    resultPage.innerHTML += `<h3>Αποτέλεσμα: ${pecentageResult}%</h3>`;
    // Show each questions along with the answers of the user.
    // Also show the correct answer(s) if the user was wrong.
    for (let i = 0; i < 6; i++) {
        currentQuestion = questionDataBase[questionsIndex[i]];
        // Show silly icon next to each question
        if (currentQuestion.CalqulateScore() == 1) {
            resultPage.innerHTML += `<h3>Ερώτηση ${i + 1} <i class="fa fa-check"></i></h3>`;
        } else {
            resultPage.innerHTML += `<h3>Ερώτηση ${i + 1} <i class="fa fa-times"></i></h3>`;
        }      
        resultPage.innerHTML += questionDataBase[questionsIndex[i]].Question + "<br>";
        // Show correct answer(s) if the user was wrong
        if (currentQuestion.CalqulateScore() != 1) {
            resultPage.innerHTML += currentQuestion.ShowCorrectAnswers();
        }
    }
    // quiz is over!
    quizOver = true;
    // Disable the ability for the user to change his answers
    DisableAnswers();
    // Hide the buttons that are no longer needed
    document.getElementById("prevBtn").hidden = true;
    document.getElementById("nextBtn").hidden = true;
    document.getElementById("subBtn").hidden = true;
}
// #endregion

// #region Drag related functions

// Prevents the allowDrop event to be disabled
// when hovering a draggable element over the div
function allowDrop(event) {
    event.preventDefault();
}

// Triggers when a word is dragged
// Passes the id of the word (event.target.id)
// Somewhere(?) named "rag_word_id"
function drag(event) {
    event.dataTransfer.setData("drag_word_id", event.target.id);
    event.dataTransfer.setData("original_parent_div_id", event.target.parentElement.id)
}

// Complicated block of code because javascript is "special"
// -- Summary
// Triggers when an element is dropped inside an element 
// with the ondrop="drop(event)" attribute.
// checks if the div is empty before inserting the new word
// if the div is not empty it empties it by sending the old world
// back up top
// -- Problem(s)
// 1) The ondrop attribute activates more than 
//    and asynchronous(?) when an element is dropped
// 2) Children ihenrit their parents attributes (apparently?).
//    Meaning that when a Word gets dropped inside a div,
//    then the Word iherits the drop attribute! So then the user
//    can drop a Word inside another Word!
function drop(event, target_question) {

    // Prevent the drop event from being disabled
    event.preventDefault();

    // get the data of the word that is being dropped inside the element
    // and save it inside "data"
    let data = event.dataTransfer.getData("drag_word_id");
    let original_parent_id = event.dataTransfer.getData("original_parent_div_id");

    let target_div;

    // checks if the element is empty
    // and simply inserts the new word if it is
    if (event.target.innerHTML == "") { 
        event.target.appendChild(document.getElementById(data)); 
        target_div = event.target;
    } else {
        if (event.target instanceof HTMLSpanElement) {
            // The user drags the new word inside the old word
            let parent_div = event.target.parentElement;
            document.getElementById("draggableWords").appendChild(event.target)
            parent_div.appendChild(document.getElementById(data)); 
            target_div = parent_div;
        } else {
            // The user drags the new word inside the div
            let old_data = event.target.firstChild;
            document.getElementById("draggableWords").appendChild(old_data)
            event.target.appendChild(document.getElementById(data)); 
            target_div = event.target;
        }
    }
    let save_answer_data = [document.getElementById("draggableWords"), target_div, original_parent_id];
    target_question.SaveAnswer(save_answer_data);
}
// #endregion


