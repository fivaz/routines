'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MonitorCogIcon, MoonIcon, SunIcon } from 'lucide-react';

import { DropdownMenu, Dropdown, DropdownItem, DropdownButton } from '@/components/base/dropdown';

export function ThemeToggle3() {
	const { theme, setTheme } = useTheme();

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // Avoid SSR issues
	}

	return (
		<Dropdown>
			<DropdownButton>
				{theme === 'light' ? (
					<SunIcon className="size-5 text-yellow-500" />
				) : theme === 'dark' ? (
					<MoonIcon className="size-5 text-indigo-500" />
				) : (
					<MonitorCogIcon className="size-5 text-gray-500" />
				)}
				<span className="sr-only">Toggle theme</span>
			</DropdownButton>
			<DropdownMenu>
				<DropdownItem className="flex gap-3" onClick={() => setTheme('light')}>
					<SunIcon className="size-5 text-yellow-500" />
					<span>Light</span>
				</DropdownItem>
				<DropdownItem className="flex gap-3" onClick={() => setTheme('dark')}>
					<MoonIcon className="size-5 text-indigo-500" />
					<span>Dark</span>
				</DropdownItem>
				<DropdownItem className="flex gap-3" onClick={() => setTheme('system')}>
					<MonitorCogIcon className="size-5 text-gray-500" />
					<span>System</span>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
