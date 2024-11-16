'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Search, Calendar, Tag, ChevronUp, ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'

interface BlogPost {
  title: string
  description: string
  date: string
  tags: string
}

export default function BlogList() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  

  useEffect(() => {
    const savedData = localStorage.getItem('blogFormData')
    if (savedData) {
      setBlogPosts(JSON.parse(savedData))
    }
  }, [])

  const filteredAndSortedPosts = blogPosts
    .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(post => !selectedTag || post.tags.split(',').map(tag => tag.trim()).includes(selectedTag))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags.split(',').map(tag => tag.trim()))))
  
  const createPostClick = () => {
    router.push('/blogForm')
  }
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Blog Posts</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button className="w-full md:w-48" onClick={createPostClick}>Create Blog Post</Button>
        
        <Select value={selectedTag || ''} onValueChange={(value) => setSelectedTag(value || null)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem >All tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="w-full md:w-auto"
        >
         {sortOrder === 'asc' ? <><p>Latest</p> <ChevronUp className="ml-2" /></> : <><p>Oldest</p><ChevronDown className="ml-2" /></>}
        </Button>
      </div>

      {filteredAndSortedPosts.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No blog posts found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedPosts.map((post, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <Calendar className="mr-2" size={16} />
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: post.description }} className="prose max-w-none" />
              </CardContent>
              <CardFooter className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {post.tags.split(',').map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      <Tag className="mr-1" size={12} />
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}