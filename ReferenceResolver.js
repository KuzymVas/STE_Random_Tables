/**
 * Resolves references in table values using ${table_name} syntax
 */
export class ReferenceResolver {
    /**
     * Create a resolver
     * @param {Object<string, RandomTable>} tables - Map of table names to RandomTable instances
     * @param {number} [maxDepth=5] - Maximum recursion depth
     */
    constructor(tables, maxDepth = 5) {
        this.tables = tables;
        this.maxDepth = maxDepth;
    }

    /**
     * Resolve references in a string
     * @param {string} input - Input string containing references
     * @param {number} [depth=0] - Current recursion depth
     * @returns {string} Resolved string
     */
    resolve(input, depth = 0) {
        if (depth > this.maxDepth) {
            return input; // Prevent infinite recursion
        }

        // Match references with ${table_name} syntax
        return input.replace(/\$\{([^}]+)\}/g, (match, tableName) => {
            const table = this.tables[tableName.trim()];
            
            if (!table) {
                console.warn(`Resolver: Table '${tableName}' not found`);
                return match; // Return original reference
            }
            
            // Resolve value from table
            const resolvedValue = table.getRandomValue();
            
            // Recursively resolve references in resolved value
            return this.resolve(resolvedValue, depth + 1);
        });
    }
}