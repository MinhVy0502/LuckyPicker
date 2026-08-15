/**
 * Mini-tools: 3D Coin Flip, 3D Dice Roller, RNG Number Picker
 */
class MiniTools {
  constructor() {
    this.coinEl = document.getElementById('coin3D');
    this.coinBadge = document.getElementById('coinResultBadge');
    this.diceStage = document.getElementById('diceStage');
    this.diceTotal = document.getElementById('diceTotalPoints');
    this.rngMain = document.getElementById('rngMainNumber');

    this.coinDegree = 0;
    this.isCoinFlipping = false;
    this.isDiceRolling = false;
    this.isRngRunning = false;

    this.initDice();
  }

  // 1. Coin Flip
  flipCoin() {
    if (this.isCoinFlipping) return;
    this.isCoinFlipping = true;

    if (window.soundEngine) soundEngine.playCoinToss();

    const isHeads = Math.random() < 0.5;
    // Add multiple rotations + final target (0deg for Heads, 180deg for Tails)
    const extraRotations = 1800; // 5 full turns
    this.coinDegree += extraRotations + (isHeads ? 0 : 180);

    this.coinEl.style.transform = `rotateY(${this.coinDegree}deg)`;
    this.coinBadge.textContent = 'Đang quay...';

    setTimeout(() => {
      this.isCoinFlipping = false;
      const resultText = isHeads ? 'MẶT SẤP' : 'MẶT NGỬA';
      this.coinBadge.textContent = resultText;
      if (typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
      }
    }, 1000);
  }

  // 2. Dice Roller
  initDice(count = 2) {
    const diceHtml = [];
    for (let i = 0; i < count; i++) {
      diceHtml.push(this.getDiceFaceHtml(1));
    }
    this.diceStage.innerHTML = diceHtml.join('');
    this.diceTotal.textContent = count;
  }

  getDiceFaceHtml(val) {
    // Dot patterns on a 3x3 grid
    const dotPositions = {
      1: [5],
      2: [1, 9],
      3: [1, 5, 9],
      4: [1, 3, 7, 9],
      5: [1, 3, 5, 7, 9],
      6: [1, 3, 4, 6, 7, 9]
    };

    const activeDots = dotPositions[val] || [5];
    let dotsHtml = '';
    for (let cell = 1; cell <= 9; cell++) {
      if (activeDots.includes(cell)) {
        dotsHtml += `<div class="dice-dot"></div>`;
      } else {
        dotsHtml += `<div></div>`;
      }
    }

    return `<div class="dice-cube" data-value="${val}">${dotsHtml}</div>`;
  }

  rollDice(count = 2) {
    if (this.isDiceRolling) return;
    this.isDiceRolling = true;

    if (window.soundEngine) soundEngine.playDiceRoll();

    let rollSteps = 0;
    const interval = setInterval(() => {
      rollSteps++;
      const randomValues = [];
      for (let i = 0; i < count; i++) {
        randomValues.push(Math.floor(Math.random() * 6) + 1);
      }

      this.diceStage.innerHTML = randomValues.map(v => this.getDiceFaceHtml(v)).join('');
      const tempTotal = randomValues.reduce((a, b) => a + b, 0);
      this.diceTotal.textContent = tempTotal;

      if (rollSteps >= 8) {
        clearInterval(interval);
        this.isDiceRolling = false;
        if (typeof confetti === 'function') {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        }
      }
    }, 80);
  }

  // 3. RNG Min-Max Number Generator
  generateRng(min, max, count = 1) {
    if (this.isRngRunning) return;
    if (min >= max) {
      alert('Giá trị Min phải nhỏ hơn Max!');
      return;
    }

    this.isRngRunning = true;
    if (window.soundEngine) soundEngine.playTick(1.5);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const tempRand = Math.floor(Math.random() * (max - min + 1)) + min;
      this.rngMain.textContent = tempRand;

      if (window.soundEngine && step % 2 === 0) {
        soundEngine.playTick(1.0 + step * 0.1);
      }

      if (step >= 12) {
        clearInterval(interval);
        this.isRngRunning = false;

        const finalNumbers = [];
        for (let i = 0; i < count; i++) {
          finalNumbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }

        this.rngMain.textContent = finalNumbers.join(', ');
        if (window.soundEngine) soundEngine.playWinFanfare();
        if (typeof confetti === 'function') {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        }
      }
    }, 60);
  }
}

window.miniTools = new MiniTools();
