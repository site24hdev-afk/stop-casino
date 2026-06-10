import { useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

export function useShareProgress() {
  const shareCardRef = useRef<typeof ViewShot extends React.ComponentClass<any> ? InstanceType<typeof ViewShot> : any>(null);

  const shareProgress = useCallback(async () => {
    try {
      if (!shareCardRef.current?.capture) {
        Alert.alert('Erreur', 'Impossible de capturer la carte.');
        return;
      }

      const uri = await shareCardRef.current.capture();

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Partage indisponible', 'Le partage n\'est pas disponible sur cet appareil.');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Partager ma progression Stop Casino',
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
