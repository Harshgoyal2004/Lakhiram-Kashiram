"use client";

import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

interface AddToCartButtonProps {
    product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (quantity > 0) {
            addToCart(product, quantity);
        }
    };

    const incrementQuantity = () => {
        if (product.stock && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        } else if (!product.stock) { // if stock is not defined, allow increment
            setQuantity(prev => prev + 1);
        }
    };
    
    const decrementQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        }
        if (product.stock && value > product.stock) {
            value = product.stock;
        }
        setQuantity(value);
    };


    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center border border-input rounded-md">
                <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10 rounded-r-none border-r">
                    <Minus className="h-4 w-4"/>
                </Button>
                <Input 
                    type="number" 
                    value={quantity} 
                    onChange={handleQuantityChange}
                    className="w-16 h-10 text-center border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    min="1"
                    max={product.stock}
                />
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10 rounded-l-none border-l" disabled={product.stock ? quantity >= product.stock : false}>
                    <Plus className="h-4 w-4"/>
                </Button>
            </div>
            <Button 
                onClick={handleAddToCart} 
                className="flex-grow bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 px-6"
                disabled={product.stock === 0}
            >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
        </div>
    );
}
