import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// Define API URL
const API_URL = "http://127.0.0.1:8000";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const offers = [
  { id: '1', name: '10% Off on Total', type: 'percentage', value: 10 },
  { id: '2', name: 'Flat ₹50 Off on Orders Above ₹500', type: 'flat', value: 50, minAmount: 500 },
  { id: '3', name: 'Buy 2 Get 1 Free (Desserts)', type: 'bogo', category: 'Dessert' },
];

type RouteParams = { selectedItems: CartItem[] };

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItems } = route.params as RouteParams;

  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const originalTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const applyDiscount = () => {
    if (!selectedOffer) return originalTotal;

    const offer = offers.find((o) => o.id === selectedOffer);
    if (!offer) return originalTotal;

    if (offer.type === 'percentage') {
      return originalTotal - (originalTotal * (offer.value ?? 0)) / 100;
    }

    if (offer.type === 'flat') {
      return originalTotal >= (offer.minAmount ?? 0) ? originalTotal - (offer.value ?? 0) : originalTotal;
    }

    if (offer.type === 'bogo') {
      let discount = 0;
      selectedItems.forEach((item) => {
        if (item.name.toLowerCase().includes('dessert') && item.quantity >= 2) {
          discount += item.price;
        }
      });
      return originalTotal - discount;
    }

    return originalTotal;
  };

  const finalTotal = applyDiscount();

  // ✅ Function to send payment details to FastAPI
  const handlePayment = async () => {
    setIsProcessing(true);

    const paymentData = {
      selectedItems,
      totalAmount: originalTotal,
      discountApplied: selectedOffer ? offers.find(o => o.id === selectedOffer)?.name : null,
      finalAmount: finalTotal,
    };

    try {
      const response = await fetch(`${API_URL}/process_payment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Payment Successful", `You paid ₹${finalTotal.toFixed(2)}`);
        navigation.navigate('FoodMenu' as never);
      } else {
        Alert.alert("Payment Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to payment server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Summary</Text>

      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.name} x {item.quantity} - ₹{item.price * item.quantity}
            </Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total: ₹{originalTotal}</Text>

      <View style={styles.offerContainer}>
        <Text style={styles.offerTitle}>Apply Offer:</Text>
        <Picker selectedValue={selectedOffer} onValueChange={setSelectedOffer} style={styles.picker}>
          <Picker.Item label="Select an Offer" value={null} />
          {offers.map((offer) => (
            <Picker.Item key={offer.id} label={offer.name} value={offer.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.finalTotal}>Final Total: ₹{finalTotal.toFixed(2)}</Text>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={isProcessing}>
        <Text style={styles.buttonText}>{isProcessing ? "Processing..." : "Confirm & Pay"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  itemText: { fontSize: 18 },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginVertical: 15 },
  offerContainer: { marginVertical: 10 },
  offerTitle: { fontSize: 18, fontWeight: 'bold' },
  picker: { height: 50, borderColor: '#ddd', borderWidth: 1, marginVertical: 5 },
  finalTotal: { fontSize: 20, fontWeight: 'bold', color: 'green', textAlign: 'right', marginVertical: 10 },
  payButton: { backgroundColor: '#ff6600', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 15 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default PaymentScreen;
