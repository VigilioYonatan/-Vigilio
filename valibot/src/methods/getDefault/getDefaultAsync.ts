import type { BaseSchemaAsync, Output } from "../../types";
import type { SchemaWithMaybeDefault } from "./getDefault.js";
import type { DefaultValue } from "./types.js";

/**
 * Schema with maybe default async type.
 */
export type SchemaWithMaybeDefaultAsync<
    TSchema extends BaseSchemaAsync = BaseSchemaAsync
> = TSchema & { getDefault?: () => Promise<Output<TSchema>> };

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
export async function getDefaultAsync<
    TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync
>(schema: TSchema): Promise<DefaultValue<TSchema>> {
    return schema.getDefault?.();
}
