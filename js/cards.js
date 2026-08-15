/**
 * Mystery Cards, 1-on-1 Pairing & Secret Santa Engine
 */
class CardsAndPairing {
  constructor() {
    this.cardsContainer = document.getElementById('mysteryCardsContainer');
    this.pairingContainer = document.getElementById('pairingContentArea');
  }

  // Shuffle array utility
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 1. Generate Mystery Cards
  generateMysteryCards(names) {
    if (!names || names.length === 0) {
      this.cardsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i data-lucide="layers"></i></div>
          <h3>Chưa có dữ liệu</h3>
          <p>Nhập danh sách tên và nhấn <strong>Tạo Bộ Thẻ</strong>!</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const shuffled = this.shuffle(names);

    this.cardsContainer.innerHTML = shuffled.map((name, idx) => `
      <div class="card-flip-container" data-name="${name}">
        <div class="card-flip-inner">
          <div class="card-front">
            <span class="card-number-badge">#${idx + 1}</span>
            <div class="card-mystery-icon"><i data-lucide="help-circle"></i></div>
          </div>
          <div class="card-back">
            <span class="card-winner-title">May Mắn</span>
            <span class="card-winner-name">${name}</span>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();

    // Attach click flip event
    const cards = this.cardsContainer.querySelectorAll('.card-flip-container');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('is-flipped')) {
          card.classList.add('is-flipped');
          if (window.soundEngine) soundEngine.playPop();
          if (typeof confetti === 'function') {
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
          }
        }
      });
    });
  }

  revealAllCards() {
    const cards = this.cardsContainer.querySelectorAll('.card-flip-container:not(.is-flipped)');
    cards.forEach((card, idx) => {
      setTimeout(() => {
        card.classList.add('is-flipped');
        if (window.soundEngine) soundEngine.playPop();
      }, idx * 100);
    });
  }

  // 2. Generate 1-on-1 Pairs
  generatePairs(names) {
    if (!names || names.length < 2) {
      this.pairingContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i data-lucide="users"></i></div>
          <h3>Cần ít nhất 2 người</h3>
          <p>Vui lòng nhập từ 2 tên trở lên để ghép đôi.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const shuffled = this.shuffle(names);
    const pairs = [];

    while (shuffled.length >= 2) {
      const p1 = shuffled.pop();
      const p2 = shuffled.pop();
      pairs.push([p1, p2]);
    }

    let extraNote = '';
    if (shuffled.length === 1) {
      // 1 leftover person joined with the first pair
      const leftover = shuffled.pop();
      if (pairs.length > 0) {
        pairs[0].push(leftover);
        extraNote = `<div class="text-muted" style="margin-bottom: 1rem; font-size: 0.85rem;">* Do số lượng người lẻ, Cặp 1 sẽ bao gồm 3 người (${pairs[0].join(', ')})</div>`;
      }
    }

    this.pairingContainer.innerHTML = `
      ${extraNote}
      <div class="pairing-grid">
        ${pairs.map((pair, idx) => `
          <div class="pair-card">
            <div class="pair-person">
              <i data-lucide="user-check" class="text-accent"></i>
              <span>${pair[0]}</span>
            </div>
            <i data-lucide="arrow-left-right" class="pair-link-icon"></i>
            <div class="pair-person">
              <span>${pair[1]} ${pair[2] ? `+ ${pair[2]}` : ''}</span>
              <i data-lucide="user-check" class="text-accent"></i>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  }

  // 3. Generate Secret Santa (Gift exchange circle)
  generateSecretSanta(names) {
    if (!names || names.length < 3) {
      this.pairingContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i data-lucide="gift"></i></div>
          <h3>Cần ít nhất 3 người</h3>
          <p>Bốc thăm tặng quà bí mật cần tối thiểu 3 người tham gia.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const shuffled = this.shuffle(names);
    // Chain: 0 -> 1 -> 2 -> ... -> N-1 -> 0
    const chain = [];
    for (let i = 0; i < shuffled.length; i++) {
      const giver = shuffled[i];
      const receiver = shuffled[(i + 1) % shuffled.length];
      chain.push({ giver, receiver });
    }

    this.pairingContainer.innerHTML = `
      <div class="santa-chain-container">
        <p class="text-muted" style="margin-bottom: 1.25rem; font-size: 0.9rem;">
          🎁 Nhấp vào ô bí mật để người tặng xem người mình cần chuẩn bị quà!
        </p>
        ${chain.map((item, idx) => `
          <div class="santa-chain-card">
            <div class="santa-giver">
              <span class="text-muted" style="font-size: 0.8rem; display: block;">Người tặng:</span>
              <span>🎁 ${item.giver}</span>
            </div>
            <div class="santa-secret-target" data-receiver="${item.receiver}">
              <span>🔒 Bấm để xem người nhận</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Click to reveal receiver
    const targets = this.pairingContainer.querySelectorAll('.santa-secret-target');
    targets.forEach(t => {
      t.addEventListener('click', () => {
        const receiver = t.dataset.receiver;
        if (!t.classList.contains('revealed')) {
          t.classList.add('revealed');
          t.innerHTML = `<span>🎯 Tặng cho: <strong>${receiver}</strong></span>`;
          if (window.soundEngine) soundEngine.playPop();
        } else {
          t.classList.remove('revealed');
          t.innerHTML = `<span>🔒 Bấm để xem người nhận</span>`;
        }
      });
    });

    if (window.lucide) lucide.createIcons();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 50, spread: 60 });
    }
  }
}

window.cardsAndPairing = new CardsAndPairing();
