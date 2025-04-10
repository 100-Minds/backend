import { knexDb } from '@/common/config';
import { IFavourites } from '@/common/interfaces/favourites';
import { DateTime } from 'luxon';

class FavouritesRepository {
	create = async (payload: Partial<IFavourites>) => {
		return await knexDb.table('course_favourites').insert(payload).returning('*');
	};

	findById = async (id: string): Promise<IFavourites | null> => {
		return await knexDb.table('course_favourites').where({ id }).first();
	};

	update = async (id: string, payload: Partial<IFavourites>): Promise<IFavourites[]> => {
		return await knexDb('course_favourites')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	getUserFavourites = async (userId: string, chapterId: string): Promise<IFavourites[]> => {
		return await knexDb('course_favourites').where({ userId, chapterId }).andWhere({ isDeleted: false }).returning('*');
	};
}

export const favouritesRepository = new FavouritesRepository();
