import React, { useState } from "react";

interface FoodItem {
  food_id: number;
  food_name: string;
  food_description: string;
  food_price: number;
  food_image: string;
}

const FoodItemCard = ({
  foodItem,
  onAdd,
  onRemove,
  onSelect,
  isSelected
}: {
  foodItem: FoodItem;
  onAdd: (id: number, quantity: number) => void;
  onRemove: (id: number, quantity: number) => void;
  onSelect: (id: number, quantity: number, isSelected: boolean) => void;
  isSelected: boolean;
}) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAdd(foodItem.food_id, newQuantity);
    onSelect(foodItem.food_id, newQuantity, true);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onRemove(foodItem.food_id, newQuantity);
      onSelect(foodItem.food_id, newQuantity, newQuantity > 0);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    onSelect(foodItem.food_id, quantity, checked);
  };

  return (
    <div className="w-60 max-w-xs h-70 m-8 mx-auto rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 bg-white border border-gray-200">
      <img
        className="w-full h-32 object-cover rounded-t-lg"
        src={foodItem.food_image}
        alt={foodItem.food_name}
      />
      <div className="p-2 h-32">
        <h2 className="text-md font-semibold mb-1 text-gray-800 truncate">
          {foodItem.food_name}
        </h2>
        <p className="text-gray-600 mb-1 text-xs truncate">
          {foodItem.food_description}
        </p>
        <p className="text-md font-bold text-green-600 mb-2">
          ${foodItem.food_price}
        </p>
      </div>
      <div className="flex items-center justify-between p-1 border-t border-gray-300 -mt-10">
        <button
          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          onClick={handleRemove}
        >
          -
        </button>
        <span className="text-md font-semibold">{quantity}</span>
        <button
          className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          onClick={handleAdd}
        >
          +
        </button>
      </div>
      <div className="p-1 border-t border-gray-300 flex items-center">
        <input
          type="checkbox"
          className="mr-2 h-4 w-4"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <label className="text-xs text-gray-700">Selected Item</label>
      </div>
    </div>
  );
};

export default FoodItemCard;
