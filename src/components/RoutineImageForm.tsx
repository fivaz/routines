import { Field, Label } from '@/components/base/fieldset';
import { Routine } from '@/lib/routine/routine.type';
import { ImageDialogButton } from '@/components/ImageDialogButton';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { editRoutine } from '@/lib/routine/routine.repository';
import { Button } from '@/components/base/button';
import { ImageIcon } from 'lucide-react';
import { useBackendStatus } from '@/lib/use-backend-status';
import { Input } from '@/components/base/input';
import { useAtomValue } from 'jotai/index';
import { currentUserAtom } from '@/lib/auth/user.type';
import { generateRoutineImage } from '@/app/(dashboard)/routine/action';

export function RoutineImageForm({
	routineIn,
	setRoutineIn,
	setImageFile,
	close,
}: {
	routineIn: Routine;
	setRoutineIn: Dispatch<SetStateAction<Routine | null>>;
	setImageFile: Dispatch<SetStateAction<File | null>>;
	close: () => void;
}) {
	const user = useAtomValue(currentUserAtom);
	const { status } = useBackendStatus();
	const [loading, setLoading] = useState(false);

	async function handleImageGeneration() {
		if (!user || !routineIn) return;

		setLoading(true);

		const image = await generateRoutineImage(routineIn.id, routineIn.name);

		const routineWithImage = { ...routineIn, image };

		setRoutineIn(routineWithImage);

		void editRoutine(user.uid, routineWithImage, null);

		close();
	}

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();

			reader.onload = (e) => {
				if (e.target?.result) {
					setRoutineIn({ ...routineIn, image: e.target.result as string });
				}
			};

			reader.readAsDataURL(file);
		}
	}

	return (
		<div className="grid grid-cols-3 gap-6 md:gap-2">
			<Field className={routineIn.id ? 'col-span-3 md:col-span-2' : 'col-span-3'}>
				<Label>
					<div className="flex items-center justify-between">
						<span>Upload Image</span>
						{routineIn.image && <ImageDialogButton image={routineIn.image} />}
					</div>
				</Label>
				<Input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					innerClassName="bg-cover bg-center"
					style={{ backgroundImage: `url(${routineIn.image})` }}
				/>
			</Field>
			{routineIn.id && (
				<Field className="col-span-3 flex flex-col justify-between gap-2 md:col-span-1">
					<Label>Or generate image</Label>
					<Button
						isLoading={loading || status === 'loading'}
						disabled={status !== 'success'}
						color="green"
						onClick={handleImageGeneration}
					>
						<ImageIcon />
						generate
					</Button>
				</Field>
			)}
		</div>
	);
}
