import type { BaseSchemaAsync, ErrorMessage, PipeAsync } from "../../types";
import { executePipeAsync, getDefaultArgs, getSchemaIssues } from "../../utils";

/**
 * Blob schema async type.
 */
export type BlobSchemaAsync<TOutput = Blob> = BaseSchemaAsync<Blob, TOutput> & {
    type: "blob";
};

/**
 * Creates an async blob schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(pipe?: PipeAsync<Blob>): BlobSchemaAsync;

/**
 * Creates an async blob schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(
    error?: ErrorMessage,
    pipe?: PipeAsync<Blob>
): BlobSchemaAsync;

export function blobAsync(
    arg1?: ErrorMessage | PipeAsync<Blob>,
    arg2?: PipeAsync<Blob>
): BlobSchemaAsync {
    // Get error and pipe argument
    const [error, pipe] = getDefaultArgs(arg1, arg2);

    // Create and return async blob schema
    return {
        /**
         * The schema type.
         */
        type: "blob",

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
            if (!(input instanceof Blob)) {
                return getSchemaIssues(
                    info,
                    "type",
                    "blob",
                    error || "Este campo es obligatorio.",
                    input
                );
            }

            // Execute pipe and return result
            return executePipeAsync(input, pipe, info, "blob");
        },
    };
}
