import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ApiService from './services/api';

// Import fallback image
import fish from "../assets/fish.png"

const Recipe = () => {
  const router = useRouter();
  
  // State management
  const [allRecipes, setAllRecipes] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const RECIPES_PER_PAGE = 5;

  // Fetch recipes from database
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Filter recipes when search query changes
  useEffect(() => {
    filterAndPaginateRecipes();
  }, [allRecipes, currentPage, searchQuery]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getMeals();
      
      if (response.success && response.data) {
        setAllRecipes(response.data);
      } else {
        throw new Error('Failed to fetch recipes');
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndPaginateRecipes = () => {
    let filtered = allRecipes;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = allRecipes.filter(recipe => 
        recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Paginate
    const endIndex = currentPage * RECIPES_PER_PAGE;
    setDisplayedRecipes(filtered.slice(0, endIndex));
  };

  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const getFilteredRecipesCount = () => {
    if (searchQuery.trim()) {
      return allRecipes.filter(recipe => 
        recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category?.toLowerCase().includes(searchQuery.toLowerCase())
      ).length;
    }
    return allRecipes.length;
  };

  const hasMoreRecipes = displayedRecipes.length < getFilteredRecipesCount();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}> Go Back</Text>
        </TouchableOpacity>

        <View style={styles.contentWrapper}>
          <Text style={styles.phoneheading}>
            Explore <Text style={styles.signin}>All Recipes</Text> We Have
          </Text>
          <TextInput
            style={styles.phoneinput}
            placeholder="Search recipes by name, category, or description"
            keyboardType="default"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </View>

        {/* Recipe Cards */}
        <ScrollView style={styles.cardList} showsVerticalScrollIndicator={false}>
          {loading && displayedRecipes.length === 0 ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#07da63" />
              <Text style={styles.loadingText}>Loading recipes...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>❌ {error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchRecipes}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : displayedRecipes.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                {searchQuery ? `No recipes found for "${searchQuery}"` : 'No recipes available'}
              </Text>
            </View>
          ) : (
            <>
              {displayedRecipes.map((recipe, index) => (
                <View key={recipe.id || index} style={styles.card}>
                  <Image 
                    source={recipe.image_url ? { uri: recipe.image_url } : fish} 
                    style={styles.cardImage} 
                  />
                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{recipe.name || 'Delicious Meal'}</Text>
                    </View>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {recipe.description || 'A delicious and nutritious meal'}
                    </Text>
                    <View style={styles.cardTagsContainer}>
                      {recipe.category && (
                        <View style={styles.categoryTag}>
                          <Text style={styles.categoryTagText}>{recipe.category}</Text>
                        </View>
                      )}
                      
                    </View>
                    <Text style={styles.cardStats}>
                      {[
                        recipe.calories ? `${recipe.calories} kcal` : null,
                        recipe.protein ? `${recipe.protein}g Protein` : null,
                        recipe.carbs ? `${recipe.carbs}g Carbs` : null,
                        recipe.fat ? `${recipe.fat}g Fats` : 0,
                      ].filter(Boolean).join(' • ') || 'Nutritional information not available'}
                    </Text>
                  </View>
                </View>
              ))}
              
              {/* Show More Button */}
              {hasMoreRecipes && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={handleShowMore}
                >
                  <Text style={styles.showMoreText}>Show More</Text>
                  <Text style={styles.showMoreSubtext}>
                    Showing {displayedRecipes.length} of {getFilteredRecipesCount()} recipes
                  </Text>
                </TouchableOpacity>
              )}
              
              {!hasMoreRecipes && displayedRecipes.length > 0 && (
                <View style={styles.endMessage}>
                  <Text style={styles.endMessageText}>
                    You've seen all {getFilteredRecipesCount()} recipes! 🎉
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>

        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Recipe;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    innerContainer: {
      flex: 1,
      paddingHorizontal: 12,
    },
    backButton: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black',
      marginTop: 16,
    },
    contentWrapper: {
      marginTop: 20,
    },
    phoneheading: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 12,
    },
    signin: {
      color: '#07da63',
    },
    phoneinput: {
      padding: 15,
      borderWidth: 1,
      borderColor: '#d3d3d3',
      borderRadius: 100,
      fontSize: 16,
      width: '100%',
      marginBottom: 20,
    },
    cardList: {
      flex: 1,
      marginBottom: 10,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#666',
    },
    errorText: {
      fontSize: 16,
      color: '#ff4444',
      textAlign: 'center',
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: '#07da63',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    card: {
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 20,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardImage: {
      width: '100%',
      height: 180,
      resizeMode: 'cover',
    },
    cardInfo: {
      backgroundColor: '#f9f9f9',
      padding: 14,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      flex: 1,
    },
    cardPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#07da63',
      marginLeft: 8,
    },
    cardDescription: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
      lineHeight: 20,
    },
    cardTagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
      gap: 8,
    },
    categoryTag: {
      backgroundColor: '#07da63',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryTagText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    cardStats: {
      fontSize: 13,
      color: '#888',
      marginTop: 4,
    },
    showMoreButton: {
      backgroundColor: '#07da63',
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 20,
      marginTop: 10,
      alignItems: 'center',
    },
    showMoreText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    showMoreSubtext: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
      marginTop: 4,
    },
    endMessage: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    endMessageText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
    loginButton: {
      backgroundColor: '#07da63',
      paddingVertical: 12,
      borderRadius: 100,
      marginVertical: 10,
      width: '100%',
      alignSelf: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  