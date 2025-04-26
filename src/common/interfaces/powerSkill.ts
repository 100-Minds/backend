export interface IPowerSkill {
	id: string;
	powerskill: string;
	skillImage: string;
	category: string;
	isDeleted: boolean;
	created_at?: Date;
	updated_at?: Date;
}

export interface ICoursePowerSkill {
	id: string;
	courseId: string;
	powerSkillName: string;
	powerSkillId: string;
	created_at?: Date;
	updated_at?: Date;
}
