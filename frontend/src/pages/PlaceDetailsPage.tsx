import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlaceById } from '../services/api';
import type { Place } from '../types/api';

const mockEvents = [
  { title: 'Show Musical', date: '3 Junho 2026', tag: 'Entretenimento' },
  { title: 'Jogo de Futebol', date: '4 Junho 2026', tag: 'Esportivo' },
];

export function PlaceDetailsPage() {
  const { id = '' } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getPlaceById(id)
      .then(setPlace)
      .catch(() => setError('Não foi possível carregar os detalhes deste local.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="feedback page-feedback">Carregando local...</p>;
  }

  if (error || !place) {
    return (
      <section className="detail-page">
        <p className="feedback error">{error ?? 'Local não encontrado.'}</p>
        <Link className="inline-link" to="/">
          Voltar ao catálogo
        </Link>
      </section>
    );
  }

  const gallery = [place.imageUrl, place.imageUrl, place.imageUrl].filter(Boolean) as string[];
  const encodedAddress = encodeURIComponent(`${place.name}, ${place.address}, ${place.neighborhood}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const wazeUrl = `https://www.waze.com/ul?q=${encodedAddress}&navigate=yes`;

  return (
    <section className="detail-page">
      <article className="detail-surface">
        <header
          className="detail-hero"
          style={
            place.imageUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(8, 12, 22, 0.1), rgba(8, 12, 22, 0.78)), url(${place.imageUrl})`,
                }
              : undefined
          }
        >
          <div className="detail-overlay">
            <div className="portal-brand detail-brand">
              <span className="portal-brand-mark" />
              <div>
                <strong>{place.name}</strong>
                <p>{place.address}</p>
              </div>
            </div>

            <div className="detail-actions">
              <Link className="icon-button" to="/">
                ⟵
              </Link>
              <button className="icon-button" type="button">
                ☰
              </button>
            </div>
          </div>
        </header>

        <div className="detail-content">
          <section className="detail-copy">
            <div className="detail-block">
              <h2>Descrição</h2>
              <p>{place.description}</p>
            </div>

            <div className="detail-block">
              <h2>Informações</h2>
              <ul className="info-list">
                <li>{place.address}</li>
                <li>Bairro: {place.neighborhood}</li>
                <li>Categoria: {place.category.name}</li>
                {place.latitude != null && place.longitude != null ? (
                  <li>
                    Coordenadas: {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </li>
                ) : null}
              </ul>
              <div className="directions-actions">
                <a className="primary-button" href={googleMapsUrl} rel="noreferrer" target="_blank">
                  Google Maps
                </a>
                <a className="landing-secondary-button" href={wazeUrl} rel="noreferrer" target="_blank">
                  Waze
                </a>
              </div>
            </div>

            <div className="detail-block">
              <h2>Eventos</h2>
              <div className="event-grid">
                {mockEvents.map((event) => (
                  <article className="event-card" key={event.title}>
                    <div className="event-thumb" />
                    <div>
                      <strong>{event.title}</strong>
                      <p>{event.date}</p>
                      <span>{event.tag}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="detail-side">
            <div className="mini-map">
              <span className="pin pin-a" />
              <span className="pin pin-b" />
              <span className="pin pin-c" />
              <span className="pin pin-d" />
            </div>

            <div className="detail-block">
              <h2>Galeria de Fotos</h2>
              <div className="gallery-grid">
                {(gallery.length > 0 ? gallery : [null, null, null]).map((image, index) => (
                  <div
                    className="gallery-card"
                    key={`${place.id}-${index}`}
                    style={image ? { backgroundImage: `url(${image})` } : undefined}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </section>
  );
}
