'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/base/button';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function ThemeToggle2() {
	const { theme, setTheme } = useTheme();

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null; // Avoid SSR issues

	return (
		<Button outline onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
			{theme === 'dark' ? (
				<SunIcon className="size-5 text-yellow-500" />
			) : (
				<MoonIcon className="size-5 text-gray-700" />
			)}
		</Button>
	);
}
