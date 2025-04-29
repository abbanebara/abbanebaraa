import Link from "next/link"
 import Image from "next/image"
 import { notFound } from "next/navigation"
 import { blogPosts } from "@/lib/blog-data"
 
 export default function BlogPost({ params }: { params: { slug: string } }) {
   // Find the current blog post
   const post = blogPosts.find((post) => post.slug === params.slug)
 
   // If post not found, return 404
   if (!post) {
     notFound()
   }
 
   // Get similar posts (excluding current post)
   const similarPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 4)
 
   // Get other posts for the grid at the bottom
   const otherPosts = blogPosts.filter((p) => p.id !== post.id && !similarPosts.some((s) => s.id === p.id)).slice(0, 9)
 
   return (
     <main className="container mx-auto px-4 py-8">
       <h1 className="text-2xl font-bold mb-8">Read our many blogs</h1>
 
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
         {/* Main blog content - 3/4 width */}
         <div className="lg:col-span-3">
           {/* Featured image */}
           <div className="relative h-[250px] w-full mb-6">
             <Image
               src={post.image || "/placeholder.svg?height=400&width=800"}
               alt={post.title}
               fill
               className="object-cover rounded-lg"
             />
           </div>
 
           {/* Blog date and title */}
           <div className="mb-4">
             <div className="text-sm text-gray-500 mb-2">{post.date}</div>
             <h2 className="text-xl font-semibold mb-4">{post.title}</h2>
           </div>
 
           {/* Blog content */}
           <div className="prose prose-gray max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />
 
           {/* Repeated content for visual fullness as in the design */}
           <div className="prose prose-gray max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />
         </div>
 
         {/* Similar blogs sidebar - 1/4 width */}
         <div className="lg:col-span-1">
           <h3 className="text-lg font-semibold mb-4">Similar blogs</h3>
           <div className="space-y-4">
             {similarPosts.map((similarPost) => (
               <Link href={`/blog/${similarPost.slug}`} key={similarPost.id} className="block">
                 <div className="flex gap-3 mb-4">
                   <div className="relative h-16 w-20 flex-shrink-0 rounded overflow-hidden">
                     <Image
                       src={similarPost.image || "/placeholder.svg?height=100&width=150"}
                       alt={similarPost.title}
                       fill
                       className="object-cover"
                     />
                   </div>
                   <div>
                     <div className="text-xs text-gray-500 mb-1">{similarPost.date}</div>
                     <h4 className="text-sm font-medium line-clamp-2">{similarPost.title}</h4>
                   </div>
                 </div>
               </Link>
             ))}
           </div>
         </div>
       </div>
 
       {/* Other blogs section */}
       <div className="mt-16">
         <h3 className="text-xl font-semibold mb-8">Other blogs</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
           {otherPosts.map((otherPost) => (
             <Link href={`/blog/${otherPost.slug}`} key={otherPost.id} className="group">
               <div>
                 <div className="relative h-48 w-full mb-3 overflow-hidden rounded-lg">
                   <Image
                     src={otherPost.image || "/placeholder.svg?height=300&width=500"}
                     alt={otherPost.title}
                     fill
                     className="object-cover group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <h4 className="font-medium mb-1 text-green-600">
                   The Impact of Technology on the Workplace: How Technology is Changing
                 </h4>
                 <div className="text-sm text-gray-500">{otherPost.date}</div>
               </div>
             </Link>
           ))}
         </div>
       </div>
 
       {/* Pagination dots */}
       <div className="flex justify-center mt-12">
         <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300"></div>
         </div>
       </div>
     </main>
   )
 }