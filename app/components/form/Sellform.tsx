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
import { type JSONContent } from '@tiptap/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'sonner';
import { SelectCategory } from '../SelectCategory';
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from '../Editor';

export function SellForm() {
	return (
		<CardHeader>
			<CardTitle>Sell your product with ease</CardTitle>
			<CardDescription>
				Please describe your product here in detail so that it can be
				sold
			</CardDescription>
			<CardContent className='flex flex-col gap-y-10'>
				<Label>Name</Label>
				<Input
					name='name'
					type='text'
					placeholder='Name of your Product'
					required
					minLength={3}
				/>
				<div className='flex flex-col gap-y-2'>
					<Label>Category</Label>
					<SelectCategory />
				</div>
				<div className='flex flex-col gap-y-2'>
					<Label>Price</Label>
					<Input
						placeholder='29$'
						type='number'
						name='price'
						required
						min={1}
					/>
				</div>
				<div className='flex flex-col gap-y-2'>
					<Label>Small Summary</Label>
					<Textarea
						name='smallDescription'
						placeholder='Pleae describe your product shortly right here...'
						required
						minLength={10}
					/>
				</div>
				<div className='flex flex-col gap-y-2'>
					<input type='hidden' name='description' value={''} />
					<Label>Description</Label>
					<TipTapEditor setJson={() => {}} json={null} />
				</div>
			</CardContent>
		</CardHeader>
	);
}
