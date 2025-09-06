'use client';
import { Button } from '@/components/base/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';

// Check initial theme preference
const prefersDark =
	typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const darkModeAtom = atomWithStorage('darkMode', prefersDark);

export function ThemeToggle() {
	const [darkMode, setDarkMode] = useAtom(darkModeAtom);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [darkMode]);

	const toggleTheme = () => setDarkMode(!darkMode);

	return (
		<Button outline onClick={toggleTheme}>
			{darkMode ? (
				<SunIcon className="size-5 text-yellow-500" />
			) : (
				<MoonIcon className="size-5 text-gray-700" />
			)}
		</Button>
	);
}
