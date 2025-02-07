import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { emptyRoutine, Routine } from '@/lib/routine/routine.type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addRoutine, getRoutinePath } from '@/lib/routine/routine.repository';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { collection, doc, setDoc } from 'firebase/firestore';
export function RoutineForm({
	isOpen,
	setIsOpen,
}: React.PropsWithChildren<{ isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }>) {
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);

	const [imageFile, setImageFile] = useState<File | null>(null);

	const { user } = useAuth();

	function close() {
		setImageFile(null);
		setRoutine(emptyRoutine);
		setIsOpen(false);
	}

	async function handleAddRoutine() {
		if (!user) return;
		await addRoutine(user.uid, routine, imageFile);
		close();
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImageFile(e.target.files[0]);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRoutine({ ...routine, [e.target.name]: e.target.value });
	};

	return (
		<>
			<Dialog open={isOpen} onClose={setIsOpen}>
				<DialogTitle>
					<div className="text-lg text-green-500">Create routine</div>
				</DialogTitle>
				<DialogBody>
					<Field>
						<Label>Name</Label>
						<Input name="name" onChange={handleChange} />
					</Field>
					<Field>
						<Label>Upload Image</Label>
						<Input type="file" onChange={handleFileChange} />
					</Field>
				</DialogBody>
				<DialogActions>
					<Button plain onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button color="green" onClick={handleAddRoutine}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
