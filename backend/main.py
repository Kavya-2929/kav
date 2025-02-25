# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow all origins for testing; in production, specify your React Native app’s domain or IP.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample menu data (this could also come from a database)
menu_data = [
    {"id": "1", "name": "Normal Thali", "price": 129, "image": "thaali1.jpg"},
    {"id": "2", "name": "Veg Thali", "price": 149, "image": "thaali2.jpg"},
    {"id": "3", "name": "Special Thali", "price": 199, "image": "thaali3.jpg"},
    {"id": "4", "name": "Special Desi Ghee Desi Thath", "price": 289, "image": "thaali4.jpg"},
]

@app.get("/menu")
def get_menu():
    return menu_data

# Define an Order model (if needed)
class OrderItem(BaseModel):
    id: str
    quantity: int

class Order(BaseModel):
    items: List[OrderItem]
    total: float

@app.post("/order")
def place_order(order: Order):
    # Here, you could save the order to a database or process it.
    return {"message": "Order placed successfully", "order": order}
