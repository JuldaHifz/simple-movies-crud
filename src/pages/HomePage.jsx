import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      let allMovies = [];
      let nextPageURL = "https://technical.test.talenavi.com/api/movie?page=1";

      while (nextPageURL) {
        try {
          const response = await fetch(nextPageURL);
          const data = await response.json();
          const moviesData = data.data.data;

          allMovies.push(...moviesData);
          nextPageURL = data.data.next_page_url;
        } catch (error) {
          console.log("Error when fetching data", error);
          break;
        }
      }

      setMovies(allMovies);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
  }

  useEffect(() => {
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredMovies(filteredMovies);
  }, [movies, searchQuery]);

  return (
    <div>
      <div className="flex">
        <h1 className=" mx-auto my-5 text-6xl font-bold">Movies Collection</h1>
      </div>
      <div className="flex">
        <input
          type="search"
          className="w-full rounded-none border-2 border-line px-5 py-2 placeholder:text-sm  focus:border-black focus:outline-none mx-5 my-5"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      {loading ? (
        <div className="flex">
          <span className="mx-auto my-5">Loading...</span>
        </div>
      ) : searchQuery ? (
        <div className="flex flex-col mx-5 gap-2">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col mx-5 gap-2">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      <Link to="create" className="fixed bottom-10 right-10">
        <div className=" border-2 border-black bg-white  w-20 h-20 rounded-full flex justify-center items-center text-3xl">
          +
        </div>
      </Link>
    </div>
  );
};

export default HomePage;
