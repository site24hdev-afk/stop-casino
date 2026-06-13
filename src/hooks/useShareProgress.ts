import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { t } from '../i18n';

let Sharing: typeof import('expo-sharing') | null = null;
try {
  Sharing = require('expo-sharing');
} catch (e) {
  // Native module not available (simulator/web)
}

export function useShareProgress() {
  const shareCardRef = useRef<typeof ViewShot extends React.ComponentClass<any> ? InstanceType<typeof ViewShot> : any>(null);

  const shareProgress = useCallback(async () => {
    try {
      if (!shareCardRef.current?.capture) {
        Alert.alert(t('error'), t('share.errorCapture'));
        return;
      }

      if (!Sharing) {
        Alert.alert(t('error'), t('share.unavailable'));
        return;
      }

      const uri = await shareCardRef.current.capture();

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(t('error'), t('share.unavailable'));
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: t('share.shareTitle'),
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  }, []);

  return {
    shareCardRef,
    shareProgress,
  };
}
