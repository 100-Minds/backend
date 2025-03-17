import { knexDb } from '@/common/config';
import { ILastWatched } from '@/common/interfaces';
import { DateTime } from 'luxon';

class LastWatchedRepository {
	create = async (payload: Partial<ILastWatched>): Promise<ILastWatched[]> => {
		return await knexDb.table('last_watched').insert(payload).returning('*');
	};

	update = async (id: string, payload: Partial<ILastWatched>): Promise<ILastWatched[]> => {
		return await knexDb('last_watched')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

    findByVideoId = async (videoId: string): Promise<ILastWatched[]> => {
		return await knexDb.table('last_watched').where({ videoId }).returning('*');
	}

    findByUserId = async (userId: string): Promise<ILastWatched[]> => {
		return await knexDb.table('last_watched').where({ userId }).returning('*');
	}

    findByVideoAndCourse = async (videoId: string, courseId: string): Promise<ILastWatched[]> => {
		return await knexDb.table('last_watched').where({ videoId, courseId }).returning('*');
	}

    findByUserIdAndCourse = async (userId: string, courseId: string): Promise<ILastWatched[]> => {
		return await knexDb.table('last_watched').where({ userId, courseId }).returning('*');
	}

	
}

export const lastWatchedRepository = new LastWatchedRepository();
