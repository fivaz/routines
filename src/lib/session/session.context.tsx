import { createContext, useContext } from 'react';
import { Session } from '@/lib/session/session.type';

const SessionContext = createContext<{
	sessions: Session[];
	handleSessionsSort: (sessions: Session[]) => void;
}>({
	sessions: [],
	handleSessionsSort: () => {},
});
//
// export function SessionProvider({ children }: PropsWithChildren) {
// 	const { user } = useAuth();
// 	const [sessions, setSessions] = useState<Session[]>([]);
// 	useEffect(() => {
// 		if (!user?.uid) {
// 			return;
// 		}
//
// 		const unsubscribe = fetchSessions(user.uid, taskId, (sessions) => {
// 			setSessions(sessions);
// 		});
//
// 		return () => unsubscribe();
// 	}, [user]);
//
// 	function handleSessionsSort(sessions: Session[]) {
// 		if (!user?.uid) {
// 			return safeThrowUnauthorized();
// 		}
// 		void updateSessions(user.uid, sessions);
// 	}
//
// 	return (
// 		<SessionContext.Provider value={{ sessions, handleSessionsSort }}>
// 			{children}
// 		</SessionContext.Provider>
// 	);
// }

export const useSessions = () => useContext(SessionContext);
