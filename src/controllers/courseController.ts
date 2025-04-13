import { Request, Response } from 'express';
import {
	AppError,
	AppResponse,
	deleteObjectFromR2,
	generatePresignedUrl,
	toJSON,
	uploadDocumentFile,
	uploadPictureFile,
	videoUploadFailedEmail,
	videoUploadSuccessfulEmail,
} from '@/common/utils';
import { catchAsync } from '@/middlewares';
import { courseRepository, powerSkillRepository, scenarioRepository } from '@/repository';
import { CourseStatus, VideoUploadStatus } from '@/common/constants';
import { ENVIRONMENT } from '@/common/config';
import { ICourseChapter } from '@/common/interfaces';

export class CourseController {
	createModule = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create a module', 403);
		}
		if (!name) {
			throw new AppError('Name is required', 400);
		}

		const extinguishModule = await courseRepository.getModuleByName(name);
		if (extinguishModule) {
			throw new AppError('Module name exist already', 400);
		}

		const module = await courseRepository.createModule({
			name,
			userId: user.id,
		});

		return AppResponse(res, 201, toJSON(module), 'Module created successfully');
	});

	getModule = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { moduleId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!moduleId) {
			throw new AppError('Module ID is required', 400);
		}

		const module = await courseRepository.getModule(moduleId as string);
		if (!module) {
			throw new AppError('Module not found', 404);
		}

		return AppResponse(res, 200, toJSON([module]), 'Module successfully fetched');
	});

	getAllModules = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const modules = await courseRepository.getAllModules();
		if (!modules) {
			throw new AppError('No modules found', 404);
		}

		return AppResponse(res, 200, toJSON(modules), 'Modules successfully fetched');
	});

	updateModule = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, moduleId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update a module', 403);
		}
		if (!moduleId || !name) {
			throw new AppError('Incomplete update data', 400);
		}

		const module = await courseRepository.getModule(moduleId);
		if (!module) {
			throw new AppError('Module not found', 404);
		}

		const updatedModule = await courseRepository.updateModule(moduleId, { name });
		if (!updatedModule) {
			throw new AppError('Module not updated', 400);
		}

		return AppResponse(res, 200, toJSON(updatedModule), 'Module updated successfully');
	});

	deleteModule = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { moduleId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a module', 403);
		}
		if (!moduleId) {
			throw new AppError('Module ID is required', 400);
		}

		const module = await courseRepository.getModule(moduleId as string);
		if (!module) {
			throw new AppError('Module not found', 404);
		}
		if (module.isDeleted) {
			throw new AppError('Module has already been deleted', 400);
		}

		const deletedModule = await courseRepository.updateModule(moduleId, {
			isDeleted: true,
		});
		if (!deletedModule) {
			throw new AppError('Module not deleted', 400);
		}

		return AppResponse(res, 200, null, 'Module deleted successfully');
	});

	createCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, moduleId } = req.body;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!file) {
			throw new AppError('Course image is required', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can create a course', 403);
		}

		if (!name || !moduleId) {
			throw new AppError('Course name, moduleId and at least one power skill are required', 400);
		}

		const extinguishCourse = await courseRepository.getCourseByName(user.id, name);
		if (extinguishCourse) {
			throw new AppError('Course name exist already', 400);
		}

		const extinguishModule = await courseRepository.getModule(moduleId);
		if (!extinguishModule) {
			throw new AppError('Module not found', 404);
		}

		const { secureUrl: courseImage } = await uploadPictureFile({
			fileName: `course-image/${Date.now()}-${file.originalname}`,
			buffer: file.buffer,
			mimetype: file.mimetype,
		});

		const [course] = await courseRepository.create({
			name,
			courseImage,
			userId: user.id,
			moduleId,
		});
		if (!course) {
			throw new AppError('Failed to create course', 500);
		}

		return AppResponse(res, 201, toJSON([course]), 'Course created successfully');
	});

	getCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}

		const course = await courseRepository.getCourse(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		return AppResponse(res, 200, toJSON([course]), 'Course successfully fetched');
	});

	getAdminCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}

		const course = await courseRepository.getCoursee(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		return AppResponse(res, 200, toJSON([course]), 'Course successfully fetched');
	});

	getPublishedCourses = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const courses = await courseRepository.getPublishedCourses();
		if (!courses || courses.length === 0) {
			throw new AppError('No Course found', 404);
		}

		return AppResponse(res, 200, toJSON(courses), 'Published Courses successfully fetched');
	});

	getCourses = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can view all courses');
		}

		const courses = await courseRepository.getCourses();
		if (!courses || courses.length === 0) {
			throw new AppError('No Course found', 404);
		}

		return AppResponse(res, 200, toJSON(courses), 'Courses successfully fetched');
	});

	updateCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { name, courseId, moduleId, scenario, skills, status } = req.body;
		const files = req.files as { [fieldname: string]: Express.Multer.File[] };

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update a course', 403);
		}
		if (!courseId) {
			throw new AppError('Course ID is required', 400);
		}
		if (status && !Object.values(CourseStatus).includes(status)) {
			throw new AppError('Invalid course status provided', 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}
		if (course.isDeleted) {
			throw new AppError('Course has already been deleted', 400);
		}

		if (moduleId) {
			const module = await courseRepository.getModule(moduleId);
			if (!module) {
				throw new AppError('Module not found', 404);
			}
		}

		let courseImageUrl = course.courseImage;
		if (files?.courseImage?.[0]) {
			const { secureUrl } = await uploadPictureFile({
				fileName: `course-image/${Date.now()}-${files.courseImage[0].originalname}`,
				buffer: files.courseImage[0].buffer,
				mimetype: files.courseImage[0].mimetype,
			});
			courseImageUrl = secureUrl;
		}

		let courseResources = course.courseResources || null;
		if (files?.courseResources?.[0]) {
			const { secureUrl } = await uploadDocumentFile({
				fileName: `course-documents/${Date.now()}-${files.courseResources[0].originalname}`,
				buffer: files.courseResources[0].buffer,
				mimetype: files.courseResources[0].mimetype,
			});
			courseResources = secureUrl;
		}

		const updatedCourse = await courseRepository.update(courseId, {
			...(name ? { name } : {}),
			...(moduleId ? { moduleId } : {}),
			...(courseImageUrl ? { courseImage: courseImageUrl } : {}),
			...(courseResources ? { courseResources: courseResources } : {}),
			...(status ? { status } : {}),
		});
		if (!updatedCourse) {
			throw new AppError('Failed to update course', 500);
		}

		const parsedSkills = typeof skills === 'string' ? JSON.parse(skills.replace(/'/g, '"')) : skills;
		if (parsedSkills && Array.isArray(parsedSkills) && parsedSkills.length > 0) {
			const skillRecords = await powerSkillRepository.findSkillsByIds(parsedSkills);
			if (skillRecords.length !== parsedSkills.length) {
				throw new AppError('Invalid power skills provided', 400);
			}

			const formattedSkills = skillRecords.map((skill) => ({ id: skill.id, name: skill.powerskill }));

			await powerSkillRepository.removePowerSkillsFromCourse(courseId);

			const addSkill = await powerSkillRepository.addPowerSkillsToCourse(courseId, formattedSkills);
			if (!addSkill) {
				throw new AppError('Failed to update power skills for the course', 500);
			}
		}

		const parsedScenario = typeof scenario === 'string' ? JSON.parse(scenario.replace(/'/g, '"')) : scenario;
		if (parsedScenario && Array.isArray(parsedScenario) && parsedScenario.length > 0) {
			const scenarioRecords = await scenarioRepository.findScenariosByName(parsedScenario);
			if (scenarioRecords.length !== parsedScenario.length) {
				throw new AppError('Invalid scenarios provided', 400);
			}

			const formattedScenarios = scenarioRecords.map((s) => ({ id: s.id, name: s.scenario }));

			await scenarioRepository.removeScenariosFromCourse(courseId);

			const addScenario = await scenarioRepository.addScenarioToCourse(courseId, formattedScenarios);
			if (!addScenario) {
				throw new AppError('Failed to update scenarios for the course', 500);
			}
		}

		return AppResponse(res, 200, toJSON(updatedCourse), 'Course updated successfully');
	});

	deleteCourse = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can delete a course', 403);
		}
		if (!courseId) {
			throw new AppError('courseId ID is required', 400);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('courseId not found', 404);
		}

		if (course.userId !== user.id) {
			throw new AppError('You are not authorized to delete this course', 403);
		}

		if (course.isDeleted) {
			throw new AppError('Course has already been deleted', 400);
		}

		await courseRepository.deleteCourse(courseId);

		return AppResponse(res, 200, null, 'Course deleted successfully');
	});

	createLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { title, description, courseId, fileName, fileType, fileSize, videoLength } = req.body;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		if (user.role === 'user') {
			throw new AppError('Only an admin can create a lesson', 403);
		}

		if (!courseId || !title || !description || !fileName || !fileType || !fileSize || !videoLength) {
			throw new AppError(
				'CourseId, title, description, fileName, fileType, fileSize and videoLength are required',
				400
			);
		}

		const course = await courseRepository.getCourse(courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		if (course.userId !== user.id) {
			throw new AppError('You are not authorized to create a lesson for this course', 403);
		}
		if (course.isDeleted) {
			throw new AppError('Course has already been deleted', 400);
		}

		let chapterResources: string | null = null;
		if (file) {
			const { secureUrl } = await uploadDocumentFile({
				fileName: `chapter-resources/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});
			chapterResources = secureUrl;
		}

		const maxChapterResult = await courseRepository.getCourseMaxChapter(courseId);
		const maxNumber = maxChapterResult?.maxNumber ?? 0;

		const [chapter] = await courseRepository.createChapter({
			title,
			description,
			courseId,
			chapterNumber: maxNumber + 1,
			chapterResources,
		});
		if (!chapter) {
			throw new AppError('Failed to create chapter', 500);
		}

		// Generate pre-signed URL
		const { signedUrl, key } = await generatePresignedUrl(fileName, fileType, fileSize);

		const [video] = await courseRepository.createVideo({
			chapterId: chapter.id,
			videoURL: `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`,
			duration: videoLength,
			uploadStatus: VideoUploadStatus.PROCESSING,
		});
		if (!video) {
			throw new AppError('Failed to store video metadata', 500);
		}

		return AppResponse(res, 201, { signedUrl, key }, 'Lesson created successfully, use the signed URL to upload.');
	});

	getCourseLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!chapterId || !courseId) {
			throw new AppError('ChapterId and CourseId are required', 400);
		}

		const course = await courseRepository.getCourse(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const lessons = await courseRepository.getCourseLesson(courseId as string, chapterId as string);
		if (!lessons) {
			throw new AppError('Lessons not found', 404);
		}

		return AppResponse(res, 200, toJSON([lessons]), 'Chapters and lessons successfully fetched');
	});

	getCourseLessons = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!courseId) {
			throw new AppError('CourseId is required', 400);
		}

		const course = await courseRepository.getCourse(courseId as string);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		const lessons = await courseRepository.getCourseLessons(courseId as string);
		if (!lessons) {
			throw new AppError('Lessons not found', 404);
		}

		return AppResponse(res, 200, toJSON([lessons]), 'Chapters and lessons successfully fetched');
	});

	getChapter = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (!chapterId) {
			throw new AppError('ChapterId is required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId as string);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}

		return AppResponse(res, 200, toJSON(chapter), 'Chapter successfully fetched');
	});

	getAllChapters = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { courseId } = req.query;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}

		const chapters = await courseRepository.getAllChapters(courseId as string);
		if (!chapters) {
			throw new AppError('Chapters not found', 404);
		}

		return AppResponse(res, 200, toJSON(chapters), 'Chapters successfully fetched');
	});

	updateLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { title, description, chapterId, fileName, fileType, fileSize, videoLength } = req.body;
		const { file } = req;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update a lesson', 403);
		}
		if (!chapterId) {
			throw new AppError('ChapterId is required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}
		if (chapter.isDeleted) {
			throw new AppError('Chapter has already been deleted', 400);
		}

		const updateFields: Partial<ICourseChapter> = {};
		if (title) updateFields.title = title;
		if (description) updateFields.description = description;

		if (file) {
			if (chapter.chapterResources) {
				const deleteResult = await deleteObjectFromR2(chapter.chapterResources);
				if (deleteResult === false) {
					throw new AppError('Failed to delete the existing document.');
				}
			}

			const { secureUrl } = await uploadDocumentFile({
				fileName: `chapter-resources/${Date.now()}-${file.originalname}`,
				buffer: file.buffer,
				mimetype: file.mimetype,
			});
			updateFields.chapterResources = secureUrl;
		}

		if (Object.keys(updateFields).length > 0) {
			const updatedChapter = await courseRepository.updateChapter(chapterId, updateFields);
			if (!updatedChapter) {
				throw new AppError('Failed to update chapter', 500);
			}
		}

		let signedUrl: string | undefined, key: string | undefined;
		if (fileName && fileType && fileSize && videoLength) {
			const video = await courseRepository.getVideoByChapterId(chapter.id);
			if (!video) {
				throw new AppError('Video not found', 404);
			}

			const result = await deleteObjectFromR2(video.videoURL);
			if (result === false) {
				throw new AppError('Invalid file URL. Could not extract object key.');
			}

			({ signedUrl, key } = await generatePresignedUrl(fileName, fileType, fileSize));

			const videoUpdates = {
				videoURL: `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`,
				duration: videoLength,
				uploadStatus: VideoUploadStatus.PROCESSING,
			};

			const updatedVideo = await courseRepository.updateVideo(chapterId, videoUpdates);
			if (!updatedVideo) {
				throw new AppError('Failed to update lesson video', 500);
			}
		}

		return AppResponse(res, 200, signedUrl ? { signedUrl, key } : null, 'Lesson updated successfully.');
	});

	deleteLesson = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update an uploaded video', 403);
		}
		if (!chapterId) {
			throw new AppError('Chapter Id is required', 400);
		}

		const chapter = await courseRepository.getChapter(chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}
		if (chapter.isDeleted) {
			throw new AppError('Chapter has already been deleted', 400);
		}

		const video = await courseRepository.getVideoByChapterId(chapter.id);
		if (!video) {
			throw new AppError('Video not found', 404);
		}

		const result = await deleteObjectFromR2(video.videoURL);
		if (result === false) {
			throw new AppError('Invalid file URL. Could not extract object key.');
		}

		const hardDelete = await Promise.all([
			courseRepository.hardDeleteChapter(chapter.id),
			courseRepository.hardDeleteVideo(video.id),
		]);

		if (!hardDelete) {
			throw new AppError('Failed to delete chapter and video', 500);
		}

		return AppResponse(res, 200, null, 'Lesson deleted successfully.');
	});

	createVideoUploadedStatus = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { key, videoUploadStatus } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update an uploaded video', 403);
		}
		if (!key) {
			throw new AppError('Video key is required', 400);
		}

		const video = await courseRepository.getVideoByKey(`${ENVIRONMENT.R2.PUBLIC_URL}/${key}`);
		if (!video) {
			throw new AppError('Video not found', 404);
		}
		if (video.uploadStatus === VideoUploadStatus.COMPLETED) {
			throw new AppError('Video has already been uploaded', 400);
		}
		if (video.uploadStatus === VideoUploadStatus.FAILED) {
			throw new AppError('Video upload failed', 500);
		}

		const chapter = await courseRepository.getChapter(video.chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}

		const course = await courseRepository.getCourse(chapter.courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		await courseRepository.updateVideo(video.id, {
			uploadStatus: videoUploadStatus === 'completed' ? VideoUploadStatus.COMPLETED : VideoUploadStatus.FAILED,
		});
		videoUploadStatus === 'completed'
			? await videoUploadSuccessfulEmail(user.email, chapter.chapterNumber, course.name)
			: await videoUploadFailedEmail(user.email, chapter.chapterNumber, course.name);

		videoUploadStatus === 'failed' &&
			(await Promise.all([courseRepository.hardDeleteChapter(chapter.id), courseRepository.hardDeleteVideo(video.id)]));

		return AppResponse(res, 200, null, 'Video upload confirmed');
	});

	updateVideoUploadedStatus = catchAsync(async (req: Request, res: Response) => {
		const { user } = req;
		const { chapterId, videoUploadStatus } = req.body;

		if (!user) {
			throw new AppError('Please log in again', 400);
		}
		if (user.role === 'user') {
			throw new AppError('Only an admin can update an uploaded video', 403);
		}
		if (!chapterId) {
			throw new AppError('Chapter ID is required', 400);
		}

		const video = await courseRepository.getVideoByChapterId(chapterId);
		if (!video) {
			throw new AppError('Video not found', 404);
		}
		if (video.uploadStatus === VideoUploadStatus.COMPLETED) {
			throw new AppError('Video has already been uploaded', 400);
		}
		if (video.uploadStatus === VideoUploadStatus.FAILED) {
			throw new AppError('Video upload failed', 500);
		}

		const chapter = await courseRepository.getChapter(video.chapterId);
		if (!chapter) {
			throw new AppError('Chapter not found', 404);
		}

		const course = await courseRepository.getCourse(chapter.courseId);
		if (!course) {
			throw new AppError('Course not found', 404);
		}

		await courseRepository.updateVideo(video.id, {
			uploadStatus: videoUploadStatus === 'completed' ? VideoUploadStatus.COMPLETED : VideoUploadStatus.FAILED,
		});
		videoUploadStatus === 'completed'
			? await videoUploadSuccessfulEmail(user.email, chapter.chapterNumber, course.name)
			: await videoUploadFailedEmail(user.email, chapter.chapterNumber, course.name);

		return AppResponse(res, 200, null, 'Video upload confirmed');
	});
}

export const courseController = new CourseController();
