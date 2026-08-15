/**
 * Slot Machine & Multi-Winner Roller Engine
 */
class SlotMachine {
  constructor() {
    this.isRolling = false;
    this.reelInner = document.getElementById('slotReelInner');
    this.winnersGrid = document.getElementById('slotWinnersGrid');
  }

  roll({ names, numWinners = 1, onFinish }) {
    if (this.isRolling || !names || names.length === 0) return;

    this.isRolling = true;
    this.winnersGrid.style.display = 'none';
    this.winnersGrid.innerHTML = '';

    const availableNames = [...names];
    const actualWinnersCount = Math.min(numWinners, availableNames.length);
    const chosenWinners = [];

    for (let i = 0; i < actualWinnersCount; i++) {
      const randIdx = Math.floor(Math.random() * availableNames.length);
      chosenWinners.push(availableNames.splice(randIdx, 1)[0]);
    }

    // Build rolling reel items
    const reelItems = [];
    for (let i = 0; i < 30; i++) {
      const randomPick = names[Math.floor(Math.random() * names.length)];
      reelItems.push(randomPick);
    }
    // Final winner at the end
    reelItems.push(chosenWinners[0]);

    this.reelInner.innerHTML = reelItems.map(name => `
      <div class="slot-item">${name}</div>
    `).join('');

    const itemHeight = 140;
    const totalDistance = (reelItems.length - 1) * itemHeight;

    let currentPos = 0;
    let speed = 25;
    let step = 0;

    const interval = setInterval(() => {
      currentPos += speed;
      step++;

      if (window.soundEngine && step % 3 === 0) {
        soundEngine.playTick(1.2);
      }

      if (currentPos >= totalDistance) {
        clearInterval(interval);
        currentPos = totalDistance;
        this.reelInner.style.transform = `translateY(-${currentPos}px)`;
        this.isRolling = false;

        // Sound fanfare
        if (window.soundEngine) soundEngine.playWinFanfare();

        // Render multi-winner chips if > 1
        if (chosenWinners.length > 1) {
          this.winnersGrid.style.display = 'flex';
          this.winnersGrid.innerHTML = chosenWinners.map((w, idx) => `
            <div class="slot-winner-chip">
              <span>🏆 Giải ${idx + 1}: <strong>${w}</strong></span>
            </div>
          `).join('');
        }

        if (onFinish) {
          onFinish(chosenWinners);
        }
      } else {
        this.reelInner.style.transform = `translateY(-${currentPos}px)`;
        // Decelerate in the final 20%
        if (currentPos > totalDistance * 0.75) {
          speed = Math.max(4, speed * 0.94);
        }
      }
    }, 20);
  }
}

window.slotMachine = new SlotMachine();
