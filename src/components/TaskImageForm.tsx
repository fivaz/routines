import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Field as HeadlessField,
	Label as HeadlessLabel,
	RadioGroup as HeadlessRadioGroup,
} from '@headlessui/react';
import { Field, FieldGroup, Label } from '@/components/base/fieldset';
import { ChevronDownIcon, ImageIcon } from 'lucide-react';
import { Radio } from '@/components/base/radio';
import { ImageFocus, Task } from '@/lib/task/task.type';
import { ImageDialogButton } from '@/components/ImageDialogButton';
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/base/button';
import { editTask, generateTaskImage } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/user/auth-context';
import { useBackendStatus } from '@/lib/use-backend-status';
import { Input } from '@/components/base/input';

export function TaskImageForm({
	taskIn,
	setTaskIn,
	setImageFile,
	setFocus,
	routineId,
	close,
}: {
	taskIn: Task;
	routineId: string;
	focus: ImageFocus;
	setTaskIn: Dispatch<SetStateAction<Task | null>>;
	setImageFile: Dispatch<SetStateAction<File | null>>;
	setFocus: Dispatch<SetStateAction<ImageFocus>>;
	close: () => void;
}) {
	const { user } = useAuth();
	const { status } = useBackendStatus();

	async function handleImageGeneration(imageFocus: ImageFocus) {
		if (!user || !taskIn) return;

		const tokenId = await user.getIdToken();

		const image = await generateTaskImage({
			routineId,
			taskId: taskIn.id,
			taskName: taskIn.name,
			focus: imageFocus,
			tokenId,
		});

		const taskWithImage = { ...taskIn, image };

		setTaskIn(taskWithImage);

		void editTask({
			userId: user.uid,
			routineId,
			newRoutineId: routineId,
			imageFile: null,
			task: taskWithImage,
		});

		close();
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();

			reader.onload = (e) => {
				if (e.target?.result) {
					setTaskIn({ ...taskIn, image: e.target.result as string });
				}
			};

			reader.readAsDataURL(file);
		}
	}

	function handleImageFocus(value: string) {
		setFocus(value as ImageFocus);
	}

	return (
		<Disclosure as="div" className="border rounded-md p-2 dark:border-white border-gray-200 shadow">
			<DisclosureButton className="group flex w-full items-center justify-between">
				<Label className="font-semibold">Image</Label>
				<ChevronDownIcon className="size-5 group-data-[open]:rotate-180 dark:text-white" />
			</DisclosureButton>
			<DisclosurePanel className="p-2 text-sm/5 text-white/50">
				<FieldGroup>
					<Field>
						<Label>
							<div className="flex justify-between items-center">
								<span>Upload Image</span>
								{taskIn.image && <ImageDialogButton image={taskIn.image} />}
							</div>
						</Label>
						<Input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							innerClassName="bg-cover bg-center"
							style={{ backgroundImage: `url(${taskIn.image})` }}
						/>
					</Field>
					{taskIn.id ? (
						<Field>
							<Label>Or generate an image for:</Label>
							<div className="grid grid-cols-2 gap-2 mt-5">
								<Button
									className="col-span-2 md:col-span-1"
									color="green"
									isLoading={status === 'loading'}
									disabled={status !== 'success'}
									onClick={() => handleImageGeneration('person')}
								>
									<ImageIcon className="block md:hidden" />
									the person of the task
								</Button>

								<Button
									className="col-span-2 md:col-span-1"
									color="green"
									isLoading={status === 'loading'}
									disabled={status !== 'success'}
									onClick={() => handleImageGeneration('object')}
								>
									<ImageIcon className="block md:hidden" />
									the object of the task
								</Button>
							</div>
						</Field>
					) : (
						<Field>
							<Label>Or let an image be generated for:</Label>
							<HeadlessRadioGroup
								name="generate"
								defaultValue="person"
								className="mt-4 grid grid-cols-2 items-center justify-center gap-2"
								onChange={handleImageFocus}
							>
								<HeadlessField className="col-span-2 md:col-span-1 flex items-center gap-2">
									<Radio value="person" color="green" />
									<HeadlessLabel className="text-base/6 select-none sm:text-sm/6 text-gray-800 dark:text-white">
										the person of the task
									</HeadlessLabel>
								</HeadlessField>
								<HeadlessField className="col-span-2 md:col-span-1 flex items-center gap-2">
									<Radio value="object" color="green" />
									<HeadlessLabel className="text-base/6 select-none sm:text-sm/6 text-gray-800 dark:text-white">
										the object of the task
									</HeadlessLabel>
								</HeadlessField>
							</HeadlessRadioGroup>
						</Field>
					)}
				</FieldGroup>
			</DisclosurePanel>
		</Disclosure>
	);
}
