import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Checkbox } from 'react-native-paper';

// Define navigation types
type RootStackParamList = {
  FoodMenu: undefined;
  OrderReview: { cartItems: CartItem[] };
  Payment: { selectedItems: CartItem[] };
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'OrderReview'>;
type RouteParams = { cartItems: CartItem[] };

// Define cart item type
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const OrderReviewScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  const { cartItems } = route.params as RouteParams;

  // State to track selected items
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Function to toggle individual item selection
  const toggleItemSelection = (item: CartItem) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Function to toggle "Select All"
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(cartItems); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Calculate total for selected items
  const totalAmount = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Your Order</Text>

      {/* ✅ Select All Checkbox */}
      <View style={styles.selectAllContainer}>
        <Checkbox
          status={selectAll ? 'checked' : 'unchecked'}
          onPress={toggleSelectAll}
          color="black"
        />
        <Text style={styles.selectAllText}>Select All</Text>
      </View>

      {/* ✅ Food Items with Checkboxes */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Checkbox
              status={selectedItems.some((selected) => selected.id === item.id) ? 'checked' : 'unchecked'}
              onPress={() => toggleItemSelection(item)}
              color="black"
            />
            <Text style={styles.itemText}>
              {item.name} x {item.quantity} - ₹{item.price * item.quantity}
            </Text>
          </View>
        )}
      />

      {/* ✅ Show total amount only if items are selected */}
      {selectedItems.length > 0 && (
        <>
          <Text style={styles.total}>Total: ₹{totalAmount}</Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate('Payment', { selectedItems } as never)}

          >
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 18,
    marginLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 15,
  },
  payButton: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default OrderReviewScreen;
