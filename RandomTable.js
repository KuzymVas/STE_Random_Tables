/**
 * Represents a mutable weighted random table
 */
export class RandomTable {
    /**
     * Create a new RandomTable
     * @param {string} name - Name of the table
     * @param {Array<{value: string, weight: number}>} rows - Initial table rows
     */
    constructor(name, rows = []) {
        this.name = name;
        this.rows = [];
        this.cumulativeWeights = [];
        this.totalWeight = 0;
        
        // Add initial rows
        rows.forEach(row => this.addRow(row));
    }

    /**
     * Add a new row to the table
     * @param {object} row - Row object {value: string, weight: number}
     */
    addRow(row) {
        this.rows.push(row);
        this._recalculate();
    }

    /**
     * Remove a row by index
     * @param {number} index - Index of row to remove
     */
    removeRow(index) {
        if (index >= 0 && index < this.rows.length) {
            this.rows.splice(index, 1);
            this._recalculate();
        }
    }

    /**
     * Update row at index
     * @param {number} index - Row index
     * @param {object} newRow - New row data {value, weight}
     */
    updateRow(index, newRow) {
        if (index >= 0 && index < this.rows.length) {
            this.rows[index] = newRow;
            this._recalculate();
        }
    }

    /**
     * Recalculate cumulative weights
     * @private
     */
    _recalculate() {
        this.totalWeight = this.rows.reduce((sum, row) => sum + row.weight, 0);
        this.cumulativeWeights = [];
        let cumulative = 0;
        
        this.rows.forEach(row => {
            cumulative += row.weight;
            this.cumulativeWeights.push(cumulative);
        });
    }

    /**
     * Get random value based on weights
     * @returns {string} Selected value
     */
    getRandomValue() {
        if (this.rows.length === 0) return null;
        if (this.rows.length === 1) return this.rows[0].value;
        
        const random = Math.random() * this.totalWeight;
        for (let i = 0; i < this.cumulativeWeights.length; i++) {
            if (random < this.cumulativeWeights[i]) {
                return this.rows[i].value;
            }
        }
        
        return this.rows[this.rows.length - 1].value;
    }
}