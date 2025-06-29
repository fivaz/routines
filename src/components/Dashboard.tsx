'use client';
import { Avatar } from '@/components/base/avatar';
import useRouterWithQuery from '@/lib/utils.hook';
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from '@/components/base/dropdown';
import {
	Navbar,
	NavbarDivider,
	NavbarItem,
	NavbarLabel,
	NavbarSection,
	NavbarSpacer,
} from '@/components/base/navbar';
import {
	Sidebar,
	SidebarBody,
	SidebarHeader,
	SidebarItem,
	SidebarSection,
} from '@/components/base/sidebar';
import { StackedLayout } from '@/components/base/stacked-layout';
import { ArrowRightStartOnRectangleIcon, UserIcon } from '@heroicons/react/16/solid';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { APP_NAME, Routes } from '@/lib/consts';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BackEndStatus } from '@/components/BackEndStatus';
import { Tooltip } from '@/components/base/tooltip';
import { useAtomValue } from 'jotai/index';
import { currentUserAtom } from '@/lib/user/user.type';
import { PropsWithChildren } from 'react';

const navItems = [
	{ label: 'Routines', url: Routes.ROOT },
	{ label: 'Categories', url: Routes.CATEGORIES },
];

export function Dashboard({ children }: PropsWithChildren) {
	const user = useAtomValue(currentUserAtom);
	const router = useRouterWithQuery();

	async function handleSignOut() {
		await signOut(auth);
		void router.push(Routes.LOGIN);
	}

	return (
		<StackedLayout
			navbar={
				<Navbar>
					<Dropdown>
						<Tooltip text={process.env.NEXT_PUBLIC_COMMIT_HASH as string}>
							<DropdownButton as={NavbarItem} className="max-lg:hidden">
								<Logo className="size-5 text-green-500" />
								<NavbarLabel>{APP_NAME}</NavbarLabel>
							</DropdownButton>
						</Tooltip>
					</Dropdown>
					<NavbarDivider className="max-lg:hidden" />
					<NavbarSection className="max-lg:hidden">
						{navItems.map(({ label, url }) => (
							<NavbarItem key={label} href={url}>
								{label}
							</NavbarItem>
						))}
					</NavbarSection>
					<NavbarSpacer />
					<NavbarSection>
						<BackEndStatus />
						<ThemeToggle />
						<Dropdown>
							<DropdownButton as={NavbarItem}>
								<Avatar src={user?.photoURL} square />
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="bottom end">
								<DropdownItem href="/my-profile">
									<UserIcon />
									<DropdownLabel>Profile</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem>
									<ArrowRightStartOnRectangleIcon />
									<DropdownLabel onClick={handleSignOut}>Sign out</DropdownLabel>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarSection>
				</Navbar>
			}
			sidebar={
				<Sidebar>
					<SidebarHeader>
						<Dropdown>
							<Tooltip text={process.env.NEXT_PUBLIC_COMMIT_HASH as string}>
								<DropdownButton as={NavbarItem} className="lg:mb-2.5">
									<Logo className="size-5 text-green-500" />
									<NavbarLabel>{APP_NAME}</NavbarLabel>
								</DropdownButton>
							</Tooltip>
						</Dropdown>
					</SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							{navItems.map(({ label, url }) => (
								<SidebarItem key={label} href={url}>
									{label}
								</SidebarItem>
							))}
						</SidebarSection>
					</SidebarBody>
				</Sidebar>
			}
		>
			{children}
		</StackedLayout>
	);
}
