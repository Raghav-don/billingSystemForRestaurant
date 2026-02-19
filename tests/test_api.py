import pytest
import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app import app, db
from models import MenuItem, Order, OrderItem

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.session.remove()
            db.drop_all()

def test_add_menu_item(client):
    response = client.post('/api/menu', json={
        'name': 'Idli',
        'price': 40.0,
        'category': 'Breakfast'
    })
    assert response.status_code == 201
    assert response.json['name'] == 'Idli'

def test_get_menu(client):
    client.post('/api/menu', json={'name': 'Dosa', 'price': 60.0, 'category': 'Breakfast'})
    response = client.get('/api/menu')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'Dosa'

def test_create_order(client):
    # First add a menu item
    client.post('/api/menu', json={'name': 'Idli', 'price': 40.0, 'category': 'Breakfast'})
    
    # Create order
    response = client.post('/api/orders', json={
        'table_number': 1,
        'items': [{'id': 1, 'quantity': 2}]
    })
    assert response.status_code == 201
    assert response.json['table_number'] == 1

def test_generate_bill(client):
    # Add item and order
    client.post('/api/menu', json={'name': 'Idli', 'price': 40.0, 'category': 'Breakfast'})
    client.post('/api/orders', json={
        'table_number': 1,
        'items': [{'id': 1, 'quantity': 2}] # Total 80
    })
    
    # Generate bill for order 1
    response = client.post('/api/bills/generate/1')
    assert response.status_code == 201
    # 80 + 5% tax (4) = 84
    assert response.json['total_amount'] == 80.0
    assert response.json['tax_amount'] == 4.0
    assert response.json['grand_total'] == 84.0
