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
    def __repr__(self):
        return f'<User {self.email} - {self.id} - {self.is_active}>'
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