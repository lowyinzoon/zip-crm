import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQty, setNewQty] = useState('');
  const inventoryRef = collection(db, 'inventory');

  // Load items from Firestore
  useEffect(() => {
    const fetchInventory = async () => {
      const snapshot = await getDocs(inventoryRef);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(list);
    };

    fetchInventory();
  }, []);

  // Add new item
  const addItem = async () => {
    if (!newItem || !newQty) return;
    const docRef = await addDoc(inventoryRef, {
      name: newItem,
      quantity: parseInt(newQty),
    });
    setItems((prev) => [
      ...prev,
      { id: docRef.id, name: newItem, quantity: parseInt(newQty) },
    ]);
    setNewItem('');
    setNewQty('');
  };

  // Use 1 unit from stock
  const useItem = async (id) => {
    const item = items.find((i) => i.id === id);
    if (!item || item.quantity <= 0) return;

    const newQty = item.quantity - 1;
    const itemDoc = doc(db, 'inventory', id);
    await updateDoc(itemDoc, { quantity: newQty });

    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Inventory Management</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Item name"
          className="border p-2 rounded w-1/2"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <input
          type="number"
          placeholder="Qty"
          className="border p-2 rounded w-1/4"
          value={newQty}
          onChange={(e) => setNewQty(e.target.value)}
        />
        <button onClick={addItem} className="bg-green-600 text-white px-4 rounded">
          ➕ Add
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="bg-white shadow p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">Stock: {item.quantity}</p>
            </div>
            <button
              onClick={() => useItem(item.id)}
              disabled={item.quantity === 0}
              className={`px-4 py-1 rounded text-white ${
                item.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600'
              }`}
            >
              ➖ Use 1
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 