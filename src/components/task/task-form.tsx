import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { ImageFocus, Task } from '@/lib/task/task.type';
import { addTask, editTask } from '@/lib/task/task.repository';
import { useAuth } from '@/lib/user/auth-context';
import { addSeconds, format, parse, startOfDay } from 'date-fns';
import { HHmmss } from '@/lib/consts';
import { Listbox, ListboxOption } from '@/components/base/listbox';
import { useRoutines } from '@/lib/routine/routine.context';
import { ImageForm } from '@/components/ImageForm';

export function TaskForm({
	setTaskIn,
	routineId,
	taskIn,
}: React.PropsWithChildren<{
	setTaskIn: Dispatch<SetStateAction<Task | null>>;
	routineId: string;
	taskIn: Task | null;
}>) {
	const { routines } = useRoutines();
	const [newRoutineId, setNewRoutineId] = useState<string>(routineId);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [focus, setFocus] = useState<ImageFocus>('person');

	const { user } = useAuth();

	function close() {
		setImageFile(null);
		setTaskIn(null);
	}

	async function handleSubmit() {
		if (!user || !taskIn) return;

		try {
			const tokenId = await user.getIdToken();

			if (taskIn.id) {
				void editTask({
					userId: user.uid,
					routineId,
					newRoutineId,
					task: taskIn,
					imageFile,
				});
			} else {
				void addTask({
					userId: user.uid,
					task: taskIn,
					routineId: newRoutineId,
					imageFile,
					focus,
					tokenId,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			close();
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

	function handleSelect(routineId: string) {
		setNewRoutineId(routineId);
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
										<Label>Routine</Label>
										<Listbox name="routineId" value={newRoutineId} onChange={handleSelect}>
											{routines.map((routine) => (
												<ListboxOption key={routine.id} value={routine.id}>
													{routine.name}
												</ListboxOption>
											))}
										</Listbox>
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

								<div className="mt-6">
									<ImageForm
										close={close}
										routineId={routineId}
										taskIn={taskIn}
										focus={focus}
										setFocus={setFocus}
										setTaskIn={setTaskIn}
										setImageFile={setImageFile}
									/>
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
				</>
			)}
		</Dialog>
	);
}
