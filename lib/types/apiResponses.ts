import {
	ProjectContentType,
	ProjectMonetization,
	ProjectStatus,
} from "../constants";

export type MCBPS_AuthRegisterSuccess = {
	event: string;
	success: boolean;
	user: {
		id: string;
		createdAt: string;
		isCreator: boolean;
		requiresCreation: boolean;
	};
	client: {
		userId: string;
	};
	auth: {
		allVerified: boolean;
		anyVerified: boolean;
		email: string;
	};
};

export type MCBPS_UserCreateResponse = {
	success: boolean;
	auth: {
		allVerified: boolean;
		anyVerified: boolean;
		verifiedProviders: string[];
		unverifiedProviders: string[];
	};
	user: {
		username: string;
		displayName: string;
		aboutMeMarkdown: string;
		aboutMeHtml: string;
		profileImageUrl: string;
		isCreator: boolean;
		updatedAt: string;
		createdAt: string;
	};
};

export type MCBPS_ProjectCreateResponse = {
	success: boolean;
	project: {
		id: string;
		contentType: ProjectContentType;
		postTitle: string;
		postDescription: string | null;
		status: ProjectStatus;
		isPublic: boolean | null;
		projectName: string;
		monetization: ProjectMonetization;
		ownerId: string;
		publisherId: string;
		createdAt: Date | null;
		updatedAt: Date | null;
	};
};
