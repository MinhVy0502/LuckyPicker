/**
 * Lucky Spin Wheel Engine (Canvas HTML5)
 * Realistic physics, sound ticks, deceleration curve, confetti & winner detection.
 */
class LuckyWheel {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.names = [];
    this.currentAngle = 0; // In radians
    this.isSpinning = false;
    this.spinVelocity = 0;
    this.friction = 0.985;
    this.lastTickIndex = -1;
    this.onFinishCallback = null;

    // Palette for wheel slices
    this.sliceColors = [
      '#6366f1', '#ec4899', '#06b6d4', '#10b981', 
      '#f59e0b', '#8b5cf6', '#f43f5e', '#3b82f6',
      '#14b8a6', '#d946ef', '#f97316', '#84cc16'
    ];

    if (this.canvas) {
      this.init();
    }
  }

  init() {
    this.draw();
  }

  setNames(names) {
    this.names = names;
    this.draw();
  }

  // Draw the wheel onto canvas
  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const center = width / 2;
    const radius = center - 15;

    ctx.clearRect(0, 0, width, height);

    if (!this.names || this.names.length === 0) {
      // Empty wheel placeholder
      ctx.save();
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Nhập danh sách tên để quay', center, center);
      ctx.restore();
      return;
    }

    const numSlices = this.names.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(this.currentAngle);

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
      const angleStart = i * sliceAngle;
      const angleEnd = angleStart + sliceAngle;
      const color = this.sliceColors[i % this.sliceColors.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angleStart, angleEnd);
      ctx.closePath();

      // Gradient slice effect
      const sliceGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
      sliceGrad.addColorStop(0, '#ffffff20');
      sliceGrad.addColorStop(0.3, color);
      sliceGrad.addColorStop(1, color);

      ctx.fillStyle = sliceGrad;
      ctx.fill();

      // Border between slices
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // Draw Name Text
      ctx.save();
      ctx.rotate(angleStart + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Dynamic font size depending on number of slices
      let fontSize = 18;
      if (numSlices > 16) fontSize = 14;
      if (numSlices > 30) fontSize = 11;

      ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;

      let displayName = this.names[i];
      if (displayName.length > 18) displayName = displayName.substring(0, 16) + '...';

      ctx.fillText(displayName, radius - 30, 0);
      ctx.restore();
    }

    // Outer Glowing Ring & Studs
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.stroke();

    ctx.restore();
  }

  // Spin the wheel
  spin(onFinish) {
    if (this.isSpinning || !this.names || this.names.length === 0) return;

    this.isSpinning = true;
    this.onFinishCallback = onFinish;

    // Random initial high speed between 0.35 and 0.6 rad/frame
    this.spinVelocity = Math.random() * 0.25 + 0.45;
    this.lastTickIndex = -1;

    this.animate();
  }

  animate() {
    if (!this.isSpinning) return;

    this.currentAngle += this.spinVelocity;
    this.currentAngle = this.currentAngle % (2 * Math.PI);

    // Apply friction to slow down gradually
    this.spinVelocity *= this.friction;

    // Calculate current slice under top pointer (top is at -PI/2)
    const numSlices = this.names.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    const normalizedAngle = (1.5 * Math.PI - this.currentAngle + 2 * Math.PI) % (2 * Math.PI);
    const currentSliceIndex = Math.floor(normalizedAngle / sliceAngle);

    // Sound tick on passing slice
    if (currentSliceIndex !== this.lastTickIndex) {
      this.lastTickIndex = currentSliceIndex;
      if (window.soundEngine) {
        soundEngine.playTick(1.0 + (this.spinVelocity * 0.5));
      }
    }

    this.draw();

    // Check if stopped
    if (this.spinVelocity < 0.002) {
      this.isSpinning = false;
      this.spinVelocity = 0;
      this.draw();

      const winnerName = this.names[currentSliceIndex];
      if (this.onFinishCallback) {
        this.onFinishCallback(winnerName, currentSliceIndex);
      }
      return;
    }

    requestAnimationFrame(() => this.animate());
  }
}
