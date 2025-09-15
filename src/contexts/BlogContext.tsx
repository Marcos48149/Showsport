"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  readingTime: number;
  relatedProducts?: string[];
  schemaType?: 'Article' | 'FAQ' | 'HowTo' | 'Review';
  faqItems?: Array<{
    question: string;
    answer: string;
  }>;
  howToSteps?: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  reviewRating?: {
    ratingValue: number;
    bestRating: number;
    worstRating: number;
    reviewCount: number;
  };
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  postCount: number;
  color: string;
  icon: string;
}

interface BlogState {
  posts: BlogPost[];
  categories: BlogCategory[];
  featuredPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
}

interface BlogContextType {
  state: BlogState;
  getPostsByCategory: (categorySlug: string) => BlogPost[];
  getPostBySlug: (categorySlug: string, postSlug: string) => BlogPost | null;
  getCategoryBySlug: (slug: string) => BlogCategory | null;
  getRelatedPosts: (postId: string, limit?: number) => BlogPost[];
  getFeaturedPosts: (limit?: number) => BlogPost[];
  searchPosts: (query: string) => BlogPost[];
}

const BlogContext = createContext<BlogContextType | null>(null);

// Mock categories
const mockCategories: BlogCategory[] = [
  {
    id: '1',
    slug: 'guias-compra',
    name: 'Guías de Compra',
    description: 'Todo lo que necesitás saber para comprar zapatillas perfectas',
    metaTitle: 'Guías de Compra | Cómo Comprar Zapatillas | ShowSport',
    metaDescription: 'Guías completas para comprar zapatillas deportivas. Aprende a elegir el calzado perfecto para cada deporte y ocasión.',
    featuredImage: '/blog/guias-compra.jpg',
    postCount: 8,
    color: 'bg-blue-500',
    icon: '🛍️'
  },
  {
    id: '2',
    slug: 'devoluciones-cambios',
    name: 'Devoluciones y Cambios',
    description: 'Proceso fácil y rápido para cambios y devoluciones',
    metaTitle: 'Devoluciones y Cambios | Guía Paso a Paso | ShowSport',
    metaDescription: 'Aprende cómo hacer cambios y devoluciones de forma rápida y sencilla. Proceso automatizado y envío gratuito.',
    featuredImage: '/blog/devoluciones.jpg',
    postCount: 5,
    color: 'bg-green-500',
    icon: '🔄'
  },
  {
    id: '3',
    slug: 'guia-talles',
    name: 'Guía de Talles',
    description: 'Encuentra tu talle perfecto con nuestras guías detalladas',
    metaTitle: 'Guía de Talles | Cómo Elegir el Talle Correcto | ShowSport',
    metaDescription: 'Guías completas de talles para todas las marcas. Aprende a medir tu pie y elegir el talle perfecto.',
    featuredImage: '/blog/guia-talles.jpg',
    postCount: 6,
    color: 'bg-purple-500',
    icon: '📏'
  },
  {
    id: '4',
    slug: 'reviews-productos',
    name: 'Reviews de Productos',
    description: 'Análisis detallados y honestos de las mejores zapatillas',
    metaTitle: 'Reviews de Zapatillas | Análisis de Productos | ShowSport',
    metaDescription: 'Reviews honestos y detallados de zapatillas deportivas. Conoce las mejores opciones antes de comprar.',
    featuredImage: '/blog/reviews.jpg',
    postCount: 12,
    color: 'bg-orange-500',
    icon: '⭐'
  },
  {
    id: '5',
    slug: 'promociones',
    name: 'Promociones y Novedades',
    description: 'Las mejores ofertas y lanzamientos del mundo deportivo',
    metaTitle: 'Promociones y Ofertas | Últimas Novedades | ShowSport',
    metaDescription: 'Descubre las mejores promociones y últimos lanzamientos en zapatillas deportivas. No te pierdas ninguna oferta.',
    featuredImage: '/blog/promociones.jpg',
    postCount: 15,
    color: 'bg-red-500',
    icon: '🎉'
  },
  {
    id: '6',
    slug: 'tendencias',
    name: 'Consejos y Tendencias',
    description: 'Últimas tendencias y consejos del mundo deportivo',
    metaTitle: 'Tendencias Deportivas | Consejos de Moda | ShowSport',
    metaDescription: 'Mantente al día con las últimas tendencias en moda deportiva y consejos de estilo para cada ocasión.',
    featuredImage: '/blog/tendencias.jpg',
    postCount: 10,
    color: 'bg-pink-500',
    icon: '👟'
  },
  {
    id: '7',
    slug: 'faq',
    name: 'Preguntas Frecuentes',
    description: 'Respuestas a las preguntas más comunes',
    metaTitle: 'Preguntas Frecuentes | FAQ | ShowSport',
    metaDescription: 'Encuentra respuestas rápidas a las preguntas más frecuentes sobre compras, envíos, devoluciones y más.',
    featuredImage: '/blog/faq.jpg',
    postCount: 20,
    color: 'bg-gray-500',
    icon: '❓'
  }
];

// Mock posts with rich content
const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'como-elegir-zapatillas-running',
    title: 'Cómo Elegir las Mejores Zapatillas para Running 2024',
    excerpt: 'Guía completa para elegir zapatillas de running según tu tipo de pisada, peso y estilo de entrenamiento.',
    content: 'Contenido completo del artículo sobre zapatillas de running...',
    category: mockCategories[0],
    tags: ['running', 'zapatillas', 'guía', 'compra'],
    author: 'Equipo ShowSport',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop',
    metaTitle: 'Cómo Elegir Zapatillas para Running 2024 | Guía Completa',
    metaDescription: 'Guía completa para elegir las mejores zapatillas de running según tu pisada, peso y tipo de entrenamiento. Consejos de expertos.',
    isPublished: true,
    readingTime: 8,
    relatedProducts: ['1', '6', '8'],
    schemaType: 'HowTo'
  },
  {
    id: '2',
    slug: 'como-hacer-cambio-paso-a-paso',
    title: 'Cómo Hacer un Cambio Paso a Paso - Proceso Automatizado',
    excerpt: 'Guía completa del nuevo sistema de cambios automático. Cupón inmediato y envío gratuito en minutos.',
    content: 'Proceso completo para hacer cambios...',
    category: mockCategories[1],
    tags: ['cambios', 'devoluciones', 'proceso', 'automático'],
    author: 'Equipo ShowSport',
    publishedAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f9bd2f?w=800&h=400&fit=crop',
    metaTitle: 'Cómo Hacer un Cambio Paso a Paso | Sistema Automatizado ShowSport',
    metaDescription: 'Aprende a hacer cambios en 5 minutos con nuestro sistema automatizado. Cupón inmediato y envío gratuito garantizado.',
    isPublished: true,
    readingTime: 4,
    schemaType: 'HowTo'
  },
  {
    id: '3',
    slug: 'como-elegir-talle-zapatillas',
    title: 'Cómo Elegir el Talle Perfecto de Zapatillas - Guía 2024',
    excerpt: 'Aprende a medir tu pie correctamente y elegir el talle perfecto según la marca. Evita cambios por talle incorrecto.',
    content: 'Guía completa de talles...',
    category: mockCategories[2],
    tags: ['talles', 'medidas', 'zapatillas', 'sizing'],
    author: 'Equipo ShowSport',
    publishedAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    featuredImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=400&fit=crop',
    metaTitle: 'Cómo Elegir el Talle Perfecto de Zapatillas | Guía de Talles 2024',
    metaDescription: 'Aprende a medir tu pie y elegir el talle perfecto según la marca. Guía completa con tablas de conversión y consejos de expertos.',
    isPublished: true,
    readingTime: 7,
    schemaType: 'HowTo'
  }
];

export function BlogProvider({ children }: { children: ReactNode }) {
  const [state] = useState<BlogState>({
    posts: mockPosts,
    categories: mockCategories,
    featuredPosts: mockPosts.slice(0, 3),
    isLoading: false,
    error: null
  });

  const getPostsByCategory = (categorySlug: string): BlogPost[] => {
    return state.posts.filter(post => post.category.slug === categorySlug && post.isPublished);
  };

  const getPostBySlug = (categorySlug: string, postSlug: string): BlogPost | null => {
    return state.posts.find(
      post => post.category.slug === categorySlug &&
               post.slug === postSlug &&
               post.isPublished
    ) || null;
  };

  const getCategoryBySlug = (slug: string): BlogCategory | null => {
    return state.categories.find(category => category.slug === slug) || null;
  };

  const getRelatedPosts = (postId: string, limit = 3): BlogPost[] => {
    const currentPost = state.posts.find(post => post.id === postId);
    if (!currentPost) return [];

    return state.posts
      .filter(post =>
        post.id !== postId &&
        post.isPublished &&
        (post.category.id === currentPost.category.id ||
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);
  };

  const getFeaturedPosts = (limit = 3): BlogPost[] => {
    return state.posts
      .filter(post => post.isPublished)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  };

  const searchPosts = (query: string): BlogPost[] => {
    const searchTerm = query.toLowerCase();
    return state.posts.filter(post =>
      post.isPublished &&
      (post.title.toLowerCase().includes(searchTerm) ||
       post.excerpt.toLowerCase().includes(searchTerm) ||
       post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  };

  return (
    <BlogContext.Provider value={{
      state,
      getPostsByCategory,
      getPostBySlug,
      getCategoryBySlug,
      getRelatedPosts,
      getFeaturedPosts,
      searchPosts
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
