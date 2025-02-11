import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { Task } from '@/lib/task/task.type';
import { addTask, editTask } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/auth-context';
import { addSeconds, format, parse, startOfDay } from 'date-fns';
import { HHmmss } from '@/lib/consts';
import { ImageIcon, ImageUpscaleIcon, Loader2 } from 'lucide-react';
import { ImageDialog } from '@/components/ImageDialog';
import { Textarea } from '@/components/base/textarea';
import { generateImage } from '@/app/(dashboard)/routine/[routineId]/actions';

export function TaskForm({
	setTaskIn,
	routineId,
	taskIn,
}: React.PropsWithChildren<{
	setTaskIn: Dispatch<SetStateAction<Task | null>>;
	routineId: string;
	taskIn: Task | null;
}>) {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isImageOpen, setIsImageOpen] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { user } = useAuth();

	function close() {
		setImageFile(null);
		setTaskIn(null);
	}

	async function handleSubmit() {
		if (!user || !taskIn) return;
		if (taskIn.id) {
			void editTask(user.uid, routineId, taskIn, imageFile);
		} else {
			void addTask(user.uid, routineId, taskIn, imageFile);
		}
		close();
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setImageFile(e.target.files[0]);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		if (!taskIn) return;
		setTaskIn({ ...taskIn, [e.target.name]: e.target.value });
	}

	function handleDuration(e: React.ChangeEvent<HTMLInputElement>) {
		if (!taskIn) return;
		const durationInSeconds = convertDurationToSeconds(e.target.value);

		setTaskIn({ ...taskIn, durationInSeconds });
	}

	function convertDurationToSeconds(durationHHmmss: string): number {
		const date = parse(durationHHmmss, HHmmss, new Date()); // Parse into Date object
		return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
	}

	function convertDurationToHHmmss(durationInSeconds: number): string {
		const date = addSeconds(startOfDay(new Date()), durationInSeconds); // Start from midnight and add seconds
		return format(date, HHmmss); // Format to HH:mm
	}

	async function handleImageGeneration() {
		console.log('image generation will be implemented soon...');
		if (!taskIn) return;
		setLoading(true);

		try {
			const result = await generateImage(taskIn.name);
			setTaskIn({ ...taskIn, image: result.imageUrl });
		} catch (err) {
			setError('Failed to generate image. Please try again.');
			console.error('Error:', err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={taskIn !== null} onClose={close}>
			{taskIn && (
				<>
					<DialogTitle>
						<div className="text-lg text-green-500">{taskIn.id ? 'Edit' : 'Create'} task</div>
					</DialogTitle>

					<DialogBody>
						<Fieldset>
							<FieldGroup>
								<Field>
									<Label>Name</Label>
									<Input name="name" value={taskIn.name} onChange={handleChange} />
								</Field>
								<Field>
									<Label>Name</Label>
									<Textarea name="description" value={taskIn.description} onChange={handleChange} />
								</Field>
								<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
									<Field className="sm:col-span-2">
										<Label>
											<div className="flex justify-between">
												<span>Upload Image</span>
												{taskIn.image ? (
													<button onClick={() => setIsImageOpen(true)}>
														<ImageUpscaleIcon className="w-5 h-5 text-green-500" />
													</button>
												) : (
													<button onClick={handleImageGeneration} disabled={loading}>
														{loading ? (
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														) : (
															<ImageIcon className="w-5 h-5 text-green-500" />
														)}
													</button>
												)}
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
										<Label>Duration</Label>
										<Input
											type="time"
											value={convertDurationToHHmmss(taskIn.durationInSeconds)}
											name="durationInSeconds"
											step="1"
											onChange={handleDuration}
										/>
									</Field>
								</div>
							</FieldGroup>
						</Fieldset>
					</DialogBody>

					<DialogActions>
						<Button plain onClick={close}>
							Cancel
						</Button>
						<Button color="green" onClick={handleSubmit}>
							{taskIn.id ? 'Edit' : 'Create'}
						</Button>
					</DialogActions>
					<ImageDialog image={taskIn.image} isOpen={isImageOpen} setIsOpen={setIsImageOpen} />
				</>
			)}
		</Dialog>
	);
}
