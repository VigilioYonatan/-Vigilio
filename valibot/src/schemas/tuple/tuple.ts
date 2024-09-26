import type { BaseSchema, ErrorMessage, Issues, Pipe } from "../../types";
import {
    executePipe,
    getIssues,
    getRestAndDefaultArgs,
    getSchemaIssues,
} from "../../utils";
import type { TupleOutput, TupleInput, TuplePathItem } from "./types.js";

/**
 * Tuple shape type.
 */
export type TupleItems = [BaseSchema, ...BaseSchema[]];

/**
 * Tuple schema type.
 */
export type TupleSchema<
    TItems extends TupleItems,
    TRest extends BaseSchema | undefined = undefined,
    TOutput = TupleOutput<TItems, TRest>
> = BaseSchema<TupleInput<TItems, TRest>, TOutput> & {
    type: "tuple";
    items: TItems;
    rest: TRest;
};

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TItems extends TupleItems>(
    items: TItems,
    pipe?: Pipe<TupleOutput<TItems, undefined>>
): TupleSchema<TItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TItems extends TupleItems>(
    items: TItems,
    error?: ErrorMessage,
    pipe?: Pipe<TupleOutput<TItems, undefined>>
): TupleSchema<TItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
    TItems extends TupleItems,
    TRest extends BaseSchema | undefined
>(
    items: TItems,
    rest: TRest,
    pipe?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
    TItems extends TupleItems,
    TRest extends BaseSchema | undefined
>(
    items: TItems,
    rest: TRest,
    error?: ErrorMessage,
    pipe?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest>;

export function tuple<
    TItems extends TupleItems,
    TRest extends BaseSchema | undefined = undefined
>(
    items: TItems,
    arg2?: Pipe<TupleOutput<TItems, TRest>> | ErrorMessage | TRest,
    arg3?: Pipe<TupleOutput<TItems, TRest>> | ErrorMessage,
    arg4?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest> {
    // Get rest, error and pipe argument
    const [rest, error, pipe] = getRestAndDefaultArgs<
        TRest,
        Pipe<TupleOutput<TItems, TRest>>
    >(arg2, arg3, arg4);

    // Create and return tuple schema
    return {
        /**
         * The schema type.
         */
        type: "tuple",

        /**
         * The items schema.
         */
        items,

        /**
         * The rest schema.
         */
        rest,

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
            if (!Array.isArray(input) || items.length > input.length) {
                return getSchemaIssues(
                    info,
                    "type",
                    "tuple",
                    error || "Este campo es obligatorio.",
                    input
                );
            }

            // Create issues and output
            let issues: Issues | undefined;
            const output: any[] = [];

            // Parse schema of each tuple item
            for (let key = 0; key < items.length; key++) {
                const value = input[key];
                const result = items[key]._parse(value, info);

                // If there are issues, capture them
                if (result.issues) {
                    // Create tuple path item
                    const pathItem: TuplePathItem = {
                        type: "tuple",
                        input: input as [any, ...any[]],
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

                    // Otherwise, add item to tuple
                } else {
                    output[key] = result.output;
                }
            }

            // If necessary parse schema of each rest item
            if (rest && !(info?.abortEarly && issues)) {
                for (let key = items.length; key < input.length; key++) {
                    const value = input[key];
                    const result = rest._parse(value, info);

                    // If there are issues, capture them
                    if (result.issues) {
                        // Create tuple path item
                        const pathItem: TuplePathItem = {
                            type: "tuple",
                            input: input as [any, ...any[]],
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

                        // Otherwise, add item to tuple
                    } else {
                        output[key] = result.output;
                    }
                }
            }

            // Return issues or pipe result
            return issues
                ? getIssues(issues)
                : executePipe(
                      output as TupleOutput<TItems, TRest>,
                      pipe,
                      info,
                      "tuple"
                  );
        },
    };
}
