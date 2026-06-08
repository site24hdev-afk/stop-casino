import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { ARTICLES, CATEGORIES, Article } from '../src/constants/library';

export default function BibliothequeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filtered = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'mecanisme': return COLORS.info;
      case 'piege': return COLORS.warning;
      case 'temoignage': return COLORS.primary;
      case 'exercice': return '#A78BFA';
      default: return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bibliothèque</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>
        Comprendre l'addiction pour mieux la combattre
      </Text>

      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filters}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.filterChip,
              activeCategory === cat.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={activeCategory === cat.key ? '#FFF' : COLORS.textSecondary}
            />
            <Text style={[
              styles.filterText,
              activeCategory === cat.key && styles.filterTextActive,
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => setSelectedArticle(article)}
            activeOpacity={0.7}
          >
            {article.image && (
              <View style={styles.articleImageWrap}>
                <Image
                  source={article.image}
                  style={styles.articleImage}
                  contentFit="cover"
                  transition={400}
                />
                <View style={styles.articleImageOverlay} />
                <View style={[
                  styles.articleImageBadge,
                  { backgroundColor: getCategoryColor(article.category) },
                ]}>
                  <Ionicons name={article.icon as any} size={14} color="#FFF" />
                </View>
              </View>
            )}
            <View style={styles.articleBody}>
              <View style={styles.articleMeta}>
                <Text style={[
                  styles.articleCategory,
                  { color: getCategoryColor(article.category) },
                ]}>
                  {article.categoryLabel}
                </Text>
                <Text style={styles.articleTime}>
                  <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
                  {' '}{article.readTime}
                </Text>
              </View>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articlePreview} numberOfLines={2}>
                {article.content[0]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal lecture */}
      <Modal visible={!!selectedArticle} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedArticle && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalDrag} />
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setSelectedArticle(null)}
                  >
                    <Ionicons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {selectedArticle.image && (
                    <View style={styles.modalImageWrap}>
                      <Image
                        source={selectedArticle.image}
                        style={styles.modalImage}
                        contentFit="cover"
                        transition={400}
                      />
                      <View style={styles.modalImageGradient} />
                    </View>
                  )}

                  <View style={[
                    styles.modalCategoryBadge,
                    { backgroundColor: `${getCategoryColor(selectedArticle.category)}20` },
                  ]}>
                    <Ionicons
                      name={selectedArticle.icon as any}
                      size={16}
                      color={getCategoryColor(selectedArticle.category)}
                    />
                    <Text style={[
                      styles.modalCategoryText,
                      { color: getCategoryColor(selectedArticle.category) },
                    ]}>
                      {selectedArticle.categoryLabel} · {selectedArticle.readTime}
                    </Text>
                  </View>

                  <Text style={styles.modalTitle}>{selectedArticle.title}</Text>

                  {selectedArticle.content.map((paragraph, i) => (
                    <Text key={i} style={styles.modalParagraph}>
                      {paragraph}
                    </Text>
                  ))}

                  <View style={styles.modalFooter}>
                    <Ionicons name="heart" size={16} color={COLORS.primary} />
                    <Text style={styles.modalFooterText}>
                      Chaque lecture te rapproche de la liberté.
                    </Text>
                  </View>

                  <View style={{ height: 40 }} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: SPACING.lg,
  },
  filters: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  articleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  articleImageWrap: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  articleImageOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.25)',
  },
  articleImageBadge: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleBody: {
    padding: SPACING.lg,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  articleCategory: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  articleTime: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  articleTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  articlePreview: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    maxHeight: '92%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  modalDrag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: SPACING.md,
  },
  modalClose: {
    position: 'absolute',
    right: 0,
    top: SPACING.md,
  },
  modalImageWrap: {
    height: 160,
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.15)',
  },
  modalCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    gap: 6,
    marginBottom: SPACING.lg,
  },
  modalCategoryText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 36,
    marginBottom: SPACING.xl,
  },
  modalParagraph: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 28,
    marginBottom: SPACING.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  modalFooterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
