import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/utils/apiclient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
interface Product {
  itemno: number;
  name: string;
  price: number;
  image: string;
  instock: string;
}
interface apiresponse{
  data:Product[]
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);  

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiClient.get<apiresponse>('/getitems');
        setFeaturedProducts(response.data.data.filter((product)=>product.instock===" true"));
      } catch (error) {
        setError("Failed to fetch featured products.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  
    return (
      <div className="min-h-screen flex flex-col">
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-primary-foreground py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Sweet Delights Bakery</h1>
              <p className="text-xl mb-8">Indulge in our freshly baked goods, made with love every day</p>
              <Button asChild size="lg">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          </section>
  
          {/* Featured Products Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedProduct(product)}>View Details</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{selectedProduct?.name}</DialogTitle>
                            <DialogDescription>
                              <img
                                src={`http://localhost:3000/${selectedProduct?.image}`|| "/placeholder.svg"}
                                alt={selectedProduct?.name}
                                className="w-full h-48 object-cover rounded-md mb-4"
                              />
                              <p>{selectedProduct?.name}</p>
                              <p className="mt-2 font-bold">${selectedProduct?.price.toFixed(2)}</p>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end">
                            <Button>Add to Cart</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
  
          {/* About Us Section */}
          <section className="py-16 bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">About Sweet Delights</h2>
                <p className="text-lg mb-8">
                  At Sweet Delights, we're passionate about creating delicious, handcrafted baked goods using only the
                  finest ingredients. Our skilled bakers combine traditional techniques with innovative flavors to bring
                  you a unique culinary experience.
                </p>
                <Button asChild variant="outline">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </section>
  
          {/* Testimonial Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <p className="italic mb-4">"The best croissants I've ever tasted! Perfectly flaky and buttery."</p>
                    <p className="font-semibold">- Sarah J.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="italic mb-4">
                      "Their sourdough bread is out of this world. I'm a regular customer now!"
                    </p>
                    <p className="font-semibold">- Mike T.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="italic mb-4">
                      "The cinnamon rolls are heavenly. A perfect treat for weekend mornings."
                    </p>
                    <p className="font-semibold">- Emily R.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
  
          {/* Call to Action Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Treat Yourself?</h2>
              <p className="text-xl mb-8">Explore our full range of delicious baked goods and place your order today!</p>
              <Button asChild size="lg" variant="secondary">
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </section>
        </main>
        <footer className="bg-secondary py-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2023 Sweet Delights Bakery. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }
  
  

export default Home;
