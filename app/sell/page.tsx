import { Card } from '@/components/ui/card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { SellForm } from '../components/form/Sellform';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

export default async function SellRoute() {
	noStore();
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user) {
		throw new Error('Unauthorized');
	}

	return (
		<section className='max-w-7xl mx-auto px-4 md:px-8 mb-14'>
			<Card>
				<SellForm />
			</Card>
		</section>
	);
}
