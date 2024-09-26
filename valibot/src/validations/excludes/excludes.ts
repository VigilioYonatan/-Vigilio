import type { ErrorMessage, PipeResult } from "../../types.js";
import { getOutput, getPipeIssues } from "../../utils";

export function excludes<TInput extends string>(
    requirement: string,
    error?: ErrorMessage
): (input: TInput) => PipeResult<TInput>;

export function excludes<TInput extends TItem[], TItem>(
    requirement: TItem,
    error?: ErrorMessage
): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation function that validates the content of a string or array.
 *
 * @param requirement The content to be excluded.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function excludes<TInput extends string | TItem[], TItem>(
    requirement: string | TItem,
    error?: ErrorMessage
) {
    return (input: TInput): PipeResult<TInput> =>
        input.includes(requirement as any)
            ? getPipeIssues(
                  "excludes",
                  error || `Este campo no debe incluir ${requirement}.`,
                  input
              )
            : getOutput(input);
}
