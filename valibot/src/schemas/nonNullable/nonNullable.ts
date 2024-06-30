import type { BaseSchema, ErrorMessage, Input, Output } from "../../types";
import { getSchemaIssues } from "../../utils";

/**
 * Non nullable type.
 */
export type NonNullable<T> = T extends null ? never : T;

/**
 * Non nullable schema type.
 */
export type NonNullableSchema<
    TWrapped extends BaseSchema,
    TOutput = NonNullable<Output<TWrapped>>
> = BaseSchema<NonNullable<Input<TWrapped>>, TOutput> & {
    type: "non_nullable";
    wrapped: TWrapped;
};

/**
 * Creates a non nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non nullable schema.
 */
export function nonNullable<TWrapped extends BaseSchema>(
    wrapped: TWrapped,
    error?: ErrorMessage
): NonNullableSchema<TWrapped> {
    return {
        /**
         * The schema type.
         */
        type: "non_nullable",

        /**
         * The wrapped schema.
         */
        wrapped,

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
            // Allow `null` values not to pass
            if (input === null) {
                return getSchemaIssues(
                    info,
                    "type",
                    "non_nullable",
                    error || "Este campo debe ser no nullable.",
                    input
                );
            }

            // Return result of wrapped schema
            return wrapped._parse(input, info);
        },
    };
}
