export interface NavLink {
	id: number;
	name: string;
	href: string;
}

export const navbarLinks: NavLink[] = [
	{
		id: 0,
		name: 'Home',
		href: '/',
	},
	{
		id: 1,
		name: 'Templates',
		href: '/products/template',
	},
	{
		id: 2,
		name: 'Ui Kits',
		href: '/products/uikit',
	},
	{
		id: 3,
		name: 'Icons',
		href: '/products/icon',
	},
];
