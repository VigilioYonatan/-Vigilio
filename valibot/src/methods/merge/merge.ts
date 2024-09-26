import { object, type ObjectOutput, type ObjectSchema } from "../../schemas";
import type { BaseSchema, ErrorMessage, Pipe } from "../../types";
import { getRestAndDefaultArgs } from "../../utils";
import type { MergeObjects } from "./types.js";

/**
 * Object schemas type.
 */
type ObjectSchemas = [
    ObjectSchema<any, any>,
    ObjectSchema<any, any>,
    ...ObjectSchema<any, any>[]
];

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TSchemas extends ObjectSchemas>(
    schemas: TSchemas,
    pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, undefined>>
): ObjectSchema<MergeObjects<TSchemas>>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<TSchemas extends ObjectSchemas>(
    schemas: TSchemas,
    error?: ErrorMessage,
    pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, undefined>>
): ObjectSchema<MergeObjects<TSchemas>>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<
    TSchemas extends ObjectSchemas,
    TRest extends BaseSchema | undefined
>(
    schemas: TSchemas,
    rest: TRest,
    pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchema<MergeObjects<TSchemas>, TRest>;

/**
 * Merges the entries of multiple object schemas. Subsequent object entries
 * overwrite the previous ones.
 *
 * @param schemas The schemas to be merged.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function merge<
    TSchemas extends ObjectSchemas,
    TRest extends BaseSchema | undefined
>(
    schemas: TSchemas,
    rest: TRest,
    error?: ErrorMessage,
    pipe?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchema<MergeObjects<TSchemas>, TRest>;

export function merge<
    TSchemas extends ObjectSchemas,
    TRest extends BaseSchema | undefined = undefined
>(
    schemas: TSchemas,
    arg2?:
        | Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
        | ErrorMessage
        | TRest,
    arg3?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>> | ErrorMessage,
    arg4?: Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
): ObjectSchema<MergeObjects<TSchemas>, TRest> {
    // Get rest, error and pipe argument
    const [rest, error, pipe] = getRestAndDefaultArgs<
        TRest,
        Pipe<ObjectOutput<MergeObjects<TSchemas>, TRest>>
    >(arg2, arg3, arg4);

    // Create and return object schema
    return object(
        schemas.reduce(
            (entries, schema) => ({ ...entries, ...schema.entries }),
            {}
        ) as MergeObjects<TSchemas>,
        rest,
        error,
        pipe
    );
}
