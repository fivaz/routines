import { DB_PATH } from '@/lib/consts';

export function getRoutinePath(userId: string) {
	return `${DB_PATH.USERS}/${userId}/${DB_PATH.ROUTINES}`;
}
