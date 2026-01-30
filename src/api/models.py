from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class Users(db.Model):
    '''
    Docstring for Users
    authors: Alex, Claudia, Dylan
    '''
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    photo_url = db.Column(db.String)
    background = db.Column(db.String(7))
    song_url = db.Column(db.String)
    alias = db.Column(db.String(80))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    theme = db.Column(db.String(20), default="dark")
    song_url = db.Column(db.String)
    def __repr__(self):
        return f'<User {self.id} - {self.email}>'
    def serialize(self):
        return {"id": self.id,
                "email": self.email,
                "photo_url": self.photo_url,
                "background": self.background,
                "song_url": self.song_url,
                "alias": self.alias,
                "latitude": self.latitude,
                "longitude": self.longitude,
                "is_active": self.is_active,
                "theme": self.theme,
                "is_admin": self.is_admin
                }

    
class People(db.Model):
    id = db.Column(db.Integer, primary_key=True)
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
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users',foreign_keys=[user_id],backref=db.backref('people_to', lazy='select'))
    def __repr__(self):
        return f"<People {self.id} - {self.name} {self.surname}>"
    def serialize(self):
        return {"id": self.id,
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
                "genres": [gp.genre_to.serialize() for gp in self.people_to_GP],
                "instruments": [i.serialize() for i in self.people_to_IP],
                "bands": [b.serialize() for b in self.user_to_B]}

    
class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    def __repr__(self):
        return f'<Genre {self.name}>'
    def serialize(self):
        return {"id": self.id,
                "name": self.name}
    

class GenrePeople(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    people_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    people_to = db.relationship('People', foreign_keys=[people_id],
                               backref=db.backref('people_to_GP', lazy='select'))
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'))
    genre_to = db.relationship('Genre', foreign_keys=[genre_id],
                               backref=db.backref('genre_to_GP', lazy='select'))
    def __repr__(self):
        return f'<GenrePeople {self.id} - {self.people_id} - {self.genre_id}>'
    def serialize(self):
        return {"id": self.id,
                "people_id": self.people_id,
                "genre_id": self.genre_id}
    

class GenreBands(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    band_id = db.Column(db.Integer, db.ForeignKey('bands.id'))
    band_to = db.relationship('Bands', foreign_keys=[band_id],
                               backref=db.backref('band_to_GB', lazy='select'))
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'))
    genre_to = db.relationship('Genre', foreign_keys=[genre_id],
                               backref=db.backref('genre_to_GB', lazy='select'))
    def __repr__(self):
        band = self.band.name if self.band else self.band_id
        genre = self.genre.name if self.genre else self.genre_id
        return f'<GenreBands {band} → {genre}>'
    def serialize(self):
        return {"id": self.id,
                "band_id": self.band_id,
                "genre_id": self.genre_id,
                "genre": self.genre.serialize() if self.genre else None}
    

class Bands(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    bio = db.Column(db.String)
    owner_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    user_to = db.relationship('People', foreign_keys=[owner_id],
                               backref=db.backref('user_to_B', lazy='select'))
    def __repr__(self):
        return f'<Band {self.name}>'
    def serialize(self):
        return {"id": self.id,
                "name": self.name,
                "bio": self.bio,
                "owner_id": self.owner_id,
                "genres": [g.serialize() for g in self.genres]}
    

class InstrumentPeople(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    people_id = db.Column(db.Integer, db.ForeignKey('people.id'))
    people_to = db.relationship('People',foreign_keys=[people_id], backref=db.backref('people_to_IP', lazy='select'))
    instrument_id = db.Column(db.Integer, db.ForeignKey('instruments.id'))
    instrument_id_to = db.relationship('Instruments',foreign_keys=[instrument_id],backref=db.backref('instrument_to_IP', lazy='select'), overlaps="instrument_people,instrument")
    level = db.Column(db.Integer, nullable=False, default=1)
    def __repr__(self):
        return f'<InstrumentPeople {self.id} - {self.instrument_id}>'
    def serialize(self):
        return {"id": self.id,
                "level": self.level,
                "instrument": self.instrument.serialize() if self.instrument else None}
    

class Instruments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    instrument_people = db.relationship('InstrumentPeople', backref='instrument', overlaps="instrument_id_to,instrument_to_IP")
    def __repr__(self):
        return f'<Instrument {self.name} - {self.id}>'
    def serialize(self):
        return {"id": self.id,
                "name": self.name}

