/**
 * IMAGE GENERATOR UTILITY
 * Generate AI avatars for assistant
 */

export class ImageGenerator {
  /**
   * Generate assistant avatar using canvas
   */
  static async generateAvatar(profile) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(0, '#00a859');
      gradient.addColorStop(1, '#008045');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);

      // Initials circle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(200, 200, 120, 0, Math.PI * 2);
      ctx.fill();

      // Initials text
      const initials = this.getInitials(profile.name);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 120px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 200, 210);

      // Role text
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText('ASSISTENTE TÉCNICO', 200, 350);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    });
  }

  /**
   * Get initials from name
   */
  static getInitials(name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Generate random geometric avatar
   */
  static async generateGeometricAvatar(seed = Math.random()) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      // Random colors based on seed
      const hue = Math.floor(seed * 360);
      const color1 = `hsl(${hue}, 70%, 50%)`;
      const color2 = `hsl(${(hue + 60) % 360}, 70%, 50%)`;

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);

      // Random geometric shapes
      const shapes = Math.floor(seed * 5) + 3;
      ctx.globalAlpha = 0.3;
      
      for (let i = 0; i < shapes; i++) {
        const shapeSeed = (seed + i * 0.1) % 1;
        const x = shapeSeed * 400;
        const y = ((seed * 7 + i * 0.3) % 1) * 400;
        const size = 50 + shapeSeed * 100;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + shapeSeed * 0.3})`;
        
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x - size/2, y - size/2, size, size);
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    });
  }
}

export default ImageGenerator;
