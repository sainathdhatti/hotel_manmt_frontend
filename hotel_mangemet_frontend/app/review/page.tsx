'use client';
import { useState, useEffect } from 'react';
import { useReviewStore } from '../store/reviewStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [linkToken, setLinkToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state
  const { submitReview, error } = useReviewStore((state) => ({
    submitReview: state.submitReview,
    error: state.error,
  }));
const router=useRouter()
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setLinkToken(token);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button when submitting
    try {
      await submitReview({ linkToken, rating, description });
      toast.success('Review submitted successfully');
      setRating(0);
      setDescription('');
      router.push('/');
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Error submitting review');
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Submit Your Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 cursor-pointer transition-all transform hover:scale-110 ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="none"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              rows={5}
              placeholder="Write your review here..."
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 text-lg font-semibold text-white rounded-lg shadow-md transition-all duration-300 ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={isSubmitting} // Disable button when submitting
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
