import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserNav() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='relative h-10 w-10 rounded-full'
				>
					<Avatar className='h-10 w-10'>
						<AvatarFallback>Avatar</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
		</DropdownMenu>
	);
}
