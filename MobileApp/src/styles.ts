import { StyleSheet } from "react-native";

export const colors = {
  primary: "#111827",
  primaryLight: "#374151",
  accent: "#5B3DF5",
  background: "#FFFFFF",
  muted: "#F3F4F6",
  mutedDark: "#E5E7EB",
  text: "#111827",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  success: "#16A34A",
  successLight: "#F0FDF4",
  error: "#EF4444",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const styles = StyleSheet.create({
  // Layout
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row: { flexDirection: "row", alignItems: "center" },
  spaceBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  gapSm: { gap: spacing.sm },
  gapMd: { gap: spacing.md },
  gapLg: { gap: spacing.lg },

  // Header
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.text },
  headerBrand: { fontSize: 18, fontWeight: "800", color: colors.primary },
  headerIcon: { fontSize: 22, color: colors.primary },
  headerBack: { fontSize: 28, color: colors.primary, lineHeight: 30, paddingRight: spacing.md },

  // Web-style header used on many pages
  webNav: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  webBrand: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  webBrandMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  webBrandLetter: { color: "#fff", fontSize: 13, fontWeight: "800" },
  webBrandText: { fontSize: 16, fontWeight: "700", color: colors.text },
  webNavActions: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  webNavIcon: { fontSize: 20, color: colors.primary },

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.muted,
  },
  navItem: { fontSize: 11, color: colors.textMuted, textAlign: "center" },
  navActive: { fontSize: 11, color: colors.primary, textAlign: "center", fontWeight: "700" },

  // Page header
  pageHeader: {
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: spacing.xs },
  breadcrumb: { fontSize: 13, color: colors.textLight },
  breadcrumbActive: { color: colors.textMuted },

  // Typography
  heading: { fontSize: 20, fontWeight: "700", color: colors.text, marginBottom: spacing.md },
  subheading: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  body: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  small: { fontSize: 12, color: colors.textLight },
  caption: { fontSize: 11, color: colors.textLight, textTransform: "uppercase", letterSpacing: 1, fontWeight: "800" },
  link: { fontSize: 13, color: colors.primary, textDecorationLine: "underline" },

  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  secondaryButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.mutedDark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { color: colors.text, fontSize: 14, fontWeight: "600" },
  textButton: { paddingVertical: spacing.sm },
  textButtonText: { color: colors.primary, fontSize: 13, fontWeight: "600" },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: colors.mutedDark,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textarea: { minHeight: 80, textAlignVertical: "top" },
  inputLabel: { fontSize: 13, fontWeight: "500", color: colors.textMuted, marginBottom: spacing.xs },
  inputError: { borderColor: colors.error },

  // Cards
  card: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: "hidden",
    margin: spacing.xs,
  },
  cardImage: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  placeholder: { color: colors.textLight, fontSize: 12 },
  cardBody: { padding: spacing.md },
  cardTitle: { fontSize: 13, fontWeight: "500", color: colors.text, marginBottom: spacing.sm },
  cardPrice: { fontSize: 13, fontWeight: "500", color: colors.text },
  cardMuted: { fontSize: 11, color: colors.textLight, marginBottom: spacing.xs },
  stockBadge: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginRight: spacing.sm,
  },
  stockBadgeText: { fontSize: 10, color: "#4B5563", textTransform: "uppercase" },

  // Product grid
  grid: { paddingHorizontal: spacing.sm, paddingBottom: spacing.xxl },
  grid2Col: { width: "50%", padding: spacing.xs },
  grid3Col: { width: "33.33%", padding: spacing.xs },

  // Wishlist heart
  heart: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Cart
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  cartImage: { width: 64, height: 64, backgroundColor: colors.muted, borderRadius: 6, overflow: "hidden" },
  cartInfo: { flex: 1, paddingHorizontal: spacing.md },
  cartName: { fontSize: 13, fontWeight: "700", color: colors.text },
  cartVariant: { fontSize: 12, color: colors.textLight, marginTop: spacing.xs },
  cartPrice: { fontSize: 13, fontWeight: "700", color: colors.text },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.mutedDark,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
  },
  quantityText: { fontSize: 13, paddingHorizontal: spacing.md, color: colors.text },
  quantityButton: { padding: spacing.xs },

  // Order summary
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.xs },
  summaryLabel: { fontSize: 13, color: colors.textMuted },
  summaryValue: { fontSize: 13, color: colors.text, fontWeight: "600" },
  summaryTotal: { borderTopWidth: 1, borderTopColor: colors.muted, marginTop: spacing.sm, paddingTop: spacing.sm },

  // Forms
  form: { padding: spacing.lg, gap: spacing.lg },
  formGroup: { gap: spacing.sm },
  formRow: { flexDirection: "row", gap: spacing.md },
  formHalf: { flex: 1 },

  // Option cards (address, payment)
  option: {
    borderWidth: 1,
    borderColor: colors.mutedDark,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: colors.muted },
  optionTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  optionText: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },

  // Status badge
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "700" },

  // Empty states
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xxl },
  emptyIcon: { fontSize: 48, color: colors.mutedDark, marginBottom: spacing.md },
  emptyText: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },

  // Alerts
  successBox: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  alertText: { fontSize: 13, color: colors.text },

  // Menu items
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  menuText: { fontSize: 14, color: colors.text },

  // Web-style card
  webCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.mutedDark,
    borderRadius: 10,
    padding: spacing.lg,
  },

  // Promo banner
  promoBanner: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  promoText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  // Hero
  hero: {
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  heroEyebrow: { fontSize: 11, color: colors.textLight, letterSpacing: 1.5, fontWeight: "800", marginBottom: spacing.sm },
  heroTitle: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  heroSubtitle: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg },

  // Section
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: colors.text },

  // Pills / chips
  chip: {
    backgroundColor: colors.muted,
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipText: { fontSize: 12, color: colors.textMuted },
  chipActive: { backgroundColor: colors.primary },
  chipActiveText: { color: "#fff" },

  // Timeline
  timelineItem: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  timelineActive: { backgroundColor: colors.primary },
  timelineInactive: { backgroundColor: colors.mutedDark },
  timelineText: { fontSize: 14, color: colors.text },
  timelineTextMuted: { fontSize: 14, color: colors.textLight },

  // Misc
  divider: { height: 1, backgroundColor: colors.muted, marginVertical: spacing.md },
  roundButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#B45309" },
  confirmed: { bg: "#DBEAFE", text: "#1D4ED8" },
  processing: { bg: "#E0E7FF", text: "#4338CA" },
  shipped: { bg: "#F3E8FF", text: "#7E22CE" },
  delivered: { bg: "#DCFCE7", text: "#15803D" },
  cancelled: { bg: "#FEE2E2", text: "#B91C1C" },
  refunded: { bg: "#F3F4F6", text: "#374151" },
};

export const money = (value: number | string | null | undefined) =>
  `₹ ${Number(value ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
