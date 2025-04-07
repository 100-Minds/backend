export interface CommonDataFields {
	to: string;
	priority: string;
}

export interface WelcomeEmailData extends CommonDataFields {
	name: string;
}

export interface LoginEmailData extends CommonDataFields {
	name: string;
	otp: string;
}
export interface ForgotPasswordData extends CommonDataFields {
	resetLink: string;
	name: string;
}

export interface ResetPasswordData extends CommonDataFields {
	name: string;
}

export interface TeamInvitationData extends CommonDataFields {
	inviterName: string;
	inviteeName: string;
	teamName: string;
	inviteLink: string;
}

export interface TeamInvitationSuccessData extends CommonDataFields {
	inviterName: string;
	inviteeName: string;
	teamName: string;
}

export interface RemoveTeamMemberData extends CommonDataFields {
	adminName: string;
	removedMemberName: string;
	teamName: string;
}

export interface VideoUploadSuccessData extends CommonDataFields {
	chapterNumber: number;
	courseName: string;
}

export interface VideoUploadFailedData extends CommonDataFields {
	chapterNumber: number;
	courseName: string;
}

export type EmailJobData =
	| { type: 'loginEmail'; data: LoginEmailData }
	| { type: 'welcomeEmail'; data: WelcomeEmailData }
	| { type: 'forgotPassword'; data: ForgotPasswordData }
	| { type: 'resetPassword'; data: ResetPasswordData }
	| { type: 'teamInvitation'; data: TeamInvitationData }
	| { type: 'teamInvitationSuccess'; data: TeamInvitationSuccessData }
	| { type: 'removeTeamMember'; data: RemoveTeamMemberData }
	| { type: 'videoUploadSuccess'; data: VideoUploadSuccessData }
	| { type: 'videoUploadFailed'; data: VideoUploadFailedData };
