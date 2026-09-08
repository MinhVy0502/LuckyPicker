/**
 * Smart Team Generator & Manager
 * Implements team division algorithms, drag & drop, custom naming themes, copy & image export.
 */
class TeamGenerator {
  constructor() {
    this.currentTeams = [];
    this.themePresets = {
      superheroes: [
        '🦸‍♂️ Avengers Bất Bại', '⚡ Vệ Binh Dải Ngân Hà', '🦇 Hiệp Sĩ Bóng Đêm', 
        '🧬 X-Men Đột Biến', '🛡️ Liên Minh Công Lý', '🔨 Thần Sấm Asgard', 
        '🕷️ Người Nhện Siêu Đẳng', '🔥 Phượng Hoàng Lửa', '🏹 Biệt Đội Mũi Tên', '🦾 Chiến Binh Thép'
      ],
      gems: [
        '💎 Kim Cương Xanh', '🔴 Hồng Ngọc Ruby', '🟢 Ngọc Bích Emerald', 
        '🔵 Lam Ngọc Sapphire', '🟣 Thạch Anh Tím', '🟡 Hoàng Ngọc Topaz', 
        '⚪ Ngọc Trai Tinh Khiết', '🔮 Đá Mặt Trăng', '✨ Hổ Phách Cổ Đại', '🔷 Ngọc Mắt Mèo'
      ],
      mythical: [
        '🐉 Rồng Lửa Bất Diệt', '🦅 Thần Ưng Bão Tố', '🦄 Kỳ Lân Huyền Bí', 
        '🐯 Bạch Hổ Trấn Sơn', '🦁 Sư Tử Hoàng Gia', '🐺 Sói Tuyết Hoang Dã', 
        '🐍 Hắc Xà Vương', '🐢 Huyền Vũ Kiên Cố', '🦚 Khổng Tước Rực Rỡ', '🐲 Thủy Quái Leviathan'
      ],
      galaxies: [
        '🌌 Thiên Hà Andromeda', '✨ Tinh Vân Orion', '🪐 Vành Đai Sao Thổ', 
        '☄️ Sao Băng Rực Lửa', '☀️ Mặt Trời Rực Chói', '🌑 Hố Đen Siêu Khối', 
        '🚀 Trạm Không Gian ISS', '🔭 Kính Viễn Vọng James Webb', '🌠 Sao Chổi Halley', '🔴 Chiến Binh Sao Hỏa'
      ],
      fruits: [
        '🍉 Dưa Hấu Năng Động', '🥭 Xoài Cát Siêu Cấp', '🥑 Bơ Sáp Dẻo Dai', 
        '🍓 Dâu Tây Ngọt Ngào', '🍍 Dứa Gai Cá Tính', '🍌 Chuối Vàng Thông Thái', 
        '🥥 Dừa Xiêm Mát Lạnh', '🍇 Nho Tím Đẳng Cấp', '🍎 Táo Đỏ May Mắn', '🍊 Cam Sành Đậm Vị'
      ],
      colors: [
        '🔴 Biệt Đội Đỏ Rực', '🔵 Biệt Đội Xanh Dương', '🟡 Biệt Đội Vàng Óng', 
        '🟢 Biệt Đội Xanh Lá', '🟣 Biệt Đội Tím Mộng Mơ', '🟠 Biệt Đội Cam Nhiệt Huyết', 
        '⚫ Biệt Đội Bóng Đêm', '⚪ Biệt Đội Ánh Sáng', '🟤 Biệt Đội Đất Mẹ', '🔘 Biệt Đội Bạch Kim'
      ]
    };
  }

  // Shuffle array with Fisher-Yates
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Generate Teams
  generate({ names, mode, teamCount, teamSize, theme, hasLeader }) {
    if (!names || names.length === 0) return [];

    const shuffled = this.shuffle(names);
    let numTeams = 2;

    if (mode === 'teams') {
      numTeams = Math.max(1, Math.min(teamCount, shuffled.length));
    } else {
      const size = Math.max(1, teamSize);
      numTeams = Math.max(1, Math.ceil(shuffled.length / size));
    }

    // Initialize team buckets
    const teams = [];
    const themeNames = this.themePresets[theme] || [];

    for (let i = 0; i < numTeams; i++) {
      let teamTitle = '';
      if (theme === 'classic' || !themeNames[i]) {
        teamTitle = `Đội ${i + 1}`;
      } else {
        teamTitle = themeNames[i % themeNames.length];
      }

      teams.push({
        id: 'team_' + (i + 1),
        name: teamTitle,
        members: []
      });
    }

    // Distribute names evenly into teams
    shuffled.forEach((name, index) => {
      const targetTeamIndex = index % numTeams;
      teams[targetTeamIndex].members.push({
        id: 'mem_' + index + '_' + Date.now(),
        name: name,
        isLeader: false
      });
    });

    // Assign random leader for each team if requested
    if (hasLeader) {
      teams.forEach(t => {
        if (t.members.length > 0) {
          const leaderIdx = Math.floor(Math.random() * t.members.length);
          t.members[leaderIdx].isLeader = true;
        }
      });
    }

    this.currentTeams = teams;
    return teams;
  }

  // Render Teams to DOM with Drag and Drop Support
  renderTeams(containerEl, teams = this.currentTeams) {
    if (!teams || teams.length === 0) {
      containerEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i data-lucide="users"></i></div>
          <h3>Chưa có dữ liệu đội nhóm</h3>
          <p>Nhập danh sách tên ở bên trái và bấm <strong>BẮT ĐẦU CHIA TEAM</strong> để xem kết quả!</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const teamGradients = [
      'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.05))',
      'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(244, 63, 94, 0.05))',
      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))',
      'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.05))',
      'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.05))',
      'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.05))'
    ];

    containerEl.innerHTML = teams.map((team, idx) => {
      const bg = teamGradients[idx % teamGradients.length];
      return `
        <div class="team-card" data-team-id="${team.id}" style="background: ${bg};">
          <div class="team-card-header">
            <div class="team-card-title">
              <span>${team.name}</span>
            </div>
            <span class="team-badge-count" id="count_${team.id}">${team.members.length} thành viên</span>
          </div>
          <div class="team-members-list" data-team-id="${team.id}">
            ${team.members.map((mem, mIdx) => `
              <div class="member-item" draggable="true" data-member-id="${mem.id}" data-team-id="${team.id}">
                <div class="member-left">
                  <span class="member-index">${mIdx + 1}.</span>
                  <span class="member-name-text">${mem.name}</span>
                </div>
                ${mem.isLeader ? `<span class="member-leader-tag">👑 Đội Trưởng</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    this.attachDragAndDrop(containerEl);
    if (window.lucide) lucide.createIcons();
  }

  // Attach HTML5 Drag and Drop events
  attachDragAndDrop(containerEl) {
    let draggedMember = null;
    let sourceTeamId = null;

    const memberItems = containerEl.querySelectorAll('.member-item');
    const teamLists = containerEl.querySelectorAll('.team-members-list');

    memberItems.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedMember = item;
        sourceTeamId = item.dataset.teamId;
        item.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.memberId);
      });

      item.addEventListener('dragend', () => {
        if (draggedMember) {
          draggedMember.classList.remove('is-dragging');
        }
        containerEl.querySelectorAll('.team-card').forEach(c => c.classList.remove('drag-over'));
      });
    });

    teamLists.forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        list.closest('.team-card').classList.add('drag-over');
      });

      list.addEventListener('dragleave', () => {
        list.closest('.team-card').classList.remove('drag-over');
      });

      list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.closest('.team-card').classList.remove('drag-over');
        const targetTeamId = list.dataset.teamId;
        const memberId = e.dataTransfer.getData('text/plain');

        if (!memberId || sourceTeamId === targetTeamId) return;

        // Move in data model
        const sTeam = this.currentTeams.find(t => t.id === sourceTeamId);
        const tTeam = this.currentTeams.find(t => t.id === targetTeamId);

        if (sTeam && tTeam) {
          const memIdx = sTeam.members.findIndex(m => m.id === memberId);
          if (memIdx !== -1) {
            const [movedMember] = sTeam.members.splice(memIdx, 1);
            tTeam.members.push(movedMember);
            if (window.soundEngine) soundEngine.playPop();
            this.renderTeams(containerEl, this.currentTeams);
          }
        }
      });
    });
  }

  // Copy formatted teams to clipboard
  formatTeamsForClipboard() {
    if (!this.currentTeams.length) return '';
    let text = `🎉 KẾT QUẢ PHÂN CHIA TEAM (${new Date().toLocaleDateString('vi-VN')}) 🎉\n\n`;
    this.currentTeams.forEach((team) => {
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `⭐ ${team.name.toUpperCase()} (${team.members.length} người):\n`;
      team.members.forEach((mem, idx) => {
        text += `  ${idx + 1}. ${mem.name} ${mem.isLeader ? '👑 (Đội Trưởng)' : ''}\n`;
      });
      text += `\n`;
    });
    text += `👉 Được tạo bởi LuckyPicker Pro & TeamCraft`;
    return text;
  }

  // Export high-res image of teams container
  async exportImage(containerEl) {
    if (!containerEl || !this.currentTeams.length) return;
    try {
      if (typeof html2canvas === 'undefined') {
        alert('Đang tải thư viện xuất ảnh, vui lòng thử lại sau 1 giây.');
        return;
      }
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const bgColor = isLight ? '#f8fafc' : '#0c0f17';
      const canvas = await html2canvas(containerEl, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `Ket_Qua_Chia_Team_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Lỗi xuất ảnh:', err);
    }
  }
}

window.teamGenerator = new TeamGenerator();
