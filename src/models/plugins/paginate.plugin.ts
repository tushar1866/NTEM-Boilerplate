import { Schema, Document, Query } from 'mongoose';

interface PaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    populate?: string;
}

interface PaginatedResult<T> {
    results: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

function paginate<T extends Document>(schema: Schema<T>) {
    schema.statics.paginate = async function (
        filter: Record<string, any>,
        options: PaginationOptions
    ): Promise<PaginatedResult<T>> {
        const { sortBy, populate } = options;
        let sort = '';
        if (sortBy) {
            const sortingCriteria: string[] = [];
            sortBy.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        } else {
            sort = 'createdAt';
        }

        const limit = options.limit && options.limit > 0 ? options.limit : 10;
        const page = options.page && options.page > 0 ? options.page : 1;
        const skip = (page - 1) * limit;

        const countPromise = this.countDocuments(filter).exec();
        let docsPromise: Query<T[], T> = this.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        if (populate) {
            populate.split(',').forEach((populateOption) => {
                docsPromise = docsPromise.populate(populateOption);
            });
        }

        const [total, results] = await Promise.all([
            countPromise,
            docsPromise.exec(),
        ]);

        return {
            results,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    };
}

export default paginate;
