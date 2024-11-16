'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import PreviewDialog from '@/components/blogPreviewModal'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  tags: z.string().refine(value => value.trim().length > 0, {
    message: 'Tags are required',
  }),
})

type FormValues = z.infer<typeof formSchema>

const BlogForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    setPreviewData(values);
    setIsPreviewOpen(true);
  };

  const handleFinalSubmit = () => {
    if (previewData) {
      const dataToSave = {
        ...previewData,
        date: previewData.date.toISOString(),
      };

      const existingData = localStorage.getItem('blogFormData');
      const dataArray = existingData ? JSON.parse(existingData) : [];
      dataArray.push(dataToSave);
      localStorage.setItem('blogFormData', JSON.stringify(dataArray));

      console.log('Saved to localStorage:', dataArray);

      toast({
        title: "Blog post saved",
        description: "Your blog post has been saved to localStorage.",
      });

      setIsPreviewOpen(false);
      router.push('/');
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Blog Post</CardTitle>
          <CardDescription>Fill in the details for your new blog post. Your progress will be saved to localStorage.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog title" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReactQuill 
                        theme="snow" 
                        value={field.value} 
                        onChange={field.onChange} 
                        className="bg-background rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full sm:w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"} transition-all duration-300 focus:ring-2 focus:ring-primary`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tags (comma-separated)" {...field} className="transition-all duration-300 focus:ring-2 focus:ring-primary" />
                    </FormControl>
                    <FormDescription>Enter tags separated by commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            onClick={form.handleSubmit(onSubmit)}
            className="w-full sm:w-auto transition-all duration-300 hover:scale-105"
          >
            Preview Post
          </Button>
        </CardFooter>
      </Card>

      <PreviewDialog
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        previewData={previewData}
        onSubmit={handleFinalSubmit}
      />
    </>
  )
}

export default BlogForm;