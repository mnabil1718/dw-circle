import z from "zod";

export const FilterSchema = z.object({
    limit: z.coerce.number().int().gte(1).optional(),
});

export type FilterType = z.infer<typeof FilterSchema>;

export function buildFilterQuery(filter: FilterType): { take: number } {
    const limit = filter.limit ?? 100;
    const take = Math.min(limit, 100);

    return { take };
}
