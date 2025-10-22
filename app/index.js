import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

const Home = () => {
  const router = useRouter();
  const [translateX] = useState(new Animated.Value(0));
  const [isComplete, setIsComplete] = useState(false);
  
  // Animated values for chevron blinking
  const [chevron1Opacity] = useState(new Animated.Value(0.6));
  const [chevron2Opacity] = useState(new Animated.Value(0.6));
  const [chevron3Opacity] = useState(new Animated.Value(0.6));

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    const { translationX } = event.nativeEvent;
    const threshold = 200; // Adjust based on your button width

    if (translationX > threshold) {
      // Swipe completed
      setIsComplete(true);
      Animated.timing(translateX, {
        toValue: threshold,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        router.push('/login');
      });
    } else {
      // Snap back
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  // Infinite sequential chevron blinking animation
  useEffect(() => {
    const animateChevrons = () => {
      return Animated.loop(
        Animated.sequence([
          // Blink chevron 1
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
          // Blink chevron 2
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
          // Blink chevron 3
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
          // Pause before repeating
          Animated.delay(300),
        ])
      );
    };

    const animation = animateChevrons();
    animation.start();

    // Cleanup function
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/main-background.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.keyboardWrapper}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
              <StatusBar style="auto" />

              {/* Logo pinned to top left */}
              <Image
                source={require('../assets/habibi-logo-main.png')}
                style={styles.logoImage}
              />

              <View style={styles.innerContainer}>
                {/* Vertically centered Headings */}
                <View style={styles.topSection}>
                  <View style={styles.textContainer}>
                    <Text style={styles.habibiHeading}>Eat Healthy</Text>
                    <Text style={styles.fitnessHeading}>Stay Healthy</Text>
                  </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomContainer}>
                  <View style={styles.swipeButtonContainer}>
                    <Animated.View
                      style={[
                        styles.swipeBackground,
                        {
                          width: Animated.add(translateX, 55),
                        },
                      ]}
                    />
                    <Text style={styles.swipeText}>Lets start</Text>
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
                          {
                            transform: [{ translateX }],
                          },
                        ]}
                      >
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                      </Animated.View>
                    </PanGestureHandler>
                  </View>

                  <View style={styles.bottomTextContainer}>
                    <TouchableOpacity onPress={() => router.push('/recipe')}>
                      <Text style={styles.linkText}>Check Out The Menu</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardWrapper: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  habibiHeading: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#07da63',
    lineHeight: 66,
    marginBottom: -10,
  },
  fitnessHeading: {
    fontSize: 58,
    fontWeight: 'bold',
    color: 'white',
  },
  bottomContainer: {
    width: '100%',
    paddingBottom: 40,
  },
  swipeButtonContainer: {
    borderRadius: 30,
    marginBottom: 20,
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
  linkText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  logoImage: {
    width: 112,
    height: 53,
    resizeMode: 'contain',
    marginTop: 30,
    marginLeft: 12,
  },
});
