"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from src.api.utils import generate_sitemap, APIException
from flask_cors import CORS
from src.api.models import db, Users, People, Genre, GenrePeople, Bands, GenreBands, Instruments, InstrumentPeople, Multimedia
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
import cloudinary
import cloudinary.uploader


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    if not email or not password:
        return jsonify({"msg": "Email y contraseña requeridos"}), 400
    user = Users.query.filter_by(email=email).first()
    if not user or user.password != password:
        return jsonify({"msg": "Credenciales inválidas"}), 401
    access_token = create_access_token(identity=str(user.id))
    people = People.query.filter_by(user_id=user.id).first()
    response_body = {"token": access_token, "user": user.serialize(
    ), "people": people.serialize() if people else None}
    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    alias = body.get("alias")
    photo_url = body.get("photo_url")
    background = body.get("background")
    song_url = body.get("song_url")
    latitude = body.get("latitude")
    longitude = body.get("longitude")
    if not alias or alias.strip() == "":
        return jsonify({"message": "El alias es obligatorio"}), 400
    if not email or not password:
        return jsonify({"message": "Email y contraseña requeridos"}), 400
    if len(password) < 6:
        return jsonify({"message": "La contraseña debe tener al menos 6 caracteres"}), 400
    alias_exists = Users.query.filter_by(alias=alias).first()
    if alias_exists:
        return jsonify({"message": "Ese alias ya está en uso"}), 400
    email_exists = Users.query.filter_by(email=email).first()
    if email_exists:
        return jsonify({"message": "Ese email ya está registrado"}), 400
    user = Users(email=email,
                 password=password,
                 alias=alias,
                 photo_url=photo_url,
                 background=background,
                 song_url=song_url,
                 latitude=latitude,
                 longitude=longitude,
                 is_active=True)
    db.session.add(user)
    db.session.commit()
    people = People(user_id=user.id,
                    name=alias,
                    surname=None,
                    bio=None,
                    is_musician=False,
                    is_dj=False,
                    is_singer=False,
                    is_composer=False,
                    is_teacher=False,
                    is_light_tech=False,
                    is_sound_tech=False,
                    is_producer=False,
                    is_fan=True)
    db.session.add(people)
    db.session.commit()
    return jsonify({"message": "Usuario creado correctamente", "user": user.serialize(), "people": people.serialize()}), 201


@api.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    data = request.get_json()
    user.alias = data.get("alias", user.alias)
    user.background = data.get("background", user.background)
    user.theme = data.get("theme", user.theme)
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend"
    return response_body, 200


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
    row = db.session.execute(
        db.select(Users).where(Users.id == user_id)).scalar()
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
    row = db.session.execute(db.select(People).where(
        People.id == people_id)).scalar()
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
    row = db.session.execute(
        db.select(Genre).where(Genre.id == genre_id)).scalar()
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
    row = db.session.execute(db.select(GenrePeople).where(
        GenrePeople.id == item_id)).scalar()
    if not row:
        response_body['message'] = "Link not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Link {item_id} deleted"
    return response_body, 200


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
    row = db.session.execute(
        db.select(Bands).where(Bands.id == band_id)).scalar()
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
    row = db.session.execute(db.select(GenreBands).where(
        GenreBands.id == item_id)).scalar()
    if not row:
        response_body['message'] = "Link not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Link {item_id} deleted"
    return response_body, 200


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
    row = db.session.execute(db.select(Instruments).where(
        Instruments.id == instrument_id)).scalar()
    if not row:
        response_body['message'] = "Instrument not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Instrument {instrument_id} deleted"
    return response_body, 200


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
    row = db.session.execute(db.select(InstrumentPeople).where(
        InstrumentPeople.id == item_id)).scalar()
    if not row:
        response_body['message'] = "Link not found"
        return response_body, 404
    db.session.delete(row)
    db.session.commit()
    response_body['message'] = f"Link {item_id} deleted"
    return response_body, 200


@api.route('/user/location', methods=['POST'])
def save_location():
    data = request.json
    user = Users.query.get(data["user_id"])
    user.latitude = data["latitude"]
    user.longitude = data["longitude"]
    db.session.commit()
    return jsonify({"msg": "Location saved"}), 200


@api.route('/map/people', methods=['GET'])
def map_people():
    rows = (db.session.execute(db.select(People).join(Users).where(
        Users.latitude.isnot(None), Users.longitude.isnot(None))).scalars().all())
    features = []
    for person in rows:
        user = person.user_to
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point",
                         "coordinates": [user.longitude, user.latitude]},
            "properties": {"id": person.id,
                           "name": person.name,
                           "roles": {"musician": person.is_musician,
                                     "dj": person.is_dj,
                                     "producer": person.is_producer,
                                     "teacher": person.is_teacher,
                                     "sound_tech": person.is_sound_tech},
                           "city": user.city,
                           "country": user.country}})

    return jsonify({"type": "FeatureCollection", "features": features}), 200


@api.route("/update-background", methods=["POST"])
@jwt_required()
def update_background():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    color = request.json.get("color")
    allowed_colors = ["#0F3D0F", "#0A1A3D", "#3D0A0A",
                      "#3D3200", "#2A0F3D", "#3D1F0A", "#3D0A2A", "#1A1A1A"]
    if color not in allowed_colors:
        return jsonify({"message": "Color no permitido"}), 400
    user.background = color
    db.session.commit()
    return jsonify({"user": user.serialize()}), 200


@api.route("/update-theme", methods=["POST"])
@jwt_required()
def update_theme():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    theme = request.json.get("theme")
    allowed = ["dark", "neon", "sunset", "sonora", "ocean", "pastel"]
    if theme not in allowed:
        return jsonify({"message": "Tema no permitido"}), 400
    user.theme = theme
    db.session.commit()
    return jsonify({"user": user.serialize()}), 200


@api.route("/update-photo", methods=["POST"])
@jwt_required()
def update_photo():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    if "photo" not in request.files:
        return jsonify({"message": "No se envió ninguna imagen"}), 400
    photo = request.files["photo"]
    filename = f"user_{user_id}.jpg"
    filepath = f"./src/static/profile_photos/{filename}"
    photo.save(filepath)
    user.photo_url = f"/static/profile_photos/{filename}"
    db.session.commit()
    return jsonify({"user": user.serialize()}), 200


@api.route('/update-bio', methods=['POST'])
@jwt_required()
def update_bio():
    user_id = int(get_jwt_identity())
    body = request.get_json()
    bio = body.get("bio", "")
    people = People.query.filter_by(user_id=user_id).first()
    if not people:
        return jsonify({"msg": "Perfil no encontrado"}), 404
    people.bio = bio
    db.session.commit()
    return jsonify({"msg": "Bio actualizada", "people": people.serialize()}), 200


@api.route('/public-profile/<alias>', methods=['GET'])
def public_profile(alias):
    user = Users.query.filter_by(alias=alias).first()
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    people = People.query.filter_by(user_id=user.id).first()
    if not people:
        return jsonify({"msg": "Perfil no encontrado"}), 404
    return jsonify({"user": user.serialize(), "people": people.serialize()}), 200


@api.route('/update-instruments', methods=['POST'])
@jwt_required()
def update_instruments():
    user_id = int(get_jwt_identity())
    body = request.get_json()
    instruments = body.get("instruments", [])
    people = People.query.filter_by(user_id=user_id).first()
    if not people:
        return jsonify({"msg": "Perfil no encontrado"}), 404
    InstrumentPeople.query.filter_by(people_id=people.id).delete()
    for inst in instruments:
        new_inst = InstrumentPeople(people_id=people.id, instrument_id=inst["instrument_id"], level=inst["level"], comment=inst.get("comment"))
        db.session.add(new_inst)
    db.session.commit()
    return jsonify({"msg": "Instrumentos actualizados", "people": people.serialize()}), 200


@api.route('/update-roles', methods=['POST'])
@jwt_required()
def update_roles():
    user_id = int(get_jwt_identity())
    body = request.get_json()
    people = People.query.filter_by(user_id=user_id).first()
    if not people:
        return jsonify({"msg": "Perfil no encontrado"}), 404
    roles = ["is_musician", "is_dj", "is_singer", "is_composer",
             "is_teacher", "is_light_tech", "is_sound_tech", "is_producer", "is_fan"]
    for role in roles:
        if role in body:
            setattr(people, role, body[role])
    db.session.commit()
    return jsonify({"msg": "Roles actualizados", "people": people.serialize()}), 200


@api.route('/seed-instruments')
def seed_instruments():
    names = [
        "Guitarra", "Piano", "Batería", "Bajo", "Violín", "Saxofón", "Trompeta", "Percusión", "Teclado", "Ukelele"]
    for name in names:
        exists = Instruments.query.filter_by(name=name).first()
        if not exists:
            db.session.add(Instruments(name=name))
    db.session.commit()
    return jsonify({"message": "Instruments seeded"}), 200


@api.route('/check-alias/<alias>', methods=['GET'])
def check_alias(alias):
    exists = Users.query.filter_by(alias=alias).first() is not None
    return jsonify({"exists": exists}), 200


@api.route('/check-email/<email>', methods=['GET'])
def check_email(email):
    exists = Users.query.filter_by(email=email).first() is not None
    return jsonify({"exists": exists}), 200


@api.route("/profile/song", methods=["PUT"])
@jwt_required()
def update_profile_song():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    data = request.get_json()
    song_url = data.get("song_url")
    if not song_url:
        return jsonify({"msg": "song_url is required"}), 400
    user.song_url = song_url
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route("/upload-multimedia", methods=["POST", "OPTIONS"])
@jwt_required()
def upload_multimedia():
    if request.method == "OPTIONS":
        response = jsonify({"message": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response
    user_id = get_jwt_identity()
    user = Users.query.get(user_id)
    if "file" not in request.files:
        response = jsonify({"error": "No file provided"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400
    file = request.files["file"]
    upload_result = cloudinary.uploader.upload(file, resource_type="auto")
    url = upload_result.get("secure_url")
    file_type = upload_result.get("resource_type")
    new_media = Multimedia(user_id=user.id, url=url, type=file_type)
    db.session.add(new_media)
    db.session.commit()
    response = jsonify(new_media.serialize())
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@api.route("/multimedia/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_multimedia(id):
    media = Multimedia.query.get(id)
    if not media:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(media)
    db.session.commit()
    return jsonify({"message": "deleted"}), 200


@api.route("/profile/youtube", methods=["PUT"])
@jwt_required()
def update_youtube():
    user_id = int(get_jwt_identity())
    user = Users.query.get(user_id)
    data = request.get_json()
    youtube_url = data.get("youtube_url")
    user.youtube_url = youtube_url
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route("/events/<country_code>", methods=["GET"])
def get_events(country_code):
    import os
    import requests
    from flask import jsonify

    api_key = os.getenv("TICKETMASTER_API_KEY")
    if not api_key:
        return jsonify({"error": "API key not configured"}), 500

    country_code = country_code.upper()  # 🔑 CLAVE

    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    params = {
        "apikey": api_key,
        "countryCode": country_code,
        "classificationName": "music",
        "size": 20
    }

    response = requests.get(url, params=params)
    data = response.json()

    if "_embedded" not in data:
        return jsonify([]), 200

    events = []
    for event in data["_embedded"]["events"]:
        events.append({
            "id": event.get("id"),
            "name": event.get("name"),
            "date": event.get("dates", {}).get("start", {}).get("localDate"),
            "image": event.get("images", [{}])[0].get("url")
        })

    return jsonify(events), 200

@api.route("/events/highlights", methods=["GET"])
def get_highlight_events():
    import os
    import requests

    api_key = os.getenv("TICKETMASTER_API_KEY")

    if not api_key:
        return jsonify([]), 200

    url = "https://app.ticketmaster.com/discovery/v2/events.json"

    params = {
        "apikey": api_key,
        "classificationName": "music",
        "size": 12
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return jsonify([]), 200

    data = response.json()

    if "_embedded" not in data:
        return jsonify([]), 200

    events = []

    for event in data["_embedded"]["events"]:
        events.append({
            "id": event.get("id"),
            "name": event.get("name"),
            "date": event.get("dates", {}).get("start", {}).get("localDate"),
            "image": event.get("images", [{}])[0].get("url"),
            "country": event.get("_embedded", {})
                .get("venues", [{}])[0]
                .get("country", {})
                .get("countryCode")
        })

    return jsonify(events), 200
@api.route('/update-country', methods=['POST'])
@jwt_required()
def update_country():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = Users.query.get(user_id)
    user.country = data.get("country")
    db.session.commit()
    return jsonify({"user": user.serialize()}), 200


@api.route('/update-city', methods=['POST'])
@jwt_required()
def update_city():
    user_id = get_jwt_identity()
    user = Users.query.get(user_id)
    data = request.get_json()
    user.city = data.get("city")
    db.session.commit()
    return jsonify({"user": user.serialize()}), 200
