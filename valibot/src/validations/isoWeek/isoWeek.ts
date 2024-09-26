import { ISO_WEEK_REGEX } from "../../regex.js";
import type { ErrorMessage, PipeResult } from "../../types.js";
import { getOutput, getPipeIssues } from "../../utils";

/**
 * Creates a validation function that validates a week.
 *
 * Format: yyyy-Www
 *
 * Hint: The regex used cannot validate the maximum number of weeks based on
 * the year. For example, "2021W53" is valid even though the year 2021 has only
 * 52 weeks.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function isoWeek<TInput extends string>(error?: ErrorMessage) {
    return (input: TInput): PipeResult<TInput> =>
        !ISO_WEEK_REGEX.test(input)
            ? getPipeIssues("iso_week", error || "Semana no válida.", input)
            : getOutput(input);
}
