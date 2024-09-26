import type {
    BaseSchema,
    ErrorMessage,
    Input,
    Issues,
    Output,
    Pipe,
} from "../../types";
import {
    executePipe,
    getDefaultArgs,
    getIssues,
    getSchemaIssues,
} from "../../utils";
import type { ArrayPathItem } from "./types.js";

/**
 * Array schema type.
 */
export type ArraySchema<
    TItem extends BaseSchema,
    TOutput = Output<TItem>[]
> = BaseSchema<Input<TItem>[], TOutput> & {
    type: "array";
    item: TItem;
};

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
    item: TItem,
    pipe?: Pipe<Output<TItem>[]>
): ArraySchema<TItem>;

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
    item: TItem,
    error?: ErrorMessage,
    pipe?: Pipe<Output<TItem>[]>
): ArraySchema<TItem>;

export function array<TItem extends BaseSchema>(
    item: TItem,
    arg2?: ErrorMessage | Pipe<Output<TItem>[]>,
    arg3?: Pipe<Output<TItem>[]>
): ArraySchema<TItem> {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg2, arg3);

    // Create and return array schema
    return {
        /**
         * The schema type.
         */
        type: "array",

        /**
         * The item schema.
         */
        item,

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
            if (!Array.isArray(input)) {
                return getSchemaIssues(
                    info,
                    "type",
                    "array",
                    error ||   "Este campo es obligatorio.",
                    input
                );
            }

            // Create issues and output
            let issues: Issues | undefined;
            const output: any[] = [];

            // Parse schema of each array item
            for (let key = 0; key < input.length; key++) {
                const value = input[key];
                const result = item._parse(value, info);

                // If there are issues, capture them
                if (result.issues) {
                    // Create array path item
                    const pathItem: ArrayPathItem = {
                        type: "array",
                        input,
                        key,
                        value,
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

                    // Otherwise, add item to array
                } else {
                    output.push(result.output);
                }
            }

            // Return issues or pipe result
            return issues
                ? getIssues(issues)
                : executePipe(output as Output<TItem>[], pipe, info, "array");
        },
    };
}
