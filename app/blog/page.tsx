"use client"
 
 import Link from "next/link"
 import Image from "next/image"
 import { blogPosts } from "@/lib/blog-data"
 import { useState, useEffect } from "react"
 import { Pagination } from "@/components/pagnation"
 import { useSearchParams } from "next/navigation"
 
 export default function BlogPage() {
   // Get the current page from URL query parameters
   const searchParams = useSearchParams()
   const pageParam = searchParams.get("page")
   const currentPage = pageParam ? Number.parseInt(pageParam) : 1
 
   // State for the current slide
   const [currentSlide, setCurrentSlide] = useState(0)
 
   // Featured slides for the auto-scrolling section
   const featuredSlides = [
     {
       id: "1",
       title: "The Impact of Technology on the Workplace: How Technology is Changing",
       date: "August 20, 2022",
       image: "/placeholder.svg?height=500&width=1200",
     },
     {
       id: "2",
       title: "The Impact of Technology on the Workplace: How Technology is Changing",
       date: "August 20, 2022",
       image: "/placeholder.svg?height=500&width=1200",
     },
     {
       id: "3",
       title: "The Impact of Technology on the Workplace: How Technology is Changing",
       date: "August 20, 2022",
       image: "/placeholder.svg?height=500&width=1200",
     },
   ]
 
   // Auto-scroll effect
   useEffect(() => {
     const interval = setInterval(() => {
       setCurrentSlide((prev) => (prev + 1) % featuredSlides.length)
     }, 5000)
 
     return () => clearInterval(interval)
   }, [featuredSlides.length])
 
   // Pagination settings
   const postsPerPage = 6
   const totalPages = Math.ceil((blogPosts.length - 1) / postsPerPage)
 
   // Calculate which posts to show on the current page
   const startIndex = (currentPage - 1) * postsPerPage
   const endIndex = startIndex + postsPerPage
   const gridPosts = blogPosts.filter((post) => post.id !== "1").slice(startIndex, endIndex)
 
   return (
     <main className="container mx-auto px-4 py-8">
       <h1 className="text-2xl font-bold mb-8">Read All blogs</h1>
 
       {/* Auto-scrolling ads/featured section */}
       <div className="relative w-full h-[300px] mb-12 rounded-lg overflow-hidden">
         {featuredSlides.map((slide, index) => (
           <div
             key={slide.id}
             className={`absolute inset-0 transition-opacity duration-1000 ${
               index === currentSlide ? "opacity-100" : "opacity-0"
             }`}
           >
             <div className="relative w-full h-full">
               <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
               <div className="absolute bottom-0 left-0 p-6 text-white">
                 <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded mb-2">
                   {slide.category}
                 </span>
                 <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                 <p className="text-sm">{slide.date}</p>
               </div>
             </div>
           </div>
         ))}
 
         {/* Navigation dots */}
         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
           {featuredSlides.map((_, index) => (
             <button
               key={index}
               onClick={() => setCurrentSlide(index)}
               className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
               aria-label={`Go to slide ${index + 1}`}
             />
           ))}
         </div>
       </div>
 
       {/* Blogs grid section */}
       <h2 className="text-2xl font-bold mb-8">Bloges</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
         {gridPosts.map((post) => (
           <Link href={`/blog/${post.slug}`} key={post.id} className="group">
             <div>
               <div className="relative h-48 w-full mb-4 overflow-hidden">
                 <Image
                   src={post.image || "/placeholder.svg?height=300&width=500"}
                   alt={post.title}
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-300"
                 />
               </div>
               <h3 className="font-medium mb-2">
                 The Impact of Technology on the Workplace: How Technology is Changing
               </h3>
               <div className="text-sm text-gray-500">August 20, 2022</div>
             </div>
           </Link>
         ))}
       </div>
 
       {/* Pagination */}
       <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
     </main>
   )
 }