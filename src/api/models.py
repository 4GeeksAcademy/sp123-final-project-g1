from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column


db = SQLAlchemy()


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

