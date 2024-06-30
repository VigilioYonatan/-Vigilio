import type { BaseSchema, ErrorMessage } from "../../types";
import { getSchemaIssues, getOutput } from "../../utils";

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
    type: "void";
};

/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
export function void_(error?: ErrorMessage): VoidSchema {
    return {
        /**
         * The schema type.
         */
        type: "void",

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
            if (typeof input !== "undefined") {
                return getSchemaIssues(
                    info,
                    "type",
                    "void",
                    error || "Este campo no debe contener ningún valor.",
                    input
                );
            }

            // Return input as output
            return getOutput(input);
        },
    };
}

/**
 * See {@link void_}
 *
 * @deprecated Use `void_` instead.
 */
export const voidType = void_;
