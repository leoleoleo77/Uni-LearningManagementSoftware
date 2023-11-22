// Getting a random integer between two values
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

let questions = [];
for (let i = 0; i < 6; i++) {
    questions[i] = getRandomInt(0, 2);
}

class QuizQuestion {
    constructor(temp) {
        this.temp = temp;
      }
}

let q0 = new QuizQuestion
(`
    <p>
        Οι ζώνες στο Brazilian Jiu-Jitsu συμβολίζουν το επίπεδο επιδεξιότητας του αθλητή.
    </p>       
    <input type="radio" id="ans1" name="q1" value="true">
    <label for="ans1">Αλήθές</label>
    <input type="radio" id="ans2" name="q1" value="false">
    <label for="ans2">Ψευδές</label><br>
`)

let q1 = new QuizQuestion
(`
    <p>
        Η έκφραση "OSS" που χρησιμοποιείται συχνά στο BJJ σημαίνει "Only Submissions Succeed."
    </p>       
    <input type="radio" id="ans1" name="q1" value="true">
    <label for="ans1">Αλήθές</label>
    <input type="radio" id="ans2" name="q1" value="false">
    <label for="ans2">Ψευδές</label><br>
`)

//document.getElementById("mainForm").innerHTML = q1.temp;

let questionNum = 0;
let questionDataBase = [q0 ,q1]

document.getElementById("mainForm").innerHTML = questionDataBase[questions[questionNum]].temp;

function NextQuestion() {
    questionNum == 5 ? questionNum = 0 : questionNum++;
    document.getElementById("mainForm").innerHTML = questionDataBase[questions[questionNum]].temp;
}

function PrevQuestion() {
    questionNum == 0 ? questionNum = 5 : questionNum--;
    document.getElementById("mainForm").innerHTML = questionDataBase[questions[questionNum]].temp;
}

function jumpToQuestion(num) {
    document.getElementById("mainForm").innerHTML = questionDataBase[questions[questionNum]].temp;
}
