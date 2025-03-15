import { knexDb } from '@/common/config';
import { LearningStatus } from '@/common/constants';
import {
	ILearningJourney,
	IUserLearningJourney,
	StructuredCourse,
	StructuredJourney,
	StructuredModule,
	StructuredUserCourseJourney,
} from '@/common/interfaces';
import { AppError } from '@/common/utils';

class LearningJourneyRepository {
	findExistingModuleCourses = async (moduleId: string): Promise<Set<string>> => {
		const existingCourses = await knexDb('learning_journey').where({ moduleId }).select('courseId');
		return new Set(existingCourses.map((c) => c.courseId));
	};

	addToLearningJourney = async (moduleId: string) => {
		const module = await knexDb('course_module').where({ id: moduleId, isDeleted: false }).first();
		const courses = await knexDb('course')
			.where({ moduleId, isDeleted: false })
			.select('id', 'name', 'scenarioId', 'scenarioName');

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
				scenarioId: course.scenarioId,
				scenarioName: course.scenarioName,
			});
		}
		if (learningJourneyEntries.length > 0) {
			await knexDb('learning_journey').insert(learningJourneyEntries);
		}

		return learningJourneyEntries;
	};

	getStructuredLearningJourney = async () => {
		const learningJourneyRecords = await knexDb('learning_journey')
			.select('moduleId', 'moduleName', 'courseId', 'courseName', 'scenarioId', 'scenarioName')
			.orderBy('created_at', 'asc');

		const structuredLearning: Record<string, StructuredModule> = {};

		for (const record of learningJourneyRecords) {
			// Module grouuping
			if (!structuredLearning[record.moduleId]) {
				structuredLearning[record.moduleId] = {
					moduleId: record.moduleId,
					moduleName: record.moduleName,
					courses: {},
				};
			}

			// Course grouping
			if (!structuredLearning[record.moduleId].courses[record.courseId]) {
				structuredLearning[record.moduleId].courses[record.courseId] = {
					courseId: record.courseId,
					courseName: record.courseName,
					scenarios: [],
					chapters: [],
				};
			}

			// Add scenario to the course
			if (record.scenarioId) {
				structuredLearning[record.moduleId].courses[record.courseId].scenarios.push({
					scenarioId: record.scenarioId,
					scenarioName: record.scenarioName,
				});
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
			.select('id', 'name', 'moduleId', 'scenarioId', 'scenarioName')
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
			scenarioId: course.scenarioId,
			scenarioName: course.scenarioName,
			status: LearningStatus.COMPLETED,
		};

		await knexDb('user_learning_journey').insert(newLearningJourney);

		return newLearningJourney;
	};

	getAllUserLearningJourney = async (userId: string) => {
		const learningJourney = await knexDb('learning_journey').select(
			'moduleId',
			'moduleName',
			'courseId',
			'courseName',
			'scenarioId',
			'scenarioName'
		);

		// Fetch chapters for each course in the learning journey
		const courseIds = [...new Set(learningJourney.map((record) => record.courseId))];
		const chapters = await knexDb('course_chapters')
			.whereIn('courseId', courseIds)
			.select('courseId', 'id as chapterId', 'chapterNumber');
		const userCompletedChapters = await knexDb('user_learning_journey').where({ userId }).select('chapterId');

		// Convert completed chapters into a Set for quick lookup
		const completedChaptersSet = new Set(userCompletedChapters.map((c) => c.chapterId));

		const courseChaptersMap: Record<string, Map<string, { chapterId: string; chapterNumber: number }>> = {};
		for (const chapter of chapters) {
			if (!courseChaptersMap[chapter.courseId]) {
				courseChaptersMap[chapter.courseId] = new Map();
			}
			// Add only unique chapters //i had duplicates (each chapter displayed twice)
			courseChaptersMap[chapter.courseId].set(chapter.chapterId, {
				chapterId: chapter.chapterId,
				chapterNumber: chapter.chapterNumber,
			});
		}

		const structuredJourney: Record<string, StructuredJourney> = {};
		for (const record of learningJourney) {
			const { moduleId, moduleName, courseId, courseName, scenarioId, scenarioName } = record;

			// Initialize module if not present
			if (!structuredJourney[moduleId]) {
				structuredJourney[moduleId] = {
					moduleId,
					moduleName,
					courses: {},
				};
			}

			// Initialize course if not present
			if (!structuredJourney[moduleId].courses[courseId]) {
				structuredJourney[moduleId].courses[courseId] = {
					courseId,
					courseName,
					scenarioId,
					scenarioName,
					status: 'not-completed',
					chapters: [],
				};
			}

			// Get unique chapters for the current course
			const courseChapters = courseChaptersMap[courseId] ? [...courseChaptersMap[courseId].values()] : [];

			// Assign chapters and determine status
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

			// Assign unique chapters to course and sort by chapterNumber
			structuredJourney[moduleId].courses[courseId].chapters = [...uniqueChapters.values()].sort(
				(a, b) => a.chapterNumber - b.chapterNumber
			);
		}

		// Determine course completion status
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

	getCourseStructuredLearningJourney = async () => {
		const learningJourneyRecords = await knexDb('learning_journey')
			.select('courseId', 'courseName', 'scenarioId', 'scenarioName')
			.orderBy('created_at', 'asc');

		// Structure learning journey by course

		const structuredLearning: Record<string, StructuredCourse> = {};

		for (const record of learningJourneyRecords) {
			// Initialize course if not present
			if (!structuredLearning[record.courseId]) {
				structuredLearning[record.courseId] = {
					courseId: record.courseId,
					courseName: record.courseName,
					scenarios: [],
					chapters: [], // Placeholder for chapters
				};
			}

			// Add scenario to the course
			if (record.scenarioId) {
				structuredLearning[record.courseId].scenarios.push({
					scenarioId: record.scenarioId,
					scenarioName: record.scenarioName,
				});
			}
		}

		// Fetch all chapters in bulk (avoiding N+1 queries)
		const courseIds = Object.keys(structuredLearning);

		if (courseIds.length > 0) {
			const chapters = await knexDb('course_chapters')
				.whereIn('courseId', courseIds)
				.select('id as chapterId', 'courseId', 'title as chapterName');

			// Attach chapters to their respective courses
			for (const chapter of chapters) {
				if (structuredLearning[chapter.courseId]) {
					structuredLearning[chapter.courseId].chapters.push(chapter);
				}
			}
		}

		// Convert structured object to an array
		return Object.values(structuredLearning);
	};

	getStructuredUserCourseLearningJourney = async (userId: string) => {
		const learningJourney = await knexDb('learning_journey').select(
			'courseId',
			'courseName',
			'chapterId',
			'scenarioId',
			'scenarioName'
		);

		// Fetch the user's completed chapters
		const userCompletedChapters = await knexDb('user_learning_journey').where({ userId }).select('chapterId');

		// Convert completed chapters into a Set for fast lookup
		const completedChaptersSet = new Set(userCompletedChapters.map((c) => c.chapterId));

		// Group by course

		const structuredJourney: Record<string, StructuredUserCourseJourney> = {};

		for (const record of learningJourney) {
			const { courseId, courseName, chapterId, scenarioId, scenarioName } = record;

			// Initialize course if not present
			if (!structuredJourney[courseId]) {
				structuredJourney[courseId] = {
					courseId,
					courseName,
					scenarios: [],
					chapters: [],
					status: 'not-completed', // Default, updated later
				};
			}

			// Add scenario (if applicable)
			if (scenarioId) {
				structuredJourney[courseId].scenarios.push({ scenarioId, scenarioName });
			}

			// Determine chapter status
			const chapterStatus = completedChaptersSet.has(chapterId) ? 'completed' : 'not-completed';

			// Add chapter
			structuredJourney[courseId].chapters.push({ chapterId, status: chapterStatus });
		}

		// Determine course completion status
		for (const course of Object.values(structuredJourney)) {
			const allCompleted = course.chapters.length > 0 && course.chapters.every((ch) => ch.status === 'completed');
			course.status = allCompleted ? 'completed' : 'not-completed';
		}

		// Convert object to array
		return Object.values(structuredJourney);
	};
}

export const learningJourneyRepository = new LearningJourneyRepository();
