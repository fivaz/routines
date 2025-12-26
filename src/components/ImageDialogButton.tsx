import { Dialog } from '@/components/base/dialog';
import { useState } from 'react';
import { ImageUpscaleIcon } from 'lucide-react';
import { Button } from '@/components/base/button';

export function ImageDialogButton({ image }: { image: string }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button plain onClick={() => setIsOpen(true)}>
				<ImageUpscaleIcon className="size-5 text-green-500" />
			</Button>
			<Dialog open={isOpen} onClose={setIsOpen}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={image} alt="image" />
			</Dialog>
		</>
	);
}
