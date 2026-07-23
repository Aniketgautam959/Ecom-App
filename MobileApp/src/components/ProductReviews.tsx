import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { api, messageFrom } from "../api";
import { useApp } from "../context/AppContext";
import { colors, spacing } from "../styles";

type Review = {
  id: number;
  rating: number;
  comment: string;
  reviewer: string;
  initials: string;
  date: string;
};

function Star({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <Ionicons
      name={filled ? "star" : "star-outline"}
      size={size}
      color={filled ? "#FACC15" : colors.mutedDark}
      style={{ marginRight: 2 }}
    />
  );
}

export function ProductReviews({ productId }: { productId: number }) {
  const { user } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/products/${productId}/reviews`)
      .then((res) => {
        const data = (res.data as { data?: Review[] }).data ?? [];
        if (active) setReviews(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const submit = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const res = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment: comment.trim(),
      });
      const review = (res.data as { data?: Review }).data;
      if (review) setReviews((prev) => [review, ...prev]);
      setComment("");
      setRating(5);
      setMessage("Review submitted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(messageFrom(err));
    } finally {
      setSubmitting(false);
    }
  };

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <View style={{ paddingBottom: spacing.md }}>
      {avg && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", marginRight: spacing.sm }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} filled={i <= Math.round(Number(avg))} />
            ))}
          </View>
          <Text style={{ fontSize: 13, color: colors.textMuted }}>
            {avg} out of 5 ({reviews.length})
          </Text>
        </View>
      )}

      {user ? (
        <View
          style={{
            backgroundColor: colors.muted,
            borderRadius: 8,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.text,
              marginBottom: spacing.sm,
            }}
          >
            Write a Review
          </Text>
          <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} onPress={() => setRating(i)} style={{ marginRight: 4 }}>
                <Star filled={i <= rating} size={20} />
              </Pressable>
            ))}
            <Text
              style={{ fontSize: 12, color: colors.textLight, marginLeft: spacing.sm }}
            >
              {rating}/5
            </Text>
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{
              borderWidth: 1,
              borderColor: colors.mutedDark,
              borderRadius: 6,
              padding: spacing.sm,
              fontSize: 13,
              color: colors.text,
              backgroundColor: colors.background,
              marginBottom: spacing.sm,
            }}
          />
          {error ? (
            <Text style={{ fontSize: 12, color: colors.error, marginBottom: spacing.sm }}>
              {error}
            </Text>
          ) : null}
          {message ? (
            <Text
              style={{ fontSize: 12, color: colors.success, marginBottom: spacing.sm }}
            >
              {message}
            </Text>
          ) : null}
          <Pressable
            onPress={submit}
            disabled={submitting || !comment.trim()}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: 6,
              alignSelf: "flex-start",
              opacity: submitting || !comment.trim() ? 0.5 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Text style={{ fontSize: 13, color: colors.textLight, marginBottom: spacing.md }}>
          Please log in to write a review.
        </Text>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginVertical: spacing.md }} />
      ) : reviews.length === 0 ? (
        <Text
          style={{ fontSize: 13, color: colors.textLight, fontStyle: "italic" }}
        >
          No reviews yet. Be the first to review this product.
        </Text>
      ) : (
        <View style={{ gap: spacing.md }}>
          {reviews.map((r) => (
            <View key={r.id} style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: spacing.md,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
                  {r.initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: colors.text,
                      marginRight: spacing.sm,
                    }}
                  >
                    {r.reviewer}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textLight }}>{r.date}</Text>
                </View>
                <View style={{ flexDirection: "row", marginBottom: spacing.xs }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} filled={i <= r.rating} size={12} />
                  ))}
                </View>
                <Text style={{ fontSize: 13, color: colors.textMuted }}>{r.comment}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
