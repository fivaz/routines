import { JSX, PropsWithChildren, ReactNode } from 'react';
import { Label, Listbox, ListboxButton, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';

export function Select<T>({
	value,
	children,
	label,
	name,
	header,
	onChange,
}: PropsWithChildren<{
	name: string;
	value: T;
	onChange: (value: T) => void;
	label: string;
	header: ReactNode;
}>): JSX.Element {
	return (
		<Listbox name={name} value={value} onChange={onChange}>
			<Label className="block text-sm/6 font-medium text-gray-900">{label}</Label>
			<div className="relative mt-2">
				<ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
					<span className="col-start-1 row-start-1 truncate pr-6">{header}</span>
					<ChevronUpDownIcon
						aria-hidden="true"
						className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
					/>
				</ListboxButton>

				<ListboxOptions
					transition
					className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
				>
					{children}
				</ListboxOptions>
			</div>
		</Listbox>
	);
}
