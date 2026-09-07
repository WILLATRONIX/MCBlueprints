import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
	id: string;
	email: string;
	username?: string;
	displayName?: string;
	aboutMeMarkdown?: string;
	aboutMeHtml?: string;
	isCreator: boolean;
	profileImageUrl?: string;
	updatedAt?: string;
	createdAt: string;
};

type Auth = {
	anyVerified: boolean;
	allVerified: boolean;
	verifiedProviders?: string[];
	unverifiedProviders?: string[];
};

type AuthState = {
	user: User | null;
	auth: Auth | null;
	isAuthenticated: boolean;
	login: (user: User, auth: Auth) => void;
	updateUser: (user: Partial<User>) => void;
	logout: () => void;
	hasHydrated: boolean;
};

export const useAuthZStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			auth: null,
			isAuthenticated: false,
			hasHydrated: false,

			login: (user, auth) =>
				set(() => ({
					user,
					auth,
					isAuthenticated: true,
				})),

			updateUser: (user: Partial<User>) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...user } : state.user,
				})),

			logout: () =>
				set(() => ({
					user: null,
					auth: null,
					isAuthenticated: false,
				})),
		}),
		{
			name: "auth-store",
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.hasHydrated = true;
				}
			},
		},
	),
);
