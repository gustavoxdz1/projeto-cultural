import { Link } from 'react-router-dom';
import type { Place } from '../types/api';

type PlaceCardProps = {
  place: Place;
};

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link className="place-card" to={`/locais/${place.id}`}>
      <div
        className="place-image"
        style={
          place.imageUrl
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(11, 15, 23, 0.18), rgba(11, 15, 23, 0.8)), url(${place.imageUrl})`,
              }
            : undefined
        }
      >
        <span>{place.category.name}</span>
      </div>

      <div className="place-body">
        <div className="place-heading">
          <h3>{place.name}</h3>
          <strong>{place.neighborhood}</strong>
        </div>
        <p>{place.description}</p>
        <small>{place.address}</small>
      </div>
    </Link>
  );
}
