import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [summary, setSummary] = useState("");
  const [genres, setGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const genreList = allGenres;

  useEffect(() => {
    const fetchGenres = async () => {
      let nextPageURL = "https://technical.test.talenavi.com/api/genre?page=1";
      let fetchedGenres = [];

      while (nextPageURL) {
        try {
          const response = await fetch(nextPageURL);
          const data = await response.json();
          const genresData = data.data.data;
          fetchedGenres.push(...genresData);
          nextPageURL = data.data.next_page_url;
        } catch (error) {
          console.log("Error when fetching data", error);
          break;
        }
      }
      setAllGenres(fetchedGenres);
    };

    fetchGenres();
  }, []);

  const handleGenreToggle = (genre) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://technical.test.talenavi.com/api/movie/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const genres = data.data.genres.map(({ name }) => name);

        setMovie(data.data);
        setTitle(data.data.title);
        setDirector(data.data.director);
        setSummary(data.data.summary);
        setGenres(genres);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovie();
  }, []);

  useEffect(() => {
    const isValid = title && director && summary && genres.length > 0;
    setIsFormValid(isValid);
  }, [title, director, summary, genres]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://technical.test.talenavi.com/api/movie/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        navigate(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    const updatedMovie = {
      title,
      director,
      summary,
      genre: genres,
    };

    try {
      const response = await fetch(
        `https://technical.test.talenavi.com/api/movie/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMovie),
        }
      );
      if (response.ok) {
        navigate(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between border-2 border-b-black px-5 py-2 ">
        <Link to="/">
          <button className=" text-lg border-2 border-black p-2">Back</button>
        </Link>
        <div className="flex flex-row gap-2">
          <button
            className=" text-lg border-2 border-black p-2"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className={`text-lg border-2 border-black p-2 ${
              isFormValid
                ? ""
                : "opacity-30 cursor-not-allowed border-opacity-30"
            }`}
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>

      {!movie ? (
        <div>Loading...</div>
      ) : (
        <div className="mx-5">
          <form className="flex flex-col">
            <label className="flex flex-col relative my-6">
              <span className=" absolute -top-5 left-5 text-lg bg-white p-1">
                Title
              </span>
              <input
                className="border-2 border-black p-2"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>
            <label className="flex flex-col relative my-6">
              <span className=" absolute -top-5 left-5 text-lg bg-white p-1">
                Director
              </span>
              <input
                className="border-2 border-black p-2"
                type="text"
                value={director}
                onChange={(event) => setDirector(event.target.value)}
              />
            </label>
            <label className="flex flex-col relative my-6">
              <span className=" absolute -top-5 left-5 text-lg bg-white p-1">
                Summary
              </span>
              <textarea
                className="border-2 border-black p-2"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>
            <div className="flex gap-2 flex-wrap">
              {genreList.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`inline-flex items-center gap-x-2 text-nowrap border-2 border-line px-6 py-2 text-sm font-medium rounded-full transition-all duration-100 hover:bg-black hover:text-white md:text-base
            ${genres.includes(item.name) ? "bg-black text-white" : ""}`}
                  onClick={() => handleGenreToggle(item.name)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
