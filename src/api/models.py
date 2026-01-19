from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    photo_url = db.Column(db.String)
    background = db.Column(db.String(7))  # Hex color
    canción_url = db.Column(db.String)
    alias = db.Column(db.String(80))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    is_active = db.Column(db.Boolean, nullable=False)
    people = db.relationship('People', backref='user', uselist=False)
    bands_owned = db.relationship('Bands', backref='owner')
    def __repr__(self):
        return f'<User {self.email}>'
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "photo_url": self.photo_url,
            "background": self.background,
            "canción_url": self.canción_url,
            "alias": self.alias,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "is_active": self.is_active,
            "people": self.people.serialize() if self.people else None
        }


class People(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(80))
    surname = db.Column(db.String(80))
    bio = db.Column(db.String)
    is_musician = db.Column(db.Boolean)
    is_dj = db.Column(db.Boolean)
    is_singer = db.Column(db.Boolean)
    is_composer = db.Column(db.Boolean)
    is_teacher = db.Column(db.Boolean)
    is_light_tech = db.Column(db.Boolean)
    is_sound_tech = db.Column(db.Boolean)
    is_producer = db.Column(db.Boolean)
    is_fan = db.Column(db.Boolean)
    genres = db.relationship('GenrePeople', backref='person')
    instruments = db.relationship('InstrumentPeople', backref='person')
    def __repr__(self):
        full_name = f"{self.name or ''} {self.surname or ''}".strip()
        return f'<People {full_name}>' if full_name else f'<People {self.id}>'
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "surname": self.surname,
            "bio": self.bio,
            "is_musician": self.is_musician,
            "is_dj": self.is_dj,
            "is_singer": self.is_singer,
            "is_composer": self.is_composer,
            "is_teacher": self.is_teacher,
            "is_light_tech": self.is_light_tech,
            "is_sound_tech": self.is_sound_tech,
            "is_producer": self.is_producer,
            "is_fan": self.is_fan,
            "genres": [g.serialize() for g in self.genres],
            "instruments": [i.serialize() for i in self.instruments]
        }
# ---------------------------------------------------------
# GENRES
# ---------------------------------------------------------
class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    genre_people = db.relationship('GenrePeople', backref='genre')
    genre_bands = db.relationship('GenreBands', backref='genre')
    def __repr__(self):
        return f'<Genre {self.name}>'
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
class GenrePeople(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    people_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'))
    def __repr__(self):
        person = f"{self.person.name} {self.person.surname}".strip() if self.person else self.people_id
        genre = self.genre.name if self.genre else self.genre_id
        return f'<GenrePeople {person} → {genre}>'
    def serialize(self):
        return {
            "id": self.id,
            "people_id": self.people_id,
            "genre_id": self.genre_id,
            "genre": self.genre.serialize() if self.genre else None
        }
# ---------------------------------------------------------
# BANDS
# ---------------------------------------------------------
class Bands(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    bio = db.Column(db.String)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    genres = db.relationship('GenreBands', backref='band')
    def __repr__(self):
        return f'<Band {self.name}>'
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "bio": self.bio,
            "owner_id": self.owner_id,
            "genres": [g.serialize() for g in self.genres]
        }
class GenreBands(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    band_id = db.Column(db.Integer, db.ForeignKey('bands.id'))
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'))
    def __repr__(self):
        band = self.band.name if self.band else self.band_id
        genre = self.genre.name if self.genre else self.genre_id
        return f'<GenreBands {band} → {genre}>'
    def serialize(self):
        return {
            "id": self.id,
            "band_id": self.band_id,
            "genre_id": self.genre_id,
            "genre": self.genre.serialize() if self.genre else None
        }
# ---------------------------------------------------------
# INSTRUMENTS
# ---------------------------------------------------------
class Instrumentos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    instrument_people = db.relationship('InstrumentPeople', backref='instrument')
    def __repr__(self):
        return f'<Instrument {self.name}>'
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
class InstrumentPeople(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    people_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    instrument_id = db.Column(db.Integer, db.ForeignKey('instrumentos.id'))
    def __repr__(self):
        person = f"{self.person.name} {self.person.surname}".strip() if self.person else self.people_id
        instrument = self.instrument.name if self.instrument else self.instrument_id
        return f'<InstrumentPeople {person} → {instrument}>'
    def serialize(self):
        return {
            "id": self.id,
            "people_id": self.people_id,
            "instrument_id": self.instrument_id,
            "instrument": self.instrument.serialize() if self.instrument else None
        }