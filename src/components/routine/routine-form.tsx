import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { emptyRoutine, Routine } from '@/lib/routine/routine.type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addRoutine, editRoutine, getRoutinePath } from '@/lib/routine/routine.repository';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { collection, doc, setDoc } from 'firebase/firestore';
import { addTask, editTask } from '@/lib/task/task.repository';
export function RoutineForm({
	routineIn,
	setRoutineIn,
}: {
	routineIn: Routine | null;
	setRoutineIn: Dispatch<SetStateAction<Routine | null>>;
}) {
	const [imageFile, setImageFile] = useState<File | null>(null);

	const { user } = useAuth();

	function close() {
		setImageFile(null);
		setRoutineIn(null);
	}

	async function handleSubmit() {
		if (!user || !routineIn) return;
		if (routineIn.id) {
			await editRoutine(user.uid, routineIn, imageFile);
		} else {
			await addRoutine(user.uid, routineIn, imageFile);
		}
		close();
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImageFile(e.target.files[0]);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!routineIn) return;
		setRoutineIn({ ...routineIn, [e.target.name]: e.target.value });
	};

	return (
		<>
			<Dialog open={routineIn !== null} onClose={close}>
				{routineIn && (
					<>
						<DialogTitle>
							<div className="text-lg text-green-500">
								{routineIn.id ? 'Edit' : 'Create'} routine
							</div>
						</DialogTitle>

						<DialogBody>
							<Fieldset>
								<FieldGroup>
									<Field>
										<Label>Name</Label>
										<Input value={routineIn.name} name="name" onChange={handleChange} />
									</Field>
									<Field>
										<Label>Upload Image</Label>
										<Input type="file" onChange={handleFileChange} />
									</Field>
								</FieldGroup>
							</Fieldset>
						</DialogBody>

						<DialogActions>
							<Button plain onClick={close}>
								Cancel
							</Button>
							<Button color="green" onClick={handleSubmit}>
								{routineIn.id ? 'Edit' : 'Create'}
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</>
	);
}
