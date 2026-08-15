/**
 * Main Application Orchestrator
 * Coordinates UI tabs, sidebar data, modals, shortcuts & user interactions.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Initialize Instances
  const luckyWheel = new LuckyWheel('wheelCanvas');

  // DOM Elements - Navigation & Global Actions
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const btnToggleTheme = document.getElementById('btnToggleTheme');
  const btnToggleSound = document.getElementById('btnToggleSound');
  const soundIcon = document.getElementById('soundIcon');
  const themeIcon = document.getElementById('themeIcon');

  // DOM Elements - Sidebar
  const namesInput = document.getElementById('namesInput');
  const namesCountBadge = document.getElementById('namesCountBadge');
  const btnQuickSample = document.getElementById('btnQuickSample');
  const btnShuffleNames = document.getElementById('btnShuffleNames');
  const btnSortNames = document.getElementById('btnSortNames');
  const btnClearNames = document.getElementById('btnClearNames');
  const fileInputUpload = document.getElementById('fileInputUpload');
  const btnSavePreset = document.getElementById('btnSavePreset');
  const presetNameInput = document.getElementById('presetNameInput');
  const btnOpenPresets = document.getElementById('btnOpenPresets');
  const chkRemoveWinner = document.getElementById('chkRemoveWinner');

  // DOM Elements - Teams
  const btnModeNumTeams = document.getElementById('btnModeNumTeams');
  const btnModeSizeTeam = document.getElementById('btnModeSizeTeam');
  const lblTeamCount = document.getElementById('lblTeamCount');
  const numTeamInput = document.getElementById('numTeamInput');
  const btnDecTeam = document.getElementById('btnDecTeam');
  const btnIncTeam = document.getElementById('btnIncTeam');
  const selTeamTheme = document.getElementById('selTeamTheme');
  const chkRandomLeader = document.getElementById('chkRandomLeader');
  const btnGenerateTeams = document.getElementById('btnGenerateTeams');
  const teamsToolbar = document.getElementById('teamsToolbar');
  const teamSummaryText = document.getElementById('teamSummaryText');
  const btnCopyTeamText = document.getElementById('btnCopyTeamText');
  const btnExportTeamImage = document.getElementById('btnExportTeamImage');
  const btnReShuffleTeams = document.getElementById('btnReShuffleTeams');
  const teamsResultContainer = document.getElementById('teamsResultContainer');

  // DOM Elements - Wheel
  const btnSpinWheel = document.getElementById('btnSpinWheel');
  const btnSpinCenter = document.getElementById('btnSpinCenter');
  const wheelHistoryList = document.getElementById('wheelHistoryList');
  const btnClearWheelHistory = document.getElementById('btnClearWheelHistory');

  // DOM Elements - Slot Machine
  const btnRollSlot = document.getElementById('btnRollSlot');
  const numWinnersSlot = document.getElementById('numWinnersSlot');

  // DOM Elements - Mystery Cards
  const btnGenerateCards = document.getElementById('btnGenerateCards');
  const btnRevealAllCards = document.getElementById('btnRevealAllCards');

  // DOM Elements - Pairing & Santa
  const btnSubTabPairing = document.getElementById('btnSubTabPairing');
  const btnSubTabSanta = document.getElementById('btnSubTabSanta');
  const btnExecutePairing = document.getElementById('btnExecutePairing');

  // DOM Elements - MiniTools
  const btnFlipCoin = document.getElementById('btnFlipCoin');
  const btnRollDice = document.getElementById('btnRollDice');
  const selDiceCount = document.getElementById('selDiceCount');
  const btnGenerateRng = document.getElementById('btnGenerateRng');
  const rngMin = document.getElementById('rngMin');
  const rngMax = document.getElementById('rngMax');
  const rngCount = document.getElementById('rngCount');

  // DOM Elements - Modals
  const winnerModal = document.getElementById('winnerModal');
  const modalWinnerName = document.getElementById('modalWinnerName');
  const modalWinnerInfo = document.getElementById('modalWinnerInfo');
  const btnCloseWinnerModal = document.getElementById('btnCloseWinnerModal');
  const btnWinnerClose = document.getElementById('btnWinnerClose');
  const btnWinnerRemove = document.getElementById('btnWinnerRemove');

  const presetsModal = document.getElementById('presetsModal');
  const btnClosePresetsModal = document.getElementById('btnClosePresetsModal');
  const presetItemsList = document.getElementById('presetItemsList');

  // App State
  let teamDivisionMode = 'teams'; // 'teams' | 'size'
  let activeTab = 'teams';
  let activeSantaSubTab = 'pair'; // 'pair' | 'santa'
  let lastWinnerName = '';

  // -------------------------------------------------------------
  // 1. Toast Notification Helper
  // -------------------------------------------------------------
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // -------------------------------------------------------------
  // 2. Data Synchronization & Update
  // -------------------------------------------------------------
  function getNamesList() {
    return dataManager.parseNames(namesInput.value);
  }

  function updateNames(namesArray, showNotification = false) {
    namesInput.value = namesArray.join('\n');
    namesCountBadge.textContent = `${namesArray.length} người`;
    dataManager.saveCurrentNames(namesArray);
    luckyWheel.setNames(namesArray);

    if (showNotification) {
      showToast(`Đã cập nhật danh sách (${namesArray.length} người)`);
    }
  }

  function loadInitialNames() {
    const saved = dataManager.getCurrentNames();
    if (saved && saved.length > 0) {
      updateNames(saved);
    } else {
      // Default to Sample 1
      const presets = dataManager.getPresets();
      if (presets.length > 0) {
        updateNames(presets[0].names);
      }
    }
  }

  // -------------------------------------------------------------
  // 3. Navigation Tabs
  // -------------------------------------------------------------
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      activeTab = targetTab;

      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const pane = document.getElementById(`pane-${targetTab}`);
      if (pane) pane.classList.add('active');

      if (targetTab === 'wheel') {
        luckyWheel.setNames(getNamesList());
      }
      if (window.lucide) lucide.createIcons();
    });
  });

  // -------------------------------------------------------------
  // 4. Sidebar Event Listeners
  // -------------------------------------------------------------
  namesInput.addEventListener('input', () => {
    const names = getNamesList();
    namesCountBadge.textContent = `${names.length} người`;
    dataManager.saveCurrentNames(names);
    luckyWheel.setNames(names);
  });

  btnQuickSample.addEventListener('click', () => {
    const presets = dataManager.getPresets();
    if (presets.length > 0) {
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      updateNames(randomPreset.names, true);
    }
  });

  btnShuffleNames.addEventListener('click', () => {
    const names = getNamesList();
    if (names.length < 2) return;
    const shuffled = teamGenerator.shuffle(names);
    if (window.soundEngine) soundEngine.playShuffle();
    updateNames(shuffled, true);
  });

  btnSortNames.addEventListener('click', () => {
    const names = getNamesList();
    if (names.length < 2) return;
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'vi'));
    if (window.soundEngine) soundEngine.playTick();
    updateNames(sorted, true);
  });

  btnClearNames.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ danh sách tên?')) {
      updateNames([], true);
    }
  });

  // File Upload (TXT / CSV)
  fileInputUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parsed = dataManager.parseNames(content);
      if (parsed.length > 0) {
        updateNames(parsed, true);
      } else {
        alert('File không có dữ liệu tên hợp lệ!');
      }
    };
    reader.readAsText(file);
    fileInputUpload.value = '';
  });

  // Save Preset
  btnSavePreset.addEventListener('click', () => {
    const name = presetNameInput.value.trim();
    const names = getNamesList();
    if (!name) {
      alert('Vui lòng nhập tên cho danh sách mẫu!');
      return;
    }
    if (names.length === 0) {
      alert('Danh sách tên đang trống!');
      return;
    }

    dataManager.savePreset(name, names);
    presetNameInput.value = '';
    showToast(`Đã lưu danh sách "${name}" thành công!`);
  });

  // Open Presets Manager
  btnOpenPresets.addEventListener('click', () => {
    renderPresetsModal();
    presetsModal.classList.add('open');
  });

  btnClosePresetsModal.addEventListener('click', () => {
    presetsModal.classList.remove('open');
  });

  function renderPresetsModal() {
    const presets = dataManager.getPresets();
    if (presets.length === 0) {
      presetItemsList.innerHTML = '<div class="empty-history">Chưa có danh sách mẫu nào</div>';
      return;
    }

    presetItemsList.innerHTML = presets.map(p => `
      <div class="preset-row">
        <div class="preset-title-group">
          <span class="preset-title">${p.name}</span>
          <span class="preset-count">${p.names.length} người</span>
        </div>
        <div class="preset-actions">
          <button class="btn-primary btn-sm btn-load-preset" data-id="${p.id}">
            <i data-lucide="check"></i> Chọn
          </button>
          <button class="btn-chip text-danger btn-del-preset" data-id="${p.id}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();

    // Bind load & delete
    presetItemsList.querySelectorAll('.btn-load-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = presets.find(p => p.id === id);
        if (target) {
          updateNames(target.names, true);
          presetsModal.classList.remove('open');
        }
      });
    });

    presetItemsList.querySelectorAll('.btn-del-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        dataManager.deletePreset(id);
        renderPresetsModal();
      });
    });
  }

  // -------------------------------------------------------------
  // 5. Team Generator Logic
  // -------------------------------------------------------------
  btnModeNumTeams.addEventListener('click', () => {
    teamDivisionMode = 'teams';
    btnModeNumTeams.classList.add('active');
    btnModeSizeTeam.classList.remove('active');
    lblTeamCount.textContent = 'Số lượng đội cần chia:';
  });

  btnModeSizeTeam.addEventListener('click', () => {
    teamDivisionMode = 'size';
    btnModeSizeTeam.classList.add('active');
    btnModeNumTeams.classList.remove('active');
    lblTeamCount.textContent = 'Số thành viên mỗi đội:';
  });

  btnDecTeam.addEventListener('click', () => {
    const val = parseInt(numTeamInput.value, 10) || 2;
    if (val > 1) numTeamInput.value = val - 1;
  });

  btnIncTeam.addEventListener('click', () => {
    const val = parseInt(numTeamInput.value, 10) || 2;
    numTeamInput.value = val + 1;
  });

  function executeTeamGeneration() {
    const names = getNamesList();
    if (names.length < 2) {
      alert('Vui lòng nhập ít nhất 2 tên để phân chia team!');
      return;
    }

    const countVal = parseInt(numTeamInput.value, 10) || 2;
    const theme = selTeamTheme.value;
    const hasLeader = chkRandomLeader.checked;

    const teams = teamGenerator.generate({
      names,
      mode: teamDivisionMode,
      teamCount: countVal,
      teamSize: countVal,
      theme,
      hasLeader
    });

    teamGenerator.renderTeams(teamsResultContainer, teams);

    teamsToolbar.style.display = 'flex';
    teamSummaryText.textContent = `Đã chia ${names.length} người thành ${teams.length} đội (${selTeamTheme.options[selTeamTheme.selectedIndex].text})`;

    if (window.soundEngine) soundEngine.playWinFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  }

  btnGenerateTeams.addEventListener('click', executeTeamGeneration);
  btnReShuffleTeams.addEventListener('click', executeTeamGeneration);

  btnCopyTeamText.addEventListener('click', () => {
    const text = teamGenerator.formatTeamsForClipboard();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã copy danh sách đội vào Clipboard! Sẵn sàng dán vào Zalo/Messenger/Slack.');
    });
  });

  btnExportTeamImage.addEventListener('click', () => {
    teamGenerator.exportImage(teamsResultContainer);
    showToast('Đang tải ảnh kết quả về máy...');
  });

  // -------------------------------------------------------------
  // 6. Lucky Spin Wheel Logic
  // -------------------------------------------------------------
  function triggerWheelSpin() {
    const names = getNamesList();
    if (names.length < 2) {
      alert('Vui lòng nhập ít nhất 2 tên để quay vòng!');
      return;
    }

    btnSpinWheel.disabled = true;
    btnSpinCenter.disabled = true;

    luckyWheel.spin((winner, winnerIdx) => {
      btnSpinWheel.disabled = false;
      btnSpinCenter.disabled = false;
      lastWinnerName = winner;

      // Celebrate
      if (window.soundEngine) soundEngine.playWinFanfare();
      if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
      }

      // Add to history
      dataManager.addWheelWinner(winner, 'Vòng quay');
      renderWheelHistory();

      // Show Winner Modal
      modalWinnerName.textContent = winner;
      modalWinnerInfo.textContent = `Đã trúng thưởng từ Vòng Quay May Mắn!`;
      winnerModal.classList.add('open');

      // Auto remove if enabled
      if (chkRemoveWinner.checked) {
        removeWinnerFromNames(winner);
      }
    });
  }

  btnSpinWheel.addEventListener('click', triggerWheelSpin);
  btnSpinCenter.addEventListener('click', triggerWheelSpin);

  // Spacebar to spin wheel
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && activeTab === 'wheel' && document.activeElement !== namesInput) {
      e.preventDefault();
      triggerWheelSpin();
    }
  });

  function renderWheelHistory() {
    const history = dataManager.getWheelHistory();
    if (history.length === 0) {
      wheelHistoryList.innerHTML = '<div class="empty-history">Chưa có lượt quay nào</div>';
      return;
    }

    wheelHistoryList.innerHTML = history.map(item => `
      <div class="history-item">
        <div class="history-left">
          <span class="history-name">🏆 ${item.name}</span>
        </div>
        <span class="history-time">${item.time}</span>
      </div>
    `).join('');
  }

  btnClearWheelHistory.addEventListener('click', () => {
    dataManager.clearWheelHistory();
    renderWheelHistory();
  });

  // Winner Modal actions
  btnCloseWinnerModal.addEventListener('click', () => winnerModal.classList.remove('open'));
  btnWinnerClose.addEventListener('click', () => winnerModal.classList.remove('open'));

  btnWinnerRemove.addEventListener('click', () => {
    if (lastWinnerName) {
      removeWinnerFromNames(lastWinnerName);
      winnerModal.classList.remove('open');
      showToast(`Đã loại "${lastWinnerName}" khỏi danh sách!`);
    }
  });

  function removeWinnerFromNames(nameToRemove) {
    const names = getNamesList();
    const updated = names.filter(n => n !== nameToRemove);
    updateNames(updated);
  }

  // -------------------------------------------------------------
  // 7. Slot Machine Logic
  // -------------------------------------------------------------
  btnRollSlot.addEventListener('click', () => {
    const names = getNamesList();
    if (names.length === 0) {
      alert('Vui lòng nhập danh sách tên!');
      return;
    }

    const numWinners = parseInt(numWinnersSlot.value, 10) || 1;
    btnRollSlot.disabled = true;

    slotMachine.roll({
      names,
      numWinners,
      onFinish: (winners) => {
        btnRollSlot.disabled = false;
        winners.forEach(w => dataManager.addWheelWinner(w, 'Máy quay số'));
        renderWheelHistory();

        if (chkRemoveWinner.checked) {
          winners.forEach(w => removeWinnerFromNames(w));
        }

        if (typeof confetti === 'function') {
          confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
        }
      }
    });
  });

  // -------------------------------------------------------------
  // 8. Mystery Cards Logic
  // -------------------------------------------------------------
  btnGenerateCards.addEventListener('click', () => {
    const names = getNamesList();
    cardsAndPairing.generateMysteryCards(names);
    if (window.soundEngine) soundEngine.playShuffle();
  });

  btnRevealAllCards.addEventListener('click', () => {
    cardsAndPairing.revealAllCards();
  });

  // -------------------------------------------------------------
  // 9. Pairing & Secret Santa Logic
  // -------------------------------------------------------------
  btnSubTabPairing.addEventListener('click', () => {
    activeSantaSubTab = 'pair';
    btnSubTabPairing.classList.add('active');
    btnSubTabSanta.classList.remove('active');
  });

  btnSubTabSanta.addEventListener('click', () => {
    activeSantaSubTab = 'santa';
    btnSubTabSanta.classList.add('active');
    btnSubTabPairing.classList.remove('active');
  });

  btnExecutePairing.addEventListener('click', () => {
    const names = getNamesList();
    if (activeSantaSubTab === 'pair') {
      cardsAndPairing.generatePairs(names);
    } else {
      cardsAndPairing.generateSecretSanta(names);
    }
    if (window.soundEngine) soundEngine.playWinFanfare();
  });

  // -------------------------------------------------------------
  // 10. MiniTools Logic
  // -------------------------------------------------------------
  btnFlipCoin.addEventListener('click', () => {
    miniTools.flipCoin();
  });

  selDiceCount.addEventListener('change', () => {
    miniTools.initDice(parseInt(selDiceCount.value, 10));
  });

  btnRollDice.addEventListener('click', () => {
    miniTools.rollDice(parseInt(selDiceCount.value, 10));
  });

  btnGenerateRng.addEventListener('click', () => {
    const min = parseInt(rngMin.value, 10) || 1;
    const max = parseInt(rngMax.value, 10) || 100;
    const count = parseInt(rngCount.value, 10) || 1;
    miniTools.generateRng(min, max, count);
  });

  // -------------------------------------------------------------
  // 11. Theme & Sound Toggles
  // -------------------------------------------------------------
  btnToggleSound.addEventListener('click', () => {
    const isMuted = soundEngine.toggleMute();
    soundIcon.setAttribute('data-lucide', isMuted ? 'volume-x' : 'volume-2');
    if (window.lucide) lucide.createIcons();
    showToast(isMuted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh');
  });

  btnToggleTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app_theme_mode', newTheme);
    themeIcon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  });

  // Load Saved Theme
  const savedTheme = localStorage.getItem('app_theme_mode');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }

  // Load Initial Data
  loadInitialNames();
  renderWheelHistory();
});
