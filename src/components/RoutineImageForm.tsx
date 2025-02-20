import { Field, Label } from '@/components/base/fieldset';
import { Routine } from '@/lib/routine/routine.type';
import { ImageDialogButton } from '@/components/ImageDialogButton';
import { Dispatch, SetStateAction } from 'react';
import { editRoutine, generateRoutineImage } from '@/lib/routine/routine.repository';
import { useAuth } from '@/lib/user/auth-context';
import { Button } from '@/components/base/button';
import { ImageIcon } from 'lucide-react';
import useBackendStatus from '@/lib/use-backend-status';
import { Input } from '@/components/base/input';

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
	const { user } = useAuth();
	const { status } = useBackendStatus();

	async function handleImageGeneration() {
		if (!user || !routineIn) return;

		const tokenId = await user.getIdToken();

		const image = await generateRoutineImage(routineIn.id, routineIn.name, tokenId);

		const routineWithImage = { ...routineIn, image };

		setRoutineIn(routineWithImage);

		void editRoutine(user.uid, routineWithImage, null);

		close();
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
		<div className="grid grid-cols-3 md:gap-2 gap-6">
			<Field className={routineIn.id ? 'col-span-3 md:col-span-2' : 'col-span-3'}>
				<Label>
					<div className="flex justify-between items-center">
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
				<Field className="col-span-3 md:col-span-1 flex flex-col gap-2 justify-between">
					<Label>Or generate image</Label>
					<Button
						isLoading={status === 'loading'}
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
