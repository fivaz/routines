import { Button } from '@/components/base/button';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { Routine } from '@/lib/routine/routine.type';
import { RoutineImageForm } from '@/components/RoutineImageForm';
import { useRoutineActions } from '@/lib/routine/routine.hooks';

export function RoutineForm({
	routineIn,
	setRoutineIn,
}: {
	routineIn: Routine | null;
	setRoutineIn: Dispatch<SetStateAction<Routine | null>>;
}) {
	const [imageFile, setImageFile] = useState<File | null>(null);

	const { editRoutine, addRoutine } = useRoutineActions();

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!routineIn) return;
		setRoutineIn({ ...routineIn, [e.target.name]: e.target.value });
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
