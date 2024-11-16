// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';

// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import HomeScreen from '../../src/screens/HomeScreen';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (

//     // <Tabs.Screen
//     //   name="Home"
//     //   component={HomeScreen}
//     //   options={{
//     //     headerShown: false, // Oculta o cabeçalho para esta tela
//     //   }}
//     // />
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }







// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { Ionicons } from '@expo/vector-icons';
// // import HomeScreen from '../../src/screens/HomeScreen';// Certifique-se do caminho correto para sua tela

// // // Exemplo de outras telas para as abas
// // // import OtherScreen from '../screens/OtherScreen';

// // const Tab = createBottomTabNavigator();

// // const Tabs: React.FC = () => {
// //   return (
// //     <NavigationContainer>
// //       <Tab.Navigator
// //         screenOptions={({ route }) => ({
// //           tabBarIcon: ({ color, size }) => {
// //             let iconName: string;

// //             if (route.name === 'Home') {
// //               iconName = 'home';
// //             } else if (route.name === 'Other') {
// //               iconName = 'list';
// //             }

// //             return <Ionicons name={iconName} size={size} color={color} />;
// //           },
// //           tabBarActiveTintColor: '#007bff',
// //           tabBarInactiveTintColor: 'gray',
// //         })}
// //       >
// //         {/* Aba Home */}
// //         <Tab.Screen
// //           name="Home"
// //           component={HomeScreen}
// //           options={{ headerShown: false }}
// //         />

// //         {/* Exemplo de outra aba */}
// //         {/* <Tab.Screen
// //           name="Other"
// //           component={OtherScreen}
// //           options={{ headerShown: false }}
// //         /> */}
// //       </Tab.Navigator>
// //     </NavigationContainer>
// //   );
// // };

// // export default Tabs;