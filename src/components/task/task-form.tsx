import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { emptyTask, Task } from '@/lib/task/task.type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addTask, editTask, getTaskPath } from '@/lib/task/task.repository';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { collection, doc, setDoc } from 'firebase/firestore';
import { parse } from 'date-fns';
import { format, addSeconds, startOfDay } from 'date-fns';
import { TIME } from '@/lib/consts';
import { Image } from 'lucide-react';
import { ImageDialog } from '@/components/ImageDialog';

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

	const { user } = useAuth();

	function close() {
		setImageFile(null);
		setTaskIn(null);
	}

	async function handleSubmit() {
		if (!user || !taskIn) return;
		if (taskIn.id) {
			await editTask(user.uid, routineId, taskIn, imageFile);
		} else {
			await addTask(user.uid, routineId, taskIn, imageFile);
		}
		close();
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setImageFile(e.target.files[0]);
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!taskIn) return;
		setTaskIn({ ...taskIn, [e.target.name]: e.target.value });
	}

	function handleDuration(e: React.ChangeEvent<HTMLInputElement>) {
		if (!taskIn) return;
		const durationInSeconds = convertDurationToSeconds(e.target.value);

		setTaskIn({ ...taskIn, durationInSeconds });
	}

	function convertDurationToSeconds(durationHHmm: string): number {
		const date = parse(durationHHmm, TIME, new Date()); // Parse into Date object
		return date.getHours() * 3600 + date.getMinutes() * 60;
	}

	function convertDurationToHHmm(durationInSeconds: number): string {
		const date = addSeconds(startOfDay(new Date()), durationInSeconds); // Start from midnight and add seconds
		return format(date, TIME); // Format to HH:mm
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
								<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
									<Field className="sm:col-span-2">
										<Label>
											<div className="flex justify-between">
												<span>Upload Image</span>
												{taskIn.image && (
													<button onClick={() => setIsImageOpen(true)}>
														<Image className="w-5 h-5 text-green-500" />
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
										<Label>Duration (hh:mm)</Label>
										<Input
											type="time"
											value={convertDurationToHHmm(taskIn.durationInSeconds)}
											name="durationInSeconds"
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
