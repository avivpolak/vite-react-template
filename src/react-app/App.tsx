// src/App.tsx

import React, { useEffect, useState } from "react";
import "./App.css";

type SiteData = any;

const sampleData: SiteData = {
	artist: { name: "Artist Name", bio: "Replace with artist bio.", photo: "/react-app/assets/artist.jpg" },
	youtube: [],
	spotify: [],
	shows: [],
	links: {}
};

function YouTubeEmbed({ id, title }: { id: string; title?: string }) {
	const src = `https://www.youtube.com/embed/${id}`;
	return (
		<div className="media-card">
			<iframe
				title={title || id}
				width="560"
				height="315"
				src={src}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
			<div className="media-title">{title}</div>
		</div>
	);
}

function SpotifyEmbed({ src, title }: { src: string; title?: string }) {
	return (
		<div className="media-card">
			<iframe
				title={title || src}
				src={src}
				width="100%"
				height="120"
				allow="encrypted-media"
				frameBorder="0"
			/>
			<div className="media-title">{title}</div>
		</div>
	);
}

function ShowsList({ shows }: { shows: any[] }) {
	if (!shows || shows.length === 0) return <p>No upcoming shows.</p>;
	return (
		<ul className="shows-list">
			{shows.map((s, i) => (
				<li key={i} className="show-item">
					<div className="show-date">{s.date}</div>
					<div className="show-venue">{s.venue} — {s.city}</div>
					{s.ticket_url && (
						<a className="ticket-link" href={s.ticket_url} target="_blank">Tickets</a>
					)}
				</li>
			))}
		</ul>
	);
}

function About({ artist }: { artist: any }) {
	return (
		<div className="about">
			{artist?.photo && <img className="artist-photo" src={artist.photo} alt={artist.name} />}
			<div className="about-text">
				<h2>{artist?.name}</h2>
				<p>{artist?.bio}</p>
			</div>
		</div>
	);
}

function App() {
	const [data, setData] = useState<SiteData>(sampleData);

	useEffect(() => {
		fetch("/site.json")
			.then((res) => {
				if (!res.ok) throw new Error("no site.json in public/");
				return res.json();
			})
			.then((json) => setData(json))
			.catch(() => {
				// keep sampleData
			});
	}, []);

	return (
		<div id="root">
			<header className="site-header">
				<h1>{data.artist?.name || "Artist"}</h1>
				<nav className="site-nav">
					<a href="#music">Music</a>
					<a href="#shows">Shows</a>
					<a href="#about">About</a>
				</nav>
			</header>

			<main>
				<section id="music" className="section">
					<h2>Music</h2>
					<div className="media-grid">
						{data.youtube && data.youtube.map((y: any, i: number) => (
							<YouTubeEmbed key={`yt-${i}`} id={y.id} title={y.title} />
						))}
						{data.spotify && data.spotify.map((s: any, i: number) => (
							<SpotifyEmbed key={`sp-${i}`} src={s.embed} title={s.title} />
						))}
					</div>
				</section>

				<section id="shows" className="section">
					<h2>Upcoming Shows</h2>
					<ShowsList shows={data.shows || []} />
				</section>

				<section id="about" className="section">
					<h2>About</h2>
					<About artist={data.artist} />
					<div className="links">
						{data.links?.instagram && <a href={data.links.instagram} target="_blank">Instagram</a>}
						{data.links?.facebook && <a href={data.links.facebook} target="_blank">Facebook</a>}
						{data.links?.email && <a href={data.links.email}>Contact</a>}
					</div>
				</section>
			</main>

			<footer className="site-footer">© {new Date().getFullYear()} {data.artist?.name || "Artist"}</footer>
		</div>
	);
}

export default App;
