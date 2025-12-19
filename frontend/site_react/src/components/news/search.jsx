export function Search() {
    const sectionStyle = {
        width: '80%',
        margin: '0 auto',
        padding: '10px',
        marginTop: '20px',
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
    };
    const inputsearchStyle = {
        height: '44px',
        width: '100%',
        paddingLeft: '30px',
        marginTop: '15px',
        border: '1px solid #ccc',
        backgroundColor: '#F3F3F3',
        borderRadius: '15px',
        border: 'none',
        fontSize: '16px',
    };
    return (
        <section style={sectionStyle}>
                    <input
                        type="search"
                        placeholder="Rechercher par mots-clés..."
                        style={inputsearchStyle}
                    />

            {/* <div style={{ marginBottom: '1rem' }}>
                <label>
                    Filtrer par catégorie :
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ marginLeft: '0.5rem' }}
                    >
                        {presets.map(p => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div> */}
        </section>
    );
}