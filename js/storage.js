/**
 * Storage & Data Manager
 * Handles names sanitization, LocalStorage persistence and sample presets.
 */
class DataManager {
  constructor() {
    this.STORAGE_KEY_NAMES = 'app_random_names_data';
    this.STORAGE_KEY_PRESETS = 'app_random_presets_data';
    this.STORAGE_KEY_WHEEL_HISTORY = 'app_wheel_history_data';
    this.initDefaultPresets();
  }

  // Sample data presets for first time users
  initDefaultPresets() {
    if (!localStorage.getItem(this.STORAGE_KEY_PRESETS)) {
      const defaultPresets = [
        {
          id: 'preset_default_1',
          name: 'Lớp Học Sôi Động (20 bạn)',
          names: [
            'Nguyễn Hoàng Nam', 'Trần Thị Mai', 'Lê Quốc Bảo', 'Phạm Minh Đức',
            'Vũ Khánh Linh', 'Đặng Tuấn Anh', 'Bùi Phương Thảo', 'Đỗ Gia Huy',
            'Hoàng Thu Trang', 'Phan Hải Đăng', 'Ngô Bảo Ngọc', 'Dương Quốc Cường',
            'Lý Thanh Hằng', 'Võ Trọng Nghĩa', 'Trịnh Bích Phương', 'Đinh Tiến Đạt',
            'Hồ Mỹ Linh', 'Mai Văn Hùng', 'Chu Nhật Minh', 'Cao Thùy Chi'
          ]
        },
        {
          id: 'preset_default_2',
          name: 'Team Dev & Design Công Ty (12 người)',
          names: [
            'Alex Johnson (Tech Lead)', 'Nguyễn Văn Minh (Frontend)', 'Trần Hải Nam (Backend)',
            'Lê Thu Hà (UI/UX)', 'Phạm Quang Huy (DevOps)', 'Đỗ Kim Oanh (QA)',
            'Brian Smith (Product Owner)', 'Vũ Đình Trọng (Mobile)', 'Hoàng Lan (Scrum Master)',
            'Đặng Thùy Dương (Marketing)', 'Phan Văn Phú (AI Engineer)', 'Ngô Anh Tuấn (Security)'
          ]
        },
        {
          id: 'preset_default_3',
          name: 'Hội Bạn Game Avengers (10 người)',
          names: [
            'Iron Man (Tony)', 'Captain America (Steve)', 'Thor Thần Sấm',
            'Hulk Khổng Lồ', 'Black Widow (Natasha)', 'Hawkeye (Clint)',
            'Spider-Man (Peter)', 'Doctor Strange', 'Black Panther', 'Scarlet Witch'
          ]
        }
      ];
      localStorage.setItem(this.STORAGE_KEY_PRESETS, JSON.stringify(defaultPresets));
    }
  }

  // Parse raw text into clean array of names
  parseNames(rawText) {
    if (!rawText) return [];
    // Split by newlines, commas, or semicolons
    const lines = rawText.split(/[\r\n,;]+/);
    const cleaned = lines
      .map(name => name.trim())
      .filter(name => name.length > 0);
    return cleaned;
  }

  // Get current active names from LocalStorage or textarea
  getCurrentNames() {
    const saved = localStorage.getItem(this.STORAGE_KEY_NAMES);
    return saved ? JSON.parse(saved) : [];
  }

  saveCurrentNames(namesArray) {
    localStorage.setItem(this.STORAGE_KEY_NAMES, JSON.stringify(namesArray));
  }

  // Presets Management
  getPresets() {
    const data = localStorage.getItem(this.STORAGE_KEY_PRESETS);
    return data ? JSON.parse(data) : [];
  }

  savePreset(name, namesArray) {
    if (!name || !namesArray.length) return false;
    const presets = this.getPresets();
    const newPreset = {
      id: 'preset_' + Date.now(),
      name: name.trim(),
      names: namesArray
    };
    presets.unshift(newPreset);
    localStorage.setItem(this.STORAGE_KEY_PRESETS, JSON.stringify(presets));
    return newPreset;
  }

  deletePreset(id) {
    let presets = this.getPresets();
    presets = presets.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY_PRESETS, JSON.stringify(presets));
    return presets;
  }

  // Wheel history management
  getWheelHistory() {
    const data = localStorage.getItem(this.STORAGE_KEY_WHEEL_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  addWheelWinner(name, mode = 'Vòng quay') {
    const history = this.getWheelHistory();
    const item = {
      id: 'win_' + Date.now(),
      name,
      mode,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    history.unshift(item);
    // Keep max 50 items
    if (history.length > 50) history.pop();
    localStorage.setItem(this.STORAGE_KEY_WHEEL_HISTORY, JSON.stringify(history));
    return item;
  }

  clearWheelHistory() {
    localStorage.removeItem(this.STORAGE_KEY_WHEEL_HISTORY);
  }
}

window.dataManager = new DataManager();
