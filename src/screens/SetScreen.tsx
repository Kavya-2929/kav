// src/screens/SetScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

// Data types
type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: any;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: any;
  quantity: number;
};

// Sample menu data
const menuData: MenuItem[] = [
  { id: '1', name: 'Normal Thali', price: 129, image: require('../../assets/thaali1.jpg') },
  { id: '2', name: 'Veg Thali', price: 149, image: require('../../assets/thaali2.jpg') },
  { id: '3', name: 'Special Thali', price: 199, image: require('../../assets/thaali3.jpg') },
  { id: '4', name: 'Special Desi Ghee Desi Thath', price: 289, image: require('../../assets/thaali4.jpg') },
];

export default function SetScreen() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch menu data from FastAPI on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/menu')
      .then(response => response.json())
      .then(data => {
        // You might need to map data to include local image assets.
        // For example, if your FastAPI only returns image filenames,
        // you can assign require() values based on the filename.
        const mappedData = data.map((item: any) => ({
          ...item,
          image: getLocalImage(item.image),
        }));
        setMenuData(mappedData);
      })
      .catch(error => console.error(error));
  }, []);


  // Function to map image filename to local asset
  const getLocalImage = (filename: string) => {
    switch (filename) {
      case 'thaali1.jpg':
        return require('../../assets/thaali1.jpg');
      case 'thaali2.jpg':
        return require('../../assets/thaali2.jpg');
      case 'thaali3.jpg':
        return require('../../assets/thaali3.jpg');
      case 'thaali4.jpg':
        return require('../../assets/thaali4.jpg');
      default:
        return require('../../assets/placeholder.jpg');
    }
  };

  // Function to add or remove items from the cart
  const updateCart = (itemId: string, quantityChange: number, clear?: boolean) => {
    if (clear) {
      setCart([]);
      return;
    }
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const index = newCart.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        const updatedItem = { ...newCart[index], quantity: newCart[index].quantity + quantityChange };
        if (updatedItem.quantity <= 0) {
          newCart.splice(index, 1);
        } else {
          newCart[index] = updatedItem;
        }
      } else if (quantityChange > 0) {
        const itemToAdd = menuData.find((m) => m.id === itemId);
        if (itemToAdd) newCart.push({ ...itemToAdd, quantity: 1 });
      }
      console.log('Updated Cart:', newCart);
      return newCart;
    });
  };

  // Render a menu item card
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <Image source={item.image} style={styles.menuImage} resizeMode="contain" />
      <Text style={styles.menuName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.menuPrice}>₹ {item.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => updateCart(item.id, 1)}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  // Render a cart item
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartItemImage} resizeMode="contain" />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>₹ {item.price} x {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => updateCart(item.id, -1)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      {/* LEFT SECTION: Menu Items */}
      <View style={styles.leftSection}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <FlatList
          data={menuData}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          numColumns={2}
          contentContainerStyle={styles.menuListContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* RIGHT SECTION: Cart */}
      <View style={styles.rightSection}>
        <Text style={styles.cartTitle}>Your Cart</Text>
        {cart.length === 0 ? (
          <Text style={styles.emptyCartText}>Cart is empty</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
          />
        )}
        <View style={styles.cartFooter}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>₹ {totalAmount}</Text>
        </View>
        <TouchableOpacity
          style={styles.callWaitressButton}
          onPress={() => Alert.alert('Waitress Called!')}
        >
          <Text style={styles.buttonText}>Call Waitress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.endSessionButton}
          onPress={() => updateCart('', 0, true)}
        >
          <Text style={styles.buttonText}>End Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            // When checking out, send the order data to FastAPI
            fetch('http://127.0.0.1:8000/order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
                total: totalAmount,
              }),
            })
              .then(response => response.json())
              .then(data => {
                Alert.alert('Checkout', `Order placed! Total: ₹ ${totalAmount}`);
                // Optionally clear the cart
                updateCart('', 0, true);
              })
              .catch(error => {
                console.error('Error:', error);
                Alert.alert('Checkout Error', 'There was a problem placing your order.');
              });
          }}
        >
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // side-by-side layout
    backgroundColor: '#f0f0f0',
  },
  // Left section (menu items)
  leftSection: {
    flex: 2,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuListContainer: {
    paddingBottom: 20,
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 8,
    padding: 10,
    // Elevation for Android
    elevation: 2,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  menuImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuPrice: {
    fontSize: 14,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Right section (cart)
  rightSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 8,
    borderRadius: 6,
    padding: 8,
  },
  cartItemImage: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 4,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  cartItemPrice: {
    fontSize: 13,
    color: '#555',
  },
  removeButton: {
    color: 'red',
    marginLeft: 10,
    fontWeight: '600',
  },
  cartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  callWaitressButton: {
    backgroundColor: '#ffc107',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  endSessionButton: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
