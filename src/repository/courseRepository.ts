import { knexDb } from '@/common/config';
import {
	ICourse,
	ICourseChapter,
	ICourseVideo,
	MaxChapterResult,
	ILesson,
	IChapterLesson,
	IModule,
	ICourseWithModuleName,
	ICourseChapterWithVideoUrl,
	IScenario,
	IQuiz,
	ICourseWithSkillsAndScenario,
} from '@/common/interfaces';
import { DateTime } from 'luxon';

class CourseRepository {
	//////MODULES//////
	createModule = async (payload: Partial<IModule>): Promise<IModule[]> => {
		return await knexDb.table('course_module').insert(payload).returning('*');
	};

	getModuleByName = async (name: string): Promise<IModule | null> => {
		return await knexDb.table('course_module').where({ name }).first();
	};

	getModule = async (id: string): Promise<IModule | null> => {
		const result = await knexDb.table('course_module').where({ id }).select('*');
		return result.length ? result[0] : null;
	};

	getAllModules = async (): Promise<IModule[]> => {
		return await knexDb.table('course_module').where({ isDeleted: false }).orderBy('created_at', 'asc');
	};

	deleteModule = async (id: string) => {
		return await knexDb.table('course_module').where({ id }).update({ isDeleted: true }).returning('*');
	};

	updateModule = async (id: string, payload: Partial<IModule>): Promise<IModule[]> => {
		return await knexDb('course_module')
			.where({ id })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	findAllModule = async (): Promise<IModule[]> => {
		return knexDb('course_module').where({ isDeleted: false }).orderBy('created_at', 'asc');
	};

	findOneModule = async (id: string): Promise<IModule | null> => {
		return knexDb('course_module').where({ id, isDeleted: false }).first();
	};

	findModuleByIsDeleted = async (isDeleted: boolean): Promise<IModule[]> => {
		return knexDb('course_module').where({ isDeleted }).orderBy('created_at', 'desc');
	};

	///////////COURSES/////////
	create = async (payload: Partial<ICourse>): Promise<ICourse[]> => {
		return await knexDb.table('course').insert(payload).returning('*');
	};

	getCourseByName = async (userId: string, name: string): Promise<ICourse | null> => {
		return await knexDb.table('course').where({ userId, name, isDeleted: false }).first();
	};

	getCourse = async (id: string): Promise<ICourse | null> => {
		const result = await knexDb.table('course').where({ id }).select('*');
		return result.length ? result[0] : null;
	};

	getCoursee = async (id: string): Promise<ICourseWithSkillsAndScenario | null> => {
		const course = await knexDb('course').select('*').where({ id, isDeleted: false }).first();
		if (!course) {
			return null;
		}

		const rolePlay = await knexDb('course_roleplay')
			.select('scenarioId', 'scenarioName')
			.where({ courseId: course.id, isDeleted: false });
		if (!rolePlay) {
			return null;
		}

		const powerSkill = await knexDb('course_power_skills')
			.select('powerSkillId', 'powerSkillName')
			.where({ courseId: course.id });
		if (!powerSkill) {
			return null;
		}

		const coursee: ICourseWithSkillsAndScenario = {
			course,
			scenarios: rolePlay.map((role) => ({
				scenarioId: role.scenarioId,
				scenarioName: role.scenarioName,
			})),
			skills: powerSkill.map((skill) => ({
				powerSkillId: skill.powerSkillId,
				powerSkillName: skill.powerSkillName,
			})),
		};

		return coursee;
	};

	getPublishedCourses = async (): Promise<ICourseWithModuleName[] | null> => {
		return await knexDb
			.table('course')
			.select('course.*', 'course_module.name as moduleName')
			.leftJoin('course_module', 'course.moduleId', 'course_module.id')
			.where('course.isDeleted', false)
			.andWhere('course.status', 'published')
			.orderBy('course.created_at', 'desc');
	};

	getCourses = async (): Promise<ICourseWithModuleName[] | null> => {
		return await knexDb
			.table('course')
			.select('course.*', 'course_module.name as moduleName')
			.leftJoin('course_module', 'course.moduleId', 'course_module.id')
			.where('course.isDeleted', false)
			.orderBy('course.created_at', 'desc');
	};

	getModuleCourses = async (moduleId: string): Promise<ICourse[]> => {
		return knexDb('course').where({ moduleId, isDeleted: false }).orderBy('created_at', 'asc');
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

	// getAllChapters = async (courseId: string): Promise<ICourseChapter[]> => {
	// 	return knexDb.table('course_chapters').where({ courseId, isDeleted: false }).orderBy('chapterNumber', 'asc');
	// };

	getAllChapters = async (courseId: string): Promise<ICourseChapterWithVideoUrl[] | null> => {
		return await knexDb
			.table('course_chapters')
			.select('course_chapters.*', 'course_videos.videoURL as videoUrl')
			.leftJoin('course_videos', 'course_videos.chapterId', 'course_chapters.id')
			.where('course_chapters.courseId', courseId)
			.andWhere('course_chapters.isDeleted', false)
			.orderBy('course_chapters.chapterNumber', 'asc');
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

	hardDeleteChapter = async (id: string) => {
		return await knexDb.table('course_chapters').where({ id }).delete().returning('*');
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

	hardDeleteVideo = async (id: string) => {
		return await knexDb.table('course_videos').where({ id }).delete().returning('*');
	};

	getVideoByChapterId = async (chapterId: string): Promise<ICourseVideo | null> => {
		const result = await knexDb.table('course_videos').where({ chapterId }).select('*');
		return result.length ? result[0] : null;
	};

	updateVideo = async (chapterId: string, payload: Partial<ICourseVideo>): Promise<ICourseVideo[]> => {
		return await knexDb('course_videos')
			.where({ chapterId })
			.update({ ...payload, updated_at: DateTime.now().toJSDate() })
			.returning('*');
	};

	getVideoByKey = async (key: string): Promise<ICourseVideo | null> => {
		return await knexDb('course_videos').where({ videoURL: key }).first();
	};

	//lesson
	getCourseLessons = async (courseId: string): Promise<ILesson | null> => {
		const course = await knexDb
			.table('course')
			.select('id', 'name', 'moduleId', 'courseResources', 'isDeleted', 'created_at')
			.where({ id: courseId, isDeleted: false })
			.first();
		if (!course) {
			return null;
		}

		const chapters = await knexDb('course_chapters')
			.select('id', 'title', 'description', 'chapterNumber', 'chapterResources', 'created_at')
			.where('courseId', courseId)
			.where('isDeleted', false)
			.orderBy('chapterNumber', 'asc');

		if (!chapters || chapters.length === 0) {
			return null;
		}

		const chapterIds = chapters.map((chapter) => chapter.id);
		const videos = await knexDb('course_videos')
			.select('id', 'videoURL', 'isDeleted', 'duration', 'chapterId', 'uploadStatus', 'created_at')
			.whereIn('chapterId', chapterIds)
			.where('isDeleted', false);

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
				description: chapter.description,
				chapterNumber: chapter.chapterNumber,
				chapterResources: chapter.chapterResources,
				videos: videosByChapter[chapter.id] || [],
				created_at: chapter.created_at,
				updated_at: chapter.updated_at,
			})),
		};

		return lesson;
	};

	getCourseLesson = async (courseId: string, chapterId: string): Promise<IChapterLesson | null> => {
		const course = await knexDb('course')
			.select('id', 'name', 'courseResources', 'scenarioId')
			.where({ id: courseId, isDeleted: false })
			.first();
		if (!course) {
			return null;
		}

		const rolePlay = await knexDb('sys_scenario')
			.select('id', 'scenario', 'scenarioImage')
			.where({ id: course.scenarioId, isDeleted: false })
			.first();
		if (!rolePlay) {
			return null;
		}

		const chapter = await knexDb('course_chapters')
			.select('id', 'title', 'description', 'chapterNumber', 'chapterResources', 'courseId', 'isDeleted', 'created_at')
			.where({ id: chapterId, courseId, isDeleted: false })
			.first();
		if (!chapter) {
			return null;
		}

		const videos = await knexDb('course_videos')
			.select('id', 'videoURL', 'isDeleted', 'duration', 'chapterId', 'uploadStatus', 'created_at')
			.where({ chapterId, isDeleted: false })
			.first();
		if (!videos) {
			return null;
		}

		const quiz = await knexDb('quiz')
			.select('id', 'question', 'optionA', 'optionB', 'optionC', 'optionD')
			.where({ chapterId });

		const lesson: IChapterLesson = {
			course: {
				id: course.id,
				name: course.name,
				courseResources: course.courseResources,
			},
			chapter: chapter as ICourseChapter,
			video: videos as ICourseVideo,
			rolePlay: rolePlay as IScenario,
			quiz: quiz as IQuiz[],
		};

		return lesson;
	};
}

export const courseRepository = new CourseRepository();
