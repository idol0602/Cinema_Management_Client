export const siteConfig = {
  name: 'Modern Next.js App',
  description: 'A modern Next.js application with the latest technologies',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  links: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
  },
};

export const navItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];
