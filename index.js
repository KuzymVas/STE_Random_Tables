/*
 * This file is part of Random Table Extension for SillyTavern.
 *
 * Random Table Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Random Table Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Random Table Extension.  If not, see <https://www.gnu.org/licenses/>.
 */

import { getContext, extension_settings, renderExtensionTemplateAsync, writeExtensionField  } from '../../../extensions.js';
import { RandomTable } from './RandomTable.js';
import { ReferenceResolver } from './ReferenceResolver.js';
export { MODULE_NAME };

const MODULE_NAME = 'random-table';

function registerRandomTableTool() {
    try {
        const { registerFunctionTool } = getContext();
        if (!registerFunctionTool) {
            console.debug('Random Table: function tools are not supported');
            return;
        }

        // Create tables with weights and references
        const tablesMap = {
            greetings: new RandomTable('greetings', [
                { value: "Hello", weight: 1 },
                { value: "Hi", weight: 1 },
                { value: "Hey, ${adjective}", weight: 2 }, // Reference to adjectives
                { value: "Howdy", weight: 1 },
            ]),
            colors: new RandomTable('colors', [
                { value: "Red", weight: 1 },
                { value: "Blue", weight: 1 },
                { value: "Green", weight: 1 },
                { value: "Yellow", weight: 1 },
            ]),
            adjectives: new RandomTable('adjectives', [
                { value: "beautiful", weight: 1 },
                { value: "wonderful", weight: 1 },
                { value: "amazing ${color} thing", weight: 1 }, // Reference to colors
            ]),
        };

        const resolver = new ReferenceResolver(tablesMap);

        // Update enum and description to include adjectives
        const randomTableSchema = Object.freeze({
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                table_name: {
                    type: 'string',
                    description: 'Name of table to select from. Valid tables: "greetings", "colors", "adjectives"',
                    enum: ["greetings", "colors", "adjectives"]
                }
            },
            required: ['table_name']
        });

        registerFunctionTool({
            name: 'RandomTable',
            displayName: 'Random Table',
            description: 'Selects random option from predefined table',
            parameters: randomTableSchema,
            action: async (args) => {
                const table = tablesMap[args.table_name];
                if (!table) {
                    return `Error: Table '${args.table_name}' not found`;
                }
                
                const value = table.getRandomValue();
                return resolver.resolve(value);
            },
            formatMessage: () => '',
        });
    } catch (error) {
        console.error('Random Table: Error registering function tools', error);
    }
}

jQuery(async () => {
    registerRandomTableTool();
    const settingsHtml = $(await renderExtensionTemplateAsync('random-table', 'dropdown'));
});
