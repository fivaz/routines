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
import { ArrowRightStartOnRectangleIcon, UserIcon } from '@heroicons/react/16/solid';
import { useAuth } from '@/lib/auth-context';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { APP_NAME, Routes } from '@/lib/consts';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [{ label: 'Home', url: '/' }];

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
							<Logo className="text-green-500 w-5 h-5" />
							<NavbarLabel>{APP_NAME}</NavbarLabel>
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
						<ThemeToggle />
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
							<DropdownButton as={SidebarItem} className="lg:mb-2.5">
								<Logo className="text-green-500 w-5 h-5" />
								<SidebarLabel>{APP_NAME}</SidebarLabel>
							</DropdownButton>
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
