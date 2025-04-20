import { Button } from '@/components/ui/button';
import { IconShoppingCart } from '@tabler/icons-react';

export default function Cart() {
  const handleClick = () => {};

  return (
    <Button variant='outline' size='icon' className='rounded-full' onClick={handleClick}>
      <IconShoppingCart size={24} />
      <span className='sr-only'>Toggle cart</span>
    </Button>
  );
}
