import type { BaseSchemaAsync, ErrorMessage, PipeAsync } from "../../types";
import { executePipeAsync, getDefaultArgs, getSchemaIssues } from "../../utils";

/**
 * Number schema async type.
 */
export type NumberSchemaAsync<TOutput = number> = BaseSchemaAsync<
    number,
    TOutput
> & {
    type: "number";
};

/**
 * Creates an async number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(pipe?: PipeAsync<number>): NumberSchemaAsync;

/**
 * Creates an async number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(
    error?: ErrorMessage,
    pipe?: PipeAsync<number>
): NumberSchemaAsync;

export function numberAsync(
    arg1?: ErrorMessage | PipeAsync<number>,
    arg2?: PipeAsync<number>
): NumberSchemaAsync {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg1, arg2);

    // Create and return async number schema
    return {
        /**
         * The schema type.
         */
        type: "number",

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
            if (typeof input !== "number" || isNaN(input)) {
                return getSchemaIssues(
                    info,
                    "type",
                    "number",
                    error || "Este campo es obligatorio.",
                    input
                );
            }

            // Execute pipe and return result
            return executePipeAsync(input, pipe, info, "number");
        },
    };
}
