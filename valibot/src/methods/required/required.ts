import {
    nonOptional,
    type NonOptionalSchema,
    object,
    type ObjectEntries,
    type ObjectOutput,
    type ObjectSchema,
} from "../../schemas";
import type { BaseSchema, ErrorMessage, Pipe } from "../../types";
import { getRestAndDefaultArgs } from "../../utils";

/**
 * Required object schema type.
 */
type Required<TEntries extends ObjectEntries> = {
    [TKey in keyof TEntries]: NonOptionalSchema<TEntries[TKey]>;
};

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<TSchema extends ObjectSchema<any, any>>(
    schema: TSchema,
    pipe?: Pipe<ObjectOutput<Required<TSchema["entries"]>, undefined>>
): ObjectSchema<Required<TSchema["entries"]>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<TSchema extends ObjectSchema<any, any>>(
    schema: TSchema,
    error?: ErrorMessage,
    pipe?: Pipe<ObjectOutput<Required<TSchema["entries"]>, undefined>>
): ObjectSchema<Required<TSchema["entries"]>>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<
    TSchema extends ObjectSchema<any, any>,
    TRest extends BaseSchema | undefined
>(
    schema: TSchema,
    rest: TRest,
    pipe?: Pipe<ObjectOutput<Required<TSchema["entries"]>, TRest>>
): ObjectSchema<Required<TSchema["entries"]>, TRest>;

/**
 * Creates an object schema consisting of all properties of an existing object
 * schema set to none optional.
 *
 * @param schema The affected schema.
 * @param rest The object rest.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An object schema.
 */
export function required<
    TSchema extends ObjectSchema<any, any>,
    TRest extends BaseSchema | undefined
>(
    schema: TSchema,
    rest: TRest,
    error?: ErrorMessage,
    pipe?: Pipe<ObjectOutput<Required<TSchema["entries"]>, TRest>>
): ObjectSchema<Required<TSchema["entries"]>, TRest>;

export function required<
    TSchema extends ObjectSchema<any, any>,
    TRest extends BaseSchema | undefined = undefined
>(
    schema: TSchema,
    arg2?:
        | Pipe<ObjectOutput<Required<TSchema["entries"]>, TRest>>
        | ErrorMessage
        | TRest,
    arg3?:
        | Pipe<ObjectOutput<Required<TSchema["entries"]>, TRest>>
        | ErrorMessage,
    arg4?: Pipe<ObjectOutput<Required<TSchema["entries"]>, TRest>>
): ObjectSchema<Required<TSchema["entries"]>, TRest> {
    // Get rest, error and pipe argument
    const [rest, error, pipe] = getRestAndDefaultArgs<
        TRest,
        Pipe<ObjectOutput<Required<TSchema["entries"]>, TRest>>
    >(arg2, arg3, arg4);

    // Create and return object schema
    return object(
        Object.entries(schema.entries).reduce(
            (entries, [key, schema]) => ({
                ...entries,
                [key]: nonOptional(schema as BaseSchema),
            }),
            {}
        ) as Required<TSchema["entries"]>,
        rest,
        error,
        pipe
    );
}
