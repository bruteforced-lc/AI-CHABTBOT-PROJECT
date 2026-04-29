function SongCard({ song }) {
  return (
    <div className="card bg-dark text-white border border-secondary mb-3">
      <div className="card-body">

        <h5 className="card-title text-warning mb-1">
          {song.title}
        </h5>

        <p className="card-subtitle text-secondary mb-3">
          {song.artist}
        </p>

        <span className="badge me-2" style={{ backgroundColor: "#7c3aed" }}>
          {song.mood}
        </span>

        <div className="mt-3">
          <a href={song.lastfm_url} target="_blank" rel="noreferrer" className="btn btn-outline-warning btn-sm">
            Last.fm pe suno →
          </a>
        </div>

      </div>
    </div>
  )
}

export default SongCard