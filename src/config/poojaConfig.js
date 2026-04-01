// a single source of truth for hardcoded pooja listings

export const poojaTypesData = [
  {
    id: 'daily',
    icon: 'fas fa-hands-praying',
    title: 'Daily Pooja',
    description: 'Regular daily prayers for spiritual well-being.',
    price: 299, 
    featured: false
  },
  {
    id: 'special',
    icon: 'fas fa-om',
    title: 'Special Occasion Pooja',
    description: 'Customized pooja for birthdays, anniversaries, etc.',
    price: 599,
    featured: true
  },
  {
    id: 'festival',
    icon: 'fas fa-moon',
    title: 'Festival Pooja',
    description: 'Ceremonies for major Hindu festivals.',
    price: 799,
    featured: false
  },
  {
    id: 'remedial',
    icon: 'fas fa-heart',
    title: 'Remedial Pooja',
    description: 'To overcome obstacles and bring positive energy.',
    price: 999,
    featured: false
  },
  {
    id: 'house-warming',
    icon: 'fas fa-home',
    title: 'House Warming Pooja',
    description: 'Sacred ceremony for blessing new homes.',
    price: 1299,
    featured: false
  },
  {
    id: 'success',
    icon: 'fas fa-graduation-cap',
    title: 'Success Pooja',
    description: 'For academic success and career growth.',
    price: 699,
    featured: false
  }
];

// A helper to easily find a pooja by its ID
export const getPoojaById = (id) => poojaTypesData.find(p => p.id === id);