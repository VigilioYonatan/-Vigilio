import type { BaseSchemaAsync, ErrorMessage } from "../../types";
import { getSchemaIssues, getOutput } from "../../utils";

/**
 * Symbol schema async type.
 */
export type SymbolSchemaAsync<TOutput = symbol> = BaseSchemaAsync<
    symbol,
    TOutput
> & {
    type: "symbol";
};

/**
 * Creates an async symbol schema.
 *
 * @param error The error message.
 *
 * @returns An async symbol schema.
 */
export function symbolAsync(error?: ErrorMessage): SymbolSchemaAsync {
    return {
        /**
         * The schema type.
         */
        type: "symbol",

        /**
         * Whether it's async.
         */
        async: true,

        /**
         * Parses unknown input based on its schema.
         *
         * @param input The input to be parsed.
         * @param info The parse info.
         *
         * @returns The parsed output.
         */
        async _parse(input, info) {
            // Check type of input
            if (typeof input !== "symbol") {
                return getSchemaIssues(
                    info,
                    "type",
                    "symbol",
                    error || "Invalid type",
                    input
                );
            }

            // Return input as output
            return getOutput(input);
        },
    };
}
