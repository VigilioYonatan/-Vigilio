import type { BaseSchema, ErrorMessage } from "../../types";
import { getSchemaIssues, getOutput } from "../../utils";

/**
 * Symbol schema type.
 */
export type SymbolSchema<TOutput = symbol> = BaseSchema<symbol, TOutput> & {
    type: "symbol";
};

/**
 * Creates a symbol schema.
 *
 * @param error The error message.
 *
 * @returns A symbol schema.
 */
export function symbol(error?: ErrorMessage): SymbolSchema {
    return {
        /**
         * The schema type.
         */
        type: "symbol",

        /**
         * Whether it's async.
         */
        async: false,

        /**
         * Parses unknown input based on its schema.
         *
         * @param input The input to be parsed.
         * @param info The parse info.
         *
         * @returns The parsed output.
         */
        _parse(input, info) {
            // Check type of input
            if (typeof input !== "symbol") {
                return getSchemaIssues(
                    info,
                    "type",
                    "symbol",
                    error || "Este campo es obligatorio.",
                    input
                );
            }

            // Return input as output
            return getOutput(input);
        },
    };
}
