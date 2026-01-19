"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend"
    return response_body, 200


users_api = Blueprint('users_api', __name__)

@users_api.route('/', methods=['GET'])
def get_all_users():
    users = Users.query.all()
    return jsonify([u.serialize() for u in users]), 200


@users_api.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Users.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200


@users_api.route('/', methods=['POST'])
def create_user():
    data = request.json

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    user = Users( email=data.get('email'),
                  password=data.get('password'),
                  photo_url=data.get('photo_url'),
                  background=data.get('background'),
                  canción_url=data.get('canción_url'),
                  alias=data.get('alias'),
                  latitude=data.get('latitude'),
                  longitude=data.get('longitude'),
                  is_active=data.get('is_active', True)
    )
    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


@users_api.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    user.email = data.get('email', user.email)
    user.password = data.get('password', user.password)
    user.photo_url = data.get('photo_url', user.photo_url)
    user.background = data.get('background', user.background)
    user.canción_url = data.get('canción_url', user.canción_url)
    user.alias = data.get('alias', user.alias)
    user.latitude = data.get('latitude', user.latitude)
    user.longitude = data.get('longitude', user.longitude)
    user.is_active = data.get('is_active', user.is_active)
    db.session.commit()

    return jsonify(user.serialize()), 200


@users_api.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200