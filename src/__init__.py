from src.api.models import Instruments, db
from app import app

default_instruments = [
    "Guitarra",
    "Piano",
    "Batería",
    "Bajo",
    "Violín",
    "Saxofón",
    "Trompeta",
    "Percusión",
    "Teclado",
    "Ukelele"
]

with app.app_context():
    for name in default_instruments:
        exists = Instruments.query.filter_by(name=name).first()
        if not exists:
            db.session.add(Instruments(name=name))

    db.session.commit()
