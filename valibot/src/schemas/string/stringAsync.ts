import type { BaseSchemaAsync, ErrorMessage, PipeAsync } from "../../types";
import { executePipeAsync, getDefaultArgs, getSchemaIssues } from "../../utils";

/**
 * String schema async type.
 */
export type StringSchemaAsync<TOutput = string> = BaseSchemaAsync<
    string,
    TOutput
> & {
    type: "string";
};

/**
 * Creates an async string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(pipe?: PipeAsync<string>): StringSchemaAsync;

/**
 * Creates an async string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(
    error?: ErrorMessage,
    pipe?: PipeAsync<string>
): StringSchemaAsync;

export function stringAsync(
    arg1?: ErrorMessage | PipeAsync<string>,
    arg2?: PipeAsync<string>
): StringSchemaAsync {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg1, arg2);

    // Create and return async string schema
    return {
        /**
         * The schema type.
         */
        type: "string",

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
            if (typeof input !== "string") {
                return getSchemaIssues(
                    info,
                    "type",
                    "string",
                    error || "Invalid type",
                    input
                );
            }

            // Execute pipe and return result
            return executePipeAsync(input, pipe, info, "string");
        },
    };
}
