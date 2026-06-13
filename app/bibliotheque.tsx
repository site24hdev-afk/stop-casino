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
let Image: any;
try { Image = require('expo-image').Image; } catch (e) { Image = require('react-native').Image; }
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
let LinearGradient: any = 'View'; try { LinearGradient = require('expo-linear-gradient').LinearGradient; } catch (e) { LinearGradient = require('react-native').View; }
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../src/constants/theme';
import { ARTICLES, CATEGORIES, Article } from '../src/constants/library';
import { useSubscription } from '../src/hooks/useSubscription';
import { useColors, useTheme } from '../src/context/ThemeContext';
import i18n, { t } from '../src/i18n';

export default function BibliothequeScreen() {
  const router = useRouter();
  const { limits } = useSubscription();
  const c = useColors();
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articleLimit = limits.libraryArticles;
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
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {!isDark && <LinearGradient colors={GRADIENTS.screenBg} style={StyleSheet.absoluteFill} />}
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: c.surfaceGlass, borderColor: c.borderLight }]}>
            <Ionicons name="arrow-back" size={22} color={c.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.text }]}>{t('library.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={[styles.subtitle, { color: c.textSecondary }]}>{t('library.subtitle')}</Text>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrap} contentContainerStyle={styles.filters}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.filterChip, activeCategory === cat.key && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat.key)}
            >
              <Ionicons name={cat.icon as any} size={14} color={activeCategory === cat.key ? '#FFF' : COLORS.textMuted} />
              <Text style={[styles.filterText, activeCategory === cat.key && styles.filterTextActive]}>
                {t(cat.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Articles */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filtered.map((article, index) => {
            const isLocked = articleLimit !== -1 && index >= articleLimit;
            return (
              <TouchableOpacity
                key={article.id}
                style={[styles.articleCard, { backgroundColor: c.surfaceGlass, borderColor: c.borderGlass }, isLocked && { opacity: 0.45 }]}
                onPress={() => isLocked ? router.push('/abonnement') : setSelectedArticle(article)}
                activeOpacity={0.7}
              >
                {article.image && (
                  <View style={styles.articleImgWrap}>
                    <Image source={article.image} style={styles.articleImg} contentFit="cover" transition={400} />
                    <View style={styles.articleImgOverlay} />
                    <View style={[styles.articleImgBadge, { backgroundColor: isLocked ? COLORS.textMuted : getCategoryColor(article.category) }]}>
                      <Ionicons name={isLocked ? 'lock-closed' : article.icon as any} size={14} color="#FFF" />
                    </View>
                  </View>
                )}
                <View style={styles.articleBody}>
                  <View style={styles.articleMeta}>
                    <Text style={[styles.articleCat, { color: isLocked ? COLORS.textMuted : getCategoryColor(article.category) }]}>
                      {t(`articles.a${article.id}.category`) || article.categoryLabel}
                    </Text>
                    {isLocked ? (
                      <View style={styles.lockBadge}>
                        <Ionicons name="lock-closed" size={10} color={COLORS.warning} />
                        <Text style={styles.lockText}>PRO</Text>
                      </View>
                    ) : (
                      <Text style={styles.articleTime}>
                        <Ionicons name="time-outline" size={12} color={COLORS.textMuted} /> {t(`articles.a${article.id}.readTime`) || article.readTime}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.articleTitle, { color: c.text }, isLocked && { color: COLORS.textMuted }]}>{t(`articles.a${article.id}.title`) || article.title}</Text>
                  <Text style={[styles.articlePreview, { color: c.textSecondary }]} numberOfLines={2}>{((i18n.t(`articles.a${article.id}.content`) as unknown as string[]) || article.content)[0]}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Read Modal */}
        <Modal visible={!!selectedArticle} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? c.surfaceGlass : '#FFFFFF' }]}>
              {selectedArticle && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalDrag} />
                    <TouchableOpacity style={[styles.modalClose, { backgroundColor: c.surfaceGlass, borderColor: c.borderLight }]} onPress={() => setSelectedArticle(null)}>
                      <Ionicons name="close" size={22} color={c.text} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {selectedArticle.image && (
                      <View style={styles.modalImgWrap}>
                        <Image source={selectedArticle.image} style={styles.modalImg} contentFit="cover" transition={400} />
                        <View style={styles.modalImgGrad} />
                      </View>
                    )}

                    <View style={[styles.modalCatBadge, { backgroundColor: `${getCategoryColor(selectedArticle.category)}15` }]}>
                      <Ionicons name={selectedArticle.icon as any} size={16} color={getCategoryColor(selectedArticle.category)} />
                      <Text style={[styles.modalCatText, { color: getCategoryColor(selectedArticle.category) }]}>
                        {t(`articles.a${selectedArticle.id}.category`) || selectedArticle.categoryLabel} · {t(`articles.a${selectedArticle.id}.readTime`) || selectedArticle.readTime}
                      </Text>
                    </View>

                    <Text style={[styles.modalTitle, { color: c.text }]}>{t(`articles.a${selectedArticle.id}.title`) || selectedArticle.title}</Text>

                    {((i18n.t(`articles.a${selectedArticle.id}.content`) as unknown as string[]) || selectedArticle.content).map((paragraph: string, i: number) => (
                      <Text key={i} style={[styles.modalPara, { color: c.textSecondary }]}>{paragraph}</Text>
                    ))}

                    <View style={[styles.modalFooter, { backgroundColor: c.primaryBg }]}>
                      <Ionicons name="heart" size={16} color={COLORS.primary} />
                      <Text style={[styles.modalFooterText, { color: c.textSecondary }]}>{t('library.readFooter')}</Text>
                    </View>

                    <View style={{ height: 40 }} />
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  safeArea: { flex: 1 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },

  // Filters
  filtersWrap: { maxHeight: 50, marginBottom: SPACING.lg },
  filters: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, flexDirection: 'row' },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, gap: 6 },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
  filterTextActive: { color: '#FFF', fontWeight: '600' },

  // Articles
  list: { flex: 1, paddingHorizontal: SPACING.lg },
  articleCard: { backgroundColor: COLORS.surfaceGlass, borderRadius: 18, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.borderGlass },
  articleImgWrap: { height: 120, width: '100%', position: 'relative' },
  articleImg: { width: '100%', height: '100%' },
  articleImgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,8,15,0.25)' },
  articleImgBadge: { position: 'absolute', bottom: 8, left: 12, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  articleBody: { padding: SPACING.lg },
  articleMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  articleCat: { fontSize: FONT_SIZE.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  articleTime: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
  articleTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: 6, lineHeight: 22 },
  articlePreview: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, lineHeight: 20 },
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245,158,11,0.12)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  lockText: { fontSize: 10, fontWeight: '800', color: COLORS.warning },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: SPACING.lg, maxHeight: '92%' },
  modalHeader: { alignItems: 'center', paddingVertical: SPACING.md },
  modalDrag: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.surfaceLight, marginBottom: SPACING.md },
  modalClose: { position: 'absolute', right: 0, top: SPACING.md, width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.surfaceGlass, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center', alignItems: 'center' },
  modalImgWrap: { height: 160, width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: SPACING.lg },
  modalImg: { width: '100%', height: '100%' },
  modalImgGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(6,8,15,0.15)' },
  modalCatBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, gap: 6, marginBottom: SPACING.lg },
  modalCatText: { fontSize: FONT_SIZE.sm, fontWeight: '600' },
  modalTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text, lineHeight: 36, marginBottom: SPACING.xl },
  modalPara: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, lineHeight: 28, marginBottom: SPACING.lg },
  modalFooter: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryBg, borderRadius: 16, padding: SPACING.lg, gap: SPACING.sm, marginTop: SPACING.md },
  modalFooterText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontStyle: 'italic' },
});
