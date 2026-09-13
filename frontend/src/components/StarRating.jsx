export default function StarRating({ value, size = 18, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange(star)}
          style={{
            cursor: interactive ? "pointer" : "default",
            color: star <= Math.round(value) ? "#F5A623" : "#D9D9D9",
            fontSize: size,
            lineHeight: 1,
          }}
          role={interactive ? "button" : undefined}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}
