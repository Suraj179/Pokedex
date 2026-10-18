import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { getPokemonGamePool } from '../api/getPokemonList';

const RED = '#DC2626';
const TOTAL_QUESTIONS = 10;

function shuffle(items) {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createQuestion(pool) {
  const choices = shuffle(pool).slice(0, 4);
  const answer = choices[0];

  return {
    answer,
    options: shuffle(choices),
  };
}

export default function GameScreen() {
  const [pool, setPool] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const feedbackScale = useRef(new Animated.Value(0.6)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  async function startGame() {
    setLoading(true);
    setError('');
    setFinished(false);
    setScore(0);
    setQuestionNumber(1);
    setSelectedAnswer(null);

    try {
      const pokemon = await getPokemonGamePool();

      if (pokemon.length < 4) {
        throw new Error('Not enough Pokémon available.');
      }

      setPool(pokemon);
      setQuestion(createQuestion(pokemon));
    } catch (err) {
      setError('Could not load Pokémon. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    startGame();
  }, []);

  function handleAnswer(pokemon) {
    if (selectedAnswer !== null || !question) return;

    setSelectedAnswer(pokemon.id);

    if (pokemon.id === question.answer.id) {
      setScore((previous) => previous + 1);

      // Reset the animation for each correct answer.
      feedbackScale.setValue(0.6);
      feedbackOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(feedbackScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(feedbackOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  function handleNext() {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setFinished(true);
      return;
    }

    setQuestion(createQuestion(pool));
    setQuestionNumber((previous) => previous + 1);
    setSelectedAnswer(null);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={RED} />
        <Text style={styles.statusText}>Loading Pokémon...</Text>
        <Text style={styles.subText}>
          Preparing your guessing game
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.statusText}>{error}</Text>

        <Pressable style={styles.primaryButton} onPress={startGame}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.trophy}>★</Text>
        <Text style={styles.finishTitle}>Round Complete!</Text>
        <Text style={styles.finalScore}>
          {score} / {TOTAL_QUESTIONS}
        </Text>
        <Text style={styles.statusText}>
          {score === TOTAL_QUESTIONS
            ? 'Perfect score! Amazing!'
            : score >= 7
              ? 'Great job, Pokémon Trainer!'
              : 'Good practice! Try another round.'}
        </Text>

        <Pressable style={styles.primaryButton} onPress={startGame}>
          <Text style={styles.primaryButtonText}>Play Again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const answered = selectedAnswer !== null;
  const correct = selectedAnswer === question.answer.id;
  const progress = questionNumber / TOTAL_QUESTIONS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>POKÉMON CHALLENGE</Text>
            <Text style={styles.heading}>Who's That Pokémon?</Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreCaption}>SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>
            Question {questionNumber} of {TOTAL_QUESTIONS}
          </Text>
          <Text style={styles.progressLabel}>
            {Math.round(progress * 100)}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        <View style={styles.imageCard}>
          <ImageBackground
            source={require('../assets/who-is-that.png')}
            style={styles.gameBackground}
            imageStyle={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.mysteryPokemon}>
              {imageLoading && !imageError && (
                <View style={styles.imageLoader}>
                  <ActivityIndicator size="large" color="#DC2626" />
                </View>
              )}

              {imageError ? (
                <Text style={styles.imageErrorText}>
                  Could not load Pokémon image.
                  {'\n'}Check your connection and try again.
                </Text>
              ) : (
                <Image
                  key={question.answer.id}
                  source={{ uri: question.answer.img }}
                  style={[
                    styles.pokemonImage,
                    imageLoading && styles.hiddenImage,
                  ]}
                  resizeMode="contain"
                  tintColor={answered ? undefined : '#111827'}
                  onLoadStart={() => {
                    setImageLoading(true);
                    setImageError(false);
                  }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                />
              )}
            </View>

            {answered && correct && (
              <Animated.View
                style={[
                  styles.successBadge,
                  {
                    opacity: feedbackOpacity,
                    transform: [{ scale: feedbackScale }],
                  },
                ]}
              >
                <Text style={styles.successEmoji}>★</Text>
                <Text style={styles.successTitle}>GOT IT!</Text>
                <Text style={styles.successName}>
                  {question.answer.name.toUpperCase()}
                </Text>
              </Animated.View>
            )}
          </ImageBackground>

          <Text style={styles.imageHint}>
            {answered
              ? question.answer.name.toUpperCase()
              : 'Who is this Pokémon?'}
          </Text>
        </View>

        <Text style={styles.chooseTitle}>Choose your answer</Text>

        <View style={styles.optionsGrid}>
          {question.options.map((pokemon) => {
            const isCorrect = pokemon.id === question.answer.id;
            const isSelected = selectedAnswer === pokemon.id;

            let buttonStyle = styles.optionButton;

            if (answered && isCorrect) {
              buttonStyle = [styles.optionButton, styles.correctButton];
            } else if (answered && isSelected) {
              buttonStyle = [styles.optionButton, styles.wrongButton];
            }

            return (
              <Pressable
                key={pokemon.id}
                style={buttonStyle}
                onPress={() => handleAnswer(pokemon)}
                disabled={answered}
                accessibilityRole="button"
                accessibilityLabel={pokemon.name}
              >
                <Text
                  style={[
                    styles.optionText,
                    answered && (isCorrect || isSelected)
                      ? styles.selectedOptionText
                      : null,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {pokemon.name.toUpperCase()}
                </Text>

                {answered && isCorrect && (
                  <Text style={styles.optionMark}>✓</Text>
                )}

                {answered && isSelected && !isCorrect && (
                  <Text style={styles.optionMark}>✕</Text>
                )}
              </Pressable>
            );
          })}
        </View>



        {answered && (
          <Pressable style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>
              {questionNumber === TOTAL_QUESTIONS
                ? 'See Final Score'
                : 'Next Pokémon  →'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gameBackground: {
    width: '100%',
    height: 235,
    marginTop: 18,
    overflow: 'hidden',
    borderRadius: 18,
    justifyContent: 'center',
  },

  backgroundImage: {
    borderRadius: 18,
  },

  mysteryPokemon: {
    position: 'absolute',
    left: '5%',
    top: 25,
    width: '52%',
    height: 175,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pokemonImage: {
    width: '100%',
    height: '100%',
  },

  imageHint: {
    marginTop: 8,
    textAlign: 'center',
    color: '#334155',
    fontSize: 14,
    fontWeight: '900',
  },

  successBadge: {
    position: 'absolute',
    left: '5%',
    bottom: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#22C55E',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    elevation: 6,
  },

  successEmoji: {
    color: '#16A34A',
    fontSize: 22,
    fontWeight: '900',
  },

  successTitle: {
    color: '#15803D',
    fontSize: 16,
    fontWeight: '900',
  },

  successName: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },

  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  optionButton: {
    width: '48%',
    minHeight: 54,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  center: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  eyebrow: {
    color: RED,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 5,
  },
  heading: {
    color: '#0F172A',
    fontSize: 19,
    fontWeight: '900',
    flexShrink: 1,
  },
  scoreBox: {
    minWidth: 66,
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  scoreCaption: {
    fontSize: 9,
    fontWeight: '800',
    color: RED,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
    color: RED,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 7,
  },
  progressLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: RED,
    borderRadius: 8,
  },
  imageCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
    padding: 10,
    minHeight: 220,
  },
  imageInstruction: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  chooseTitle: {
    marginTop: 18,
    marginBottom: 10,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  optionText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '900',
    flexShrink: 1,
  },
  optionMark: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  correctButton: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  wrongButton: {
    backgroundColor: RED,
    borderColor: RED,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  feedbackCard: {
    marginTop: 14,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  correctFeedback: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  wrongFeedback: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  feedbackDescription: {
    color: '#475569',
    fontSize: 12,
    marginTop: 4,
  },
  correctText: {
    color: '#15803D',
  },
  wrongText: {
    color: RED,
  },
  primaryButton: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: RED,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  statusText: {
    color: '#334155',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
  },
  subText: {
    color: '#64748B',
    marginTop: 6,
    fontSize: 12,
  },
  errorTitle: {
    color: RED,
    fontSize: 25,
    fontWeight: '900',
  },
  trophy: {
    fontSize: 56,
    color: RED,
  },
  finishTitle: {
    color: '#0F172A',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 12,
  },
  finalScore: {
    color: RED,
    fontSize: 44,
    fontWeight: '900',
    marginTop: 14,
  },
  imageLoader: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  loaderText: {
    marginTop: 8,
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  hiddenImage: {
    opacity: 0,
  },

  imageErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    padding: 8,
  },
});