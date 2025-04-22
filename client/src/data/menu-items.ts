import { MenuItem } from "@/types/cart";

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description:
      'Juicy beef patty with melted cheddar cheese, fresh lettuce, tomato, and our special sauce on a toasted brioche bun.',
    price: 12.99,
    image:
      'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'burgers',
    tags: ['beef', 'cheese', 'classic'],
    available: true,
    popular: true,
    restaurantId: 'another one',
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description:
      'Traditional Italian pizza with fresh mozzarella, tomatoes, basil leaves, and a drizzle of olive oil on our handmade crust.',
    price: 14.99,
    image:
      'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'pizza',
    tags: ['vegetarian', 'cheese', 'classic'],
    available: true,
    popular: true,
    restaurantId: 'another one',
  },
  {
    id: '3',
    name: 'Spicy Thai Noodles',
    description:
      'Rice noodles stir-fried with vegetables, eggs, and our house spicy sauce. Topped with crushed peanuts and fresh cilantro.',
    price: 13.99,
    image:
      'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'asian',
    tags: ['spicy', 'noodles', 'vegetarian'],
    available: true,
    restaurantId: 'another one',
  },
  {
    id: '4',
    name: 'Caesar Salad',
    description:
      'Crisp romaine lettuce, house-made croutons, parmesan cheese, and our creamy Caesar dressing.',
    price: 9.99,
    image:
      'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'salads',
    tags: ['healthy', 'vegetarian'],
    available: true,
    restaurantId: 'another one',
  },
  {
    id: '5',
    name: 'Chocolate Brownie Sundae',
    description:
      'Warm chocolate brownie topped with vanilla ice cream, hot fudge sauce, whipped cream, and a cherry.',
    price: 7.99,
    image:
      'https://images.pexels.com/photos/4792381/pexels-photo-4792381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'desserts',
    tags: ['chocolate', 'ice cream', 'sweet'],
    available: true,
    restaurantId: 'another one',
  },
  {
    id: '6',
    name: 'BBQ Chicken Wings',
    description:
      'Crispy chicken wings tossed in our signature BBQ sauce. Served with celery sticks and blue cheese dressing.',
    price: 11.99,
    image:
      'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'appetizers',
    tags: ['chicken', 'bbq', 'spicy'],
    available: true,
    restaurantId: 'another one',
  },
  {
    id: '7',
    name: 'Vegetable Stir Fry',
    description:
      'Fresh seasonal vegetables stir-fried in a savory sauce with your choice of rice or noodles.',
    price: 12.99,
    image:
      'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'asian',
    tags: ['vegetarian', 'healthy', 'vegan'],
    available: true,
    restaurantId: 'another two',
  },
  {
    id: '8',
    name: 'Double Bacon Burger',
    description:
      'Two beef patties with crispy bacon, American cheese, lettuce, tomato, and our special sauce.',
    price: 15.99,
    image:
      'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'burgers',
    tags: ['beef', 'bacon', 'cheese'],
    available: true,
    popular: true,
    restaurantId: 'another two',
  },
  {
    id: '9',
    name: 'Pepperoni Pizza',
    description:
      'Our classic pizza topped with pepperoni, mozzarella cheese, and oregano on our signature sauce.',
    price: 15.99,
    image:
      'https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'pizza',
    tags: ['pepperoni', 'cheese'],
    available: true,
    restaurantId: 'another two',
  },
  {
    id: '10',
    name: 'Greek Salad',
    description:
      'Fresh cucumbers, tomatoes, bell peppers, red onions, Kalamata olives, and feta cheese with our house dressing.',
    price: 10.99,
    image:
      'https://images.pexels.com/photos/1152237/pexels-photo-1152237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'salads',
    tags: ['healthy', 'vegetarian'],
    available: true,
    restaurantId: 'another two',
  },
  {
    id: '11',
    name: 'Fish and Chips',
    description: 'Beer-battered cod served with our crispy fries, tartar sauce, and a lemon wedge.',
    price: 16.99,
    image:
      'https://images.pexels.com/photos/4194634/pexels-photo-4194634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'mains',
    tags: ['seafood', 'fried'],
    available: true,
    restaurantId: 'another two',
  },
  {
    id: '12',
    name: 'Cheesecake',
    description:
      'Creamy New York style cheesecake with a graham cracker crust, topped with fresh berries.',
    price: 8.99,
    image:
      'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'desserts',
    tags: ['cheese', 'sweet'],
    available: true,
    restaurantId: 'another two',
  },
];

export const categories = [
  { id: "all", name: "All Items" },
  { id: "burgers", name: "Burgers" },
  { id: "pizza", name: "Pizza" },
  { id: "asian", name: "Asian" },
  { id: "salads", name: "Salads" },
  { id: "appetizers", name: "Appetizers" },
  { id: "mains", name: "Main Courses" },
  { id: "desserts", name: "Desserts" },
];

export const popularItems = menuItems.filter(item => item.popular);