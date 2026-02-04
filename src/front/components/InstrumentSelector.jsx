import { useState } from "react";

export const InstrumentSelector = ({ instrumentsList, onAdd }) => {
    const [selectedInstrument, setSelectedInstrument] = useState("");
    const [level, setLevel] = useState(1);

    return (
        <div className="mb-4">
            
            <select
                className="form-select mb-2"
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value)}
            >
                <option value="">Selecciona un instrumento</option>
                {instrumentsList.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                        {inst.name}
                    </option>
                ))}
            </select>
            
            <div className="d-flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                    <span
                        key={n}
                        onClick={() => setLevel(n)}
                        style={{
                            cursor: "pointer",
                            fontSize: "1.5rem",
                            color: n <= level ? "#ff9900" : "#ccc"
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>

            <button
                className="btn btn-primary"
                disabled={!selectedInstrument}
                onClick={() => {
                    onAdd({
                        instrument_id: parseInt(selectedInstrument),
                        level
                    });
                    setSelectedInstrument("");
                    setLevel(1);
                }}
            >
                Añadir instrumento
            </button>
        </div>
    );
};