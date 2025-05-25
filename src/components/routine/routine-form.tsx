import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { RoutineImageForm } from '@/components/RoutineImageForm';
import { useRoutineActions } from '@/lib/routine/routine.hooks';
import { categoriesAtom, Category } from '@/lib/category/category.type';
import { Listbox, ListboxLabel, ListboxOption } from '../base/listbox';
import { useAtomValue } from 'jotai/index';

export function RoutineForm({
	routineIn,
	setRoutineIn,
}: {
	routineIn: Routine | null;
	setRoutineIn: Dispatch<SetStateAction<Routine | null>>;
}) {
	const [imageFile, setImageFile] = useState<File | null>(null);

	const { editRoutine, addRoutine } = useRoutineActions();

	const categories = useAtomValue(categoriesAtom);

	function close() {
		setImageFile(null);
		setRoutineIn(null);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!routineIn) return;

		if (routineIn.id) {
			void editRoutine(routineIn, imageFile);
		} else {
			void addRoutine(routineIn, imageFile);
		}
		close();
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!routineIn) return;
		setRoutineIn({ ...routineIn, [e.target.name]: e.target.value });
	};

	const handleSelect = (category: Category | null) => {
		if (!routineIn) return;
		setRoutineIn({ ...routineIn, category });
	};

	return (
		<>
			<Dialog open={routineIn !== null} onClose={close}>
				<form onSubmit={handleSubmit}>
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
											<Label>Category</Label>
											<Listbox
												className="mt-4"
												name="category"
												defaultValue={routineIn.category}
												onChange={handleSelect}
											>
												{categories.map((category) => (
													<ListboxOption value={category} key={category.id}>
														<ListboxLabel>{category.name}</ListboxLabel>
													</ListboxOption>
												))}
											</Listbox>
										</Field>
										<RoutineImageForm
											close={close}
											routineIn={routineIn}
											setRoutineIn={setRoutineIn}
											setImageFile={setImageFile}
										/>
									</FieldGroup>
								</Fieldset>
							</DialogBody>

							<DialogActions>
								<Button plain onClick={close}>
									Cancel
								</Button>
								<Button color="green" type="submit">
									{routineIn.id ? 'Edit' : 'Create'}
								</Button>
							</DialogActions>
						</>
					)}
				</form>
			</Dialog>
		</>
	);
}
