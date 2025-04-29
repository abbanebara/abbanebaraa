import Link from "next/link"
 import Image from "next/image"
 
 export default function SectioBlog() {
   return (
     <main className="container mx-auto px-4 py-12">
       <h1 className="text-2xl font-bold mb-8">Our Latest Blog Posts</h1>
 
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left column - Two main blog posts side by side */}
         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* First main blog post */}
           <div>
             <Link href="/blog/believing-neglected">
               <div className="mb-4 overflow-hidden rounded-lg">
                 <Image
                   src="/placeholder.svg?height=400&width=600"
                   alt="People with backpacks in forest"
                   width={600}
                   height={400}
                   className="w-full object-cover"
                 />
               </div>
               <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                 <span>08-11-2021</span>
                 <span>Category</span>
               </div>
               <h2 className="text-lg font-medium mb-2">Believing neglected so so allowance existence departure.</h2>
               <p className="text-sm text-gray-600">
                 Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.
               </p>
             </Link>
           </div>
 
           {/* Second main blog post */}
           <div>
             <Link href="/blog/design-active-temper">
               <div className="mb-4 overflow-hidden rounded-lg">
                 <Image
                   src="/placeholder.svg?height=400&width=600"
                   alt="People with backpacks in forest"
                   width={600}
                   height={400}
                   className="w-full object-cover"
                 />
               </div>
               <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                 <span>08-11-2021</span>
                 <span>Category</span>
               </div>
               <h2 className="text-lg font-medium mb-2">
                 In design active temper be uneasy. Thirty for remove plenty regard you.
               </h2>
               <p className="text-sm text-gray-600">
                 Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality
                 estimating terminated day everything.
               </p>
             </Link>
           </div>
         </div>
 
         {/* Right column - Three sidebar blog posts */}
         <div className="space-y-0">
           {/* First sidebar blog post */}
           <div className="border-b pb-4 mb-4">
             <Link href="/blog/partiality-continuing" className="flex gap-4">
               <div className="relative h-20 w-24 flex-shrink-0 rounded overflow-hidden">
                 <Image
                   src="/placeholder.svg?height=200&width=300"
                   alt="Mountain lake with boats"
                   fill
                   className="object-cover"
                 />
               </div>
               <div className="flex-1">
                 <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                   <span>08-11-2021</span>
                   <span>Category</span>
                 </div>
                 <h3 className="font-medium text-sm">Partiality on or continuing in particular principles.</h3>
               </div>
             </Link>
           </div>
 
           {/* Second sidebar blog post */}
           <div className="border-b pb-4 mb-4">
             <Link href="/blog/believing-disposing" className="flex gap-4">
               <div className="relative h-20 w-24 flex-shrink-0 rounded overflow-hidden">
                 <Image
                   src="/placeholder.svg?height=200&width=300"
                   alt="Mountain lake with boat"
                   fill
                   className="object-cover"
                 />
               </div>
               <div className="flex-1">
                 <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                   <span>08-11-2021</span>
                   <span>Category</span>
                 </div>
                 <h3 className="font-medium text-sm">Do believing oh disposing to supported allowance we.</h3>
               </div>
             </Link>
           </div>
 
           {/* Third sidebar blog post */}
           <div className="border-b pb-4 mb-4">
             <Link href="/blog/village-removed" className="flex gap-4">
               <div className="relative h-20 w-24 flex-shrink-0 rounded overflow-hidden">
                 <Image
                   src="/placeholder.svg?height=200&width=300"
                   alt="Person with raised arms at sunset"
                   fill
                   className="object-cover"
                 />
               </div>
               <div className="flex-1">
                 <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                   <span>08-11-2021</span>
                   <span>Category</span>
                 </div>
                 <h3 className="font-medium text-sm">Village did removed enjoyed explain nor ham saw.</h3>
               </div>
             </Link>
           </div>
 
           {/* Show more button */}
           <div className="flex justify-center mt-8">
             <Link
               href="/blog"
               className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
             >
               See All Blog Posts
             </Link>
           </div>
         </div>
       </div>
     </main>
   )
 }