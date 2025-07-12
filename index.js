import { getContext } from '../../../extensions.js';
export { MODULE_NAME };

const MODULE_NAME = 'random-table';

function registerRandomTableTool() {
    try {
        const { registerFunctionTool } = getContext();
        if (!registerFunctionTool) {
            console.debug('Random Table: function tools are not supported');
            return;
        }

        const randomTableSchema = Object.freeze({
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                table_name: {
                    type: 'string',
                    description: 'Name of table to select from. Valid tables: "greetings", "colors"',
                    enum: ["greetings", "colors"]
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
                const tables = {
                    greetings: ["Hello", "Hi", "Hey", "Howdy"],
                    colors: ["Red", "Blue", "Green", "Yellow"]
                };
                const options = tables[args.table_name] || ["Option not found"];
                return options[Math.floor(Math.random() * options.length)];
            },
            formatMessage: () => '',
        });
    } catch (error) {
        console.error('Random Table: Error registering function tools', error);
    }
}

jQuery(() => {
    registerRandomTableTool();
});
