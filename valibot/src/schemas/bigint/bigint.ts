import type { BaseSchema, ErrorMessage, Pipe } from "../../types";
import { executePipe, getDefaultArgs, getSchemaIssues } from "../../utils";

/**
 * Bigint schema type.
 */
export type BigintSchema<TOutput = bigint> = BaseSchema<bigint, TOutput> & {
    type: "bigint";
};

/**
 * Creates a bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(pipe?: Pipe<bigint>): BigintSchema;

/**
 * Creates a bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(error?: ErrorMessage, pipe?: Pipe<bigint>): BigintSchema;

export function bigint(
    arg1?: ErrorMessage | Pipe<bigint>,
    arg2?: Pipe<bigint>
): BigintSchema {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg1, arg2);

    // Create and return bigint schema
    return {
        /**
         * The schema type.
         */
        type: "bigint",

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
            if (typeof input !== "bigint") {
                return getSchemaIssues(
                    info,
                    "type",
                    "bigint",
                    error || "Este campo solo permite números grandes (bigint).",
                    input
                );
            }

            // Execute pipe and return result
            return executePipe(input, pipe, info, "bigint");
        },
    };
}
