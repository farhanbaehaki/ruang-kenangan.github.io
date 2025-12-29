// DARK/LIGHT TOGGLE
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if(localStorage.getItem("theme")==="dark") document.body.classList.add("dark");

// LETTER DRAG & OPEN
const letters = document.querySelectorAll(".letter");
const lettersContainer = document.querySelector(".letters");
let zIndexCounter = 10;

const shuffleArray = (arr) => { for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } };
const shuffledLetters = Array.from(letters);
shuffleArray(shuffledLetters);
shuffledLetters.forEach(letter=>lettersContainer.appendChild(letter));

shuffledLetters.forEach(letter=>{
  const center = document.querySelector(".cssletter").offsetWidth/2 - letter.offsetWidth/2;
  letter.style.left=`${center}px`;

  let offsetX, offsetY;
  letter.addEventListener("mousedown",(e)=>{
    if(e.target.tagName!=="BUTTON"){
      const rect = letter.getBoundingClientRect();
      letter.style.position="fixed";
      letter.style.left=`${rect.left}px`;
      letter.style.top=`${rect.top}px`;
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      letter.style.zIndex = zIndexCounter++;
      const moveAt = (x,y)=>{letter.style.left=`${x-offsetX}px`; letter.style.top=`${y-offsetY}px`};
      const onMouseMove = ev=>moveAt(ev.clientX,ev.clientY);
      const onMouseUp = ()=>{document.removeEventListener("mousemove",onMouseMove); document.removeEventListener("mouseup",onMouseUp);};
      document.addEventListener("mousemove",onMouseMove);
      document.addEventListener("mouseup",onMouseUp);
    }
  });
});

// OPEN ENVELOPE
document.querySelector("#openEnvelope").addEventListener("click",()=>{
  document.querySelector(".envelope").classList.add("active");
});

// CLOSE LETTER
document.querySelectorAll(".closeLetter").forEach(btn=>{
  btn.addEventListener("click",e=>{
    e.preventDefault();
    const letter = e.target.closest(".letter");
    if(letter) letter.style.display="none";
  });
});
