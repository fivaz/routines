import { Input } from '@/components/base/input';

export function ImageInput({
	image,
	onChange,
}: {
	image: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	if (image === 'error') {
		return <div>error</div>;
	}

	if (image === 'waiting_image') {
		return <div>waiting image</div>;
	}

	return (
		<Input
			type="file"
			accept="image/*"
			onChange={onChange}
			innerClassName="bg-cover bg-center"
			style={{ backgroundImage: `url(${image})` }}
		/>
	);
}
