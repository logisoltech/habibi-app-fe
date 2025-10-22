import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Line } from 'react-native-svg';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserData } from './contexts/UserDataContext';
import ApiService from './services/api';
import SideMenu from './components/SideMenu';
import BottomNavigation from './components/BottomNavigation';


const WeeklyAreaChart = ({ weeklyData = [0, 0, 0, 0, 0, 0, 0], mini = false }) => {
  // weeklyData is an array of 7 values (one for each day)
  const W = mini ? 140 : (SCREEN_WIDTH - 32); // side padding of container
  const H = mini ? 60 : 220; // Increased from 140
  const PADDING_X = mini ? 8 : 20;
  const PADDING_Y = mini ? 8 : 20;
  const BASELINE = H - PADDING_Y; // ground line height

  // Ensure we have 7 data points
  const data = weeklyData.length === 7 ? weeklyData : [0, 0, 0, 0, 0, 0, 0];
  
  // Normalize data to fit in the chart (0-1 range)
  const maxValue = Math.max(...data, 1); // Avoid division by zero
  const normalizedData = data.map(v => v / maxValue);

  const stepX = (W - PADDING_X * 2) / (normalizedData.length - 1);
  const points = normalizedData.map((v, i) => ({
    x: PADDING_X + i * stepX,
    y: BASELINE - v * (H - PADDING_Y * 2 - 20), // amplitude with more space
  }));

  // Build smooth cubic bezier path
  const buildPath = () => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${BASELINE} L ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    // Close to baseline for area fill
    const last = points[points.length - 1];
    d += ` L ${last.x} ${BASELINE} L ${points[0].x} ${BASELINE} Z`;
    return d;
  };

  const pathD = buildPath();
  const accentColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#C7CEEA', '#B4DFF5'];

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <SvgLinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#07da63" stopOpacity="0.8" />
          <Stop offset="50%" stopColor="#66E89B" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#E0F7E9" stopOpacity="0.1" />
        </SvgLinearGradient>
        <SvgLinearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#07da63" stopOpacity="1" />
          <Stop offset="50%" stopColor="#05a84a" stopOpacity="1" />
          <Stop offset="100%" stopColor="#07da63" stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>

      {/* Horizontal grid lines - only show for full size */}
      {!mini && [0.25, 0.5, 0.75].map((ratio, i) => (
        <Line
          key={`h-${i}`}
          x1={PADDING_X}
          y1={PADDING_Y + (H - PADDING_Y * 2) * ratio}
          x2={W - PADDING_X}
          y2={PADDING_Y + (H - PADDING_Y * 2) * ratio}
          stroke="#E8F5E9"
          strokeWidth={1.5}
        />
      ))}

      {/* Dashed vertical day lines - only show for full size */}
      {!mini && new Array(7).fill(0).map((_, i) => (
        <Line
          key={`v-${i}`}
          x1={PADDING_X + i * stepX}
          y1={PADDING_Y}
          x2={PADDING_X + i * stepX}
          y2={BASELINE}
          stroke="#E8F5E9"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      ))}

      {/* Area path with gradient */}
      <Path d={pathD} fill="url(#areaGrad)" />
      
      {/* Stroke line with gradient */}
      <Path 
        d={(() => {
          if (points.length === 0) return '';
          let d = `M ${points[0].x} ${points[0].y}`;
          for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cx = (p0.x + p1.x) / 2;
            d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
          }
          return d;
        })()}
        fill="none"
        stroke="url(#strokeGrad)"
        strokeWidth={mini ? 2 : 3.5}
      />

      {/* Data point markers with glow effect */}
      {!mini && points.map((p, i) => (
        <React.Fragment key={`point-${i}`}>
          {/* Outer glow */}
          <Circle cx={p.x} cy={p.y} r={10} fill={accentColors[i]} opacity={0.2} />
          <Circle cx={p.x} cy={p.y} r={7} fill={accentColors[i]} opacity={0.4} />
          {/* Main point */}
          <Circle cx={p.x} cy={p.y} r={6} fill="#fff" stroke={accentColors[i]} strokeWidth={3} />
          {/* Center dot */}
          <Circle cx={p.x} cy={p.y} r={2.5} fill={accentColors[i]} />
        </React.Fragment>
      ))}
      
      {/* Mini chart points - simpler */}
      {mini && points.map((p, i) => (
        <Circle key={`mini-point-${i}`} cx={p.x} cy={p.y} r={3} fill="#07da63" />
      ))}
    </Svg>
  );
};

const Home = () => {
  const params = useLocalSearchParams();
  const [query, setQuery] = useState("");
  const [activeDay, setActiveDay] = useState("MON");
  const [activeMeal, setActiveMeal] = useState("Lunch");
  const [meals, setMeals] = useState([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [mealsError, setMealsError] = useState(null);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [isStatsEnabled, setIsStatsEnabled] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Monday, 1 = Tuesday, etc.
  const [userMealTypes, setUserMealTypes] = useState(['breakfast', 'lunch', 'snacks', 'dinner']); // Default meal types
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [updatingWeight, setUpdatingWeight] = useState(false);
  const [weeklyMacroData, setWeeklyMacroData] = useState([0, 0, 0, 0, 0, 0, 0]); // Total macros for each day

  // Get user data and BMI calculation from context
  const { getBMIInfo, userData, filterMealsByAllergies, updateWeight } = useUserData();
  const { bmi: currentBMI, color: bmiColor } = getBMIInfo();

  // Handle navigation from calendar with selected date
  useEffect(() => {
    if (params.dayOfWeek !== undefined) {
      const dayOfWeek = parseInt(params.dayOfWeek);
      // Map dayOfWeek (0=Sunday, 1=Monday, etc.) to selectedDayIndex
      // Assuming userSelectedDays follows MON, TUE, WED, THU, FRI, SAT, SUN pattern
      const dayMapping = {
        0: 6, // Sunday -> index 6
        1: 0, // Monday -> index 0
        2: 1, // Tuesday -> index 1
        3: 2, // Wednesday -> index 2
        4: 3, // Thursday -> index 3
        5: 4, // Friday -> index 4
        6: 5, // Saturday -> index 5
      };
      
      const mappedIndex = dayMapping[dayOfWeek];
      if (mappedIndex !== undefined) {
       
        setSelectedDayIndex(mappedIndex);
        // fetchMeals will be triggered by the selectedDayIndex change in the other useEffect
      }
    }
  }, [params.dayOfWeek, params.selectedDate]);

  // Calculate total macros from all scheduled meals for the selected day
  const calculateTotalMacros = () => {
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0
    };
    
    // Sum macros from all meal categories
    Object.values(meals).forEach(mealCategory => {
      if (Array.isArray(mealCategory)) {
        mealCategory.forEach(meal => {
        
          totals.calories += parseInt(meal.calories) || 0;
          totals.protein += parseFloat(meal.protein) || 0;
          totals.carbs += parseFloat(meal.carbs) || 0;
          totals.fats += parseFloat(meal.fats) || 0;
          totals.fiber += parseFloat(meal.fiber) || 0;
        });
      }
    });
    
    return totals;
  };

  const macroTotals = calculateTotalMacros();
  const totalCalories = macroTotals.calories;

  const tasteCategories = [
    "🥑 Keto",
    "💪 High Protein",
    "🍽 Balanced",
    "🥗 Low Carb",
    "🍃 Vegan",
    "🍞 Gluten-Free",
  ];

  const allWeekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const [userSelectedDays, setUserSelectedDays] = useState(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]); // Default to all days
  const mealTabs = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  // Fallback images for meals
  const fallbackImages = [
    require('../assets/burger.jpg'),
    require('../assets/caesar.jpg'),
    require('../assets/fish.png'),
    require('../assets/women-eating-food.jpg'),
  ];

  const router = useRouter();

  useEffect(() => {
    
    if (userData?.isRegistered) {
      fetchMeals();
    } else {
    }
  }, [userData?.userId, userData?.allergies, userData?.plan, userData?.isRegistered, selectedDayIndex]); // Refetch when user data or selected day changes

  const handleUpdateWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert('Invalid Input', 'Please enter a valid weight number');
      return;
    }

    const weightValue = parseFloat(newWeight);
    if (weightValue <= 0 || weightValue > 500) {
      Alert.alert('Invalid Weight', 'Please enter a weight between 0 and 500 kg');
      return;
    }

    try {
      setUpdatingWeight(true);
      const userId = userData?.userId || userData?.id;

      if (!userId) {
        throw new Error('User not found');
      }

      // Update weight in database
      const response = await ApiService.updateUser(userId, {
        weight: weightValue.toString()
      });

      if (response.success) {
        // Update local context
        updateWeight(weightValue, userData?.weightUnit || 'kg');
        
        Alert.alert('Success', 'Weight updated successfully!');
        setShowWeightModal(false);
        setNewWeight('');
      } else {
        throw new Error(response.message || 'Failed to update weight');
      }
    } catch (error) {
      console.error('Error updating weight:', error);
      Alert.alert('Error', error.message || 'Failed to update weight. Please try again.');
    } finally {
      setUpdatingWeight(false);
    }
  };

  const fetchMeals = async () => {
    try {
      setMealsLoading(true);
      setMealsError(null);

     

      const userId = userData?.userId || userData?.id;
      
      if (!userId) {
        console.error('No user ID found in userData');
        throw new Error('User not logged in');
      }
      
      // Ensure userId is a valid integer
      const numericUserId = parseInt(userId);
      if (isNaN(numericUserId)) {
        console.error('Invalid user ID:', userId, 'Type:', typeof userId);
        throw new Error(`Invalid user ID: ${userId}`);
      }
      
      
      // First, try to get existing meal schedule
      let result;
      try {
        result = await ApiService.getMealSchedule(numericUserId);
      } catch (scheduleError) {
        // Generate new meal schedule
        result = await ApiService.generateMealSchedule(numericUserId, 4);
      }

      if (!result.success) {
        // Try the test endpoint as fallback
        try {
          const testResult = await fetch('https://habibi-fitness-server.onrender.com/api/schedule/test');
          const testData = await testResult.json();
          if (testData.success) {
            
            // Create a mock schedule from test data
            const mockSchedule = {
              weeks: [{
                days: {
                  monday: { lunch: { id: 1, name: 'Test Lunch', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal' } },
                  tuesday: { lunch: { id: 2, name: 'Test Lunch 2', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal 2' } },
                  wednesday: { lunch: { id: 3, name: 'Test Lunch 3', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal 3' } },
                  thursday: { lunch: { id: 4, name: 'Test Lunch 4', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal 4' } },
                  friday: { lunch: { id: 5, name: 'Test Lunch 5', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal 5' } },
                  saturday: { lunch: { id: 6, name: 'Test Lunch 6', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal 6' } },
                  sunday: { lunch: { id: 7, name: 'Test Lunch 7', category: 'lunch', rating: 4, calories: 500, protein: 30, description: 'Test meal 7' } }
                }
              }]
            };
            result = { success: true, data: mockSchedule };
          }
        } catch (testError) {
          
        }
      }

      if (!result.success) {
        
        throw new Error(result.message || 'Failed to fetch meal schedule');
      }

      const schedule = result.data;
      

      // Get current week's meals (default to week 1 for now)
      const currentWeek = schedule.weeks[0]; // Week 1
      
      
      if (!currentWeek) {
        
        throw new Error('No meals found in schedule');
      }

      // Transform scheduled meals for display
      const transformScheduledMeals = (dayMeals) => {
        const allMeals = [];
        Object.values(dayMeals).forEach(meal => {
          if (meal) {
            allMeals.push(meal);
          }
        });
        return allMeals;
      };

      // Get meals for each category from the current week (unique meals only)
      const getMealsByCategory = (category) => {
        const categoryMeals = [];
        const seenMealIds = new Set();
        
        Object.values(currentWeek.days).forEach(day => {
          Object.keys(day).forEach(key => {
            if ((key === category || key.startsWith(`${category}_`)) && 
                day[key] && 
                !seenMealIds.has(day[key].id)) {
              categoryMeals.push(day[key]);
              seenMealIds.add(day[key].id);
            }
          });
        });
        return categoryMeals;
      };

      // Get meals for a specific day and category
      const getMealsForDay = (dayIndex, category) => {
        const dayKey = Object.keys(currentWeek.days)[dayIndex];
        const day = currentWeek.days[dayKey];
        if (!day) return [];
        
        // Look for meals with the category prefix (handles both old and new format)
        const categoryMeals = [];
        Object.keys(day).forEach(key => {
          if (key === category || key.startsWith(`${category}_`)) {
            categoryMeals.push(day[key]);
          }
        });
        
        return categoryMeals;
      };

      // Get all meals for a specific day (all categories)
      const getAllMealsForDay = (dayIndex) => {
        const categories = ['breakfast', 'lunch', 'snacks', 'dinner'];
        const dayMeals = [];
        
        categories.forEach(category => {
          const categoryMeals = getMealsForDay(dayIndex, category);
          dayMeals.push(...categoryMeals);
        });
        
        return dayMeals;
      };

      // Transform meals data for each category
      const transformMealsCategory = (categoryMeals) => {
        return categoryMeals.map((meal, index) => ({
          id: meal.id,
          title: meal.name || 'Delicious Meal',
          subtitle: meal.description || `Calories: ${meal.calories || 'N/A'} | Protein: ${meal.protein || 'N/A'}g | Rating: ${meal.rating || 'N/A'}⭐`,
          source: meal.image_url ? { uri: meal.image_url } : fallbackImages[index % fallbackImages.length],
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fat || meal.fats, // Use 'fat' (singular) from database, fallback to 'fats'
          fiber: meal.fiber, // Add fiber field
          category: meal.category,
          rating: meal.rating,
          price: meal.price,
        }));
      };

      // Get user's selected meal count
      const userMealCount = userData?.mealcount || 3;
      

      // Get user's selected meal types
      const selectedMealTypes = userData?.mealtypes || ['lunch', 'dinner'];
      setUserMealTypes(selectedMealTypes);
      
      
      // Get user's selected days
      const selectedDays = userData?.selecteddays || ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
      setUserSelectedDays(selectedDays);
      
      
      // Set activeMeal to the first available meal type
      if (selectedMealTypes.length > 0) {
        const firstMealType = selectedMealTypes[0];
        const capitalizedMealType = firstMealType.charAt(0).toUpperCase() + firstMealType.slice(1);
        setActiveMeal(capitalizedMealType);
        
      }

      // Get meals for each category from the selected day (limited to 1 unique meal per category per day)
      const getMealsForDayAndCategory = (category) => {
        // Only get meals for categories the user selected
        if (!selectedMealTypes.includes(category)) {
          return [];
        }
        
        // Map selected day index to the correct day in the schedule
        const selectedDay = userSelectedDays[selectedDayIndex];
        
        // Convert day abbreviation (MON, TUE) to full day name (monday, tuesday)
        const dayMapping = {
          'MON': 'monday',
          'TUE': 'tuesday',
          'WED': 'wednesday',
          'THU': 'thursday',
          'FRI': 'friday',
          'SAT': 'saturday',
          'SUN': 'sunday'
        };
        
        const dayKey = dayMapping[selectedDay] || selectedDay.toLowerCase();
        
        
        const day = currentWeek.days[dayKey];
        if (!day) {
         
          return [];
        }
        
        // Look for meals with the category prefix (handles both old and new format)
        const categoryMeals = [];
        Object.keys(day).forEach(key => {
          if (key === category || key.startsWith(`${category}_`)) {
            categoryMeals.push(day[key]);
          }
        });
        
       
        
        if (categoryMeals.length === 0) {
          console.log(`❌ NO MEALS for ${category} on ${dayKey}`);
         
        }
        
        // Return only the first unique meal (limit to 1 meal per category per day)
        return categoryMeals.slice(0, 1);
      };

      // Debug: Log the current week structure
     
      
      const selectedDay = currentWeek.days[Object.keys(currentWeek.days)[selectedDayIndex]];
     

      // Debug: Test each category
      ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(category => {
        const meals = getMealsForDayAndCategory(category);
       
      });

      // Set categorized meals from schedule for the selected day
      const mealsData = {
        breakfast: transformMealsCategory(getMealsForDayAndCategory('breakfast')),
        lunch: transformMealsCategory(getMealsForDayAndCategory('lunch')),
        snacks: transformMealsCategory(getMealsForDayAndCategory('snacks')),
        dinner: transformMealsCategory(getMealsForDayAndCategory('dinner')),
      };

     

      // Check if we have any meals at all
      const totalMeals = Object.values(mealsData).flat().length;
      if (totalMeals === 0) {
       
      }

      setMeals(mealsData);

      // Calculate weekly macro totals for the chart
      const calculateWeeklyMacros = () => {
        const weeklyTotals = [];
        const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        dayKeys.forEach(dayKey => {
          const dayData = currentWeek.days[dayKey];
          let dayTotal = 0;
          
          if (dayData) {
            // Sum all macros (calories + protein + carbs + fats + fiber) for this day
            Object.keys(dayData).forEach(mealKey => {
              const meal = dayData[mealKey];
              if (meal) {
                dayTotal += parseInt(meal.calories) || 0;
                dayTotal += parseFloat(meal.protein) || 0;
                dayTotal += parseFloat(meal.carbs) || 0;
                dayTotal += parseFloat(meal.fat) || 0;
                dayTotal += parseFloat(meal.fiber) || 0;
              }
            });
          }
          
          weeklyTotals.push(dayTotal);
        });
        
       
        return weeklyTotals;
      };
      
      const weeklyData = calculateWeeklyMacros();
      setWeeklyMacroData(weeklyData);

     

    } catch (error) {
      console.error('Error fetching scheduled meals:', error);
      setMealsError(error.message);
    } finally {
      setMealsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarBubble}>
                <Text style={styles.avatarEmoji}>👋</Text>
              </View>
              <Text style={styles.welcome}>
                Hello <Text style={styles.welcomeName}>{userData?.name || 'User'}</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.menuButton} onPress={() => {
              
              setIsSideMenuVisible(true);
            }}>
              <Ionicons name="menu" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Food Log Focus Card */}
          <View style={styles.foodLogCard}>
            <Text style={styles.foodLogTitle}>Macros Log</Text>
            
            {/* Circular Progress with Calories */}
            <View style={styles.circularProgressContainer}>
              {/* Target Range Labels */}
              <View style={styles.targetRangeContainer}>
                <View style={styles.targetBox}>
                  <Text style={styles.targetValue}>{userData?.tdee ? Math.round(userData.tdee * 0.9) : 1431}</Text>
                  <Text style={styles.targetLabel}>Target Min</Text>
                </View>
                
                {/* Center Circle - Green ring only */}
                <View style={styles.centerCircle}>
                  <View style={styles.circleProgressGreen} />
                  <View style={styles.circleContent}>
                    <Text style={styles.caloriesNumber}>{totalCalories || 0}</Text>
                    <Text style={styles.caloriesLabel}>Calories Today</Text>
                  </View>
                </View>
                
                <View style={styles.targetBox}>
                  <Text style={styles.targetValue}>{userData?.tdee ? Math.round(userData.tdee * 1.1) : 2706}</Text>
                  <Text style={styles.targetLabel}>Target Max</Text>
                </View>
              </View>
            </View>

            {/* Macros Row - Simple values only */}
            <View style={styles.macrosRow}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValueSimple}>{Math.round(macroTotals.protein)}g</Text>
              </View>
              
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValueSimple}>{Math.round(macroTotals.fats)}g</Text>
              </View>
              
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <Text style={styles.macroValueSimple}>{Math.round(macroTotals.carbs)}g</Text>
              </View>
            </View>

            {/* Single Tab Display */}
            <View style={styles.singleTabContainer}>
              <View style={styles.singleTab}>
                <Text style={styles.singleTabText}>Total Macros Today</Text>
              </View>
            </View>
          </View>

          {/* Insights & Analytics */}
          <Text style={styles.insightsTitle}>Insights & Analytics</Text>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <View>
                  <Text style={styles.analyticsCardTitle}>Weight Trend</Text>
                  <Text style={styles.analyticsDateRange}>Sep 30 - Now</Text>
                </View>
              </View>
              <View style={styles.barChartContainer}>
                {[1, 0, 0, 1, 0, 1, 0].map((isGreen, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.bar,
                      { 
                        backgroundColor: isGreen ? '#07da63' : '#E8E8E8',
                        height: `${40 + Math.random() * 60}%`
                      }
                    ]} 
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <View>
                  <Text style={styles.analyticsCardTitle}>BMI Status</Text>
                  <Text style={styles.analyticsDateRange}>Current</Text>
                </View>
              </View>
              <View style={styles.bmiContent}>
                <Text style={[styles.bmiBigNumber, { color: bmiColor }]}>{currentBMI}</Text>
                <Text style={styles.bmiLabel}>Body Mass Index</Text>
                <TouchableOpacity 
                  style={styles.bmiViewButton}
                  onPress={() => router.push('/bmi?fromHome=true')}
                >
                  <Text style={styles.bmiViewButtonText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={16} color="#07da63" />
                </TouchableOpacity>
              </View>
            </View>
          </View>


          {/* Select a Day */}
         
          {/* Plan Your Meals */}
          <Text style={styles.sectionTitle}>Plan Your Meals</Text>
          <View style={styles.pillsRow}>
            {mealTabs
              .filter(meal => userMealTypes.includes(meal.toLowerCase()))
              .map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.mealPill, activeMeal === m && styles.mealPillActive]}
                  onPress={() => setActiveMeal(m)}
                >
                  <Text style={[styles.mealPillText, activeMeal === m && styles.mealPillTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Day selection */}
          <View style={styles.daySelectionRow}>
            <Text style={styles.daySelectionTitle}>Select Day:</Text>
            <View style={styles.dayPillsContainer}>
              {userSelectedDays.map((day, index) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayPill, selectedDayIndex === index && styles.dayPillActive]}
                  onPress={() => {
                    setSelectedDayIndex(index);
                    // Refresh meals for the new day
                    fetchMeals();
                  }}
                >
                  <Text style={[styles.dayPillText, selectedDayIndex === index && styles.dayPillTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Meal cards grid */}
          <View style={styles.mealsGrid}>
            {mealsLoading ? (
              <View style={styles.mealsLoadingContainer}>
                <ActivityIndicator size="large" color="#07da63" />
                <Text style={styles.mealsLoadingText}>Loading Meal Recommendations...</Text>
              </View>
            ) : mealsError ? (
              <View style={styles.mealsErrorContainer}>
                <Text style={styles.mealsErrorText}>Error: {mealsError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchMeals}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Display meals based on selected day and active meal category
              (() => {
               
                
                const currentMeals = meals[activeMeal.toLowerCase()] || [];
                
                if (currentMeals.length === 0) {
                  return (
                    <View style={styles.mealsErrorContainer}>
                      <Text style={styles.mealsErrorText}>No meals found for {activeMeal}</Text>
                      <Text style={styles.mealsErrorText}>Total meals: {Object.values(meals).flat().length}</Text>
                    </View>
                  );
                }
                
                return currentMeals.map((item, idx) => {
                  return (
                <View key={`${item.id || 'meal'}-${idx}`} style={styles.mealCardShadow}>
                  <TouchableOpacity>
                    <ImageBackground source={item.source} style={styles.mealCard} imageStyle={styles.mealImage}>
                      <TouchableOpacity style={styles.heartBadge}>
                        <Ionicons name="heart" size={14} color="#fff" />
                      </TouchableOpacity>

                      <View style={styles.mealLabel}>
                        <Text style={styles.mealTitle}>{item.title}</Text>
                        <Text style={styles.mealDescription} numberOfLines={2}>
                          {item.subtitle || 'A delicious and nutritious meal'}
                        </Text>
                        <Text style={styles.mealSubtitle} numberOfLines={1}>
                          {[
                            item.calories ? `${item.calories} kcal` : null,
                            item.protein ? `${item.protein}g Protein` : null,
                            item.carbs ? `${item.carbs}g Carbs` : null,
                            (item.fats || item.fat) ? `${item.fats || item.fat}g Fats` : null,
                          ].filter(Boolean).join(' • ') || 'Nutritional info not available'}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
                  );
                });
              })()
            )}
          </View>

          {/* Weight Tracker */}
          <View style={styles.trackerCard}>
            <Text style={styles.trackerTitle}>Weight Tracker</Text>
            <View style={styles.trackerRow}>
              <View style={styles.trackerBox}>
                <View style={styles.trackerBoxHeader}>
                  <Text style={styles.trackerLabel}>Current{"\n"}Weight</Text>
                  <View style={styles.iconBadge}><Ionicons name="cube" size={14} color="#07da63" /></View>
                </View>
                <View style={styles.trackerValueRow}>
                  <Text style={styles.trackerValue}>{userData?.weight || '0'}</Text>
                  <Text style={styles.trackerUnit}>{userData?.weightUnit || 'Kgs'}</Text>
                </View>
              </View>
              <View style={styles.trackerBox}>
                <View style={styles.trackerBoxHeader}>
                  <Text style={styles.trackerLabel}>BMI</Text>
                  <View style={styles.iconBadge}><Ionicons name="fitness" size={14} color="#07da63" /></View>
                </View>
                <View style={styles.trackerValueRow}>
                  <Text style={[styles.trackerValue, { color: bmiColor }]}>{currentBMI}</Text>
                  <Text style={styles.trackerUnit}>Index</Text>
                </View>
              </View>
            </View>

            <Text style={styles.trackerUpdated}>
              Last Updated: {new Date().toLocaleDateString()}
            </Text>

            <TouchableOpacity 
              style={styles.updateBtn}
              onPress={() => {
                setNewWeight(userData?.weight?.toString() || '');
                setShowWeightModal(true);
              }}
            >
              <Text style={styles.updateBtnText}>UPDATE WEIGHT</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
      
      {/* Side Menu */}
      <SideMenu 
        isVisible={isSideMenuVisible} 
        onClose={() => setIsSideMenuVisible(false)}
        userName={userData?.name || 'User'}
      />

      {/* Weight Update Modal */}
      <Modal
        visible={showWeightModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWeightModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowWeightModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Weight</Text>
              <TouchableOpacity onPress={() => setShowWeightModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Enter your current weight (kg)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 70.5"
              placeholderTextColor="#999"
              value={newWeight}
              onChangeText={setNewWeight}
              keyboardType="decimal-pad"
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowWeightModal(false)}
                disabled={updatingWeight}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalUpdateButton, updatingWeight && styles.modalButtonDisabled]}
                onPress={handleUpdateWeight}
                disabled={updatingWeight}
              >
                {updatingWeight ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalUpdateText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 56 },
  innerContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f0f7f1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 18 },
  welcome: { fontSize: 22, fontWeight: "700", color: "#000" },
  welcomeName: { color: "#07da63" },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#07da63",
    alignItems: "center",
    justifyContent: "center",
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    backgroundColor: "#fff",
    marginBottom: 18,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  divider: {
    height: 1,
    backgroundColor: "#e6e6e6",
    marginVertical: 16,
  },

  // Food Log Focus Card
  foodLogCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#04bf55',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 60,
    elevation: 20,
  },
  foodLogTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center'
  },
  circularProgressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  targetRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  targetBox: {
    alignItems: 'center',
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 11,
    color: '#999',
  },
  centerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleProgressGreen: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: '#07da63',
  },
  circleContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  caloriesNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  macroValueSimple: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  singleTabContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  singleTab: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  singleTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // Insights & Analytics
  insightsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsHeader: {
    marginBottom: 12,
  },
  analyticsCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  analyticsDateRange: {
    fontSize: 11,
    color: '#999',
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    marginTop: 12,
    gap: 6,
  },
  bar: {
    flex: 1,
    borderRadius: 4,
    minHeight: 20,
  },
  bmiContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  bmiBigNumber: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  bmiLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
  },
  bmiViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bmiViewButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#07da63',
  },

  kcalAndMacrosRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  kcalRingWrap: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  kcalRingBase: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 10,
    borderColor: "#e9f7ee",
  },
  kcalLabel: { color: "#9AA0A6", fontSize: 12, marginBottom: 2 },
  kcalValue: { fontSize: 28, fontWeight: "800", color: "#0a0a0a" },
  kcalProgress: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 12,
    borderColor: "#07da63",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "30deg" }],
  },

  macrosContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  macroSmall: { width: "48%", alignItems: "center", marginBottom: 8 },
  macroSmallRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  macroSmallTop: { fontSize: 12, color: "#9AA0A6", marginBottom: 2 },
  macroSmallValue: { fontSize: 14, fontWeight: "700", color: "#000" },

  // Chart area
  chartSection: { 
    marginTop: 8,
    backgroundColor: '#F8FFF9',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  chartHeaderDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  dayHeader: { 
    fontSize: 12, 
    color: '#07da63',
    fontWeight: '700',
  },
  chartWrap: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  // Month selector
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginVertical: 12,
  },
  monthText: { fontWeight: "600", color: "#333" },

  // Section titles and pills
  sectionTitle: { marginTop: 4, marginBottom: 8, color: "#222", fontWeight: "600" },
  pillsRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  dayPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  dayPillActive: { backgroundColor: "#e5f8ed", borderWidth: 1, borderColor: "#07da63" },
  dayPillText: { fontSize: 12, color: "#9AA0A6" },
  dayPillTextActive: { color: "#000" },

  mealPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  mealPillActive: { backgroundColor: "#07da63" },
  mealPillText: { color: "#7a7a7a", fontSize: 12 },
  mealPillTextActive: { color: "#fff" },

  // Taste categories
  tasteScroll: { marginTop: 6, maxHeight: 50 },
  tasteScrollContainer: { flexDirection: "row", gap: 8, paddingRight: 12 },
  tasteButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#d3d3d3",
  },
  buttonText: { color: "#929394", fontSize: 15, textAlign: "center" },
  goal: { color: "#07da63" },

  // Meal grid
  mealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  mealCardShadow: {
    width: '100%',
    marginBottom: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  mealCard: {
    height: 280,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  mealImage: { borderRadius: 14 },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealLabel: {
    backgroundColor: 'rgba(7,218,99,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mealTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  mealDescription: { color: '#f0fff0', fontSize: 13, marginTop: 4, lineHeight: 18 },
  mealSubtitle: { color: '#e8ffe5', fontSize: 12, marginTop: 4 },

  // Weight tracker
  trackerCard: {
    backgroundColor: '#f7fbf9',
    padding: 16,
    borderRadius: 20,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  trackerTitle: { color: '#222', fontWeight: '600', marginBottom: 10 },
  trackerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  trackerBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  trackerBoxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackerLabel: { color: '#9AA0A6', fontSize: 12, lineHeight: 16 },
  iconBadge: { backgroundColor: '#e9f8f0', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  trackerValueRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  trackerValue: { fontSize: 26, fontWeight: '800', color: '#000' },
  trackerUnit: { color: '#b0b0b0', marginLeft: 6, marginBottom: 4 },
  trackerUpdated: { color: '#333', fontSize: 12, marginBottom: 10 },
  updateBtn: { backgroundColor: '#07da63', paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  updateBtnText: { color: '#fff', fontWeight: '700' }, 

  // Meals loading and error states
  mealsLoadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  mealsLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  mealsErrorContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  mealsErrorText: {
    fontSize: 16,
    color: '#e96250',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#07da63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Day selection styles
  daySelectionRow: {
    marginBottom: 20,
  },
  daySelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dayPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dayPillActive: {
    backgroundColor: '#07da63',
    borderColor: '#07da63',
  },
  dayPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  dayPillTextActive: {
    color: '#fff',
  },

  // Weight Update Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalUpdateButton: {
    flex: 1,
    backgroundColor: '#07da63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalUpdateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalButtonDisabled: {
    backgroundColor: '#c9f2d7',
  },
});
