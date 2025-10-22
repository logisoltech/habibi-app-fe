import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

const DeliciousMeals = () => {
  const router = useRouter();

  const [translateX] = useState(new Animated.Value(0));
  const [isComplete, setIsComplete] = useState(false);

  const [chevron1Opacity] = useState(new Animated.Value(0.6));
  const [chevron2Opacity] = useState(new Animated.Value(0.6));
  const [chevron3Opacity] = useState(new Animated.Value(0.6));

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    const { translationX } = event.nativeEvent;
    const threshold = 200;

    if (translationX > threshold) {
      setIsComplete(true);
      Animated.timing(translateX, {
        toValue: threshold,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        router.push('/login');
      });
    } else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    const animateChevrons = () =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(chevron1Opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(chevron1Opacity, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(chevron2Opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(chevron2Opacity, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(chevron3Opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(chevron3Opacity, {
            toValue: 0.6,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(300),
        ])
      );

    const animation = animateChevrons();
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <StatusBar style="dark" />

          <Image
            source={require('../assets/women-eating-food.jpg')}
            style={styles.heroImage}
          />

          <View style={styles.contentContainer}>
            <View style={styles.centerContent}>
              <Text style={styles.titleText}>Taste fresh delicious meals</Text>
              <Text style={styles.titleText}>anytime and anywhere</Text>

              <View style={styles.dotsContainer}>
                <View style={[styles.dot, { opacity: 0.5 }]} />
                <View style={styles.dotActive} />
                <View style={[styles.dot, { opacity: 0.5 }]} />
              </View>
            </View>

            <View style={styles.bottomActions}>
              <View style={styles.swipeButtonContainer}>
                <Animated.View
                  style={[
                    styles.swipeBackground,
                    { width: Animated.add(translateX, 55) },
                  ]}
                />
                <Text style={styles.swipeText}>Next</Text>
                <View style={styles.chevronContainer}>
                  <Animated.View style={{ opacity: chevron1Opacity }}>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,1)" />
                  </Animated.View>
                  <Animated.View style={{ opacity: chevron2Opacity }}>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,1)" />
                  </Animated.View>
                  <Animated.View style={{ opacity: chevron3Opacity }}>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,1)" />
                  </Animated.View>
                </View>
                <PanGestureHandler
                  onGestureEvent={onGestureEvent}
                  onHandlerStateChange={onHandlerStateChange}
                >
                  <Animated.View
                    style={[
                      styles.swipeThumb,
                      { transform: [{ translateX }] },
                    ]}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                  </Animated.View>
                </PanGestureHandler>
              </View>

              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.skipText}>SKIP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DeliciousMeals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 16,
  },
  centerContent: {
    alignItems: 'center',
  },
  titleText: {
    textAlign: 'center',
    color: '#07da63',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 18,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#07da63',
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#07da63',
  },
  bottomActions: {
    width: '100%',
  },
  swipeButtonContainer: {
    borderRadius: 30,
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 5,
  },
  swipeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },
  swipeBackground: {
    position: 'absolute',
    left: 5,
    top: 5,
    height: 50,
    backgroundColor: '#07da63',
    borderRadius: 25,
    opacity: 1,
    maxWidth: '100%',
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  swipeThumb: {
    position: 'absolute',
    left: 5,
    width: 55,
    height: 50,
    backgroundColor: '#07da63',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  skipButton: {
    marginTop: 14,
    alignSelf: 'center',
  },
  skipText: {
    color: '#07da63',
    fontWeight: '700',
    letterSpacing: 1,
  },
});


