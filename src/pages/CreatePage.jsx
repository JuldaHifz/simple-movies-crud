import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [summary, setSummary] = useState("");
  const [genres, setGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

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
          console.error("Error when fetching data", error);
          break;
        }
      }
      setAllGenres(fetchedGenres);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const isValid = title && director && summary && genres.length > 0;
    setIsFormValid(isValid);
  }, [title, director, summary, genres]);

  const handleGenreToggle = (genre) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const movieData = {
      title,
      director,
      summary,
      genre: genres,
    };

    try {
      const response = await fetch(
        "https://technical.test.talenavi.com/api/movie",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieData),
        }
      );
      console.log(response);
      if (response.ok) {
        return navigate(`/`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex gap-2 justify-between border-2 border-b-black px-5 py-2 ">
        <Link to="/">
          <button className=" text-lg border-2 border-black p-2">Back</button>
        </Link>
        <button
          type="submit"
          className={`text-lg border-2 border-black p-2 ${
            isFormValid ? "" : "opacity-30 cursor-not-allowed border-opacity-30"
          }`}
          onClick={handleSubmit}
        >
          S
        </button>
      </div>
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
    </div>
  );
};

export default CreatePage;
