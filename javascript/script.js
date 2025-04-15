let numberOfQuestions = 5
let quizCategory="programming"
let currentQuestion = null
const questionsIndexHistory = []
const QUIZ_TIME_LIMIT = 15
let curr_time = QUIZ_TIME_LIMIT
let timer = null
let correctAnswerCount = 0
const configContainer = document.querySelector('.config-container')
const quizContainer = document.querySelector('.quiz-container')
const answerOptions = document.querySelector('.answer-options');
const nextQuestionBtn = document.querySelector('.next-question-btn');
const questionStatus =  document.querySelector('.question-status')
const timerDisplay = document.querySelector('.time-duration')
const resultContainer = document.querySelector('.result-container')


const showQuizResult = () => {
    quizContainer.style.display='none'
    resultContainer.style.display='block'

    const resultText = `You answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great effort!`;
    document.querySelector('.result-message').innerHTML = resultText
}
const resetTimer = () => {
    clearInterval(timer);
    curr_time = QUIZ_TIME_LIMIT
    timerDisplay.textContent = `${curr_time}s`
}

const startTimer = () => {
    timer = setInterval(() => {
        curr_time--
        timerDisplay.textContent = `${curr_time}s`
        if(curr_time <= 0){
            clearInterval(timer)
            highlightCorrectAnswer()
            nextQuestionBtn.style.visibility = 'visible'
            answerOptions.querySelectorAll('.answer-option').forEach((option) => option.style.pointerEvents = "none")
        }
    },1000)
}
const getRandomQuestion = () => {
    const categoryQuestion =  questions.find((cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()).questions || []

    if(questionsIndexHistory.length >= Math.min(categoryQuestion.length , numberOfQuestions)){
        return showQuizResult()
    }
    const availableQuestions = categoryQuestion.filter((_, index) => !questionsIndexHistory.includes(index))
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]

    questionsIndexHistory.push(categoryQuestion.indexOf(randomQuestion))
    return randomQuestion
}
 const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll('.answer-option')[currentQuestion.correctAnswer]
    correctOption.classList.add('correct') 
    const iconHTML=`<span class="material-symbols-rounded">check_circle</span>`
    correctOption.insertAdjacentHTML('beforeend', iconHTML)
 }
 const handleAnswer = (option, answerIndex) =>{
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex
    option.classList.add(isCorrect ? 'correct' : 'incorrect')
    !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++
    const iconHTML=`<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`
    option.insertAdjacentHTML('beforeend', iconHTML)
    //disable all answer options after one option is selected
    answerOptions.querySelectorAll('.answer-option').forEach((option) => option.style.pointerEvents = "none")
    nextQuestionBtn.style.visibility = "visible"
 }
 const renderQuestion = () => {
    currentQuestion = getRandomQuestion()
    if(!currentQuestion)    return ;
    resetTimer()
    startTimer()
    answerOptions.innerHTML= "";
    nextQuestionBtn.style.visibility = "hidden"

    document.querySelector('.question-text').textContent = currentQuestion.question;
    questionStatus.innerHTML=`<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b>`
    currentQuestion.options.forEach((option, index) => {
        const li=document.createElement('li')
        li.classList.add('answer-option')
        li.textContent = option
        answerOptions.appendChild(li)
        li.addEventListener('click', () => handleAnswer(li, index))
    });
 }

 const startQuiz = () => {
    configContainer.style.display = 'none'
    quizContainer.style.display = 'block'
    numberOfQuestions = parseInt(configContainer.querySelector('.question-option.active').textContent)
    quizCategory = configContainer.querySelector('.category-option.active').textContent

    renderQuestion()

 }
 document.querySelectorAll('.category-option, .question-option').forEach(option => {
    option.addEventListener('click', () => {
        option.parentNode.querySelector('.active')?.classList.remove('active')
        option.classList.add('active')
    })
 })

 const resetQuiz = () =>{
    resetTimer()
    correctAnswerCount = 0
    questionsIndexHistory.length = 0
    resultContainer.style.display = 'none'
    configContainer.style.display = 'block'
 }

 nextQuestionBtn.addEventListener('click',renderQuestion)
 document.querySelector('.try-again-btn').addEventListener('click',resetQuiz)
 document.querySelector('.start-quiz-btn').addEventListener('click', startQuiz)