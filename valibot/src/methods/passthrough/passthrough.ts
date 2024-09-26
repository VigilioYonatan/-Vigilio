import type {
    ObjectEntries,
    ObjectSchema,
} from "../../schemas/object/index.ts";
import { getOutput } from "../../utils";

/**
 * Creates an object schema that passes unknown keys.
 *
 * @deprecated Use `object` with `rest` argument instead.
 *
 * @param schema A object schema.
 *
 * @returns A object schema.
 */
export function passthrough<
    TSchema extends ObjectSchema<ObjectEntries, undefined>
>(schema: TSchema): TSchema {
    return {
        ...schema,

        /**
         * Parses unknown input based on its schema.
         *
         * @param input The input to be parsed.
         * @param info The parse info.
         *
         * @returns The parsed output.
         */
        _parse(input, info) {
            const result = schema._parse(input, info);
            return !result.issues
                ? getOutput({ ...(input as object), ...result.output })
                : result;
        },
    };
}
