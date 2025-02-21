from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow CORS for React Native Requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change for production)
    allow_credentials=True,
    allow_methods=["*"],  #  Allow ALL methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],
)

# Define Food Item Model
class FoodItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int

class FoodSelection(BaseModel):
    selectedItems: List[FoodItem]

#  Fix: Allow OPTIONS method explicitly
@app.options("/log_selected_items/")
async def options_log_selected_items():
    return {"message": "CORS preflight successful"}

#  Handle food selection logging
@app.post("/log_selected_items/")
async def log_selected_items(food_selection: FoodSelection):
    print("\n Selected Food Items:\n")
    for item in food_selection.selectedItems:
        print(f" {item.name} (x{item.quantity}) - ₹{item.price * item.quantity}")

    return {"message": "Items logged successfully!", "items": food_selection.selectedItems}
