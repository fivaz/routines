import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	PropsWithChildren,
	SetStateAction,
	useState,
} from 'react';
import { ImageFocus, Task } from '@/lib/task/task.type';
import { addSeconds, format, isValid, parse, startOfDay } from 'date-fns';
import { mmss } from '@/lib/consts';
import { Listbox, ListboxOption } from '@/components/base/listbox';
import { useRoutines } from '@/lib/routine/routine.context';
import { TaskImageForm } from '@/components/TaskImageForm';
import { useTaskActions } from '@/lib/task/task.hooks';
import { safeThrow } from '@/lib/error-handle';

export function TaskForm({
	setTaskIn,
	routineId,
	taskIn,
}: PropsWithChildren<{
	setTaskIn: Dispatch<SetStateAction<Task | null>>;
	routineId: string;
	taskIn: Task | null;
}>) {
	const { routines } = useRoutines();
	const [newRoutineId, setNewRoutineId] = useState<string>(routineId);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [focus, setFocus] = useState<ImageFocus>('person');
	const { addTask, editTask } = useTaskActions();

	function close() {
		setImageFile(null);
		setTaskIn(null);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!taskIn) return;

		try {
			if (taskIn.id) {
				void editTask({
					routineId,
					newRoutineId,
					task: taskIn,
					imageFile,
				});
			} else {
				void addTask({
					task: taskIn,
					routineId: newRoutineId,
					imageFile,
					focus,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			close();
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		if (!taskIn) return;
		setTaskIn({ ...taskIn, [e.target.name]: e.target.value });
	}

	function handleDuration(e: ChangeEvent<HTMLInputElement>) {
		if (!taskIn) return;
		const durationInSeconds = convertDurationToSeconds(e.target.value);

		setTaskIn({ ...taskIn, durationInSeconds });
	}

	function convertDurationToSeconds(durationMmss: string): number {
		const date = parse(durationMmss, mmss, new Date());

		if (!isValid(date)) {
			const errorMessage = `Invalid time format: ${durationMmss}. Expected format: 'mm:ss'`;

			safeThrow(errorMessage);

			return 60;
		}

		const [minutes, seconds] = durationMmss.split(':').map(Number);
		return minutes * 60 + seconds;
	}

	function convertDurationToHHmmss(durationInSeconds: number): string {
		const date = addSeconds(startOfDay(new Date()), durationInSeconds); // Start from midnight and add seconds
		return format(date, mmss); // Format to mm:ss
	}

	function handleSelect(routineId: string) {
		setNewRoutineId(routineId);
	}

	return (
		<Dialog open={taskIn !== null} onClose={close}>
			<form onSubmit={handleSubmit}>
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
											<Listbox
												className="mt-3"
												name="routineId"
												value={newRoutineId}
												onChange={handleSelect}
											>
												{routines.map((routine) => (
													<ListboxOption key={routine.id} value={routine.id}>
														{routine.name}
													</ListboxOption>
												))}
											</Listbox>
										</Field>
										<Field>
											<Label>Duration (mm:ss)</Label>
											<Input
												type="time"
												value={convertDurationToHHmmss(taskIn.durationInSeconds)}
												name="durationInSeconds"
												onChange={handleDuration}
											/>
										</Field>
									</div>

									<div className="mt-6">
										<TaskImageForm
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
							<Button color="green" type="submit">
								{taskIn.id ? 'Edit' : 'Create'}
							</Button>
						</DialogActions>
					</>
				)}
			</form>
		</Dialog>
	);
}
