export const Routes = {
	ROOT: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	CATEGORIES: '/categories',
	ROUTINE: (routineId: string) => `/routine/${routineId}`,
	FOCUS: (routineId: string) => `/routine/${routineId}/focus`,
	RECAP: (routineId: string) => `/routine/${routineId}/recap`,
	FINISH: (routineId: string) => `/routine/${routineId}/finish`,
};

// firebase paths
export const DB_PATH = {
	AVATARS: 'avatars',
	ROUTINES: 'routines',
	TASKS: 'tasks',
	USERS: 'users',
	CATEGORIES: 'categories',
	SESSIONS: 'sessions',
};

export const yyyyMMdd = 'yyyy-MM-dd';
export const mmss = 'mm:ss';
export const APP_NAME = 'Routines';
