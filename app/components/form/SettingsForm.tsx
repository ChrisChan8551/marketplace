'use client';

import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useFormState } from 'react-dom';

import { useEffect } from 'react';
import { toast } from 'sonner';
// import { type State, UpdateUserSettings } from '@/app/actions';
import { Submitbutton } from '../SubmitButtons';

interface iAppProps {
	firstName: string;
	lastName: string;
	email: string;
}

export function SettingsForm({ email, firstName, lastName }: iAppProps) {
	return (
		<form>
			<CardHeader>
				<CardTitle>Settings</CardTitle>
				<CardDescription>
					Here you will find settings regarding your account
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-y-5'>
				<div className='flex flex-col gap-y-2'>
					<Label>First Name</Label>
					<Input
						name='firstName'
						type='text'
						defaultValue={firstName}
					/>
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Last Name</Label>
					<Input
						name='lastName'
						type='text'
						defaultValue={lastName}
					/>
				</div>

				<div className='flex flex-col gap-y-2'>
					<Label>Email</Label>
					<Input
						name='email'
						type='email'
						disabled
						defaultValue={email}
					/>
				</div>
			</CardContent>
			<CardFooter>
				<Submitbutton title='Update settings' />
			</CardFooter>
		</form>
	);
}
