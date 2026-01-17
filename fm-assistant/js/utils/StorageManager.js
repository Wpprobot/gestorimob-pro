/**
 * STORAGE MANAGER UTILITY
 * Manage local storage for persistence
 */

export class StorageManager {
  static KEYS = {
    ASSISTANT_PROFILE: 'fm_assistant_profile',
    ANALYSES: 'fm_assistant_analyses',
    SQUAD_DATA: 'fm_assistant_squad',
    SETTINGS: 'fm_assistant_settings'
  };

  /**
   * Save data to localStorage
   */
  static save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  static load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all app data
   */
  static clearAll() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Save analysis
   */
  static saveAnalysis(analysis) {
    const analyses = this.load(this.KEYS.ANALYSES, []);
    analyses.unshift({
      ...analysis,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 analyses
    if (analyses.length > 50) {
      analyses.length = 50;
    }
    
    return this.save(this.KEYS.ANALYSES, analyses);
  }

  /**
   * Get all analyses
   */
  static getAnalyses() {
    return this.load(this.KEYS.ANALYSES, []);
  }

  /**
   * Get analysis by ID
   */
  static getAnalysis(id) {
    const analyses = this.getAnalyses();
    return analyses.find(a => a.id === id);
  }

  /**
   * Delete analysis
   */
  static deleteAnalysis(id) {
    const analyses = this.getAnalyses();
    const filtered = analyses.filter(a => a.id !== id);
    return this.save(this.KEYS.ANALYSES, filtered);
  }
}

export default StorageManager;
