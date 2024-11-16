import React from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PreviewDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  previewData: {
    title: string
    description: string
    date: Date
    tags: string
  } | null
  onSubmit: () => void
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({ isOpen, onOpenChange, previewData, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preview Blog Post</DialogTitle>
          <DialogDescription>
            Review your blog post before submitting.
          </DialogDescription>
        </DialogHeader>
        {previewData && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Title:</span>
              <span className="col-span-3">{previewData.title}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Date:</span>
              <span className="col-span-3">{format(previewData.date, "PPP")}</span>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="font-bold">Description:</span>
              <div className="col-span-3" dangerouslySetInnerHTML={{ __html: previewData.description }} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Tags:</span>
              <span className="col-span-3">{previewData.tags}</span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="submit" onClick={onSubmit} className="w-full sm:w-auto">
            Submit Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialog