import { Card } from '@/components/ui/card';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { SellForm } from '../components/form/Sellform';

export default async function SellRoute() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	return (
		<section className='max-w-7xl mx-auto px-4 md:px-8 mb-14'>
			<Card>
				<SellForm />
			</Card>
		</section>
	);
}
