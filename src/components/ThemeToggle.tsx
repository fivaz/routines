import { Button } from '@/components/base/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		// Check initial theme preference
		if (
			localStorage.theme === 'dark' ||
			(!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			setDarkMode(true);
			document.documentElement.classList.add('dark');
		}
	}, []);

	const toggleTheme = () => {
		if (darkMode) {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		} else {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		}
		setDarkMode(!darkMode);
	};

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
