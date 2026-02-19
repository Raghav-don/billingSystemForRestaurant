from flask import Blueprint, request, jsonify
from models import db, MenuItem, Order, OrderItem, Bill
from datetime import datetime

api = Blueprint('api', __name__)

# --- Menu Routes ---
@api.route('/menu', methods=['GET'])
def get_menu():
    items = MenuItem.query.all()
    return jsonify([item.to_dict() for item in items])

@api.route('/menu', methods=['POST'])
def add_menu_item():
    data = request.json
    new_item = MenuItem(
        name=data['name'],
        price=data['price'],
        category=data['category']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@api.route('/menu/<int:id>', methods=['DELETE'])
def delete_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'})

@api.route('/menu/<int:id>', methods=['PUT'])
def update_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    data = request.json
    
    if 'name' in data:
        item.name = data['name']
    if 'price' in data:
        item.price = data['price']
    if 'category' in data:
        item.category = data['category']
        
    db.session.commit()
    return jsonify(item.to_dict())

# --- Order Routes ---
@api.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@api.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    new_order = Order(table_number=data['table_number'])
    db.session.add(new_order)
    db.session.commit()

    for item in data['items']:
        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=item['id'],
            quantity=item['quantity']
        )
        db.session.add(order_item)
    
    db.session.commit()
    return jsonify(new_order.to_dict()), 201

# --- Bill Routes ---
@api.route('/bills/generate/<int:order_id>', methods=['POST'])
def generate_bill(order_id):
    order = Order.query.get_or_404(order_id)
    
    if order.status == 'Paid':
        return jsonify({'message': 'Bill already generated'}), 400

    total = 0
    for item in order.items:
        total += item.menu_item.price * item.quantity
    
    tax = total * 0.05  # 5% Tax example
    grand_total = total + tax

    new_bill = Bill(
        order_id=order.id,
        total_amount=total,
        tax_amount=tax,
        grand_total=grand_total
    )
    
    order.status = 'Paid'
    db.session.add(new_bill)
    db.session.commit()
    
    return jsonify(new_bill.to_dict()), 201
