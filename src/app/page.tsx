'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Rocket, Zap, Shield, Code } from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Next.js 15',
    description: 'App Router mới nhất với Server Components và Server Actions',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Tối ưu hóa với Turbopack, Image Optimization và Font Optimization',
  },
  {
    icon: Shield,
    title: 'Type Safety',
    description: 'TypeScript strict mode với Zod validation',
  },
  {
    icon: Code,
    title: 'Developer Experience',
    description: 'ESLint, Prettier, Husky và Lint-staged',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">Modern Next.js</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Modern Next.js
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}
              Starter Template
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
            Một template Next.js hiện đại với đầy đủ công nghệ mới nhất, sẵn sàng cho production
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button size="lg" className="gap-2">
            <Rocket className="h-4 w-4" />
            Bắt đầu ngay
          </Button>
          <Button size="lg" variant="outline">
            Xem docs
          </Button>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl">
            Tech Stack Hiện Đại
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              'Next.js 15',
              'React 19',
              'TypeScript',
              'Tailwind CSS',
              'Framer Motion',
              'Zustand',
              'React Query',
              'Zod',
              'React Hook Form',
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border bg-secondary px-4 py-2 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          Built with ❤️ using Next.js and Tailwind CSS
        </div>
      </footer>
    </div>
  );
}
