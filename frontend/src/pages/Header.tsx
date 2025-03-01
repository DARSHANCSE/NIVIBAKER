import { Link } from 'react-router-dom'
import { ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MyHeader=()=>{
    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.reload()
    }


    return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              Sweet Delights
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-4">
              <li><Link to="/" className="text-foreground hover:text-primary">Home</Link></li>
              <li><Link to="/products" className="text-foreground hover:text-primary">Products</Link></li>
              <li><Link to="/about" className="text-foreground hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="text-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            <Link to="/profile">  
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
              < Button
            className='logout-button'
            type="button"
            onClick={handleLogout}
          >
            <span>Logout</span>
          </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MyHeader