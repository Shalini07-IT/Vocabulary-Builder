let words = JSON.parse(localStorage.getItem("words")) || [];
let currentQuiz = null;

function save(){
  localStorage.setItem("words", JSON.stringify(words));
}

function addWord(){
  const w = word.value.trim();
  const m = meaning.value.trim();
  const e = example.value.trim();

  if(!w || !m) return alert("Fill required fields");

  words.push({
    id:Date.now(),
    word:w,
    meaning:m,
    example:e,
    strength:0, // 0 weak, 1 strong, 2 mastered
    lastUsed:Date.now()
  });

  save();
  render();
  word.value=meaning.value=example.value="";
}

function render(){
  list.innerHTML="";
  let stats={mastered:0,strong:0,weak:0};

  words.forEach(w=>{
    if(w.strength===2) stats.mastered++;
    else if(w.strength===1) stats.strong++;
    else stats.weak++;

    const div=document.createElement("div");
    div.className="word";

    let tag = w.strength===2?"mastered":w.strength===1?"strong":"weak";

    div.innerHTML=`
      <h3>${w.word}</h3>
      <p>${w.meaning}</p>
      <small>${w.example}</small><br>
      <span class="tag ${tag}">${tag}</span>
    `;

    list.appendChild(div);
  });

  total.innerText=words.length;
  mastered.innerText=stats.mastered;
  strong.innerText=stats.strong;
  weak.innerText=stats.weak;
}

function startQuiz(){
  if(words.length===0) return alert("No words");
  currentQuiz = words[Math.floor(Math.random()*words.length)];
  qWord.innerText = currentQuiz.word;
  answer.value="";
  result.innerText="";
  quiz.classList.remove("hidden");
}

function checkAnswer(){
  let ans = answer.value.toLowerCase();
  let correct = currentQuiz.meaning.toLowerCase();

  if(ans.includes(correct)){
    result.innerText="✅ Correct!";
    currentQuiz.strength = Math.min(2,currentQuiz.strength+1);
  } else {
    result.innerText="❌ Wrong!";
    currentQuiz.strength = Math.max(0,currentQuiz.strength-1);
  }

  currentQuiz.lastUsed = Date.now();
  save();
  render();

  setTimeout(()=>quiz.classList.add("hidden"),1000);
}

function dailyWord(){
  if(words.length===0) return;

  let index = new Date().getDate() % words.length;
  let w = words[index];

  alert(`🌟 Daily Word:
${w.word}
Meaning: ${w.meaning}
Example: ${w.example}`);
}

render();
