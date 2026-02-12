// Server-side API client for Next.js Server Components
// Uses native fetch with Next.js caching and revalidation

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

interface FetchOptions {
  revalidate?: number | false
  tags?: string[]
}

async function serverFetch<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: options?.revalidate ?? 60, // Default: revalidate every 60 seconds
      tags: options?.tags,
    },
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// Movie Services
export const serverMovieService = {
  async getAll() {
    return serverFetch('/movies/all', { revalidate: 60 })
  },

  async findAndPaginate(params: {
    page?: number
    limit?: number
    sortBy?: string
    search?: string
    searchBy?: string
    filter?: Record<string, any>
  }) {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.search) searchParams.set('search', params.search)
    if (params.searchBy) searchParams.set('searchBy', params.searchBy)
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        searchParams.set(`filter[${key}]`, value.toString())
      })
    }

    return serverFetch(
      `/movies?${searchParams.toString()}`,
      { revalidate: 60, tags: ['movies'] }
    )
  },

  async getById(id: string) {
    return serverFetch(`/movies/${id}`, { revalidate: 60 })
  },
}

// Slide Services
export const serverSlideService = {
  async getAll() {
    return serverFetch('/slides/all', { revalidate: 120 }) // Slides change less frequently
  },
}

// Movie Type Services
export const serverMovieTypeService = {
  async getAll() {
    return serverFetch('/movie-types/all', { revalidate: 300 }) // Types rarely change
  },
}

// Event Services
export const serverEventService = {
  async getAll() {
    return serverFetch('/events/all', { revalidate: 60 })
  },

  async findAndPaginate(params: {
    page?: number
    limit?: number
    sortBy?: string
    search?: string
    filter?: Record<string, any>
  }) {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.search) searchParams.set('search', params.search)
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        searchParams.set(`filter[${key}]`, value.toString())
      })
    }

    return serverFetch(`/events?${searchParams.toString()}`, { revalidate: 60 })
  },
}

// Combo Services
export const serverComboService = {
  async getAll() {
    return serverFetch('/combos/all', { revalidate: 60 })
  },

  async findAndPaginate(params: {
    page?: number
    limit?: number
    sortBy?: string
    search?: string
    filter?: Record<string, any>
  }) {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.search) searchParams.set('search', params.search)
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        searchParams.set(`filter[${key}]`, value.toString())
      })
    }

    return serverFetch(`/combos?${searchParams.toString()}`, { revalidate: 60 })
  },
}

// Post Services
export const serverPostService = {
  async getAll() {
    return serverFetch('/posts/all', { revalidate: 60 })
  },

  async findAndPaginate(params: {
    page?: number
    limit?: number
    sortBy?: string
    search?: string
    filter?: Record<string, any>
  }) {
    const searchParams = new URLSearchParams()
    
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.search) searchParams.set('search', params.search)
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        searchParams.set(`filter[${key}]`, value.toString())
      })
    }

    return serverFetch(`/posts?${searchParams.toString()}`, { revalidate: 60 })
  },
}
