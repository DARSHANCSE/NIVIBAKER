"use client"
import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { toast } from "sonner"
import { Toaster } from "sonner"
import axios from "axios"
import apiClient from "@/utils/apiclient"

export interface Product {
  itemno: number
  name: string
  instock:string
  price: number
  image: string
  description: string
  category: string
}




export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [products, setProducts] = useState<Product[]>([])

  const categories = ["All", "Pastries", "Muffins", "Breads"];
  const user=JSON.parse(localStorage.getItem("user") || '{}')



  useEffect(() => {
  const productsetter =async()=>{
    const response = await axios.get("http://localhost:3000/admin/getitems")
  
    setProducts(response.data.data)
  }
  productsetter();
}, [])


  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) && (product.instock===" true") &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddToCart = (product: Product) => {
    apiClient.post('/addcart', { itemno: product.itemno,email:user.email }).then((res) => {
      console.log('Adding to cart:', product,res)
      toast.success(`${product.name} has been added to your cart.`)}).catch((err) => {
      console.error('Error adding to cart:', err)
      toast.error('Failed to add to cart.')
    })
  }

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category" className="sr-only">
            Category
          </Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.itemno} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <img
                src={`http://localhost:3000/${product.image}` || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedProduct(product)}>
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{selectedProduct?.name}</DialogTitle>
                      <DialogDescription>
                        <img
                          src={`http://localhost:3000/${selectedProduct?.image}` || "/placeholder.svg"}
                          alt={selectedProduct?.name}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <p>{selectedProduct?.description}</p>
                        <p className="mt-2 font-bold">${selectedProduct?.price.toFixed(2)}</p>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                      <Button onClick={() => selectedProduct && handleAddToCart(selectedProduct)}>
                        Add to Cart
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
    
  )
}