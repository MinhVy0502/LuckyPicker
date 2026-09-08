/**
 * LuckyPicker Pro - Slot Machine & Multi-Winner Roller Engine
 * High performance, multi-reel support, cubic-bezier deceleration, and pixel-perfect winner landing.
 */
class SlotMachine {
  constructor() {
    this.isRolling = false;
    this.displayStage = document.getElementById('slotDisplayStage');
    this.reelsContainer = document.getElementById('slotReelsContainer');
    this.winnersGrid = document.getElementById('slotWinnersGrid');
    this.itemHeight = 140;
    this.tickTimer = null;

    // Initialize initial single reel if container exists
    if (this.reelsContainer) {
      this.setupReels(1);
    }
  }

  /**
   * Dynamically configure reels based on selected number of winners
   */
  setupReels(count = 1) {
    if (this.isRolling || !this.reelsContainer) return;

    if (count > 1) {
      this.displayStage?.classList.add('multi-column');
    } else {
      this.displayStage?.classList.remove('multi-column');
    }

    const columnsHtml = [];
    for (let i = 0; i < count; i++) {
      const badgeHtml = count > 1 
        ? `<div class="slot-reel-badge"><i data-lucide="award"></i> Giải ${i + 1}</div>`
        : '';

      columnsHtml.push(`
        <div class="slot-reel-column" data-column-idx="${i}">
          ${badgeHtml}
          <div class="slot-reel-box" id="slotReelBox_${i}">
            <div class="slot-reel-inner" id="slotReelInner_${i}">
              <div class="slot-item-placeholder">? ? ?</div>
            </div>
            <div class="slot-overlay-glow"></div>
          </div>
        </div>
      `);
    }

    this.reelsContainer.innerHTML = columnsHtml.join('');

    if (this.winnersGrid) {
      this.winnersGrid.style.display = 'none';
      this.winnersGrid.innerHTML = '';
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  /**
   * Spin reels and pick random winners
   */
  roll({ names, numWinners = 1, onFinish }) {
    if (this.isRolling || !names || names.length === 0) return;

    const availableNames = [...names];
    const actualWinnersCount = Math.min(numWinners, availableNames.length);
    const chosenWinners = [];

    for (let i = 0; i < actualWinnersCount; i++) {
      const randIdx = Math.floor(Math.random() * availableNames.length);
      chosenWinners.push(availableNames.splice(randIdx, 1)[0]);
    }

    this.isRolling = true;
    if (this.winnersGrid) {
      this.winnersGrid.style.display = 'none';
      this.winnersGrid.innerHTML = '';
    }

    // Prepare reels
    this.setupReels(actualWinnersCount);

    const baseDuration = 2300;
    const staggerDuration = 450;
    const maxDuration = baseDuration + (actualWinnersCount - 1) * staggerDuration;

    // Start mechanical ticking sound that naturally slows down
    if (this.tickTimer) clearTimeout(this.tickTimer);
    const startTick = Date.now();
    const tickLoop = () => {
      if (!this.isRolling) return;
      if (window.soundEngine) {
        soundEngine.playTick(1.1 + Math.random() * 0.3);
      }
      const elapsed = Date.now() - startTick;
      const progress = Math.min(1, elapsed / maxDuration);
      const nextDelay = 45 + Math.pow(progress, 2.2) * 290;
      if (elapsed < maxDuration - 100) {
        this.tickTimer = setTimeout(tickLoop, nextDelay);
      }
    };
    tickLoop();

    // Populate and launch each reel
    for (let colIdx = 0; colIdx < actualWinnersCount; colIdx++) {
      const reelInner = document.getElementById(`slotReelInner_${colIdx}`);
      const reelBox = document.getElementById(`slotReelBox_${colIdx}`);
      if (!reelInner) continue;

      const reelItemHeight = (reelBox && reelBox.clientHeight) ? reelBox.clientHeight : this.itemHeight;

      // Generate sequence of items: 28 random + winning item at the end
      const reelItems = [];
      const spinSteps = 28;
      for (let s = 0; s < spinSteps; s++) {
        const randPick = names[Math.floor(Math.random() * names.length)];
        reelItems.push(randPick);
      }
      reelItems.push(chosenWinners[colIdx]);

      // Populate DOM
      reelInner.innerHTML = reelItems.map((name, idx) => {
        const isTarget = idx === reelItems.length - 1;
        return `<div class="slot-item" data-winner="${isTarget ? 'true' : 'false'}">${name}</div>`;
      }).join('');

      const totalDistance = (reelItems.length - 1) * reelItemHeight;
      const reelDuration = baseDuration + colIdx * staggerDuration;

      // Reset position immediately without transition
      reelInner.style.transition = 'none';
      reelInner.style.transform = 'translateY(0px)';

      // Force layout reflow
      void reelInner.offsetHeight;

      // Animate with smooth cubic-bezier easing
      reelInner.style.transition = `transform ${reelDuration}ms cubic-bezier(0.12, 0.85, 0.25, 1)`;
      reelInner.style.transform = `translateY(-${totalDistance}px)`;

      // When this reel finishes
      setTimeout(() => {
        const lastItem = reelInner.lastElementChild;
        if (lastItem) {
          lastItem.classList.add('is-winner');
        }
        if (window.soundEngine) {
          soundEngine.playPop();
        }
      }, reelDuration);
    }

    // Complete all reels
    setTimeout(() => {
      this.isRolling = false;
      if (this.tickTimer) clearTimeout(this.tickTimer);

      // Play victory fanfare and show confetti
      if (window.soundEngine) {
        soundEngine.playWinFanfare();
      }
      if (typeof confetti === 'function') {
        confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
      }

      // Render winner chip(s)
      this.renderWinnersGrid(chosenWinners);

      if (onFinish) {
        onFinish(chosenWinners);
      }
    }, maxDuration + 100);
  }

  renderWinnersGrid(winners) {
    if (!this.winnersGrid) return;
    this.winnersGrid.style.display = 'flex';

    if (winners.length === 1) {
      this.winnersGrid.innerHTML = `
        <div class="slot-winner-chip">
          <span>🎉 Người chiến thắng: <strong>${winners[0]}</strong></span>
        </div>
      `;
    } else {
      this.winnersGrid.innerHTML = winners.map((w, idx) => `
        <div class="slot-winner-chip">
          <span>🏆 Giải ${idx + 1}: <strong>${w}</strong></span>
        </div>
      `).join('');
    }
  }
}

window.slotMachine = new SlotMachine();
