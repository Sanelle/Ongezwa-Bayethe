// Game Configuration 
const gameConfig = {
  password: "Ongezwa", // Correct password updated to "Ongezwa"
  levelNames: {
    1: "Word Hunt",
    2: "Birthday Trivia",
    3: "Wheel of Fortune",
    4: "The Grand Surprise"
  },
  wordPuzzle: {
    words: ["CELEBRATE", "HAPPY", "JOY", "LOVE", "PARTY", "SURPRISE", "CAKE", "GIFTS"],
    gridSize: 8,
    colors: ["#FF6B8B", "#FF8E53", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"]
  },
  trivia: {
    questions: [
      {
        question: "Where was our first date",
        options: ["Reels", "KFC", "Grand West", "Spur"],
        answer: 2
      },
      {
        question: "What is Ongezwa's birth month?",
        options: ["January", "March", "July", "December"],
        answer: 1
      },
      {
        question: " What is my nickname",
        options: ["Yeye", "Baby", "Chomie", "All of the above"],
        answer: 0
      },
      {
        question: "How many siblings do I have",
        options: ["1", "2", "3", "4"],
        answer: 2
      },
      {
        question: "What did I grow saying I want to study",
        options: ["Fine Arts", "Engineering", "Pychology", "All of the above"],
        answer: 2
      }
    ]
  },
 wheel: {
    prizes: [
      "Haden Air Fryer",  // First prize
      "Massage Session",  // Second prize
      "Hotel Booking"    // Third prize
    ],
    colors: ["#FF6B8B", "#FF8E53", "#FFD166", "#06D6A0", "#118AB2", "#073B4C", "#EF476F", "#FFC43D"]
  },
  reasons: [
    "your aura ; Its soothing and makes me feel like everything is going to be okay.",
    "your smile ; It brightens my day.",
    "The way you carry yourself.",
    "Your laughter is absolutely contagious.",
    "You have a unique and wonderful perspective on life.",
    "You're always there for the people you care about.",
    "Your creativity inspires those around you.",
    "You have a heart of gold.",
    "You make even ordinary moments feel special.",
    "Your positive energy is magnetic.",
    "You're not afraid to be yourself.",
    "You have great taste in music/movies/books (circle one).",
    "You're an amazing listener.",
    "You give the best advice.",
    "You're always up for an adventure.",
    "You have a great sense of humor.",
    "You're incredibly talented at what you do.",
    "You make people feel valued and appreciated.",
    "You're constantly growing and improving.",
    "You handle challenges with grace.",
    "You're beautiful inside and out.",
    "You have a way of making people feel comfortable.",
    "You're thoughtful in ways that matter.",
    "You're genuinely fun to be around.",
    "You have a unique style that's all your own.",
    "You're smarter than you give yourself credit for.",
    "You make the world a better place just by being in it.",
    "You're loved more than words can express."
  ]
};

// Game State
let currentLevel = 0;
let playerName = "";
let foundWords = new Set();
let hintsRemaining = 3;
let quizScore = 0;
let currentQuestion = 0;
let spinsRemaining = 3;
let wheelSpinning = false;
let confettiActive = false;

// DOM Elements
const playerNameInput = document.getElementById('playerName');
const startButton = document.getElementById('startButton');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const hintButton = document.getElementById('hintButton');
const spinButton = document.getElementById('spinButton');
const birthdayBox = document.getElementById('birthdayBox');
const playerDisplayName = document.getElementById('playerDisplayName');
const reasonsList = document.getElementById('reasonsList');
const quizContainer = document.getElementById('quizContainer');
const wordGrid = document.getElementById('wordGrid');
const wheel = document.getElementById('wheel');
const prizeDisplay = document.getElementById('prizeDisplay');
const confettiCanvas = document.getElementById('confetti-canvas');

// Initialize the game
function initGame() {
  // Set up event listeners
  startButton.addEventListener('click', enterQuest);
  playerNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') enterQuest();
  });
  
  prevBtn.addEventListener('click', goToPreviousLevel);
  nextBtn.addEventListener('click', goToNextLevel);
  hintButton.addEventListener('click', giveHint);
  spinButton.addEventListener('click', spinWheel);
  birthdayBox.addEventListener('click', toggleBirthdayBox);
  
  // Initialize confetti
  initConfetti();
  
  // Set up progress steps
  document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('click', function() {
      const level = parseInt(this.getAttribute('data-level'));
      if (level <= currentLevel) {
        showLevelIntro(level, getLevelName(level));
      }
    });
  });
  
  // Quick links for galleries and playlists
  document.getElementById('videoBtn').addEventListener('click', showVideoGallery);
  document.getElementById('musicBtn').addEventListener('click', showPlaylist);
  document.getElementById('galleryBtn').addEventListener('click', showImageGallery);
  
  // Update navigation initially
  updateNavigation();
}

// Return a level name (for intro modals)
function getLevelName(level) {
  if (level === 0) return "Start";
  return gameConfig.levelNames[level] || `Level ${level}`;
}

// Enter the game
function enterQuest() {
  const inputName = playerNameInput.value.trim();
  if (inputName.toLowerCase() === gameConfig.password.toLowerCase()) {
    playerName = "Ongezwa";
    playerDisplayName.textContent = playerName;
    showLevelIntro(1, getLevelName(1));
  } else {
    enhancedModal("Oops!", "That's not the correct password. Try again!", true);
    playerNameInput.value = "";
    playerNameInput.focus();
  }
}

// Show a level intro modal before transitioning
function showLevelIntro(level, levelName) {
  enhancedModal(`Level ${level}: ${levelName}`, "Get ready for your next challenge!", false, "Start Level", () => {
    transitionToLevel(level);
  });
}

// Transition between levels
function transitionToLevel(level) {
  if (level < 0 || level > 4) return;
  
  const currentActive = document.querySelector('.level.active');
  // Animate out current level
  if (currentActive) {
    currentActive.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => {
      currentActive.classList.remove('active');
      currentActive.style.animation = '';
    }, 400);
  }

  // Animate in new level after delay
  setTimeout(() => {
    hideAllLevels();
    const nextLevel = level === 0 ? document.getElementById('startPage') : document.getElementById(`level${level}`);
    nextLevel.classList.add('active');
    currentLevel = level;
    
    updateProgress(level);
    updateNavigation();
    
    // Level-specific initializations
    switch(level) {
      case 1: 
        initWordPuzzle(); 
        break;
      case 2: 
        initTrivia(); 
        break;
      case 3: 
        initWheel(); 
        break;
      case 4: 
        initFinal(); 
        break;
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 400);
}

// Hide all levels
function hideAllLevels() {
  document.querySelectorAll('.level').forEach(levelEl => {
    levelEl.classList.remove('active');
  });
}

// Update progress bar
function updateProgress(level) {
  const steps = document.querySelectorAll('.step');
  const fill = document.querySelector('.progress-fill');
  
  steps.forEach((step, index) => {
    if (index <= level) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
  
  const progressPercent = (level / (steps.length - 1)) * 100;
  fill.style.width = `${progressPercent}%`;
}

// Update navigation buttons
function updateNavigation() {
  prevBtn.style.visibility = currentLevel > 0 ? 'visible' : 'hidden';
  nextBtn.style.visibility = currentLevel < 4 ? 'visible' : 'hidden';
  
  if (currentLevel < 4) {
    nextBtn.style.animation = 'pulse 2s infinite';
  } else {
    nextBtn.style.animation = '';
  }
}

// Navigation functions
function goToPreviousLevel() {
  if (currentLevel > 0) {
    showLevelIntro(currentLevel - 1, getLevelName(currentLevel - 1));
  }
}

function goToNextLevel() {
  if (currentLevel < 4) {
    let canProceed = true;
    if (currentLevel === 1 && foundWords.size < gameConfig.wordPuzzle.words.length) {
      canProceed = false;
      enhancedModal("Not Quite!", "Find all the hidden words before proceeding!", true);
    } else if (currentLevel === 2 && currentQuestion < gameConfig.trivia.questions.length) {
      canProceed = false;
      enhancedModal("Keep Going!", "Answer all the trivia questions first!", true);
    }
    if (canProceed) {
      showLevelIntro(currentLevel + 1, getLevelName(currentLevel + 1));
    }
  }
}

// -------------------------
// WORD PUZZLE FUNCTIONS
// -------------------------
function initWordPuzzle() {
  createWordGrid();
  updateHintCount();
}

function createWordGrid() {
  wordGrid.innerHTML = '';
  foundWords.clear();
  hintsRemaining = 3;
  updateHintCount();
  
  const { words, gridSize, colors } = gameConfig.wordPuzzle;
  const letters = [];
  
  words.forEach((word, wordIndex) => {
    const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const color = colors[wordIndex % colors.length];
    let row, col, fits = false;
    
    while (!fits) {
      if (direction === 'horizontal') {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - word.length));
      } else {
        row = Math.floor(Math.random() * (gridSize - word.length));
        col = Math.floor(Math.random() * gridSize);
      }
      fits = true;
      for (let i = 0; i < word.length; i++) {
        const currentRow = direction === 'horizontal' ? row : row + i;
        const currentCol = direction === 'horizontal' ? col + i : col;
        const index = currentRow * gridSize + currentCol;
        if (letters[index] && letters[index].letter !== word[i]) {
          fits = false;
          break;
        }
      }
    }
    
    for (let i = 0; i < word.length; i++) {
      const currentRow = direction === 'horizontal' ? row : row + i;
      const currentCol = direction === 'horizontal' ? col + i : col;
      const index = currentRow * gridSize + currentCol;
      letters[index] = {
        letter: word[i],
        wordIndex,
        color,
        direction,
        positionInWord: i
      };
    }
  });
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < gridSize * gridSize; i++) {
    if (!letters[i]) {
      letters[i] = {
        letter: alphabet[Math.floor(Math.random() * alphabet.length)],
        wordIndex: null
      };
    }
  }
  
  letters.forEach(letterObj => {
    const cell = document.createElement('div');
    cell.className = 'letter-cell';
    cell.textContent = letterObj.letter;
    if (letterObj.wordIndex !== null) {
      cell.dataset.wordIndex = letterObj.wordIndex;
      cell.dataset.color = letterObj.color;
    }
    cell.addEventListener('click', () => toggleLetterSelection(cell));
    wordGrid.appendChild(cell);
  });
}

function toggleLetterSelection(cell) {
  if (cell.classList.contains('selected')) return;
  cell.classList.add('selected');
  if (cell.dataset.color) {
    cell.style.backgroundColor = cell.dataset.color;
    cell.style.color = 'white';
    cell.style.boxShadow = `0 4px 8px ${cell.dataset.color}80`;
  }
  if (cell.dataset.wordIndex !== undefined) {
    const wordIndex = cell.dataset.wordIndex;
    const group = document.querySelectorAll(`.letter-cell[data-word-index="${wordIndex}"]`);
    const allSelected = [...group].every(c => c.classList.contains('selected'));
    if (allSelected && !foundWords.has(parseInt(wordIndex))) {
      foundWords.add(parseInt(wordIndex));
      animateWordCompletion(group);
      if (foundWords.size === gameConfig.wordPuzzle.words.length) {
        setTimeout(() => {
          enhancedModal("Well Done!", "You found all the words! Moving to the next level...", false, "Continue", () => {
            showLevelIntro(2, getLevelName(2));
          });
        }, 800);
      }
    }
  }
}

function animateWordCompletion(cells) {
  cells.forEach((cell, i) => {
    setTimeout(() => {
      cell.style.animation = 'bounce 0.5s ease';
      setTimeout(() => {
        cell.style.animation = '';
      }, 500);
    }, i * 100);
  });
}

function giveHint() {
  if (hintsRemaining <= 0) {
    enhancedModal("No Hints Left", "You've used all your hints!", true);
    return;
  }
  
  const unfoundIndices = [];
  for (let i = 0; i < gameConfig.wordPuzzle.words.length; i++) {
    if (!foundWords.has(i)) {
      unfoundIndices.push(i);
    }
  }
  
  if (unfoundIndices.length === 0) return;
  
  const randomIndex = unfoundIndices[Math.floor(Math.random() * unfoundIndices.length)];
  const cells = document.querySelectorAll(`.letter-cell[data-word-index="${randomIndex}"]`);
  if(cells.length) {
    cells[0].classList.add('highlighted');
    setTimeout(() => {
      cells[0].classList.remove('highlighted');
    }, 1000);
  }
  hintsRemaining--;
  updateHintCount();
}

function updateHintCount() {
  document.getElementById('hintCount').textContent = hintsRemaining;
}

// -------------------------
// TRIVIA FUNCTIONS
// -------------------------
function initTrivia() {
  quizScore = 0;
  currentQuestion = 0;
  document.getElementById('quizScore').textContent = quizScore;
  document.getElementById('currentQuestion').textContent = currentQuestion + 1;
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= gameConfig.trivia.questions.length) {
    enhancedModal("Trivia Complete!", `You scored ${quizScore} out of ${gameConfig.trivia.questions.length}!`, false, "Next Level", () => {
      showLevelIntro(3, getLevelName(3));
    });
    return;
  }
  
  const question = gameConfig.trivia.questions[currentQuestion];
  quizContainer.innerHTML = '';
  const questionElement = document.createElement('div');
  questionElement.className = 'quiz-question';
  questionElement.textContent = question.question;
  quizContainer.appendChild(questionElement);
  
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'quiz-options';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('button');
    optionElement.className = 'quiz-option';
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => selectAnswer(index));
    optionsContainer.appendChild(optionElement);
  });
  
  quizContainer.appendChild(optionsContainer);
  document.getElementById('currentQuestion').textContent = currentQuestion + 1;
}

function selectAnswer(selectedIndex) {
  const question = gameConfig.trivia.questions[currentQuestion];
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(option => {
    option.disabled = true;
  });
  options[selectedIndex].classList.add('selected');
  if (selectedIndex === question.answer) {
    options[selectedIndex].classList.add('correct');
    quizScore++;
    document.getElementById('quizScore').textContent = quizScore;
  } else {
    options[selectedIndex].classList.add('incorrect');
    options[question.answer].classList.add('correct');
  }
  
  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 1500);
}

// -------------------------
// WHEEL FUNCTIONS
// -------------------------
function initWheel() {
  spinsRemaining = 3;
  document.getElementById('spinCount').textContent = spinsRemaining;
  prizeDisplay.textContent = '';
  createWheel();
}

function createWheel() {
  wheel.innerHTML = '';
  const { prizes, colors } = gameConfig.wheel;
  const sectorAngle = 360 / prizes.length;
  
  prizes.forEach((prize, index) => {
    const sector = document.createElement('div');
    sector.className = 'wheel-sector';
    sector.style.transform = `rotate(${index * sectorAngle}deg)`;
    sector.style.backgroundColor = colors[index % colors.length];
    
    const prizeText = document.createElement('div');
    prizeText.className = 'prize-text';
    prizeText.textContent = prize;
    prizeText.style.transform = `rotate(${sectorAngle / 2}deg)`;
    prizeText.style.color = getContrastColor(colors[index % colors.length]);
    
    sector.appendChild(prizeText);
    wheel.appendChild(sector);
  });
}

function spinWheel() {
  if (wheelSpinning || spinsRemaining <= 0) return;
  
  wheelSpinning = true;
  spinsRemaining--;
  document.getElementById('spinCount').textContent = spinsRemaining;
  spinButton.disabled = true;
  
  const { prizes } = gameConfig.wheel;
  const spinDuration = 3000 + Math.random() * 2000;
  const rotations = 5 + Math.random() * 3;
  const finalAngle = 360 * rotations + (Math.random() * 360);
  const sectorAngle = 360 / prizes.length;
  const winningIndex = Math.floor((360 - (finalAngle % 360)) / sectorAngle) % prizes.length;
  const winningPrize = prizes[winningIndex];
  
  wheel.style.transform = `rotate(${finalAngle}deg)`;
  
  setTimeout(() => {
    wheelSpinning = false;
    spinButton.disabled = false;
    enhancedModal("Congratulations!", `You won: ${winningPrize}`, false, "OK", () => {
      if (spinsRemaining <= 0) {
        spinButton.disabled = true;
        setTimeout(() => {
          enhancedModal("Spins Complete!", "You've used all your spins! Moving to the next level...", false, "Next Level", () => {
            showLevelIntro(4, getLevelName(4));
          });
        }, 1500);
      }
    });
  }, spinDuration);
}

function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// -------------------------
// FINAL LEVEL FUNCTIONS
// -------------------------
function initFinal() {
  reasonsList.innerHTML = '';
  gameConfig.reasons.forEach(reason => {
    const reasonElement = document.createElement('p');
    reasonElement.textContent = reason;
    reasonsList.appendChild(reasonElement);
  });
  
  // Show detailed final prize info with animated gift box
  enhancedModal("Grand Finale", `
    <div class="final-message">
      <h2>Happy Birthday, ${playerName}!</h2>
      <p>You've conquered every challenge and unlocked amazing prizes:</p>
      <ul>
        ${gameConfig.wheel.prizes.map(prize => `<li>${prize}</li>`).join('')}
      </ul>
      <p>Enjoy these 28 reasons why you are so loved!</p>
      <div class="animated-gift-box"></div>
    </div>
  `, false, "Share & Restart", () => {
    showShareOptions();
  });
}

function toggleBirthdayBox() {
  birthdayBox.classList.toggle('open');
  if (birthdayBox.classList.contains('open') && !confettiActive) {
    triggerConfetti();
  }
}

// -------------------------
// CONFETTI FUNCTIONS
// -------------------------
function initConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });
}

function triggerConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  const ctx = confettiCanvas.getContext('2d');
  const particles = [];
  const colors = ['#FF6B8B', '#FF8E53', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#FFC43D'];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * 0.2 - 0.1
    });
  }
  
  let animationId;
  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let stillActive = false;
    particles.forEach(particle => {
      particle.y += particle.speed;
      particle.x += Math.sin(particle.angle) * 0.5;
      particle.angle += particle.rotation;
      if (particle.y < confettiCanvas.height) stillActive = true;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.angle);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();
    });
    if (stillActive) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      confettiActive = false;
    }
  }
  animate();
}

// -------------------------
// MODAL FUNCTIONS (Enhanced)
// -------------------------
function enhancedModal(title, message, isError, buttonText = "OK", callback) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = `modal-overlay ${isError ? 'error' : ''} enhanced`;
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content enhanced';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => closeModal(modalOverlay));
  
  const modalTitle = document.createElement('h2');
  modalTitle.className = 'modal-title';
  modalTitle.innerHTML = title;
  
  const modalMessage = document.createElement('div');
  modalMessage.className = 'modal-message';
  modalMessage.innerHTML = message;
  
  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalMessage);
  
  if (buttonText) {
    const actionButton = document.createElement('button');
    actionButton.className = 'btn btn-primary modal-action';
    actionButton.textContent = buttonText;
    actionButton.addEventListener('click', () => {
      closeModal(modalOverlay);
      if (typeof callback === "function") callback();
    });
    modalContent.appendChild(actionButton);
  }
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  setTimeout(() => modalOverlay.classList.add('active'), 10);
  
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal(modalOverlay);
    }
  });
}

function closeModal(modalOverlay) {
  modalOverlay.classList.remove('active');
  setTimeout(() => {
    if (modalOverlay.parentNode) modalOverlay.parentNode.removeChild(modalOverlay);
  }, 300);
}

// -------------------------
// GALLERY & PLAYLIST FUNCTIONS
// -------------------------
function showVideoGallery() {
  enhancedModal("Video Messages", `
    <div class="gallery-content">
      <p class="gallery-intro">Special video messages from your loved ones!</p>
      \
      
      <div class="video-gallery-container">
        <div class="video-item">
<div class="video-wrapper">
        
        </div>
        
           <div class="video-item">
          <div class="video-wrapper">
            <iframe src="https://player.vimeo.com/video/1070588963?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="480" height="848" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="WhatsApp Video 2025-03-27 at 19.35.39"></iframe>
          </div>
        </div> 
          
      <div class="video-item">
          <div class="video-wrapper">
            <iframe src="https://player.vimeo.com/video/1070754500?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="480" height="848" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="WhatsApp Video 2025-03-27 at 19.27.19"></iframe>
          </div>
        </div>  
        
      <div class="video-item">
          <div class="video-wrapper">
            <iframe src="https://player.vimeo.com/video/1070754420?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="480" height="848" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="WhatsApp Video 2025-03-27 at 19.27.17"></iframe>
          </div>
        </div>  
        
         <div class="video-item">
          <div class="video-wrapper">
            <iframe src="https://player.vimeo.com/video/1070755072?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="478" height="850" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="WhatsApp Video 2025-03-27 at 19.35.35"></iframe>
          </div>
        </div> 
        
  
        
        <div class="video-item">
          <div class="video-wrapper">
            <iframe src="https://player.vimeo.com/video/1070755099?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="480" height="848" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="WhatsApp Video 2025-03-27 at 19.35.34"></iframe>
          </div>
        </div>
        
        <div class="video-item">
          <div class="video-wrapper">
            <iframe src="https://player.vimeo.com/video/1070755125?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="576" height="1024" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="WhatsApp Video 2025-03-27 at 19.34.26 (1)"></iframe>
          </div>
        </div>
      </div>
    </div>
  `, false);
}

function showImageGallery() {
  enhancedModal("Photo Gallery", `
    <div class="gallery-content">
      <p class="gallery-intro">A collection of our memorable moments together!</p>
      <div class="image-gallery-container">
        <div class="image-item">
          <img src=https://i.postimg.cc/Kz05HckV/Whats-App-Image-2025-03-27-at-19-34-45-1.jpg" alt="Memory 1">
          <p class="image-caption"></p>
        </div>
        
        <div class="image-item">
          <img src="https://i.postimg.cc/vHk0ymqw/Whats-App-Image-2025-03-27-at-19-35-10-1.jpg" alt="Memory 2">
          <p class="image-caption"></p>
        </div>
        
        <div class="image-item">
          <img src="https://i.postimg.cc/6pZYpNg2/Whats-App-Image-2025-03-27-at-19-35-33-1.jpg" alt="Memory 3">
          <p class="image-caption"></p>
        </div>
        
        <div class="image-item">
          <img src="https://i.postimg.cc/fWHHHCYL/Whats-App-Image-2025-03-27-at-19-35-34.jpg" alt="Memory 4">
          <p class="image-caption"></p>
        </div>
      </div>
    </div>
  `, false);
}

function showPlaylist() {
  enhancedModal("Birthday Playlist", `
    <div class="gallery-content">
      <p>A curated playlist of Ongezwa's favorite songs:</p>
      <div class="playlist">
        <p>Song 1
        </p>
        <p>Song 2
        </p>
        <p>Song 3
        </p>
      </div>
    </div>
  `, false);
}

// -------------------------
// SHARE & RESTART FUNCTION
// -------------------------
function showShareOptions() {
  enhancedModal("Game Complete!", `
    <div class="final-options">
      <p>Thank you for playing Ongezwa's Birthday Adventure!</p>
      <p>Share your achievement on social media:</p>
      <div class="social-buttons">
        <button class="btn btn-secondary" id="twitterShareBtn"><i class="fab fa-twitter"></i> Twitter</button>
        <button class="btn btn-secondary" id="facebookShareBtn"><i class="fab fa-facebook-f"></i> Facebook</button>
        <button class="btn btn-secondary" id="whatsappShareBtn"><i class="fab fa-whatsapp"></i> WhatsApp</button>
      </div>
      <button class="btn btn-primary" id="restartGameBtn">Restart Game</button>
    </div>
  `, false);

  // Add event listeners for the share buttons
  document.getElementById('twitterShareBtn').addEventListener('click', () => shareGame('twitter'));
  document.getElementById('facebookShareBtn').addEventListener('click', () => shareGame('facebook'));
  document.getElementById('whatsappShareBtn').addEventListener('click', () => shareGame('whatsapp'));
  document.getElementById('restartGameBtn').addEventListener('click', restartGame);
}

function shareGame(platform) {
  const url = encodeURIComponent(window.location.href);
  let shareURL = "";
  switch(platform) {
    case "twitter":
      shareURL = `https://twitter.com/intent/tweet?url=${url}&text=I%20just%20played%20Ongezwa's%20Birthday%20Adventure!`;
      break;
    case "facebook":
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "whatsapp":
      shareURL = `https://api.whatsapp.com/send?text=I%20just%20played%20Ongezwa's%20Birthday%20Adventure!%20${url}`;
      break;
  }
  window.open(shareURL, "_blank");
}

function restartGame() {
  // Reset game state
  currentLevel = 0;
  playerName = "";
  foundWords.clear();
  hintsRemaining = 3;
  quizScore = 0;
  currentQuestion = 0;
  spinsRemaining = 3;
  wheelSpinning = false;
  confettiActive = false;
  playerNameInput.value = "";
  transitionToLevel(0);
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Make functions available globally for HTML onclick attributes
window.shareGame = shareGame;
window.restartGame = restartGame;
