'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/routine/routine-form';
import { type Routine } from '@/lib/routine/routine.type';
import { DB_PATH } from '@/lib/consts';
import { getRoutinePath } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { PlusIcon } from '@heroicons/react/16/solid';
import { RoutineRow } from '@/components/routine/routine-row';

export default function Routines() {
	const [loading, setLoading] = useState(true);
	const [routines, setRoutines] = useState<Routine[]>([]);

	const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);

	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;

		const routineCollectionRef = collection(db, getRoutinePath(user.uid));

		const unsubscribe = onSnapshot(routineCollectionRef, (snapshot) => {
			const routineData: Routine[] = [];
			snapshot.forEach((doc) => {
				routineData.push({ ...doc.data(), id: doc.id } as Routine);
			});

			console.log(routineData);
			setRoutines(routineData);
			setLoading(false);
		});

		return () => unsubscribe();
	}, [user]);

	if (loading) return <div>Loading...</div>;

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-2xl font-bold mb-4 text-green-500">Routines</h1>
				<div className="flex flex-col gap-2">
					{routines.map((routine) => (
						<RoutineRow routine={routine} key={routine.id} />
					))}
				</div>
				<div className="absolute bottom-2 m-auto left-1/2 -translate-x-1/2">
					<Button
						className="w-40"
						color="green"
						type="button"
						onClick={() => setIsRoutineFormOpen(true)}
					>
						<PlusIcon />
						New Routine
					</Button>
				</div>

				<RoutineForm isOpen={isRoutineFormOpen} setIsOpen={setIsRoutineFormOpen} />
			</div>
		</div>
	);
}
