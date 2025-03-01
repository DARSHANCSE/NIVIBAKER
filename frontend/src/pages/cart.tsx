"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import apiClient from "@/utils/apiclient";

interface Product {
  itemno: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export interface CartItem {
  count: number;
  item: Product;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading,setloading]=useState(true)
  useEffect(() => {
    const fetchCart = async () => {

      try {
        const response = await apiClient.post("/getcart", { email: user.email });
        setCartItems(response.data.cart);
        setloading(false)
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart.");
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    setTotal(cartItems.reduce((acc, itemdet) => acc + itemdet.item.price * itemdet.count, 0));
  }, [cartItems]);

  const updateCount = async (itemno: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    try {
      await apiClient.post("/updatecart", { itemno, count: newQuantity, email: user.email });
      setCartItems((prevItems) =>
        prevItems.map((itemdet) => (itemdet.item.itemno === itemno ? { ...itemdet, count: newQuantity } : itemdet))
      );
    } catch (error) {
      console.error("Error updating count:", error);
      toast.error("Failed to update count.");
    }
  };

  const removeItem = async (itemno: number) => {
    try {
      await apiClient.post("/deletecart", { itemno, email: user.email });
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((itemdet) => itemdet.item.itemno !== itemno);
        setTotal(updatedItems.reduce((acc, itemdet) => acc + itemdet.item.price * itemdet.count, 0));
        return updatedItems;
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item.");
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.post("/clearcart", { email: user.email });
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart.");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty", { description: "Please add some items before checking out." });
      return;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((itemdet) => (
                    <TableRow key={itemdet.item.itemno}>
                      <TableCell>
                        <img
                          src={`http://localhost:3000/${itemdet.item.image}` || "/placeholder.svg"}
                          alt={itemdet.item.name}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{itemdet.item.name}</TableCell>
                      <TableCell>${itemdet.item.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => updateCount(itemdet.item.itemno, itemdet.count - 1)}>
                            -
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            value={itemdet.count}
                            onChange={(e) => updateCount(itemdet.item.itemno, Number.parseInt(e.target.value) || 0)}
                            className="w-20 text-center"
                          />
                          <Button variant="outline" size="icon" onClick={() => updateCount(itemdet.item.itemno, itemdet.count + 1)}>
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${(itemdet.item.price * itemdet.count).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={() => removeItem(itemdet.item.itemno)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 flex flex-col gap-4 items-end">
              <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
              <div className="flex gap-4">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
                <Button asChild onClick={handleCheckout}>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
