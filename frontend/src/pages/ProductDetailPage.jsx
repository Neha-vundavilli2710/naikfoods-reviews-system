import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct, getReviews, postReview } from "../api.js";
import RatingSummary from "../components/RatingSummary.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function loadReviews(currentSort, currentPage) {
    return getReviews(slug, { sort: currentSort, page: currentPage, limit: 5 }).then(
      ({ reviews, pagination }) => {
        setReviews(reviews);
        setPagination(pagination);
      }
    );
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    setNotFound(false);
    getProduct(slug)
      .then((p) => {
        setProduct(p);
        return loadReviews(sort, 1);
      })
      .catch((err) => {
        if (String(err.message).includes("404") || err.notFound) setNotFound(true);
        else setError("Could not load this product. Is the backend running?");
      })
      .finally(() => setLoading(false));
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (!loading && product) {
      loadReviews(sort, page).catch(() => setError("Could not load reviews."));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page]);

  async function handleSubmit(review, resetForm) {
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    try {
      const { product: updatedProduct } = await postReview(slug, review);
      setProduct(updatedProduct);
      setSort("newest");
      setPage(1);
      await loadReviews("newest", 1);
      resetForm();
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="status-message">Loading…</p>;

  if (notFound) {
    return (
      <div className="status-message">
        <p>We couldn't find that product.</p>
        <Link to="/" className="back-link">← Back to products</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-message status-message--error">
        <p>{error}</p>
        <Link to="/" className="back-link">← Back to products</Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      <div className="product-detail__top">
        <img src={product.image} alt={product.name} />
        <div>
          <span className="product-card__category">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <div className="product-detail__price">
            ₹{product.price}
            {product.weight ? ` · ${product.weight}` : ""}
          </div>
        </div>
      </div>

      <div className="product-detail__reviews-section">
        <RatingSummary
          averageRating={product.averageRating}
          reviewCount={product.reviewCount}
          ratingBreakdown={product.ratingBreakdown}
        />

        <div className="product-detail__reviews-columns">
          <div>
            <ReviewList
              reviews={reviews}
              sort={sort}
              onSortChange={(s) => {
                setSort(s);
                setPage(1);
              }}
            />
            {pagination.totalPages > 1 && (
              <div className="review-pagination">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Prev
                </button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          <div>
            {submitSuccess && (
              <p className="review-form__success">
                Thanks — your review was posted and the rating above is updated.
              </p>
            )}
            <ReviewForm onSubmit={handleSubmit} submitting={submitting} error={submitError} />
          </div>
        </div>
      </div>
    </div>
  );
}
