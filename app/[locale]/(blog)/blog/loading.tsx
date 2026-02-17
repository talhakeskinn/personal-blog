
export default function Loading() {
    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-64 pb-24">
            {/* Header Skeleton */}
            <div className="flex flex-col items-center justify-center mb-16 space-y-4">
                <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col h-full">
                        {/* Image */}
                        <div className="aspect-[16/10] bg-gray-200 rounded-xl mb-4 animate-pulse"></div>

                        {/* Meta */}
                        <div className="flex gap-2 mb-3">
                            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        {/* Title */}
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>

                        {/* Excerpt */}
                        <div className="space-y-2 mb-4">
                            <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
                            <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
