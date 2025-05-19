import { ProductCard } from '@/app/components/ProductCard';
import prisma from '@/app/lib/db';
import { type CategoryTypes } from '@prisma/client';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

function getDisplayTitle(category: string): string {
	switch (category) {
		case 'uikit':
			return 'UI Kits';
		case 'template':
			return 'Templates';
		case 'icon':
			return 'Icons';
		case 'all':
			return 'Newest Products';
		default:
			return category;
	}
}

async function getData(category: string) {
	let input;

	switch (category) {
		case 'template': {
			input = 'template';
			break;
		}
		case 'uikit': {
			input = 'uikit';
			break;
		}
		case 'icon': {
			input = 'icon';
			break;
		}
		case 'all': {
			input = undefined;
			break;
		}
		default: {
			return notFound();
		}
	}

	const data = await prisma.product.findMany({
		where: {
			category: input as CategoryTypes,
		},
		select: {
			id: true,
			images: true,
			smallDescription: true,
			name: true,
			price: true,
		},
	});

	return data;
}

type Params = Promise<{ category: string }>;

export default async function CategoryPage({
	params,
}: {
	params: Params;
}) {
	noStore();
	const { category } = await params;
	const data = await getData(category);
	return (
		<section className='max-w-7xl mx-auto px-4 md:px-8'>
			<h1 className='text-2xl font-bold'>
				{getDisplayTitle(category)}
			</h1>
			<div className='grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4'>
				{data.map((product) => (
					<ProductCard
						key={product.id}
						images={product.images}
						price={product.price}
						name={product.name}
						id={product.id}
						smallDescription={product.smallDescription}
					/>
				))}
			</div>
		</section>
	);
}
