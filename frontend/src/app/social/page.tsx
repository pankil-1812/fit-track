"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Search, 
  Heart, 
  MessageSquare, 
  Share, 
  MoreHorizontal, 
  Send,
  Image as ImageIcon,
  UserPlus,
  TrendingUp,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Import custom data hooks for API integration
import { useSocialFeed } from "@/lib/data-hooks"
import type { SocialPost, Comment } from "@/lib/types"

export default function SocialPage() {
  const { posts: socialPosts, status, error } = useSocialFeed()
  const [activeTab, setActiveTab] = useState("feed")
  const [newPostContent, setNewPostContent] = useState("")
    const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [postError, setPostError] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPostContent.trim()) {
      setPostError("Please write something before posting")
      return
    }
    
    setIsSubmittingPost(true)
    setPostError("")
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // In a real app, we would call an API to create the post
      // For now, we'll just simulate success
      
      // Create new post object
      const newPost = {
        id: Math.floor(Math.random() * 1000) + socialPosts.length + 1,
        user: {
          id: 999,
          name: "Demo User",
          username: "demo_user",
          avatar: "/images/avatars/user.jpg"
        },
        content: newPostContent,
        image: selectedImage || undefined,
        likes: 0,
        comments: [],
        timestamp: new Date().toISOString()
      }
      
      // Add to beginning of posts array
      setPosts([newPost, ...socialPosts])
      
      // Clear form
      setNewPostContent("")
      setSelectedImage(null)
    } catch (error) {
      console.error("Error creating post:", error)
      setPostError("Failed to create post. Please try again.")
    } finally {
      setIsSubmittingPost(false)
    }
  }
  
  // Function to handle image selection
  const handleImageSelection = () => {
    // In a real app, we'd open a file picker
    // For demo purposes, we'll just simulate selecting an image
    setSelectedImage("/images/social/workout-completion.jpg")
  }
  
  // Need to define setPosts since we're adding new posts
  const [posts, setPosts] = useState(socialPosts)

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">FitTrack Community</h1>
          <p className="text-muted-foreground">
            Share your fitness journey and connect with other members
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1 space-y-6">
            {/* New Post Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  {postError && (
                    <div className="p-3 text-sm border border-red-300 bg-red-50 text-red-600 rounded">
                      {postError}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src="/images/avatars/user.jpg" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <textarea
                      className="flex-1 resize-none p-3 border rounded-md border-input bg-transparent min-h-24 focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Share your fitness achievement..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      disabled={isSubmittingPost}
                    />
                  </div>
                  
                  {selectedImage && (
                    <div className="relative">
                      <img 
                        src={selectedImage} 
                        alt="Selected workout" 
                        className="w-full h-48 object-cover rounded-md" 
                      />
                      <Button 
                        variant="secondary" 
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => setSelectedImage(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={handleImageSelection}
                        disabled={isSubmittingPost}
                      >
                        <ImageIcon className="h-4 w-4" />
                        Photo
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        disabled={isSubmittingPost}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Achievement
                      </Button>
                    </div>
                    <Button type="submit" disabled={isSubmittingPost || !newPostContent.trim()}>
                      {isSubmittingPost ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Posting...
                        </>
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Tabs for different feeds */}
            <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="feed">My Feed</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed" className="mt-0 space-y-6">
                {socialPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              
              <TabsContent value="trending" className="mt-0">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Trending Content</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    Discover popular posts and challenges from the FitTrack community.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="following" className="mt-0">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">Following Feed</h3>
                  <p className="text-muted-foreground mt-1 mb-4 max-w-md">
                    See posts from people you follow. Start following other members to populate this feed.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Top Users Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Contributors</CardTitle>
                <CardDescription>Most active community members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`/images/avatars/user-${i}.jpg`} alt="User" />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      {i <= 3 && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {i}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        User Name {i}
                      </p>
                      <p className="text-xs text-muted-foreground">@username{i}</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/social/users">View All Users</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Trending Challenges Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Challenges</CardTitle>
                <CardDescription>Popular challenges this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="rounded-md h-12 w-12 bg-muted flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        30-Day Challenge #{i}
                      </p>
                      <p className="text-xs text-muted-foreground">{1000 + i * 500} participants</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Join
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/challenges">View All Challenges</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Post Card Component
function PostCard({ post }: { post: any }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  
  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
    
    // Animate heart
    const likeBtn = document.querySelector(`#like-btn-${post.id}`)
    if (likeBtn) {
      likeBtn.classList.add('scale-125')
      setTimeout(() => {
        likeBtn?.classList.remove('scale-125')
      }, 200)
    }
  }
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    setIsSubmittingComment(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create new comment
      const newCommentObj = {
        id: Math.floor(Math.random() * 1000) + (post.comments?.length || 0) + 1,
        user: {
          id: 999,
          name: "Demo User",
          username: "demo_user",
          avatar: "/images/avatars/user.jpg"
        },
        content: newComment,
        timestamp: new Date().toISOString()
      }
      
      // Add to post comments (in a real app, we would update the state through API)
      if (!post.comments) post.comments = []
      post.comments.push(newCommentObj)
      
      // Clear form
      setNewComment("")
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">
                  {post.user.name}
                </CardTitle>
                <CardDescription>
                  @{post.user.username}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Follow</DropdownMenuItem>
                <DropdownMenuItem>Save Post</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="mb-4">{post.content}</p>
          
          {post.image && (
            <div className="relative aspect-video rounded-md overflow-hidden mb-4">
              <Image
                src={post.image}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {/* Engagement stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likes} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 px-6 pt-1 pb-6">
          <Separator />
          <div className="flex justify-between w-full pt-1">
            <Button variant="ghost" size="sm" className="gap-2 flex-1" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 flex-1" onClick={() => setShowComments(!showComments)}>
              <MessageSquare className="h-4 w-4" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 flex-1">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="space-y-4 pt-2">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium text-sm">{comment.user.name}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <button>Like</button>
                        <button>Reply</button>
                        <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground">No comments yet</p>
              )}
              
              {/* Add comment form */}              <form onSubmit={handleCommentSubmit} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/images/avatars/user.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    disabled={isSubmittingComment}
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="transition-all"
                  >
                    {isSubmittingComment ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
