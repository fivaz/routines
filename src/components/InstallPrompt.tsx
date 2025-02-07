import { useEffect, useState } from 'react';
import { Dialog, DialogBody, DialogDescription, DialogTitle } from './base/dialog';

export function InstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) &&
				!(window as unknown as { MSStream: boolean }).MSStream,
		);

		setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
	}, []);

	if (isStandalone) {
		return null; // Don't show install button if already installed
	}

	return (
		<Dialog open={!isStandalone} onClose={() => setIsStandalone(true)}>
			<DialogTitle>Install App</DialogTitle>
			<DialogDescription>
				<button>Add to Home Screen</button>
			</DialogDescription>
			{isIOS && (
				<DialogBody>
					<p className="dark:text-white">
						To install this app on your iOS device, tap the share button
						<span role="img" aria-label="share icon">
							{' '}
							⎋{' '}
						</span>
						and then &#34;Add to Home Screen&#34;
						<span role="img" aria-label="plus icon">
							{' '}
							➕{' '}
						</span>
						.
					</p>
				</DialogBody>
			)}
		</Dialog>
	);
}
