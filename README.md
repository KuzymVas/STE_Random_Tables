# Random-Table

## What is it?
UI extension for https://github.com/SillyTavern  
See https://docs.sillytavern.app/for-contributors/writing-extensions/ for details

## What does it do?
Allows LLM to consult random tables via tool call. Tables can reference each other, allowing for more complex patterns, than just random selection. 

## How to install
Install via the built-in "Install Extension" tool inside your SillyTavern WebUI using a link:
```txt
https://github.com/KuzymVas/STE_Random_Tables
```

## How to use
### Via the function tool
Requires a compatible Chat Completion backend. See [Function Calling](https://docs.sillytavern.app/for-contributors/function-calling/) for more information.

## Table Syntax
Tables support references to other tables using `${table_name}` syntax. References are resolved recursively during roll execution.

### Format
- Each table entry contains:
  - `value`: String that may contain references
  - `weight`: Relative probability (higher = more likely)
- References format: `${table_name}`
- Resolution is depth-first

### Example
```javascript
// Character backgrounds table
backgrounds: new RandomTable('backgrounds', [
  { value: "Street urchin", weight: 2 },
  { value: "Noble heir", weight: 1 },
  { value: "Born in ${biomes} tribe", weight: 3 }  // References 'biomes' table
]),

// Biomes table
origins: new RandomTable('biomes', [
  { value: "desert", weight: 2 },
  { value: "mountain", weight: 1 },
  { value: "${forest types} forest", weight: 2 }  // Nested reference
]),

// Forest 'types' table
elementals: new RandomTable('forest types', [
  { value: "alpine", weight: 3 },
  { value: "tropical", weight: 2 }
])
```

**Possible resolution results:**
- "Street urchin"
- "Born in desert tribe"
- "Born in alpine forest tribe"

### Resolution Rules
1. References are replaced with random selections from target tables
2. Multiple references in one value are resolved independently
3. References aare only resolved up to the depth of 5
4. Missing tables return "[Reference Error]"


## License
This project is licensed under the GNU Affero General Public License v3.0.  
See the [LICENSE](./LICENSE.txt) file for details.
