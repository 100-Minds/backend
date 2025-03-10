import { knexDb } from '@/common/config';
import { ICourse, ICourseChapter, ICourseVideo, MaxChapterResult, ILesson, IChapterLesson } from '@/common/interfaces';
import { DateTime } from 'luxon';

class CourseRepository {
	create = async (payload: Partial<ICourse>): Promise<ICourse[]> => {
		return await knexDb.table('course').insert(payload).returning('*');
	};

	getCourseByName = async (userId: string, name: string): Promise<ICourse | null> => {
		return await knexDb.table('course').where({ userId, name }).first();
	};

	getCourse = async (id: string): Promise<ICourse | null> => {
		const result = await knexDb.table('course').where({ id }).select('*');
		return result.length ? result[0] : null;
	};

	deleteCourse = async (id: string) => {
		return await knexDb.table('course').where({ id }).update({ isDeleted: true }).returning('*');
	};

	update = async (id: string, payload: Partial<ICourse>): Promise<ICourse[]> => {
		return await knexDb('course')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAll = async (): Promise<ICourse[]> => {
		return knexDb('course').where({ isDeleted: false }).orderBy('created_at', 'asc');
	};

	findOne = async (id: string): Promise<ICourse | null> => {
		return knexDb('course').where({ id, isDeleted: false }).first();
	};

	findByIsDeleted = async (isDeleted: boolean): Promise<ICourse[]> => {
		return knexDb('course').where({ isDeleted }).orderBy('created_at', 'desc');
	};

	//////Course Chapters////////
	createChapter = async (payload: Partial<ICourseChapter>): Promise<ICourseChapter[]> => {
		return await knexDb.table('course_chapters').insert(payload).returning('*');
	};

	getChapter = async (id: string): Promise<ICourseChapter | null> => {
		const result = await knexDb.table('course_chapters').where({ id }).select('*');
		return result.length ? result[0] : null;
	};

	getAllChapters = async (courseId: string): Promise<ICourseChapter[]> => {
		return knexDb.table('course_chapters').where({ courseId, isDeleted: false }).orderBy('chapterNumber', 'asc');
	};

	getCourseMaxChapter = async (courseId: string): Promise<MaxChapterResult | null> => {
		const result = await knexDb
			.table('course_chapters')
			.max<{ maxNumber: number | null }>('chapterNumber as maxNumber')
			.where('courseId', courseId)
			.where('isDeleted', false)
			.first();

		return result as MaxChapterResult | null;
	};

	deleteChapter = async (id: string) => {
		return await knexDb.table('course_chapters').where({ id }).update({ isDeleted: true }).returning('*');
	};

	updateChapter = async (id: string, payload: Partial<ICourseChapter>): Promise<ICourseChapter[]> => {
		return await knexDb('course_chapters')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	//////Course Videos////////
	createVideo = async (payload: Partial<ICourseVideo>): Promise<ICourseVideo[]> => {
		return await knexDb.table('course_videos').insert(payload).returning('*');
	};

	getVideo = async (id: string): Promise<ICourseVideo | null> => {
		const result = await knexDb.table('course_videos').where({ id }).select('*');
		return result.length ? result[0] : null;
	};

    getVideoByChapterId = async (chapterId: string): Promise<ICourseVideo | null> => {
        const result = await knexDb.table('course_videos').where({ chapterId }).select('*');
        return result.length ? result[0] : null;
    }

	updateVideo = async (chapterId: string, payload: Partial<ICourseVideo>): Promise<ICourseVideo[]> => {
		return await knexDb('course_videos')
			.where({ chapterId })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	//lesson
	getCourseLessons = async (courseId: string): Promise<ILesson | null> => {
		const course = await knexDb.table('course').where({ id: courseId, isDeleted: false }).first();
		if (!course) {
			return null;
		}

		const chapters = await knexDb('course_chapters')
			.select('*')
			.where('courseId', courseId)
			.where('isDeleted', false)
			.orderBy('chapterNumber', 'asc');

		if (!chapters || chapters.length === 0) {
			return null;
		}

		const chapterIds = chapters.map((chapter) => chapter.id);
		const videos = await knexDb('course_videos').select('*').whereIn('chapterId', chapterIds).where('isDeleted', false);

		// Group videos by chapterId for nesting
		const videosByChapter: { [key: string]: ICourseVideo[] } = {};
		videos.forEach((video) => {
			if (!videosByChapter[video.chapterId]) {
				videosByChapter[video.chapterId] = [];
			}
			videosByChapter[video.chapterId].push(video);
		});

		const lesson: ILesson = {
			course: course as ICourse,
			chapters: chapters.map((chapter) => ({
				id: chapter.id,
				title: chapter.title,
				chapterNumber: chapter.chapterNumber,
				videos: videosByChapter[chapter.id] || [],
				created_at: chapter.created_at,
				updated_at: chapter.updated_at,
			})),
		};

		return lesson;
	};

	getCourseLesson = async (courseId: string, chapterId: string): Promise<IChapterLesson | null> => {
		const course = await knexDb('course').select('id', 'name').where({ id: courseId, isDeleted: false }).first();

		if (!course) {
			return null;
		}

		const chapter = await knexDb('course_chapters')
			.select('*')
			.where({ id: chapterId, courseId, isDeleted: false })
			.first();

		if (!chapter) {
			return null;
		}

		const videos = await knexDb('course_videos').select('*').where({ chapterId, isDeleted: false });

		const lesson: IChapterLesson = {
			course: {
				id: course.id,
				name: course.name,
			},
			chapter: chapter as ICourseChapter,
			video: videos as ICourseVideo[],
		};

		return lesson;
	};
}

export const courseRepository = new CourseRepository();
