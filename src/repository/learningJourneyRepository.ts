import { knexDb } from '@/common/config';
import { LearningStatus } from '@/common/constants';
import {
	ILearningJourney,
	IUserLearningJourney,
	StructuredCourse,
	StructuredJourney,
	StructuredModule,
} from '@/common/interfaces';
import { AppError } from '@/common/utils';

class LearningJourneyRepository {
	findExistingModuleCourses = async (moduleId: string): Promise<Set<string>> => {
		const existingCourses = await knexDb('learning_journey').where({ moduleId }).select('courseId');
		return new Set(existingCourses.map((c) => c.courseId));
	};

	addToLearningJourney = async (moduleId: string) => {
		const module = await knexDb('course_module').where({ id: moduleId, isDeleted: false }).first();
		const courses = await knexDb('course').where({ moduleId, isDeleted: false }).select('id', 'name');

		if (!module || courses.length === 0) {
			return [];
		}

		const existingCourseIds = await this.findExistingModuleCourses(moduleId);
		const newCourses = courses.filter((course) => !existingCourseIds.has(course.id));
		if (newCourses.length === 0) {
			throw new AppError('All courses in this module are already added to the learning journey', 400);
		}

		const learningJourneyEntries: Partial<ILearningJourney>[] = [];
		for (const course of courses) {
			learningJourneyEntries.push({
				moduleId,
				moduleName: module.name,
				courseId: course.id,
				courseName: course.name,
			});
		}
		if (learningJourneyEntries.length > 0) {
			await knexDb('learning_journey').insert(learningJourneyEntries);
		}

		return learningJourneyEntries;
	};

	getAllLearningJourney = async () => {
		const learningJourneyRecords = await knexDb('learning_journey')
			.select('moduleId', 'moduleName', 'courseId', 'courseName', 'isRequired')
			.orderBy('created_at', 'asc');

		const structuredLearning: Record<string, StructuredModule> = {};

		for (const record of learningJourneyRecords) {
			// Module grouuping
			if (!structuredLearning[record.moduleId]) {
				structuredLearning[record.moduleId] = {
					moduleId: record.moduleId,
					moduleName: record.moduleName,
					isRequired: record.isRequired,
					courses: {},
				};
			}

			// Course grouping
			if (!structuredLearning[record.moduleId].courses[record.courseId]) {
				structuredLearning[record.moduleId].courses[record.courseId] = {
					courseId: record.courseId,
					courseName: record.courseName,
					chapters: [],
				};
			}
		}

		// Fetch all chapters in bulk (avoiding N+1 queries)
		const courseIds = Object.keys(structuredLearning).flatMap((moduleId) =>
			Object.keys(structuredLearning[moduleId].courses)
		);

		if (courseIds.length > 0) {
			const chapters = await knexDb('course_chapters').whereIn('courseId', courseIds).select('id', 'courseId', 'title');

			// Map chapters to their respective courses
			const chapterMap: Record<string, { chapterId: string; chapterTitle: string }[]> = {};
			for (const chapter of chapters) {
				if (!chapterMap[chapter.courseId]) {
					chapterMap[chapter.courseId] = [];
				}
				chapterMap[chapter.courseId].push({
					chapterId: chapter.id,
					chapterTitle: chapter.title,
				});
			}

			// Attach chapters to the structured data
			for (const moduleId in structuredLearning) {
				for (const courseId in structuredLearning[moduleId].courses) {
					structuredLearning[moduleId].courses[courseId].chapters = chapterMap[courseId] || [];
				}
			}
		}

		// Convert to an array structure
		const structuredArray = Object.values(structuredLearning).map((module: StructuredModule) => ({
			...module,
			courses: Object.values(module.courses),
		}));

		return structuredArray;
	};

	addToUserLearningJourney = async (userId: string, chapterId: string) => {
		const chapter = await knexDb('course_chapters')
			.where({ id: chapterId, isDeleted: false })
			.select('id', 'courseId')
			.first();

		const course = await knexDb('course')
			.where({ id: chapter.courseId, isDeleted: false })
			.select('id', 'name', 'moduleId')
			.first();

		const module = await knexDb('course_module')
			.where({ id: course.moduleId, isDeleted: false })
			.select('id', 'name')
			.first();

		const newLearningJourney: Partial<IUserLearningJourney> = {
			userId,
			moduleId: module.id,
			moduleName: module.name,
			courseId: course.id,
			courseName: course.name,
			chapterId: chapter.id,
			status: LearningStatus.COMPLETED,
		};

		await knexDb('user_learning_journey').insert(newLearningJourney);

		return newLearningJourney;
	};

	getUserLearningJourneyByChapterId = async (userId: string, chapterId: string) => {
		const learningJourney = await knexDb('user_learning_journey')
			.where({ userId, chapterId })
			.select('moduleId', 'moduleName', 'courseId', 'courseName', 'chapterId');
		return learningJourney;
	};

	getAllUserLearningJourney = async (userId: string) => {
		const activeCourses = await knexDb('course')
			.where({
				isDeleted: false,
				status: 'published',
			})
			.select('id as courseId');

		const activeCourseIds = new Set(activeCourses.map((course) => course.courseId));
		console.log(activeCourseIds);

		const learningJourney = await knexDb('learning_journey').select('moduleId', 'moduleName', 'courseId', 'courseName');

		// Filter learning journey to include only active courses
		const filteredLearningJourney = learningJourney.filter((record) => activeCourseIds.has(record.courseId));

		// Continue with your existing logic, but using the filtered journey
		const courseIds = [...new Set(filteredLearningJourney.map((record) => record.courseId))];
		const chapters = await knexDb('course_chapters')
			.whereIn('courseId', courseIds)
			.select('courseId', 'id as chapterId', 'chapterNumber');
		const userCompletedChapters = await knexDb('user_learning_journey').where({ userId }).select('chapterId');

		const completedChaptersSet = new Set(userCompletedChapters.map((c) => c.chapterId));

		// Rest of your code remains the same, but use filteredLearningJourney instead of learningJourney
		const courseChaptersMap: Record<string, Map<string, { chapterId: string; chapterNumber: number }>> = {};
		for (const chapter of chapters) {
			if (!courseChaptersMap[chapter.courseId]) {
				courseChaptersMap[chapter.courseId] = new Map();
			}
			courseChaptersMap[chapter.courseId].set(chapter.chapterId, {
				chapterId: chapter.chapterId,
				chapterNumber: chapter.chapterNumber,
			});
		}

		const structuredJourney: Record<string, StructuredJourney> = {};
		for (const record of filteredLearningJourney) {
			// Rest of the loop logic stays the same
			const { moduleId, moduleName, courseId, courseName } = record;
			if (!structuredJourney[moduleId]) {
				structuredJourney[moduleId] = {
					moduleId,
					moduleName,
					courses: {},
				};
			}

			if (!structuredJourney[moduleId].courses[courseId]) {
				structuredJourney[moduleId].courses[courseId] = {
					courseId,
					courseName,
					status: 'not-completed',
					chapters: [],
				};
			}

			const courseChapters = courseChaptersMap[courseId] ? [...courseChaptersMap[courseId].values()] : [];

			const uniqueChapters = new Map();
			for (const chapter of courseChapters) {
				if (!uniqueChapters.has(chapter.chapterId)) {
					uniqueChapters.set(chapter.chapterId, {
						chapterId: chapter.chapterId,
						chapterNumber: chapter.chapterNumber,
						status: completedChaptersSet.has(chapter.chapterId) ? 'completed' : 'not-completed',
					});
				}
			}

			structuredJourney[moduleId].courses[courseId].chapters = [...uniqueChapters.values()].sort(
				(a, b) => a.chapterNumber - b.chapterNumber
			);
		}

		// Continue with the rest of your function as is
		for (const module of Object.values(structuredJourney)) {
			for (const course of Object.values(module.courses)) {
				const allCompleted =
					course.chapters.length > 0 && course.chapters.every((chapter) => chapter.status === 'completed');
				course.status = allCompleted ? 'completed' : 'not-completed';
			}
		}

		const result = Object.values(structuredJourney).map((module: StructuredJourney) => ({
			...module,
			courses: Object.values(module.courses),
		}));

		return result;
	};

	getAllCourseLearningJourney = async () => {
		const learningJourneyRecords = await knexDb('learning_journey')
			.select('courseId', 'courseName')
			.orderBy('created_at', 'asc');

		const structuredLearning: Record<string, StructuredCourse> = {};
		for (const record of learningJourneyRecords) {
			if (!structuredLearning[record.courseId]) {
				structuredLearning[record.courseId] = {
					courseId: record.courseId,
					courseName: record.courseName,
					chapters: [],
				};
			}
		}

		const courseIds = Object.keys(structuredLearning);
		if (courseIds.length > 0) {
			const chapters = await knexDb('course_chapters')
				.whereIn('courseId', courseIds)
				.select('id as chapterId', 'courseId', 'title as chapterName', 'chapterNumber')
				.orderBy('chapterNumber', 'asc');

			for (const chapter of chapters) {
				if (structuredLearning[chapter.courseId]) {
					structuredLearning[chapter.courseId].chapters.push(chapter);
				}
			}
		}

		return Object.values(structuredLearning);
	};

	getAllUserCourseLearningJourney = async (userId: string) => {
		const learningJourney = await knexDb('learning_journey').select('courseId', 'courseName');

		const courseIds = [...new Set(learningJourney.map((record) => record.courseId))];

		const chapters = await knexDb('course_chapters')
			.whereIn('courseId', courseIds)
			.select('courseId', 'id as chapterId', 'title', 'chapterNumber');

		const userCompletedChapters = await knexDb('user_learning_journey').where({ userId }).select('chapterId');

		const completedChaptersSet = new Set(userCompletedChapters.map((c) => c.chapterId));

		const courseChaptersMap: Record<
			string,
			Map<
				string,
				{ chapterId: string; chapterTitle: string; chapterNumber: number; status: 'completed' | 'not-completed' }
			>
		> = {};
		for (const chapter of chapters) {
			if (!courseChaptersMap[chapter.courseId]) {
				courseChaptersMap[chapter.courseId] = new Map();
			}

			courseChaptersMap[chapter.courseId].set(chapter.chapterId, {
				chapterId: chapter.chapterId,
				chapterTitle: chapter.title,
				chapterNumber: chapter.chapterNumber,
				status: completedChaptersSet.has(chapter.chapterId) ? ('completed' as const) : ('not-completed' as const),
			});
		}

		const structuredCourses: Record<string, StructuredCourse & { courseStatus: 'completed' | 'not-completed' }> = {};
		for (const record of learningJourney) {
			const { courseId, courseName } = record;
			if (!structuredCourses[courseId]) {
				structuredCourses[courseId] = {
					courseId,
					courseName,
					chapters: [],
					courseStatus: 'not-completed',
				};
			}

			if (courseChaptersMap[courseId]) {
				const sortedChapters = [...courseChaptersMap[courseId].values()].sort(
					(a, b) => a.chapterNumber - b.chapterNumber
				);
				structuredCourses[courseId].chapters = sortedChapters;

				const allChaptersCompleted = sortedChapters.every((chapter) => chapter.status === 'completed');
				structuredCourses[courseId].courseStatus = allChaptersCompleted ? 'completed' : 'not-completed';
			}
		}

		return Object.values(structuredCourses);
	};
}

export const learningJourneyRepository = new LearningJourneyRepository();
