// src/components/MenuGrid.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const menuItems = [
  {
    id: '1',
    title: 'Dal Makhani + 1 Lachha + Baby Naan',
    price: 255,
    image: require('../../assets/thaali1.jpg'),
  },
  {
    id: '2',
    title: 'Mix Veg + Noodles with Manchurian',
    price: 195,
    image: require('../../assets/thaali2.jpg'),
  },
  {
    id: '3',
    title: 'Veg thaali',
    price: 195,
    image: require('../../assets/thaali3.jpg'),
  },
  {
    id: '4',
    title: 'Non veg thaali',
    price: 195,
    image: require('../../assets/thaali4.jpg'),
  },
  // ...Add more items as needed
];

export default function MenuGrid() {
  const renderItem = ({ item }: { item: typeof menuItems[0] }) => (
    <View style={styles.itemCard}>
      <Image source={item.image} style={styles.itemImage} />
      <Text style={styles.itemTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.itemPrice}>Rs. {item.price}</Text>
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={menuItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.menuListContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  menuListContainer: {
    paddingBottom: 20,
  },
  itemCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 8,
    padding: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    // Elevation for Android
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#ff6600',
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
