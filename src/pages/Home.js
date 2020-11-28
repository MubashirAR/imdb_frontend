import React, { useEffect, useState } from "react";
import axios from "axios";


function Home(props) {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    getAllMovies();
  }, [page])
  useEffect(() => {
    if(searchVal.length >=3 || searchVal.length === 0)
    searchMovies();
  }, [searchVal])

  const getAllMovies = async () => {
    let {data: movies} = await axios.get(`/api/movies/all?page=${page}`)
    setMovies(movies)
  }
  const searchMovies = async () => {
    let {data: movies} = await axios.get(`/api/movies/search?page=${page}&query=${searchVal}`)
    setMovies(movies)
  }

  const changePage = jumpSize => {
    if(jumpSize < 0 && page == 1) return;
    if(jumpSize > 0 && movies.length < 10) return;
    setPage(page + jumpSize)
  }
  const searchChange = e => {
    const { value } = e.target;
    setSearchVal(value)
  }
  // const searchClear = e => {
  //   setSearchVal('')
  // }
  return (
    <div className="row">
      <div className="p-5 w-100">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon2">Search</span>
          </div>
          <input type="text" className="form-control" placeholder="Movie/Director Name" onChange={searchChange}/>
          {/* <div className="input-group-append" onChange={searchClear}>
            <span className="btn btn-outline-secondary" id="basic-addon2">Clear</span>
          </div>
          <div className="input-group-append" onClick={searchMovies}>
            <span className="btn btn-outline-secondary" id="basic-addon2">Search</span>
          </div> */}
        </div>
      </div>
      {movies.map(movie => (
          <div key={movie.id} className="col-sm-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{movie.name}</h5>
                <p className="card-text">{movie.director}</p>
                {movie.genres.map(genre => {
                  return <a className="badge badge-dark">{genre.name}</a>
                })}
                <br/>
                <a href="#" className="badge badge-primary">IMDB Score: {movie.imdb_score}</a>
              </div>
            </div>
          </div>
      ))}
      <div className="d-flex justify-content-center full-width w-100 p-3">
        {
          page > 1
          ?  <button className="btn btn-secondary mr-3" onClick={_ => changePage(-1)}>Prev</button>
          : null
        }
        page {page}
        {
          movies.length === 10
          ? <button className="btn btn-secondary ml-3" onClick={_ => changePage(1)}>Next</button>
          : null
        }
      </div>
    </div>
  );
}

export default Home;