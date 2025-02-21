import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

//  Define API URL for FastAPI Backend
const API_URL = "http://127.0.0.1:8000"; // Change if running on Android Emulator

//  Define navigation types
type RootStackParamList = {
  FoodMenu: undefined;
  OrderReview: { cartItems: CartItem[] };
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'FoodMenu'>;

//  Define food item type
type FoodItem = {
  id: string;
  name: string;
  price: number;
  image: any;
};

//  Define cart item type (includes quantity)
type CartItem = FoodItem & { quantity: number };

const foodItems: FoodItem[] = [
  { id: '1', name: 'Chocolate Cake', price: 150, image: require('../assets/cake.jpg') },
  { id: '2', name: 'Caesar Salad', price: 120, image: require('../assets/salad.jpg') },
  { id: '3', name: 'Butter Naan', price: 50, image: require('../assets/naan.jpg') },
  { id: '4', name: 'Paneer Masala', price: 200, image: require('../assets/paneer.jpg') },
];

const FoodMenuScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const [cart, setCart] = useState<CartItem[]>([]);

  //  Function to add item or increase quantity
  const addToCart = (item: FoodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  //  Function to decrease quantity or remove item
  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
      }
      return prevCart.filter((cartItem) => cartItem.id !== id);
    });
  };

  //  Function to get item quantity
  const getItemQuantity = (id: string) => {
    const item = cart.find((cartItem) => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  //  Function to send selected items to FastAPI and navigate to Order Review
  const sendToBackend = async () => {
    const selectedItems = cart.filter((item) => item.quantity > 0);
  
    if (selectedItems.length === 0) {
      Alert.alert("No items selected", "Please add at least one item.");
      return;
    }
  
    try {
      console.log(" Sending Data to FastAPI:", JSON.stringify({ selectedItems }));
  
      const response = await fetch("http://127.0.0.1:8000/log_selected_items/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedItems }),
      });
  
      const result = await response.json();
      console.log(" Response from FastAPI:", result);
  
      if (!response.ok) {
        throw new Error("Failed to send data");
      }
  
      Alert.alert("Items Sent", "Check FastAPI terminal for added items!");
      navigation.navigate("OrderReview", { cartItems: selectedItems } as never);
    } catch (error) {
      console.error(" Error sending data to FastAPI:", error);
      Alert.alert("Error", "Failed to send items to backend.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Menu</Text>

      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.foodImage} />
            <View style={styles.details}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodPrice}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.button} onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.buttonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{getItemQuantity(item.id)}</Text>
                <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {cart.length > 0 && (
        <TouchableOpacity style={styles.reviewButton} onPress={sendToBackend}>
          <Text style={styles.buttonText}>Review Order ({cart.length} items)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

//  Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  card: { flexDirection: 'row', backgroundColor: '#f8f8f8', borderRadius: 10, padding: 10, marginVertical: 10, alignItems: 'center' },
  foodImage: { width: 100, height: 100, borderRadius: 10 },
  details: { flex: 1, marginLeft: 15 },
  foodName: { fontSize: 18, fontWeight: 'bold' },
  foodPrice: { fontSize: 16, color: 'green', marginBottom: 5 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  button: { backgroundColor: '#000', padding: 10, borderRadius: 5, marginHorizontal: 5 },
  buttonText: { color: '#fff', fontSize: 18 },
  quantity: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 10 },
  reviewButton: { backgroundColor: '#ff6600', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 20 },
});

export default FoodMenuScreen;
