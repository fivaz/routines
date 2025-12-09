export const Routes = {
	ROOT: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	CATEGORIES: '/categories',
	ROUTINE: (routineId: string) => `/routine/${routineId}`,
	FOCUS: (routineId: string, taskIndex: number) => `/routine/${routineId}/focus?index=${taskIndex}`,
	RECAP: (routineId: string) => `/routine/${routineId}/recap`,
	FINISH: (routineId: string) => `/routine/${routineId}/finish`,
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const SESSION_COOKIE = process.env.SESSION_COOKIE || '__user_token';

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
