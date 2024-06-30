import type { BaseSchema, ErrorMessage, Issues, Pipe } from "../../types";
import {
    executePipe,
    getDefaultArgs,
    getIssues,
    getSchemaIssues,
} from "../../utils";
import type { SetInput, SetOutput, SetPathItem } from "./types.js";

/**
 * Set schema type.
 */
export type SetSchema<
    TValue extends BaseSchema,
    TOutput = SetOutput<TValue>
> = BaseSchema<SetInput<TValue>, TOutput> & {
    type: "set";
    value: TValue;
};

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
    value: TValue,
    pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
    value: TValue,
    error?: ErrorMessage,
    pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

export function set<TValue extends BaseSchema>(
    value: TValue,
    arg2?: Pipe<SetOutput<TValue>> | ErrorMessage,
    arg3?: Pipe<SetOutput<TValue>>
): SetSchema<TValue> {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg2, arg3);

    // Create and return set schema
    return {
        /**
         * The schema type.
         */
        type: "set",

        /**
         * The value schema.
         */
        value,

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
            if (!(input instanceof Set)) {
                return getSchemaIssues(
                    info,
                    "type",
                    "set",
                    error || "Invalid type",
                    input
                );
            }

            // Create key, output and issues
            let key = 0;
            let issues: Issues | undefined;
            const output: SetOutput<TValue> = new Set();

            // Parse each value by schema
            for (const inputValue of Array.from(input)) {
                // Get parse result of input value
                const result = value._parse(inputValue, info);

                // If there are issues, capture them
                if (result.issues) {
                    // Create set path item
                    const pathItem: SetPathItem = {
                        type: "set",
                        input,
                        key,
                        value: inputValue,
                    };

                    // Add modified result issues to issues
                    for (const issue of result.issues) {
                        if (issue.path) {
                            issue.path.unshift(pathItem);
                        } else {
                            issue.path = [pathItem];
                        }
                        issues?.push(issue);
                    }
                    if (!issues) {
                        issues = result.issues;
                    }

                    // If necessary, abort early
                    if (info?.abortEarly) {
                        break;
                    }

                    // Otherwise, add item to set
                } else {
                    output.add(result.output);
                }

                // Increment key
                key++;
            }

            // Return issues or pipe result
            return issues
                ? getIssues(issues)
                : executePipe(output, pipe, info, "set");
        },
    };
}
