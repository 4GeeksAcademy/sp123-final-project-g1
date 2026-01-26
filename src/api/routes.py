"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, People, Genre, GenrePeople, Bands, GenreBands, Instruments, InstrumentPeople
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API

# AUTH ===============================================

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        response_body["message"] = "Email and password required"
        return response_body, 400
    row = db.session.execute(db.select(Users).where(
                             Users.email == email,
                             Users.is_active == True)).scalar()
    if not row or row.password != password:
        response_body["message"] = "Bad username or password"
        return response_body, 401
    user = row.serialize()
    claims = {"user_id": user["id"],
              "is_active": user["is_active"],
              "is_admin": user.get("is_admin", False)}
    response_body["message"] = "User logged, ok"
    response_body["results"] = user
    response_body["access_token"] = create_access_token(identity=email, additional_claims=claims)

    return response_body, 200


@api.route("/signup", methods=["POST"])
def signup():
    response_body = {}
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        response_body["message"] = "Email and password required"
        return response_body, 400
    exists = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    if exists:
        response_body["message"] = "User already exists"
        return response_body, 400
    user = Users(email=email,
                 password=password,
                 alias=request.json.get("alias"),
                 photo_url=request.json.get("photo_url"),
                 background=request.json.get("background"),
                 song_url=request.json.get("song_url"),
                 latitude=request.json.get("latitude"),
                 longitude=request.json.get("longitude"),
                 is_active=True)
    
    db.session.add(user)
    db.session.commit()
    response_body["message"] = "User Created"
    response_body["results"] = user.serialize()

    return response_body, 201


@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    response_body = {}
    identity = get_jwt_identity()
    claims = get_jwt()
    row = db.session.execute(db.select(Users).where(Users.email == identity)).scalar()
    if not row:
        response_body["message"] = "Invalid token"
        return response_body, 401
    response_body["message"] = "Valid token"
    response_body["results"] = row.serialize()
    response_body["claims"] = claims

    return response_body, 200




@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend"
    return response_body, 200

# USER ==============================================

@api.route('/users', methods=['GET', 'POST'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = Users.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "User list"
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        if not data.get('email') or not data.get('password'):
            response_body['message'] = "Email and password required"
            return response_body, 400
        row = Users(**data)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "User created"

        return response_body, 201


@api.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def user(user_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = "User not found"
        return response_body, 404
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f"User details {user_id}"
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.email = data.get('email', row.email)
        row.password = data.get('password', row.password)
        row.photo_url = data.get('photo_url', row.photo_url)
        row.background = data.get('background', row.background)
        row.song_url = data.get('song_url', row.song_url)
        row.alias = data.get('alias', row.alias)
        row.latitude = data.get('latitude', row.latitude)
        row.longitude = data.get('longitude', row.longitude)
        row.is_active = data.get('is_active', row.is_active)

        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = f"User {user_id} modified"
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f"User {user_id} deleted"

        return response_body, 200


# =========================================================
# PEOPLE
# =========================================================

@api.route('/people', methods=['GET', 'POST'])
def people():
    response_body = {}
    if request.method == 'GET':
        rows = People.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "List of people"
        return response_body, 200
    if request.method == 'POST':
        row = People(**request.json)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Created succesfully"

        return response_body, 201


@api.route('/people/<int:people_id>', methods=['GET', 'PUT', 'DELETE'])
def person(people_id):
    response_body = {}
    row = db.session.execute(db.select(People).where(People.id == people_id)).scalar()
    if not row:
        response_body['message'] = "Person not found"
        return response_body, 404
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f"Details of: {people_id}"
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(row, key, value)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = f"User {people_id} modified"
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f"User {people_id} deleted"

        return response_body, 200


# =========================================================
# GENRES
# =========================================================

@api.route('/genres', methods=['GET', 'POST'])
def genres():
    response_body = {}
    if request.method == 'GET':
        rows = Genre.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "List of genres"
        return response_body, 200
    if request.method == 'POST':
        row = Genre(name=request.json.get('name'))
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Genre created"

        return response_body, 201


@api.route('/genres/<int:genre_id>', methods=['GET', 'PUT', 'DELETE'])
def genre(genre_id):
    response_body = {}
    row = db.session.execute(db.select(Genre).where(Genre.id == genre_id)).scalar()
    if not row:
        response_body['message'] = "Genre not found"
        return response_body, 404
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f"Detalles del género {genre_id}"
        return response_body, 200
    if request.method == 'PUT':
        row.name = request.json.get('name', row.name)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = f"Genre {genre_id} modified"
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f"Genre {genre_id} deleted"

        return response_body, 200


# =========================================================
# GENRE-PEOPLE
# =========================================================

@api.route('/genre-people', methods=['GET', 'POST'])
def genre_people():
    response_body = {}
    if request.method == 'GET':
        rows = GenrePeople.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "list of links genre-person"
        return response_body, 200
    if request.method == 'POST':
        row = GenrePeople(**request.json)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Link created"

        return response_body, 201


@api.route('/genre-people/<int:item_id>', methods=['DELETE'])
@jwt_required()
def genre_people_item(item_id):
    response_body = {}
    row = db.session.execute(db.select(GenrePeople).where(GenrePeople.id == item_id)).scalar()
    if not row:
        response_body['message'] = "Link not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Link {item_id} deleted"

    return response_body, 200


# =========================================================
# BANDS
# =========================================================

@api.route('/bands', methods=['GET', 'POST'])
def bands():
    response_body = {}
    if request.method == 'GET':
        rows = Bands.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "Bands list"
        return response_body, 200
    if request.method == 'POST':
        row = Bands(**request.json)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Band Created"

        return response_body, 201


@api.route('/bands/<int:band_id>', methods=['GET', 'PUT', 'DELETE'])
def band(band_id):
    response_body = {}
    row = db.session.execute(db.select(Bands).where(Bands.id == band_id)).scalar()
    if not row:
        response_body['message'] = "Band not found"
        return response_body, 404
    if request.method == 'GET':
        response_body['results'] = row.serialize()
        response_body['message'] = f"Band details {band_id}"
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(row, key, value)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = f"Band {band_id} modified"
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f"Band {band_id} deleted"

        return response_body, 200


# =========================================================
# GENRE-BANDS
# =========================================================

@api.route('/genre-bands', methods=['GET', 'POST'])
def genre_bands():
    response_body = {}
    if request.method == 'GET':
        rows = GenreBands.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "List of links genre-band"
        return response_body, 200
    if request.method == 'POST':
        row = GenreBands(**request.json)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Link Created"

        return response_body, 201


@api.route('/genre-bands/<int:item_id>', methods=['DELETE'])
@jwt_required()
def genre_bands_item(item_id):
    response_body = {}
    row = db.session.execute(db.select(GenreBands).where(GenreBands.id == item_id)).scalar()
    if not row:
        response_body['message'] = "Link not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Link {item_id} deleted"

    return response_body, 200


# =========================================================
# INSTRUMENTS
# =========================================================

@api.route('/instruments', methods=['GET', 'POST'])
def instruments():
    response_body = {}
    if request.method == 'GET':
        rows = Instruments.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "Instruments list"
        return response_body, 200
    if request.method == 'POST':
        row = Instruments(name=request.json.get('name'))
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Instrument created"

        return response_body, 201


@api.route('/instruments/<int:instrument_id>', methods=['DELETE'])
@jwt_required()
def instrument(instrument_id):
    response_body = {}
    row = db.session.execute(db.select(Instruments).where(Instruments.id == instrument_id)).scalar()
    if not row:
        response_body['message'] = "Instrument not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Instrument {instrument_id} deleted"

    return response_body, 200


# =========================================================
# INSTRUMENT-PEOPLE
# =========================================================

@api.route('/instrument-people', methods=['GET', 'POST'])
def instrument_people():
    response_body = {}
    if request.method == 'GET':
        rows = InstrumentPeople.query.all()
        response_body['results'] = [r.serialize() for r in rows]
        response_body['message'] = "List of links instrument-person"
        return response_body, 200
    if request.method == 'POST':
        row = InstrumentPeople(**request.json)
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = "Link created"

        return response_body, 201


@api.route('/instrument-people/<int:item_id>', methods=['DELETE'])
@jwt_required()
def instrument_people_item(item_id):
    response_body = {}
    row = db.session.execute(db.select(InstrumentPeople).where(InstrumentPeople.id == item_id)).scalar()
    if not row:
        response_body['message'] = "Link not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Link {item_id} deleted"

    return response_body, 200           


