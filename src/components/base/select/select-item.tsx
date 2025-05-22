import { ListboxOption } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { JSX, PropsWithChildren } from 'react';

export function SelectItem({
	value,
	children,
}: PropsWithChildren<{ value: unknown }>): JSX.Element {
	return (
		<ListboxOption
			value={value}
			className="group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
		>
			<span className="block truncate font-normal group-data-selected:font-semibold">
				{children}
			</span>

			<span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
				<CheckIcon aria-hidden="true" className="size-5" />
			</span>
		</ListboxOption>
	);
}
