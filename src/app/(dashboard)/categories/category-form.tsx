import { ChangeEvent, Dispatch, FormEvent, PropsWithChildren, SetStateAction } from 'react';
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/base/dialog';
import { Field, FieldGroup, Fieldset, Label } from '@/components/base/fieldset';
import { Input } from '@/components/base/input';
import { Button } from '@/components/base/button';
import { type Category } from '@/lib/category/category.type';
import { useCategoryActions } from '@/lib/category/category.hooks';

export function CategoryForm({
	categoryIn,
	setCategoryIn,
}: PropsWithChildren<{
	categoryIn: Category | null;
	setCategoryIn: Dispatch<SetStateAction<Category | null>>;
}>) {
	const { addCategory, editCategory } = useCategoryActions();

	function close() {
		setCategoryIn(null);
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!categoryIn) return;

		if (categoryIn.id) {
			void editCategory(categoryIn);
		} else {
			void addCategory(categoryIn);
		}

		close();
	}

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (!categoryIn) return;
		setCategoryIn({ ...categoryIn, [e.target.name]: e.target.value });
	}

	return (
		<Dialog open={categoryIn !== null} onClose={close}>
			<form onSubmit={handleSubmit}>
				{categoryIn && (
					<>
						<DialogTitle>
							<div className="text-lg text-green-500">
								{categoryIn?.id ? 'Edit' : 'Create'} category
							</div>
						</DialogTitle>
						<DialogBody>
							<Fieldset>
								<FieldGroup>
									<Field>
										<Label>Name</Label>
										<Input name="name" value={categoryIn.name} onChange={handleChange} />
									</Field>
								</FieldGroup>
							</Fieldset>
						</DialogBody>
						<DialogActions>
							<Button plain onClick={close}>
								Cancel
							</Button>
							<Button color="green" type="submit">
								{categoryIn?.id ? 'Edit' : 'Create'}
							</Button>
						</DialogActions>
					</>
				)}
			</form>
		</Dialog>
	);
}
