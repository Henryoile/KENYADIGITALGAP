from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
# Requests is installed but not used in this basic structure - it would be used for M-Pesa API calls

app = Flask(__name__)

# --- Database Configuration ---
# Use SQLite for development. This creates a file named 'site.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# NOTE: In a real application, you MUST set a secret key for security
# app.config['SECRET_KEY'] = 'YOUR_SECRET_KEY_HERE' 
db = SQLAlchemy(app)

# --- Database Model for Inquiries ---
class Inquiry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    type = db.Column(db.String(50), nullable=False) # donor, employer, youth, other
    message = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=db.func.now())

    def __repr__(self):
        return f"Inquiry('{self.name}', '{self.type}')"


# --- Frontend Route: Serves the Landing Page ---
@app.route('/')
def index():
    """
    Placeholder: In a Flask app, you would configure Jinja templates 
    and render the HTML here. Since we are using static files, this route 
    confirms the server is running.
    """
    return "EDUCHAIN Backend is running. Open index.html in your browser or run the Flask server to serve static content."

# --- Backend Route: Handling Form Submission ---
@app.route('/submit_inquiry', methods=['POST'])
def submit_inquiry():
    """Handles partnership/inquiry form submissions and saves them to the database."""
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Basic validation
            if not all(key in data for key in ['name', 'email', 'type']):
                return jsonify({'message': 'Missing required fields (name, email, type)'}), 400

            # Create a new Inquiry object
            new_inquiry = Inquiry(
                name=data.get('name'),
                email=data.get('email'),
                type=data.get('type'),
                message=data.get('message', '')
            )
            
            # Save to database
            db.session.add(new_inquiry)
            db.session.commit()
            
            print(f"NEW INQUIRY SAVED: {new_inquiry.name} ({new_inquiry.type})")
            
            return jsonify({'message': 'Inquiry submitted successfully'}), 200
            
        except Exception as e:
            # Rollback in case of database error
            db.session.rollback()
            print(f"DATABASE ERROR: {e}")
            return jsonify({'message': f'Server error during submission: {str(e)}'}), 500
    
    return jsonify({'message': 'Method not allowed'}), 405


# --- Backend Route: Placeholder for M-Pesa Integration ---
@app.route('/initiate_donation', methods=['POST'])
def initiate_donation():
    """Placeholder for M-Pesa STK Push logic."""
    # This route is called by the JavaScript file, but the JS currently uses an alert()
    # If the JS were modified to make an actual API call, this route would be used.
    # Logic here would involve: 1. Auth, 2. STK Push API call, 3. Handling response.
    
    return jsonify({'message': 'Donation gateway integration pending. Thank you!'}), 503


if __name__ == '__main__':
    # Initialize the database and create tables if they don't exist
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)