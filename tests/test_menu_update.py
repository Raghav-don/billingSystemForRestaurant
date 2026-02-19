import pytest
from app import app, db
from models import MenuItem

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

def test_update_menu_item(client):
    # Add item
    client.post('/api/menu', json={'name': 'Vada', 'price': 30.0, 'category': 'Breakfast'})
    
    # Get ID
    response = client.get('/api/menu')
    # Use the last added item just in case
    item_id = response.json[-1]['id']
    
    # Update item
    response = client.put(f'/api/menu/{item_id}', json={'price': 35.0})
    assert response.status_code == 200
    assert response.json['price'] == 35.0
    
    # Verify persistence
    get_response = client.get('/api/menu')
    updated_item = next(item for item in get_response.json if item['id'] == item_id)
    assert updated_item['price'] == 35.0
    assert updated_item['name'] == 'Vada'
