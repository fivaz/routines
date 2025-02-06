'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/RoutineForm';
import { type Routine } from '@/lib/routine/routine.type';
import { DB_PATH } from '@/lib/consts';
import { getRoutinePath } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/auth-context';
import { PlusIcon } from '@heroicons/react/16/solid';

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
				<div className="space-y-4">
					{routines.map((routine) => (
						<div
							key={routine.id}
							className="relative bg-gray-800 text-white p-4 h-40 flex items-end bg-cover bg-center"
							style={{ backgroundImage: `url('${routine.image}')` }}
						>
							<p className="bg-black bg-opacity-50 p-2 text-lg">{routine.name}</p>
						</div>
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
