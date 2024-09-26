import type { BaseSchema, ErrorMessage, Pipe } from "../../types";
import { executePipe, getDefaultArgs, getSchemaIssues } from "../../utils";

/**
 * Number schema type.
 */
export type NumberSchema<TOutput = number> = BaseSchema<number, TOutput> & {
    type: "number";
};

/**
 * Creates a number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(pipe?: Pipe<number>): NumberSchema;

/**
 * Creates a number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(error?: ErrorMessage, pipe?: Pipe<number>): NumberSchema;

export function number(
    arg1?: ErrorMessage | Pipe<number>,
    arg2?: Pipe<number>
): NumberSchema {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg1, arg2);

    // Create and return number schema
    return {
        /**
         * The schema type.
         */
        type: "number",

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
            return executePipe(input, pipe, info, "number");
        },
    };
}
