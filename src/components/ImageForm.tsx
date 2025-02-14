import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Field, FieldGroup, Label } from '@/components/base/fieldset';
import { ChevronDownIcon, ImageIcon } from 'lucide-react';
import { Input } from '@/components/base/input';
import { Radio, RadioField, RadioGroup } from '@/components/base/radio';
import { Task } from '@/lib/task/task.type';
import { ImageDialogButton } from '@/components/ImageDialogButton';
import { generateImage, ImageFocus } from '@/app/(dashboard)/routine/[routineId]/actions';
import { Dispatch, SetStateAction, useState } from 'react';
import { Text } from '@/components/base/text';
import { Button } from '@/components/base/button';

export function ImageForm({
	taskIn,
	focus,
	setTaskIn,
	setImageFile,
	setFocus,
}: {
	taskIn: Task;
	focus: ImageFocus;
	setTaskIn: Dispatch<SetStateAction<Task | null>>;
	setImageFile: Dispatch<SetStateAction<File | null>>;
	setFocus: Dispatch<SetStateAction<ImageFocus>>;
}) {
	const [loading, setLoading] = useState(false);
	// const [error, setError] = useState('');
	async function handleImageGeneration() {
		if (!taskIn) return;
		setLoading(true);

		try {
			const image = await generateImage(taskIn.name, focus);
			setTaskIn({ ...taskIn, image });
		} catch (err) {
			// setError('Failed to generate image. Please try again.');
			console.error('Error:', err);
		} finally {
			setLoading(false);
		}
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setImageFile(e.target.files[0]);
		}
	}

	function handleImageFocus(value: string) {
		setFocus(value as ImageFocus);
	}

	return (
		<>
			<Disclosure>
				<DisclosureButton className="group flex w-full items-center justify-between">
					<Label className="font-semibold">Image</Label>
					<ChevronDownIcon className="size-5 group-data-[open]:rotate-180" />
				</DisclosureButton>
				<DisclosurePanel className="mt-2 text-sm/5 text-white/50">
					<FieldGroup>
						<Field>
							<Label>
								<div className="flex justify-between">
									<span>Upload Image</span>
									{taskIn.image && <ImageDialogButton image={taskIn.image} />}
								</div>
							</Label>
							<Input
								type="file"
								onChange={handleFileChange}
								innerClassName="bg-cover bg-center"
								style={{ backgroundImage: `url(${taskIn.image})` }}
							/>
						</Field>
						<Field>
							<Text className="text-center mb-5">Or</Text>
							<Label>
								<div className="flex justify-between items-center">
									Let an image be generated for:
									<Button color="green" onClick={handleImageGeneration}>
										<ImageIcon />
										Generate image
									</Button>
								</div>
							</Label>
							<RadioGroup
								name="resale"
								defaultValue="person"
								className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 items-center"
								onChange={handleImageFocus}
							>
								<RadioField className="mb-0 group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-focus:border-indigo-600 data-focus:ring-2 data-focus:ring-indigo-600">
									<Radio value="person" color="green" />
									<Label>the person of the task</Label>
								</RadioField>
								<RadioField className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-focus:border-indigo-600 data-focus:ring-2 data-focus:ring-indigo-600">
									<Radio value="object" color="green" />
									<Label>the object of the task</Label>
								</RadioField>
							</RadioGroup>
						</Field>
					</FieldGroup>
				</DisclosurePanel>
			</Disclosure>
		</>
	);
}
