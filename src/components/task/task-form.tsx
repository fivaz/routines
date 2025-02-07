import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { emptyTask, Task } from '@/lib/task/task.type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addTask, getTaskPath } from '@/lib/task/task.repository';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { collection, doc, setDoc } from 'firebase/firestore';
export function TaskForm({
	isOpen,
	setIsOpen,
	routineId,
	task,
}: React.PropsWithChildren<{
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	routineId: string;
	task?: Task;
}>) {
	const [taskIn, setTaskIn] = useState<Task>(task || emptyTask);

	const [imageFile, setImageFile] = useState<File | null>(null);

	const { user } = useAuth();

	function close() {
		setImageFile(null);
		setTaskIn(emptyTask);
		setIsOpen(false);
	}

	async function handleAddTask() {
		if (!user) return;
		await addTask(user.uid, routineId, taskIn, imageFile);
		close();
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImageFile(e.target.files[0]);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTaskIn({ ...taskIn, [e.target.name]: e.target.value });
	};

	return (
		<>
			<Dialog open={isOpen} onClose={setIsOpen}>
				<DialogTitle>
					<div className="text-lg text-green-500">Create task</div>
				</DialogTitle>
				<DialogBody>
					<Fieldset>
						<FieldGroup>
							<Field>
								<Label>Name</Label>
								<Input name="name" onChange={handleChange} />
							</Field>
							<div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
								<Field className="sm:col-span-2">
									<Label>Upload Image</Label>
									<Input type="file" onChange={handleFileChange} />
								</Field>
								<Field>
									<Label>Duration (hh:mm)</Label>
									<Input type="time" name="durationInSeconds" onChange={handleChange} />
								</Field>
							</div>
						</FieldGroup>
					</Fieldset>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button color="green" onClick={handleAddTask}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
