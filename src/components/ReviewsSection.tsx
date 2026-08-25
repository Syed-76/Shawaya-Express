import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, CheckCircle2, User, ExternalLink, Filter } from 'lucide-react';
import { GOOGLE_REVIEWS, RESTAURANT_INFO } from '../data/restaurantData';

export const ReviewsSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [reviewsList, setReviewsList] = useState(GOOGLE_REVIEWS);
  const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>({});

  const filterTags = [
    { id: 'all', label: 'All Reviews', count: 72 },
    { id: 'rice', label: 'Rice Flavor', count: 5 },
    { id: 'ac', label: 'AC Family Hall', count: 3 },
    { id: 'money', label: 'Value for Money', count: 2 },
    { id: 'food', label: 'Food Quality', count: 2 },
  ];

  const handleLike = (id: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredReviews = reviewsList.filter((rev) => {
    if (selectedTag === 'all') return true;
    return rev.tags?.includes(selectedTag);
  });

  return (
    <section id="reviews" className="py-20 bg-[#FDFCFB] text-[#1F2937] relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-[#D97706] uppercase block">
            Google Maps Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
            Loved by Locals & <span className="font-bold italic text-[#D97706]">Travelers</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light">
            Real guest experiences from visitors at our Thikrian, Mor Lalamusa branch.
          </p>
        </div>

        {/* Rating Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Score box */}
            <div className="md:col-span-4 text-center md:text-left md:border-r border-gray-100 md:pr-8">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="text-5xl sm:text-6xl font-extralight text-gray-900 tracking-tighter">4.4</span>
                <div>
                  <div className="flex items-center text-[#D97706]">
                    {[1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-[#D97706]" />
                    ))}
                    <Star className="w-5 h-5 fill-[#D97706]/40 text-[#D97706]" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block font-medium">Based on 72 Google Reviews</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed font-light">
                Avg price: <span className="text-gray-900 font-semibold">Rs 1,000–2,000</span> per person reported by diners.
              </p>
              
              <div className="mt-5">
                <a
                  href={RESTAURANT_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D97706] hover:underline font-bold uppercase tracking-wider"
                >
                  <span>View Google Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Star Bars Breakdown */}
            <div className="md:col-span-8 space-y-2.5">
              <div className="space-y-2 text-xs text-gray-600">
                {[
                  { star: 5, pct: 75, count: '54' },
                  { star: 4, pct: 15, count: '11' },
                  { star: 3, pct: 6, count: '4' },
                  { star: 2, pct: 2, count: '2' },
                  { star: 1, pct: 2, count: '1' },
                ].map((row) => (
                  <div key={row.star} className="flex items-center gap-3">
                    <span className="w-8 font-medium text-gray-500">{row.star} ★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D97706] rounded-full"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-400 text-[11px]">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {filterTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedTag === tag.id
                  ? 'bg-[#1F2937] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {tag.label} ({tag.count})
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const isLiked = likedReviews[rev.id];
            const displayLikes = rev.likesCount + (isLiked ? 1 : 0);

            return (
              <div
                key={rev.id}
                id={`review-card-${rev.id}`}
                className="bg-white rounded-3xl border border-gray-100 hover:border-gray-300 p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-3.5">
                  
                  {/* Author Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-[#D97706] font-bold flex items-center justify-center text-sm border border-gray-200">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <span>{rev.author}</span>
                          {rev.isNew && (
                            <span className="text-[10px] bg-amber-50 text-[#D97706] border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                              NEW
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-light">{rev.badge}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-gray-400 whitespace-nowrap font-light">{rev.timeAgo}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-[#D97706]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D97706]" />
                    ))}
                  </div>

                  {/* Review Content */}
                  <p className="text-xs text-gray-600 leading-relaxed font-light italic">
                    "{rev.content}"
                  </p>

                  {/* Ordered item tag */}
                  {rev.orderItem && (
                    <div className="text-[11px] bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-100 inline-block font-medium">
                      🍽️ {rev.orderItem}
                    </div>
                  )}
                </div>

                {/* Footer Likes / Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                      isLiked ? 'text-[#D97706] bg-amber-50 font-bold' : 'hover:text-gray-700'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#D97706]' : ''}`} />
                    <span>Helpful ({displayLikes})</span>
                  </button>

                  <span className="text-[11px] text-gray-400 font-light">Verified Visitor</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Call to review banner */}
        <div className="mt-12 text-center bg-white p-8 rounded-3xl border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left">
            <h4 className="text-base font-bold text-gray-900">Visited Shawaya Express Lalamusa recently?</h4>
            <p className="text-xs text-gray-500 font-light mt-0.5">Your feedback helps us continuously improve our rotisserie roast & service.</p>
          </div>
          <a
            href={RESTAURANT_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#1F2937] hover:bg-[#D97706] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-sm transition-colors flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Write a Google Review</span>
          </a>
        </div>

      </div>
    </section>
  );
};
