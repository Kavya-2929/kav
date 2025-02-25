import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const notifyWaitress = () => {
    alert('Waitress has been notified!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>Rs. {item.price}</Text>
                <Text style={styles.quantity}>x{item.quantity}</Text>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={notifyWaitress}>
        <Text style={styles.buttonText}>Call Waitress</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={clearCart}>
        <Text style={styles.buttonText}>End Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  emptyCart: { textAlign: 'center', marginTop: 20, fontSize: 18 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 10 },
  image: { width: 50, height: 50, borderRadius: 10 },
  info: { flex: 1, marginLeft: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#777' },
  quantity: { fontSize: 14, color: '#444' },
  removeButton: { backgroundColor: 'red', padding: 5, borderRadius: 5 },
  removeButtonText: { color: '#fff', fontSize: 14 },
  button: { backgroundColor: '#FF9800', padding: 15, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default CartScreen;
