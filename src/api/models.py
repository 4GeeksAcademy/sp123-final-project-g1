from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class Genre(db.Model):
    __tablename__ = "genre"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    genre_people = db.relationship("GenrePeople", backref="genre")
    genre_bands = db.relationship("GenreBands", backref="genre")

    def __repr__(self):
        return f"<Genre {self.name}>"

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
    

class GenrePeople(db.Model):
    __tablename__ = "genre_people"

    id = db.Column(db.Integer, primary_key=True)
    people_id = db.Column(db.Integer, db.ForeignKey("people.id"))
    genre_id = db.Column(db.Integer, db.ForeignKey("genre.id"))

    def __repr__(self):
        person = (
            f"{self.person.name} {self.person.surname}".strip()
            if self.person
            else self.people_id
        )
        genre = self.genre.name if self.genre else self.genre_id
        return f"<GenrePeople {person} → {genre}>"

    def serialize(self):
        return {
            "id": self.id,
            "people_id": self.people_id,
            "genre_id": self.genre_id,
            "genre": self.genre.serialize() if self.genre else None,
        }


