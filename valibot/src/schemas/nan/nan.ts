import type { BaseSchema, ErrorMessage } from "../../types";
import { getSchemaIssues, getOutput } from "../../utils";

/**
 * NaN schema type.
 */
export type NanSchema<TOutput = number> = BaseSchema<number, TOutput> & {
    type: "nan";
};

/**
 * Creates a NaN schema.
 *
 * @param error The error message.
 *
 * @returns A NaN schema.
 */
export function nan(error?: ErrorMessage): NanSchema {
    return {
        /**
         * The schema type.
         */
        type: "nan",

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
            if (!Number.isNaN(input)) {
                return getSchemaIssues(
                    info,
                    "type",
                    "nan",
                    error || "Este campo es obligatorio.",
                    input
                );
            }

            // Return input as output
            return getOutput(input as number);
        },
    };
}
