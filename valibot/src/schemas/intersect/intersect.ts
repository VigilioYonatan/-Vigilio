import type { BaseSchema, Issues } from "../../types";
import { getIssues, getOutput, getSchemaIssues } from "../../utils";
import type { IntersectInput, IntersectOutput } from "./types.js";
import { mergeOutputs } from "./utils/index.js";

/**
 * Intersect options type.
 */
export type IntersectOptions = [BaseSchema, BaseSchema, ...BaseSchema[]];

/**
 * Intersect schema type.
 */
export type IntersectSchema<
    TOptions extends IntersectOptions,
    TOutput = IntersectOutput<TOptions>
> = BaseSchema<IntersectInput<TOptions>, TOutput> & {
    type: "intersect";
    options: TOptions;
};

/**
 * Creates an intersect schema.
 *
 * @param options The intersect options.
 * @param error The error message.
 *
 * @returns An intersect schema.
 */
export function intersect<TOptions extends IntersectOptions>(
    options: TOptions,
    error?: string
): IntersectSchema<TOptions> {
    return {
        /**
         * The schema type.
         */
        type: "intersect",

        /**
         * The intersect options.
         */
        options,

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
            // Create issues and outputs
            let issues: Issues | undefined;
            let outputs: [any, ...any] | undefined;

            // Parse schema of each option
            for (const schema of options) {
                const result = schema._parse(input, info);

                // If there are issues, capture them
                if (result.issues) {
                    if (issues) {
                        for (const issue of result.issues) {
                            issues.push(issue);
                        }
                    } else {
                        issues = result.issues;
                    }

                    // If necessary, abort early
                    if (info?.abortEarly) {
                        break;
                    }

                    // Otherwise, add output to list
                } else {
                    if (outputs) {
                        outputs.push(result.output);
                    } else {
                        outputs = [result.output];
                    }
                }
            }

            // If there are issues, return them
            if (issues) {
                return getIssues(issues);
            }

            // Create output
            let output = outputs![0];

            // Merge outputs into one final output
            for (let index = 1; index < outputs!.length; index++) {
                const result = mergeOutputs(output, outputs![index]);

                // If outputs can't be merged, return issues
                if (result.invalid) {
                    return getSchemaIssues(
                        info,
                        "type",
                        "intersect",
                        error ||"Este campo es obligatorio.",
                        input
                    );
                }

                // Otherwise, set merged output
                output = result.output;
            }

            // Return merged output
            return getOutput(output);
        },
    };
}

/**
 * See {@link intersect}
 *
 * @deprecated Use `intersect` instead.
 */
export const intersection = intersect;
