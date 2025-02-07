import { PropsWithChildren } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { Button } from '../base/button';
import { Routes } from '@/lib/consts';
import Link from 'next/link';

export function RoutineRow({ routine }: PropsWithChildren<{ routine: Routine }>) {
	return (
		<Link href={`${Routes.ROUTINE}/${routine.id}`}>
			<div
				className="relative bg-gray-800 text-white p-4 h-40 flex items-end bg-cover bg-center"
				style={{ backgroundImage: `url('${routine.image}')` }}
			>
				<p className="bg-green-500 bg-opacity-50 p-0.5 text-lg">{routine.name}</p>
			</div>
		</Link>
	);
}
