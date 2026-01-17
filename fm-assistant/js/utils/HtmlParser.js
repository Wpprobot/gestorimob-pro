/**
 * HTML PARSER UTILITY
 * Parses HTML exports from Football Manager
 */

export class HtmlParser {
  /**
   * Parse an HTML string from FM export
   * @param {string} htmlContent 
   * @returns {Object} Parsed data
   */
  static parse(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Determine type of export based on table headers
    const table = doc.querySelector('table');
    if (!table) {
      throw new Error('Nenhuma tabela encontrada no arquivo HTML.');
    }

    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    
    if (this.isSquadView(headers)) {
      return { type: 'squad', data: this.parseTable(table) };
    } else if (this.isScheduleView(headers)) {
      return { type: 'schedule', data: this.parseTable(table) };
    } else {
      return { type: 'unknown', data: this.parseTable(table) };
    }
  }

  /**
   * Check if headers match Squad View
   */
  static isSquadView(headers) {
    const keywords = ['Pos', 'Nome', 'Idade', 'Clube', 'Valor', 'Salário', 'Moral'];
    // Check if at least 3 keywords exist
    return keywords.filter(k => headers.some(h => h.includes(k))).length >= 3;
  }

  /**
   * Check if headers match Schedule View
   */
  static isScheduleView(headers) {
    const keywords = ['Data', 'Hora', 'Adversário', 'Local', 'Competição', 'Res'];
    return keywords.filter(k => headers.some(h => h.includes(k))).length >= 3;
  }

  /**
   * Parse generic table data
   */
  static parseTable(table) {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Skip header

    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData = {};
      
      cells.forEach((cell, index) => {
        if (headers[index]) {
          // Clean up text
          let text = cell.textContent.trim();
          // Try to convert numbers
          if (!isNaN(text) && text !== '') {
            // Keep as string if it looks like a date or ID, otherwise number
            // For simplicity, we'll keep mostly strings or basic parsing
          }
          rowData[headers[index]] = text;
        }
      });
      
      return rowData;
    }).filter(row => Object.keys(row).length > 0); // Remove empty rows
  }
}

export default HtmlParser;
