// <Dialog>
// 	<DialogTrigger asChild>
// 		<Button className="w-full mt-4 flex items-center gap-2">
// 			<Plus /> New Routine
// 		</Button>
// 	</DialogTrigger>
// 	<DialogContent>
// 		<DialogHeader>
// 			<DialogTitle>Add New Routine</DialogTitle>
// 		</DialogHeader>
// 		<Input
// 			value={newRoutine}
// 			onChange={(e) => setNewRoutine(e.target.value)}
// 			placeholder="Routine Name"
// 		/>
// 		<Button className="w-full mt-2" onClick={addRoutine}>
// 			Save
// 		</Button>
// 	</DialogContent>
// </Dialog>;

import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, SetStateAction, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { Routine } from '@/lib/routine/type';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

	const addRoutine = async () => {
		if (!imageFile) return;

		const imageRef = ref(storage, `users/1/routines-2/${imageFile.name}`);
		await uploadBytes(imageRef, imageFile);

		setRoutine({ ...routine, image: await getDownloadURL(imageRef) });

		addDoc(collection(db, 'routines'), routine);
		setImageFile(null);
		setRoutine(emptyRoutine);
		setIsOpen(false);
	};

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
