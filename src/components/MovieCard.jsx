/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
const MovieCard = ({ movie }) => {
  return (
    <>
      <Link to={`movie/${movie.id}`}>
        <div className=" rounded-lg border-2 border-black px-5 py-3 flex flex-col w-full">
          <h1 className=" font-bold">{movie.title}</h1>
          <h3>{movie.director}</h3>
          <p className="pt-4 text-right">
            {movie.genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>
      </Link>
    </>
  );
};

export default MovieCard;
