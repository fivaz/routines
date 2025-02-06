'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Button } from '@/components/base/button';
import { RoutineForm } from '@/components/RoutineForm';
import { Routine } from '@/lib/routine/type';

export default function Routines() {
	const [routines, setRoutines] = useState<Routine[]>([
		{
			id: '1',
			name: 'brush teeth',
			image: '/brushing-teeth.png',
		},
		{
			id: '2',
			name: 'read the bible',
			image: '/reading-the-bible.png',
		},
	]);

	const [isRoutineFormOpen, setIsRoutineFormOpen] = useState(false);

	// useEffect(() => {
	// 	const fetchRoutines = async () => {
	// 		const querySnapshot = await getDocs(collection(db, 'routines'));
	// 		setRoutines(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Routine[]);
	// 	};
	// 	void fetchRoutines();
	// }, []);

	return (
		<div className="p-4 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-4">Routines</h1>
			<div className="space-y-4">
				{routines.map((routine) => (
					<div
						key={routine.id}
						className="relative bg-gray-800 text-white p-4 h-40 flex items-end bg-cover bg-center"
						style={{ backgroundImage: "url('/default-image.jpg')" }}
					>
						<p className="bg-black bg-opacity-50 p-2 text-lg">{routine.name}</p>
					</div>
				))}
			</div>
			<Button type="button" onClick={() => setIsRoutineFormOpen(true)}>
				New Routine
			</Button>

			<RoutineForm isOpen={isRoutineFormOpen} setIsOpen={setIsRoutineFormOpen} />
		</div>
	);
}
