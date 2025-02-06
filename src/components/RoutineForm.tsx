import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { Routine } from '@/lib/routine/routine.type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getRoutinePath } from '@/lib/routine/routine.repository';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { collection, doc, setDoc } from 'firebase/firestore';
export function RoutineForm({
	isOpen,
	setIsOpen,
}: React.PropsWithChildren<{ isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }>) {
	const emptyRoutine = {
		id: '',
		name: '',
		image: '',
	};
	const [routine, setRoutine] = useState<Routine>(emptyRoutine);

	const [imageFile, setImageFile] = useState<File | null>(null);

	const { user } = useAuth();

	async function addRoutine() {
		if (!user) return;
		console.log('addRoutine');

		const newRoutineRef = doc(collection(db, getRoutinePath(user.uid)));

		const imageRef = ref(storage, `${getRoutinePath(user.uid)}/${newRoutineRef.id}`);

		let newRoutine = routine;
		if (imageFile) {
			await uploadBytes(imageRef, imageFile);

			const imageLink = await getDownloadURL(imageRef);

			console.log('imageLink', imageLink);
			const routineWithImage = { ...routine, image: imageLink };
			console.log('routine string', JSON.stringify(routineWithImage));

			newRoutine = { ...routine, image: imageLink };
			setImageFile(null);
		}
		setDoc(newRoutineRef, newRoutine);
		// setRoutine(emptyRoutine);
		setIsOpen(false);
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
				<DialogTitle>Create routine</DialogTitle>
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
					<Button onClick={addRoutine}>Create</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
