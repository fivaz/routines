'use client';
import { Avatar } from '@/components/base/avatar';
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
	SidebarLabel,
	SidebarSection,
} from '@/components/base/sidebar';
import { StackedLayout } from '@/components/base/stacked-layout';
import {
	ArrowRightStartOnRectangleIcon,
	ChevronDownIcon,
	Cog8ToothIcon,
	LightBulbIcon,
	PlusIcon,
	ShieldCheckIcon,
	UserIcon,
} from '@heroicons/react/16/solid';
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useAuth } from '@/lib/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Routes } from '@/lib/consts';
import { useRouter } from 'next/navigation';

const navItems = [{ label: 'Routines', url: '/' }];

function TeamDropdownMenu() {
	return (
		<DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
			<DropdownItem href="/teams/1/settings">
				<Cog8ToothIcon />
				<DropdownLabel>Settings</DropdownLabel>
			</DropdownItem>
			<DropdownDivider />
			<DropdownItem href="/teams/1">
				<Avatar slot="icon" src="/tailwind-logo.svg" />
				<DropdownLabel>Tailwind Labs</DropdownLabel>
			</DropdownItem>
			<DropdownItem href="/teams/2">
				<Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
				<DropdownLabel>Workcation</DropdownLabel>
			</DropdownItem>
			<DropdownDivider />
			<DropdownItem href="/teams/create">
				<PlusIcon />
				<DropdownLabel>New team&hellip;</DropdownLabel>
			</DropdownItem>
		</DropdownMenu>
	);
}

export function Dashboard({ children }: React.PropsWithChildren) {
	const { user } = useAuth();
	const router = useRouter();

	async function handleSignOut() {
		await signOut(auth);
		void router.push(Routes.LOGIN);
	}

	if (!user) return;

	return (
		<StackedLayout
			navbar={
				<Navbar>
					<Dropdown>
						<DropdownButton as={NavbarItem} className="max-lg:hidden">
							<Avatar src="/tailwind-logo.svg" />
							<NavbarLabel>Tailwind Labs</NavbarLabel>
						</DropdownButton>
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
						<Dropdown>
							<DropdownButton as={NavbarItem}>
								<Avatar src={user.photoURL} square />
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="bottom end">
								<DropdownItem href="/my-profile">
									<UserIcon />
									<DropdownLabel>Profile</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/logout">
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
							<DropdownButton as={SidebarItem} className="lg:mb-2.5">
								<Avatar src="/tailwind-logo.svg" />
								<SidebarLabel>Tailwind Labs</SidebarLabel>
							</DropdownButton>
							<TeamDropdownMenu />
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
