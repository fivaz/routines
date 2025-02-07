import { Dialog } from '@/components/base/dialog';
import { Dispatch, SetStateAction } from 'react';

export function ImageDialog({
	isOpen,
	setIsOpen,
	image,
}: {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	image: string;
}) {
	return (
		<Dialog open={isOpen} onClose={setIsOpen}>
			<img src={image} alt="image" />
		</Dialog>
	);
}
