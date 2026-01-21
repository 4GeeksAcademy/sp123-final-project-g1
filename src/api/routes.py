"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, People, Genre, GenrePeople, Bands, GenreBands, Instruments, InstrumentPeople

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend"
    return response_body, 200



@api.route('/users', methods=['GET'])
def get_all_users():
    users = Users.query.all()
    return jsonify([u.serialize() for u in users]), 200


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/users', methods=['POST'])
def create_user():
    data = request.json

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    user = Users(email=data.get('email'),
                password=data.get('password'),
                photo_url=data.get('photo_url'),
                background=data.get('background'),
                song_url=data.get('song_url'),
                alias=data.get('alias'),
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                is_active=data.get('is_active', True))

    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201


@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json

    user.email = data.get('email', user.email)
    user.password = data.get('password', user.password)
    user.photo_url = data.get('photo_url', user.photo_url)
    user.background = data.get('background', user.background)
    user.song_url = data.get('song_url', user.song_url)
    user.alias = data.get('alias', user.alias)
    user.latitude = data.get('latitude', user.latitude)
    user.longitude = data.get('longitude', user.longitude)
    user.is_active = data.get('is_active', user.is_active)

    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200



@api.route('/people', methods=['GET'])
def get_all_people():
    people = People.query.all()
    return jsonify([p.serialize() for p in people]), 200


@api.route('/people/<int:people_id>', methods=['GET'])
def get_person(people_id):
    person = People.query.get(people_id)
    if not person:
        return jsonify({"error": "Person not found"}), 404
    return jsonify(person.serialize()), 200


@api.route('/people', methods=['POST'])
def create_person():
    data = request.json
    person = People(**data)
    db.session.add(person)
    db.session.commit()
    return jsonify(person.serialize()), 201


@api.route('/people/<int:people_id>', methods=['PUT'])
def update_person(people_id):
    person = People.query.get(people_id)
    if not person:
        return jsonify({"error": "Person not found"}), 404

    data = request.json
    for key, value in data.items():
        setattr(person, key, value)

    db.session.commit()
    return jsonify(person.serialize()), 200


@api.route('/people/<int:people_id>', methods=['DELETE'])
def delete_person(people_id):
    person = People.query.get(people_id)
    if not person:
        return jsonify({"error": "Person not found"}), 404

    db.session.delete(person)
    db.session.commit()
    return jsonify({"message": "Person deleted"}), 200



@api.route('/genres', methods=['GET'])
def get_all_genres():
    genres = Genre.query.all()
    return jsonify([g.serialize() for g in genres]), 200


@api.route('/genres/<int:genre_id>', methods=['GET'])
def get_genre(genre_id):
    genre = Genre.query.get(genre_id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404
    return jsonify(genre.serialize()), 200


@api.route('/genres', methods=['POST'])
def create_genre():
    data = request.json
    genre = Genre(name=data.get('name'))
    db.session.add(genre)
    db.session.commit()
    return jsonify(genre.serialize()), 201


@api.route('/genres/<int:genre_id>', methods=['PUT'])
def update_genre(genre_id):
    genre = Genre.query.get(genre_id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404

    data = request.json
    genre.name = data.get('name', genre.name)
    db.session.commit()
    return jsonify(genre.serialize()), 200


@api.route('/genres/<int:genre_id>', methods=['DELETE'])
def delete_genre(genre_id):
    genre = Genre.query.get(genre_id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404

    db.session.delete(genre)
    db.session.commit()
    return jsonify({"message": "Genre deleted"}), 200



@api.route('/genre-people', methods=['GET'])
def get_all_genre_people():
    items = GenrePeople.query.all()
    return jsonify([i.serialize() for i in items]), 200


@api.route('/genre-people', methods=['POST'])
def create_genre_people():
    data = request.json
    item = GenrePeople(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(item.serialize()), 201


@api.route('/genre-people/<int:item_id>', methods=['DELETE'])
def delete_genre_people(item_id):
    item = GenrePeople.query.get(item_id)
    if not item:
        return jsonify({"error": "Relation not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Relation deleted"}), 200



@api.route('/bands', methods=['GET'])
def get_all_bands():
    bands = Bands.query.all()
    return jsonify([b.serialize() for b in bands]), 200


@api.route('/bands/<int:band_id>', methods=['GET'])
def get_band(band_id):
    band = Bands.query.get(band_id)
    if not band:
        return jsonify({"error": "Band not found"}), 404
    return jsonify(band.serialize()), 200


@api.route('/bands', methods=['POST'])
def create_band():
    data = request.json
    band = Bands(**data)
    db.session.add(band)
    db.session.commit()
    return jsonify(band.serialize()), 201


@api.route('/bands/<int:band_id>', methods=['PUT'])
def update_band(band_id):
    band = Bands.query.get(band_id)
    if not band:
        return jsonify({"error": "Band not found"}), 404

    data = request.json
    for key, value in data.items():
        setattr(band, key, value)

    db.session.commit()
    return jsonify(band.serialize()), 200


@api.route('/bands/<int:band_id>', methods=['DELETE'])
def delete_band(band_id):
    band = Bands.query.get(band_id)
    if not band:
        return jsonify({"error": "Band not found"}), 404

    db.session.delete(band)
    db.session.commit()
    return jsonify({"message": "Band deleted"}), 200



@api.route('/genre-bands', methods=['GET'])
def get_all_genre_bands():
    items = GenreBands.query.all()
    return jsonify([i.serialize() for i in items]), 200


@api.route('/genre-bands', methods=['POST'])
def create_genre_bands():
    data = request.json
    item = GenreBands(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(item.serialize()), 201


@api.route('/genre-bands/<int:item_id>', methods=['DELETE'])
def delete_genre_bands(item_id):
    item = GenreBands.query.get(item_id)
    if not item:
        return jsonify({"error": "Relation not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Relation deleted"}), 200



@api.route('/instruments', methods=['GET'])
def get_all_instruments():
    instruments = Instruments.query.all()
    return jsonify([i.serialize() for i in instruments]), 200


@api.route('/instruments', methods=['POST'])
def create_instrument():
    data = request.json
    instrument = Instruments(name=data.get('name'))
    db.session.add(instrument)
    db.session.commit()
    return jsonify(instrument.serialize()), 201


@api.route('/instruments/<int:instrument_id>', methods=['DELETE'])
def delete_instrument(instrument_id):
    instrument = Instruments.query.get(instrument_id)
    if not instrument:
        return jsonify({"error": "Instrument not found"}), 404

    db.session.delete(instrument)
    db.session.commit()
    return jsonify({"message": "Instrument deleted"}), 200



@api.route('/instrument-people', methods=['GET'])
def get_all_instrument_people():
    items = InstrumentPeople.query.all()
    return jsonify([i.serialize() for i in items]), 200


@api.route('/instrument-people', methods=['POST'])
def create_instrument_people():
    data = request.json
    item = InstrumentPeople(**data)
    db.session.add(item)
    db.session.commit()
    return jsonify(item.serialize()), 201


@api.route('/instrument-people/<int:item_id>', methods=['DELETE'])
def delete_instrument_people(item_id):
    item = InstrumentPeople.query.get(item_id)
    if not item:
        return jsonify({"error": "Relation not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Relation deleted"}), 200


